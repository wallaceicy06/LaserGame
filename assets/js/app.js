$(document).ready(function() {
  Game.start();
});

io.socket.on('connect', function() {
  io.socket.get('/light', function(data) {});

  io.socket.on('light', function(o) {
    switch(o.verb) {
      case 'created':
        console.log(o);
        GameAdapter.lightCreated({'x': o.data.locX, 'y': o.data.locY},
                                 {'x': o.data.dirX, 'y': o.data.dirY});
        break;
      default:
        break;
    }
  });
});

ServerAdapter = {
  lightCreated: function(loc, dir) {
    io.socket.post('/light/create', {'locX': loc.x, 'locY': loc.y,
                                     'dirX': dir.x, 'dirY': dir.y});
  }
}
