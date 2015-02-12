var FoeView = function (options) {
    var defaultOptions = {
        color: '#ff0000',
        width: 2,
        height: 2,
        scale: 4,
        maxFoes: 100
    }

    if (typeof options == 'object') {
        options = $.extend(
            defaultOptions,
            options
        );
    } else {
        options = defaultOptions;
    }

    this.options = options;

    return this;
};

FoeView.prototype.create = function() {
    this.foeMarkers = game.add.group();
    this.foeMarkers.createMultiple(this.options.maxFoes, 'foemarker');
    this.foeMarkers.setAll('anchor.x', 0.5);
    this.foeMarkers.setAll('anchor.y', 0.5);
    this.foeMarkers.setAll('scale.x', this.options.scale);
    this.foeMarkers.setAll('scale.y', this.options.scale);
    this.foeMarkers.setAll('fixedToCamera', true);

    return this;
};

FoeView.prototype.update = function() {
    if (game.mode == 'level') {
        this.foeMarkers.forEachAlive(function(foeMarker) {
            foeMarker.kill();
        }, this);
    }

    return this;
};

FoeView.prototype.updateGroup = function(group) {
    if (game.controls.f.isDown && game.mode == 'level') {

        var topLeft = {
                x: game.camera.x,
                y: game.camera.y
            },
            topRight = {
                x: game.camera.x + game.camera.width,
                y: game.camera.y
            },
            bottomLeft = {
                x: game.camera.x,
                y: game.camera.y + game.camera.height
            },
            bottomRight = {
                x: game.camera.x + game.camera.width,
                y: game.camera.y + game.camera.height
            },
            lineOfSight,
            foeMarker,
            temp,
            player = game.state.states[game.state.current].girl.player,
            intersection = false;

        this.borders = [
            new Phaser.Line( // top
                topLeft.x, topLeft.y,
                topRight.x, topRight.y
            ),
            new Phaser.Line( // right
                topRight.x, topRight.y,
                bottomRight.x, bottomRight.y
            ),
            new Phaser.Line( // bottom
                bottomRight.x, bottomRight.y,
                bottomLeft.x, bottomLeft.y
            ),
            new Phaser.Line( // left
                bottomLeft.x, bottomLeft.y,
                topLeft.x, topLeft.y
            )
        ];

        group.forEachAlive(function(foe) {
            if (this.foeMarkers.countDead() > 0) {
                lineOfSight = new Phaser.Line(
                    player.body.center.x, player.body.center.y,
                    foe.body.center.x, foe.body.center.y
                );

                for (var i = this.borders.length - 1; i >= 0; i--) {
                    temp = lineOfSight.intersects(this.borders[i]);
                    intersection = temp ? temp : intersection;
                }

                if (intersection) {
                    foeMarker = this.foeMarkers.getFirstDead();
                    foeMarker.reset();
                    foeMarker.cameraOffset.x = intersection.x - game.camera.x;
                    foeMarker.cameraOffset.y = intersection.y - game.camera.y;
                }
            }
        }, this);
        
    }

    return this;
};