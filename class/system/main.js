var params 	= Phaser.Net.prototype.getQueryString(),
	game;

if (params.debug && params.debug == 'dungeon') {
	game = new Phaser.Game(64*64, 64*64, Phaser.CANVAS, 'tinyRPG', {}, false, false);
} else {
	game = new Phaser.Game(960, 640, Phaser.CANVAS, 'tinyRPG', {}, false, false);
}

// add game states
game.state.add('Boot', TinyRPG.Boot);
game.state.add('Default', TinyRPG.Default);
game.state.add('Preloader', TinyRPG.Preloader);
game.state.add('MainMenu', TinyRPG.MainMenu);
game.state.add('Town', TinyRPG.Town);
game.state.add('Dungeon', TinyRPG.Dungeon);
game.state.add('DungeonDebugger', TinyRPG.DungeonDebugger);
// start the Boot state
game.state.start('Boot');

