var map = null;
var directionsManager = null;
//https://developers.google.com/chart/interactive/docs/gallery/timeline

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
		center: new Microsoft.Maps.Location(12.910377, 100.858133),
	});

	var locations = [{ lat: 12.910377, long: 100.858133, titles: 'Our Office' }, { lat: 12.934652, long: 100.883655, titles: 'Central Festival' }, { lat: 12.927435, long: 100.874596, titles: 'Walking Street' }, { lat: 12.972820, long: 100.889117, titles: 'Sanctuary of Truth' }, { lat: 12.833965, long: 100.942042, titles: 'Dolphin ' }];

	var len = locations.length;
	infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
		visible: false
	});

	//Assign the infobox to a map instance.
	infobox.setMap(map);

	for (var i = 0; i < len; i++) {
		var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(locations[i].lat, locations[i].long), {
			title: locations[i].titles
		});
		//Store some metadata with the pushpin.
		pin.metadata = {
			title: locations[i].titles,
			description: 'Description for pin' + i,
			startla: locations[0].lat,
			startlong: locations[0].long,
			endla: locations[i].lat,
			endlong: locations[i].long
		};
		//Add a click event handler to the pushpin.
		Microsoft.Maps.Events.addHandler(pin, 'click', pushpinClicked);
		map.entities.push(pin);
	}
};

function pushpinClicked(e) {

	//Make sure the infobox has metadata to display.
	if (e.target.metadata) {
		//Set the infobox options with the metadata of the pushpin.
		infobox.setOptions({
			location: e.target.getLocation(),
			title: e.target.metadata.title,
			description: e.target.metadata.description,
			visible: true
		});

		Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
			//Generate some routes.
			CreateRoute(e.target.metadata.startla + "," + e.target.metadata.startlong, e.target.metadata.endla + "," + e.target.metadata.endlong);
		});
	}
};
function CreateRoute(start, end) {
	if (directionsManager != null) {
		directionsManager.clearAll();
	}

	directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
	//Set Route Mode to driving
	directionsManager.setRequestOptions({ distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km, routeMode: Microsoft.Maps.Directions.RouteMode.driving });
	var waypoint1 = new Microsoft.Maps.Directions.Waypoint({ address: start });
	var waypoint2 = new Microsoft.Maps.Directions.Waypoint({ address: end });
	directionsManager.addWaypoint(waypoint1);
	directionsManager.addWaypoint(waypoint2);
	// var allWaypoints = directionsManager.getRouteResult();
	// var numberWayPoints = allWaypoints.length;
	// var addressStr;
	//addressStr = allWaypoints[0].routeLegs[1];
	//document.getElementById('printOutPanel').innerHTML = addressStr;
	directionsManager.calculateDirections();
	//Render The panel
	//directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('printOutPanel') });
	//Show Route on the map.
};

function showTraffic() {
	Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', () => {
		var manager = new Microsoft.Maps.Traffic.TrafficManager(map);
		manager.setOptions({ flowVisible: true });
		manager.show();
	})
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