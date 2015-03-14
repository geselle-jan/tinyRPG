TinyRPG.Preloader = (game) ->

TinyRPG.Preloader.prototype =
    preload: ->
        @stage.backgroundColor = '#6DC2CA'
        @preloadBar = @add.sprite(0, game.height - 64 * 4, 'preloaderBar')
        @preloadBar.scale.setTo 4
        @load.setPreloadSprite @preloadBar
        @load.image 'menubg', 'asset/backgrounds/main-menu.png'
        @load.image 'boxborder', 'asset/sprites/box_border.png'
        @load.image 'boxborderactive', 'asset/sprites/box_border_active.png'
        @load.image 'menuclickable', 'asset/sprites/menu_clickable.png'
        @load.spritesheet 'startbutton', 'asset/sprites/start_button.png', 59, 38
        @load.spritesheet 'textbox', 'asset/sprites/textbox.png'
        @load.spritesheet 'foemarker', 'asset/sprites/foe_marker.png'
        @load.spritesheet 'statusinfo', 'asset/sprites/status_info.png'
        @load.spritesheet 'tiny16', 'asset/tilesets/tiny16.png', 64, 64
        @load.spritesheet 'collision', 'asset/tilesets/collision.png', 64, 64
        @load.tilemap 'level', null, DungeonGenerator.GetTiledJSON(empty: true), Phaser.Tilemap.TILED_JSON
        @load.tilemap 'town', 'asset/rooms/town.json', null, Phaser.Tilemap.TILED_JSON
        @load.bitmapFont 'silkscreen', 'asset/fonts/silkscreen/silkscreen.png', 'asset/fonts/silkscreen/silkscreen.fnt'
        # add ogg for firefox
        # this.load.audio('menu', ['asset/sound/music/Rolemusic/Straw_Fields/Rolemusic_-_04_-_Yellow_Dust.mp3']);
        return
    create: ->

        ###
             scaleCanvas();
             $(window).resize(function () {
                scaleCanvas();
             });
        ###

        if params.debug and params.debug == 'dungeon'
            @state.start 'DungeonDebugger'
        else
            @state.start 'MainMenu'
        return
    render: ->