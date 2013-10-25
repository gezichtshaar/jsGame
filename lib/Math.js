Vector2 = function (x, y) {
	this.x = x;
	this.y = y;
	
	this.normalize = function () {
		var vecLength = Math.sqrt(this.x * this.x + this.y * this.y);
		this.x /= vecLength;
		this.y /= vecLength;
	}
	this.dot = function (v) {
		this.x *= v.x;
		this.y *= v.y;
	}
	this.vecAdd = function (v) {
		this.x += v.x;
		this.y += v.y;
	}
	this.multiply = function (n) {
		this.x *= n;
		this.y *= n;
	}
	this.add = function (n) {
		this.x += n;
		this.y += n;
	}
}