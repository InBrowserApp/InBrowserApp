# Legacy presentation parser

`parser.wasm` is built from the MIT-licensed [extend-hq/react-pptx](https://github.com/extend-hq/react-pptx) source at commit `222edd030e71d1772eaae11daac86dc80fb2720b`, matching `@extend-ai/react-pptx` 0.2.2 and its wasm-bindgen JavaScript bindings. Run `sh rebuild.sh` to reproduce it. It is loaded only after file selection and runs in the package's terminable module worker.

`parser.patch` removes document-size, OLE-entry, slide-count, and edit-history quotas. Uncompressed OLE stream declarations are bounded by the actual source length; checked arithmetic, compound-storage validation, edit-chain cycle detection, and the drawing recursion guard remain. Metafile decompression retains a 64 MiB decoded-image allocation budget, independent of source document size. Browser/WASM allocation failures are resource errors.

The app accepts only OLE binary presentation containers. Modern PPTX and unrelated renamed files are rejected. Recovered assets are restricted to embedded raster/metafile bytes; document URLs, SVG, and embedded fonts are discarded before rendering. Text never becomes HTML. The canvas renderer receives no font sources or media playback controls. Rendering is always described as partial.

`LICENSE` is the upstream MIT license, also distributed at `/licenses/ppt-viewer.txt`. The upstream package’s `THIRD_PARTY_NOTICES.md` is preserved alongside it; the renderer boundary below describes the chart components excluded from this build.

## Renderer package boundary

The root pnpm patch for `@extend-ai/react-pptx@0.2.2` is **legacy-only**. The pinned Rust `legacy.rs` emits `Shape` and `Image` nodes only; legacy tables are drawing/text groups and charts can be saved EMF/WMF pictures. The patch disconnects the unused DrawingML chart host and removes its D3, WebGL, React server-renderer, and geographic atlas imports. This avoids compiling an unrelated modern-chart engine and keeps the existing 6 GiB CI build heap. The unchanged metafile renderer still supplies saved image/chart previews. Unexpected DrawingML chart nodes fail explicitly.

Do not reuse this patched package in a modern-format viewer. Restore or isolate the chart path before doing so. The patch also preserves parse-error categories and removes the metafile record-count quota while retaining canvas allocation guards.

Canvas snapshots decode their intermediate SVG at the natural slide dimensions, then scale in `drawImage`. This avoids WebKit clipping HTML inside `foreignObject` when the SVG viewport scales a `viewBox`; the final canvas still uses the requested bounded dimensions. This path is checked with real desktop and mobile screenshots in Chromium, Firefox, and WebKit.

After inlining assets, snapshots represent raster pictures with SVG `image` elements in the same styled boxes. WebKit otherwise omits HTML `img` contents on repeated `foreignObject` snapshots, including focus-mode resizing; awaiting image decoding does not prevent it. The SVG representation preserves contain, stretch, and crop behavior without timers or changing the source document. Public renderer regressions cover those sizing modes; browser pixel checks cover cold renders, focus, fit, and resizing for the owned PNG and a saved EMF chart.

The parser copies transfer bytes before creating its worker, so an allocation failure cannot leave a worker behind. A regression exercises this through the public parser API.
