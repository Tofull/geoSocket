'use strict';

var socket_io = require("socket.io"); // Utilities for real time connection

function GEOSOCKET(server) {
  var io = socket_io();

  // Socket management
  io.sockets.on('connection', function(socket, pseudo) {

    // Broadcast information when new client is connecting
    socket.broadcast.emit('new_client', {
      socketid: socket.id
    });

    // Send count of connected people to every one
    io.sockets.emit('count', {
      clientsCount: io.engine.clientsCount
    });

    // Send information about connected people to new client once connected
    socket.on('present_to_new_client', function(data) {
      io.sockets.connected[data.socketid].emit('coordonneesBroadcast', {
        socketid: socket.id,
        pos: data.pos,
        name: data.name
      });
    });

    // Broadcast position change
    socket.on('coordonneesClient', function(data) {
      socket.broadcast.emit('coordonneesBroadcast', {
        socketid: socket.id,
        pos: data.pos,
        name: data.name
      });
    });

    // Broadcast a specific message to every one
    socket.on('message', function(data) {
      socket.broadcast.emit('messageReceive', {
        message: data.message
      });
    });

    // Resend informations once disconnected
    socket.once('disconnect', function() {
      // Update count of connected people
      socket.broadcast.emit('count', {
        clientsCount: io.engine.clientsCount
      });
      // Send informations about the client who left
      socket.broadcast.emit('clientLeft', {
        socketid: socket.id
      });
    });
  });

  io.attach(server);

  return function GEOSOCKET(req, res, next) {
    res.io = io;
    return next();
  };
}


module.exports = GEOSOCKET;
