
// Set up streetview handlers
fly.m_initStreetView = function ()
{
    const pan = this.map.getStreetView();
    this.pan = pan;

    this.m_streetviewService = new google.maps.StreetViewService();

    pan.addListener("position_changed", (a) => 
    {
        var pt = pan.getPosition();
        var pov = pan.getPov();

        fly.m_userVehicle.pt = pt;

        if (fly.m_animationPaused)
        {
            fly.m_userVehicle.heading = pov.heading;
        }

        // update the car/boat model
        fly.m_updateDriveModel();

        // sync the earth map
        if (this.m_focus == fly.MAP)
        {
            this.m_earthMap.stopCameraAnimation();

            this.m_earthMap.center = { lat: pt.lat(), lng: pt.lng(), altitude: fly.m_groundAltitude };
            this.m_earthMap.heading = pov.heading;
            this.m_earthMap.range = 100;
            this.m_earthMap.tilt = 45;
        }


    });

    // when the street view heading changes, also change the 3d map heading
    pan.addListener("pov_changed", (a) => 
    {
        if (fly.m_focus == fly.MAP)
        {
            var pt = pan.getPosition();
            var pov = pan.getPov();

            fly.m_syncDriveHeading(pt, pov.heading);
        }
    });

    pan.addListener('closeclick', () =>
    {
        // return to fly mode
        fly.m_exitDriveMode();
    });
}

// If a street view is found then enter drive mode
fly.m_enterDriveMode = function (ept)
{
    this.m_findNearestStreetView(ept);
}

// Return to fly mode
fly.m_exitDriveMode = function ()
{
    // Move plane position to 50 metres above the current street view position
    var pt = this.pan.getPosition();
    if (pt)
    {
        this.m_userVehicle.pt = { lat: pt.lat(), lng: pt.lng(), altitude: this.m_groundAltitude + 50 };

        var pov = this.pan.getPov();
        this.m_userVehicle.heading = pov.heading;

        this.m_userVehicle.m_deltaHeading = 0;
        this.m_userVehicle.m_deltaPitch = 0;
        this.m_userVehicle.speed = 1;  // slow down plane to 50 kmh

        this.m_cameraMode = 0;  // ensure camera is in default mode
        this.m_streetViewSearchInProgress = false;
    }

    this.setMainMode(fly.FLY);
    this.pan.setVisible(false);

    this.resizePage();      // switch back to default earth-map layout

    this.m_animationPaused = false;
}

// Called when a point on the earth map is clicked
fly.m_findNearestStreetView = function (ept)
{
    this.m_streetViewSearchInProgress = true;
    var pt = new google.maps.LatLng(ept.lat, ept.lng);

    var l_streetviewRequest =
    {
        location: pt,
        preference: google.maps.StreetViewPreference.NEAREST,
        radius: 50,
        sources: [google.maps.StreetViewSource.GOOGLE] // DEFAULT]
    };

    // find closest streetview
    this.m_streetviewService.getPanorama(l_streetviewRequest, function (p_data, p_status)
    {
        fly.m_streetViewSearchInProgress = false;

        if (p_status == google.maps.StreetViewStatus.OK)
        {
            var l_location = p_data.location;

            var pt = l_location.latLng;
            var panoID = l_location.pano;

            // glog("show street view @ " + pt + ", pano = " + panoID);

            var l_panOptions =
            {
                position: pt,
                pano: panoID,
                pov: { heading: fly.m_earthMap.heading, zoom: 0, pitch: 0 },
                visible: true
            };

            fly.pan.setOptions(l_panOptions);
            fly.m_lastStreetViewTime = Date.now();

            // enter drive mode
            fly.setMainMode(fly.DRIVE);
            fly.resizePage();          // switch to alternate map-earth layout

            // sync the 3d map
            fly.m_earthMap.center = ept;
            fly.m_earthMap.range = 100;
            fly.m_earthMap.tilt = 45;
            fly.m_earthMap.heading = fly.m_userVehicle.heading;

            fly.m_animationPaused = false;

            fly.m_displayMessage("Found Street View");

        }
        else
        {
            fly.m_displayMessage("Street View Not Found");
        }

        fly.m_streetViewSearchInProgress = false;

    });
}


// Used during drive mode animation. Ever few seconds find the next panorama and move there
fly.m_findNextStreetView = function ()
{
    if (this.m_streetViewSearchInProgress) return;

    // Get the current facing within panorama
    var currentFacing = this.pan.getPov().heading;

    // Get the current panorama data
    this.m_streetviewService.getPanoramaByLocation(this.pan.getPosition(), 50, (data, status) =>
    {
        if (status === google.maps.StreetViewStatus.OK)
        {
            // List of connected panoramas
            const links = data.links;

            // Find the panorama link closest to the current heading
            let closestPanorama = null;
            let closestHeadingDiff = Infinity;

            links.forEach(link =>
            {
                // Calculate the difference between link heading and current facing direction
                const headingDiff = Math.abs(link.heading - currentFacing);

                // Normalize the difference to be within [0, 180] range for comparison
                const normalizedDiff = Math.min(headingDiff, 360 - headingDiff);

                // Update if this is the closest direction
                if (normalizedDiff < closestHeadingDiff)
                {
                    closestHeadingDiff = normalizedDiff;
                    closestPanorama = link;
                }
            });

            // If a closest panorama link is found, load it
            if (closestPanorama)
            {
                var pt = fly.pan.getPosition();

                fly.m_track.addPoint(pt.lat(), pt.lng());

                fly.pan.setPano(closestPanorama.pano);

                var pov = fly.pan.getPov();

                if (fly.m_focus != fly.MAP)
                {
                    // change heading unless focused on street view
                    pov.heading = closestPanorama.heading;
                    fly.pan.setPov(pov);
                }

                this.m_userVehicle.pt = pt;
                this.m_userVehicle.heading = closestPanorama.heading;
            } else
            {
                // No suitable panorama link found.
                fly.m_displayMessage("No Street View found");
            }
        }
        else
        {
            fly.m_displayMessage("No Street View found");
        }
    });

}

