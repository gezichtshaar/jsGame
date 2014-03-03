GameManager = function (_location, _width, _height) {
	var location = _location,
		width = _width,
		height = _height,
		gamestate = new Array(),
		running = false,
		graphicsManager, inputManager;

	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

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
			requestAnimationFrame(tick);
		}
	}

	return {
		init: function () {
			graphicsManager = new GraphicsManager(width, height);
			location.appendChild(graphicsManager.canvas);

			inputManager = new InputManager(location);

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

	init = function () {
		canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		canvas.className = "gamescreen";

		context = canvas.getContext("2d");
		updateContext();
		window.addEventListener("resize", resizeCanvas);
	}
	updateCanvas = function () {
		canvas.width = width;
		canvas.height = height;
	}
	updateContext = function () {
		context.imageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
	}
	resizeCanvas = function (_event) {
		width = canvas.parentElement.clientWidth;
		height = canvas.parentElement.clientHeight;
		updateCanvas();
		updateContext();
	}

	init();
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
			var fontmap = " !\"#$%&'()*+,-./0123456789:;<=>?"+
			              "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_"+
			              "`abcdefghijklmnopqrstuvwxyz{|}~ ";

			for (var n = 0; n < text.length; n++) {
				character = fontmap.indexOf(text[n]);
				context.drawImage(Content["font"], (character % 32) * 4, (character >> 5) * 8, 4, 8, Math.floor(dx/100 * width) + n * 16, Math.floor(dy/100 * height), 16, 32);
			}
		}
	};
}

InputManager = function (_location) {
	var location = _location,
		keys = [],
		mouse = [];

	init = function () {
		location.addEventListener("keydown", onKeydown);
		location.addEventListener("keyup", onKeyup);
		location.addEventListener("mousedown", onMousedown);
		location.addEventListener("mouseup", onMouseup);
	}

	init();
	return {
		keyPress: function (key) {
			return false;
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
		buttons.push(new Button("Options", 50, 55, startGame));
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

Button = function (_text, _left, _top, _callback) {
	var text = _text,
		top = _top,
		left = _left,
		callback = _callback,
		selected = false;

	return {
		update: function (input, dt) {
			if (input.keyPress("a")) {
				callback();
			} else if (input.keyPress("d")) {
				selected = !selected;
			}
		},
		render: function (graphics) {
			graphics.drawText(text, (selected ? left + 5: left), top);
		}
	}
}

Content = (function () {
	var images = {"header": "resources/images/header.png",
				  "font": "resources/fonts/font.png"},
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
	var gameManager = new GameManager(document.body, document.body.clientWidth, document.body.clientHeight);
	gameManager.init();
});