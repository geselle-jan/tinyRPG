TinyRPG.Preloader = function(game){};
TinyRPG.Preloader.prototype = {
	preload: function(){
		this.stage.backgroundColor = '#6DC2CA';
		this.preloadBar = this.add.sprite(0, game.height-(64*4), 'preloaderBar');
		this.preloadBar.scale.setTo(4);
		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('menubg', 'asset/backgrounds/main-menu.png');
		this.load.image('boxborder', 'asset/sprites/box_border.png');
		this.load.image('boxborderactive', 'asset/sprites/box_border_active.png');
		this.load.image('menuclickable', 'asset/sprites/menu_clickable.png');
		this.load.spritesheet('startbutton', 'asset/sprites/start_button.png', 59, 38);
		this.load.spritesheet('textbox', 'asset/sprites/textbox.png');
		this.load.spritesheet('foemarker', 'asset/sprites/foe_marker.png');
		this.load.spritesheet('healthbar', 'asset/sprites/health_bar.png');
		this.load.spritesheet('tiny16', 'asset/tilesets/tiny16.png', 64, 64);
		this.load.spritesheet('collision', 'asset/tilesets/collision.png', 64, 64);
		this.load.tilemap('level', null, DungeonGenerator.GetTiledJSON({ empty: true }), Phaser.Tilemap.TILED_JSON );
		this.load.tilemap('town', 'asset/rooms/town.json', null, Phaser.Tilemap.TILED_JSON );
		this.load.bitmapFont('silkscreen', 'asset/fonts/silkscreen/silkscreen.png', 'asset/fonts/silkscreen/silkscreen.fnt');
		
		// add ogg for firefox
		// this.load.audio('menu', ['asset/sound/music/Rolemusic/Straw_Fields/Rolemusic_-_04_-_Yellow_Dust.mp3']);


	},
	create: function(){
		/*
	    scaleCanvas();
	    $(window).resize(function () {
	    	scaleCanvas();
	    });
*/

		if (params.debug && params.debug == 'dungeon') {
			this.state.start('DungeonDebugger');
		} else {
			this.state.start('MainMenu');
		}
	},
	render: function(){
	}
};