var GEOSOCKET = (function(geosocket) {
		var _this = geosocket;

		geosocket._socket = null;
		geosocket._me = {
			_position : {
					coords : {
						latitude : null,
						longitude : null
					}
				},
			_username : null
		};
		geosocket._idNavigationWatch = null;


		geosocket.init = function(options){
			options = options || {};
			options.hostname = options.hostname || document.location.hostname;
			options.port = options.port || document.location.port;
			_this._me._username =  options.username || _this._me._username;
			_this._socket = io('//'+document.location.hostname+':'+document.location.port);
			_this._eventListener();
			_this._getCurrentPosition();
		};


		geosocket._eventListener = function(){
			_this._onNewClient();
			_this._onCoordonneesBroadcast();
			_this._onClientLeft();
		}


		geosocket._watchPosition = function(callback){
			callback = callback || function(){};

			// Recuperation des coordonnees
			_this._idNavigationWatch = navigator.geolocation.watchPosition(function(position) {
				// Mise a jour des variables
				_this._me._position = position;
				// Broadcast the new coordinates
				_this._socket.emit('coordonneesClient',{
						pos : JSON.stringify({
							latitude : _this._me._position.coords.latitude,
							longitude : _this._me._position.coords.longitude
						}),
						name: _this._me._username
				});
				callback(position);
			},function(err) {console.warn('ERROR(' + err.code + '): ' + err.message);},
				{
					enableHighAccuracy: true,
					maximumAge: 0
				}
			);
		}

		geosocket.onWatchPosition = function(callback){
			navigator.geolocation.clearWatch(_this._idNavigationWatch);
			_this._watchPosition(callback);
		}


		geosocket._getCurrentPosition = function(callback){
			callback = callback || function(){};

			navigator.geolocation.getCurrentPosition(function(position){
				_this._watchPosition();
				callback(position);
			},function(err) {console.warn('ERROR(' + err.code + '): ' + err.message);},{
				maximumAge:600000
			});
		}

		geosocket.onGetCurrentPosition = function(callback){
			_this._getCurrentPosition(callback);
		}


		// Un nouveau client vient de se connecter au serveur
		geosocket._onNewClient = function(callback){
			callback = callback || function(){};

			_this._socket.on('new_client', function(data) {

				// On se presente a ce client en lui envoyant notre position
				_this._socket.emit('present_to_new_client', {
					socketid : data.socketid,
					pos : JSON.stringify({
						latitude : _this._me._position.coords.latitude,
						longitude : _this._me._position.coords.longitude
					}),
					name: _this._me._username
				});

				callback(data);
			});
		}

		geosocket.onNewClient = function(callback){
			_this._socket.off('new_client');
			_this._onNewClient(callback);
		}


		// Un client vient de partir
		geosocket._onClientLeft = function(callback){
			callback = callback || function(){};

			_this._socket.on('clientLeft', function(data) {
				callback(data);
			});
		}

		geosocket.onClientLeft = function(callback){
			_this._socket.off('clientLeft');
			_this._onClientLeft(callback);
		}


		// Un utilisateur vient de diffuser ses coordonnées
		geosocket._onCoordonneesBroadcast = function(callback){
			callback = callback || function(){};

			_this._socket.on('coordonneesBroadcast', function(data) {
				callback(data);
			});
		}

		geosocket.onCoordonneesBroadcast = function(callback){
			_this._socket.off('coordonneesBroadcast');
			_this._onCoordonneesBroadcast(callback);
		}


    return geosocket;
})(GEOSOCKET || {});
