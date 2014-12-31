# LaserGame

My original web game built using CraftyJS and the SailsJS frameworks. Features
a multiplayer game board that allows players to shoot each other with light
beams. Sockets allow light beams to be created on one client and appear and
kill another player using a different browser session.

## Installation

Assuming that you have `npm` installed, run `npm install` from the root
directory. This will install all dependencies for this project.

## Running

To start the webserver, execute

    sails lift

The webpage will be accessible on port 1337 by default.

## Playing

Controls are simple. Use the W, A, S, D or arrow keys to move and press the
space bar to shoot a laser beam. Laser beams will orient in the direction that
you are currently facing.
