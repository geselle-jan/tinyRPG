Weapons.prototype.fireballs.orange.medium = {
    iconFrame: 257
};

Weapons.prototype.fireballs.orange.medium.create = function(weapons) {

    var that = this;

    this.damage = {
        primary: 10,
        secondary: 20
    };

    this.fireCooldown = game.time.now;

    this.bullets = weapons.makeBullets(50);

    this.bullets.forEach(function (bullet) {
        bullet.animations.add(
            'flameOrangeMedium',
            [256,257,258,257],
            10,
            true
        );
        bullet.animations.play('flameOrangeMedium');
        bullet.body.setSize(24,24,0,16);
        bullet.weapon = that;
    });

    return this;
};

Weapons.prototype.fireballs.orange.medium.activeUpdatePrimary = function (weapons) {
    this.player = game.state.states[game.state.current].girl.player;

    if (game.time.elapsedSince(this.fireCooldown) > 500 && this.bullets.countDead() > 0) {

        var bullet = this.bullets.getFirstDead();
        bullet.reset(this.player.body.center.x, this.player.body.center.y - 16);
        game.physics.arcade.moveToPointer(bullet, 300);

        bullet.body.velocity.x = bullet.body.velocity.x + this.player.body.velocity.x;
        bullet.body.velocity.y = bullet.body.velocity.y + this.player.body.velocity.y;

        bullet.attack = 'primary';

        this.fireCooldown = game.time.now;
    }

    return this;    
};

Weapons.prototype.fireballs.orange.medium.activeUpdateSecondary = function (weapons) {
    this.player = game.state.states[game.state.current].girl.player;

    if (game.time.elapsedSince(this.fireCooldown) > 500 && this.bullets.countDead() > 0) {

        for (var i = 0; i < 5; i++) {
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.player.body.center.x, this.player.body.center.y - 16);
            game.physics.arcade.moveToPointer(bullet, 200 + (i * 100));

            bullet.body.velocity.x = bullet.body.velocity.x + this.player.body.velocity.x;
            bullet.body.velocity.y = bullet.body.velocity.y + this.player.body.velocity.y;

            bullet.attack = 'secondary';
        }

        this.fireCooldown = game.time.now;
    }

    return this;    
};

Weapons.prototype.fireballs.orange.medium.passiveUpdate = function (weapons) {
    if (game.mode == 'level') {
        weapons.fireballs.unpauseProjectiles(this.bullets);
    }

    if (game.mode != 'level') {
        weapons.fireballs.pauseProjectiles(this.bullets);
    }

    return this;    
};

Weapons.prototype.fireballs.orange.medium.hit = function(shot, enemy) {
    shot.kill();
    enemy.hitTimeout = game.time.now;
    enemy.blendMode = PIXI.blendModes.ADD;
    enemy.damage(shot.weapon.damage[shot.attack]);
    enemy.damage(shot.weapon.damage.secondary);
};

Weapons.prototype.fireballs.orange.medium.collide = function (collision) {
    game.physics.arcade.overlap(this.bullets, collision, function(shot) {
        shot.kill();
    });
    return this;
};

Weapons.prototype.fireballs.orange.medium.hitTest = function (enemies) {
    game.physics.arcade.overlap(this.bullets, enemies.group, this.hit);

    return this;
};