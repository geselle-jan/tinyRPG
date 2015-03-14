params = Phaser.Net::getQueryString()
game = undefined

toDungeon = ->
    game.state.states.Town.girl.player.position.setTo 2754, 2864
    return

if params.debug and params.debug == 'dungeon'
    game = new (Phaser.Game)(64 * 64, 64 * 64, Phaser.CANVAS, 'tinyRPG', {}, false, false)
else
    game = new (Phaser.Game)(960, 640, Phaser.CANVAS, 'tinyRPG', {}, false, false)
# add game states
game.state.add 'Boot', TinyRPG.Boot
game.state.add 'Default', TinyRPG.Default
game.state.add 'Preloader', TinyRPG.Preloader
game.state.add 'MainMenu', TinyRPG.MainMenu
game.state.add 'Town', TinyRPG.Town
game.state.add 'Dungeon', TinyRPG.Dungeon
game.state.add 'DungeonDebugger', TinyRPG.DungeonDebugger
# start the Boot state
game.state.start 'Boot'
$ ->
    $(window).konami
        code: [
            38
            38
            40
            40
            37
            39
            37
            39
        ]
        cheat: ->
            $('body').toggleClass 'retro'
            return
    return