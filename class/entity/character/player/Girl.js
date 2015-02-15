var Girl = function () {

    return this;    
};

Girl.prototype.create = function() {

    this.scale = 4;
    this.weapons = new Weapons();
    this.weapons.create();
    this.player = game.add.sprite(2*64, 2*64,'tiny16');
    this.movement = new PlayerMovement(this);
    if (typeof game.player == 'undefined') {
        game.player = {};
    }
    if (typeof game.player.health == 'undefined') {
        game.player.health = 100;
    }
    if (typeof game.player.mana == 'undefined') {
        game.player.mana = 100;
    }
    if (typeof game.player.xp == 'undefined') {
        game.player.xp = 0;
    }
    if (typeof game.player.maxMana == 'undefined') {
        game.player.maxMana = 100;
    }
    if (typeof game.player.manaRegeneration == 'undefined') {
        game.player.manaPerSecond = 300;
    }
    if (typeof game.player.lastManaRegeneration == 'undefined') {
        game.player.lastManaRegeneration = false;
    }

    game.physics.enable(this.player);
    this.player.anchor.set(1);
    this.player.body.setSize(32,32,-16,0);
    this.player.body.x = 2 * 64;
    this.player.body.y = 2 * 64;
    this.player.body.collideWorldBounds = true;
    this.player.hitTimeout = false;

    this.playerPlaced = false;

    if (game.state.current == 'Town') {
        this.player.position.setTo(34 * 64, 33 * 64);
    } else {
        var randX,
            randY,
            desiredIndex = 105;

        while (!this.playerPlaced) {
            randX = Helpers.GetRandom(0,map.width-1);
            randY = Helpers.GetRandom(0,map.height-1);
            if (map.getTile(randX,randY) && map.getTile(randX,randY).index == desiredIndex) {
                this.playerPlaced = true;
                this.player.position.setTo(randX * map.tileWidth + map.tileWidth, randY * map.tileHeight + map.tileHeight);
            }
        }
    }

    this.playerPlaced = false;

    game.camera.follow(this.player);
    game.camera.roundPx = false;

    this.movement.create();

    return this;
};

Girl.prototype.update = function() {

    this.regenerateMana();

    this.movement.update();

    if (game.mode == 'level') {

        if (this.player.hitTimeout && game.time.now - this.player.hitTimeout > 100) {
            this.player.hitTimeout = false;
            this.player.blendMode = PIXI.blendModes.NORMAL;
        }

    }

    this.weapons.update();

    return this;
};

Girl.prototype.costMana = function(cost) {
    if (game.player.mana - cost >= 0) {
        game.player.mana = game.player.mana - cost;
        return true;
    }
    return false;
};

Girl.prototype.regenerateMana = function() {
    if (game.mode == 'level') {
        if (game.player.lastManaRegeneration) {
            game.player.mana += game.player.manaPerSecond * game.time.elapsedSecondsSince(
                game.player.lastManaRegeneration
            );

            if (game.player.mana > game.player.maxMana) {
                game.player.mana = game.player.maxMana;
            }
            if (game.player.mana < 0) {
                game.player.mana = 0;
            }
        }
        game.player.lastManaRegeneration = game.time.now;
    } else {
        game.player.lastManaRegeneration = false;
    }

    return false;
};













