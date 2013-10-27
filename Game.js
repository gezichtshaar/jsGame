debugg = new function (d) {
	var debugging = d;
			
	this.log = function (loc, text) {
		if (debugging) {
			console.log(loc + " >>> (" + typeof(text) + "): " + text);
		}
	}
}(true);

Game = function (_width, _height) {
	var self = this, 
		config = {"fps": 60, "debug": true, "resourceDirectory": "resources/"},
		entities = [],
		initialized = false,
		running = false,
		pause = false,
		loader, graphicsManager, soundManager, inputManager, collisionManager, ui, world, framesPerSecond, debug, nextRefresh;
	
	init = function (_width, _height) {
		if (!initialized) {
			requestFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

			loader = new Loader(config["resourceDirectory"]);
			graphicsManager = new GraphicsManager(loader, _width, _height);
			soundManager = new SoundManager(loader);
			inputManager = new InputManager();
			collisionManager = new CollisionManager();
			ui = new UI();
			world = new World();

			framesPerSecond = config["fps"];
			debug = config["debug"];
			
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
		if (!pause) {
			var entityCount = entities.length;
			while (entityCount--) {
				collisionManager.checkCollisions(entities[entityCount], entities, dt);
				if (!entities[entityCount].update(inputManager, dt)) {
					entities.splice(entityCount, 1);
				}
			}
		}
		ui.update(self);
	}
	requestFrame = function (a) {}
	this.getPause = function () {
		return pause;
	}
	this.switchRunning = function () {
		running = !running;
	}
	this.switchPause = function () {
		pause = !pause;
	}
	this.tick = function () {
		if (running) {
			var now, lastUpdate;
			do {
				now = Date.now();
				update((now-lastUpdate)/1000);
				lastUpdate = now;
			} while (Date.now()*2-lastUpdate < nextRefresh);
				
			render();
			nextRefresh += 1000/framesPerSecond;
			
			requestFrame(self.tick);
		}
	}
	this.run = function () {
		if (initialized) {
			running = true;
			nextRefresh = Date.now() + 1000/framesPerSecond;
			this.tick();
		}
	}
	init(_width, _height);
}

GraphicsManager = function (_loader, _width, _height) {
	var self = this,
		scale = 1,
		loader, width, height, canvas, context;
	
	init = function (_loader, _width, _height) {
		loader = _loader;
		width = _width;
		height = _height;

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
		//context.drawImage(loader.getImageContent(id), x, y);
	}
	this.drawText = function (_text, x, y, fontSize) {
		 var charList = "0123456789abcdefghijklmnopqrstuwvxyz?. ",
		 	text = _text.toLowerCase(),
		 	textLength = text.length;

		for (var e = 0; e < textLength; e++) {
			var charCode = charList.indexOf(text[e]);
			context.drawImage(loader.getImageContent("font"), x + 8*e , y, 8, 8, 8*e, 0, 8, 8);
		}
	}
	this.clearScreen = function () {
		context.clearRect(0, 0, width, height);
	}
	init(_loader, _width, _height);
}

InputManager = function () {
	var self = this,
		keyinput = [],
		singlePress = [];
	
	init = function () {
		document.addEventListener("keydown", keydown, false);
		document.addEventListener("keyup", keyup, false);
	}
	keydown = function (e) {
		if (!self.containsKey(e.keyCode)) {
			self.addKey(e.keyCode);
		}
	}
	keyup = function (e) {
		self.delKey(e.keyCode);
	}
	this.handleGameInput = function (game) {
		if (this.singleKeypress(this.CharToCode("p"))) {
			game.switchPause();
			this.addSingleKeyPress(this.CharToCode("p"));
		}
		if(this.containsKey(27)) {
			game.switchRunning();
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

SoundManager = function (_loader) {
	var self = this,
		loader;

	init = function (_loader) {
		loader = _loader;
	}
	init(_loader);
}

CollisionManager = function () {

	entityColliding = function (collider, collidee) {
		return false;
	}
	this.checkCollisions = function (entity, entities, dt) {
		if (entity.isActor && entity.isCollidable) {
			var entitiesLength = entities.length;
			while (entities--) {
				if (entityColliding(entity, entities[entitiesLength])) {
					entities[entitiesLength].entityCollide(entity);
				}
			}
		}
	}
}

UI = function () {
	var self = this,
		text = "";
	
	init = function () {
	}
	this.update = function (game) {
		text = "Is the game paused? " + (game.getPause()  ? "Yes." : "No.");
	}
	this.render = function (graphicsManager) {
		graphicsManager.drawText(text, 10, 10, 1);
	}
	init();
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

Entity = function (_name, _actor, _collidable, _location, _velocity, _acceleration, _rotation) {
	var self = this;

	this.name = name;
	this.isActor = _actor;
	this.isCollidable = _collidable;
	this.location = _location;
	this.velocity = _velocity;
	this.acceleration = _acceleration;
	this.rotation = _rotation;
	
	this.update = function (inputManager, dt) {
		return false;
	}
	this.render = function (graphicsManager) {
	}
}

Player = function () {
	Entity.call(this, "Player", false, false, new $Math.Vector2(30, 30), new $Math.Vector2(0, 0), new $Math.Vector2(0, 0), 10);
	
	this.update = function (inputManager, dt) {
		if (inputManager.containsKeyChar("w")) {
			acceleration.y += 10*dt;
		}
		
		//velocity.addVec(acceleration);
		//location.addVec(velocity.dot(acceleration).multiply(dt));
	}
}

Loader = function (_resourceDirectory) {
	var self = this,
		imageContentSource = {"font": "fonts/font.png", "map": "maps/map_001.png"},
		audioContentSource = {},
		imageContent = {},
		audioContent = {},
		resourceDirectory;
	
	init = function (_resourceDirectory) {
		resourceDirectory = _resourceDirectory;
		
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
	init(_resourceDirectory);
}

function load () {
	var game = new Game(500, 500);
	game.run();
}