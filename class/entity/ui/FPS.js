var FPS = function () {
    return this;
};

FPS.prototype.create = function() {
    this.text = game.add.bitmapText(0, 0, 'silkscreen', '', 32);
    this.text.fixedToCamera = true;

    return this;
};

FPS.prototype.update = function() {
	if (game.time.fps != 60) {
		this.text.visible = true;
	    this.text.cameraOffset.x = game.camera.width - 32 - this.text.width;
	    this.text.cameraOffset.y = 32;
	    this.text.setText((game.time.fps || '--') + ' FPS');
	} else {
		this.text.visible = false;
	}

    return this;
};