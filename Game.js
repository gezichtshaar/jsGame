GameManager = function (_location, _width, _height) {
	var location = _location,
		width = _width,
		height = _height,
		gamestate = new Array(),
		running = false,
		graphicsManager, inputManager;

	function render () {
		graphicsManager.clear();
		gamestate[gamestate.length - 1].render(graphicsManager);
	}

	function update (dt) {
		gamestate[gamestate.length - 1].update(inputManager, dt)
	}

	function tick () {
		if (running) {
			render();
			update(1);
		}
	}

	return {
		init: function () {
			graphicsManager = new GraphicsManager(width, height);
			location.appendChild(graphicsManager.canvas);

			inputManager = new InputManager();

			gamestate.push(new MenuScreen());

			running = true;
			tick();
		}
	};
}

GraphicsManager = function (_width, _height) {
	var width = _width,
		height = _height,
		canvas, context;

	canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	context = canvas.getContext("2d");

	return {
		canvas: canvas,
		context: context,
		clear: function () {
			context.fillStyle = "black";
			context.fillRect(0, 0, width, height)
		},
		drawImage: function (image, dx, dy) {
			context.drawImage(Content[image], dx/100 * width, dy/100 * height);
		},
		drawText: function (text, dx, dy) {
			
		}
	};
}

InputManager = function () {
	return {
		keyPress: function (key) {
			return true;
		}
	};
}

GameState = function () {
	return {
		update: function (input, dt) {},
		render: function (graphics) {}
	};
}

MenuScreen = function () {
	var state = GameState(),
		buttons = new Array();

	init = function () {
		buttons.push(new Button("Start", 50, 50, startGame));
		buttons.push(new Button("bam", 50, 60, startGame));
	}
	startGame = function () {
		console.log("start");
	}

	state.render = function (graphics) {
		graphics.drawImage("header", 20, 20);
		for (var n = 0; n < buttons.length; n++) {
			buttons[n].render(graphics);
		}
	}
	state.update = function (input, dt) {
		for (var n = 0; n < buttons.length; n++) {
			buttons[n].update(input, dt);
		}
	}
	init();
	return state;
}

Button = function (_text, _top, _left, _callback) {
	var text = _text,
		top = _top,
		left = _left,
		callback = _callback;

	return {
		update: function (input, dt) {
			if (input.keyPress("a")) {
				callback();
			}
		},
		render: function (graphics) {
			graphics.drawImage("button1", top, left);
		}
	}
}

Content = (function () {
	var images = {"header": "resources/images/header.png",
				  "button1": "resources/images/button1.png",
				  "button2": "resources/images/button2.png"},
		content = {};

	addImages = function (resources) {
		var keys = Object.keys(resources),
			image;

		for(var n = 0; n < keys.length; n++) {
			image = new Image();
			image.src = resources[keys[n]];
			content[keys[n]] = image;
		}
	}

	init = function () {
		addImages(images);
	}

	init();
	return content;
})();

Game = function () {
	var state = GameState(),
		entities;

	return state;
}

loader.push(function() {
	var gameManager = new GameManager(document.body, 500, 500);
	gameManager.init();
});