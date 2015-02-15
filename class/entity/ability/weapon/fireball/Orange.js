Weapons.prototype.fireballs.orange = {};

Weapons.prototype.fireballs.orange.create = function(weapons) {
	weapons.fireballs.orange.medium.create(weapons);

    return this;
};

Weapons.prototype.fireballs.orange.activeUpdatePrimary = function(weapons) {
	weapons.fireballs.orange.medium.activeUpdatePrimary(weapons);

    return this;
};

Weapons.prototype.fireballs.orange.activeUpdateSecondary = function(weapons) {
	weapons.fireballs.orange.medium.activeUpdateSecondary(weapons);

    return this;
};

Weapons.prototype.fireballs.orange.passiveUpdate = function(weapons) {
	weapons.fireballs.orange.medium.passiveUpdate(weapons);

    return this;
};

Weapons.prototype.fireballs.orange.collide = function (collision) {
	this.medium.collide(collision);

    return this;
};

Weapons.prototype.fireballs.orange.hitTest = function (enemies) {
	this.medium.hitTest(enemies);

    return this;
};