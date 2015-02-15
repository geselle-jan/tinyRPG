TinyRPG.Dungeon = function(game){};
TinyRPG.Dungeon.prototype = {
    create: function(){
        var i,
            enemyCount = 2,
            enemyTypesCount = 3;

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

        mapJSON = DungeonGenerator.GetTiledJSON();

        game.cache._tilemaps.level.data = mapJSON;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.grid = new PF.Grid(64, 64, mapJSON.walkableGrid)

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

        bats = new Bats(enemyCount);
        bats.create();

        this.enemiesLeft = game.add.bitmapText(0, 0, 'silkscreen', '--', 32);
        this.enemiesLeft.fixedToCamera = true;
        this.enemiesLeft.cameraOffset.x = 32;
        this.enemiesLeft.cameraOffset.y = 32;

        this.girl = new Girl();
        this.girl.create();

        game.state.states.Default.create();

    },
    update: function(){

        game.state.states.Default.update();

        skeletons.update();

        slimes.update();

        bats.update();

        this.girl.update();


        game.physics.arcade.collide(this.girl.player, collision);

        this.girl.weapons.hitTest(skeletons);
        this.girl.weapons.hitTest(slimes);
        this.girl.weapons.hitTest(bats);

        this.girl.weapons.collide(collision);

        game.physics.arcade.collide(skeletons.group, collision);
        game.physics.arcade.collide(slimes.group, collision);
        game.physics.arcade.collide(bats.group, collision);

        game.physics.arcade.collide(skeletons.group, skeletons.group);
        game.physics.arcade.collide(slimes.group, slimes.group);
        game.physics.arcade.collide(bats.group, bats.group);
        game.physics.arcade.collide(skeletons.group, slimes.group);
        game.physics.arcade.collide(skeletons.group, bats.group);
        game.physics.arcade.collide(slimes.group, bats.group);

        this.enemiesLeft.setText((skeletons.group.length + slimes.group.length + bats.group.length - skeletons.group.countDead() - slimes.group.countDead() - bats.group.countDead()) + ' enemies left // level ' + game.level);

        if ((skeletons.group.length + slimes.group.length + bats.group.length - skeletons.group.countDead() - slimes.group.countDead() - bats.group.countDead()) == 0) {
            game.state.clearCurrentState();
            game.level++;
            this.state.start('Dungeon');
        }

        if(
            game.physics.arcade.collide(this.girl.player, skeletons.group)
            ||
            game.physics.arcade.collide(this.girl.player, slimes.group)
            ||
            game.physics.arcade.collide(this.girl.player, bats.group)
        ) {
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
                game.player.mana = 100;
                game.player.xp = 0;
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