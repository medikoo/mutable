'use strict';

var validFunction     = require('es5-ext/function/valid-function')
  , d                 = require('d/d')
  , memoize           = require('memoizee/lib/regular')
  , isObservableValue = require('./is-observable-value')

  , create = Object.create
  , getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

module.exports = memoize(function (Constructor) {
	var ReadOnly, valueDesc;

	validFunction(Constructor);
	if (!isObservableValue(new Constructor())) {
		throw new TypeError(Constructor + " is not observable value constructor");
	}
	ReadOnly = function (value) {
		if (!(this instanceof ReadOnly)) return new ReadOnly(value);
		Constructor.apply(this, arguments);
	};

	valueDesc = getOwnPropertyDescriptor(Constructor.prototype, 'value');
	ReadOnly.prototype = create(Constructor.prototype, {
		constructor: d(ReadOnly),
		value: d.gs(valueDesc.get),
		_setValue: d(valueDesc.set)
	});

	return ReadOnly;
});