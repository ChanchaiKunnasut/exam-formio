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
       getRoute(e.target.metadata.startla +","+ e.target.metadata.startlong ,e.target.metadata.endla+","+e.target.metadata.endlong);
    });

    Microsoft.Maps.loadModule("Microsoft.Maps.Traffic", function () {
        //Create an instance of the traffic manager and bind to map.
trafficManager = new Microsoft.Maps.Traffic.TrafficManager(map);

//Display the traffic data.
trafficManager.show();
})
    }


}