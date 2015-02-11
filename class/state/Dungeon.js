TinyRPG.Dungeon = function(game){};
TinyRPG.Dungeon.prototype = {
    create: function(){
        var i,
            enemyCount = 2,
            enemyTypesCount = 2;

        game.mode = 'level';

        if (typeof game.level == 'undefined') {
            game.level = 1;
        }

        i = game.level;

        while (i > 1) {
            enemyCount += game.level;
            i--;
        }

        enemyCount = enemyCount > 100 ? 100 : enemyCount; 

        enemyCount = Math.round(enemyCount / enemyTypesCount);


        game.cache._tilemaps.level.data = DungeonGenerator.GetTiledJSON();

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.setBackgroundColor('#140C1C');

        map = game.add.tilemap('level');
        map.addTilesetImage('tiny16');
        map.setCollisionByExclusion([105]);

        collision = map.createLayer('tiny16');
        collision.resizeWorld();

        skeletons = new Skeletons(enemyCount);
        skeletons.create();

        slimes = new Slimes(enemyCount);
        slimes.create();

        this.enemiesLeft = game.add.bitmapText(0, 0, 'silkscreen', '--', 32);
        this.enemiesLeft.fixedToCamera = true;
        this.enemiesLeft.cameraOffset.x = 32;
        this.enemiesLeft.cameraOffset.y = game.camera.height - 32 - this.enemiesLeft.height;

        this.girl = new Girl();
        this.girl.create();

        console.log(this.girl.player.position);

        game.state.states.Default.create();

    },
    update: function(){

        game.state.states.Default.update();

        skeletons.update();

        slimes.update();

        this.girl.update();


        if(game.physics.arcade.collide(this.girl.player, collision)) {
        }

        game.physics.arcade.overlap(this.girl.bullets, collision, function(shot) {
            shot.kill();
        });

        game.physics.arcade.overlap(this.girl.bullets, skeletons.group, function(shot, skeleton) {
            shot.kill();
            skeleton.health--;
            skeleton.hitTimeout = game.time.now;
            skeleton.blendMode = PIXI.blendModes.ADD;
            if (skeleton.health <= 0) {
                skeleton.kill();
            }
        });

        game.physics.arcade.overlap(this.girl.bullets, slimes.group, function(shot, slime) {
            shot.kill();
            slime.health--;
            slime.hitTimeout = game.time.now;
            slime.blendMode = PIXI.blendModes.ADD;
            if (slime.health <= 0) {
                slime.kill();
            }
        });

        game.physics.arcade.collide(skeletons.group, collision);
        game.physics.arcade.collide(slimes.group, collision);

        game.physics.arcade.collide(skeletons.group, skeletons.group);
        game.physics.arcade.collide(skeletons.group, slimes.group);
        game.physics.arcade.collide(slimes.group, slimes.group);

        this.enemiesLeft.setText((skeletons.group.length + slimes.group.length - skeletons.group.countDead() - slimes.group.countDead()) + ' enemies left // level ' + game.level);

        if ((skeletons.group.length + slimes.group.length - skeletons.group.countDead() - slimes.group.countDead()) == 0) {
            game.state.clearCurrentState();
            game.level++;
            this.state.start('Dungeon');
        }

        if(game.physics.arcade.collide(this.girl.player, skeletons.group) || game.physics.arcade.collide(this.girl.player, slimes.group)) {
            game.player.health--;
            this.girl.player.hitTimeout = game.time.now;
            this.girl.player.blendMode = PIXI.blendModes.ADD;
            if (game.player.health <= 0) {
                this.girl.player.kill();
                if (!localStorage.highestLevel || localStorage.highestLevel < game.level) {
                    localStorage.highestLevel = game.level;
                }
                game.level = 1;
                game.player.health = 100;
                game.state.clearCurrentState();
                this.state.start('MainMenu');
            }
        }
    },
    render: function(){
        /*
        game.debug.body(player);
        for (var i = skeletons.children.length - 1; i >= 0; i--) {
            game.debug.body(skeletons.children[i]);
        };
        for (var i = slimes.children.length - 1; i >= 0; i--) {
            game.debug.body(slimes.children[i]);
        };
        */
    }
};