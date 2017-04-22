This is the server-side part of geosocket.

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
