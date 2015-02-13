var Slimes = function (count) {
    this.count = count;
    this.paused = false;

    return this;    
};

Slimes.prototype.create = function() {
    this.group = game.add.group();
    this.group.enableBody = true;

    var i = 0,
        randX,
        randY,
        desiredIndex = 105,
        skeleton,
        slime,
        walkFPS = 4;

    while (i < this.count) {
        randX = Helpers.GetRandom(0,map.width);
        randY = Helpers.GetRandom(0,map.height);
        if (map.getTile(randX,randY) && map.getTile(randX,randY).index == desiredIndex && (randX >= 15 || randY >= 10)) {
            slime = this.group.create(randX * map.tileWidth, randY * map.tileHeight,'tiny16');
            slime.frame = 192;
            slime.body.setSize(40,44,12,16);
            slime.health = 2;
            i++;

            slime.animations.add(
                'standDown',
                [192],
                0,
                false
            );

            slime.animations.add(
                'walkDown',
                [193,194],
                walkFPS,
                true
            );

            slime.animations.add(
                'standLeft',
                [208],
                0,
                false
            );

            slime.animations.add(
                'walkLeft',
                [209,210],
                walkFPS,
                true
            );

            slime.animations.add(
                'standRight',
                [224],
                0,
                false
            );

            slime.animations.add(
                'walkRight',
                [225,226],
                walkFPS,
                true
            );

            slime.animations.add(
                'standUp',
                [240],
                0,
                false
            );

            slime.animations.add(
                'walkUp',
                [241,242],
                walkFPS,
                true
            );

            slime.animations.play('standDown');
            slime.animations.currentAnim.timeLastChange = game.time.now - 100;
        }
    }

    return this;
};

Slimes.prototype.update = function() {
    if (game.mode == 'level') {
        if (!this.paused) {
            this.group.forEach(function (slime) {
                if (slime.hitTimeout && game.time.now - slime.hitTimeout > 100) {
                    slime.hitTimeout = false;
                    slime.blendMode = PIXI.blendModes.NORMAL;
                }
                if (slime.visible && slime.inCamera) {
                    if (slime.body.velocity.x == 0 && slime.body.velocity.y == 0) {
                        slime.body.velocity.x = Helpers.GetRandom(-80,80);
                        slime.body.velocity.y = Helpers.GetRandom(-80,80);
                    } else {
                        slime.body.velocity.x = (Helpers.GetRandom(-800,800) + (slime.body.velocity.x * 120))/121;
                        slime.body.velocity.y = (Helpers.GetRandom(-800,800) + (slime.body.velocity.y * 120))/121;
                    }

                    if (
                        Helpers.GetDirectionFromVelocity(slime)
                        !=
                        slime.animations.currentAnim.name
                        &&
                        game.time.elapsedSince(
                            slime.animations.currentAnim.timeLastChange
                        ) > 1000
                    ) {
                        slime.animations.play(Helpers.GetDirectionFromVelocity(slime, 10));
                        slime.animations.currentAnim.timeLastChange = game.time.now
                    }
                }
            });

            game.ui.foeView.updateGroup(this.group);

        } else {
            this.group.forEach(function (slime) {
                slime.body.velocity = slime.body.savedVelocity;
            });
            this.paused = false;
        }
    } else if (!this.paused) {
        this.group.forEach(function (slime) {
            slime.body.savedVelocity = slime.body.velocity;
            slime.body.velocity.x = 0;
            slime.body.velocity.y = 0;
        });
        this.paused = true;
    }


    return this;
};