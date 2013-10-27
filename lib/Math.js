$Math = new Object();
$Math.Vector2 = function (_x, _y) {
	this.x = _x;
	this.y = _y;
}
$Math.Vector2.prototype = {	
	constructor: this.Vector2,
	getLength: function () {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	},
	getArray: function () {
		return [this.x, this.y];
	},
	getNormalize: function () {
		var vecLength = this.getLength()
		return [this.x/vecLength, this.y/vecLength];
	},
	setNormalize: function () {
		var vecLength = this.getLength();
		this.x /= vecLength;
		this.y /= vecLength;
	},
	getDot: function (v) {
		return [this.x*v.x, this.y*v.y];
	},
	setDot: function (v) {
		this.x *= v.x;
		this.y *= v.y;
	},
	getVectorAddition: function (v) {
		return [this.x+v.x, this.y+v.y];
	},
	setVectorAddition: function (v) {
		this.x += v.x;
		this.y += v.y;
	},
	getMultiply: function (n) {
		return [this.x*n, this.y];
	},
	setMultiply : function (n) {
		this.x *= n;
		this.y *= n;
	},
	getAddition: function (n) {
		return [this.x+n, this.y+n];
	},
	setAddition: function (n) {
		this.x += n;
		this.y += n;
	},
	clone: function (n) {
		return new $Math.Vector2(this.x, this.y);
	}
}

$Math.Matrix = new function (_m) {
	this.matrix = _m;
}
$Math.Matrix.prototype = {
	constructor: $Math.Matrix,
	clone: function () {
		return new $Math.Matrix(this.matrix);
	}
}