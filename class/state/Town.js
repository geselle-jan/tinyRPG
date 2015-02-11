TinyRPG.Town = function(game){};
TinyRPG.Town.prototype = {
    create: function(){
        game.mode = 'level';

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.setBackgroundColor('#140C1C');

        this.map = game.add.tilemap('town');
        this.map.addTilesetImage('tiny16');
        this.map.addTilesetImage('collision');
        this.map.setCollision([1]);

        this.collision = this.map.createLayer('collision');
        this.collision.resizeWorld();
        this.collision.visible = false;

        this.map.createLayer('deco3');
        this.map.createLayer('deco2');
        this.map.createLayer('deco1');
        this.map.createLayer('deco0');

        this.girl = new Girl();
        this.girl.create();

        this.stateChange = false;

        this.waterTimer = 0;
        this.fireplaceTimer = 0;
        this.torchTimer = 0;

        game.input.onDown.add(function () {
            var e,
                x,
                y,
                tile,
                line;
            if (game.mode == 'level') {
                for (var i = this.events.length - 1; i >= 0; i--) {
                    e = this.events[i];
                    if (e.trigger.type == 'onTileClick') {
                        x = Math.floor(game.input.worldX / 64);
                        y = Math.floor(game.input.worldY / 64);
                        console.log(x,y);
                        if (e.trigger.location.x == x && e.trigger.location.y == y) {
                            if (typeof e.trigger.layer != 'undefined') {
                                tile = game.state.states[game.state.current].map.getTile( x, y, e.trigger.layer);
                                console.log(tile.index);
                            }
                            if (typeof e.trigger.maxDistance != 'undefined') {
                                line = new Phaser.Line(
                                    this.girl.player.x - this.girl.player.width / 2,
                                    this.girl.player.y - this.girl.player.height / 2,
                                    (x * 64) + 32,
                                    (y * 64) + 32
                                );
                            }
                            if (
                                (typeof e.trigger.layer == 'undefined' || tile.index == e.trigger.index)
                                &&
                                (typeof e.trigger.maxDistance == 'undefined' || line.length <= e.trigger.maxDistance)
                            ) {
                                // event shall be dispatched

                                if (e.action.type == 'textbox') {
                                    game.ui.textbox.show(e.action.text);
                                }

                                // event finished dispatching
                            }
                        }
                    }
                }
            }
        }, this);

        game.state.states.Default.create();

    },
    update: function(){

        var that = this;

        game.state.states.Default.update();

        game.ui.crosshair.update();

        this.girl.update();

        if (game.mode == 'level') {

            if (this.torchTimer == 0) {
                this.map.swap(214, 213, undefined, undefined, undefined, undefined, 'deco2');
                this.torchTimer = 64;
            } else if (this.torchTimer == 16) {
                this.map.swap(213, 214, undefined, undefined, undefined, undefined, 'deco2');
            } else if (this.torchTimer == 32) {
                this.map.swap(214, 215, undefined, undefined, undefined, undefined, 'deco2');
            } else if (this.torchTimer == 48) {
                this.map.swap(215, 214, undefined, undefined, undefined, undefined, 'deco2');
            }

            this.torchTimer--;

            if (this.fireplaceTimer == 0) {
                this.map.swap(89, 88, undefined, undefined, undefined, undefined, 'deco3');
                this.fireplaceTimer = 64;
            } else if (this.fireplaceTimer == 16) {
                this.map.swap(88, 89, undefined, undefined, undefined, undefined, 'deco3');
            } else if (this.fireplaceTimer == 32) {
                this.map.swap(89, 90, undefined, undefined, undefined, undefined, 'deco3');
            } else if (this.fireplaceTimer == 48) {
                this.map.swap(90, 89, undefined, undefined, undefined, undefined, 'deco3');
            }

            this.fireplaceTimer--;

            if (this.waterTimer == 0) {
                this.map.swap(134, 135, undefined, undefined, undefined, undefined, 'deco2');
                this.waterTimer = 60;
            }


            this.waterTimer--;

        }
        

        if (this.stateChange) {
            this.stateChange();
        }

        game.physics.arcade.collide(this.girl.player, this.collision, function (a1, a2) {
            if (a2.x == 42 && a2.y == 43) {
                that.stateChange = function () {
                    game.state.start('Dungeon', true);
                    game.state.clearCurrentState();
                }
            }
        });

        game.physics.arcade.overlap(this.girl.bullets, this.collision, function(shot) {
            shot.kill();
        });

    },
    render: function(){
        /*
        game.debug.body(girl.player);
        for (var i = skeletons.children.length - 1; i >= 0; i--) {
            game.debug.body(skeletons.children[i]);
        };
        var bullets = game.state.states[game.state.current].girl.bullets;
        for (var i = bullets.children.length - 1; i >= 0; i--) {
            if (bullets.children[i].alive) {
                game.debug.body(bullets.children[i]);
            }
        };
        */
        
    },
    events: [
        {
            name: 'home_sign',
            trigger: {
                type: 'onTileClick',
                location: {
                    x: 33,
                    y: 34
                },
                maxDistance: 127,
                layer: 'deco2',
                index: 97
            },
            action: {
                type: 'textbox',
                text: 'You stand in front of your house\nreading your own address.\n\nWhat a pointless waste of time...'
            }
        },
        {
            name: 'dungeon_sign',
            trigger: {
                type: 'onTileClick',
                location: {
                    x: 43,
                    y: 45
                },
                maxDistance: 127,
                layer: 'deco2',
                index: 97
            },
            action: {
                type: 'textbox',
                text: 'Evil Dungeon of Eternal Darkness'
            }
        },
        {
            name: 'townhall_sign',
            trigger: {
                type: 'onTileClick',
                location: {
                    x: 16,
                    y: 20
                },
                maxDistance: 127,
                layer: 'deco2',
                index: 97
            },
            action: {
                type: 'textbox',
                text: 'Town Hall'
            }
        },
        {
            name: 'shop_sign',
            trigger: {
                type: 'onTileClick',
                location: {
                    x: 17,
                    y: 31
                },
                maxDistance: 127,
                layer: 'deco2',
                index: 97
            },
            action: {
                type: 'textbox',
                text: 'Shop'
            }
        },
        {
            name: 'lodging_sign',
            trigger: {
                type: 'onTileClick',
                location: {
                    x: 13,
                    y: 39
                },
                maxDistance: 127,
                layer: 'deco2',
                index: 97
            },
            action: {
                type: 'textbox',
                text: 'Night\'s Lodging'
            }
        },
        {
            name: 'shop_dialog',
            trigger: {
                type: 'onTileClick',
                location: {
                    x: 15,
                    y: 26
                },
                maxDistance: 127,
                layer: 'deco0',
                index: 136
            },
            action: {
                type: 'textbox',
                text: 'His cold dead eyes are staring at you.\nHe doesn\'t say a word.'
            }
        }
    ]
};