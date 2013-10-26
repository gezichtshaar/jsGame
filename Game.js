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
		entities = [],
		FPS = config["fps"],
		initialized = false,
		running = false, 
		pause = false, 
		debug = true,
		loader, graphicsManager, soundManager, inputManager, collisionManager, ui, world, nextRefresh;
	
	init = function (width, height) {
		if (!initialized) {
			var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
			window.requestAnimationFrame = requestAnimationFrame;

			loader = new Loader(config["resourceDirectory"]);
			graphicsManager = new GraphicsManager(loader, width, height);
			soundManager = new SoundManager(loader);
			inputManager = new InputManager();
			collisionManager = new CollisionManager();
			ui = new UI();
			world = new World();
			
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
	init(width, height);
}

GraphicsManager = function (l, w, h) {
	var self = this,
		scale = 1,
		loader, width, height, canvas, context;
	
	init = function (l, w, h) {
		loader = l;
		width = w;
		height = h;

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
	init(l, w, h);
}

InputManager = function () {
	var self = this,
		keyinput = [],
		singlePress = [];
	
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
	var self = this,
		loader;

	init = function (l) {
		loader = l;
	}
	init(l);
}

CollisionManager = function () {

	entityColliding = function (collider, collidee) {
		return false;
	}
	this.checkCollisions = function (entity, entities, dt) {
		if (entity.isActor() && entity.isCollidable()) {
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

Entity = function (n, ar, c, l, v, an, r) {
	var self = this,
		name, actor, collidable;

	this.location = l;
	this.velocity = v;
	this.acceleration = a;
	this.rotation = r;
	
	init = function (n, ar, c) {
		name = n;
		actor = ar;
		collidable = c;
	}
	this.isActor = function () {
		return actor;
	}
	this.isCollidable = function () {
		return collidable;
	}
	this.getName = function () {
		return name;
	}
	this.update = function (inputManager, dt) {
		return false;
	}
	this.render = function (graphicsManager) {
	}
	init(n, c);
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
	var self = this,
		imageContentSource = {"font": "fonts/font.png", "map": "maps/mona.jpg"},
		audioContentSource = {},
		imageContent = {},
		audioContent = {},
		resourceDirectory;
	
	init = function (r) {
		resourceDirectory = r;
		
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
	init(r);
}

function load () {
	var game = new Game(500, 500);
	game.run();
}