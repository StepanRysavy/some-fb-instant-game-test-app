var pixelDensityTest = function () {
	console.log("hello");

	var root = this;

	root.ctx = Sketch.create({
		container: document.querySelector(".canvas-hodler"), 
		fullscreen: false,
		width: window.innerWidth,
		height: window.innerHeight
	});

	root.like = new LIKE({asset: preloaded.love, ctx: root.ctx});

	root.ctx.draw = function () {
		root.like.draw();
	}
	root.ctx.update = function () {
  		if (root.like.pos.x < 0) root.like.pos.x = 0;
  		if (root.like.pos.x > window.innerWidth - root.like.width) root.like.pos.x = window.innerWidth - root.like.width;
		
		root.like.update();
	}

	window.addEventListener('deviceorientation', function(event) {
  		root.like.pos.x += event.gamma;
	});

	document.addEventListener("keydown", function (event) {
	    event = event || window.event;

	    switch(event.which || event.keyCode) {
	        case 37: // left
	        TweenMax.to(root.like.pos, 1, {x: "+=50"});
	        break;

	        case 39: // right
	        TweenMax.to(root.like.pos, 1, {x: "-=50"});
	        break;
	    }
	});

	root.ctx.mousedown = function (e) {
		TweenMax.to(root.like.pos, 1, {x: e.touches[0].x});
	};
}

var LIKE = function (options) {
	this.pos = {
		x: 0,
		y: 0
	};
	this.width = options.width || 100;
	this.height = options.height || 100;
	this.asset = options.asset;
	this.ctx = options.ctx;
}

LIKE.prototype = {
	draw: function () {
		this.ctx.drawImage( this.asset , this.pos.x , this.pos.y, this.width , this.height );
	},
	update: function () {

	}
}