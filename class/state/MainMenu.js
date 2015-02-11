TinyRPG.MainMenu = function(game){};
TinyRPG.MainMenu.prototype = {
	create: function(){
		game.mode = 'menu';

		var splashScreen = this.add.sprite(0, 0, 'menubg');
		splashScreen.scale.set(4);
		var button = game.add.button(480, 550, 'startbutton', this.startGame, this, 2, 1, 0);
		button.scale.setTo(4);
		button.anchor.setTo(0.5);

		this.menuMusic = game.add.audio('menu');

		//this.menuMusic.play();

		this.highscore = game.add.bitmapText(0, 0, 'silkscreen', '--', 32);
        this.highscore.fixedToCamera = true;

        this.highscore.setText('Highscore ' + (localStorage.highestLevel ? localStorage.highestLevel : 0));

		game.state.states.Default.create();
	},
	startGame: function() {
        game.state.clearCurrentState();
		//this.menuMusic.stop();
		this.state.start('Town');
	},
	update: function(){
        this.highscore.cameraOffset.x = (game.camera.width / 2) - (this.highscore.width / 2);
        this.highscore.cameraOffset.y = 240;
		game.state.states.Default.update();
	},
	render: function(){
	}
};