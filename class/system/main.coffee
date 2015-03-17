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
            38# up
            38# up
            40# down
            40# down
            37# left
            39# right
            37# left
            39# right
        ]
        cheat: ->
            $('body').toggleClass 'retro'
    $(window).konami
        code: [
            84# t
            79# o
            68# d
            85# u
            78# n
            71# g
            69# e
            79# o
            78# n
        ]
        cheat: ->
            toDungeon()
    $(window).konami
        code: [
            84# t
            72# h
            69# e
            82# r
            69# e
            73# i
            83# s
            78# n
            79# o
            83# s
            80# p
            79# o
            79# o
            78# n
        ]
        cheat: ->
            setInterval (->
              game.player.mana = 100
            ), 1000