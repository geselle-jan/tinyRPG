// crosshair deg
	// create
        crosshair.deg = 0;
    // update
        crosshair.deg = game.math.radToDeg(game.physics.arcade.angleBetween(player.body.center, crosshair.body.center));

        if (crosshair.deg >= 45 && crosshair.deg < 135) {
            //player.animations.play('standDown');
        }

        if (crosshair.deg >= -45 && crosshair.deg < 45) {
            //player.animations.play('standRight');
        }

        if (crosshair.deg >= -135 && crosshair.deg < -45) {
            //player.animations.play('standUp');
        }

        if (crosshair.deg < -135 || crosshair.deg >= 135) {
            //player.animations.play('standLeft');
        }