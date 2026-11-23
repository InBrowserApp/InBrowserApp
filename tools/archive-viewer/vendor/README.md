# libarchive WebAssembly reader

The Archive Viewer uses libarchive 3.8.11 in a dedicated Web Worker for formats
beyond the existing ZIP, TAR, and GZIP handlers. The C bridge lives in
[reader.c](reader.c). It uses libarchive's seekable read callbacks to read
slices of the original browser File, and returns metadata or byte chunks for a
single requested entry. The browser exposes the extracted file as a Blob.

The build links liblzma 5.8.3, Zstandard 1.5.7, LZ4 1.10.0, bzip2 1.0.8, and
zlib 1.3.2. The [third-party notices](../../../apps/web/public/licenses/archive-viewer.txt)
cover these libraries, libarchive, and the Emscripten runtime and are served at
`/licenses/archive-viewer.txt`.

Run `./rebuild.sh` on Linux with Emscripten 4.0.23 activated, plus GNU make, Bash,
curl, tar, sha256sum, and the repository dependencies installed with pnpm. It downloads and verifies the pinned sources, builds
the decoder, then replaces `libarchive.mjs` and `libarchive.wasm`.
Run the Archive Viewer tests after rebuilding to verify the shipped WASM against
the fixture archives.
