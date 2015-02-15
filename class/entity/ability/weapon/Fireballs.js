Weapons.prototype.fireballs = {};

Weapons.prototype.fireballs.create = function(weapons) {
	weapons.fireballs.orange.create(weapons);
	weapons.fireballs.blue.create(weapons);

    return this;
};

Weapons.prototype.fireballs.activeUpdatePrimary = function(weapons) {
    weapons.fireballs.orange.activeUpdatePrimary(weapons);
    weapons.fireballs.blue.activeUpdatePrimary(weapons);

    return this;
};

Weapons.prototype.fireballs.activeUpdateSecondary = function(weapons) {
    weapons.fireballs.orange.activeUpdateSecondary(weapons);
    weapons.fireballs.blue.activeUpdateSecondary(weapons);

    return this;
};

Weapons.prototype.fireballs.passiveUpdate = function(weapons) {
	weapons.fireballs.orange.passiveUpdate(weapons);
	weapons.fireballs.blue.passiveUpdate(weapons);

    return this;
};

Weapons.prototype.fireballs.pauseProjectiles = function(bullets) {
    bullets.forEach(function (bullet) {
        if (!bullet.animations.paused) {
            bullet.body.savedVelocity = {};
            bullet.body.savedVelocity.x = bullet.body.velocity.x;
            bullet.body.savedVelocity.y = bullet.body.velocity.y;

            bullet.body.velocity.x = 0;
            bullet.body.velocity.y = 0;

            bullet.animations.paused = true;
        }
    });

    return this;
};

Weapons.prototype.fireballs.unpauseProjectiles = function(bullets) {
    bullets.forEach(function (bullet) {
        if (bullet.animations.paused && bullet.body.savedVelocity) {
            bullet.body.velocity.x = bullet.body.savedVelocity.x;
            bullet.body.velocity.y = bullet.body.savedVelocity.y;
            bullet.body.savedVelocity = false;
            bullet.animations.paused = false;
        }
    });

    return this;
};

Weapons.prototype.fireballs.collide = function (collision) {
	this.orange.collide(collision);
	this.blue.collide(collision);

    return this;
};

Weapons.prototype.fireballs.hitTest = function (enemies) {
	this.orange.hitTest(enemies);
	this.blue.hitTest(enemies);

    return this;
};