StatusInfo = ->
    this

StatusInfo::create = ->
    @background = game.add.sprite(0, 0, 'statusinfo')
    @background.scale.setTo 4
    @background.fixedToCamera = true
    @background.cameraOffset.x = 0
    @background.cameraOffset.y = game.camera.height - @background.height
    @background.visible = false
    @makeBar 'health', '#D04648', 39, 155
    @makeBar 'mana', '#597DCE', 111, 155
    @makeBar 'xp', '#6CAA2C', 183, 155
    @currentWeapon = game.add.sprite(0, 0, 'tiny16')
    @currentWeapon.fixedToCamera = true
    @currentWeapon.cameraOffset.x = 2 * 4
    @currentWeapon.cameraOffset.y = 142 * 4
    @currentWeapon.visible = false
    this

StatusInfo::update = ->
    if typeof game.state.states[game.state.current].girl == 'undefined' or typeof game.player == 'undefined' or typeof game.player.health == 'undefined'
        @background.visible = false
        @healthbar.visible = false
        @manabar.visible = false
        @xpbar.visible = false
        @currentWeapon.visible = false
    else
        @background.visible = true
        @healthbar.visible = true
        @manabar.visible = true
        @xpbar.visible = true
        @currentWeapon.visible = true
        @healthbar.width = Math.ceil(game.player.health / 2) * 4
        @manabar.width = Math.ceil(game.player.mana / 2) * 4
        @xpbar.width = Math.ceil(game.player.xp / 2) * 4
        @currentWeapon.frame = game.player.activeWeapon.iconFrame
    this

StatusInfo::makeBar = (name, color, x, y) ->
    @['bmd' + name] = game.add.bitmapData(50, 3)
    @['bmd' + name].context.fillStyle = color
    @['bmd' + name].context.fillRect 0, 0, 50, 3
    @[name + 'bar'] = game.add.sprite(0, 0, @['bmd' + name])
    @[name + 'bar'].scale.setTo 4
    @[name + 'bar'].fixedToCamera = true
    @[name + 'bar'].cameraOffset.x = x * 4
    @[name + 'bar'].cameraOffset.y = y * 4
    @[name + 'bar'].visible = false
    this