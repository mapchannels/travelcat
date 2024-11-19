
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

// Used during drive mode animation. Every few seconds find the next panorama and move there
fly.m_findNextStreetView = function ()
{
    if (this.m_streetViewSearchInProgress) return;

    const currentPosition = this.pan.getPosition();
    const currentHeading = this.pan.getPov().heading;
    const currentPano = this.pan.getPano();
    let possiblePanoramas = [];

    // Get the current panorama data for connected links
    this.m_streetviewService.getPanoramaByLocation(currentPosition, 50, (data, status) =>
    {
        if (status === google.maps.StreetViewStatus.OK)
        {
            // Add connected panoramas to possibilities
            data.links.forEach(link =>
            {
                possiblePanoramas.push({
                    pano: link.pano,
                    heading: link.heading,
                    position: null,
                    headingDiff: Math.abs(((link.heading - currentHeading + 540) % 360) - 180)
                });
            });

            // Calculate point 5m ahead of current position
            const forwardPoint = google.maps.geometry.spherical.computeOffset(
                currentPosition,
                5, // 5 meters forward
                currentHeading
            );

            // Find panorama near the forward point
            this.m_streetviewService.getPanorama({
                location: forwardPoint,
                preference: google.maps.StreetViewPreference.NEAREST,
                radius: 5,
                sources: [google.maps.StreetViewSource.GOOGLE]
            }, (forwardData, forwardStatus) =>
            {
                if (forwardStatus === google.maps.StreetViewStatus.OK)
                {
                    const forwardPano = {
                        pano: forwardData.location.pano,
                        heading: currentHeading,
                        position: forwardData.location.latLng,
                        headingDiff: 0 // Forward point maintains current heading
                    };

                    // Only add if it's not already in our list
                    if (!possiblePanoramas.some(p => p.pano === forwardPano.pano))
                    {
                        possiblePanoramas.push(forwardPano);
                    }
                }

                // Find best panorama using a loop
                let bestPano = null;
                let smallestDiff = Infinity;

                for (let pano of possiblePanoramas)
                {
                    if (pano.pano !== currentPano && pano.headingDiff < smallestDiff)
                    {
                        smallestDiff = pano.headingDiff;
                        bestPano = pano;
                    }
                }

                // Update track and move to new panorama if found
                if (bestPano)
                {
                    fly.m_track.addPoint(currentPosition.lat(), currentPosition.lng(), fly.m_groundAltitude);
                    fly.pan.setPano(bestPano.pano);

                    if (fly.m_focus != fly.MAP)
                    {
                        // Update heading if not focused on street view
                        const pov = fly.pan.getPov();
                        pov.heading = bestPano.heading;
                        fly.pan.setPov(pov);
                    }

                    this.m_userVehicle.pt = currentPosition;
                    this.m_userVehicle.heading = bestPano.heading;
                }
                else
                {
                    fly.m_displayMessage("No Street View found");
                }
            });
        } else
        {
            fly.m_displayMessage("No Street View found");
        }
    });
}

