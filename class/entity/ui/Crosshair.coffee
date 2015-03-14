Crosshair = (options) ->
    defaultOptions = 
        color: '#ffffff'
        width: 2
        height: 2
        scale: 4
    if typeof options == 'object'
        options = $.extend(defaultOptions, options)
    else
        options = defaultOptions
    @options = options
    @x = 0
    @y = 0
    @bmd = game.add.bitmapData(@options.width, @options.height)
    @bmd.context.fillStyle = @options.color
    @bmd.context.fillRect 0, 0, @options.width, @options.height
    this

Crosshair::create = ->
    @sprite = game.add.sprite(@x, @y, @bmd)
    @sprite.scale.setTo @options.scale
    game.physics.enable @sprite
    @sprite.anchor.setTo 0.5
    @sprite.fixedToCamera = true
    this

Crosshair::update = ->
    @x = game.controls.worldX
    @x = if @x then @x else 0
    @y = game.controls.worldY
    @y = if @y then @y else 0
    @sprite.cameraOffset.setTo @x - game.camera.x, @y - game.camera.y
    this