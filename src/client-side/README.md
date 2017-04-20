This is the client-side part of geoSocket.

With this little piece of code : 
```html
  <script src="/socket.io/socket.io.js"></script>
  <script src="/javascripts/libraries/geosocket-0.0.1/GEOSOCKET.js"></script>
  
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
This is my position Geoposition {coords: Coordinates, timestamp: 1492673971716}
5VvkoEdXBy33EAHZAAAG is now connected !
5VvkoEdXBy33EAHZAAAG se présente. Il nous envoie sa position : {"latitude":48.758543249,"longitude":2.621254564}
5VvkoEdXBy33EAHZAAAG has left !
```
