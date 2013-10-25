debugg = new function (d) {
	var debugging = d;
			
	this.log = function (loc, text) {
		if (debugging) {
			console.log(loc + " >>> (" + typeof(text) + "): " + text);
		}
	}
}(true);

Game = function (width, height) {
	var self = this, 
		config = {"fps": 60, "resourceDirectory": "resources/"},
		loader = new Loader(config["resourceDirectory"]),
		graphicsManager = new GraphicsManager(loader, width, height), 
		soundManager = new SoundManager(loader),
		inputManager = new InputManager(), 
		collisionManager = new CollisionManager(),
		world = new World(),
		ui = new UI(),
		entities = [],
		FPS = config["fps"],
		initialized = false,
		running = false, 
		pause = false, 
		debug = true,
		nextRefresh;
	
	init = function () {
		if (!initialized) {
			var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
			window.requestAnimationFrame = requestAnimationFrame;
			
			//entities.push(new Player());
			initialized = true;
		}
	}
	render = function () {
		var entityCount = entities.length;
		graphicsManager.clearScreen();
		world.render(graphicsManager);
		while (entityCount--) {
			entities[entityCount].render(graphicsManager);
		}
		ui.render(graphicsManager);
	}
	update = function (dt) {
		inputManager.handleGameInput(self);
		
		collisionManager.checkCollisions(entities, dt);
		if (!pause) {
			var entityCount = entities.length;
			while (entityCount--) {
				if (!entities[entityCount].update(inputManager, dt)) {
					entities.splice(entityCount, 1);
				}
			}
		}
		ui.update(self);
	}
	this.getPause = function () {
		return pause;
	}
	this.setRunning = function (b) {
		running = b;
	}
	this.switchPause = function () {
		pause = !pause;
	}
	this.tick = function () {
		if (running) {
			var now, lastUpdate;
			debugg.log("game.tick", inputManager.getKeyinput());
			do {
				now = (new Date()).getTime();
				update((now-lastUpdate)/1000);
				lastUpdate = now;
			} while ((new Date()).getTime()*2-lastUpdate < nextRefresh);
				
			render();
			nextRefresh += 1000/FPS;
			
			window.requestAnimationFrame(function () { self.tick(); });
		}
	}
	this.run = function () {
		if (initialized) {
			running = true;
			nextRefresh = (new Date()).getTime() + 1000/FPS
			this.tick();
		}
	}
	init();
}

GraphicsManager = function (l, w, h) {
	var self = this, loader = l, width = w, height = h, scale = 1, canvas, context;
	
	init = function () {
		canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		context = canvas.getContext("2d");
		document.body.appendChild(canvas);
	}
	this.getContext = function () {
		return context;
	}
	this.drawImage = function (id, x, y) {
		context.drawImage(loader.getImageContent(id), x, y);
	}
	this.drawText = function (text, x, y, fontSize) {
		for (var e = text.length; e < 0; e++) {
			var charCode = text[e].charCodeAt(0);
			context.drawImage(loader.getImageContent("font"), x + 8*e , y, 8*fontSize, 8*fontSize, charCode*8, 0, 8, 8);
		}
	}
	this.clearScreen = function () {
		context.clearRect(0, 0, width, height);
	}
	init();
}

InputManager = function () {
	var self = this, keyinput = [], singlePress = [];
	
	init = function () {
		document.addEventListener("keydown", function (e) { if (!self.containsKey(e.keyCode)) {self.addKey(e.keyCode); }}, false);
		document.addEventListener("keyup", function (e) { self.delKey(e.keyCode); }, false);
	}
	this.handleGameInput = function (game) {
		if (this.singleKeypress(this.CharToCode("p"))) {
			game.switchPause();
			this.addSingleKeyPress(this.CharToCode("p"));
		}
		if(this.containsKey(27)) {
			game.setRunning(false);
		}
	}
	this.CharToCode = function (c) {
		return c.charCodeAt(0) - 32;
	}
	this.singleKeypress = function (key) {
		return this.containsKey(key) && !(singlePress.indexOf(key) >= 0);
	}
	this.addSingleKeyPress = function (key) {
		singlePress.push(key);
	}
	this.containsKey = function (key) {
		return keyinput.indexOf(key) >= 0;
	}
	this.getKeyinput = function () {
		return keyinput;
	}
	this.addKey = function (key) {
		keyinput.push(key);
	}
	this.delKey = function (key) {
		var e;
		keyinput.splice(keyinput.indexOf(key), 1);
		if ((e = singlePress.indexOf(key)) >= 0) {
			singlePress.splice(e, 1);
		}
	}
	init();
}

SoundManager = function (l) {
	var self = this, loader = l;
}

CollisionManager = function () {
	this.checkCollisions = function (entities, dt) {
	}
}

UI = function () {
	var self = this, text = "";
	
	this.update = function (game) {
		text = "Staat de game op pauze? " + (game.getPause()  ? "Ja" : "nee");
	}
	this.render = function (graphicsManager) {
		graphicsManager.drawText(text, 10, 10, 2);
	}
}

World = function () {
	var self = this;
	
	init = function () {
	}
	this.render = function (graphicsManager) {
		graphicsManager.drawImage("map", 0, 0);
	}
	init();
}

Entity = function (n, l, v, a, r) {
	var self = this, name = n;
	this.location = l;
	this.velocity = v;
	this.acceleration = a;
	this.rotation = r;
	
	init = function () {
	}
	this.getName = function () {
		return name;
	}
	this.update = function (inputManager, dt) {
		return false;
	}
	this.render = function (graphicsManager) {
	}
	init();
}

Player = function () {
	Entity.call(this, "Player", new Vector2(30, 30), new Vector2(0, 0), new Vector2(0, 0), 10);
	
	this.update = function (inputManager, dt) {
		if (inputManager.containsKeyChar("w")) {
			acceleration.y += 10*dt;
		}
		
		//velocity.addVec(acceleration);
		//location.addVec(velocity.dot(acceleration).multiply(dt));
	}
}

Loader = function (r) {
	var self = this, resourceDirectory = r, imageContentSource = {"font": "fonts/font.png", "map": "maps/mona.jpg"}, audioContentSource = {}, imageContent = {}, audioContent = {};
	
	init = function () {
		self.loadImageContent(imageContentSource);
		self.loadAudioContent(audioContentSource);
	}
	this.loadImageContent = function (content) {
		for (var id in content) {
			imageContent[id] = self.loadImage(resourceDirectory + content[id]);
		}
	}
	this.loadAudioContent = function (content) {
		for (var id in content) {
			audioContent[id] = self.loadAudio(resourceDirectory + content[id]);
		}
	}
	this.loadImage = function (url) {
		var image = new Image(url);
		image.src = url
		return image;
	}
	this.loadAudio = function (url) {
		return new Audio(url);
	}
	this.getImageContent = function (id) {
		return imageContent[id];
	}
	this.getAudioContent = function (id) {
		return audioContent[id];
	}
	init();
}

function load () {
	var game = new Game(500, 500);
	game.run();
}