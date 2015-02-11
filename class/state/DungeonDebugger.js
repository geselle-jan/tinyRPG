TinyRPG.DungeonDebugger = function(game){};
TinyRPG.DungeonDebugger.prototype = {
    create: function(){

        var params  = Phaser.Net.prototype.getQueryString();
        game.level = 1;

        if (params.level && params.level > 0) {
            game.level = params.level * 1;
        }

        game.mode = 'level';

        game.cache._tilemaps.level.data = DungeonGenerator.GetTiledJSON();

        game.stage.setBackgroundColor('#140C1C');

        map = game.add.tilemap('level');
        map.addTilesetImage('tiny16');

        collision = map.createLayer('tiny16');
        collision.resizeWorld();

    },
    update: function(){
    },
    render: function(){
    }
};