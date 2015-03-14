Weapons::fireballs.blue = {}

Weapons::fireballs.blue.create = (weapons) ->
    weapons.fireballs.blue.medium.create weapons
    this

Weapons::fireballs.blue.activeUpdatePrimary = (weapons) ->
    weapons.fireballs.blue.medium.activeUpdatePrimary weapons
    this

Weapons::fireballs.blue.activeUpdateSecondary = (weapons) ->
    weapons.fireballs.blue.medium.activeUpdateSecondary weapons
    this

Weapons::fireballs.blue.passiveUpdate = (weapons) ->
    weapons.fireballs.blue.medium.passiveUpdate weapons
    this

Weapons::fireballs.blue.collide = (collision) ->
    @medium.collide collision
    this

Weapons::fireballs.blue.hitTest = (enemies) ->
    @medium.hitTest enemies
    this