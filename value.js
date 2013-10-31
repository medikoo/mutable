'use strict';

var assign   = require('es5-ext/object/assign')
  , d        = require('d/d')
  , autoBind = require('d/auto-bind')
  , ee       = require('event-emitter/lib/core')
  , mark     = require('./_mark')
  , is       = require('./is')

  , defineProperty = Object.defineProperty
  , Observable;

module.exports = Observable = function (value) {
	if (!(this instanceof Observable)) return new Observable(value);
	if (is(value)) {
		defineProperty(this, '__link__', d(value));
		value.on('change', this._mutableListener);
		value = value.value;
	}
	defineProperty(this, '__value__', d('w', value));
};
mark(Object.defineProperties(ee(Observable.prototype), assign({
	__value__: d('', undefined),
	__link__: d('', undefined),
	value: d.gs('ec', function () { return this.__value__; }, function (nu) {
		var old = this.__value__, isOldObservable = this.hasOwnProperty('__link__');
		if (isOldObservable) {
			if (nu === this.__link__) return;
			this.__link__.off('change', this._mutableListener);
		}
		if (is(nu)) {
			if (isOldObservable) this.__link__ = nu;
			else defineProperty(this, '__link__', d(nu));
			nu.on('change', this._mutableListener);
			this.__value__ = nu = nu.value;
		} else {
			if (isOldObservable) delete this.__link__;
			this.__value__ = nu;
		}
		if (nu !== old) this.emit('change', nu, old);
	}),
	toString: d(function () { return String(this.__value__); })
}, autoBind({
	_mutableListener: d('', function (nu) {
		if (this.__value__ === nu) return;
		this.__value__ = nu;
		this.emit('change', nu);
	})
}))));