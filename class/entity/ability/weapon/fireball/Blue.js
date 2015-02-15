Weapons.prototype.fireballs.blue = {};

Weapons.prototype.fireballs.blue.create = function(weapons) {
	weapons.fireballs.blue.medium.create(weapons);

    return this;
};

Weapons.prototype.fireballs.blue.activeUpdatePrimary = function(weapons) {
	weapons.fireballs.blue.medium.activeUpdatePrimary(weapons);

    return this;
};

Weapons.prototype.fireballs.blue.activeUpdateSecondary = function(weapons) {
	weapons.fireballs.blue.medium.activeUpdateSecondary(weapons);

    return this;
};

Weapons.prototype.fireballs.blue.passiveUpdate = function(weapons) {
	weapons.fireballs.blue.medium.passiveUpdate(weapons);

    return this;
};

Weapons.prototype.fireballs.blue.collide = function (collision) {
	this.medium.collide(collision);

    return this;
};

Weapons.prototype.fireballs.blue.hitTest = function (enemies) {
	this.medium.hitTest(enemies);

    return this;
};