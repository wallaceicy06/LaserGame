$(document).ready(function() {
  Game.start();
});

io.socket.on('connect', function() {
  io.socket.get('/light', function(data) {});

  io.socket.on('light', function(o) {
    switch(o.verb) {
      case 'created':
        GameAdapter.lightCreated({'x': o.data.locX, 'y': o.data.locY},
                                 {'x': o.data.dirX, 'y': o.data.dirY},
                                 o.id);
        break;
      case 'destroyed':
        GameAdapter.lightDestroyed(o.id);
        break;
    }
  });
});

ServerAdapter = {
  lightCreated: function(loc, dir) {
    io.socket.post('/light/create',
                   {locX: loc.x, locY: loc.y, dirX: dir.x, dirY: dir.y},
                   function(data, jwres) {
                     GameAdapter.lightCreated({'x': data.locX, 'y': data.locY},
                                              {'x': data.dirX, 'y': data.dirY},
                                              data.id);
                   });
  },

  lightDestroyed: function(id) {
    io.socket.delete('/light/' + id);
  }
}
