var Girl = function () {

    return this;    
};

Girl.prototype.create = function() {

    this.scale = 4;
    this.fireCooldown = game.time.now;

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

    this.bullets.createMultiple(50, 'tiny16');
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);

    for (var i = this.bullets.children.length - 1; i >= 0; i--) {
        this.bullets.children[i].animations.add(
            'flameOrangeMedium',
            [256,257,258,257],
            10,
            true
        );
        this.bullets.children[i].animations.play('flameOrangeMedium');
        this.bullets.children[i].body.setSize(24,24,0,16);
    }



    this.player = game.add.sprite(2*64, 2*64,'tiny16');
    if (typeof game.player == 'undefined') {
        game.player = {};
    }
    if (typeof game.player.health == 'undefined') {
        game.player.health = 100;
    }
    game.physics.enable(this.player);
    this.player.anchor.set(1);
    this.player.body.setSize(32,32,-16,0);
    this.player.body.x = 2 * 64;
    this.player.body.y = 2 * 64;
    this.player.body.collideWorldBounds = true;
    this.player.hitTimeout = false;
    this.player.facing = {
        up: false,
        down: true,
        left: false,
        right: false
    };

    this.player.walking = {
        up: false,
        down: false,
        left: false,
        right: false,
        any: false
    };

    var walkFPS = 4;

    this.player.animations.add(
        'standDown',
        [131],
        0,
        false
    );

    this.player.animations.add(
        'walkDown',
        [132,133],
        walkFPS,
        true
    );

    this.player.animations.add(
        'standLeft',
        [147],
        0,
        false
    );

    this.player.animations.add(
        'walkLeft',
        [148,149],
        walkFPS,
        true
    );

    this.player.animations.add(
        'standRight',
        [163],
        0,
        false
    );

    this.player.animations.add(
        'walkRight',
        [164,165],
        walkFPS,
        true
    );

    this.player.animations.add(
        'standUp',
        [179],
        0,
        false
    );

    this.player.animations.add(
        'walkUp',
        [180,181],
        walkFPS,
        true
    );

    this.player.animations.play('standDown');

    this.playerPlaced = false;

    if (game.state.current == 'Town') {
        this.player.position.setTo(34 * 64, 33 * 64);
    } else {
        var randX,
            randY,
            desiredIndex = 105;

        while (!this.playerPlaced) {
            randX = Helpers.GetRandom(0,map.width-1);
            randY = Helpers.GetRandom(0,map.height-1);
            console.log(randX,randY);
            if (map.getTile(randX,randY) && map.getTile(randX,randY).index == desiredIndex) {
                this.playerPlaced = true;
                this.player.position.setTo(randX * map.tileWidth + map.tileWidth, randY * map.tileHeight + map.tileHeight);
                console.log(this.player.position);
            }
        }
    }

    this.playerPlaced = false;

    game.camera.follow(this.player);
    game.camera.roundPx = false;

    var that = this;

    game.controls.cursors.up.onDown.add(function () {
        if (game.mode == 'level') {
            if (!that.player.walking.any) {
                that.player.facing.up = false;
                that.player.facing.down = false;
                that.player.facing.left = false;
                that.player.facing.right = false;
            }
            that.player.facing.up = true;
            that.player.walking.up = true;
            that.player.walking.any = true;
            that.player.animations.play('standUp');
        }

    });

    game.controls.cursors.down.onDown.add(function () {
        if (game.mode == 'level') {
            if (!that.player.walking.any) {
                that.player.facing.up = false;
                that.player.facing.down = false;
                that.player.facing.left = false;
                that.player.facing.right = false;
            }
            that.player.facing.down = true;
            that.player.walking.down = true;
            that.player.walking.any = true;
            that.player.animations.play('standDown');
        }
    });

    game.controls.cursors.left.onDown.add(function () {
        if (game.mode == 'level') {
            if (!that.player.walking.any) {
                that.player.facing.up = false;
                that.player.facing.down = false;
                that.player.facing.left = false;
                that.player.facing.right = false;
            }
            that.player.facing.left = true;
            that.player.walking.left = true;
            that.player.walking.any = true;
            that.player.animations.play('standLeft');
        }
    });

    game.controls.cursors.right.onDown.add(function () {
        if (game.mode == 'level') {
            if (!that.player.walking.any) {
                that.player.facing.up = false;
                that.player.facing.down = false;
                that.player.facing.left = false;
                that.player.facing.right = false;
            }
            that.player.facing.right = true;
            that.player.walking.right = true;
            that.player.walking.any = true;
            that.player.animations.play('standRight');
        }
    });

    game.controls.cursors.up.onUp.add(function () {
        that.player.walking.up = false;
        if (!(
            !that.player.facing.down &&
            !that.player.facing.left &&
            !that.player.facing.right
        )) {
            that.player.facing.up = false;
            if (that.player.facing.right) {
                that.player.animations.play('standRight');
            }
            if (that.player.facing.left) {
                that.player.animations.play('standLeft');
            }
        } else {
            that.player.walking.any = false;
        }
    });

    game.controls.cursors.down.onUp.add(function () {
        that.player.walking.down = false;
        if (!(
            !that.player.facing.up &&
            !that.player.facing.left &&
            !that.player.facing.right
        )) {
            that.player.facing.down = false;
            if (that.player.facing.right) {
                that.player.animations.play('standRight');
            }
            if (that.player.facing.left) {
                that.player.animations.play('standLeft');
            }
        } else {
            that.player.walking.any = false;
        }
    });

    game.controls.cursors.left.onUp.add(function () {
        that.player.walking.left = false;
        if (!(
            !that.player.facing.up &&
            !that.player.facing.down &&
            !that.player.facing.right
        )) {
            that.player.facing.left = false;
            if (that.player.facing.up) {
                that.player.animations.play('standUp');
            }
            if (that.player.facing.down) {
                that.player.animations.play('standDown');
            }
        } else {
            that.player.walking.any = false;
        }
    });

    game.controls.cursors.right.onUp.add(function () {
        that.player.walking.right = false;
        if (!(
            !that.player.facing.up &&
            !that.player.facing.down &&
            !that.player.facing.left
        )) {
            that.player.facing.right = false;
            if (that.player.facing.up) {
                that.player.animations.play('standUp');
            }
            if (that.player.facing.down) {
                that.player.animations.play('standDown');
            }
        } else {
            that.player.walking.any = false;
        }
    });

    this.speed = 200;


    return this;
};

Girl.prototype.update = function() {

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (game.mode == 'level') {
        if (this.player.animations.paused) {
            this.player.animations.paused = false;
            if (game.controls.cursors.up.isDown) { game.controls.cursors.up.onDown.dispatch(); }
            if (game.controls.cursors.down.isDown) { game.controls.cursors.down.onDown.dispatch(); }
            if (game.controls.cursors.left.isDown) { game.controls.cursors.left.onDown.dispatch(); }
            if (game.controls.cursors.right.isDown) { game.controls.cursors.right.onDown.dispatch(); }

            this.bullets.forEach(function (bullet) {
                if (bullet.body.savedVelocity) {
                    bullet.body.velocity.x = bullet.body.savedVelocity.x;
                    bullet.body.velocity.y = bullet.body.savedVelocity.y;
                }
            });
        }

        var x = 0,
            y = 0,
            angle,
            speed = this.speed;

        if (game.controls.cursors.up.isDown) {
            y -= 1;
        }
        if (game.controls.cursors.down.isDown) {
            y += 1;
        }
        if (game.controls.cursors.left.isDown) {
            x -= 1;
        }
        if (game.controls.cursors.right.isDown) {
            x += 1;
        }

        if (!(x == 0 && y == 0)) {
            if (x ==  1 && y ==  0) { angle =   0; }
            if (x ==  1 && y ==  1) { angle =  45; }
            if (x ==  0 && y ==  1) { angle =  90; }
            if (x == -1 && y ==  1) { angle = 135; }
            if (x == -1 && y ==  0) { angle = 180; }
            if (x == -1 && y == -1) { angle = 225; }
            if (x ==  0 && y == -1) { angle = 270; }
            if (x ==  1 && y == -1) { angle = 315; }

            if (game.controls.shift.isDown) {
                speed = speed * 2;
            }
        
            this.player.body.velocity = game.physics.arcade.velocityFromAngle(angle, speed );
        }

        if (game.state.current != 'Town') {

            if (game.controls.primary && game.time.now - this.fireCooldown > 500 && this.bullets.countDead() > 0) {

                var bullet = this.bullets.getFirstDead();
                bullet.reset(this.player.body.center.x, this.player.body.center.y - 16);
                game.physics.arcade.moveToPointer(bullet, 300);

                bullet.body.velocity.x = bullet.body.velocity.x + this.player.body.velocity.x;
                bullet.body.velocity.y = bullet.body.velocity.y + this.player.body.velocity.y;

                this.fireCooldown = game.time.now;
            }

            if (game.controls.secondary && game.time.now - this.fireCooldown > 120 && this.bullets.countDead() > 0) {

                var bullet = this.bullets.getFirstDead();
                bullet.reset(this.player.body.center.x, this.player.body.center.y - 16);
                game.physics.arcade.moveToPointer(bullet, 400);

                bullet.body.velocity.x = bullet.body.velocity.x + this.player.body.velocity.x;
                bullet.body.velocity.y = bullet.body.velocity.y + this.player.body.velocity.y;

                this.fireCooldown = game.time.now;
            }

        }

        if (this.player.hitTimeout && game.time.now - this.player.hitTimeout > 100) {
            this.player.hitTimeout = false;
            this.player.blendMode = PIXI.blendModes.NORMAL;
        }

        if (
            this.player.walking.any
            &&
            this.player.animations.currentAnim.name.indexOf('walk') == -1) {
            switch (this.player.animations.currentAnim.name) {
                case 'standUp': 
                    this.player.animations.play('walkUp');
                    break;
                case 'standDown': 
                    this.player.animations.play('walkDown');
                    break;
                case 'standLeft': 
                    this.player.animations.play('walkLeft');
                    break;
                case 'standRight': 
                    this.player.animations.play('walkRight');
                    break;
                default:
                    break;
            }
        }

        if (
            !this.player.walking.any
            &&
            this.player.animations.currentAnim.name.indexOf('stand') == -1) {
            switch (this.player.animations.currentAnim.name) {
                case 'walkUp': 
                    this.player.animations.play('standUp');
                    break;
                case 'walkDown': 
                    this.player.animations.play('standDown');
                    break;
                case 'walkLeft': 
                    this.player.animations.play('standLeft');
                    break;
                case 'walkRight': 
                    this.player.animations.play('standRight');
                    break;
                default:
                    break;
            }
        }
    } else {
        if (!this.player.animations.paused) {
            game.controls.cursors.up.onUp.dispatch();
            game.controls.cursors.down.onUp.dispatch();
            game.controls.cursors.left.onUp.dispatch();
            game.controls.cursors.right.onUp.dispatch();
            this.player.animations.paused = true;

            this.bullets.forEach(function (bullet) {
                bullet.body.savedVelocity = {};
                bullet.body.savedVelocity.x = bullet.body.velocity.x;
                bullet.body.savedVelocity.y = bullet.body.velocity.y;

                bullet.body.velocity.x = 0;
                bullet.body.velocity.y = 0;

            });
        }
    }


    return this;
};