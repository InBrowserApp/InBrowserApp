## How to open a Shapefile

Drop a ZIP of your Esri Shapefile into the viewer. You can also choose the .shp and its matching files together. If the ZIP contains several Shapefiles, use **Layer** to switch between them. Select **Try an example** to explore a two-layer dataset with points and polygons. Your files are read in the browser and stay on this device.

## Which Shapefile files do you need?

The .shp contains the geometry and is enough to preview a layer with geographic coordinates. Include the matching .dbf for attributes, .prj for the coordinate reference system, and .cpg for the attribute text encoding when available. Keep files for the same layer together with the same base name. The .shx index can stay in the ZIP or selection.

## Explore the map and attributes

The offline map fits the current layer. Use the map controls to zoom or fit it again, and choose a shape on the map or from the **Features** list to see its attributes. A supported .prj lets the viewer transform projected coordinates for the map. Without one, coordinates in longitude and latitude range are treated as WGS 84. If a layer needs a projection, reopen it with its .prj to place it correctly.
