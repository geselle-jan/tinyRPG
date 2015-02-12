var Health = function () {
    return this;
};

Health.prototype.create = function() {
	this.background = game.add.sprite(0, 0, 'healthbar');
    this.background.scale.setTo(4);
    this.background.fixedToCamera = true;
    this.background.cameraOffset.x = 32;
    this.background.cameraOffset.y = 32;
	this.background.visible = false;

    this.bmd = game.add.bitmapData(
        50,
        3
    );
    this.bmd.context.fillStyle = '#D04648';
    this.bmd.context.fillRect(
        0,
        0,
        50,
        3
    );

	this.bar = game.add.sprite(0, 0, this.bmd);
    this.bar.scale.setTo(4);
    this.bar.fixedToCamera = true;
    this.bar.cameraOffset.x = 92;
    this.bar.cameraOffset.y = 40;
	this.bar.visible = false;

    return this;
};

Health.prototype.update = function() {
	if (
		typeof game.state.states[game.state.current].girl == 'undefined'
		||
		typeof game.player == 'undefined'
		||
		typeof game.player.health == 'undefined'
	) {
		this.background.visible = false;
		this.bar.visible = false;
	} else {
		this.background.visible = true;
		this.bar.visible = true;
		this.bar.width = Math.ceil(game.player.health / 2) * 4;

	}

    return this;
};