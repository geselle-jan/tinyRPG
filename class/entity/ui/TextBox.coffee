TextBox = ->
    this

TextBox::create = ->
    @box = new Box(
        width: 224
        height: 48
        x: 32
        y: game.camera.height - 48 * 4 - 32)
    @background = @box.sprite
    @text = game.add.bitmapText(0, 0, 'silkscreen', '', 32)
    @text.fixedToCamera = true
    @text.cameraOffset.x = 56
    @text.cameraOffset.y = game.camera.height - 200
    @initalMode = game.mode
    @lastOpened = game.time.now
    @hide()
    game.input.onDown.add (->
        if game.mode == 'dialog' and game.time.now - @lastOpened > 100
            @hide()
        return
    ), this
    this

TextBox::update = ->
    this

TextBox::hide = ->
    @background.visible = false
    @text.visible = false
    game.mode = @initalMode
    this

TextBox::show = (text) ->
    if typeof text != 'undefined'
        @text.setText text
    @lastOpened = game.time.now
    @background.visible = true
    @text.visible = true
    game.mode = 'dialog'
    this