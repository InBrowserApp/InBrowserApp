# Image Viewer: notices, source and relinking

Image Viewer uses the unmodified x86 WebAssembly decoder distributed in
`@imagemagick/magick-wasm` 0.0.44. Its JavaScript wrapper and Magick.Native
bindings use Apache-2.0; ImageMagick and its linked libraries retain their
individual licenses. In particular, libde265, GLib, libheif, liblqr and LibRaw
include LGPL-covered code. See `NOTICE.txt`, the separate license files and the
licenses inside each source archive for the complete terms and attribution.

The files in this directory accompany the decoder. They are downloaded only
when requested, never when opening an image. No login or access token is
required. `sources.json` records the source URLs, exact archive sizes and
SHA-256 digests; `SHA256SUMS` can be checked with `sha256sum -c SHA256SUMS`.

## Included material

- The complete wrapper source at
  `8d346777ce0e172dacdb797a65346569425c43af` (version 0.0.44).
- Magick.Native bindings and build/generation scripts at
  `999720f7ebe03d5a0029536f1586a2cb82b500ae` (release 2026.927.1314).
- ImageMagick source at `ad98b244c995d2e3051757fa3b7855f45b550d24`.
- Complete pinned libde265, GLib, libheif, liblqr and LibRaw sources, including
  upstream configuration and license files. These are source archives, not
  submodule pointers.
- The dependency build recipes from ImageMagick/Dependencies release
  `2026.09.26.1516`, with the full revision map in `dependency-revisions.json`.
- That release's `wasm-x86-static.zip`: individual static libraries, headers,
  package configuration and notices. It includes the non-LGPL link inputs
  needed alongside rebuilt LGPL libraries; it is not a prelinked decoder.

These source archives are unchanged upstream distributions. The application
does not modify the decoder binary. Its worker supplies an in-memory security
policy at initialization; application source is available in the public
InBrowserApp/InBrowserApp repository under `tools/image-viewer`.

Recipients may modify the LGPL-covered components and reverse engineer the
combined work to debug those modifications under the applicable licenses.
No additional restriction or signing key is imposed by this application.

## Rebuild the native decoder

The authoritative build is the `wasm` job in the included Magick.Native
`.github/workflows/main.yml`. It uses `emscripten/emsdk:6.0.6`, architecture
`x86`, quantum depth `Q8`, and no HDRI. The commands below use the included
archives in place of the workflow's network checkout/download steps.

Use a fresh, disposable Linux build directory. Keep this download directory
alongside a new `work` directory, and start the SDK container:

```sh
mkdir work
docker run --rm -it \
  -v "$PWD:/sources:ro" -v "$PWD/work:/work" -w /work \
  emscripten/emsdk:6.0.6 bash
```

Inside that container, extract the complete source and existing dependency
link inputs:

```sh
mkdir native
tar -xzf /sources/Magick.Native-999720f7ebe03d5a0029536f1586a2cb82b500ae.tar.gz \
  -C native --strip-components=1
mkdir native/src/ImageMagick/ImageMagick
tar -xzf /sources/ImageMagick-ad98b244c995d2e3051757fa3b7855f45b550d24.tar.gz \
  -C native/src/ImageMagick/ImageMagick --strip-components=1
mkdir -p /tmp/dependencies
unzip /sources/wasm-x86-static.zip -d /tmp/dependencies
cd /work/native/build/wasm-x86
bash install.build-tools.sh
```

For an unchanged decoder, proceed to the build commands below. To substitute
modified LGPL components, first follow the next section and overwrite their
individual libraries in `/tmp/dependencies/lib`.

```sh
cd /work/native/src/ImageMagick/ImageMagick
bash ../../../build/shared/build.imagemagick.sh wasm x86 Q8
cd /work/native/src/Magick.Native
bash ../../build/shared/build.native.sh wasm x86 Q8
mkdir -p /work/native/publish/wasm/files/x86
sed 's#magick.wasm",import.meta.url#data:text/plain;base64,"#' \
  Q8/magick.js > /work/native/publish/wasm/files/x86/magick.js
cp Q8/magick.wasm /work/native/publish/wasm/files/x86/magick.wasm
cp /sources/NOTICE.txt /work/native/publish/wasm/files/x86/NOTICE
```

The last three commands reproduce the glue adjustment in upstream
`build/wasm-x86/copy.native.sh` without its Git-history-dependent notice
generation. Keep the notices accompanying any modified components, and mark
your modifications. Always use the rebuilt JavaScript glue and WebAssembly
as a matching pair; replacing only the binary is not generally sufficient.

## Rebuild a modified LGPL component

Extract the Dependencies recipe archive into `/work/dependency-build` and each
selected library's complete archive into its `Dependencies/<name>` directory
with `tar --strip-components=1`. The directory names are `de265`, `heif`,
`raw`, `glib` and `lqr`. Modify those sources as needed.

Run `.github/build/wasm-x86/install.sh` in that recipe checkout to install its
specified CMake, Meson and Ninja versions. Its
`.github/build/wasm-x86/build.sh` defines the compiler flags, installation
prefix and library options; `.github/build/shared/<name>.sh` contains each
library's configure/build/install commands.

For a selective rebuild, copy `build.sh` to another file in the same
`wasm-x86` directory and replace only its `DEPENDENCIES=(...)` list with the
selected libraries, retaining the order `de265`, `heif`, `raw`, `glib`, `lqr`.
The other link inputs remain available from `wasm-x86-static.zip`. Run the
copied script from `/work/dependency-build`, not from its script directory.
When rebuilding lqr over the supplied installation, use `mkdir -p` for the
two include-directory creation commands in `shared/lqr.sh`; those
directories already exist. Start with fresh extracted source directories
for a repeated build because the upstream recipes create `__build` folders.

After this installation, rerun the ImageMagick and Native build commands.
Magick.Native's `src/Magick.Native/CMakeLists.txt` records the complete link
order and uses the replaceable individual libraries in `/tmp/dependencies`.
The dependency archive includes their original notices; your modified
distribution should also retain its updated source and notices.

## Rebuild the JavaScript wrapper and application

The complete wrapper and Native binding generator are included. In the
Native checkout, install the development dependencies in
`src/wasm-file-creator`, then run `npm run build` and
`npm run create-wasm-files`. This generates TypeScript declarations and XML
configuration constants under `publish/wasm/files`. The generator does not
require a GitHub Packages account. Use `publish/wasm/publish.sh --version
2026.927.1314` to pack a local native package; this command creates a tarball
and does not publish it.

Extract the wrapper source to its own directory. Before installing it,
replace its `@dlemstra/magick-native` development dependency with a `file:`
reference to your local native tarball. This avoids downloading the private
registry development dependency.

This application uses x86 only. For an x86-only wrapper rebuild, remove the
x64 import in `src/image-magick.ts`, make the unused
`initializeImageMagickx64` entry point explicitly throw an unsupported-build
error, and remove the x64 copy operations in `npm-postinstall.mjs`, taking
`NOTICE` from x86 instead. Do not point x64 at an x86 binary. Alternatively,
rebuild both architectures with the upstream workflow and its corresponding
x64 dependency inputs. The supplied x86 link archive is not suitable for
the x64 build.

Install the wrapper's listed development tools, run its prepare/build steps,
and pack it locally. To use it in a local InBrowser.App checkout, point the
`@imagemagick/magick-wasm` catalog entry in `pnpm-workspace.yaml` to that local
package, reinstall and run `pnpm build`. The worker's existing asset import
then packages the replacement decoder. Serve `apps/web/dist` over HTTP and
check representative images before using your modified build.

These instructions were checked against the pinned source trees, export maps,
dependency archive and upstream build recipes. They do not claim a locally
completed, byte-for-byte reproduction of the published decoder. Build tools
and timestamps can affect output; the source and separate link inputs are
provided so recipients can produce their own modified build.
