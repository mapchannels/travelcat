
// Create KML data for export
// Only 2D (for now)
fly.m_generateKML = function (points)
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
    const coordinates = points
        .map(point => `${point.lng().toFixed(7)},${point.lat().toFixed(7)} `)      // ,${point.altitude.toFixed(2)
        .join('\n                    ');

    kml += coordinates;

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
    const kmlContent = this.m_generateKML(this.m_track.points);

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