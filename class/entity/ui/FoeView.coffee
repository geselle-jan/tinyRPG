FoeView = (options) ->
    defaultOptions = 
        color: '#ff0000'
        width: 2
        height: 2
        scale: 4
        maxFoes: 100
    if typeof options == 'object'
        options = $.extend(defaultOptions, options)
    else
        options = defaultOptions
    @options = options
    this

FoeView::create = ->
    @foeMarkers = game.add.group()
    @foeMarkers.createMultiple @options.maxFoes, 'foemarker'
    @foeMarkers.setAll 'anchor.x', 0.5
    @foeMarkers.setAll 'anchor.y', 0.5
    @foeMarkers.setAll 'scale.x', @options.scale
    @foeMarkers.setAll 'scale.y', @options.scale
    @foeMarkers.setAll 'fixedToCamera', true
    this

FoeView::update = ->
    if game.mode == 'level'
        @foeMarkers.forEachAlive ((foeMarker) ->
            foeMarker.kill()
            return
        ), this
    this

FoeView::updateGroup = (group) ->
    if game.controls.f.isDown and game.mode == 'level'
        topLeft = 
            x: game.camera.x
            y: game.camera.y
        topRight = 
            x: game.camera.x + game.camera.width
            y: game.camera.y
        bottomLeftOne = 
            x: game.camera.x + 20 * 4
            y: game.camera.y + game.camera.height - 7 * 4
        bottomLeftTwo = 
            x: game.camera.x + 20 * 4
            y: game.camera.y + game.camera.height - 20 * 4
        bottomLeftThree = 
            x: game.camera.x
            y: game.camera.y + game.camera.height - 20 * 4
        bottomRight = 
            x: game.camera.x + game.camera.width
            y: game.camera.y + game.camera.height - 7 * 4
        lineOfSight = undefined
        foeMarker = undefined
        temp = undefined
        player = game.state.states[game.state.current].girl.player
        intersection = false
        @borders = [
            new (Phaser.Line)(topLeft.x, topLeft.y, topRight.x, topRight.y)
            new (Phaser.Line)(topRight.x, topRight.y, bottomRight.x, bottomRight.y)
            new (Phaser.Line)(bottomRight.x, bottomRight.y, bottomLeftOne.x, bottomLeftOne.y)
            new (Phaser.Line)(bottomLeftOne.x, bottomLeftOne.y, bottomLeftTwo.x, bottomLeftTwo.y)
            new (Phaser.Line)(bottomLeftTwo.x, bottomLeftTwo.y, bottomLeftThree.x, bottomLeftThree.y)
            new (Phaser.Line)(bottomLeftThree.x, bottomLeftThree.y, topLeft.x, topLeft.y)
        ]
        group.forEachAlive ((foe) ->
            if @foeMarkers.countDead() > 0
                lineOfSight = new (Phaser.Line)(player.body.center.x, player.body.center.y, foe.body.center.x, foe.body.center.y)
                i = @borders.length - 1
                while i >= 0
                    temp = lineOfSight.intersects(@borders[i])
                    intersection = if temp then temp else intersection
                    i--
                if intersection
                    foeMarker = @foeMarkers.getFirstDead()
                    foeMarker.reset()
                    foeMarker.cameraOffset.x = intersection.x - game.camera.x
                    foeMarker.cameraOffset.y = intersection.y - game.camera.y
            return
        ), this
    this