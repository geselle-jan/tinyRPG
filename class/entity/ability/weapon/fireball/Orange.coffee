Weapons::fireballs.orange = {}

Weapons::fireballs.orange.create = (weapons) ->
    weapons.fireballs.orange.medium.create weapons
    this

Weapons::fireballs.orange.activeUpdatePrimary = (weapons) ->
    weapons.fireballs.orange.medium.activeUpdatePrimary weapons
    this

Weapons::fireballs.orange.activeUpdateSecondary = (weapons) ->
    weapons.fireballs.orange.medium.activeUpdateSecondary weapons
    this

Weapons::fireballs.orange.passiveUpdate = (weapons) ->
    weapons.fireballs.orange.medium.passiveUpdate weapons
    this

Weapons::fireballs.orange.collide = (collision) ->
    @medium.collide collision
    this

Weapons::fireballs.orange.hitTest = (enemies) ->
    @medium.hitTest enemies
    this