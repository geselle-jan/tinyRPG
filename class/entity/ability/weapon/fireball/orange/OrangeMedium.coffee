Weapons::fireballs.orange.medium = iconFrame: 257

Weapons::fireballs.orange.medium.create = (weapons) ->
    that = this
    @damage =
        primary: 10
        secondary: 20
    @cost =
        primary: 2
        secondary: 15
    @fireCooldown = game.time.now
    @bullets = weapons.makeBullets(50)
    @bullets.forEach (bullet) ->
        bullet.animations.add 'flameOrangeMedium', [
            256
            257
            258
            257
        ], 10, true
        bullet.animations.play 'flameOrangeMedium'
        bullet.body.setSize 24, 24, 0, 16
        bullet.weapon = that
        return
    this

Weapons::fireballs.orange.medium.activeUpdatePrimary = (weapons) ->
    @girl = game.state.states[game.state.current].girl
    @player = @girl.player
    if game.time.elapsedSince(@fireCooldown) > 500 and @bullets.countDead() > 0 and @girl.costMana(@cost.primary)
        bullet = @bullets.getFirstDead()
        bullet.reset @player.body.center.x, @player.body.center.y - 16
        game.physics.arcade.moveToPointer bullet, 300
        bullet.body.velocity.x = bullet.body.velocity.x + @player.body.velocity.x
        bullet.body.velocity.y = bullet.body.velocity.y + @player.body.velocity.y
        bullet.attack = 'primary'
        @fireCooldown = game.time.now
    this

Weapons::fireballs.orange.medium.activeUpdateSecondary = (weapons) ->
    @girl = game.state.states[game.state.current].girl
    @player = @girl.player
    if game.time.elapsedSince(@fireCooldown) > 500 and @bullets.countDead() > 0 and @girl.costMana(@cost.secondary)
        i = 0
        while i < 5
            bullet = @bullets.getFirstDead()
            bullet.reset @player.body.center.x, @player.body.center.y - 16
            game.physics.arcade.moveToPointer bullet, 200 + i * 100
            bullet.body.velocity.x = bullet.body.velocity.x + @player.body.velocity.x
            bullet.body.velocity.y = bullet.body.velocity.y + @player.body.velocity.y
            bullet.attack = 'secondary'
            i++
        @fireCooldown = game.time.now
    this

Weapons::fireballs.orange.medium.passiveUpdate = (weapons) ->
    if game.mode == 'level'
        weapons.fireballs.unpauseProjectiles @bullets
    if game.mode != 'level'
        weapons.fireballs.pauseProjectiles @bullets
    this

Weapons::fireballs.orange.medium.hit = (shot, enemy) ->
    shot.kill()
    enemy.hitTimeout = game.time.now
    enemy.blendMode = PIXI.blendModes.ADD
    enemy.damage shot.weapon.damage[shot.attack]
    return

Weapons::fireballs.orange.medium.collide = (collision) ->
    game.physics.arcade.overlap @bullets, collision, (shot) ->
        shot.kill()
        return
    this

Weapons::fireballs.orange.medium.hitTest = (enemies) ->
    game.physics.arcade.overlap @bullets, enemies.group, @hit
    this