## Open a GLB or glTF model online

Choose **Open files** or drop the model into the viewer. A `.glb` file packages a glTF scene in a binary container and often includes its textures and geometry in one file. A `.gltf` file describes the scene in JSON and may refer to companion files. When your export includes files such as `model.bin` and `albedo.png`, select them together with `model.gltf`. The viewer reads the files on your device.

## Inspect materials and play animations

Drag to rotate, scroll or pinch to zoom, and use **Fit to view** to see the whole scene again. Turn on **Wireframe** to inspect the triangles underneath the materials. If the file includes animation clips, select a clip and choose **Play animation**. **Try an example** opens an animated sample.

## Open a model with missing resources

When a file refers to an external buffer or image, choose the model and the matching files in the same selection. Keep the original filenames. If a model uses a texture compression extension the viewer cannot open, export it again with PNG or JPEG textures. See the [glTF 2.0 specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) for details about the two containers.

## View related 3D file formats

Use the [OBJ Viewer](../obj-viewer/) for Wavefront meshes with MTL materials, or the [STL Viewer](../stl-viewer/) to inspect a triangular mesh before 3D printing.

- [3MF Viewer](../3mf-viewer/)
