TinyRPG.Dungeon = (game) ->

TinyRPG.Dungeon.prototype =
    create: ->
        i = undefined
        enemyCount = 2
        enemyTypesCount = 3
        game.mode = 'level'
        if typeof game.level == 'undefined'
            game.level = 1
        i = game.level
        while i > 1
            enemyCount += game.level
            i--
        enemyCount = if enemyCount > 100 then 100 else enemyCount
        enemyCount = Math.round(enemyCount / enemyTypesCount)
        mapJSON = DungeonGenerator.GetTiledJSON()
        game.cache._tilemaps.level.data = mapJSON
        game.physics.startSystem Phaser.Physics.ARCADE
        @grid = new (PF.Grid)(64, 64, mapJSON.walkableGrid)
        game.stage.setBackgroundColor '#140C1C'
        game.map = game.add.tilemap('level')
        game.map.addTilesetImage 'tiny16'
        game.map.setCollisionByExclusion [ 105 ]
        collision = game.map.createLayer('tiny16')
        game.collision = collision
        collision.resizeWorld()
        game.enemies =
            skeletons: new Skeletons(enemyCount)
            slimes: new Slimes(enemyCount)
            bats: new Bats(enemyCount)
        game.enemies.skeletons.create()
        game.enemies.slimes.create()
        game.enemies.bats.create()
        @enemiesLeft = game.add.bitmapText(0, 0, 'silkscreen', '--', 32)
        @enemiesLeft.fixedToCamera = true
        @enemiesLeft.cameraOffset.x = 32
        @enemiesLeft.cameraOffset.y = 32
        @girl = new Girl
        @girl.create()
        game.state.states.Default.create()
        game.ui.blank.fadeFrom()
        return
    update: ->
        collision = game.collision
        skeletons = game.enemies.skeletons
        slimes = game.enemies.slimes
        bats = game.enemies.bats
        game.state.states.Default.update()
        skeletons.update()
        slimes.update()
        bats.update()
        @girl.update()
        game.physics.arcade.collide @girl.player, collision
        @girl.weapons.hitTest skeletons
        @girl.weapons.hitTest slimes
        @girl.weapons.hitTest bats
        @girl.weapons.collide collision
        game.physics.arcade.collide skeletons.group, collision
        game.physics.arcade.collide slimes.group, collision
        game.physics.arcade.collide bats.group, collision
        game.physics.arcade.collide skeletons.group, skeletons.group
        game.physics.arcade.collide slimes.group, slimes.group
        game.physics.arcade.collide bats.group, bats.group
        game.physics.arcade.collide skeletons.group, slimes.group
        game.physics.arcade.collide skeletons.group, bats.group
        game.physics.arcade.collide slimes.group, bats.group
        @enemiesLeft.setText skeletons.group.length + slimes.group.length + bats.group.length - skeletons.group.countDead() - slimes.group.countDead() - bats.group.countDead() + ' enemies left // level ' + game.level
        if skeletons.group.length + slimes.group.length + bats.group.length - skeletons.group.countDead() - slimes.group.countDead() - bats.group.countDead() == 0
            game.mode = 'stateChange'
            game.ui.blank.fadeTo =>
                game.state.clearCurrentState()
                game.level++
                @state.start 'Dungeon'
        if game.physics.arcade.collide(@girl.player, skeletons.group) or game.physics.arcade.collide(@girl.player, slimes.group) or game.physics.arcade.collide(@girl.player, bats.group)
            game.player.health--
            @girl.player.hitTimeout = game.time.now
            @girl.player.blendMode = PIXI.blendModes.ADD
            if game.player.health <= 0
                @girl.player.kill()
                if !localStorage.highestLevel or localStorage.highestLevel < game.level
                    localStorage.highestLevel = game.level
                game.level = 1
                game.player.health = 100
                game.player.mana = 100
                game.player.xp = 0
                game.state.clearCurrentState()
                @state.start 'MainMenu'
        return
    render: ->

        ###
        game.debug.body(player);
        for (var i = skeletons.children.length - 1; i >= 0; i--) {
                game.debug.body(skeletons.children[i]);
        };
        for (var i = slimes.children.length - 1; i >= 0; i--) {
                game.debug.body(slimes.children[i]);
        };
        ###

        return