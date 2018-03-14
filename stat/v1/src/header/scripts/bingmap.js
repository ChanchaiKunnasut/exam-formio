var map = null;

// get the bing map key https://msdn.microsoft.com/en-us/library/ff428642.aspx
var credentials = "AvUW8QE-5eiGK58lEwAVhlga9kJiMT1huXF5AUnqDNgY9Pehx-fwtmL3p4suUWPX";

function GetMap(request) {

	// countryName - name of the country from the CRM's form
	//var countryName = parent.Xrm.Page.getAttribute("new_name").getValue();
	var countryName = request;

	// calling virtual earth api
	var geocodeRequest = "https://dev.virtualearth.net/REST/v1/Locations?countryRegion=" + countryName + "&key=" + credentials + "&jsonp=GeocodeCallback";
	//var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Imagery/Map/Road/12.910377,100.858133/15?mapSize=500,500&pp=12.910377,100.858133;21;Our%20Office" + "&key=" + credentials + "&jsonp=GeocodeCallback";

	CallRestService(geocodeRequest);
}

function PushPin() {
	map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), {
		credentials: credentials,
	});

	//Array of multiple location.
	for (var i = 0; i < 5; i++) {
		if (i == 0) {
			lat = 12.910377;
			long = 100.858133;
			titles = "Together Teamsolutions";
			subTitles = "Our office";
		}
		if (i == 1) {
			lat = 12.927435;
			long = 100.874596;
			titles = "Walking Street";
			subTitles = "Travel Location";
		}
		if (i == 2) {
			lat = 12.934652;
			long = 100.883655;
			titles = "Central Festival Pattaya Beach"
			subTitles = "Travel Location";
		}
		if (i == 3) {
			lat = 12.972820;
			long = 100.889117;
			titles = "Senctuary of Truth"
			subTile = "Tavel Location";
		}
		if (i == 4) {
			lat = 12.833965;
			long = 100.942042;
			titles = "Dolphin Show";
			subTitles = "Travel Location";
		}

		var ll = new Microsoft.Maps.Location(lat, long);
		var pin = new Microsoft.Maps.Pushpin(ll, {
			apTypeId: Microsoft.Maps.MapTypeId.road,
			title: titles,
			subTitle: subTitles
		})
		// Add the pushpin to the map
		map.entities.push(pin);
	}
};

function CreateRoute(){
	Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
		var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
		//Set Route Mode to driving
		directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving });
		var waypoint1 = new Microsoft.Maps.Directions.Waypoint({ address: 'Our Office', location: new Microsoft.Maps.Location(12.910377, 100.858133) });
		var waypoint2 = new Microsoft.Maps.Directions.Waypoint({ address: 'Walking Street', location: new Microsoft.Maps.Location(12.927435, 100.874596) });
		//var waypoint3 = new Microsoft.Maps.Directions.Waypoint({ address: 'Dolphin Show', location: new Microsoft.Maps.Location(12.833965, 100.942042) });
		directionsManager.addWaypoint(waypoint1);
		directionsManager.addWaypoint(waypoint2);
		//directionsManager.addWaypoint(waypoint3);
		// Set the element in which the itinerary will be rendered
		directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('printOut') });
		directionsManager.calculateDirections();
		//directionsManager.clearAll();
	});
}

function GeocodeCallback(result) {

	if (result && result.resourceSets && result.resourceSets.length > 0 && result.resourceSets[0].resources && result.resourceSets[0].resources.length > 0) {

		var coordinates = result.resourceSets[0].resources[0].point.coordinates;
		var centerPoint = new Microsoft.Maps.Location(coordinates[0], coordinates[1]);

		map = new Microsoft.Maps.Map(document.getElementById("mapDiv"),
			{
				credentials: credentials,
				center: centerPoint,
				mapTypeId: Microsoft.Maps.MapTypeId.road,
				zoom: 5
			});

		var pushpin = new Microsoft.Maps.Pushpin(map.getCenter());
		map.entities.push(pushpin);
	}
}



function CallRestService(request) {
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", request);
	document.body.appendChild(script);
}