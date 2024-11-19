
// The Track stores the route travelled by the vehicle. It is displayed on the 2D map as a red line and the data can be exported as a KML
fly.CreateTrackClass = function ()
{
    const Track = class
    {
        constructor(map, trackType)
        {
            this.map = map;
            this.points = [];
            this.points3d = [];
            this.polyline = new google.maps.Polyline({
                path: this.points,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: this.map
            });
        };

        addPoint(lat, lng, alt)
        {
            var pt = new google.maps.LatLng(lat, lng);

            this.points.push(pt);

            var ept = { lat: lat, lng: lng, altitude: alt };
            this.points3d.push(ept);

            this.updatePolyline();

            // sync the map
            if (fly.m_focus != fly.MAP)
            {
                this.map.setCenter(pt);
            }

            // display the track distance in KM
            var l_distanceInt = parseInt(this.getTotalDistance());
            if (l_distanceInt > 0)
            {
                fly.m_distanceControl.m_controlText.innerHTML = l_distanceInt + " km";
            }
        };

        clearPoints()
        {
            this.points = [];
            this.points3d = [];
            this.updatePolyline();
        };

        updatePolyline()
        {
            this.polyline.setPath(this.points);
        };

        getPoints()
        {
            return [...this.points];
        };

        getTotalDistance()
        {
            if (this.points.length < 2) return 0;

            let distance = 0;
            for (let i = 0; i < this.points.length - 1; i++)
            {
                distance += google.maps.geometry.spherical.computeDistanceBetween(
                    this.points[i],
                    this.points[i + 1]
                ) / 1000; // Convert meters to KM
            }
            return distance;
        };
    };

    this.Track = Track;
};


