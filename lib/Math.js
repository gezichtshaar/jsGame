Vector2 = function (_p) {
	this.x = _p[0];
	this.y = _p[1];
}

Vector2.prototype = {	
	constructor: Vector2,
	this.getLength: function () {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	},
	this.getArray: function () {
		return [this.x, this.y];
	},
	this.getNormalize: function () {
		var vecLength = this.getLength()
		return [this.x/vecLength, this.y/vecLength];
	},
	this.setNormalize: function () {
		var vecLength = this.getLength();
		this.x /= vecLength;
		this.y /= vecLength;
	},
	this.getDot: function (v) {
		return [this.x*v.x, this.y*v.y];
	},
	this.setDot: function (v) {
		this.x *= v.x;
		this.y *= v.y;
	},
	this.getVectorAddition: function (v) {
		return [this.x+v.x, this.y+v.y];
	},
	this.setVectorAddition: function (v) {
		this.x += v.x;
		this.y += v.y;
	},
	this.getMultiply: function (n) {
		return [this.x*n, this.y];
	},
	this.setMultiply : function (n) {
		this.x *= n;
		this.y *= n;
	},
	this.getAddition: function (n) {
		return [this.x+n, this.y+n];
	},
	this.setAddition: function (n) {
		this.x += n;
		this.y += n;
	}
}

Matrix = new function () {
	var self = this;
}