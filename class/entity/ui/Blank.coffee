class Blank

    constructor: (options = {}) ->
        visible = options.visible ? no
        @color = options.color ? '#17091C'
        @speed = options.speed ? 400
        @width = 240
        @height = 160
        @x = 0
        @y = 0
        @scale = 4
        @bmd = game.add.bitmapData @width, @height
        @bmd.context.fillStyle = @color
        @bmd.context.fillRect 0, 0, @width, @height
        @sprite = game.add.sprite 0, 0, @bmd
        @sprite.scale.setTo @scale
        @sprite.fixedToCamera = yes
        @sprite.cameraOffset.x = @x * @scale
        @sprite.cameraOffset.y = @y * @scale
        @sprite.visible = visible
        @sprite.alpha = if visible then 1 else 0

    isFading: ->
        0 < @sprite.alpha < 1

    show: ->
        return if @isFading()
        @sprite.alpha = 1
        @sprite.visible = yes

    hide: ->
        return if @isFading()
        @sprite.alpha = 0
        @sprite.visible = no

    fadeTo: (callback) ->
        return unless @sprite.alpha is 0
        @sprite.bringToTop()
        @sprite.visible = yes
        fade = game.add.tween @sprite
        fade.to { alpha: 1 }, @speed
        if callback
            fade.onComplete.add callback, @
        fade.start()
        @

    fadeFrom: (callback) ->
        return unless @sprite.alpha is 1
        fade = game.add.tween @sprite
        fade.to { alpha: 0 }, @speed
        fade.onComplete.add (->
            @sprite.visible = no
            if callback
                callback()
        ), @
        fade.start()
        @