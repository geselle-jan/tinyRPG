var Controls = function () {
    this.up             = false;
    this.down           = false;
    this.left           = false;
    this.right          = false;

    this.f              = false;

    this.primary        = false;
    this.secondary      = false;

    this.x              = 0;
    this.y              = 0;
    this.worldX         = 0;
    this.worldY         = 0;
    this.cursors        = {};
    this.formerMouse    = -1;
    return this;    
};

Controls.prototype.create = function() {
    this.cursors.up     = game.input.keyboard.addKey(
        Phaser.Keyboard.W
    );
    this.cursors.left   = game.input.keyboard.addKey(
        Phaser.Keyboard.A
    );
    this.cursors.down   = game.input.keyboard.addKey(
        Phaser.Keyboard.S
    );
    this.cursors.right  = game.input.keyboard.addKey(
        Phaser.Keyboard.D
    );
    this.shift          = game.input.keyboard.addKey(
        Phaser.Keyboard.SHIFT
    );
    this.f              = game.input.keyboard.addKey(
        Phaser.Keyboard.F
    );

    return this;
};

Controls.prototype.update = function() {
     if (game.input.mouse.button != -1 || this.fomerMouse > -1) {
        if(game.input.mouse.button < 0 && this.fomerMouse == 0) {
                this.primary = false;
        } else if(game.input.mouse.button < 0 && this.fomerMouse == 2) {
                this.secondary = false;
        } else {
            if (game.input.mouse.button == 0 && this.fomerMouse != game.input.mouse.button) {
                this.secondary = false;
                this.primary = true;
            } else if (game.input.mouse.button == 2 && this.fomerMouse != game.input.mouse.button) {
                this.primary = false;
                this.secondary = true;
            }
        }
        this.fomerMouse = game.input.mouse.button;
    }

    this.worldX = game.input.activePointer.worldX;
    this.worldY = game.input.activePointer.worldY;
    this.x      = game.input.activePointer.x;
    this.y      = game.input.activePointer.y;

    this.up     = this.cursors.up.isDown;
    this.down   = this.cursors.down.isDown;
    this.left   = this.cursors.left.isDown;
    this.right  = this.cursors.right.isDown;

    return this;
};