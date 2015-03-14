Weapons::fireballs.blue.medium = iconFrame: 260

Weapons::fireballs.blue.medium.create = (weapons) ->
    that = this
    @damage =
        primary: 4
        secondary: 5
    @cost =
        primary: 0.75
        secondary: 35
    @fireCooldown = game.time.now
    @bullets = weapons.makeBullets(300)
    @bullets.forEach (bullet) ->
        bullet.animations.add 'flameBlueMedium', [
            259
            260
            261
            260
        ], 10, true
        bullet.animations.play 'flameBlueMedium'
        bullet.body.setSize 24, 24, 0, 16
        bullet.weapon = that
        return
    this

Weapons::fireballs.blue.medium.activeUpdatePrimary = (weapons) ->
    @girl = game.state.states[game.state.current].girl
    @player = @girl.player
    if game.time.elapsedSince(@fireCooldown) > 40 and @bullets.countDead() > 0 and @girl.costMana(@cost.primary)
        bullet = @bullets.getFirstDead()
        if bullet
            bullet.reset @player.body.center.x, @player.body.center.y - 16
            angle = game.physics.arcade.angleToPointer(bullet, game.input.activePointer)
            speed = 500
            angle = angle + game.rnd.realInRange(-0.5, 0.5)
            bullet.body.velocity.x = Math.cos(angle) * speed
            bullet.body.velocity.y = Math.sin(angle) * speed
            bullet.body.velocity.x = bullet.body.velocity.x + @player.body.velocity.x
            bullet.body.velocity.y = bullet.body.velocity.y + @player.body.velocity.y
            bullet.attack = 'primary'
            bullet.enemiesTouched = []
        @fireCooldown = game.time.now
    this

Weapons::fireballs.blue.medium.activeUpdateSecondary = (weapons) ->
    @girl = game.state.states[game.state.current].girl
    @player = @girl.player
    if game.time.elapsedSince(@fireCooldown) > 500 and @bullets.countDead() > 0 and @girl.costMana(@cost.secondary)
        amount = 36
        start = Math.PI * -1
        step = Math.PI / amount * 2
        i = amount
        while i > 0
            bullet = @bullets.getFirstDead()
            if bullet
                bullet.reset @player.body.center.x, @player.body.center.y - 16
                angle = start + i * step
                speed = 500
                bullet.body.velocity.x = Math.cos(angle) * speed
                bullet.body.velocity.y = Math.sin(angle) * speed
                bullet.body.velocity.x = bullet.body.velocity.x + @player.body.velocity.x
                bullet.body.velocity.y = bullet.body.velocity.y + @player.body.velocity.y
                bullet.attack = 'secondary'
            i--
        @fireCooldown = game.time.now
    this

Weapons::fireballs.blue.medium.passiveUpdate = (weapons) ->
    if game.mode == 'level'
        weapons.fireballs.unpauseProjectiles @bullets
    if game.mode != 'level'
        weapons.fireballs.pauseProjectiles @bullets
    this

Weapons::fireballs.blue.medium.hit = (shot, enemy) ->
    enemy.hitTimeout = game.time.now
    enemy.blendMode = PIXI.blendModes.ADD
    if shot.attack == 'primary'
        if shot.enemiesTouched.indexOf(enemy) == -1
            shot.enemiesTouched.push enemy
            enemy.damage shot.weapon.damage.primary
    else
        enemy.damage shot.weapon.damage.secondary
    return

Weapons::fireballs.blue.medium.collide = (collision) ->
    game.physics.arcade.overlap @bullets, collision, (shot) ->
        shot.kill()
        return
    this

Weapons::fireballs.blue.medium.hitTest = (enemies) ->
    game.physics.arcade.overlap @bullets, enemies.group, @hit
    this