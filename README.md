# geoSocket
Javascript plugin for real time position sharing - compatible with Leaflet, Google Maps and others


## Server-side
[![NPM](https://nodei.co/npm/geosocket.png?downloads=true)](https://nodei.co/npm/geosocket/)
[![npm version](https://badge.fury.io/js/geosocket.svg)](https://badge.fury.io/js/geosocket)

Install the geosocket package (server-side) with npm :
```sh
npm install --save geosocket
```

Then configure your server by adding this little piece of code into `bin/www` file (on Express framework):
```js
/* Modules dependencies */
var geosocket = require('geosocket');

[...]
/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * geosocket (based on socket.io)
 */

geosocket(server);

[...]
```


## Client-Side
[![Bower version](https://badge.fury.io/bo/geosocket.svg)](https://badge.fury.io/bo/geosocket)


> The server-side is required to connect the sockets

Install the geosocket package (client-side) with bower :
```sh
bower install --save geosocket
```

Then used it with this little piece of code :
```html

  <script src="/bower_components/socket.io-client/dist/socket.io.min.js"></script>
  <script src="/bower_components/geosocket/src/client-side/GEOSOCKET.js"></script>

  <script type="text/javascript">
    var config = {
      local : {
        user : {
          username : "test"
        }
      }
    }

    var sock = GEOSOCKET;
    sock.init({
      username: config.local.user.username
    });
    sock.onNewClient(function(data){
      console.log(data.socketid + " is now connected !");
    });
    sock.onGetCurrentPosition(function(position){
      console.log("My quick location is", position);
    })
    sock.onWatchPosition(function(position){
      console.log("This is my location", position);
    });
    sock.onClientLeft(function(data){
      console.log(data.socketid + " has left !");
    });
    sock.onCoordonneesBroadcast(function(data){
      console.log(data.socketid + " is presenting. It is sharing its location: "+ data.pos);
    })
  </script>
```
You should get something like this:
```
My quick location is Geoposition {coords: Coordinates, timestamp: 1492673971716}
This is my position Geoposition {coords: Coordinates, timestamp: 1492673971716}
5VvkoEdXBy33EAHZAAAG is now connected !
5VvkoEdXBy33EAHZAAAG is presenting. It is sharing its location: {"latitude":48.758543249,"longitude":2.621254564}
5VvkoEdXBy33EAHZAAAG has left !
```
