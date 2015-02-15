Weapons.prototype.fireballs.blue.medium = {
    iconFrame: 260
};

Weapons.prototype.fireballs.blue.medium.create = function(weapons) {

    var that = this;

    this.damage = {
        primary: 2,
        secondary: 5
    };

    this.fireCooldown = game.time.now;

    this.bullets = weapons.makeBullets(300);

    this.bullets.forEach(function (bullet) {
        bullet.animations.add(
            'flameBlueMedium',
            [259,260,261,260],
            10,
            true
        );
        bullet.animations.play('flameBlueMedium');
        bullet.body.setSize(24,24,0,16);
        bullet.weapon = that;
    });

    return this;
};

Weapons.prototype.fireballs.blue.medium.activeUpdatePrimary = function (weapons) {
    this.player = game.state.states[game.state.current].girl.player;

    if (game.time.elapsedSince(this.fireCooldown) > 40 && this.bullets.countDead() > 0) {

        var bullet = this.bullets.getFirstDead();

        if (bullet) {
            bullet.reset(this.player.body.center.x, this.player.body.center.y - 16);

            var angle = game.physics.arcade.angleToPointer(bullet, game.input.activePointer),
                speed = 500;

            angle = angle + game.rnd.realInRange(-0.5 , 0.5);

            bullet.body.velocity.x = Math.cos(angle) * speed;
            bullet.body.velocity.y = Math.sin(angle) * speed;

            bullet.body.velocity.x = bullet.body.velocity.x + this.player.body.velocity.x;
            bullet.body.velocity.y = bullet.body.velocity.y + this.player.body.velocity.y;

            bullet.attack = 'primary';

            bullet.enemiesTouched = [];
        }

        this.fireCooldown = game.time.now;
    }

    return this;    
};

Weapons.prototype.fireballs.blue.medium.activeUpdateSecondary = function (weapons) {
    this.player = game.state.states[game.state.current].girl.player;

    if (game.time.elapsedSince(this.fireCooldown) > 500 && this.bullets.countDead() > 0) {

        var amount = 36,
            start = Math.PI * -1,
            step = Math.PI / amount * 2;

        for (var i = amount; i > 0; i--) {

            var bullet = this.bullets.getFirstDead();

            if (bullet) {
                bullet.reset(this.player.body.center.x, this.player.body.center.y - 16);

                var angle = start + (i * step),
                    speed = 500;

                bullet.body.velocity.x = Math.cos(angle) * speed;
                bullet.body.velocity.y = Math.sin(angle) * speed;

                bullet.body.velocity.x = bullet.body.velocity.x + this.player.body.velocity.x;
                bullet.body.velocity.y = bullet.body.velocity.y + this.player.body.velocity.y;
                
                bullet.attack = 'secondary';
            }

        }

        this.fireCooldown = game.time.now;
    }

    return this;    
};

Weapons.prototype.fireballs.blue.medium.passiveUpdate = function (weapons) {
    if (game.mode == 'level') {
        weapons.fireballs.unpauseProjectiles(this.bullets);
    }

    if (game.mode != 'level') {
        weapons.fireballs.pauseProjectiles(this.bullets);
    }

    return this;    
};

Weapons.prototype.fireballs.blue.medium.hit = function(shot, enemy) {
    enemy.hitTimeout = game.time.now;
    enemy.blendMode = PIXI.blendModes.ADD;
    if (shot.attack == 'primary') {
        if (shot.enemiesTouched.indexOf(enemy) == -1) {
            shot.enemiesTouched.push(enemy);
            enemy.damage(shot.weapon.damage.primary);
        }
    } else {
        enemy.damage(shot.weapon.damage.secondary);
    }
};

Weapons.prototype.fireballs.blue.medium.collide = function (collision) {
    game.physics.arcade.overlap(this.bullets, collision, function(shot) {
        shot.kill();
    });
    return this;
};

Weapons.prototype.fireballs.blue.medium.hitTest = function (enemies) {
    game.physics.arcade.overlap(this.bullets, enemies.group, this.hit);

    return this;
};