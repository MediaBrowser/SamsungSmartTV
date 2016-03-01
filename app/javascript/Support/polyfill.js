if (!Array.prototype.find) {
	Array.prototype.find = function(predicate, thisArg) {
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}

		var lastVal;
		if (Array.prototype.some.call(this, function(val, index, arr) {
			return predicate.call(thisArg, lastVal = val, index, arr);
		})) {
			return lastVal;
		}
	}
}

if (!Array.prototype.findIndex) {
	Array.prototype.findIndex = function(predicate, thisArg) {
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}

		var lastIndex = -1;
		if (!Array.prototype.some.call(this, function(val, index, arr) {
			return predicate.call(thisArg, val, lastIndex = index, arr);
		})) {
			return -1;
		}
		return lastIndex;
	};
}
