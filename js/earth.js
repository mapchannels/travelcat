
// The Earth Map is the Google Photorealistic 3D Map
fly.m_initEarthMap = async function ()
{
    const l_earthDiv = eid("earthDiv");

    // Prevent right-clicks
    l_earthDiv.addEventListener('contextmenu', function (event)
    {
        event.preventDefault();
        event.stopPropagation();
    });

    const { Map3DElement } = await google.maps.importLibrary("maps3d");

    const pt = { lat: this.m_initialLat, lng: this.m_initialLng, altitude: this.m_initialAltitude };

    const l_earthCamera =
    {
        center: pt,
        heading: 0,
        tilt: 45,
        range: 100
    };

    this.m_earthCamera = l_earthCamera;

    const l_earthMap = new Map3DElement({
        center: pt,
        range: l_earthCamera.range,
        tilt: l_earthCamera.tilt,
        heading: l_earthCamera.heading
    });

    // click on 3d map location to enter drive mode (if street view is found there)
    l_earthMap.addEventListener('gmp-click', (event) =>
    {
        if (event && event.position)
        {
            fly.m_groundAltitude = event.position.altitude;

            console.log("earth map click @ " + event.position.lat + " " + event.position.lng + ", altitude = " + event.position.altitude);

            fly.m_enterDriveMode(event.position);
        }
    });

    l_earthDiv.append(l_earthMap);

    this.m_earthMap = l_earthMap;
};
