var pixelDensityTest = function () {
	console.log("hello");

	var root = this;

	console.log(window.devicePixelRatio);

	root.ratio = window.innerWidth / 640;

	console.log(root.ratio);

	root.ctx = Sketch.create({
		container: document.querySelector(".canvas-hodler"), 
		fullscreen: false,
		width: window.innerWidth,
		height: window.innerHeight,
		retina: window.devicePixelRatio > 1 ? true : false
	});

	root.ctx.imageSmoothingEnabled = true;
	// root.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

	root.like = new LIKE({
		asset: preloaded.orange, 
		ctx: root.ctx,
		width: 100 * root.ratio,
		height: 100 * root.ratio,
	});

	root.ctx.draw = function () {
		root.like.draw();
		root.fallingAssets.forEach(function (asset) {
			asset.draw();
		});
	}
	root.ctx.update = function () {
  		if (root.like.pos.x < 0) root.like.pos.x = 0;
  		if (root.like.pos.x > window.innerWidth - root.like.width) root.like.pos.x = window.innerWidth - root.like.width;
		
		root.like.update();
		root.fallingAssets.forEach(function (asset) {
			asset.update();
		});
	}

	window.addEventListener('deviceorientation', function(event) {
  		root.like.pos.x += event.gamma;
	});

	document.addEventListener("keydown", function (event) {
	    event = event || window.event;

	    switch(event.which || event.keyCode) {
	        case 37: // left
	        TweenMax.to(root.like.pos, 1, {x: "-=" + (50 * root.ratio)});
	        break;

	        case 39: // right
	        TweenMax.to(root.like.pos, 1, {x: "+=" + (50 * root.ratio)});
	        break;
	    }
	});

	root.ctx.mousedown = function (e) {

		var x = e.x || e.touches[0].x;

		TweenMax.to(root.like.pos, 1, {x: x});
	};

	root.fallingAssets = [];

	function generateFallingAsset (options) {
		root.fallingAssets.push(new LIKE({
			asset: preloaded.green, 
			ctx: root.ctx, 
			speed: options.speed * root.ratio, 
			x: options.x, 
			width: 50 * root.ratio,
			height: 50 * root.ratio
		}));
	}

	function postponeGeneration (i) {
		setTimeout(function () {
			generateFallingAsset({speed: i / 10 + 1, x: Math.random() * window.innerWidth});
		}, 1000 * i * (2 - i/100));
	}

	for (var i = 0; i < 100; i++) {
		postponeGeneration (i);
	}
}



var LIKE = function (options) {
	this.pos = {
		x: options.x || 0,
		y: 0
	};
	this.speed = options.speed || 0;
	this.width = options.width || 100;
	this.height = options.height || 100;
	this.asset = options.asset;
	this.ctx = options.ctx;
}

LIKE.prototype = {
	draw: function () {
		if (this.pos.y < window.innerHeight) this.ctx.drawImage( this.asset , this.pos.x , this.pos.y, this.width , this.height );
	},
	update: function () {
		this.pos.y += this.speed;
	}
}