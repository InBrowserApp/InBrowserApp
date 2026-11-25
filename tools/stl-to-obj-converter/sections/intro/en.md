## Convert an STL file to Wavefront OBJ

Choose **Open file** or drop an `.stl` file onto the converter. It reads both ASCII and binary STL and prepares an `.obj` download in your browser. Choose **Try an example** to convert a small mounting bracket first, then choose **Download OBJ** to save it.

## Check what the OBJ contains

The conversion writes the original surface triangles to a Wavefront OBJ file. Vertices at identical positions share an OBJ vertex index, which makes the resulting mesh easier to edit. It keeps the coordinate axes and does not scale the mesh. STL has no standard unit setting. If an edge in the source is 40 units long, it still measures 40 coordinate units in the OBJ, so use the intended unit when importing it into another application.

The download contains the mesh geometry. It comes without a material library or textures, because those are outside the standard STL surface model.

## Preview the result or convert back

Open the downloaded file in the [OBJ Viewer](../obj-viewer/) to inspect the result. Use the [STL Viewer](../stl-viewer/) for the source file, or the [OBJ to STL Converter](../obj-to-stl-converter/) to convert in the other direction.
