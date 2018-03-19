var map = null;
var directionsManager = null;
var locations = [];
var Route = "";
var routeNum = 0;
var Routes = [];

// get the bing map key https://msdn.microsoft.com/en-us/library/ff428642.aspx
var credentials = "Athn_KItIkNuuG8lEUJQj1TfHTVfBARQJzx7t_QjY8M2DTcpu6bRJ80wEnuFAeE1";

function GetMap() {

	map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), {
		credentials: credentials
	});
};

async function PushPin() {
	map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), {
		credentials: credentials,
		center: new Microsoft.Maps.Location(12.910377, 100.858133),
	});

	locations = [{ lat: 12.910377, long: 100.858133, titles: 'Our Office' }, { lat: 12.934652, long: 100.883655, titles: 'Central Festival' }, { lat: 12.927435, long: 100.874596, titles: 'Walking Street' }, { lat: 12.972820, long: 100.889117, titles: 'Sanctuary of Truth' }, { lat: 12.833965, long: 100.942042, titles: 'Dolphin ' }];

	var len = locations.length;
	infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
		visible: false
	});

	//Assign the infobox to a map instance.
	infobox.setMap(map);

	for (var i = 1; i < len; i++) {
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
		//Add push pin
		map.entities.push(pin);
		//Get start and end location
		var startInitial = locations[0].lat + "," + locations[0].long;
		var endInitial = locations[i].lat + "," + locations[i].long;
		await new Promise(resolve => setTimeout(resolve, CreateRoute(startInitial, endInitial))
		);
	}
};

//Create route when Clicked on PushPin
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
async function CreateRoute(start, end) {
	if (directionsManager != null) {
		directionsManager.clearAll();
	}

	Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
		directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
		//Set Route Mode to driving
		directionsManager.setRequestOptions({ distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km, routeMode: Microsoft.Maps.Directions.RouteMode.driving });
		var waypoint1 = new Microsoft.Maps.Directions.Waypoint({ address: start });
		var waypoint2 = new Microsoft.Maps.Directions.Waypoint({ address: end });
		directionsManager.addWaypoint(waypoint1);
		directionsManager.addWaypoint(waypoint2);
		Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function (args) {
			var currentRoute = args.routeSummary;
			getRoute(currentRoute);
		})
		directionsManager.calculateDirections();
	})
};

function getRoute(Routes) {
	console.log(Routes[0].distance)
	if (routeNum < locations.length) {
		Route += "Distance: " + JSON.stringify(Routes[0].distance) + ",";
		Route += "Time: " + JSON.stringify(Routes[0].time / 60) + ",";
		Route += "TimeWithTraffic: " + JSON.stringify(Routes[0].timeWithTraffic / 60) + "<br>";
		routeNum++;
	}
	if (routeNum == locations.length - 1) {
		document.getElementById('printOutPanel').innerHTML = Route;
	}
};

function showTraffic() {
	Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', () => {
		var manager = new Microsoft.Maps.Traffic.TrafficManager(map);
		manager.setOptions({ flowVisible: true });
		manager.show();
	})
};