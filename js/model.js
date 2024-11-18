
// Load the three 3D models used in the game (car, plane and boat)

fly.m_initCarModel = function ()
{
    // Scaled up model.
    const modelOptions =
    {
        position: { lat: this.m_initialLat, lng: this.m_initialLng, altitude: 0 },
        orientation: { heading: 0, tilt: -90, roll: 0 },
        scale: this.m_carScale
    };

    const model = new google.maps.maps3d.Model3DElement({
        src: fly.m_carModelURI,
        position: modelOptions.position,
        altitudeMode: "CLAMP_TO_GROUND",
        orientation: modelOptions.orientation,
        scale: modelOptions.scale
    });

    this.m_carModel = model;

    this.m_earthMap.append(model);
};


fly.m_initPlaneModel = function ()
{
    // Scaled up model.
    const modelOptions =
    {
        position: { lat: this.m_initialLat, lng: this.m_initialLng, altitude: 1800 },
        orientation: { heading: 0, tilt: -90, roll: 0 },
        scale: this.m_planeScale
    };

    const model = new google.maps.maps3d.Model3DElement({
        src: fly.m_planeModelURI,
        position: modelOptions.position,
        altitudeMode: "ABSOLUTE",
        orientation: modelOptions.orientation,
        scale: modelOptions.scale
    });

    this.m_planeModel = model;

    this.m_earthMap.append(model);
};

fly.m_initBoatModel = function ()
{
    // Scaled up model.
    const modelOptions =
    {
        position: { lat: this.m_initialLat, lng: this.m_initialLng, altitude: 0 },
        orientation: { heading: 0, tilt: -90, roll: 0 },
        scale: this.m_boatScale
    };

    const model = new google.maps.maps3d.Model3DElement({
        src: fly.m_boatModelURI,
        position: modelOptions.position,
        altitudeMode: 'RELATIVE_TO_GROUND',
        orientation: modelOptions.orientation,
        scale: modelOptions.scale
    });

    this.m_boatModel = model;

    this.m_earthMap.append(model);
};

// change location and heading of the car or boat model used in drive mode
fly.m_updateDriveModel = function ()
{
    if (this.mainMode == fly.DRIVE)
    {
        var l_vehicle = this.m_userVehicle;
        var lat = l_vehicle.pt.lat();
        var lng = l_vehicle.pt.lng();
        var heading = l_vehicle.heading;

        if (this.m_boatMode)
        {
            // update the boat model
            this.m_boatModel.position = { lat: lat, lng: lng, altitude: 0 };
            this.m_boatModel.orientation = { heading: heading - 90, tilt: -90, roll: 0 };
        }
        else
        {
            // update the car model
            this.m_carModel.position = { lat: lat, lng: lng, altitude: 0 };
            this.m_carModel.orientation = { heading: heading - 90, tilt: -90, roll: 0 };
        }
    }
}

fly.m_hideUnusedDriveModel = function ()
{
    if (this.m_boatMode)
    {
        // hide the car model
        this.m_carModel.position = { lat: 0, lng: 0, altitude: -1000 };
    }
    else
    {
        // hide  the boat model
        this.m_boatModel.position = { lat: lat, lng: lng, altitude: -1000 };
    }
}
