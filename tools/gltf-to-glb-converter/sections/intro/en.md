## Convert a glTF model to a single GLB

Choose **Open files** to select the `.gltf` model and its `.bin` buffers and textures together. Use **Open folder** when textures are in subfolders so the converter can follow the paths in the model. It also accepts glTF files with data already embedded. Choose **Try an example** to package an animated pyramid, then choose **Download GLB**. The files are processed in your browser.

## Add a missing buffer or texture

A `.gltf` JSON file can refer to assets such as `model.bin` or `textures/albedo.png`. The converter lists missing paths. Choose **Add files** to supply the missing assets while keeping the model open. Keep the original filenames. If there are files with the same name in different folders, select the folder that contains the model and the referenced files so their paths are available.

## Share and inspect the GLB

The GLB embeds geometry, supported textures and other standard data referenced by the model. Meshes, materials, and animation clips carry over. Packaging keeps the original texture encoding and mesh compression, so the destination needs to support those formats. PNG and JPEG textures work with the broadest range of glTF software. Open the downloaded file alone in the [GLB / glTF Viewer](../gltf-viewer/) to inspect its size, materials and animation. [glTF 2.0 file format](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
