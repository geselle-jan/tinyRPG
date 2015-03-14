TinyRPG.Default = (game) ->

TinyRPG.Default.prototype =
    create: ->
        if !game.controls
            game.controls = new Controls
            game.controls.create()
        game.ui = if game.ui then game.ui else {}
        game.ui.foeView = new FoeView
        game.ui.fps = new FPS
        game.ui.statusInfo = new StatusInfo
        game.ui.statusInfo.create()
        game.ui.blank = new Blank {visible: yes}
        game.ui.textbox = new TextBox
        game.ui.pauseMenu = new PauseMenu
        game.ui.pauseMenu.create()
        game.ui.crosshair = new Crosshair
        return
    update: ->
        game.controls.update()
        game.ui.foeView.update()
        game.ui.fps.update()
        game.ui.statusInfo.update()
        game.ui.pauseMenu.update()
        game.ui.crosshair.update()
        return
    render: ->