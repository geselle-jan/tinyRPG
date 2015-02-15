var StatusInfo = function () {
    return this;
};

StatusInfo.prototype.create = function() {
	this.background = game.add.sprite(0, 0, 'statusinfo');
    this.background.scale.setTo(4);
    this.background.fixedToCamera = true;
    this.background.cameraOffset.x = 0;
    this.background.cameraOffset.y = game.camera.height - this.background.height;
	this.background.visible = false;

    this.makeBar('health', '#D04648', 39, 155);
    this.makeBar('mana', '#597DCE', 111, 155);
	this.makeBar('xp', '#6CAA2C', 183, 155);

    this.currentWeapon = game.add.sprite(0, 0, 'tiny16');
    this.currentWeapon.fixedToCamera = true;
    this.currentWeapon.cameraOffset.x = 2 * 4;
    this.currentWeapon.cameraOffset.y = 142 * 4;
    this.currentWeapon.visible = false;

    return this;
};

StatusInfo.prototype.update = function() {
	if (
		typeof game.state.states[game.state.current].girl == 'undefined'
		||
		typeof game.player == 'undefined'
		||
		typeof game.player.health == 'undefined'
	) {
		this.background.visible = false;
        this.healthbar.visible = false;
        this.manabar.visible = false;
        this.xpbar.visible = false;
        this.currentWeapon.visible = false;
	} else {
		this.background.visible = true;
        this.healthbar.visible = true;
        this.manabar.visible = true;
        this.xpbar.visible = true;
        this.currentWeapon.visible = true;

        this.healthbar.width = Math.ceil(game.player.health / 2) * 4;
        this.manabar.width = Math.ceil(game.player.mana / 2) * 4;
        this.xpbar.width = Math.ceil(game.player.xp / 2) * 4;

        this.currentWeapon.frame = game.player.activeWeapon.iconFrame;
	}

    return this;
};

StatusInfo.prototype.makeBar = function(name, color, x, y) {
    this['bmd'+name] = game.add.bitmapData(
        50,
        3
    );
    this['bmd'+name].context.fillStyle = color;
    this['bmd'+name].context.fillRect(
        0,
        0,
        50,
        3
    );

    this[name+'bar'] = game.add.sprite(0, 0, this['bmd'+name]);
    this[name+'bar'].scale.setTo(4);
    this[name+'bar'].fixedToCamera = true;
    this[name+'bar'].cameraOffset.x = x * 4;
    this[name+'bar'].cameraOffset.y = y * 4;
    this[name+'bar'].visible = false;

    return this;
};