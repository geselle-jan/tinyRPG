var Health = function () {
    return this;
};

Health.prototype.create = function() {
    this.text = game.add.bitmapText(32, 32, 'silkscreen', '', 32);
    this.text.fixedToCamera = true;

    return this;
};

Health.prototype.update = function() {
	if (
		typeof game.state.states[game.state.current].girl != 'undefined'
		&&
		typeof game.player != 'undefined'
		&&
		typeof game.player.health != 'undefined'
	) {
		this.text.setText(game.player.health + ' HP');
	}

    return this;
};