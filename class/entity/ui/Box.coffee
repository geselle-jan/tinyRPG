Box = (options) ->
    defaultOptions = 
        color: '#597dce'
        width: 16
        height: 16
        x: 0
        y: 0
        scale: 4
    if typeof options == 'object'
        options = $.extend(defaultOptions, options)
    else
        options = defaultOptions
    @options = options
    @topLeft = new (Phaser.Rectangle)(0, 0, 5, 5)
    @topRight = new (Phaser.Rectangle)(4, 0, 5, 5)
    @bottomRight = new (Phaser.Rectangle)(4, 4, 5, 5)
    @bottomLeft = new (Phaser.Rectangle)(0, 4, 5, 5)
    @bmd = game.add.bitmapData(@options.width, @options.height)
    @bmd.context.fillStyle = @options.color
    @bmd.context.fillRect 5, 5, @options.width - 10, @options.height - 10
    @bmd.copyRect 'boxborder', @topLeft, 0, 0
    @bmd.copyRect 'boxborder', @topRight, @options.width - 5, 0
    @bmd.copyRect 'boxborder', @bottomRight, @options.width - 5, @options.height - 5
    @bmd.copyRect 'boxborder', @bottomLeft, 0, @options.height - 5
    @bmd.copy 'boxborder', 4, 0, 1, 5, 5, 0, @options.width - 10, 5
    @bmd.copy 'boxborder', 4, 4, 1, 5, 5, @options.height - 5, @options.width - 10, 5
    @bmd.copy 'boxborder', 0, 4, 5, 1, 0, 5, 5, @options.height - 10
    @bmd.copy 'boxborder', 4, 4, 5, 1, @options.width - 5, 5, 5, @options.height - 10
    @sprite = game.add.sprite(0, 0, @bmd)
    @sprite.scale.setTo @options.scale
    @sprite.fixedToCamera = true
    @sprite.cameraOffset.x = @options.x
    @sprite.cameraOffset.y = @options.y
    @sprite