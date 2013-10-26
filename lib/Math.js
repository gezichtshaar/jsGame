Vector2 = function (x, y) {
	var self = this;

	this.x = x;
	this.y = y;
	
	this.getNormalize = function () {
		var vecLength = Math.sqrt(this.x * this.x + this.y * this.y);
		return new Vector2(self.x/vecLength, self.y/vecLength);
	}
	this.setNormalize = function () {
		var vecLength = Math.sqrt(this.x * this.x + this.y * this.y);
		this.x /= vecLength;
		this.y /= vecLength;
	}
	this.getDot = function (v) {
		return new Vector2(self.x*v.x, self.y*v.y);
	}
	this.setDot = function (v) {
		this.x *= v.x;
		this.y *= v.y;
	}
	this.getVectorAddition = function (v) {
		return new Vector2(self.x+v.x, self.y+v.y);
	}
	this.setVectorAddition = function (v) {
		this.x += v.x;
		this.y += v.y;
	}
	this.setMultiply = function (n) {
		this.x *= n;
		this.y *= n;
	}
	this.getMultiply = function (n) {
		return new Vector2(self.x*n, self.y);
	}
	this.setAddition = function (n) {
		this.x += n;
		this.y += n;
	}
	this.getAddition = function (n) {
		return new Vector2(self.x+n, self.y+n);
	}
}