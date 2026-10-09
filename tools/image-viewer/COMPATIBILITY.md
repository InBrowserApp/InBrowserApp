# Image viewer compatibility

The browser only reads local file bytes in an owned worker. The decoder is the unmodified x86 `@imagemagick/magick-wasm` 0.0.44 build: ImageMagick 7.1.2-32 Q8, with JPEG, PNG, TIFF, WebP, libheif, libjxl and OpenJPEG delegates. Its preview channels are 8-bit, with no HDRI. The x86 WASM asset is 15,447,097 bytes; the separate source/license downloads are described at `/image-viewer-licenses/`.

## Checked outcomes

| Family               | Observed outcome                                                                                                                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JPEG, PNG, BMP, WebP | Full pixel dimensions, transparency where present; EXIF orientation applied.                                                                                                                                                 |
| TIFF                 | Individual pages with per-page dimensions; three real LZW pages and a 1001-page TIFF checked. Classic TIFF and BigTIFF directories are independently validated against the decoder's page count.                             |
| ICO                  | Five actual size variants navigable, including PNG-backed entries. The decoder's image count must match the icon directory.                                                                                                  |
| HEIC/HEIF            | Two distinct images from a genuine HEIC collection; alpha sample also opens. Timed tracks are rejected; auxiliary images/depth maps are outside the visible collection. Encoding support varies within the container family. |
| AVIF                 | Still image with expected color and dimensions. Timed sequences are rejected.                                                                                                                                                |
| JPEG XL              | Still image, four distinct composited animation frames, and a high-bit-depth PQ gradient. High-bit-depth/HDR output is explicitly reduced to an 8-bit preview.                                                               |
| JP2 and J2K          | Genuine JP2 wrapper and raw JPEG 2000 codestream both render the chart at expected dimensions and colors.                                                                                                                    |
| JPX/JPF, JPM, MJ2    | Explicit unsupported-container outcome for genuine Kakadu JPX, Luratech JPM and OpenJPEG Motion JPEG 2000 samples. Their first codestream is not advertised as a complete composition.                                       |
| GIF, animated WebP   | Optimized offset/delta frames are coalesced into complete still frames; individual navigation, no automatic playback.                                                                                                        |
| APNG                 | Default still image only, with a prominent explicit notice. Its animation is not treated as a supported frame sequence.                                                                                                      |

There is no application file-size, pixel-count or item-count quota. A real 56,760,054-byte BMP opens at 4400 × 4300; the final page of a 1001-page TIFF remains reachable. Native decoder, WebAssembly and browser limits still apply, and allocation failures receive recoverable resource feedback.

## Rendering and lifecycle

- File signatures, container box structure and image directories are checked before native decoding. Filename suffixes are not the source of truth.
- The ImageMagick policy denies every coder except the raster allowlist and PNG output, every delegate/filter, and every filesystem path except the decoder's own `/tmp/magick-*` files in its in-memory filesystem. No document resources are fetched.
- Metadata is pinged first. Static pages/variants use selective decoding; animated frames read their required prefix and coalesce it before display. Some upstream codecs internally read one additional image despite `frameCount`; it is not exposed as a duplicate item.
- Selected-page errors clear the previous preview and remain visible while navigation is available. Open failures terminate the worker. Closing, replacing or cancelling always terminates the file's worker, releasing its native heap; each PNG object URL is revoked on replacement/unmount.
- Embedded color profiles are retained where supported. This is not a color-managed editing or HDR inspection tool. Animation delay is reported for the selected frame, but playback is unavailable.

## Verification

The source build was exercised in actual Chromium, Firefox and WebKit with canvas pixel assertions, keyboard interaction, mobile RTL layout and screenshots. Tests covered orientation, alpha, image/page/frame distinctions, coalescing, large input, more than 1000 items, malformed/unsupported/empty files, cancellation, replacement and recovery. Every tested viewer-owned object URL and worker was released after close; no remote requests or page errors occurred. Fixture provenance and exact external-file hashes are in `fixtures/README.md` and `fixtures/verification-files.json`.

The supplied source/relink recipe was reviewed against pinned upstream artifacts; an end-to-end native rebuild was not performed. Preview behavior is verified against the actual published binary.
