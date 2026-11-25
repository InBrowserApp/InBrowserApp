## Convert a Wavefront OBJ file to STL

Choose **Open file** or drop an `.obj` file onto the converter. Choose **Try an example** to convert a small mounting bracket first. The tool turns polygon faces into triangles, then lets you choose **Download STL** to save a binary `.stl` file. Conversion runs on your device.

## What changes when you export STL

STL stores a triangular surface. Materials, texture images, UV coordinates, standalone lines and points do not become part of the STL. The original coordinates and axes stay in place. Before printing, choose the intended unit in your slicer. For example, an OBJ span of 40 coordinate units becomes an STL span of 40 coordinate units.

A file can convert successfully even when the mesh has holes or other geometry problems. Check the result in your slicer before printing.

## Preview the result or convert back

Use the [STL Viewer](../stl-viewer/) to open the download or the [OBJ Viewer](../obj-viewer/) to inspect the original, including any materials you supply. Use the [STL to OBJ Converter](../stl-to-obj-converter/) for the opposite direction.
