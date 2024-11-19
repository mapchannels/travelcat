
// Create KML data for export
// Only 2D (for now)
fly.m_generateKML = function (points3d)
{
    // Start KML document
    let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.org/kml/2.2">
    <Document>
        <name>Travel Cat</name>
        <description>Exported route from https://tripgeo.com/travelcat</description>
        <Style id="routeStyle">
            <LineStyle>
                <color>ff0000ff</color>
                <width>3</width>
            </LineStyle>
        </Style>
        <Placemark>
            <name>Route</name>
            <styleUrl>#routeStyle</styleUrl>
            <LineString>
                <tessellate>1</tessellate>
                <coordinates>`;

    // Add all points as coordinates
    let coordinateStrings = [];
    for (let ept of points3d)
    {
        const lng = ept.lng.toFixed(7);
        const lat = ept.lat.toFixed(7);
        const alt = (ept.altitude || 0).toFixed(2);
        coordinateStrings.push(`${lng},${lat},${alt}`);
    }
    kml += coordinateStrings.join('\n                    ');

    // Close KML document
    kml += `
                </coordinates>
            </LineString>
        </Placemark>
    </Document>
</kml>`;

    return kml;
}

// Export KML data to download
fly.m_exportKML = function ()
{    
    // Generate KML content
    const kmlContent = this.m_generateKML(this.m_track.points3d);

    // Create blob and download link
    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = window.URL.createObjectURL(blob);

    // Create and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'map-points.kml';
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}