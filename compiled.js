var Bats, Blank, Box, Character, Controls, Crosshair, DungeonGenerator, FPS, FoeView, Girl, Helpers, PauseMenu, PlayerMovement, Skeletons, Slimes, StatusInfo, TextBox, TinyRPG, Weapons, game, params, toDungeon;

Helpers = {
  GetRandom: function(low, high) {
    return ~~(Math.random() * (high - low)) + low;
  },
  GetDirectionFromVelocity: function(sprite, tolerance) {
    var h, v, vel, x, y;
    vel = sprite.body.velocity;
    v = void 0;
    h = void 0;
    x = vel.x;
    y = vel.y;
    if (x === 0) {
      h = 'none';
    }
    if (x > 0) {
      h = 'Right';
    }
    if (x < 0) {
      h = 'Left';
    }
    if (y === 0) {
      v = 'none';
    }
    if (y > 0) {
      v = 'Down';
    }
    if (y < 0) {
      v = 'Up';
    }
    if (h === 'none' && v === 'none') {
      return 'standDown';
    }
    x = Math.abs(x);
    y = Math.abs(y);
    if (x > y) {
      h = x < tolerance ? 'stand' + h : 'walk' + h;
      return h;
    } else {
      v = y < tolerance ? 'stand' + v : 'walk' + v;
      return v;
    }
  }
};

Controls = function() {
  this.up = false;
  this.down = false;
  this.left = false;
  this.right = false;
  this.esc = false;
  this.f = false;
  this.e = false;
  this.primary = false;
  this.secondary = false;
  this.x = 0;
  this.y = 0;
  this.worldX = 0;
  this.worldY = 0;
  this.cursors = {};
  this.formerMouse = -1;
  return this;
};

Controls.prototype.create = function() {
  this.cursors.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.cursors.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.cursors.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.cursors.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  this.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
  this.f = game.input.keyboard.addKey(Phaser.Keyboard.F);
  this.e = game.input.keyboard.addKey(Phaser.Keyboard.E);
  return this;
};

Controls.prototype.update = function() {
  if (game.input.mouse.button !== -1 || this.fomerMouse > -1) {
    if (game.input.mouse.button < 0 && this.fomerMouse === 0) {
      this.primary = false;
    } else if (game.input.mouse.button < 0 && this.fomerMouse === 2) {
      this.secondary = false;
    } else {
      if (game.input.mouse.button === 0 && this.fomerMouse !== game.input.mouse.button) {
        this.secondary = false;
        this.primary = true;
      } else if (game.input.mouse.button === 2 && this.fomerMouse !== game.input.mouse.button) {
        this.primary = false;
        this.secondary = true;
      }
    }
    this.fomerMouse = game.input.mouse.button;
  }
  this.worldX = game.input.activePointer.worldX;
  this.worldY = game.input.activePointer.worldY;
  this.x = game.input.activePointer.x;
  this.y = game.input.activePointer.y;
  this.up = this.cursors.up.isDown;
  this.down = this.cursors.down.isDown;
  this.left = this.cursors.left.isDown;
  this.right = this.cursors.right.isDown;
  return this;
};

DungeonGenerator = {
  map: null,
  map_size: 64,
  rooms: [],
  Generate: function() {
    var i, max_size, min_size, pointA, pointB, room, roomA, roomB, room_count, x, xx, y, yy;
    this.map = null;
    this.map_size = this.options.size;
    this.rooms = [];
    this.map = [];
    x = 0;
    while (x < this.map_size) {
      this.map[x] = [];
      y = 0;
      while (y < this.map_size) {
        this.map[x][y] = 0;
        y++;
      }
      x++;
    }
    room_count = Helpers.GetRandom(this.options.rooms.count.min, this.options.rooms.count.max);
    min_size = this.options.rooms.size.min;
    max_size = this.options.rooms.size.max;
    i = 0;
    while (i < room_count) {
      room = {};
      room.x = Helpers.GetRandom(1, this.map_size - max_size - 1);
      room.y = Helpers.GetRandom(1, this.map_size - max_size - 1);
      room.w = Helpers.GetRandom(min_size, max_size);
      room.h = Helpers.GetRandom(min_size, max_size);
      room.connected = [];
      room.id = i;
      if (this.DoesCollide(room)) {
        continue;
      }
      room.w--;
      room.h--;
      this.rooms.push(room);
      i++;
    }
    this.SquashRooms();
    i = 0;
    while (i < room_count) {
      roomA = this.rooms[i];
      roomB = this.FindClosestRoom(roomA);
      if (!roomB) {
        i++;
        continue;
      }
      pointA = {
        x: Helpers.GetRandom(roomA.x, roomA.x + roomA.w),
        y: Helpers.GetRandom(roomA.y, roomA.y + roomA.h)
      };
      pointB = {
        x: Helpers.GetRandom(roomB.x, roomB.x + roomB.w),
        y: Helpers.GetRandom(roomB.y, roomB.y + roomB.h)
      };
      while (pointB.x !== pointA.x || pointB.y !== pointA.y) {
        if (pointB.x !== pointA.x) {
          if (pointB.x > pointA.x) {
            pointB.x--;
          } else {
            pointB.x++;
          }
        } else if (pointB.y !== pointA.y) {
          if (pointB.y > pointA.y) {
            pointB.y--;
          } else {
            pointB.y++;
          }
        }
        this.map[pointB.x][pointB.y] = 1;
      }
      i++;
    }
    i = 0;
    while (i < room_count) {
      room = this.rooms[i];
      x = room.x;
      while (x < room.x + room.w) {
        y = room.y;
        while (y < room.y + room.h) {
          this.map[x][y] = 1;
          y++;
        }
        x++;
      }
      i++;
    }
    x = 0;
    while (x < this.map_size) {
      y = 0;
      while (y < this.map_size) {
        if (this.map[x][y] === 1) {
          xx = x - 1;
          while (xx <= x + 1) {
            yy = y - 1;
            while (yy <= y + 1) {
              if (this.map[xx][yy] === 0) {
                this.map[xx][yy] = 2;
              }
              yy++;
            }
            xx++;
          }
        }
        y++;
      }
      x++;
    }
    this.RemoveClutter();
    this.RemoveClutter();
  },
  FindClosestRoom: function(room) {
    var check, check_mid, closest, closest_distance, distance, i, mid;
    mid = {
      x: room.x + room.w / 2,
      y: room.y + room.h / 2
    };
    closest = null;
    closest_distance = 1000;
    i = 0;
    while (i < this.rooms.length) {
      check = this.rooms[i];
      if (check === room) {
        i++;
        continue;
      }
      if (check.connected.indexOf(room.id) !== -1) {
        i++;
        continue;
      }
      check_mid = {
        x: check.x + check.w / 2,
        y: check.y + check.h / 2
      };
      distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
      if (distance < closest_distance) {
        closest_distance = distance;
        closest = check;
      }
      i++;
    }
    if (closest) {
      closest.connected.push(room.id);
      room.connected.push(closest.id);
    }
    return closest;
  },
  SquashRooms: function() {
    var i, j, old_position, room;
    i = 0;
    while (i < 10) {
      j = 0;
      while (j < this.rooms.length) {
        room = this.rooms[j];
        while (true) {
          old_position = {
            x: room.x,
            y: room.y
          };
          if (room.x > 32) {
            room.x--;
          }
          if (room.y > 32) {
            room.y--;
          }
          if (room.x < 32) {
            room.x++;
          }
          if (room.y < 32) {
            room.y++;
          }
          if (room.x === 32 && room.y === 32) {
            break;
          }
          if (this.DoesCollide(room, j)) {
            room.x = old_position.x;
            room.y = old_position.y;
            break;
          }
        }
        j++;
      }
      i++;
    }
  },
  RemoveClutter: function() {
    var tile, x, y;
    y = 0;
    while (y < this.map_size) {
      x = 0;
      while (x < this.map_size) {
        tile = this.map[x][y];
        if (tile === 2) {
          if (this.map[x - 1] && this.map[x + 1] && this.map[x - 1][y] === 1 && this.map[x + 1][y] === 1) {
            this.map[x][y] = 1;
          }
          if (this.map[x][y - 1] === 1 && this.map[x][y + 1] === 1) {
            this.map[x][y] = 1;
          }
          if (this.map[x][y - 1] === 1 && this.map[x][y + 1] === 2 && this.map[x][y + 2] === 1) {
            this.map[x][y] = 1;
            this.map[x][y + 1] = 1;
          }
        }
        x++;
      }
      y++;
    }
  },
  DoesCollide: function(room, ignore) {
    var check, i;
    i = 0;
    while (i < this.rooms.length) {
      if (i === ignore) {
        i++;
        continue;
      }
      check = this.rooms[i];
      if (!(room.x + room.w + 2 < check.x || room.x > check.x + check.w + 2 || room.y + room.h + 3 < check.y || room.y > check.y + check.h + 3)) {
        return true;
      }
      i++;
    }
    return false;
  },
  CheckReachability: function() {
    var done, i, index, j, reachable, reachableCount, retryCount, roomsReached, roomsReachedCount;
    reachable = true;
    done = false;
    roomsReached = [];
    roomsReachedCount = void 0;
    reachableCount = void 0;
    retryCount = 3;
    roomsReached[0] = this.rooms[0];
    while (retryCount > 0) {
      roomsReachedCount = 0;
      index = 0;
      while (index < roomsReached.length) {
        if (roomsReached[index]) {
          roomsReachedCount++;
        }
        index++;
      }
      if (roomsReachedCount === reachableCount) {
        retryCount--;
        reachable = reachableCount === this.rooms.length;
      }
      reachableCount = roomsReachedCount;
      i = roomsReached.length - 1;
      while (i >= 0) {
        if (roomsReached[i]) {
          j = roomsReached[i].connected.length - 1;
          while (j >= 0) {
            roomsReached[roomsReached[i].connected[j]] = this.rooms[roomsReached[i].connected[j]];
            j--;
          }
        }
        i--;
      }
    }
    return reachable;
  },
  GetOptionsByLevel: function(level) {
    var i, options;
    options = {
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
    };
    i = void 0;
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
  GetWalkableGrid: function(json) {
    var currentRow, i, layer, walkable, walkableGrid, walkableIndex, width;
    width = json.layers[0].width;
    layer = json.layers[0].data;
    walkableIndex = 105;
    walkableGrid = [];
    currentRow = 0;
    walkable = void 0;
    i = 0;
    while (i < layer.length) {
      currentRow = Math.floor(i / width);
      if (!walkableGrid[currentRow]) {
        walkableGrid[currentRow] = [];
      }
      walkable = layer[i] === walkableIndex ? 0 : 1;
      walkableGrid[currentRow].push(walkable);
      i++;
    }
    return walkableGrid;
  },
  GetTiledJSON: function(options) {
    var defaults, json, tile, x, y;
    defaults = this.GetOptionsByLevel(game.level);
    this.options = $.extend({}, defaults, options || {});
    if (!this.options.empty) {
      this.Generate();
      while (!this.CheckReachability()) {
        this.Generate();
      }
    }
    json = {
      'backgroundcolor': '#292634',
      'height': 64,
      'layers': [
        {
          'data': [],
          'height': 64,
          'name': 'tiny16',
          'opacity': 1,
          'type': 'tilelayer',
          'visible': true,
          'width': 64,
          'x': 0,
          'y': 0
        }
      ],
      'orientation': 'orthogonal',
      'properties': {},
      'renderorder': 'right-down',
      'tileheight': 64,
      'tilesets': [
        {
          'firstgid': 1,
          'image': '../tilesets/tiny16.png',
          'imageheight': 1024,
          'imagewidth': 1024,
          'margin': 0,
          'name': 'tiny16',
          'properties': {},
          'spacing': 0,
          'tileheight': 64,
          'tilewidth': 64
        }
      ],
      'tilewidth': 64,
      'version': 1,
      'width': 64
    };
    if (!this.options.empty) {
      y = 0;
      while (y < this.map_size) {
        x = 0;
        while (x < this.map_size) {
          tile = this.map[x][y];
          if (tile === 0) {
            if (this.map[x][y + 1] === 2 && this.map[x][y + 2] === 1) {
              json.layers[0].data.push(117);
            } else {
              json.layers[0].data.push(0);
            }
          } else if (tile === 1) {
            json.layers[0].data.push(105);
          } else {
            if (this.map[x][y + 1] === 1) {
              json.layers[0].data.push(104);
            } else if (this.map[x][y - 1] === 1 && (this.map[x][y + 1] === 0 || this.map[x][y + 1] === 2 && this.map[x][y + 2] === 1)) {
              json.layers[0].data.push(85);
            } else if ((this.map[x - 1] && this.map[x - 1][y] === 1 && this.map[x][y - 1] === 2 || this.map[x - 1] && this.map[x - 1][y] === 2 && this.map[x - 1][y + 1] === 1) && this.map[x][y + 1] === 2 && this.map[x][y + 2] === 1) {
              json.layers[0].data.push(116);
            } else if (this.map[x - 1] && this.map[x - 1][y] === 1 && this.map[x][y - 1] === 2 || this.map[x - 1] && this.map[x - 1][y] === 2 && this.map[x - 1][y + 1] === 1) {
              json.layers[0].data.push(100);
            } else if ((this.map[x + 1] && this.map[x + 1][y] === 1 && this.map[x][y - 1] === 2 || this.map[x + 1] && this.map[x + 1][y] === 2 && this.map[x + 1][y + 1] === 1) && this.map[x][y + 1] === 2 && this.map[x][y + 2] === 1) {
              json.layers[0].data.push(118);
            } else if (this.map[x + 1] && this.map[x + 1][y] === 1 && this.map[x][y - 1] === 2 || this.map[x + 1] && this.map[x + 1][y] === 2 && this.map[x + 1][y + 1] === 1) {
              json.layers[0].data.push(102);
            } else if (this.map[x + 1] && this.map[x + 1][y] === 1 && this.map[x][y - 1] === 1) {
              json.layers[0].data.push(86);
            } else if (this.map[x - 1] && this.map[x - 1][y] === 1 && this.map[x][y - 1] === 1) {
              json.layers[0].data.push(84);
            } else {
              json.layers[0].data.push(0);
            }
          }
          x++;
        }
        y++;
      }
    }
    json.walkableGrid = this.GetWalkableGrid(json);
    return json;
  }
};

Blank = (function() {
  function Blank(options) {
    var ref, ref1, ref2, visible;
    if (options == null) {
      options = {};
    }
    visible = (ref = options.visible) != null ? ref : false;
    this.color = (ref1 = options.color) != null ? ref1 : '#17091C';
    this.speed = (ref2 = options.speed) != null ? ref2 : 400;
    this.width = 240;
    this.height = 160;
    this.x = 0;
    this.y = 0;
    this.scale = 4;
    this.bmd = game.add.bitmapData(this.width, this.height);
    this.bmd.context.fillStyle = this.color;
    this.bmd.context.fillRect(0, 0, this.width, this.height);
    this.sprite = game.add.sprite(0, 0, this.bmd);
    this.sprite.scale.setTo(this.scale);
    this.sprite.fixedToCamera = true;
    this.sprite.cameraOffset.x = this.x * this.scale;
    this.sprite.cameraOffset.y = this.y * this.scale;
    this.sprite.visible = visible;
    this.sprite.alpha = visible ? 1 : 0;
  }

  Blank.prototype.isFading = function() {
    var ref;
    return (0 < (ref = this.sprite.alpha) && ref < 1);
  };

  Blank.prototype.show = function() {
    if (this.isFading()) {
      return;
    }
    this.sprite.alpha = 1;
    return this.sprite.visible = true;
  };

  Blank.prototype.hide = function() {
    if (this.isFading()) {
      return;
    }
    this.sprite.alpha = 0;
    return this.sprite.visible = false;
  };

  Blank.prototype.fadeTo = function(callback) {
    var fade;
    if (this.sprite.alpha !== 0) {
      return;
    }
    this.sprite.bringToTop();
    this.sprite.visible = true;
    fade = game.add.tween(this.sprite);
    fade.to({
      alpha: 1
    }, this.speed);
    if (callback) {
      fade.onComplete.add(callback, this);
    }
    fade.start();
    return this;
  };

  Blank.prototype.fadeFrom = function(callback) {
    var fade;
    if (this.sprite.alpha !== 1) {
      return;
    }
    fade = game.add.tween(this.sprite);
    fade.to({
      alpha: 0
    }, this.speed);
    fade.onComplete.add((function() {
      this.sprite.visible = false;
      if (callback) {
        return callback();
      }
    }), this);
    fade.start();
    return this;
  };

  return Blank;

})();

Box = (function() {
  function Box(options) {
    var ref, ref1, ref2, ref3, ref4, ref5;
    if (options == null) {
      options = {};
    }
    this.color = (ref = options.color) != null ? ref : '#597dce';
    this.width = (ref1 = options.width) != null ? ref1 : 16;
    this.height = (ref2 = options.height) != null ? ref2 : 16;
    this.x = (ref3 = options.x) != null ? ref3 : 0;
    this.y = (ref4 = options.y) != null ? ref4 : 0;
    this.scale = (ref5 = options.scale) != null ? ref5 : 4;
    this.asset = 'boxborder';
    this.sprite = this.createSprite();
  }

  Box.prototype.createCorners = function() {
    return {
      topLeft: new Phaser.Rectangle(0, 0, 5, 5),
      topRight: new Phaser.Rectangle(4, 0, 5, 5),
      bottomRight: new Phaser.Rectangle(4, 4, 5, 5),
      bottomLeft: new Phaser.Rectangle(0, 4, 5, 5)
    };
  };

  Box.prototype.renderBackground = function(bitmapData) {
    bitmapData.context.fillRect(5, 5, this.width - 10, this.height - 10);
    return bitmapData;
  };

  Box.prototype.renderCorners = function(bitmapData) {
    var c;
    c = this.createCorners();
    bitmapData.copyRect(this.asset, c.topLeft, 0, 0);
    bitmapData.copyRect(this.asset, c.topRight, this.width - 5, 0);
    bitmapData.copyRect(this.asset, c.bottomRight, this.width - 5, this.height - 5);
    bitmapData.copyRect(this.asset, c.bottomLeft, 0, this.height - 5);
    return bitmapData;
  };

  Box.prototype.renderBorders = function(bitmapData) {
    bitmapData.copy(this.asset, 4, 0, 1, 5, 5, 0, this.width - 10, 5);
    bitmapData.copy(this.asset, 4, 4, 1, 5, 5, this.height - 5, this.width - 10, 5);
    bitmapData.copy(this.asset, 0, 4, 5, 1, 0, 5, 5, this.height - 10);
    bitmapData.copy(this.asset, 4, 4, 5, 1, this.width - 5, 5, 5, this.height - 10);
    return bitmapData;
  };

  Box.prototype.createBitmapData = function() {
    var bitmapData;
    bitmapData = game.add.bitmapData(this.width, this.height);
    bitmapData.context.fillStyle = this.color;
    this.renderBackground(bitmapData);
    this.renderCorners(bitmapData);
    this.renderBorders(bitmapData);
    return bitmapData;
  };

  Box.prototype.createSprite = function() {
    var bmd, sprite;
    bmd = this.createBitmapData();
    sprite = game.add.sprite(0, 0, bmd);
    sprite.scale.setTo(this.scale);
    sprite.fixedToCamera = true;
    sprite.cameraOffset.x = this.x;
    sprite.cameraOffset.y = this.y;
    return sprite;
  };

  return Box;

})();

StatusInfo = function() {
  return this;
};

StatusInfo.prototype.create = function() {
  this.background = game.add.sprite(0, 0, 'statusinfo');
  this.background.scale.setTo(4);
  this.background.fixedToCamera = true;
  this.background.cameraOffset.x = 0;
  this.background.cameraOffset.y = game.camera.height - this.background.height;
  this.background.visible = false;
  this.makeBar('health', '#D04648', 39, 155);
  this.makeBar('mana', '#597DCE', 111, 155);
  this.makeBar('xp', '#6CAA2C', 183, 155);
  this.currentWeapon = game.add.sprite(0, 0, 'tiny16');
  this.currentWeapon.fixedToCamera = true;
  this.currentWeapon.cameraOffset.x = 2 * 4;
  this.currentWeapon.cameraOffset.y = 142 * 4;
  this.currentWeapon.visible = false;
  return this;
};

StatusInfo.prototype.update = function() {
  if (typeof game.state.states[game.state.current].girl === 'undefined' || typeof game.player === 'undefined' || typeof game.player.health === 'undefined') {
    this.background.visible = false;
    this.healthbar.visible = false;
    this.manabar.visible = false;
    this.xpbar.visible = false;
    this.currentWeapon.visible = false;
  } else {
    this.background.visible = true;
    this.healthbar.visible = true;
    this.manabar.visible = true;
    this.xpbar.visible = true;
    this.currentWeapon.visible = true;
    this.healthbar.width = Math.ceil(game.player.health / 2) * 4;
    this.manabar.width = Math.ceil(game.player.mana / 2) * 4;
    this.xpbar.width = Math.ceil(game.player.xp / 2) * 4;
    this.currentWeapon.frame = game.player.activeWeapon.iconFrame;
  }
  return this;
};

StatusInfo.prototype.makeBar = function(name, color, x, y) {
  this['bmd' + name] = game.add.bitmapData(50, 3);
  this['bmd' + name].context.fillStyle = color;
  this['bmd' + name].context.fillRect(0, 0, 50, 3);
  this[name + 'bar'] = game.add.sprite(0, 0, this['bmd' + name]);
  this[name + 'bar'].scale.setTo(4);
  this[name + 'bar'].fixedToCamera = true;
  this[name + 'bar'].cameraOffset.x = x * 4;
  this[name + 'bar'].cameraOffset.y = y * 4;
  this[name + 'bar'].visible = false;
  return this;
};

FPS = (function() {
  function FPS() {
    this.text = game.add.bitmapText(0, 0, 'silkscreen', '', 32);
    this.text.fixedToCamera = true;
  }

  FPS.prototype.update = function() {
    if (game.time.fps !== 60) {
      this.text.visible = true;
      this.text.cameraOffset.x = game.camera.width - 32 - this.text.width;
      this.text.cameraOffset.y = 32;
      this.text.setText((game.time.fps || '--') + ' FPS');
    } else {
      this.text.visible = false;
    }
    return this;
  };

  return FPS;

})();

TextBox = (function() {
  function TextBox() {
    this.background = this.createBackground();
    this.text = this.createText();
    this.initalMode = game.mode;
    this.lastOpened = game.time.now;
    this.hide();
    this.addEvents();
  }

  TextBox.prototype.addEvents = function() {
    return game.input.onDown.add((function() {
      if (game.mode === 'dialog' && game.time.now - this.lastOpened > 100) {
        this.hide();
      }
    }), this);
  };

  TextBox.prototype.createBackground = function() {
    var box;
    box = new Box({
      width: 224,
      height: 48,
      x: 32,
      y: game.camera.height - 48 * 4 - 32
    });
    return box.sprite;
  };

  TextBox.prototype.createText = function() {
    var text;
    text = game.add.bitmapText(0, 0, 'silkscreen', '', 32);
    text.fixedToCamera = true;
    text.cameraOffset.x = 56;
    text.cameraOffset.y = game.camera.height - 200;
    return text;
  };

  TextBox.prototype.hide = function() {
    this.background.visible = false;
    this.text.visible = false;
    game.mode = this.initalMode;
    return this;
  };

  TextBox.prototype.show = function(text) {
    if (text != null) {
      this.text.setText(text);
    }
    this.lastOpened = game.time.now;
    this.background.visible = true;
    this.text.visible = true;
    game.mode = 'dialog';
    return this;
  };

  return TextBox;

})();

PauseMenu = function() {
  this.entries = [
    {
      name: 'Character'
    }, {
      name: 'Save'
    }, {
      name: 'Quit'
    }
  ];
  return this;
};

PauseMenu.prototype.create = function() {
  var i;
  this.boxHeight = 10 + this.entries.length - 1 + this.entries.length * 13;
  this.box = new Box({
    width: 73,
    height: this.boxHeight,
    x: game.camera.width - 73 * 4 - 32,
    y: game.camera.height - this.boxHeight * 4 - 32
  });
  this.background = this.box.sprite;
  this.texts = [];
  this.clickables = [];
  i = this.entries.length - 1;
  while (i >= 0) {
    this.texts[i] = game.add.bitmapText(0, 0, 'silkscreen', this.entries[i].name, 32);
    this.texts[i].fixedToCamera = true;
    this.texts[i].cameraOffset.x = 167 * 4;
    this.texts[i].cameraOffset.y = game.camera.height - 10 * 4 - (this.entries.length - i) * 4 * 14;
    this.clickables[i] = game.add.sprite(0, 0, 'menuclickable');
    this.clickables[i].fixedToCamera = true;
    this.clickables[i].scale.setTo(4);
    this.clickables[i].cameraOffset.x = 164 * 4;
    this.clickables[i].cameraOffset.y = game.camera.height - 12 * 4 - (this.entries.length - i) * 4 * 14;
    this.entries[i].index = i;
    this.clickables[i].data = this.entries[i];
    this.clickables[i].inputEnabled = true;
    this.clickables[i].events.onInputOver.add((function() {
      var active, index, that;
      that = game.ui.pauseMenu;
      active = that.activeIndicator;
      index = this.data.index;
      active.visible = true;
      active.cameraOffset.x = 157 * 4;
      active.cameraOffset.y = that.clickables[index].cameraOffset.y + 3 * 4;
    }), this.clickables[i]);
    this.clickables[i].events.onInputOut.add((function() {
      var active, that;
      that = game.ui.pauseMenu;
      active = that.activeIndicator;
      active.visible = false;
    }), this.clickables[i]);
    this.clickables[i].events.onInputDown.add((function() {
      alert(this.data.name);
    }), this.clickables[i]);
    i--;
  }
  this.activeIndicator = game.add.sprite(0, 0, 'boxborderactive');
  this.activeIndicator.fixedToCamera = true;
  this.activeIndicator.scale.setTo(4);
  this.activeIndicator.cameraOffset.x = 0;
  this.activeIndicator.cameraOffset.y = 0;
  this.activeIndicator.visible = false;
  this.initalMode = game.mode;
  this.lastOpened = game.time.now;
  this.hide();
  game.controls.esc.onDown.add((function() {
    if (game.mode === 'menu' && game.time.now - this.lastOpened > 100) {
      this.hide();
    } else if (game.mode === 'level') {
      this.show();
    }
  }), this);
  return this;
};

PauseMenu.prototype.update = function() {
  return this;
};

PauseMenu.prototype.hide = function() {
  var i;
  this.background.visible = false;
  this.activeIndicator.visible = false;
  i = this.texts.length - 1;
  while (i >= 0) {
    this.texts[i].visible = false;
    this.clickables[i].visible = false;
    i--;
  }
  game.mode = this.initalMode;
  return this;
};

PauseMenu.prototype.show = function() {
  var i;
  this.lastOpened = game.time.now;
  this.background.visible = true;
  i = this.texts.length - 1;
  while (i >= 0) {
    this.texts[i].visible = true;
    this.clickables[i].visible = true;
    if (this.clickables[i].input.checkPointerOver(game.input.activePointer)) {
      this.clickables[i].events.onInputOver.dispatch();
    }
    i--;
  }
  game.mode = 'menu';
  return this;
};

Crosshair = (function() {
  function Crosshair(options) {
    var ref, ref1, ref2, ref3;
    if (options == null) {
      options = {};
    }
    this.color = (ref = options.color) != null ? ref : '#ffffff';
    this.width = (ref1 = options.width) != null ? ref1 : 2;
    this.height = (ref2 = options.height) != null ? ref2 : 2;
    this.scale = (ref3 = options.scale) != null ? ref3 : 4;
    this.x = 0;
    this.y = 0;
    this.sprite = this.createSprite();
  }

  Crosshair.prototype.createBitmapData = function() {
    var bitmapData;
    bitmapData = game.add.bitmapData(this.width, this.height);
    bitmapData.context.fillStyle = this.color;
    bitmapData.context.fillRect(0, 0, this.width, this.height);
    return bitmapData;
  };

  Crosshair.prototype.createSprite = function() {
    var bmd, sprite;
    bmd = this.createBitmapData();
    sprite = game.add.sprite(this.x, this.y, bmd);
    sprite.scale.setTo(this.scale);
    game.physics.enable(sprite);
    sprite.anchor.setTo(0.5);
    sprite.fixedToCamera = true;
    return sprite;
  };

  Crosshair.prototype.update = function() {
    this.x = game.controls.worldX;
    this.x = this.x ? this.x : 0;
    this.y = game.controls.worldY;
    this.y = this.y ? this.y : 0;
    this.sprite.cameraOffset.setTo(this.x - game.camera.x, this.y - game.camera.y);
    return this;
  };

  return Crosshair;

})();

FoeView = (function() {
  function FoeView(options) {
    var ref, ref1, ref2, ref3, ref4;
    if (options == null) {
      options = {};
    }
    this.width = (ref = options.width) != null ? ref : 2;
    this.height = (ref1 = options.height) != null ? ref1 : 2;
    this.scale = (ref2 = options.scale) != null ? ref2 : 4;
    this.maxFoes = (ref3 = options.maxFoes) != null ? ref3 : 100;
    this.foeMarkers = game.add.group();
    this.foeMarkers.createMultiple(this.maxFoes, 'foemarker');
    this.foeMarkers.setAll('anchor.x', 0.5);
    this.foeMarkers.setAll('anchor.y', 0.5);
    this.foeMarkers.setAll('scale.x', this.scale);
    this.foeMarkers.setAll('scale.y', this.scale);
    this.foeMarkers.setAll('fixedToCamera', true);
    this.state = game.state.states[game.state.current];
    this.player = (ref4 = this.state.girl) != null ? ref4.player : void 0;
  }

  FoeView.prototype.update = function() {
    if (game.mode === 'level') {
      this.foeMarkers.forEachAlive((function(foeMarker) {
        return foeMarker.kill();
      }), this);
    }
    return this;
  };

  FoeView.prototype.getInterfaceCorners = function() {
    var c;
    c = game.camera;
    return {
      topLeft: {
        x: c.x,
        y: c.y
      },
      topRight: {
        x: c.x + c.width,
        y: c.y
      },
      bottomLeftOne: {
        x: c.x + 20 * this.scale,
        y: c.y + c.height - 7 * this.scale
      },
      bottomLeftTwo: {
        x: c.x + 20 * this.scale,
        y: c.y + c.height - 20 * this.scale
      },
      bottomLeftThree: {
        x: c.x,
        y: c.y + c.height - 20 * this.scale
      },
      bottomRight: {
        x: c.x + c.width,
        y: c.y + c.height - 7 * this.scale
      }
    };
  };

  FoeView.prototype.getInterfaceBorders = function() {
    var i;
    i = this.getInterfaceCorners();
    return [new Phaser.Line(i.topLeft.x, i.topLeft.y, i.topRight.x, i.topRight.y), new Phaser.Line(i.topRight.x, i.topRight.y, i.bottomRight.x, i.bottomRight.y), new Phaser.Line(i.bottomRight.x, i.bottomRight.y, i.bottomLeftOne.x, i.bottomLeftOne.y), new Phaser.Line(i.bottomLeftOne.x, i.bottomLeftOne.y, i.bottomLeftTwo.x, i.bottomLeftTwo.y), new Phaser.Line(i.bottomLeftTwo.x, i.bottomLeftTwo.y, i.bottomLeftThree.x, i.bottomLeftThree.y), new Phaser.Line(i.bottomLeftThree.x, i.bottomLeftThree.y, i.topLeft.x, i.topLeft.y)];
  };

  FoeView.prototype.getLineOfSight = function(foe) {
    var f, p;
    p = this.player.body.center;
    f = foe.body.center;
    return new Phaser.Line(p.x, p.y, f.x, f.y);
  };

  FoeView.prototype.updateGroup = function(group) {
    var borders;
    if (game.controls.f.isDown && game.mode === 'level') {
      borders = this.getInterfaceBorders();
      group.forEachAlive((function(foe) {
        var border, foeMarker, intersection, k, len, lineOfSight, temp;
        if (this.foeMarkers.countDead() > 0) {
          lineOfSight = this.getLineOfSight(foe);
          for (k = 0, len = borders.length; k < len; k++) {
            border = borders[k];
            temp = lineOfSight.intersects(border);
            intersection = temp ? temp : intersection;
          }
          if (intersection) {
            foeMarker = this.foeMarkers.getFirstDead();
            foeMarker.reset();
            foeMarker.cameraOffset.x = intersection.x - game.camera.x;
            foeMarker.cameraOffset.y = intersection.y - game.camera.y;
          }
        }
      }), this);
    }
    return this;
  };

  return FoeView;

})();

Weapons = function() {
  if (typeof game.player === 'undefined') {
    game.player = {};
  }
  if (typeof game.player.activeWeapon === 'undefined') {
    game.player.activeWeapon = this.fireballs.orange.medium;
  }
  this.aquired = [this.fireballs.orange.medium, this.fireballs.blue.medium];
  return this;
};

Weapons.prototype.create = function() {
  this.fireballs.create(this);
  game.controls.e.onDown.add((function() {
    this.next();
  }), this);
  return this;
};

Weapons.prototype.update = function() {
  if (game.state.current !== 'Town' && game.mode === 'level') {
    if (game.controls.primary) {
      game.player.activeWeapon.activeUpdatePrimary(this);
    }
    if (game.controls.secondary) {
      game.player.activeWeapon.activeUpdateSecondary(this);
    }
  }
  this.fireballs.passiveUpdate(this);
  return this;
};

Weapons.prototype.makeBullets = function(amount) {
  var bullets;
  bullets = void 0;
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(amount, 'tiny16');
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 0.5);
  return bullets;
};

Weapons.prototype.collide = function(collision) {
  this.fireballs.collide(collision);
  return this;
};

Weapons.prototype.hitTest = function(enemies) {
  this.fireballs.hitTest(enemies);
  return this;
};

Weapons.prototype.next = function() {
  var currentIndex, maxIndex, nextIndex;
  currentIndex = this.aquired.indexOf(game.player.activeWeapon);
  maxIndex = this.aquired.length - 1;
  nextIndex = currentIndex + 1;
  if (nextIndex > maxIndex) {
    nextIndex = 0;
  }
  game.player.activeWeapon = this.aquired[nextIndex];
  return this;
};

Weapons.prototype.fireballs = {};

Weapons.prototype.fireballs.create = function(weapons) {
  weapons.fireballs.orange.create(weapons);
  weapons.fireballs.blue.create(weapons);
  return this;
};

Weapons.prototype.fireballs.activeUpdatePrimary = function(weapons) {
  weapons.fireballs.orange.activeUpdatePrimary(weapons);
  weapons.fireballs.blue.activeUpdatePrimary(weapons);
  return this;
};

Weapons.prototype.fireballs.activeUpdateSecondary = function(weapons) {
  weapons.fireballs.orange.activeUpdateSecondary(weapons);
  weapons.fireballs.blue.activeUpdateSecondary(weapons);
  return this;
};

Weapons.prototype.fireballs.passiveUpdate = function(weapons) {
  weapons.fireballs.orange.passiveUpdate(weapons);
  weapons.fireballs.blue.passiveUpdate(weapons);
  return this;
};

Weapons.prototype.fireballs.pauseProjectiles = function(bullets) {
  bullets.forEach(function(bullet) {
    if (!bullet.animations.paused) {
      bullet.body.savedVelocity = {};
      bullet.body.savedVelocity.x = bullet.body.velocity.x;
      bullet.body.savedVelocity.y = bullet.body.velocity.y;
      bullet.body.velocity.x = 0;
      bullet.body.velocity.y = 0;
      bullet.animations.paused = true;
    }
  });
  return this;
};

Weapons.prototype.fireballs.unpauseProjectiles = function(bullets) {
  bullets.forEach(function(bullet) {
    if (bullet.animations.paused && bullet.body.savedVelocity) {
      bullet.body.velocity.x = bullet.body.savedVelocity.x;
      bullet.body.velocity.y = bullet.body.savedVelocity.y;
      bullet.body.savedVelocity = false;
      bullet.animations.paused = false;
    }
  });
  return this;
};

Weapons.prototype.fireballs.collide = function(collision) {
  this.orange.collide(collision);
  this.blue.collide(collision);
  return this;
};

Weapons.prototype.fireballs.hitTest = function(enemies) {
  this.orange.hitTest(enemies);
  this.blue.hitTest(enemies);
  return this;
};

Weapons.prototype.fireballs.orange = {};

Weapons.prototype.fireballs.orange.create = function(weapons) {
  weapons.fireballs.orange.medium.create(weapons);
  return this;
};

Weapons.prototype.fireballs.orange.activeUpdatePrimary = function(weapons) {
  weapons.fireballs.orange.medium.activeUpdatePrimary(weapons);
  return this;
};

Weapons.prototype.fireballs.orange.activeUpdateSecondary = function(weapons) {
  weapons.fireballs.orange.medium.activeUpdateSecondary(weapons);
  return this;
};

Weapons.prototype.fireballs.orange.passiveUpdate = function(weapons) {
  weapons.fireballs.orange.medium.passiveUpdate(weapons);
  return this;
};

Weapons.prototype.fireballs.orange.collide = function(collision) {
  this.medium.collide(collision);
  return this;
};

Weapons.prototype.fireballs.orange.hitTest = function(enemies) {
  this.medium.hitTest(enemies);
  return this;
};

Weapons.prototype.fireballs.orange.medium = {
  iconFrame: 257
};

Weapons.prototype.fireballs.orange.medium.create = function(weapons) {
  var that;
  that = this;
  this.damage = {
    primary: 10,
    secondary: 20
  };
  this.cost = {
    primary: 2,
    secondary: 15
  };
  this.fireCooldown = game.time.now;
  this.bullets = weapons.makeBullets(50);
  this.bullets.forEach(function(bullet) {
    bullet.animations.add('flameOrangeMedium', [256, 257, 258, 257], 10, true);
    bullet.animations.play('flameOrangeMedium');
    bullet.body.setSize(24, 24, 0, 16);
    bullet.weapon = that;
  });
  return this;
};

Weapons.prototype.fireballs.orange.medium.activeUpdatePrimary = function(weapons) {
  var bullet;
  this.girl = game.state.states[game.state.current].girl;
  this.player = this.girl.player;
  if (game.time.elapsedSince(this.fireCooldown) > 500 && this.bullets.countDead() > 0 && this.girl.costMana(this.cost.primary)) {
    bullet = this.bullets.getFirstDead();
    bullet.reset(this.player.body.center.x, this.player.body.center.y - 16);
    game.physics.arcade.moveToPointer(bullet, 300);
    bullet.body.velocity.x = bullet.body.velocity.x + this.player.body.velocity.x;
    bullet.body.velocity.y = bullet.body.velocity.y + this.player.body.velocity.y;
    bullet.attack = 'primary';
    this.fireCooldown = game.time.now;
  }
  return this;
};

Weapons.prototype.fireballs.orange.medium.activeUpdateSecondary = function(weapons) {
  var bullet, i;
  this.girl = game.state.states[game.state.current].girl;
  this.player = this.girl.player;
  if (game.time.elapsedSince(this.fireCooldown) > 500 && this.bullets.countDead() > 0 && this.girl.costMana(this.cost.secondary)) {
    i = 0;
    while (i < 5) {
      bullet = this.bullets.getFirstDead();
      bullet.reset(this.player.body.center.x, this.player.body.center.y - 16);
      game.physics.arcade.moveToPointer(bullet, 200 + i * 100);
      bullet.body.velocity.x = bullet.body.velocity.x + this.player.body.velocity.x;
      bullet.body.velocity.y = bullet.body.velocity.y + this.player.body.velocity.y;
      bullet.attack = 'secondary';
      i++;
    }
    this.fireCooldown = game.time.now;
  }
  return this;
};

Weapons.prototype.fireballs.orange.medium.passiveUpdate = function(weapons) {
  if (game.mode === 'level') {
    weapons.fireballs.unpauseProjectiles(this.bullets);
  }
  if (game.mode !== 'level') {
    weapons.fireballs.pauseProjectiles(this.bullets);
  }
  return this;
};

Weapons.prototype.fireballs.orange.medium.hit = function(shot, enemy) {
  shot.kill();
  enemy.hitTimeout = game.time.now;
  enemy.blendMode = PIXI.blendModes.ADD;
  enemy.damage(shot.weapon.damage[shot.attack]);
};

Weapons.prototype.fireballs.orange.medium.collide = function(collision) {
  game.physics.arcade.overlap(this.bullets, collision, function(shot) {
    shot.kill();
  });
  return this;
};

Weapons.prototype.fireballs.orange.medium.hitTest = function(enemies) {
  game.physics.arcade.overlap(this.bullets, enemies.group, this.hit);
  return this;
};

Weapons.prototype.fireballs.blue = {};

Weapons.prototype.fireballs.blue.create = function(weapons) {
  weapons.fireballs.blue.medium.create(weapons);
  return this;
};

Weapons.prototype.fireballs.blue.activeUpdatePrimary = function(weapons) {
  weapons.fireballs.blue.medium.activeUpdatePrimary(weapons);
  return this;
};

Weapons.prototype.fireballs.blue.activeUpdateSecondary = function(weapons) {
  weapons.fireballs.blue.medium.activeUpdateSecondary(weapons);
  return this;
};

Weapons.prototype.fireballs.blue.passiveUpdate = function(weapons) {
  weapons.fireballs.blue.medium.passiveUpdate(weapons);
  return this;
};

Weapons.prototype.fireballs.blue.collide = function(collision) {
  this.medium.collide(collision);
  return this;
};

Weapons.prototype.fireballs.blue.hitTest = function(enemies) {
  this.medium.hitTest(enemies);
  return this;
};

Weapons.prototype.fireballs.blue.medium = {
  iconFrame: 260
};

Weapons.prototype.fireballs.blue.medium.create = function(weapons) {
  var that;
  that = this;
  this.damage = {
    primary: 4,
    secondary: 5
  };
  this.cost = {
    primary: 0.75,
    secondary: 35
  };
  this.fireCooldown = game.time.now;
  this.bullets = weapons.makeBullets(300);
  this.bullets.forEach(function(bullet) {
    bullet.animations.add('flameBlueMedium', [259, 260, 261, 260], 10, true);
    bullet.animations.play('flameBlueMedium');
    bullet.body.setSize(24, 24, 0, 16);
    bullet.weapon = that;
  });
  return this;
};

Weapons.prototype.fireballs.blue.medium.activeUpdatePrimary = function(weapons) {
  var angle, bullet, speed;
  this.girl = game.state.states[game.state.current].girl;
  this.player = this.girl.player;
  if (game.time.elapsedSince(this.fireCooldown) > 40 && this.bullets.countDead() > 0 && this.girl.costMana(this.cost.primary)) {
    bullet = this.bullets.getFirstDead();
    if (bullet) {
      bullet.reset(this.player.body.center.x, this.player.body.center.y - 16);
      angle = game.physics.arcade.angleToPointer(bullet, game.input.activePointer);
      speed = 500;
      angle = angle + game.rnd.realInRange(-0.5, 0.5);
      bullet.body.velocity.x = Math.cos(angle) * speed;
      bullet.body.velocity.y = Math.sin(angle) * speed;
      bullet.body.velocity.x = bullet.body.velocity.x + this.player.body.velocity.x;
      bullet.body.velocity.y = bullet.body.velocity.y + this.player.body.velocity.y;
      bullet.attack = 'primary';
      bullet.enemiesTouched = [];
    }
    this.fireCooldown = game.time.now;
  }
  return this;
};

Weapons.prototype.fireballs.blue.medium.activeUpdateSecondary = function(weapons) {
  var amount, angle, bullet, i, speed, start, step;
  this.girl = game.state.states[game.state.current].girl;
  this.player = this.girl.player;
  if (game.time.elapsedSince(this.fireCooldown) > 500 && this.bullets.countDead() > 0 && this.girl.costMana(this.cost.secondary)) {
    amount = 36;
    start = Math.PI * -1;
    step = Math.PI / amount * 2;
    i = amount;
    while (i > 0) {
      bullet = this.bullets.getFirstDead();
      if (bullet) {
        bullet.reset(this.player.body.center.x, this.player.body.center.y - 16);
        angle = start + i * step;
        speed = 500;
        bullet.body.velocity.x = Math.cos(angle) * speed;
        bullet.body.velocity.y = Math.sin(angle) * speed;
        bullet.body.velocity.x = bullet.body.velocity.x + this.player.body.velocity.x;
        bullet.body.velocity.y = bullet.body.velocity.y + this.player.body.velocity.y;
        bullet.attack = 'secondary';
      }
      i--;
    }
    this.fireCooldown = game.time.now;
  }
  return this;
};

Weapons.prototype.fireballs.blue.medium.passiveUpdate = function(weapons) {
  if (game.mode === 'level') {
    weapons.fireballs.unpauseProjectiles(this.bullets);
  }
  if (game.mode !== 'level') {
    weapons.fireballs.pauseProjectiles(this.bullets);
  }
  return this;
};

Weapons.prototype.fireballs.blue.medium.hit = function(shot, enemy) {
  enemy.hitTimeout = game.time.now;
  enemy.blendMode = PIXI.blendModes.ADD;
  if (shot.attack === 'primary') {
    if (shot.enemiesTouched.indexOf(enemy) === -1) {
      shot.enemiesTouched.push(enemy);
      enemy.damage(shot.weapon.damage.primary);
    }
  } else {
    enemy.damage(shot.weapon.damage.secondary);
  }
};

Weapons.prototype.fireballs.blue.medium.collide = function(collision) {
  game.physics.arcade.overlap(this.bullets, collision, function(shot) {
    shot.kill();
  });
  return this;
};

Weapons.prototype.fireballs.blue.medium.hitTest = function(enemies) {
  game.physics.arcade.overlap(this.bullets, enemies.group, this.hit);
  return this;
};

Character = (function() {
  function Character(options) {
    if (options == null) {
      options = {};
    }
    this.scale = 4;
    this.paused = false;
    this.animations = [];
    this.health = 100;
    this.hitTimeout = false;
    this.bodySize = {
      width: 32,
      height: 32,
      x: -16,
      y: 0
    };
  }

  Character.prototype.addAnimations = function() {
    var animation, k, len, ref, results;
    ref = this.animations;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      animation = ref[k];
      results.push(this.sprite.animations.add(animation));
    }
    return results;
  };

  return Character;

})();

Skeletons = function(count) {
  this.count = count;
  return this;
};

Skeletons.prototype.create = function() {
  var desiredIndex, i, map, randX, randY, skeleton, walkFPS;
  map = game.map;
  this.group = game.add.group();
  this.group.enableBody = true;
  i = 0;
  randX = void 0;
  randY = void 0;
  desiredIndex = 105;
  skeleton = void 0;
  walkFPS = 3;
  while (i < this.count) {
    randX = Helpers.GetRandom(0, map.width);
    randY = Helpers.GetRandom(0, map.height);
    if (map.getTile(randX, randY) && map.getTile(randX, randY).index === desiredIndex && (randX >= 15 || randY >= 10)) {
      skeleton = this.group.create(randX * map.tileWidth, randY * map.tileHeight, 'tiny16');
      skeleton.frame = 134;
      skeleton.body.setSize(32, 32, 16, 28);
      skeleton.health = 50;
      skeleton.hitTimeout = false;
      i++;
      skeleton.animations.add('standDown', [134], 0, false);
      skeleton.animations.add('walkDown', [135, 136], walkFPS, true);
      skeleton.animations.add('standLeft', [150], 0, false);
      skeleton.animations.add('walkLeft', [151, 152], walkFPS, true);
      skeleton.animations.add('standRight', [166], 0, false);
      skeleton.animations.add('walkRight', [167, 168], walkFPS, true);
      skeleton.animations.add('standUp', [182], 0, false);
      skeleton.animations.add('walkUp', [183, 184], walkFPS, true);
      skeleton.animations.play('standDown');
      skeleton.animations.currentAnim.timeLastChange = game.time.now - 100;
    }
  }
  return this;
};

Skeletons.prototype.update = function() {
  var collision, map;
  map = game.map;
  collision = game.collision;
  this.group.setAll('body.velocity.x', 0);
  this.group.setAll('body.velocity.y', 0);
  if (game.mode === 'level') {
    this.group.forEach(function(skeleton) {
      var hasLineOfSight, i, line, tileHits, viewRadius;
      if (skeleton.hitTimeout && game.time.now - skeleton.hitTimeout > 100) {
        skeleton.hitTimeout = false;
        skeleton.blendMode = PIXI.blendModes.NORMAL;
      }
      if (skeleton.visible && skeleton.inCamera) {
        line = new Phaser.Line(game.state.states[game.state.current].girl.player.body.center.x, game.state.states[game.state.current].girl.player.body.center.y, skeleton.body.center.x, skeleton.body.center.y);
        tileHits = void 0;
        hasLineOfSight = void 0;
        viewRadius = 320;
        if (line.length <= viewRadius) {
          tileHits = collision.getRayCastTiles(line, 4, false, false);
          hasLineOfSight = true;
          if (tileHits.length > 0) {
            i = 0;
            while (i < tileHits.length) {
              if (map.collideIndexes.indexOf(tileHits[i].index) !== -1) {
                hasLineOfSight = false;
              }
              i++;
            }
          }
          if (hasLineOfSight) {
            game.physics.arcade.moveToXY(skeleton, game.state.states[game.state.current].girl.player.body.center.x - skeleton.body.offset.x - (skeleton.body.width / 2), game.state.states[game.state.current].girl.player.body.center.y - skeleton.body.offset.y - (skeleton.body.height / 2), Helpers.GetRandom(150, 200));
          }
        }
        if (Helpers.GetDirectionFromVelocity(skeleton) !== skeleton.animations.currentAnim.name && game.time.elapsedSince(skeleton.animations.currentAnim.timeLastChange) > 25) {
          skeleton.animations.play(Helpers.GetDirectionFromVelocity(skeleton, 10));
          skeleton.animations.currentAnim.timeLastChange = game.time.now;
        }
      }
      if (skeleton.animations.paused) {
        skeleton.animations.paused = false;
      }
    });
    game.ui.foeView.updateGroup(this.group);
  } else {
    this.group.forEach(function(skeleton) {
      if (!skeleton.animations.paused) {
        skeleton.animations.paused = true;
      }
    });
  }
  return this;
};

Slimes = function(count) {
  this.count = count;
  this.paused = false;
  return this;
};

Slimes.prototype.create = function() {
  var desiredIndex, i, map, randX, randY, slime, walkFPS;
  map = game.map;
  this.group = game.add.group();
  this.group.enableBody = true;
  i = 0;
  randX = void 0;
  randY = void 0;
  desiredIndex = 105;
  slime = void 0;
  walkFPS = 4;
  while (i < this.count) {
    randX = Helpers.GetRandom(0, map.width);
    randY = Helpers.GetRandom(0, map.height);
    if (map.getTile(randX, randY) && map.getTile(randX, randY).index === desiredIndex && (randX >= 15 || randY >= 10)) {
      slime = this.group.create(randX * map.tileWidth, randY * map.tileHeight, 'tiny16');
      slime.frame = 192;
      slime.body.setSize(40, 44, 12, 16);
      slime.health = 30;
      i++;
      slime.animations.add('standDown', [192], 0, false);
      slime.animations.add('walkDown', [193, 194], walkFPS, true);
      slime.animations.add('standLeft', [208], 0, false);
      slime.animations.add('walkLeft', [209, 210], walkFPS, true);
      slime.animations.add('standRight', [224], 0, false);
      slime.animations.add('walkRight', [225, 226], walkFPS, true);
      slime.animations.add('standUp', [240], 0, false);
      slime.animations.add('walkUp', [241, 242], walkFPS, true);
      slime.animations.play('standDown');
      slime.animations.currentAnim.timeLastChange = game.time.now - 100;
    }
  }
  return this;
};

Slimes.prototype.update = function() {
  if (game.mode === 'level') {
    if (!this.paused) {
      this.group.forEach(function(slime) {
        if (slime.hitTimeout && game.time.now - slime.hitTimeout > 100) {
          slime.hitTimeout = false;
          slime.blendMode = PIXI.blendModes.NORMAL;
        }
        if (slime.visible && slime.inCamera) {
          if (slime.body.velocity.x === 0 && slime.body.velocity.y === 0) {
            slime.body.velocity.x = Helpers.GetRandom(-80, 80);
            slime.body.velocity.y = Helpers.GetRandom(-80, 80);
          } else {
            slime.body.velocity.x = (Helpers.GetRandom(-800, 800) + slime.body.velocity.x * 120) / 121;
            slime.body.velocity.y = (Helpers.GetRandom(-800, 800) + slime.body.velocity.y * 120) / 121;
          }
          if (Helpers.GetDirectionFromVelocity(slime) !== slime.animations.currentAnim.name && game.time.elapsedSince(slime.animations.currentAnim.timeLastChange) > 1000) {
            slime.animations.play(Helpers.GetDirectionFromVelocity(slime, 10));
            slime.animations.currentAnim.timeLastChange = game.time.now;
          }
        }
      });
      game.ui.foeView.updateGroup(this.group);
    } else {
      this.group.forEach(function(slime) {
        slime.body.velocity = slime.body.savedVelocity;
        if (slime.animations.paused) {
          slime.animations.paused = false;
        }
      });
      this.paused = false;
    }
  } else if (!this.paused) {
    this.group.forEach(function(slime) {
      slime.body.savedVelocity = slime.body.velocity;
      slime.body.velocity.x = 0;
      slime.body.velocity.y = 0;
      if (!slime.animations.paused) {
        slime.animations.paused = true;
      }
    });
    this.paused = true;
  }
  return this;
};

Bats = function(count) {
  this.count = count;
  return this;
};

Bats.prototype.create = function() {
  var bat, desiredIndex, i, map, randX, randY, walkFPS;
  map = game.map;
  this.group = game.add.group();
  this.group.enableBody = true;
  i = 0;
  randX = void 0;
  randY = void 0;
  desiredIndex = 105;
  bat = void 0;
  walkFPS = 3;
  while (i < this.count) {
    randX = Helpers.GetRandom(0, map.width);
    randY = Helpers.GetRandom(0, map.height);
    if (map.getTile(randX, randY) && map.getTile(randX, randY).index === desiredIndex && (randX >= 15 || randY >= 10)) {
      bat = this.group.create(randX * map.tileWidth, randY * map.tileHeight, 'tiny16');
      bat.frame = 195;
      bat.body.setSize(32, 32, 16, 28);
      bat.health = 30;
      bat.hitTimeout = false;
      i++;
      bat.animations.add('standDown', [195], 0, false);
      bat.animations.add('walkDown', [196, 197], walkFPS, true);
      bat.animations.add('standLeft', [211], 0, false);
      bat.animations.add('walkLeft', [212, 213], walkFPS, true);
      bat.animations.add('standRight', [227], 0, false);
      bat.animations.add('walkRight', [228, 229], walkFPS, true);
      bat.animations.add('standUp', [243], 0, false);
      bat.animations.add('walkUp', [244, 245], walkFPS, true);
      bat.animations.play('standDown');
      bat.animations.currentAnim.timeLastChange = game.time.now - 100;
    }
  }
  return this;
};

Bats.prototype.update = function() {
  var finder, girl, grid, path, x, y;
  grid = void 0;
  finder = void 0;
  x = void 0;
  y = void 0;
  girl = void 0;
  path = void 0;
  this.group.setAll('body.velocity.x', 0);
  this.group.setAll('body.velocity.y', 0);
  if (game.mode === 'level') {
    this.group.forEach(function(bat) {
      var batX, batY, girlX, girlY, hasLineOfSight, line, safeZone, tileHits, viewRadius;
      if (bat.hitTimeout && game.time.now - bat.hitTimeout > 100) {
        bat.hitTimeout = false;
        bat.blendMode = PIXI.blendModes.NORMAL;
      }
      line = new Phaser.Line(game.state.states[game.state.current].girl.player.body.center.x, game.state.states[game.state.current].girl.player.body.center.y, bat.body.center.x, bat.body.center.y);
      tileHits = void 0;
      hasLineOfSight = void 0;
      viewRadius = 250 * 4;
      safeZone = 32 * 4;
      if (line.length <= viewRadius && line.length > safeZone) {
        grid = game.state.states[game.state.current].grid;
        finder = new PF.AStarFinder({
          allowDiagonal: true,
          dontCrossCorners: true
        });
        girl = game.state.states[game.state.current].girl;
        girlX = Math.floor(girl.player.body.center.x / 64);
        girlY = Math.floor(girl.player.body.center.y / 64);
        batX = Math.floor(bat.body.center.x / 64);
        batY = Math.floor(bat.body.center.y / 64);
        path = finder.findPath(batX, batY, girlX, girlY, grid.clone());
        if (path.length > 2) {
          path = PF.Util.smoothenPath(grid, path);
        }
        if (path.length > 1) {
          game.physics.arcade.moveToXY(bat, path[1][0] * 64 + 32 - bat.body.offset.x - (bat.body.width / 2), path[1][1] * 64 + 32 - bat.body.offset.y - (bat.body.height / 2), Helpers.GetRandom(150, 200));
        }
      } else if (line.length <= safeZone) {
        game.physics.arcade.moveToXY(bat, game.state.states[game.state.current].girl.player.body.center.x - bat.body.offset.x - (bat.body.width / 2), game.state.states[game.state.current].girl.player.body.center.y - bat.body.offset.y - (bat.body.height / 2), Helpers.GetRandom(200, 300));
      }
      if (Helpers.GetDirectionFromVelocity(bat) !== bat.animations.currentAnim.name && game.time.elapsedSince(bat.animations.currentAnim.timeLastChange) > 25) {
        bat.animations.play(Helpers.GetDirectionFromVelocity(bat, 10));
        bat.animations.currentAnim.timeLastChange = game.time.now;
      }
      if (bat.animations.paused) {
        bat.animations.paused = false;
      }
    });
    game.ui.foeView.updateGroup(this.group);
  } else {
    this.group.forEach(function(bat) {
      if (!bat.animations.paused) {
        bat.animations.paused = true;
      }
    });
  }
  return this;
};

PlayerMovement = function(girl) {
  this.girl = girl;
  this.player = this.girl.player;
  return this;
};

PlayerMovement.prototype.create = function() {
  var that;
  this.player.facing = {
    up: false,
    down: true,
    left: false,
    right: false
  };
  this.player.walking = {
    up: false,
    down: false,
    left: false,
    right: false,
    any: false
  };
  this.addAnimations();
  this.player.animations.play('standDown');
  that = this;
  game.controls.cursors.up.onDown.add(function() {
    if (game.mode === 'level') {
      if (!that.player.walking.any) {
        that.player.facing.up = false;
        that.player.facing.down = false;
        that.player.facing.left = false;
        that.player.facing.right = false;
      }
      that.player.facing.up = true;
      that.player.walking.up = true;
      that.player.walking.any = true;
      that.player.animations.play('standUp');
    }
  });
  game.controls.cursors.down.onDown.add(function() {
    if (game.mode === 'level') {
      if (!that.player.walking.any) {
        that.player.facing.up = false;
        that.player.facing.down = false;
        that.player.facing.left = false;
        that.player.facing.right = false;
      }
      that.player.facing.down = true;
      that.player.walking.down = true;
      that.player.walking.any = true;
      that.player.animations.play('standDown');
    }
  });
  game.controls.cursors.left.onDown.add(function() {
    if (game.mode === 'level') {
      if (!that.player.walking.any) {
        that.player.facing.up = false;
        that.player.facing.down = false;
        that.player.facing.left = false;
        that.player.facing.right = false;
      }
      that.player.facing.left = true;
      that.player.walking.left = true;
      that.player.walking.any = true;
      that.player.animations.play('standLeft');
    }
  });
  game.controls.cursors.right.onDown.add(function() {
    if (game.mode === 'level') {
      if (!that.player.walking.any) {
        that.player.facing.up = false;
        that.player.facing.down = false;
        that.player.facing.left = false;
        that.player.facing.right = false;
      }
      that.player.facing.right = true;
      that.player.walking.right = true;
      that.player.walking.any = true;
      that.player.animations.play('standRight');
    }
  });
  game.controls.cursors.up.onUp.add(function() {
    that.player.walking.up = false;
    if (!(!that.player.facing.down && !that.player.facing.left && !that.player.facing.right)) {
      that.player.facing.up = false;
      if (that.player.facing.right) {
        that.player.animations.play('standRight');
      }
      if (that.player.facing.left) {
        that.player.animations.play('standLeft');
      }
    } else {
      that.player.walking.any = false;
    }
  });
  game.controls.cursors.down.onUp.add(function() {
    that.player.walking.down = false;
    if (!(!that.player.facing.up && !that.player.facing.left && !that.player.facing.right)) {
      that.player.facing.down = false;
      if (that.player.facing.right) {
        that.player.animations.play('standRight');
      }
      if (that.player.facing.left) {
        that.player.animations.play('standLeft');
      }
    } else {
      that.player.walking.any = false;
    }
  });
  game.controls.cursors.left.onUp.add(function() {
    that.player.walking.left = false;
    if (!(!that.player.facing.up && !that.player.facing.down && !that.player.facing.right)) {
      that.player.facing.left = false;
      if (that.player.facing.up) {
        that.player.animations.play('standUp');
      }
      if (that.player.facing.down) {
        that.player.animations.play('standDown');
      }
    } else {
      that.player.walking.any = false;
    }
  });
  game.controls.cursors.right.onUp.add(function() {
    that.player.walking.right = false;
    if (!(!that.player.facing.up && !that.player.facing.down && !that.player.facing.left)) {
      that.player.facing.right = false;
      if (that.player.facing.up) {
        that.player.animations.play('standUp');
      }
      if (that.player.facing.down) {
        that.player.animations.play('standDown');
      }
    } else {
      that.player.walking.any = false;
    }
  });
  this.speed = 200;
  return this;
};

PlayerMovement.prototype.update = function() {
  var angle, speed, x, y;
  this.player.body.velocity.x = 0;
  this.player.body.velocity.y = 0;
  if (game.mode === 'level') {
    if (this.player.animations.paused) {
      this.player.animations.paused = false;
      if (game.controls.cursors.up.isDown) {
        game.controls.cursors.up.onDown.dispatch();
      }
      if (game.controls.cursors.down.isDown) {
        game.controls.cursors.down.onDown.dispatch();
      }
      if (game.controls.cursors.left.isDown) {
        game.controls.cursors.left.onDown.dispatch();
      }
      if (game.controls.cursors.right.isDown) {
        game.controls.cursors.right.onDown.dispatch();
      }
    }
    x = 0;
    y = 0;
    angle = void 0;
    speed = this.speed;
    if (game.controls.cursors.up.isDown) {
      y -= 1;
    }
    if (game.controls.cursors.down.isDown) {
      y += 1;
    }
    if (game.controls.cursors.left.isDown) {
      x -= 1;
    }
    if (game.controls.cursors.right.isDown) {
      x += 1;
    }
    if (!(x === 0 && y === 0)) {
      if (x === 1 && y === 0) {
        angle = 0;
      }
      if (x === 1 && y === 1) {
        angle = 45;
      }
      if (x === 0 && y === 1) {
        angle = 90;
      }
      if (x === -1 && y === 1) {
        angle = 135;
      }
      if (x === -1 && y === 0) {
        angle = 180;
      }
      if (x === -1 && y === -1) {
        angle = 225;
      }
      if (x === 0 && y === -1) {
        angle = 270;
      }
      if (x === 1 && y === -1) {
        angle = 315;
      }
      if (game.controls.shift.isDown && this.girl.costMana(0.2)) {
        speed = speed * 2;
      }
      this.player.body.velocity = game.physics.arcade.velocityFromAngle(angle, speed);
    }
    if (this.player.walking.any && this.player.animations.currentAnim.name.indexOf('walk') === -1) {
      switch (this.player.animations.currentAnim.name) {
        case 'standUp':
          this.player.animations.play('walkUp');
          break;
        case 'standDown':
          this.player.animations.play('walkDown');
          break;
        case 'standLeft':
          this.player.animations.play('walkLeft');
          break;
        case 'standRight':
          this.player.animations.play('walkRight');
          break;
        default:
          break;
      }
    }
    if (!this.player.walking.any && this.player.animations.currentAnim.name.indexOf('stand') === -1) {
      switch (this.player.animations.currentAnim.name) {
        case 'walkUp':
          this.player.animations.play('standUp');
          break;
        case 'walkDown':
          this.player.animations.play('standDown');
          break;
        case 'walkLeft':
          this.player.animations.play('standLeft');
          break;
        case 'walkRight':
          this.player.animations.play('standRight');
          break;
        default:
          break;
      }
    }
  }
  if (game.mode !== 'level' || game.inactive) {
    if (!this.player.animations.paused) {
      game.controls.cursors.up.onUp.dispatch();
      game.controls.cursors.down.onUp.dispatch();
      game.controls.cursors.left.onUp.dispatch();
      game.controls.cursors.right.onUp.dispatch();
      this.player.animations.paused = true;
    }
  }
  return this;
};

PlayerMovement.prototype.addAnimations = function() {
  var walkFPS;
  walkFPS = 4;
  this.player.animations.add('standDown', [131], 0, false);
  this.player.animations.add('walkDown', [132, 133], walkFPS, true);
  this.player.animations.add('standLeft', [147], 0, false);
  this.player.animations.add('walkLeft', [148, 149], walkFPS, true);
  this.player.animations.add('standRight', [163], 0, false);
  this.player.animations.add('walkRight', [164, 165], walkFPS, true);
  this.player.animations.add('standUp', [179], 0, false);
  this.player.animations.add('walkUp', [180, 181], walkFPS, true);
};

Girl = function() {
  return this;
};

Girl.prototype.create = function() {
  var desiredIndex, map, randX, randY;
  map = game.map;
  this.scale = 4;
  this.weapons = new Weapons;
  this.weapons.create();
  this.player = game.add.sprite(2 * 64, 2 * 64, 'tiny16');
  this.movement = new PlayerMovement(this);
  if (typeof game.player === 'undefined') {
    game.player = {};
  }
  if (typeof game.player.health === 'undefined') {
    game.player.health = 100;
  }
  if (typeof game.player.mana === 'undefined') {
    game.player.mana = 100;
  }
  if (typeof game.player.xp === 'undefined') {
    game.player.xp = 0;
  }
  if (typeof game.player.maxMana === 'undefined') {
    game.player.maxMana = 100;
  }
  if (typeof game.player.manaRegeneration === 'undefined') {
    game.player.manaPerSecond = 3;
  }
  if (typeof game.player.lastManaRegeneration === 'undefined') {
    game.player.lastManaRegeneration = false;
  }
  game.physics.enable(this.player);
  this.player.anchor.set(1);
  this.player.body.setSize(32, 32, -16, 0);
  this.player.body.x = 2 * 64;
  this.player.body.y = 2 * 64;
  this.player.body.collideWorldBounds = true;
  this.player.hitTimeout = false;
  this.playerPlaced = false;
  if (game.state.current === 'Town') {
    this.player.position.setTo(34 * 64, 33 * 64);
  } else {
    randX = void 0;
    randY = void 0;
    desiredIndex = 105;
    while (!this.playerPlaced) {
      randX = Helpers.GetRandom(0, map.width - 1);
      randY = Helpers.GetRandom(0, map.height - 1);
      if (map.getTile(randX, randY) && map.getTile(randX, randY).index === desiredIndex) {
        this.playerPlaced = true;
        this.player.position.setTo(randX * map.tileWidth + map.tileWidth, randY * map.tileHeight + map.tileHeight);
      }
    }
  }
  this.playerPlaced = false;
  game.camera.follow(this.player);
  game.camera.roundPx = false;
  this.movement.create();
  return this;
};

Girl.prototype.update = function() {
  this.regenerateMana();
  this.movement.update();
  if (game.mode === 'level') {
    if (this.player.hitTimeout && game.time.now - this.player.hitTimeout > 100) {
      this.player.hitTimeout = false;
      this.player.blendMode = PIXI.blendModes.NORMAL;
    }
  }
  this.weapons.update();
  return this;
};

Girl.prototype.costMana = function(cost) {
  if (game.player.mana - cost >= 0) {
    game.player.mana = game.player.mana - cost;
    return true;
  }
  return false;
};

Girl.prototype.regenerateMana = function() {
  if (game.mode === 'level') {
    if (game.player.lastManaRegeneration) {
      game.player.mana += game.player.manaPerSecond * game.time.elapsedSecondsSince(game.player.lastManaRegeneration);
      if (game.player.mana > game.player.maxMana) {
        game.player.mana = game.player.maxMana;
      }
      if (game.player.mana < 0) {
        game.player.mana = 0;
      }
    }
    game.player.lastManaRegeneration = game.time.now;
  } else {
    game.player.lastManaRegeneration = false;
  }
  return false;
};

TinyRPG = {};

TinyRPG.Boot = function(game) {};

TinyRPG.Boot.prototype = {
  preload: function() {
    game.time.advancedTiming = true;
    this.load.image('preloaderBar', 'asset/sprites/loading.png');
  },
  create: function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setScreenSize();
    game.scale.refresh();
    game.stage.disableVisibilityChange = true;
    game.onBlur.add((function() {
      game.input.reset();
      game.inactive = true;
    }), this);
    game.onFocus.add((function() {
      game.inactive = false;
    }), this);
    this.state.start('Preloader');
  }
};

TinyRPG.Default = function(game) {};

TinyRPG.Default.prototype = {
  create: function() {
    if (!game.controls) {
      game.controls = new Controls;
      game.controls.create();
    }
    game.ui = game.ui ? game.ui : {};
    game.ui.foeView = new FoeView;
    game.ui.fps = new FPS;
    game.ui.statusInfo = new StatusInfo;
    game.ui.statusInfo.create();
    game.ui.blank = new Blank({
      visible: true
    });
    game.ui.textbox = new TextBox;
    game.ui.pauseMenu = new PauseMenu;
    game.ui.pauseMenu.create();
    game.ui.crosshair = new Crosshair;
  },
  update: function() {
    game.controls.update();
    game.ui.foeView.update();
    game.ui.fps.update();
    game.ui.statusInfo.update();
    game.ui.pauseMenu.update();
    game.ui.crosshair.update();
  },
  render: function() {}
};

TinyRPG.Preloader = function(game) {};

TinyRPG.Preloader.prototype = {
  preload: function() {
    this.stage.backgroundColor = '#6DC2CA';
    this.preloadBar = this.add.sprite(0, game.height - 64 * 4, 'preloaderBar');
    this.preloadBar.scale.setTo(4);
    this.load.setPreloadSprite(this.preloadBar);
    this.load.image('menubg', 'asset/backgrounds/main-menu.png');
    this.load.image('boxborder', 'asset/sprites/box_border.png');
    this.load.image('boxborderactive', 'asset/sprites/box_border_active.png');
    this.load.image('menuclickable', 'asset/sprites/menu_clickable.png');
    this.load.spritesheet('startbutton', 'asset/sprites/start_button.png', 59, 38);
    this.load.spritesheet('textbox', 'asset/sprites/textbox.png');
    this.load.spritesheet('foemarker', 'asset/sprites/foe_marker.png');
    this.load.spritesheet('statusinfo', 'asset/sprites/status_info.png');
    this.load.spritesheet('tiny16', 'asset/tilesets/tiny16.png', 64, 64);
    this.load.spritesheet('collision', 'asset/tilesets/collision.png', 64, 64);
    this.load.tilemap('level', null, DungeonGenerator.GetTiledJSON({
      empty: true
    }), Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('town', 'asset/rooms/town.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.bitmapFont('silkscreen', 'asset/fonts/silkscreen/silkscreen.png', 'asset/fonts/silkscreen/silkscreen.fnt');
  },
  create: function() {

    /*
         scaleCanvas();
         $(window).resize(function () {
            scaleCanvas();
         });
     */
    if (params.debug && params.debug === 'dungeon') {
      this.state.start('DungeonDebugger');
    } else {
      this.state.start('MainMenu');
    }
  },
  render: function() {}
};

TinyRPG.MainMenu = function(game) {};

TinyRPG.MainMenu.prototype = {
  create: function() {
    var button, splashScreen;
    game.mode = 'menu';
    game.stage.setBackgroundColor('#17091C');
    splashScreen = this.add.sprite(0, 0, 'menubg');
    splashScreen.scale.set(4);
    button = game.add.button(480, 550, 'startbutton', this.startGame, this, 2, 1, 0);
    button.scale.setTo(4);
    button.anchor.setTo(0.5);
    this.menuMusic = game.add.audio('menu');
    this.highscore = game.add.bitmapText(0, 0, 'silkscreen', '--', 32);
    this.highscore.fixedToCamera = true;
    this.highscore.setText('Highscore ' + (localStorage.highestLevel ? localStorage.highestLevel : 0));
    game.state.states.Default.create();
    game.ui.blank.hide();
  },
  startGame: function() {
    game.ui.blank.fadeTo(function() {
      game.state.clearCurrentState();
      return game.state.start('Town');
    });
  },
  update: function() {
    this.highscore.cameraOffset.x = game.camera.width / 2 - (this.highscore.width / 2);
    this.highscore.cameraOffset.y = 240;
    game.state.states.Default.update();
  },
  render: function() {}
};

TinyRPG.Town = function(game) {};

TinyRPG.Town.prototype = {
  create: function() {
    game.mode = 'level';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.setBackgroundColor('#17091C');
    this.map = game.add.tilemap('town');
    this.map.addTilesetImage('tiny16');
    this.map.addTilesetImage('collision');
    this.map.setCollision([1]);
    this.collision = this.map.createLayer('collision');
    this.collision.resizeWorld();
    this.collision.visible = false;
    this.map.createLayer('deco3');
    this.map.createLayer('deco2');
    this.map.createLayer('deco1');
    this.map.createLayer('deco0');
    this.girl = new Girl;
    this.girl.create();
    this.stateChange = false;
    this.waterTimer = 0;
    this.fireplaceTimer = 0;
    this.torchTimer = 0;
    game.input.onDown.add((function() {
      var e, i, line, tile, x, y;
      e = void 0;
      x = void 0;
      y = void 0;
      tile = void 0;
      line = void 0;
      if (game.mode === 'level') {
        i = this.events.length - 1;
        while (i >= 0) {
          e = this.events[i];
          if (e.trigger.type === 'onTileClick') {
            x = Math.floor(game.input.worldX / 64);
            y = Math.floor(game.input.worldY / 64);
            if (e.trigger.location.x === x && e.trigger.location.y === y) {
              if (typeof e.trigger.layer !== 'undefined') {
                tile = game.state.states[game.state.current].map.getTile(x, y, e.trigger.layer);
              }
              if (typeof e.trigger.maxDistance !== 'undefined') {
                line = new Phaser.Line(this.girl.player.x - (this.girl.player.width / 2), this.girl.player.y - (this.girl.player.height / 2), x * 64 + 32, y * 64 + 32);
              }
              if ((typeof e.trigger.layer === 'undefined' || tile.index === e.trigger.index) && (typeof e.trigger.maxDistance === 'undefined' || line.length <= e.trigger.maxDistance)) {
                if (e.action.type === 'textbox') {
                  game.ui.textbox.show(e.action.text);
                }
              }
            }
          }
          i--;
        }
      }
    }), this);
    game.state.states.Default.create();
    game.ui.blank.fadeFrom();
  },
  update: function() {
    var that;
    that = this;
    game.state.states.Default.update();
    game.ui.crosshair.update();
    this.girl.update();
    if (game.mode === 'level') {
      if (this.torchTimer === 0) {
        this.map.swap(214, 213, void 0, void 0, void 0, void 0, 'deco2');
        this.torchTimer = 64;
      } else if (this.torchTimer === 16) {
        this.map.swap(213, 214, void 0, void 0, void 0, void 0, 'deco2');
      } else if (this.torchTimer === 32) {
        this.map.swap(214, 215, void 0, void 0, void 0, void 0, 'deco2');
      } else if (this.torchTimer === 48) {
        this.map.swap(215, 214, void 0, void 0, void 0, void 0, 'deco2');
      }
      this.torchTimer--;
      if (this.fireplaceTimer === 0) {
        this.map.swap(89, 88, void 0, void 0, void 0, void 0, 'deco3');
        this.fireplaceTimer = 64;
      } else if (this.fireplaceTimer === 16) {
        this.map.swap(88, 89, void 0, void 0, void 0, void 0, 'deco3');
      } else if (this.fireplaceTimer === 32) {
        this.map.swap(89, 90, void 0, void 0, void 0, void 0, 'deco3');
      } else if (this.fireplaceTimer === 48) {
        this.map.swap(90, 89, void 0, void 0, void 0, void 0, 'deco3');
      }
      this.fireplaceTimer--;
      if (this.waterTimer === 0) {
        this.map.swap(134, 135, void 0, void 0, void 0, void 0, 'deco2');
        this.waterTimer = 60;
      }
      this.waterTimer--;
    }
    if (this.stateChange) {
      this.stateChange();
    }
    game.physics.arcade.collide(this.girl.player, this.collision, function(a1, a2) {
      if (a2.x === 42 && a2.y === 43) {
        that.stateChange = function() {
          game.mode = 'stateChange';
          game.ui.blank.fadeTo(function() {
            game.state.start('Dungeon', true);
            return game.state.clearCurrentState();
          });
        };
      }
    });
    game.physics.arcade.overlap(this.girl.bullets, this.collision, function(shot) {
      shot.kill();
    });
  },
  render: function() {

    /*
    game.debug.body(girl.player);
    for (var i = skeletons.children.length - 1; i >= 0; i--) {
            game.debug.body(skeletons.children[i]);
    };
    var bullets = game.state.states[game.state.current].girl.bullets;
    for (var i = bullets.children.length - 1; i >= 0; i--) {
            if (bullets.children[i].alive) {
                    game.debug.body(bullets.children[i]);
            }
    };
     */
  },
  events: [
    {
      name: 'home_sign',
      trigger: {
        type: 'onTileClick',
        location: {
          x: 33,
          y: 34
        },
        maxDistance: 127,
        layer: 'deco2',
        index: 97
      },
      action: {
        type: 'textbox',
        text: 'You stand in front of your house\nreading your own address.\n\nWhat a pointless waste of time...'
      }
    }, {
      name: 'dungeon_sign',
      trigger: {
        type: 'onTileClick',
        location: {
          x: 43,
          y: 45
        },
        maxDistance: 127,
        layer: 'deco2',
        index: 97
      },
      action: {
        type: 'textbox',
        text: 'Evil Dungeon of Eternal Darkness'
      }
    }, {
      name: 'townhall_sign',
      trigger: {
        type: 'onTileClick',
        location: {
          x: 16,
          y: 20
        },
        maxDistance: 127,
        layer: 'deco2',
        index: 97
      },
      action: {
        type: 'textbox',
        text: 'Town Hall'
      }
    }, {
      name: 'shop_sign',
      trigger: {
        type: 'onTileClick',
        location: {
          x: 17,
          y: 31
        },
        maxDistance: 127,
        layer: 'deco2',
        index: 97
      },
      action: {
        type: 'textbox',
        text: 'Shop'
      }
    }, {
      name: 'lodging_sign',
      trigger: {
        type: 'onTileClick',
        location: {
          x: 13,
          y: 39
        },
        maxDistance: 127,
        layer: 'deco2',
        index: 97
      },
      action: {
        type: 'textbox',
        text: 'Night\'s Lodging'
      }
    }, {
      name: 'shop_dialog',
      trigger: {
        type: 'onTileClick',
        location: {
          x: 15,
          y: 26
        },
        maxDistance: 127,
        layer: 'deco0',
        index: 136
      },
      action: {
        type: 'textbox',
        text: 'His cold dead eyes are staring at you.\nHe doesn\'t say a word.'
      }
    }
  ]
};

TinyRPG.Dungeon = function(game) {};

TinyRPG.Dungeon.prototype = {
  create: function() {
    var collision, enemyCount, enemyTypesCount, i, mapJSON;
    i = void 0;
    enemyCount = 2;
    enemyTypesCount = 3;
    game.mode = 'level';
    if (typeof game.level === 'undefined') {
      game.level = 1;
    }
    i = game.level;
    while (i > 1) {
      enemyCount += game.level;
      i--;
    }
    enemyCount = enemyCount > 100 ? 100 : enemyCount;
    enemyCount = Math.round(enemyCount / enemyTypesCount);
    mapJSON = DungeonGenerator.GetTiledJSON();
    game.cache._tilemaps.level.data = mapJSON;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.grid = new PF.Grid(64, 64, mapJSON.walkableGrid);
    game.stage.setBackgroundColor('#140C1C');
    game.map = game.add.tilemap('level');
    game.map.addTilesetImage('tiny16');
    game.map.setCollisionByExclusion([105]);
    collision = game.map.createLayer('tiny16');
    game.collision = collision;
    collision.resizeWorld();
    game.enemies = {
      skeletons: new Skeletons(enemyCount),
      slimes: new Slimes(enemyCount),
      bats: new Bats(enemyCount)
    };
    game.enemies.skeletons.create();
    game.enemies.slimes.create();
    game.enemies.bats.create();
    this.enemiesLeft = game.add.bitmapText(0, 0, 'silkscreen', '--', 32);
    this.enemiesLeft.fixedToCamera = true;
    this.enemiesLeft.cameraOffset.x = 32;
    this.enemiesLeft.cameraOffset.y = 32;
    this.girl = new Girl;
    this.girl.create();
    game.state.states.Default.create();
    game.ui.blank.fadeFrom();
  },
  update: function() {
    var bats, collision, skeletons, slimes;
    collision = game.collision;
    skeletons = game.enemies.skeletons;
    slimes = game.enemies.slimes;
    bats = game.enemies.bats;
    game.state.states.Default.update();
    skeletons.update();
    slimes.update();
    bats.update();
    this.girl.update();
    game.physics.arcade.collide(this.girl.player, collision);
    this.girl.weapons.hitTest(skeletons);
    this.girl.weapons.hitTest(slimes);
    this.girl.weapons.hitTest(bats);
    this.girl.weapons.collide(collision);
    game.physics.arcade.collide(skeletons.group, collision);
    game.physics.arcade.collide(slimes.group, collision);
    game.physics.arcade.collide(bats.group, collision);
    game.physics.arcade.collide(skeletons.group, skeletons.group);
    game.physics.arcade.collide(slimes.group, slimes.group);
    game.physics.arcade.collide(bats.group, bats.group);
    game.physics.arcade.collide(skeletons.group, slimes.group);
    game.physics.arcade.collide(skeletons.group, bats.group);
    game.physics.arcade.collide(slimes.group, bats.group);
    this.enemiesLeft.setText(skeletons.group.length + slimes.group.length + bats.group.length - skeletons.group.countDead() - slimes.group.countDead() - bats.group.countDead() + ' enemies left // level ' + game.level);
    if (skeletons.group.length + slimes.group.length + bats.group.length - skeletons.group.countDead() - slimes.group.countDead() - bats.group.countDead() === 0) {
      game.mode = 'stateChange';
      game.ui.blank.fadeTo((function(_this) {
        return function() {
          game.state.clearCurrentState();
          game.level++;
          return _this.state.start('Dungeon');
        };
      })(this));
    }
    if (game.physics.arcade.collide(this.girl.player, skeletons.group) || game.physics.arcade.collide(this.girl.player, slimes.group) || game.physics.arcade.collide(this.girl.player, bats.group)) {
      game.player.health--;
      this.girl.player.hitTimeout = game.time.now;
      this.girl.player.blendMode = PIXI.blendModes.ADD;
      if (game.player.health <= 0) {
        this.girl.player.kill();
        if (!localStorage.highestLevel || localStorage.highestLevel < game.level) {
          localStorage.highestLevel = game.level;
        }
        game.level = 1;
        game.player.health = 100;
        game.player.mana = 100;
        game.player.xp = 0;
        game.state.clearCurrentState();
        this.state.start('MainMenu');
      }
    }
  },
  render: function() {

    /*
    game.debug.body(player);
    for (var i = skeletons.children.length - 1; i >= 0; i--) {
            game.debug.body(skeletons.children[i]);
    };
    for (var i = slimes.children.length - 1; i >= 0; i--) {
            game.debug.body(slimes.children[i]);
    };
     */
  }
};

TinyRPG.DungeonDebugger = function(game) {};

TinyRPG.DungeonDebugger.prototype = {
  create: function() {
    var collision, map, params;
    this.updateCounter = 0;
    params = Phaser.Net.prototype.getQueryString();
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
  update: function() {
    if (this.updateCounter < 5) {
      return this.updateCounter++;
    } else {
      throw new Error('code execution stopped');
    }
  },
  render: function() {}
};

params = Phaser.Net.prototype.getQueryString();

game = void 0;

toDungeon = function() {
  game.state.states.Town.girl.player.position.setTo(2754, 2864);
};

if (params.debug && params.debug === 'dungeon') {
  game = new Phaser.Game(64 * 64, 64 * 64, Phaser.CANVAS, 'tinyRPG', {}, false, false);
} else {
  game = new Phaser.Game(960, 640, Phaser.CANVAS, 'tinyRPG', {}, false, false);
}

game.state.add('Boot', TinyRPG.Boot);

game.state.add('Default', TinyRPG.Default);

game.state.add('Preloader', TinyRPG.Preloader);

game.state.add('MainMenu', TinyRPG.MainMenu);

game.state.add('Town', TinyRPG.Town);

game.state.add('Dungeon', TinyRPG.Dungeon);

game.state.add('DungeonDebugger', TinyRPG.DungeonDebugger);

game.state.start('Boot');

$(function() {
  $(window).konami({
    code: [38, 38, 40, 40, 37, 39, 37, 39],
    cheat: function() {
      $('body').toggleClass('retro');
    }
  });
});
