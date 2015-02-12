TinyRPG.Default = function(game){};
TinyRPG.Default.prototype = {
	create: function(){

		if (!game.controls) {
			game.controls = new Controls();
			game.controls.create();
		}

        game.ui = game.ui ? game.ui : {};
        game.ui.foeView = new FoeView();
        game.ui.foeView.create();
        game.ui.fps = new FPS();
        game.ui.fps.create();
        game.ui.health = new Health();
        game.ui.health.create();
        game.ui.textbox = new TextBox();
        game.ui.textbox.create();
        game.ui.crosshair = new Crosshair();
        game.ui.crosshair.create();
	},
	update: function(){
		game.controls.update();
		game.ui.foeView.update();
		game.ui.fps.update();
		game.ui.health.update();
		game.ui.textbox.update();
		game.ui.crosshair.update();
	},
	render: function(){
	}
};