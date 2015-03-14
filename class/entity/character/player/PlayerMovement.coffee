PlayerMovement = (girl) ->
    @girl = girl
    @player = @girl.player
    this

PlayerMovement::create = ->
    @player.facing =
        up: false
        down: true
        left: false
        right: false
    @player.walking =
        up: false
        down: false
        left: false
        right: false
        any: false
    @addAnimations()
    @player.animations.play 'standDown'
    that = this
    game.controls.cursors.up.onDown.add ->
        if game.mode == 'level'
            if !that.player.walking.any
                that.player.facing.up = false
                that.player.facing.down = false
                that.player.facing.left = false
                that.player.facing.right = false
            that.player.facing.up = true
            that.player.walking.up = true
            that.player.walking.any = true
            that.player.animations.play 'standUp'
        return
    game.controls.cursors.down.onDown.add ->
        if game.mode == 'level'
            if !that.player.walking.any
                that.player.facing.up = false
                that.player.facing.down = false
                that.player.facing.left = false
                that.player.facing.right = false
            that.player.facing.down = true
            that.player.walking.down = true
            that.player.walking.any = true
            that.player.animations.play 'standDown'
        return
    game.controls.cursors.left.onDown.add ->
        if game.mode == 'level'
            if !that.player.walking.any
                that.player.facing.up = false
                that.player.facing.down = false
                that.player.facing.left = false
                that.player.facing.right = false
            that.player.facing.left = true
            that.player.walking.left = true
            that.player.walking.any = true
            that.player.animations.play 'standLeft'
        return
    game.controls.cursors.right.onDown.add ->
        if game.mode == 'level'
            if !that.player.walking.any
                that.player.facing.up = false
                that.player.facing.down = false
                that.player.facing.left = false
                that.player.facing.right = false
            that.player.facing.right = true
            that.player.walking.right = true
            that.player.walking.any = true
            that.player.animations.play 'standRight'
        return
    game.controls.cursors.up.onUp.add ->
        that.player.walking.up = false
        if !(!that.player.facing.down and !that.player.facing.left and !that.player.facing.right)
            that.player.facing.up = false
            if that.player.facing.right
                that.player.animations.play 'standRight'
            if that.player.facing.left
                that.player.animations.play 'standLeft'
        else
            that.player.walking.any = false
        return
    game.controls.cursors.down.onUp.add ->
        that.player.walking.down = false
        if !(!that.player.facing.up and !that.player.facing.left and !that.player.facing.right)
            that.player.facing.down = false
            if that.player.facing.right
                that.player.animations.play 'standRight'
            if that.player.facing.left
                that.player.animations.play 'standLeft'
        else
            that.player.walking.any = false
        return
    game.controls.cursors.left.onUp.add ->
        that.player.walking.left = false
        if !(!that.player.facing.up and !that.player.facing.down and !that.player.facing.right)
            that.player.facing.left = false
            if that.player.facing.up
                that.player.animations.play 'standUp'
            if that.player.facing.down
                that.player.animations.play 'standDown'
        else
            that.player.walking.any = false
        return
    game.controls.cursors.right.onUp.add ->
        that.player.walking.right = false
        if !(!that.player.facing.up and !that.player.facing.down and !that.player.facing.left)
            that.player.facing.right = false
            if that.player.facing.up
                that.player.animations.play 'standUp'
            if that.player.facing.down
                that.player.animations.play 'standDown'
        else
            that.player.walking.any = false
        return
    @speed = 200
    this

PlayerMovement::update = ->
    @player.body.velocity.x = 0
    @player.body.velocity.y = 0
    if game.mode == 'level'
        if @player.animations.paused
            @player.animations.paused = false
            if game.controls.cursors.up.isDown
                game.controls.cursors.up.onDown.dispatch()
            if game.controls.cursors.down.isDown
                game.controls.cursors.down.onDown.dispatch()
            if game.controls.cursors.left.isDown
                game.controls.cursors.left.onDown.dispatch()
            if game.controls.cursors.right.isDown
                game.controls.cursors.right.onDown.dispatch()
        x = 0
        y = 0
        angle = undefined
        speed = @speed
        if game.controls.cursors.up.isDown
            y -= 1
        if game.controls.cursors.down.isDown
            y += 1
        if game.controls.cursors.left.isDown
            x -= 1
        if game.controls.cursors.right.isDown
            x += 1
        if !(x == 0 and y == 0)
            if x == 1 and y == 0
                angle = 0
            if x == 1 and y == 1
                angle = 45
            if x == 0 and y == 1
                angle = 90
            if x == -1 and y == 1
                angle = 135
            if x == -1 and y == 0
                angle = 180
            if x == -1 and y == -1
                angle = 225
            if x == 0 and y == -1
                angle = 270
            if x == 1 and y == -1
                angle = 315
            if game.controls.shift.isDown and @girl.costMana(0.2)
                speed = speed * 2
            @player.body.velocity = game.physics.arcade.velocityFromAngle(angle, speed)
        if @player.walking.any and @player.animations.currentAnim.name.indexOf('walk') == -1
            switch @player.animations.currentAnim.name
                when 'standUp'
                    @player.animations.play 'walkUp'
                when 'standDown'
                    @player.animations.play 'walkDown'
                when 'standLeft'
                    @player.animations.play 'walkLeft'
                when 'standRight'
                    @player.animations.play 'walkRight'
                else
                    break
        if !@player.walking.any and @player.animations.currentAnim.name.indexOf('stand') == -1
            switch @player.animations.currentAnim.name
                when 'walkUp'
                    @player.animations.play 'standUp'
                when 'walkDown'
                    @player.animations.play 'standDown'
                when 'walkLeft'
                    @player.animations.play 'standLeft'
                when 'walkRight'
                    @player.animations.play 'standRight'
                else
                    break
    if game.mode != 'level' or game.inactive
        if !@player.animations.paused
            game.controls.cursors.up.onUp.dispatch()
            game.controls.cursors.down.onUp.dispatch()
            game.controls.cursors.left.onUp.dispatch()
            game.controls.cursors.right.onUp.dispatch()
            @player.animations.paused = true
    this

PlayerMovement::addAnimations = ->
    walkFPS = 4
    @player.animations.add 'standDown', [ 131 ], 0, false
    @player.animations.add 'walkDown', [
        132
        133
    ], walkFPS, true
    @player.animations.add 'standLeft', [ 147 ], 0, false
    @player.animations.add 'walkLeft', [
        148
        149
    ], walkFPS, true
    @player.animations.add 'standRight', [ 163 ], 0, false
    @player.animations.add 'walkRight', [
        164
        165
    ], walkFPS, true
    @player.animations.add 'standUp', [ 179 ], 0, false
    @player.animations.add 'walkUp', [
        180
        181
    ], walkFPS, true
    return