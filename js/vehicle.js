// Used for the Plane displayed in the 3D map
fly.m_createVehicleClass = function ()
{
    const Vehicle = class
    {
        constructor(id, lat, lng, altitude, heading)
        {
            this.id = id;
            this.pt = new google.maps.LatLngAltitude({ lat: lat, lng: lng, altitude: altitude });

            this.heading = heading;
            this.pitch = 0;
            this.roll = 0;
            this.speed = 0;

            this.m_deltaHeading = 0;
            this.m_deltaPitch = 0;

            // Camera settings
            this.cameraAltitudeOffset = 0;  // Can be adjusted to change camera height relative to vehicle
            this.cameraRange = 50;          // Distance from camera to look-at point
            this.cameraTiltOffset = 0;      // Additional tilt adjustment if needed

            this.modelForwardDistance = 25;
        };

        // Function to change heading (e.g., when arrow keys are pressed)
        changeHeading(delta)
        {
            this.heading = (this.heading + delta) % 360;
        }

        // Function to change pitch (e.g., for climbing or descending)
        changePitch(delta)
        {
            this.pitch = Math.max(-90, Math.min(90, this.pitch + delta));
        }

        changeSpeed(delta)
        {
            if (fly.mainMode != fly.FLY && delta > 0)
            {
                return;
            }

            this.speed += delta;

            // when animation is paused then a decelerate input will stop the vehicle
            if (fly.m_animationPaused && delta < 0)
            {
                this.speed = 0;
            }

            if (this.speed <= 0)
            {
                this.speed = 0;
            }

            // update speedometer
            fly.m_displayMetrics();
        }

        // move the vehicle - once every animation cycle
        positionUpdate()
        {
            // Update heading and pitch
            this.heading = (this.heading + this.m_deltaHeading + 360) % 360;
            this.pitch = Math.max(-90, Math.min(90, this.pitch + this.m_deltaPitch));

            // Convert to radians
            const pitchRadians = (-this.pitch) * Math.PI / 180;

            // Normalize heading and pitch values
            this.heading = (this.heading + 360) % 360;
            this.pitch = Math.max(-90, Math.min(90, this.pitch));

            // Calculate the horizontal distance traveled using pitch (how "forward" you move)
            let horizontalSpeed = this.speed * Math.cos(pitchRadians);

            // Compute new LatLng position using spherical geometry
            let newLatLng = google.maps.geometry.spherical.computeOffset(
                new google.maps.LatLng(this.pt.lat, this.pt.lng),
                horizontalSpeed,  // Distance in meters
                this.heading      // Heading in degrees
            );

            // Calculate the change in altitude
            let deltaAltitude = this.speed * Math.sin(pitchRadians);

            // Create the new LatLngAltitude object
            this.pt = new google.maps.LatLngAltitude({
                lat: newLatLng.lat(),
                lng: newLatLng.lng(),
                altitude: this.pt.altitude + deltaAltitude
            });

            // Update the map's position and orientation
            fly.m_earthMap.center = new google.maps.LatLngAltitude({
                lat: this.pt.lat,
                lng: this.pt.lng,
                altitude: this.pt.altitude
            });

            fly.m_earthMap.heading = this.heading;
            fly.m_earthMap.range = 0;
            fly.m_earthMap.tilt = 90 - this.pitch;

            switch (fly.m_cameraMode)
            {
                case 2:     // look behind
                    fly.m_earthMap.heading = (this.heading + 180) % 360;
                    fly.m_earthMap.tilt = 90 + this.pitch;
                    break;
                case 3:     // look left
                    fly.m_earthMap.heading = (this.heading + 270) % 360;
                    fly.m_earthMap.tilt = 90 + this.pitch;
                    break;
                case 4:     // look right
                    fly.m_earthMap.heading = (this.heading + 90) % 360;
                    fly.m_earthMap.tilt = 90 + this.pitch;
                    break;
                case 5:     // look down
                    fly.m_earthMap.tilt = 0;
                    break;
            }

            // update the plane model
            // the model is displayed slighlty ahead of the camera
            this.updateVehicleModelPosition();
        };


        updateVehicleModelPosition()
        {
            // Convert angles to radians
            const pitchRad = this.pitch * Math.PI / 180;

            // Calculate the horizontal distance (accounting for pitch)
            const horizontalDist = this.modelForwardDistance * Math.cos(pitchRad);

            // Calculate vertical offset based on pitch
            const verticalOffset = this.modelForwardDistance * Math.sin(pitchRad);

            // Calculate the new position in front of the camera using spherical geometry
            const modelLatLng = google.maps.geometry.spherical.computeOffset(
                new google.maps.LatLng(this.pt.lat, this.pt.lng),
                horizontalDist,
                this.heading
            );

            // Hide model when a camera mode is selected
            var l_altitude = fly.m_cameraMode ? -1000 : this.pt.altitude - verticalOffset;

            // Update the model's position
            fly.m_planeModel.position = {
                lat: modelLatLng.lat(),
                lng: modelLatLng.lng(),
                altitude: l_altitude
            };

            // Update the model's orientation
            fly.m_planeModel.orientation = {
                heading: this.heading - 90,            
                roll: -this.pitch - this.m_deltaPitch * 30,
                tilt: -this.m_deltaHeading * 45
            };

            // Set camera range to 0 for cockpit view
            fly.m_earthMap.range = 0;
        }

        drawVehicle()
        {

        };

    };

    this.Vehicle = Vehicle;
};

fly.m_initVehicle = function ()
{
    glog("Create vehicle @ lat = " + this.m_initialLat + " lng = " + this.m_initialLng + " alt = " + this.m_initialAltitude);

    this.m_userVehicle = new fly.Vehicle(1, this.m_initialLat, this.m_initialLng, this.m_initialAltitude, this.m_initialHeading);


}

