var Box = function (options) {
    var defaultOptions = {
        color: '#597dce',
        width: 16,
        height: 16,
        x: 0,
        y: 0,
        scale: 4
    };

    if (typeof options == 'object') {
        options = $.extend(
            defaultOptions,
            options
        );
    } else {
        options = defaultOptions;
    }

    this.options = options;

    this.topLeft 		= new Phaser.Rectangle(
    	0, 0, 5, 5
    );
    this.topRight 		= new Phaser.Rectangle(
    	4, 0, 5, 5
    );
    this.bottomRight 	= new Phaser.Rectangle(
    	4, 4, 5, 5
    );
    this.bottomLeft 	= new Phaser.Rectangle(
    	0, 4, 5, 5
    );

    this.bmd = game.add.bitmapData(
        this.options.width,
        this.options.height
    );

    this.bmd.context.fillStyle = this.options.color;
    this.bmd.context.fillRect(
        5,
        5,
        this.options.width - 10,
        this.options.height - 10
    );

    this.bmd.copyRect(
    	'boxborder',
    	this.topLeft,
    	0,
    	0
    );
    this.bmd.copyRect(
    	'boxborder',
    	this.topRight,
    	this.options.width - 5,
    	0
    );
    this.bmd.copyRect(
    	'boxborder',
    	this.bottomRight,
    	this.options.width - 5,
    	this.options.height - 5
    );
    this.bmd.copyRect(
    	'boxborder',
    	this.bottomLeft,
    	0,
    	this.options.height - 5
    );

    this.bmd.copy(
    	'boxborder',
    	4, 0, 1, 5,
    	5, 0, this.options.width - 10, 5
    );

    this.bmd.copy(
    	'boxborder',
    	4, 4, 1, 5,
    	5, this.options.height - 5, this.options.width - 10, 5
    );

    this.bmd.copy(
    	'boxborder',
    	0, 4, 5, 1,
    	0, 5, 5, this.options.height - 10
    );

    this.bmd.copy(
    	'boxborder',
    	4, 4, 5, 1,
    	this.options.width - 5, 5, 5, this.options.height - 10
    );

	this.sprite = game.add.sprite(0, 0, this.bmd);
    this.sprite.scale.setTo(this.options.scale);
    this.sprite.fixedToCamera = true;
    this.sprite.cameraOffset.x = this.options.x;
    this.sprite.cameraOffset.y = this.options.y;


    return this.sprite;
};
