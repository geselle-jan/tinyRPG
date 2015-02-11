var DungeonGenerator = {
    map: null,
    map_size: 64,
    rooms: [],
    Generate: function () {
        this.map = null;
        this.map_size = this.options.size;
        this.rooms = [];
        this.map = [];
        for (var x = 0; x < this.map_size; x++) {
            this.map[x] = [];
            for (var y = 0; y < this.map_size; y++) {
                this.map[x][y] = 0;
            }
        }

        var room_count = Helpers.GetRandom(this.options.rooms.count.min, this.options.rooms.count.max);
        var min_size = this.options.rooms.size.min;
        var max_size = this.options.rooms.size.max;

        for (var i = 0; i < room_count; i++) {
            var room = {};

            room.x = Helpers.GetRandom(1, this.map_size - max_size - 1);
            room.y = Helpers.GetRandom(1, this.map_size - max_size - 1);
            room.w = Helpers.GetRandom(min_size, max_size);
            room.h = Helpers.GetRandom(min_size, max_size);
            room.connected = [];
            room.id = i;

            if (this.DoesCollide(room)) {
                i--;
                continue;
            }
            room.w--;
            room.h--;

            this.rooms.push(room);
        }

        this.SquashRooms();

        for (i = 0; i < room_count; i++) {
            var roomA = this.rooms[i];
            var roomB = this.FindClosestRoom(roomA);
            if (!roomB) continue;

            pointA = {
                x: Helpers.GetRandom(roomA.x, roomA.x + roomA.w),
                y: Helpers.GetRandom(roomA.y, roomA.y + roomA.h)
            };
            pointB = {
                x: Helpers.GetRandom(roomB.x, roomB.x + roomB.w),
                y: Helpers.GetRandom(roomB.y, roomB.y + roomB.h)
            };

            while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
                if (pointB.x != pointA.x) {
                    if (pointB.x > pointA.x) pointB.x--;
                    else pointB.x++;
                } else if (pointB.y != pointA.y) {
                    if (pointB.y > pointA.y) pointB.y--;
                    else pointB.y++;
                }

                this.map[pointB.x][pointB.y] = 1;
            }
        }

        for (i = 0; i < room_count; i++) {
            var room = this.rooms[i];
            for (var x = room.x; x < room.x + room.w; x++) {
                for (var y = room.y; y < room.y + room.h; y++) {
                    this.map[x][y] = 1;
                }
            }
        }

        for (var x = 0; x < this.map_size; x++) {
            for (var y = 0; y < this.map_size; y++) {
                if (this.map[x][y] == 1) {
                    for (var xx = x - 1; xx <= x + 1; xx++) {
                        for (var yy = y - 1; yy <= y + 1; yy++) {
                            if (this.map[xx][yy] == 0) this.map[xx][yy] = 2;
                        }
                    }
                }
            }
        }

        this.RemoveClutter();
        this.RemoveClutter();
    },
    FindClosestRoom: function (room) {
        var mid = {
            x: room.x + (room.w / 2),
            y: room.y + (room.h / 2)
        };
        var closest = null;
        var closest_distance = 1000;
        for (var i = 0; i < this.rooms.length; i++) {
            var check = this.rooms[i];
            if (check == room) continue;
            if (check.connected.indexOf(room.id) != -1) continue;
            var check_mid = {
                x: check.x + (check.w / 2),
                y: check.y + (check.h / 2)
            };
            var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
            if (distance < closest_distance) {
                closest_distance = distance;
                closest = check;
            }
        }
        if (closest) {
            closest.connected.push(room.id);
            room.connected.push(closest.id);
        }
        return closest;
    },
    SquashRooms: function () {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < this.rooms.length; j++) {
                var room = this.rooms[j];
                while (true) {
                    var old_position = {
                        x: room.x,
                        y: room.y
                    };
                    if (room.x > 32) room.x--;
                    if (room.y > 32) room.y--;
                    if (room.x < 32) room.x++;
                    if (room.y < 32) room.y++;
                    if ((room.x == 32) && (room.y == 32)) break;
                    if (this.DoesCollide(room, j)) {
                        room.x = old_position.x;
                        room.y = old_position.y;
                        break;
                    }
                }
            }
        }
    },
    RemoveClutter: function () {
        for (var y = 0; y < this.map_size; y++) {
            for (var x = 0; x < this.map_size; x++) {
                var tile = this.map[x][y];
                if (tile == 2) {
                    if (
                        this.map[x-1] &&  this.map[x+1] && this.map[x-1][y] == 1 && this.map[x+1][y] == 1) {
                        this.map[x][y] = 1;
                    }
                    if (this.map[x][y-1] == 1 && this.map[x][y+1] == 1) {
                        this.map[x][y] = 1;
                    }
                    if (this.map[x][y-1] == 1 && this.map[x][y+1] == 2 && this.map[x][y+2] == 1) {
                        this.map[x][y] = 1;
                        this.map[x][y+1] = 1;
                    }
                }
            }
        }
    },
    DoesCollide: function (room, ignore) {
        for (var i = 0; i < this.rooms.length; i++) {
            if (i == ignore) continue;
            var check = this.rooms[i];
            if (!((room.x + room.w + 2 < check.x) || (room.x > check.x + check.w + 2) || (room.y + room.h + 3 < check.y) || (room.y > check.y + check.h + 3))) return true;
        }

        return false;
    },
    CheckReachability: function () {
        var reachable = true,
            done = false,
            roomsReached = [],
            roomsReachedCount,
            reachableCount,
            retryCount = 3;

            roomsReached[0] = this.rooms[0];

        while (retryCount > 0) {
            roomsReachedCount = 0;
            for ( var index = 0; index < roomsReached.length; index++ ) {
                if ( roomsReached[index] ) {
                    roomsReachedCount++;
                }
            }
            if (roomsReachedCount == reachableCount) {
                retryCount--;
                reachable = reachableCount == this.rooms.length;
            }
            reachableCount = roomsReachedCount;
            for (var i = roomsReached.length - 1; i >= 0; i--) {
                if (roomsReached[i]) {
                    for (var j = roomsReached[i].connected.length - 1; j >= 0; j--) {
                        roomsReached[roomsReached[i].connected[j]] = this.rooms[roomsReached[i].connected[j]];
                    }
                }
            }
        }

        return reachable;
    },
    GetOptionsByLevel: function (level) {
        var options = {
            size: 64,
            rooms: {
                count: {
                    min: 5,
                    max: 10
                },
                size: {
                    min: 5,
                    max: 15
                }
            }
        },
        i;
        
        if (!level) {
            return options;
        }

        i = level < 16 ? level : 15;

        options.rooms.count.min = 2;
        options.rooms.count.max = 3;

        while (i > 1) {
            options.rooms.count.min += 0.5;
            options.rooms.count.max += 1;
            i--;
        }

        options.rooms.count.min = Math.round(options.rooms.count.min);
        options.rooms.count.max = Math.round(options.rooms.count.max);

        return options;
    },
    GetTiledJSON: function (options) {
        var defaults = this.GetOptionsByLevel(game.level);
        this.options = $.extend({}, defaults, options || {});

        if (!this.options.empty) {
            this.Generate();

            while(!this.CheckReachability()) {
                this.Generate();
            }
        }




        var json = {
            "backgroundcolor":"#292634",
            "height":64,
            "layers":[
                {
                 "data":[],
                 "height":64,
                 "name":"tiny16",
                 "opacity":1,
                 "type":"tilelayer",
                 "visible":true,
                 "width":64,
                 "x":0,
                 "y":0
                }],
            "orientation":"orthogonal",
            "properties":
            {

            },
            "renderorder":"right-down",
            "tileheight":64,
            "tilesets":[
                {
                 "firstgid":1,
                 "image":"..\/tilesets\/tiny16.png",
                 "imageheight":1024,
                 "imagewidth":1024,
                 "margin":0,
                 "name":"tiny16",
                 "properties":
                    {

                    },
                 "spacing":0,
                 "tileheight":64,
                 "tilewidth":64
                }],
            "tilewidth":64,
            "version":1,
            "width":64
        };

        if (!this.options.empty) {
            for (var y = 0; y < this.map_size; y++) {
                for (var x = 0; x < this.map_size; x++) {
                    var tile = this.map[x][y];
                    if (tile == 0) {
                        if (this.map[x][y+1] == 2 && this.map[x][y+2] == 1) {
                            json.layers[0].data.push(117); // border top
                        } else {
                            json.layers[0].data.push(0); // black collision
                        }
                    } else if (tile == 1) {
                        json.layers[0].data.push(105); // ground
                    } else {
                        if (this.map[x][y+1] == 1) {
                            json.layers[0].data.push(104); // horizontal wall
                        } else if (this.map[x][y-1] == 1 && (this.map[x][y+1] == 0 || (this.map[x][y+1] == 2 && this.map[x][y+2] == 1))) {
                            json.layers[0].data.push(85); // border bottom
                        } else if (((this.map[x-1] && this.map[x-1][y] == 1 && this.map[x][y-1] == 2) || (this.map[x-1] && this.map[x-1][y] == 2 && this.map[x-1][y+1] == 1)) && this.map[x][y+1] == 2 && this.map[x][y+2] == 1) {
                            json.layers[0].data.push(116); // border right top
                        } else if ((this.map[x-1] && this.map[x-1][y] == 1 && this.map[x][y-1] == 2) || (this.map[x-1] && this.map[x-1][y] == 2 && this.map[x-1][y+1] == 1)) {
                            json.layers[0].data.push(100); // border right
                        } else if (((this.map[x+1] && this.map[x+1][y] == 1 && this.map[x][y-1] == 2) || (this.map[x+1] && this.map[x+1][y] == 2 && this.map[x+1][y+1] == 1)) && this.map[x][y+1] == 2 && this.map[x][y+2] == 1) {
                            json.layers[0].data.push(118); // border left top
                        } else if ((this.map[x+1] && this.map[x+1][y] == 1 && this.map[x][y-1] == 2) || (this.map[x+1] && this.map[x+1][y] == 2 && this.map[x+1][y+1] == 1)) {
                            json.layers[0].data.push(102); // border left
                        } else if ((this.map[x+1] && this.map[x+1][y] == 1 && this.map[x][y-1] == 1)) {
                            json.layers[0].data.push(86); // border left bottom
                        } else if ((this.map[x-1] && this.map[x-1][y] == 1 && this.map[x][y-1] == 1)) {
                            json.layers[0].data.push(84); // border right bottom
                        } else {
                            json.layers[0].data.push(0); // vertical wall
                        }
                    }
                }
            }
        }
        return json;
    }
}