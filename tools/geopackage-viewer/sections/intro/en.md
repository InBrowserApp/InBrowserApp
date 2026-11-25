## How to open a GeoPackage

Choose or drop a .gpkg file, then use **Layer or table** to switch between its contents. Select **Try an example** to open a package with a point layer and a polygon layer. The GeoPackage is opened only on your device. The bundled offline map works after the page loads without requesting online map tiles.

## Explore vector layers and attributes

The map fits the selected vector layer. Click a point, line, or polygon or choose it from the **Features** list to see its attributes. When a layer declares a supported coordinate reference system, the viewer places its features using WGS 84. You can also choose a non-spatial table and browse individual records. The viewer previews up to 500 records per layer so the map stays responsive on large files.

## What a GeoPackage contains

GeoPackage is an OGC format that stores spatial data in a single SQLite file. One package can hold several vector layers, ordinary attribute tables, and tile tables. Tile entries appear in the layer list. Choose a vector layer to view shapes on the map. If you have an Esri Shapefile with separate companion files, use the [Shapefile Viewer](../shapefile-viewer/).
