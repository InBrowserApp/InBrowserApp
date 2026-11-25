## Repair an STL file online

Choose **Open file** or drop an ASCII or binary `.stl` file onto the tool. Repair runs on your device. Choose **Try an example** to see a small mesh with duplicate, zero-area and reversed faces. Compare the results and choose **Download STL** to save a new binary file at the original size and coordinates.

## What the mesh repair changes

The tool removes exact duplicate triangles and triangles with zero area. It compares the directions of neighboring faces and reorients faces when a consistent winding can be reached by flipping fewer faces in one direction than the other. The same mesh points stay in place. Open borders, ambiguous face directions, and non-manifold joins may need manual repair. This tool leaves holes, near-coincident points, and intersections as they are. [Common mesh problems in 3D printing](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Compare the topology before and after

Check the triangle, duplicate face and degenerate face counts. The report also shows inconsistent edges, open borders, and non-manifold edges and vertices that remain. Open the download in the [STL Viewer](../stl-viewer/) to inspect it in 3D. For surface area or enclosed volume, use the [Mesh Volume & Topology Checker](../mesh-inspector/). You can also choose **Repair STL** directly from an STL inspection report with topology issues.
