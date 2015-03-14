Girl = ->
    this

Girl::create = ->
    map = game.map
    @scale = 4
    @weapons = new Weapons
    @weapons.create()
    @player = game.add.sprite(2 * 64, 2 * 64, 'tiny16')
    @movement = new PlayerMovement(this)
    if typeof game.player == 'undefined'
        game.player = {}
    if typeof game.player.health == 'undefined'
        game.player.health = 100
    if typeof game.player.mana == 'undefined'
        game.player.mana = 100
    if typeof game.player.xp == 'undefined'
        game.player.xp = 0
    if typeof game.player.maxMana == 'undefined'
        game.player.maxMana = 100
    if typeof game.player.manaRegeneration == 'undefined'
        game.player.manaPerSecond = 3
    if typeof game.player.lastManaRegeneration == 'undefined'
        game.player.lastManaRegeneration = false
    game.physics.enable @player
    @player.anchor.set 1
    @player.body.setSize 32, 32, -16, 0
    @player.body.x = 2 * 64
    @player.body.y = 2 * 64
    @player.body.collideWorldBounds = true
    @player.hitTimeout = false
    @playerPlaced = false
    if game.state.current == 'Town'
        @player.position.setTo 34 * 64, 33 * 64
    else
        randX = undefined
        randY = undefined
        desiredIndex = 105
        while !@playerPlaced
            randX = Helpers.GetRandom(0, map.width - 1)
            randY = Helpers.GetRandom(0, map.height - 1)
            if map.getTile(randX, randY) and map.getTile(randX, randY).index == desiredIndex
                @playerPlaced = true
                @player.position.setTo randX * map.tileWidth + map.tileWidth, randY * map.tileHeight + map.tileHeight
    @playerPlaced = false
    game.camera.follow @player
    game.camera.roundPx = false
    @movement.create()
    this

Girl::update = ->
    @regenerateMana()
    @movement.update()
    if game.mode == 'level'
        if @player.hitTimeout and game.time.now - @player.hitTimeout > 100
            @player.hitTimeout = false
            @player.blendMode = PIXI.blendModes.NORMAL
    @weapons.update()
    this

Girl::costMana = (cost) ->
    if game.player.mana - cost >= 0
        game.player.mana = game.player.mana - cost
        return true
    false

Girl::regenerateMana = ->
    if game.mode == 'level'
        if game.player.lastManaRegeneration
            game.player.mana += game.player.manaPerSecond * game.time.elapsedSecondsSince(game.player.lastManaRegeneration)
            if game.player.mana > game.player.maxMana
                game.player.mana = game.player.maxMana
            if game.player.mana < 0
                game.player.mana = 0
        game.player.lastManaRegeneration = game.time.now
    else
        game.player.lastManaRegeneration = false
    false