var assert = require('assert');
// var expect = require('expect.js');
var expect = require('chai').expect;
var should = require('chai').should();
var sinon = require('sinon');

var http = require('http').Server;
var GEOSOCKET = require('../../src/server-side/index');
var ioc = require('socket.io-client');


// Creates a socket.io client for the given server
function client(srv, nsp, opts) {
  if ('object' == typeof nsp) {
    opts = nsp;
    nsp = null;
  }
  var addr = srv.address();
  if (!addr) addr = srv.listen().address();
  var url = 'ws://localhost:' + addr.port + (nsp || '');
  return ioc(url, opts);
}


describe('GEOSOCKET', function() {

  describe('request handler creation', function() {
    var geosocket;

    beforeEach(function() {
      geosocket = GEOSOCKET(http());
    });

    it('should return a function()', function() {
      geosocket.should.be.a('function');
    });

    it('should accept three arguments', function() {
      expect(geosocket.length).to.equal(3);
    });
  });


  describe('request handler calling', function() {
    it('should call next() once', function() {
      var geosocket = GEOSOCKET(http());
      var nextSpy = sinon.spy();

      geosocket({}, {}, nextSpy);
      expect(nextSpy.calledOnce).to.be.true;
    });
  });


  describe('#attributes()', function() {
    it('should have a io object', function() {
      var geosocket = GEOSOCKET(http());
      var spy = sinon.spy();
      geosocket({}, spy, function() {});
      expect(spy.io).to.be.an('object');
    })
  });


  describe('#listeners()', function() {
    var server;
    var geosocket;

    beforeEach(function() {
      server = http();
      geosocket = GEOSOCKET(server);
    });

    it('should detect a connect event', function(done) {
      var socket = client(server);
      var spy = sinon.spy();
      geosocket({}, spy, function() {});

      var counter = 0;
      spy.io.on('connect', function(socket) {
        counter++;
      })

      setTimeout(function() {
        expect(counter).to.equal(1);
        done();
      }, 30);

    });

    it('should broadcast socket.id when new client is coming', function(done) {

      var socket = client(server);
      var socket2 = client(server);
      var spy = sinon.spy();
      geosocket({}, spy, function() {});

      var socketIDList = [];
      spy.io.on('connect', function(socket) {
        socketIDList.push(socket.id);
      })

      socket.on('new_client', function(data) {
        expect(data).to.eql({
          socketid: socketIDList[1]
        });
        done();
      });
    });


    it('should send data to present to new client', function(done) {
      var socket1 = client(server);
      var socket2 = client(server);
      var spy = sinon.spy();
      geosocket({}, spy, function() {});

      var counter = 0;

      socket1.on('connect', function(data) {
        socket1.emit('present_to_new_client', {
          socketid: socket1.id,
          pos: JSON.stringify({
            latitude: 43.25758,
            longitude: 3.25468
          }),
          name: "myName"
        });
      });

      socket1.on('coordonneesBroadcast', function(data) {
        expect(data).to.eql({
          socketid: socket1.id,
          pos: JSON.stringify({
            latitude: 43.25758,
            longitude: 3.25468
          }),
          name: "myName"
        });
        done();
      })
    });

    it('should broadcast data', function(done) {
      var socket1 = client(server);
      var socket2 = client(server);
      var spy = sinon.spy();
      geosocket({}, spy, function() {});

      var counter = 0;

      socket1.on('connect', function(data) {
        socket1.emit('coordonneesClient', {
          pos: JSON.stringify({
            latitude: 43.25758,
            longitude: 3.25468
          }),
          name: "myName"
        });
      });

      socket2.on('coordonneesBroadcast', function(data) {
        expect(data).to.eql({
          socketid: socket1.id,
          pos: JSON.stringify({
            latitude: 43.25758,
            longitude: 3.25468
          }),
          name: "myName"
        });
        done();
      })
    });

    it('should send message', function(done) {
      var socket1 = client(server);
      var socket2 = client(server);
      var spy = sinon.spy();
      geosocket({}, spy, function() {});

      var counter = 0;

      socket1.on('connect', function(data) {
        socket1.emit('message', {
          message: "i am a test message"
        });
      });

      socket2.on('messageReceive', function(data) {
        expect(data).to.eql({
          message: "i am a test message"
        });
        done();
      })
    });

    it('should emit count', function(done) {
      var socket1 = client(server);
      var spy = sinon.spy();
      geosocket({}, spy, function() {});



      socket1.on('count', function(data) {
        expect(data).to.eql({
          clientsCount: 1
        });
        done();
      })
    });

    it('should update count', function(done) {
      var socket1 = client(server);
      var socket2 = client(server);
      var spy = sinon.spy();
      geosocket({}, spy, function() {});

      var counter = 0;
      socket1.on('count', function(data) {
        counter = data.clientsCount;
      })

      socket2.on('count', function(data) {
        expect(data).to.eql({
          clientsCount: 2
        });
        expect(counter).to.eql(2);
        done();
      })
    });

    it('should update count once disconnect', function(done) {
      var socket1 = client(server);
      var socket2 = client(server);

      socket2.once('connect', function() {
        socket2.disconnect();
      });

      var spy = sinon.spy();
      geosocket({}, spy, function() {});

      setTimeout(function() {
        expect(spy.io.engine.clientsCount).to.eql(1);
        done();
      }, 200);


    });

    it('should send socket id once disconnect', function(done) {
      var socket1 = client(server);
      var socket2 = client(server);

      var spy = sinon.spy();
      geosocket({}, spy, function() {});

      var socketIDList = [];
      spy.io.on('connect', function(socket) {
        socketIDList.push(socket.id);
      })

      socket2.once('connect', function() {
        socket2.disconnect();
      });

      socket1.on('clientLeft',
        function(data) {
          expect(data).to.eql({
            socketid: socketIDList[1]
          });
          done();
        });
    });

  });
});
