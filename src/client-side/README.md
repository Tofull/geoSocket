This is the client-side part of geosocket.

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
