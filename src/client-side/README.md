This is the client-side part of geoSocket.

```html
  <script src="/socket.io/socket.io.js"></script>
  <script src="/javascripts/libraries/geosocket-0.0.1/geosocket.js"></script>
  
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
