var Weapons = function () {
    if (typeof game.player == 'undefined') {
        game.player = {};
    }
    if (typeof game.player.activeWeapon == 'undefined') {
        game.player.activeWeapon = this.fireballs.orange.medium;
    }

    this.aquired = [
        this.fireballs.orange.medium,
        this.fireballs.blue.medium
    ];

    return this;
};

Weapons.prototype.create = function() {
	this.fireballs.create(this);

    game.controls.e.onDown.add(function () {
        this.next();
    }, this);

    return this;
};

Weapons.prototype.update = function() {
    if (game.state.current != 'Town' && game.mode == 'level') {

		if (game.controls.primary) {
    		game.player.activeWeapon.activeUpdatePrimary(this);
    	}

		if (game.controls.secondary) {
    		game.player.activeWeapon.activeUpdateSecondary(this);
    	}
    }

	this.fireballs.passiveUpdate(this);

    return this;
};

Weapons.prototype.makeBullets = function (amount) {
	var bullets;
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(amount, 'tiny16');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    return bullets;
};

Weapons.prototype.collide = function (collision) {
	this.fireballs.collide(collision);

    return this;
};

Weapons.prototype.hitTest = function (enemies) {
	this.fireballs.hitTest(enemies);

    return this;
};

Weapons.prototype.next = function() {
    var currentIndex = this.aquired.indexOf(game.player.activeWeapon),
        maxIndex = this.aquired.length - 1,
        nextIndex = currentIndex + 1;

    if (nextIndex > maxIndex) {
        nextIndex = 0;
    }

    game.player.activeWeapon = this.aquired[nextIndex];

    return this;
};
















