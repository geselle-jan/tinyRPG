var Bats = function (count) {
    this.count = count;

    return this;    
};

Bats.prototype.create = function() {
    this.group = game.add.group();
    this.group.enableBody = true;

    var i = 0,
        randX,
        randY,
        desiredIndex = 105,
        bat,
        walkFPS = 3;

    while (i < this.count) {
        randX = Helpers.GetRandom(0,map.width);
        randY = Helpers.GetRandom(0,map.height);
        if (map.getTile(randX,randY) && map.getTile(randX,randY).index == desiredIndex && (randX >= 15 || randY >= 10)) {
            bat = this.group.create(randX * map.tileWidth, randY * map.tileHeight,'tiny16');
            bat.frame = 195;
            bat.body.setSize(32,32,16,28);
            bat.health = 30;
            bat.hitTimeout = false;
            i++;

            bat.animations.add(
                'standDown',
                [195],
                0,
                false
            );

            bat.animations.add(
                'walkDown',
                [196,197],
                walkFPS,
                true
            );

            bat.animations.add(
                'standLeft',
                [211],
                0,
                false
            );

            bat.animations.add(
                'walkLeft',
                [212,213],
                walkFPS,
                true
            );

            bat.animations.add(
                'standRight',
                [227],
                0,
                false
            );

            bat.animations.add(
                'walkRight',
                [228,229],
                walkFPS,
                true
            );

            bat.animations.add(
                'standUp',
                [243],
                0,
                false
            );

            bat.animations.add(
                'walkUp',
                [244,245],
                walkFPS,
                true
            );

            bat.animations.play('standDown');
            bat.animations.currentAnim.timeLastChange = game.time.now - 100;
        }
    }

    return this;
};

Bats.prototype.update = function() {
    var grid,
        finder,
        x,
        y,
        girl,
        path;

    this.group.setAll('body.velocity.x', 0);
    this.group.setAll('body.velocity.y', 0);

    if (game.mode == 'level') {
        this.group.forEach(function (bat) {
            if (bat.hitTimeout && game.time.now - bat.hitTimeout > 100) {
                bat.hitTimeout = false;
                bat.blendMode = PIXI.blendModes.NORMAL;
            }

            var line = new Phaser.Line(
                    game.state.states[game.state.current].girl.player.body.center.x,
                    game.state.states[game.state.current].girl.player.body.center.y,
                    bat.body.center.x,
                    bat.body.center.y
                ),
                tileHits,
                hasLineOfSight,
                viewRadius = 250 * 4,
                safeZone = 32 * 4;

            if (line.length <= viewRadius && line.length > safeZone) {

                grid = game.state.states[game.state.current].grid;

                finder = new PF.AStarFinder({
                    allowDiagonal: true,
                    dontCrossCorners: true
                });

                girl = game.state.states[game.state.current].girl;

                girlX = Math.floor(girl.player.body.center.x / 64);
                girlY = Math.floor(girl.player.body.center.y / 64);

                batX = Math.floor(bat.body.center.x / 64);
                batY = Math.floor(bat.body.center.y / 64);

                path = finder.findPath(batX, batY, girlX, girlY, grid.clone());

                if (path.length > 2) {
                    path = PF.Util.smoothenPath(grid, path);
                }

                if (path.length > 1) {
                    game.physics.arcade.moveToXY(
                        bat,
                        (path[1][0] * 64) + 32 - bat.body.offset.x - (bat.body.width / 2),
                        (path[1][1] * 64) + 32 - bat.body.offset.y - (bat.body.height / 2),
                        Helpers.GetRandom(150,200)
                    );
                }
            } else if (line.length <= safeZone) {
                    game.physics.arcade.moveToXY(
                        bat,
                        game.state.states[game.state.current].girl.player.body.center.x - bat.body.offset.x - (bat.body.width / 2),
                        game.state.states[game.state.current].girl.player.body.center.y - bat.body.offset.y - (bat.body.height / 2),
                        Helpers.GetRandom(200,300)
                    );
            }

            if (
                Helpers.GetDirectionFromVelocity(bat)
                !=
                bat.animations.currentAnim.name
                &&
                game.time.elapsedSince(
                    bat.animations.currentAnim.timeLastChange
                ) > 25
            ) {
                bat.animations.play(Helpers.GetDirectionFromVelocity(bat, 10));
                bat.animations.currentAnim.timeLastChange = game.time.now
            }

            if (bat.animations.paused) {
                bat.animations.paused = false;
            }
        });

        game.ui.foeView.updateGroup(this.group);
    } else {
        this.group.forEach(function (bat) {
            if (!bat.animations.paused) {
                bat.animations.paused = true;
            }
        });
    }

    return this;
};