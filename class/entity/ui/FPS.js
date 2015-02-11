var FPS = function () {
    return this;
};

FPS.prototype.create = function() {
    this.text = game.add.bitmapText(0, 0, 'silkscreen', '', 32);
    this.text.fixedToCamera = true;

    return this;
};

FPS.prototype.update = function() {
    this.text.cameraOffset.x = game.camera.width - 32 - this.text.width;
    this.text.cameraOffset.y = 32;
    this.text.setText((game.time.fps || '--') + ' FPS');

    return this;
};