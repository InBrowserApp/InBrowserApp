# Conversion runtime

This tool uses the unmodified browser WebAssembly binaries from
[`@matbee/libreoffice-converter` 2.7.2](https://www.npmjs.com/package/@matbee/libreoffice-converter/v/2.7.2),
published under the Mozilla Public License 2.0. A copy is included in
`MPL-2.0.txt`. The dependency lockfile records the package integrity hash.
Our package export patch exposes its bundled assets and does not modify the
engine binaries.

The corresponding package source is available at commit
[`b72a3d584bc28c5111afafcf25def7a24fb5fcb0`](https://github.com/matbeedotcom/libreoffice-document-converter/tree/b72a3d584bc28c5111afafcf25def7a24fb5fcb0).
Its [`build/build-wasm.sh`](https://github.com/matbeedotcom/libreoffice-document-converter/blob/b72a3d584bc28c5111afafcf25def7a24fb5fcb0/build/build-wasm.sh),
[`build/autogen.input`](https://github.com/matbeedotcom/libreoffice-document-converter/blob/b72a3d584bc28c5111afafcf25def7a24fb5fcb0/build/autogen.input),
and patches document the upstream LibreOffice build. LibreOffice and bundled
components retain their respective copyright and license notices. See also
[LibreOffice licenses](https://www.libreoffice.org/about-us/licenses/).

The adapter uses the native conversion API in library mode (`noInitialRun`),
with macro execution disabled. It downloads and inflates self-hosted assets,
then runs the engine in a disposable classic worker; its native pthreads use
the same network guard. The npm package's browser wrapper and command-line
entry point are not used.

The two compressed engine streams are split into files no larger than 20 MiB
because the deployment host limits [individual static assets to 25 MiB](https://developers.cloudflare.com/workers/platform/limits/).
The decoder joins each stream before inflation. This is an asset packaging
constraint, not a limit on user documents.

Additional font sources and SIL Open Font License notices are in `../fonts/`.
