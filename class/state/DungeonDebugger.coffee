TinyRPG.DungeonDebugger = (game) ->

TinyRPG.DungeonDebugger.prototype =
    create: ->
        @updateCounter = 0
        params = Phaser.Net::getQueryString()
        game.level = 1
        if params.level and params.level > 0
            game.level = params.level * 1
        game.mode = 'level'
        game.cache._tilemaps.level.data = DungeonGenerator.GetTiledJSON()
        game.stage.setBackgroundColor '#140C1C'
        map = game.add.tilemap('level')
        map.addTilesetImage 'tiny16'
        collision = map.createLayer('tiny16')
        collision.resizeWorld()
        return
    update: ->
        if @updateCounter < 5
            @updateCounter++
        else
            throw new Error('code execution stopped')
    render: ->