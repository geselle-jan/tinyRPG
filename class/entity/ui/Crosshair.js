var Crosshair = function (options) {
    var defaultOptions = {
        color: '#ffffff',
        width: 2,
        height: 2,
        scale: 4
    }

    if (typeof options == 'object') {
        options = $.extend(
            defaultOptions,
            options
        );
    } else {
        options = defaultOptions;
    }

    this.options = options;

    this.x = 0;
    this.y = 0;

    this.bmd = game.add.bitmapData(
        this.options.width,
        this.options.height
    );
    this.bmd.context.fillStyle = this.options.color;
    this.bmd.context.fillRect(
        0,
        0,
        this.options.width,
        this.options.height
    );

    return this;
};

Crosshair.prototype.create = function() {
    this.sprite = game.add.sprite(
        this.x,
        this.y,
        this.bmd
    );
    this.sprite.scale.setTo(this.options.scale);
    game.physics.enable(this.sprite);
    this.sprite.anchor.setTo(0.5);
    this.sprite.fixedToCamera = true;

    return this;
};

Crosshair.prototype.update = function() {
    this.x = game.controls.worldX;
    this.x = this.x ? this.x : 0;

    this.y = game.controls.worldY;
    this.y = this.y ? this.y : 0;
    
    this.sprite.cameraOffset.setTo(
        this.x - game.camera.x,
        this.y - game.camera.y
    );

    return this;
};