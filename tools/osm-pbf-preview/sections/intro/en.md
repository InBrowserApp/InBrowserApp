## How to open an OSM PBF file

Open or drop an OpenStreetMap `.osm.pbf` or `.pbf` extract. The browser scans the file and shows counts for nodes, ways and relations. On the map, select a feature or choose one from the list to inspect tags such as `name`, `highway`, or `amenity`. Use **Try an example** to see how points and ways appear before opening your file. Your file stays on your device.

## What the map preview shows

The counts include all records in the extract. The map shows up to 200 tagged nodes and 400 tagged ways. A way needs the coordinates of its referenced nodes to appear, so some ways may be missing from an incomplete extract. Relations are counted in the totals. The preview uses a simple offline basemap so you can identify features and check tags without requesting remote map tiles.

## What is an OpenStreetMap PBF extract?

OpenStreetMap uses [Protocolbuffer Binary Format](https://wiki.openstreetmap.org/wiki/PBF_Format) to store map data compactly. A regional extract contains raw OpenStreetMap data for an area such as a city or country. A `.pbf` filename can also refer to a web vector tile, which uses a different schema. Choose a regional extract for faster scanning, especially on mobile. For real OpenStreetMap data, keep the [OpenStreetMap attribution](https://www.openstreetmap.org/copyright) when you share the data or a map based on it.
