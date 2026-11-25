## Convert an STL file to 3MF

Choose the **STL coordinate unit**, then choose **Open file** or drop an `.stl` file onto the converter. Both ASCII and binary STL work. Choose **Try an example** to convert a mounting bracket and **Download 3MF** to save the model. Changing the unit converts the current file again.

## Choose the correct size for a slicer

STL stores coordinates without identifying a unit. Choose the scale used by the source. For example, a part that spans 2 STL coordinate units is 2 inches wide if you choose inches, or 2 millimeters wide if you choose millimeters. The 3MF records that scale explicitly, so a compatible slicer can read the model at its intended size.

## Check the 3MF model or convert back

The 3MF contains the original triangles. The converter records a solid when the mesh forms a consistently oriented enclosed volume. Open or inconsistent meshes are recorded as surfaces. Your slicer handles materials and print settings. Open it in the [3MF Viewer](../3mf-viewer/) to check the dimensions, or inspect the original in the [STL Viewer](../stl-viewer/). Use the [Mesh Volume & Topology Checker](../mesh-inspector/) if the source mesh has gaps or other topology problems. For the reverse direction, use the [3MF to STL Converter](../3mf-to-stl-converter/). [About the 3MF format](https://3mf.io/resources/faq/)
