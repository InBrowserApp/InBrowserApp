## Convert a STEP or STP file to STL

Choose **Open file** or drop a `.step` or `.stp` file onto the converter. It turns the CAD surfaces into triangles on your device and prepares a binary STL download. Choose **Try an example** to convert a mounting bracket, then select **Download STL** to save the result.

## Keep the correct size for 3D printing

STEP carries physical dimensions. The converter exports the coordinates in millimeters, including the position of each component in an assembly. STL has no built-in unit setting. Choose millimeters when opening the result in a slicer. For example, an edge that measures one inch in STEP spans 25.4 coordinate units in the STL.

## Check the exported mesh

The STL contains the triangulated surfaces of the parts in their assembly positions. Use STEP for editable CAD surfaces, component names and assembly structure. Inspect the STL in the [STL Viewer](../stl-viewer/) or check its enclosed volume and topology with the [Mesh Volume & Topology Checker](../mesh-inspector/).

## Inspect or export the original model

Use the [STEP Viewer](../step-viewer/) to inspect dimensions, rotate the CAD model and export STL directly from the toolbar. If your slicer imports STEP, open the original and choose its own mesh settings. [PrusaSlicer supported formats](https://help.prusa3d.com/article/supported-file-formats_1772)
