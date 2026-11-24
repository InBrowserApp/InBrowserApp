# Browser PDF/A engine

The worker loads the checked-in WebAssembly binary on demand. The native adapter
calls FynePDF, which edits PDF objects in place and reports whether its repairs
met the requested PDF/A profile. The build disables page rasterization.
PDF/A-1b inputs that require flattening transparency return a separate error.
The UI reopens successful outputs with PDF.js to verify their profile and
compare their text and page geometry.

Activate Emscripten 4.0.10 and run `./build.sh` here with CMake, Ninja and Git
available. The script fetches pinned FynePDF, QPDF, OpenJPEG and Little CMS
sources and uses Emscripten's JPEG and zlib ports. It writes the engine loader
and gzip-compressed WebAssembly binary to `generated/`. The regular site
build serves these assets directly.

Third-party licenses and bundled font sources are listed in
`apps/web/public/licenses/pdf-to-pdfa-converter.txt`.
