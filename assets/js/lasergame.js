Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.grid.tile.width,
      h: Game.grid.tile.height
    });
  },

  at: function(x, y) {
    this.attr({x: x, y: y});
    return this;
  },

  atGrid: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.grid.tile.width, y: this.y/Game.grid.tile.height };
    } else {
      this.attr({ x: x * Game.grid.tile.width, y: y * Game.grid.tile.height });
      return this;
    }
  }
});

Crafty.c('Direction', {
  init: function() {
  },

  setDirection: function(x, y) {
    this.attr({dirX: x, dirY: y});
  },
});

Crafty.c('Wall', {
  init: function() {
    this.requires('2D, Canvas, Grid, Solid, SpriteBorder');
  }
});

Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid, Solid, Direction');
  }
});

Crafty.c('Light', {
  init: function() {
    this.requires('Actor, Color, Repeat, Collision')
        .color('red')
        .onHit('Solid', this.destroy)
        .onHit('Player', function(collisions) {
          console.log(collisions);
          _.each(collisions, function(c) {
            c.obj.destroy();
          });
        });

    this.timeout(this.step, 0);
  },

  step: function() {
    this.x = this.x + 2 * this.dirX;
    this.y = this.y + 2 * this.dirY;
    this.timeout(this.step, 10);
  }
});

Crafty.c('Player', {
  init: function() {
    this.requires('Actor, Fourway, Collision, SpriteHunter, SpriteAnimation, Keyboard')
        .fourway(2)
        .onHit('Solid', this.stopMovement)
        .reel('PlayerMovingUp',    600, 0, 0, 3)
        .reel('PlayerMovingRight', 600, 0, 1, 3)
        .reel('PlayerMovingDown',  600, 0, 2, 3)
        .reel('PlayerMovingLeft',  600, 0, 3, 3);

    this.bind('KeyDown', function() {
      if (this.isDown('SPACE')) {
        this.shoot();
      }
    });

    this.bind('NewDirection', function(data) {
      if (data.x > 0) {
        this.animate('PlayerMovingRight', -1);
        this.setDirection(1, 0);
      } else if (data.x < 0) {
        this.animate('PlayerMovingLeft', -1);
        this.setDirection(-1, 0);
      } else if (data.y > 0) {
        this.animate('PlayerMovingDown', -1);
        this.setDirection(0, 1);
      } else if (data.y < 0) {
        this.animate('PlayerMovingUp', -1);
        this.setDirection(0, -1);
      } else {
        this.pauseAnimation();
      }
    });
  },

  shoot: function() {
    Crafty.e('Light').at(this.x + Game.grid.tile.width * this.dirX, this.y + Game.grid.tile.height * this.dirY)
                     .setDirection(this.dirX, this.dirY);
    ServerAdapter.lightCreated({x: this.x, y: this.y}, {x: this.dirX, y: this.dirY});
  },

  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  }
});

Game = {
  grid: {
    width: 30,
    height: 20,
    tile: {
      width: 16,
      height: 16
    }
  },

  width_px: function() {
    return this.grid.width * this.grid.tile.width;
  },

  height_px: function() {
    return this.grid.height * this.grid.tile.height;
  },

  start: function() {
    Crafty.init(Game.width_px(), Game.height_px());
    Crafty.background('blue');

    var assetsObj = {
      'sprites': {
        'images/hunter.png': {
          'tile': 16,
          'tileh': 16,
          'map': {'SpriteHunter': [0, 2]},
          'paddingX': 0,
          'paddingY': 2
        },
        'images/border.png': {
          'tile': 16,
          'tileh': 16,
          'map': {'SpriteBorder': [0, 0]}
        }
      }
    };

    Crafty.load(assetsObj, function() {
      Crafty.e('Player').atGrid(9,4);

      for (var x = 0; x < Game.grid.width; x++) {
        for (var y = 0; y < Game.grid.height; y++) {
          if (x == 0 || x == Game.grid.width - 1 ||
              y == 0 || y == Game.grid.height - 1) {
            Crafty.e('Wall').atGrid(x, y);
          }
        }
      }
    }, function(e) {}, function(e) {console.log(e)});
  }
}

GameAdapter = {
  lightCreated: function(loc, dir) {
     //Crafty.e('Light').at(loc.x, loc.y)
                      //.setDirection(dir.x, dir.y);
     Crafty.e('Light').at(loc.x, loc.y)
                      .setDirection(dir.x, dir.y);
  }
}
