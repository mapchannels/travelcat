
// Create the Google 2D road map (also contains the street view panorama)
fly.m_initMap = function ()
{
    var pt = new google.maps.LatLng(this.m_initialLat, this.m_initialLng);
    
    this.mapOptions = {
        zoom: 15,
        center: pt,
        disableDefaultUI: true,
        scaleControl: true,
        gestureHandling: "greedy",
        fullscreenControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        keyboardShortcuts: false,
        zoomControl: true,
        cameraControl: true,
        rotateControl: true
    };

    const mapDiv = eid("mapDiv");

    var map = new google.maps.Map(mapDiv, this.mapOptions);
    this.map = map;

    google.maps.event.addListener(map, "click", function (a)
    {
        var pt = a.latLng;
        fly.map.setCenter(pt);
    });

}


