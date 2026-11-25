## How to check a GeoJSON file

Open a .geojson or .json file, or paste a GeoJSON document and select **Validate GeoJSON**. Use **Try an example** to see a valid FeatureCollection. You can edit the input and check it again. Files and pasted text stay in your browser.

## What the validator checks

First, the tool checks JSON syntax. It then checks GeoJSON structure, including FeatureCollection, Feature, GeometryCollection and individual geometry types. Positions use WGS 84 longitude and latitude order. The validator checks coordinate ranges, minimum line and ring lengths, ring closure, feature properties and the shape of bounding boxes. Empty feature collections and null feature geometries are valid.

## Find and fix an issue

An error path such as `$.features[0].geometry.coordinates` points to the coordinates of the first feature. Start with the indicated field, make the correction, then validate again. The result describes file structure. Geometry topology, such as self-intersections or overlaps, is a separate GIS check. To visually inspect the valid result, open it in the [GeoJSON Viewer](../geojson-viewer/).
