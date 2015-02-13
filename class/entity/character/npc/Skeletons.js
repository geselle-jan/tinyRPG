var Skeletons = function (count) {
    this.count = count;

    return this;    
};

Skeletons.prototype.create = function() {
    this.group = game.add.group();
    this.group.enableBody = true;

    var i = 0,
        randX,
        randY,
        desiredIndex = 105,
        skeleton,
        walkFPS = 3;

    while (i < this.count) {
        randX = Helpers.GetRandom(0,map.width);
        randY = Helpers.GetRandom(0,map.height);
        if (map.getTile(randX,randY) && map.getTile(randX,randY).index == desiredIndex && (randX >= 15 || randY >= 10)) {
            skeleton = this.group.create(randX * map.tileWidth, randY * map.tileHeight,'tiny16');
            skeleton.frame = 134;
            skeleton.body.setSize(32,32,16,28);
            skeleton.health = 5;
            skeleton.hitTimeout = false;
            i++;

            skeleton.animations.add(
                'standDown',
                [134],
                0,
                false
            );

            skeleton.animations.add(
                'walkDown',
                [135,136],
                walkFPS,
                true
            );

            skeleton.animations.add(
                'standLeft',
                [150],
                0,
                false
            );

            skeleton.animations.add(
                'walkLeft',
                [151,152],
                walkFPS,
                true
            );

            skeleton.animations.add(
                'standRight',
                [166],
                0,
                false
            );

            skeleton.animations.add(
                'walkRight',
                [167,168],
                walkFPS,
                true
            );

            skeleton.animations.add(
                'standUp',
                [182],
                0,
                false
            );

            skeleton.animations.add(
                'walkUp',
                [183,184],
                walkFPS,
                true
            );

            skeleton.animations.play('standDown');
            skeleton.animations.currentAnim.timeLastChange = game.time.now - 100;
        }
    }

    return this;
};

Skeletons.prototype.update = function() {
    this.group.setAll('body.velocity.x', 0);
    this.group.setAll('body.velocity.y', 0);

    if (game.mode == 'level') {
        this.group.forEach(function (skeleton) {
            if (skeleton.hitTimeout && game.time.now - skeleton.hitTimeout > 100) {
                skeleton.hitTimeout = false;
                skeleton.blendMode = PIXI.blendModes.NORMAL;
            }
            if (skeleton.visible && skeleton.inCamera) {
                var line = new Phaser.Line(
                        game.state.states[game.state.current].girl.player.body.center.x,
                        game.state.states[game.state.current].girl.player.body.center.y,
                        skeleton.body.center.x,
                        skeleton.body.center.y
                    ),
                    tileHits,
                    hasLineOfSight,
                    viewRadius = 320;

                if (line.length <= viewRadius) {

                    tileHits = collision.getRayCastTiles(line, 4, false, false);
                    hasLineOfSight = true;

                    if (tileHits.length > 0) {
                        for (var i = 0; i < tileHits.length; i++) {
                            if (map.collideIndexes.indexOf(tileHits[i].index) != -1) {
                                hasLineOfSight = false;
                            }
                        }
                    }

                    if(hasLineOfSight) {
                        game.physics.arcade.moveToXY(
                            skeleton,
                            game.state.states[game.state.current].girl.player.body.center.x - skeleton.body.offset.x - (skeleton.body.width / 2),
                            game.state.states[game.state.current].girl.player.body.center.y - skeleton.body.offset.y - (skeleton.body.height / 2),
                            Helpers.GetRandom(150,200)
                        );
                    }

                }

                if (
                    Helpers.GetDirectionFromVelocity(skeleton)
                    !=
                    skeleton.animations.currentAnim.name
                    &&
                    game.time.elapsedSince(
                        skeleton.animations.currentAnim.timeLastChange
                    ) > 25
                ) {
                    skeleton.animations.play(Helpers.GetDirectionFromVelocity(skeleton, 10));
                    skeleton.animations.currentAnim.timeLastChange = game.time.now
                }
            }
        });

        game.ui.foeView.updateGroup(this.group);
    }

    return this;
};