PauseMenu = ->
    @entries = [
        { name: 'Character' }
        { name: 'Save' }
        { name: 'Quit' }
    ]
    this

PauseMenu::create = ->
    @boxHeight = 10 + @entries.length - 1 + @entries.length * 13
    @background = new Box(
        width: 73
        height: @boxHeight
        x: game.camera.width - 73 * 4 - 32
        y: game.camera.height - @boxHeight * 4 - 32)
    @texts = []
    @clickables = []
    i = @entries.length - 1
    while i >= 0
        @texts[i] = game.add.bitmapText(0, 0, 'silkscreen', @entries[i].name, 32)
        @texts[i].fixedToCamera = true
        @texts[i].cameraOffset.x = 167 * 4
        @texts[i].cameraOffset.y = game.camera.height - 10 * 4 - (@entries.length - i) * 4 * 14
        @clickables[i] = game.add.sprite(0, 0, 'menuclickable')
        @clickables[i].fixedToCamera = true
        @clickables[i].scale.setTo 4
        @clickables[i].cameraOffset.x = 164 * 4
        @clickables[i].cameraOffset.y = game.camera.height - 12 * 4 - (@entries.length - i) * 4 * 14
        @entries[i].index = i
        @clickables[i].data = @entries[i]
        @clickables[i].inputEnabled = true
        @clickables[i].events.onInputOver.add (->
            that = game.ui.pauseMenu
            active = that.activeIndicator
            index = @data.index
            active.visible = true
            active.cameraOffset.x = 157 * 4
            active.cameraOffset.y = that.clickables[index].cameraOffset.y + 3 * 4
            return
        ), @clickables[i]
        @clickables[i].events.onInputOut.add (->
            that = game.ui.pauseMenu
            active = that.activeIndicator
            active.visible = false
            return
        ), @clickables[i]
        @clickables[i].events.onInputDown.add (->
            alert @data.name
            return
        ), @clickables[i]
        i--
    @activeIndicator = game.add.sprite(0, 0, 'boxborderactive')
    @activeIndicator.fixedToCamera = true
    @activeIndicator.scale.setTo 4
    @activeIndicator.cameraOffset.x = 0
    @activeIndicator.cameraOffset.y = 0
    @activeIndicator.visible = false
    @initalMode = game.mode
    @lastOpened = game.time.now
    @hide()
    game.controls.esc.onDown.add (->
        if game.mode == 'menu' and game.time.now - @lastOpened > 100
            @hide()
        else if game.mode == 'level'
            @show()
        return
    ), this
    this

PauseMenu::update = ->
    this

PauseMenu::hide = ->
    @background.visible = false
    @activeIndicator.visible = false
    i = @texts.length - 1
    while i >= 0
        @texts[i].visible = false
        @clickables[i].visible = false
        i--
    game.mode = @initalMode
    this

PauseMenu::show = ->
    @lastOpened = game.time.now
    @background.visible = true
    i = @texts.length - 1
    while i >= 0
        @texts[i].visible = true
        @clickables[i].visible = true
        if @clickables[i].input.checkPointerOver(game.input.activePointer)
            @clickables[i].events.onInputOver.dispatch()
        i--
    game.mode = 'menu'
    this