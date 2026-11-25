## Convert a DXF drawing to SVG

Choose **Open DXF file** or drop an ASCII `.dxf` drawing. Use **Try an example** to load a bracket with a profile, drill holes, centerlines and labels. The tool reads the drawing in your browser and shows a vector preview. Choose **Download SVG** to save the selected model-space geometry as a standalone SVG file.

## Choose the layers to export

Select the layers you want in **Layers**. The preview updates when you include or exclude a layer. For example, export the outline and holes for an illustration, or include the centerlines and labels for an annotated view. The SVG keeps selected layers as separate vector groups.

## Keep the drawing scale

When the DXF declares a length unit such as millimeters or inches, the SVG records physical dimensions in millimeters. The drawing geometry keeps its original scale inside the file. Unitless DXF drawings use drawing coordinates in the SVG viewBox. The preview fits the available space on screen. [DXF header variables](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Export model-space geometry

The converter exports supported lines, polylines, arcs, circles, blocks and text. Curves are drawn with vector segments, and supported text becomes vector outlines using available fonts. For layouts, move the geometry into model space before exporting the DXF. For inspection, pan, zoom and toggle layers in the [DXF Viewer](../dxf-viewer/).
