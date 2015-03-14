FPS = ->
    this

FPS::create = ->
    @text = game.add.bitmapText(0, 0, 'silkscreen', '', 32)
    @text.fixedToCamera = true
    this

FPS::update = ->
    if game.time.fps != 60
        @text.visible = true
        @text.cameraOffset.x = game.camera.width - 32 - @text.width
        @text.cameraOffset.y = 32
        @text.setText (game.time.fps or '--') + ' FPS'
    else
        @text.visible = false
    this