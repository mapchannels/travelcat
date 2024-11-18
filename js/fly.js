
fly.m_getZoomLevelForSpeed = function (speedKmh)
{
    // Define speed thresholds (in km/h) and their corresponding max zoom levels
    // Higher zoom number = more zoomed in
    const speedZoomMap = [
        { maxSpeed: 5, zoom: 15 },    // SLOW - zoomed-in view
        { maxSpeed: 10, zoom: 14 },
        { maxSpeed: 15, zoom: 13 },
        { maxSpeed: 25, zoom: 12 },
        { maxSpeed: 50, zoom: 11 },
        { maxSpeed: 75, zoom: 10 },
        { maxSpeed: 100, zoom: 9 },   // FAST
        { maxSpeed: 200, zoom: 8 },
        { maxSpeed: 300, zoom: 7 },
        { maxSpeed: 400, zoom: 6 },
        { maxSpeed: 600, zoom: 5 },
        { maxSpeed: 1000, zoom: 4 },   
        { maxSpeed: Infinity, zoom: 3 } // SUPER-FAST - wide area view
    ];

    // Find the appropriate zoom level based on current speed
    const zoomSetting = speedZoomMap.find(setting => speedKmh <= setting.maxSpeed);
    return zoomSetting.zoom;
}


fly.m_applyFlyMode = function ()
{
    this.setMainMode(fly.FLY);
    this.m_animationActive = true;

    var l_vehicle = this.m_userVehicle;

    // level out if diving
    if (this.m_animationActive && l_vehicle)
    {
        l_vehicle.speed = 6;
        l_vehicle.pitch = 0;
    }

    // halt any animation in progress
    this.m_earthMap.stopCameraAnimation();

    if (l_vehicle)
    {
        l_vehicle.m_deltaHeading = 0;
        l_vehicle.m_deltaPitch = 0;
    }

}


fly.getRandomLocation = function  ()
{
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const dir = Math.random() * 360;

    return {
        lat: 90 - (phi * 180 / Math.PI),
        lng: (theta * 180 / Math.PI) - 180,
        heading: dir
    };
};


fly.applyQuantumLeap = function ()
{
    this.setMainMode(fly.JUMP);
    this.pan.setVisible(false);     // make sure street view is closed
    this.resizePage();

    // find a random location on Earth
    var loc = this.getRandomLocation();
    var pt = new google.maps.LatLngAltitude({ lat: loc.lat, lng: loc.lng, altitude: 10000 });
    this.m_animationPaused = false;
    this.m_displayMetrics();

    // 15 seconds fly-to animation
    this.m_earthMap.flyCameraTo({
        endCamera: {
            center: pt,
            heading: loc.heading,
            tilt: 0,
            range: 100
        },
        durationMillis: 15000
    });

    // move the vehicle to the new point
    var l_vehicle = this.m_userVehicle;
    l_vehicle.pt = pt;
    l_vehicle.heading = loc.heading;
    l_vehicle.pitch = 0;
    l_vehicle.roll = 0;
    l_vehicle.speed = 1;    // 50 km/h
    l_vehicle.m_deltaHeading = 0;
    l_vehicle.m_deltaPitch = 0;

    // wait for the animation to complete then return to fly mode
    setTimeout(() => { fly.setMainMode(fly.FLY); fly.m_displayMetrics(); fly.m_track.clearPoints(); glog("applyQuantumLeap complete"); }, 15001);
}

// Change the camera mode used to display the 3D map view
fly.applyCameraMode = function ()
{
    fly.m_displayMessage("Camera: " + fly.m_CameraModeNames[fly.m_cameraMode]);

    // apply new camera mode (even if paused)
    fly.m_userVehicle.positionUpdate();
}
