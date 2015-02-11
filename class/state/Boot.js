var TinyRPG = {};
TinyRPG.Boot = function(game){};
TinyRPG.Boot.prototype = {
	preload: function(){
		game.time.advancedTiming = true;
		// preload the loading indicator first before anything else
		this.load.image('preloaderBar', 'asset/sprites/loading.png');
	},
	create: function(){

		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setScreenSize();
		game.scale.refresh();
		
		// start the Preloader state
		this.state.start('Preloader');
	}
};