
// When in driving mode sync the earth map as street view heading changes 

fly.m_syncDriveHeading = function (pt, heading)
{
    var l_earthPoint = { lat: pt.lat(), lng: pt.lng(), altitude: this.m_groundAltitude };

    this.m_earthMap.center = l_earthPoint;
    this.m_earthMap.heading = heading;
}

