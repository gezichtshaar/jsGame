Vector2 = function (_p) {
	var self = this;

	this.x = _p[0];
	this.y = _p[1];
	
	this.getLength = function () {
		return Math.sqrt(self.x*self.x + self.y*self.y);
	}
	this.getArray = function () {
		return [self.x, self.y];
	}
	this.getNormalize = function () {
		var vecLength = this.getLength()
		return [self.x/vecLength, self.y/vecLength];
	}
	this.setNormalize = function () {
		var vecLength = this.getLength();
		self.x /= vecLength;
		self.y /= vecLength;
	}
	this.getDot = function (v) {
		return [self.x*v.x, self.y*v.y];
	}
	this.setDot = function (v) {
		self.x *= v.x;
		self.y *= v.y;
	}
	this.getVectorAddition = function (v) {
		return [self.x+v.x, self.y+v.y];
	}
	this.setVectorAddition = function (v) {
		self.x += v.x;
		self.y += v.y;
	}
	this.getMultiply = function (n) {
		return [self.x*n, self.y];
	}
	this.setMultiply = function (n) {
		self.x *= n;
		self.y *= n;
	}
	this.getAddition = function (n) {
		return [self.x+n, self.y+n];
	}
	this.setAddition = function (n) {
		self.x += n;
		self.y += n;
	}
}

Matrix = new function () {
	var self = this;
}