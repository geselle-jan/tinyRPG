TinyRPG.MainMenu = (game) ->

TinyRPG.MainMenu.prototype =
    create: ->
        game.mode = 'menu'
        game.stage.setBackgroundColor '#17091C'
        splashScreen = @add.sprite(0, 0, 'menubg')
        splashScreen.scale.set 4
        button = game.add.button(480, 550, 'startbutton', @startGame, this, 2, 1, 0)
        button.scale.setTo 4
        button.anchor.setTo 0.5
        @menuMusic = game.add.audio('menu')
        #this.menuMusic.play();
        @highscore = game.add.bitmapText(0, 0, 'silkscreen', '--', 32)
        @highscore.fixedToCamera = true
        @highscore.setText 'Highscore ' + (if localStorage.highestLevel then localStorage.highestLevel else 0)
        game.state.states.Default.create()
        game.ui.blank.hide()
        return
    startGame: ->
        game.ui.blank.fadeTo ->
            game.state.clearCurrentState()
            #this.menuMusic.stop();
            game.state.start 'Town'
        return
    update: ->
        @highscore.cameraOffset.x = game.camera.width / 2 - (@highscore.width / 2)
        @highscore.cameraOffset.y = 240
        game.state.states.Default.update()
        return
    render: ->