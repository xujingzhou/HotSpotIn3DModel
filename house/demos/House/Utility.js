/**
 * Author: EPK Technologies s.r.o. (http://www.epk-technologies.com)
 * Copyright 2015 EPK Technologies s.r.o. (http://www.epk-technologies.com)
 */
define(function () {

	/**
	 * @constructor
	 * @class Utility
	 * @exports app/3d/Utility
	 */
	function Utility(){}

	/**
	 * Converts GPS to city model coordinates
	 *
	 * @param lat number
	 * @param lon number
	 * @returns {{x: number, y: number}}
	 */
	Utility.gpsToModelCoords = function(lat, lon){
		//lat = lat * 0.6417173836;

		var x = (lon - 14.403485) * 1114.9332780329	- 24.5308643000;
		var y = (50.07549300 - lat) * -1112.9632793718 - 2.9473349000;

		return {x: x, y: y};
	};

	Utility.gpsToModelCoordsVector = function(lat, lon, height){
		if(!height){
			height = 0.0;
		}

		var pos = Utility.gpsToModelCoords(lat, lon);
		return new BABYLON.Vector3(pos.x, height, pos.y);
	};

	Utility.gpsToTileCoords = function(lat, lon, zoom){
		if(!zoom){
			zoom = 16;
		}

		var x = (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
		var y = (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));

		return {x: x, y: y};
	};

	Utility.tileCoordsToGps = function(x, y, zoom){
		if(!zoom){
			zoom = 16;
		}

		var lon = (x/Math.pow(2,zoom)*360-180);

		var n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom);
		var lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));

		return {lat: lat, lon: lon};
	};

	Utility.randomVector = function(){
		var random_vector = BABYLON.Vector3.Zero;

		phi = Math.random() * Math.PI * 2.0;
		cos_theta = Math.random() * 2.0 - 1;

		theta = Math.acos(cos_theta);
		random_vector.x = Math.sin(theta) * Math.cos(phi);
		random_vector.y = Math.sin(theta) * Math.sin(phi);
		random_vector.z = Math.cos(theta);

		return random_vector;
	};

	return Utility;
});