var PauseMenu = function () {
    return this;
};

PauseMenu.prototype.create = function() {
	this.background = new Box({
        width: 73,
        height: 51,
        x: game.camera.width - (73*4) - 32,
        y: game.camera.height - (51*4) - 32
	});

    this.text = game.add.bitmapText(0, 0, 'silkscreen', 'Paused', 32);
	this.text.fixedToCamera = true;
	this.text.cameraOffset.x = 168 * 4;
	this.text.cameraOffset.y = game.camera.height - (51 * 4);

	this.initalMode = game.mode;

	this.lastOpened = game.time.now;

	this.hide();

	game.controls.esc.onDown.add(function () {
		if (game.mode == 'menu' && game.time.now - this.lastOpened > 100) {
			this.hide();
		} else if (game.mode == 'level') {
			this.show();
		}
	}, this);

    return this;
};

PauseMenu.prototype.update = function() {

    return this;
};

PauseMenu.prototype.hide = function() {
	this.background.visible = false;
	this.text.visible = false;

	game.mode = this.initalMode;

    return this;
};

PauseMenu.prototype.show = function() {
	this.lastOpened = game.time.now;
	this.background.visible = true;
	this.text.visible = true;

	game.mode = 'menu';

    return this;
};

