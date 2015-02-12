var TextBox = function () {
    return this;
};

TextBox.prototype.create = function() {
	this.background = new Box({
        width: 224,
        height: 48,
        x: 32,
        y: game.camera.height - (48*4) - 32
	});

    this.text = game.add.bitmapText(0, 0, 'silkscreen', '', 32);
	this.text.fixedToCamera = true;
	this.text.cameraOffset.x = 56;
	this.text.cameraOffset.y = game.camera.height - 200;

	this.initalMode = game.mode;

	this.lastOpened = game.time.now;

	this.hide();

	game.input.onDown.add(function () {
		if (game.mode == 'dialog' && game.time.now - this.lastOpened > 100) {
			this.hide();
		}
	}, this);

    return this;
};

TextBox.prototype.update = function() {

    return this;
};

TextBox.prototype.hide = function() {
	this.background.visible = false;
	this.text.visible = false;

	game.mode = this.initalMode;

    return this;
};

TextBox.prototype.show = function(text) {
	if (typeof text != 'undefined') {
		this.text.setText(text);
	}
	this.lastOpened = game.time.now;
	this.background.visible = true;
	this.text.visible = true;

	game.mode = 'dialog';

    return this;
};

