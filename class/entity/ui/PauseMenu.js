var PauseMenu = function () {
	this.entries = [
		{
			name: 'Character'
		},
		{
			name: 'Save'
		},
		{
			name: 'Quit'
		}
	]

    return this;
};

PauseMenu.prototype.create = function() {
	this.boxHeight = 10 + this.entries.length - 1 + (this.entries.length * 13);

	this.background = new Box({
        width: 73,
        height: this.boxHeight,
        x: game.camera.width - (73*4) - 32,
        y: game.camera.height - (this.boxHeight*4) - 32
	});

	this.texts 		= [];
	this.clickables = [];

	for (var i = this.entries.length - 1; i >= 0; i--) {
		this.texts[i] = game.add.bitmapText(0, 0, 'silkscreen', this.entries[i].name, 32);
		this.texts[i].fixedToCamera = true;
		this.texts[i].cameraOffset.x = 167 * 4;
		this.texts[i].cameraOffset.y = game.camera.height - (10 * 4) - ((this.entries.length - i) * (4*14));

		this.clickables[i] = game.add.sprite(0, 0, 'menuclickable');
		this.clickables[i].fixedToCamera = true;
		this.clickables[i].scale.setTo(4);
		this.clickables[i].cameraOffset.x = 164 * 4;
		this.clickables[i].cameraOffset.y = game.camera.height - (12 * 4) - ((this.entries.length - i) * (4*14));
		this.entries[i].index = i;
		this.clickables[i].data = this.entries[i];
		this.clickables[i].inputEnabled = true;

		this.clickables[i].events.onInputOver.add(function () {
			var that = game.ui.pauseMenu,
				active = that.activeIndicator,
				index = this.data.index;
			active.visible = true;
			active.cameraOffset.x = 157 * 4;
			active.cameraOffset.y = that.clickables[index].cameraOffset.y + (3 * 4);
		}, this.clickables[i]);

		this.clickables[i].events.onInputOut.add(function () {
			var that = game.ui.pauseMenu,
				active = that.activeIndicator;
			active.visible = false;
		}, this.clickables[i]);

		this.clickables[i].events.onInputDown.add(function () {
			alert(this.data.name);
		}, this.clickables[i]);

		console.log(this.clickables[i]);
	}

	this.activeIndicator = game.add.sprite(0, 0, 'boxborderactive');
	this.activeIndicator.fixedToCamera = true;
	this.activeIndicator.scale.setTo(4);
	this.activeIndicator.cameraOffset.x = 0;
	this.activeIndicator.cameraOffset.y = 0;
	this.activeIndicator.visible = false;

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

	this.activeIndicator.visible = false;

	for (var i = this.texts.length - 1; i >= 0; i--) {
		this.texts[i].visible = false;
		this.clickables[i].visible = false;
	}

	game.mode = this.initalMode;

    return this;
};

PauseMenu.prototype.show = function() {
	this.lastOpened = game.time.now;
	this.background.visible = true;

	for (var i = this.texts.length - 1; i >= 0; i--) {
		this.texts[i].visible = true;
		this.clickables[i].visible = true;
		if (
			this.clickables[i].input.checkPointerOver(
				game.input.activePointer
			)
		) {
			this.clickables[i].events.onInputOver.dispatch();
		}
	}

	game.mode = 'menu';

    return this;
};

