## Convert a 3MF file to STL

Choose **Open file** or drop a `.3mf` file onto the tool. It reads the model locally and produces a binary STL. Choose **Try an example** to use a build with two colored brackets, then choose **Download STL** to save the result.

## Keep the sizes and build placement

The converter outputs mesh coordinates in millimeters. Parts placed on the build plate stay in their original relative positions, including repeated parts. If a part spans one inch in the 3MF, it spans 25.4 coordinate units in the STL. Select millimeters when importing the STL into software that asks for a unit.

## Check what the STL contains

STL contains the surface triangles. For colors, materials or slicer settings, keep the original 3MF. Open the result in the [STL Viewer](../stl-viewer/) or inspect the source in the [3MF Viewer](../3mf-viewer/). Use the [STL to 3MF Converter](../stl-to-3mf-converter/) if your next workflow needs a 3MF model package. [About the 3MF format](https://3mf.io/resources/faq/)
