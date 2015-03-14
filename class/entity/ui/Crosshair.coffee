class Crosshair

    constructor: (options = {}) ->
        @color = options.color ? '#ffffff'
        @width = options.width ? 2
        @height = options.height ? 2
        @scale = options.scale ? 4
        @x = 0
        @y = 0
        @sprite = @createSprite()

    createBitmapData: ->
        bitmapData = game.add.bitmapData @width, @height
        bitmapData.context.fillStyle = @color
        bitmapData.context.fillRect 0, 0, @width, @height
        bitmapData

    createSprite: ->
        bmd = @createBitmapData()
        sprite = game.add.sprite @x, @y, bmd
        sprite.scale.setTo @scale
        game.physics.enable sprite
        sprite.anchor.setTo 0.5
        sprite.fixedToCamera = yes
        sprite

    update: ->
        @x = game.controls.worldX
        @x = if @x then @x else 0
        @y = game.controls.worldY
        @y = if @y then @y else 0
        @sprite.cameraOffset.setTo @x - game.camera.x, @y - game.camera.y
        @