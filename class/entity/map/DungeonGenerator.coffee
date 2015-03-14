DungeonGenerator = 
    map: null
    map_size: 64
    rooms: []
    Generate: ->
        @map = null
        @map_size = @options.size
        @rooms = []
        @map = []
        x = 0
        while x < @map_size
            @map[x] = []
            y = 0
            while y < @map_size
                @map[x][y] = 0
                y++
            x++
        room_count = Helpers.GetRandom(@options.rooms.count.min, @options.rooms.count.max)
        min_size = @options.rooms.size.min
        max_size = @options.rooms.size.max
        i = 0
        while i < room_count
            room = {}
            room.x = Helpers.GetRandom(1, @map_size - max_size - 1)
            room.y = Helpers.GetRandom(1, @map_size - max_size - 1)
            room.w = Helpers.GetRandom(min_size, max_size)
            room.h = Helpers.GetRandom(min_size, max_size)
            room.connected = []
            room.id = i
            if @DoesCollide(room)
                continue
            room.w--
            room.h--
            @rooms.push room
            i++
        @SquashRooms()
        i = 0
        while i < room_count
            roomA = @rooms[i]
            roomB = @FindClosestRoom(roomA)
            if !roomB
                i++
                continue
            pointA =
                x: Helpers.GetRandom(roomA.x, roomA.x + roomA.w)
                y: Helpers.GetRandom(roomA.y, roomA.y + roomA.h)
            pointB =
                x: Helpers.GetRandom(roomB.x, roomB.x + roomB.w)
                y: Helpers.GetRandom(roomB.y, roomB.y + roomB.h)
            while pointB.x != pointA.x or pointB.y != pointA.y
                if pointB.x != pointA.x
                    if pointB.x > pointA.x
                        pointB.x--
                    else
                        pointB.x++
                else if pointB.y != pointA.y
                    if pointB.y > pointA.y
                        pointB.y--
                    else
                        pointB.y++
                @map[pointB.x][pointB.y] = 1
            i++
        i = 0
        while i < room_count
            room = @rooms[i]
            x = room.x
            while x < room.x + room.w
                y = room.y
                while y < room.y + room.h
                    @map[x][y] = 1
                    y++
                x++
            i++
        x = 0
        while x < @map_size
            y = 0
            while y < @map_size
                if @map[x][y] == 1
                    xx = x - 1
                    while xx <= x + 1
                        yy = y - 1
                        while yy <= y + 1
                            if @map[xx][yy] == 0
                                @map[xx][yy] = 2
                            yy++
                        xx++
                y++
            x++
        @RemoveClutter()
        @RemoveClutter()
        return
    FindClosestRoom: (room) ->
        mid = 
            x: room.x + room.w / 2
            y: room.y + room.h / 2
        closest = null
        closest_distance = 1000
        i = 0
        while i < @rooms.length
            check = @rooms[i]
            if check == room
                i++
                continue
            if check.connected.indexOf(room.id) != -1
                i++
                continue
            check_mid = 
                x: check.x + check.w / 2
                y: check.y + check.h / 2
            distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2))
            if distance < closest_distance
                closest_distance = distance
                closest = check
            i++
        if closest
            closest.connected.push room.id
            room.connected.push closest.id
        closest
    SquashRooms: ->
        i = 0
        while i < 10
            j = 0
            while j < @rooms.length
                room = @rooms[j]
                loop
                    old_position = 
                        x: room.x
                        y: room.y
                    if room.x > 32
                        room.x--
                    if room.y > 32
                        room.y--
                    if room.x < 32
                        room.x++
                    if room.y < 32
                        room.y++
                    if room.x == 32 and room.y == 32
                        break
                    if @DoesCollide(room, j)
                        room.x = old_position.x
                        room.y = old_position.y
                        break
                j++
            i++
        return
    RemoveClutter: ->
        y = 0
        while y < @map_size
            x = 0
            while x < @map_size
                tile = @map[x][y]
                if tile == 2
                    if @map[x - 1] and @map[x + 1] and @map[x - 1][y] == 1 and @map[x + 1][y] == 1
                        @map[x][y] = 1
                    if @map[x][y - 1] == 1 and @map[x][y + 1] == 1
                        @map[x][y] = 1
                    if @map[x][y - 1] == 1 and @map[x][y + 1] == 2 and @map[x][y + 2] == 1
                        @map[x][y] = 1
                        @map[x][y + 1] = 1
                x++
            y++
        return
    DoesCollide: (room, ignore) ->
        i = 0
        while i < @rooms.length
            if i == ignore
                i++
                continue
            check = @rooms[i]
            if !(room.x + room.w + 2 < check.x or room.x > check.x + check.w + 2 or room.y + room.h + 3 < check.y or room.y > check.y + check.h + 3)
                return true
            i++
        false
    CheckReachability: ->
        reachable = true
        done = false
        roomsReached = []
        roomsReachedCount = undefined
        reachableCount = undefined
        retryCount = 3
        roomsReached[0] = @rooms[0]
        while retryCount > 0
            roomsReachedCount = 0
            index = 0
            while index < roomsReached.length
                if roomsReached[index]
                    roomsReachedCount++
                index++
            if roomsReachedCount == reachableCount
                retryCount--
                reachable = reachableCount == @rooms.length
            reachableCount = roomsReachedCount
            i = roomsReached.length - 1
            while i >= 0
                if roomsReached[i]
                    j = roomsReached[i].connected.length - 1
                    while j >= 0
                        roomsReached[roomsReached[i].connected[j]] = @rooms[roomsReached[i].connected[j]]
                        j--
                i--
        reachable
    GetOptionsByLevel: (level) ->
        options = 
            size: 64
            rooms:
                count:
                    min: 5
                    max: 10
                size:
                    min: 5
                    max: 15
        i = undefined
        if !level
            return options
        i = if level < 16 then level else 15
        options.rooms.count.min = 2
        options.rooms.count.max = 3
        while i > 1
            options.rooms.count.min += 0.5
            options.rooms.count.max += 1
            i--
        options.rooms.count.min = Math.round(options.rooms.count.min)
        options.rooms.count.max = Math.round(options.rooms.count.max)
        options
    GetWalkableGrid: (json) ->
        width = json.layers[0].width
        layer = json.layers[0].data
        walkableIndex = 105
        walkableGrid = []
        currentRow = 0
        walkable = undefined
        i = 0
        while i < layer.length
            currentRow = Math.floor(i / width)
            if !walkableGrid[currentRow]
                walkableGrid[currentRow] = []
            walkable = if layer[i] == walkableIndex then 0 else 1
            walkableGrid[currentRow].push walkable
            i++
        walkableGrid
    GetTiledJSON: (options) ->
        defaults = @GetOptionsByLevel(game.level)
        @options = $.extend({}, defaults, options or {})
        if !@options.empty
            @Generate()
            while !@CheckReachability()
                @Generate()
        json = 
            'backgroundcolor': '#292634'
            'height': 64
            'layers': [ {
                'data': []
                'height': 64
                'name': 'tiny16'
                'opacity': 1
                'type': 'tilelayer'
                'visible': true
                'width': 64
                'x': 0
                'y': 0
            } ]
            'orientation': 'orthogonal'
            'properties': {}
            'renderorder': 'right-down'
            'tileheight': 64
            'tilesets': [ {
                'firstgid': 1
                'image': '../tilesets/tiny16.png'
                'imageheight': 1024
                'imagewidth': 1024
                'margin': 0
                'name': 'tiny16'
                'properties': {}
                'spacing': 0
                'tileheight': 64
                'tilewidth': 64
            } ]
            'tilewidth': 64
            'version': 1
            'width': 64
        if !@options.empty
            y = 0
            while y < @map_size
                x = 0
                while x < @map_size
                    tile = @map[x][y]
                    if tile == 0
                        if @map[x][y + 1] == 2 and @map[x][y + 2] == 1
                            json.layers[0].data.push 117
                            # border top
                        else
                            json.layers[0].data.push 0
                            # black collision
                    else if tile == 1
                        json.layers[0].data.push 105
                        # ground
                    else
                        if @map[x][y + 1] == 1
                            json.layers[0].data.push 104
                            # horizontal wall
                        else if @map[x][y - 1] == 1 and (@map[x][y + 1] == 0 or @map[x][y + 1] == 2 and @map[x][y + 2] == 1)
                            json.layers[0].data.push 85
                            # border bottom
                        else if (@map[x - 1] and @map[x - 1][y] == 1 and @map[x][y - 1] == 2 or @map[x - 1] and @map[x - 1][y] == 2 and @map[x - 1][y + 1] == 1) and @map[x][y + 1] == 2 and @map[x][y + 2] == 1
                            json.layers[0].data.push 116
                            # border right top
                        else if @map[x - 1] and @map[x - 1][y] == 1 and @map[x][y - 1] == 2 or @map[x - 1] and @map[x - 1][y] == 2 and @map[x - 1][y + 1] == 1
                            json.layers[0].data.push 100
                            # border right
                        else if (@map[x + 1] and @map[x + 1][y] == 1 and @map[x][y - 1] == 2 or @map[x + 1] and @map[x + 1][y] == 2 and @map[x + 1][y + 1] == 1) and @map[x][y + 1] == 2 and @map[x][y + 2] == 1
                            json.layers[0].data.push 118
                            # border left top
                        else if @map[x + 1] and @map[x + 1][y] == 1 and @map[x][y - 1] == 2 or @map[x + 1] and @map[x + 1][y] == 2 and @map[x + 1][y + 1] == 1
                            json.layers[0].data.push 102
                            # border left
                        else if @map[x + 1] and @map[x + 1][y] == 1 and @map[x][y - 1] == 1
                            json.layers[0].data.push 86
                            # border left bottom
                        else if @map[x - 1] and @map[x - 1][y] == 1 and @map[x][y - 1] == 1
                            json.layers[0].data.push 84
                            # border right bottom
                        else
                            json.layers[0].data.push 0
                            # vertical wall
                    x++
                y++
        json.walkableGrid = @GetWalkableGrid(json)
        json