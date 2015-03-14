Weapons = ->
    if typeof game.player == 'undefined'
        game.player = {}
    if typeof game.player.activeWeapon == 'undefined'
        game.player.activeWeapon = @fireballs.orange.medium
    @aquired = [
        @fireballs.orange.medium
        @fireballs.blue.medium
    ]
    this

Weapons::create = ->
    @fireballs.create this
    game.controls.e.onDown.add (->
        @next()
        return
    ), this
    this

Weapons::update = ->
    if game.state.current != 'Town' and game.mode == 'level'
        if game.controls.primary
            game.player.activeWeapon.activeUpdatePrimary this
        if game.controls.secondary
            game.player.activeWeapon.activeUpdateSecondary this
    @fireballs.passiveUpdate this
    this

Weapons::makeBullets = (amount) ->
    bullets = undefined
    bullets = game.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple amount, 'tiny16'
    bullets.setAll 'checkWorldBounds', true
    bullets.setAll 'outOfBoundsKill', true
    bullets.setAll 'anchor.x', 0.5
    bullets.setAll 'anchor.y', 0.5
    bullets

Weapons::collide = (collision) ->
    @fireballs.collide collision
    this

Weapons::hitTest = (enemies) ->
    @fireballs.hitTest enemies
    this

Weapons::next = ->
    currentIndex = @aquired.indexOf(game.player.activeWeapon)
    maxIndex = @aquired.length - 1
    nextIndex = currentIndex + 1
    if nextIndex > maxIndex
        nextIndex = 0
    game.player.activeWeapon = @aquired[nextIndex]
    this