Weapons::fireballs = {}

Weapons::fireballs.create = (weapons) ->
    weapons.fireballs.orange.create weapons
    weapons.fireballs.blue.create weapons
    this

Weapons::fireballs.activeUpdatePrimary = (weapons) ->
    weapons.fireballs.orange.activeUpdatePrimary weapons
    weapons.fireballs.blue.activeUpdatePrimary weapons
    this

Weapons::fireballs.activeUpdateSecondary = (weapons) ->
    weapons.fireballs.orange.activeUpdateSecondary weapons
    weapons.fireballs.blue.activeUpdateSecondary weapons
    this

Weapons::fireballs.passiveUpdate = (weapons) ->
    weapons.fireballs.orange.passiveUpdate weapons
    weapons.fireballs.blue.passiveUpdate weapons
    this

Weapons::fireballs.pauseProjectiles = (bullets) ->
    bullets.forEach (bullet) ->
        if !bullet.animations.paused
            bullet.body.savedVelocity = {}
            bullet.body.savedVelocity.x = bullet.body.velocity.x
            bullet.body.savedVelocity.y = bullet.body.velocity.y
            bullet.body.velocity.x = 0
            bullet.body.velocity.y = 0
            bullet.animations.paused = true
        return
    this

Weapons::fireballs.unpauseProjectiles = (bullets) ->
    bullets.forEach (bullet) ->
        if bullet.animations.paused and bullet.body.savedVelocity
            bullet.body.velocity.x = bullet.body.savedVelocity.x
            bullet.body.velocity.y = bullet.body.savedVelocity.y
            bullet.body.savedVelocity = false
            bullet.animations.paused = false
        return
    this

Weapons::fireballs.collide = (collision) ->
    @orange.collide collision
    @blue.collide collision
    this

Weapons::fireballs.hitTest = (enemies) ->
    @orange.hitTest enemies
    @blue.hitTest enemies
    this