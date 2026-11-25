## Check an STL or OBJ mesh online

Choose **Open file** or drop an `.stl` or `.obj` model onto the checker. It reads the mesh on your device and reports surface area, enclosed volume, and topology issues. Choose **Try an example** to check a closed mounting bracket before inspecting your own file.

## Read surface area and volume

STL and OBJ coordinates do not establish a common physical unit. Set **Coordinate unit** to the unit you used when exporting the model. The values are in square and cubic units respectively. Choosing a unit labels the coordinates as stored, without rescaling them. The example bracket has a volume of 16,016 mm³ when its coordinates represent millimeters.

Surface area sums the areas of the input triangles, so duplicate faces count again. The checker calculates volume from the direction of the faces when the mesh passes the topology checks. Self-intersecting surfaces and incorrectly oriented or overlapping shells can still affect that estimate. Compare important results against the original solid model.

## Understand topology results

- A **boundary edge** belongs to one triangle. Boundary edges trace open borders, including holes.
- A **non-manifold edge** belongs to more than two triangles. A **non-manifold vertex** touches such an edge or has disconnected groups of faces meeting at the same vertex.
- **Inconsistent winding** means two triangles traverse their shared edge in the same direction. Correctly oriented neighboring faces traverse it in opposite directions.
- **Degenerate faces** have zero area. **Duplicate faces** repeat the same triangle.

The checker counts exactly coincident positions as a single vertex. It counts shells by the edges their triangles share. When it finds a topology defect, it still shows surface area and issue counts. Those counts can help identify what to repair before using the volume.

## Inspect or convert the model

Use the [STL Viewer](../stl-viewer/) or [OBJ Viewer](../obj-viewer/) to examine the model in 3D, including its wireframe. Use the [OBJ to STL Converter](../obj-to-stl-converter/) when the next tool in your workflow expects an STL.

If an STL report shows topology issues, choose **Repair STL** to work with the same file. The [STL Mesh Repair](../stl-mesh-repair/) page also compares duplicate and zero-area faces, face directions and remaining topology issues before you download a new STL.
