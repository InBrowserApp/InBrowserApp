## How to convert GPX to GeoJSON

Open a .gpx file or paste GPX XML and select **Convert to GeoJSON**. Use **Try an example** to see a track, a route and a waypoint in the result. Copy the GeoJSON or download a .geojson file for your mapping or GIS project. The conversion runs in your browser, keeping the input on your device.

## How tracks, routes and waypoints are converted

The output is a GeoJSON FeatureCollection. Waypoints become points, routes become lines, and tracks with several continuous segments keep those segments separate. A segment or route with one coordinate becomes a point. Descriptive fields such as names and notes stay with their features.

## Coordinates, elevation and time

GeoJSON stores positions in longitude, latitude order. Lines that cross the antimeridian are split at 180° for display on world maps. An elevation, when available, becomes a third coordinate in meters. Point times are stored in feature properties. Times along routes and track segments stay in coordinate order so they can be matched to positions. You can open the output in the [GeoJSON Viewer](../geojson-viewer/) or explore the original GPX in the [GPX Viewer & Elevation Profile](../gpx-viewer/).
