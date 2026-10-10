# Image to PNG compatibility

The converter and Image Viewer use the same `@workspace/raster-image` worker
session and presentation components. The decoder, raster allowlist, container
validation, source/license downloads and fixture provenance remain those
documented in `../image-viewer/COMPATIBILITY.md` and `../image-viewer/fixtures/`.
No new codec, remote conversion service or application size/count quota is added.

## Output contract

- Download the actual PNG bytes used by the selected preview, without a canvas
  round trip, screenshot, display-size resize or background flattening.
- Apply source orientation. Preserve full decoded pixel dimensions and supported
  alpha. Embedded profiles survive where supported; preservation of container
  metadata, auxiliary images and depth maps is not promised.
- The published decoder is Q8 without HDRI. Set PNG output depth to 8 explicitly;
  high bit depth and HDR have already been reduced. Lossless PNG storage does
  not make conversion from these source formats lossless.
- Select one TIFF page, icon variant, collection image or composited animation
  frame. Include its one-based number in multi-image output filenames. APNG
  exports only the default still image, identified by a `-poster` suffix.
- Reject timed HEIF/AVIF, JPX/JPF/JPM compositions and MJ2 instead of calling an
  extracted first codestream a complete conversion. SVG retains its existing
  dedicated converter.

## Lifecycle

Only offer a download after the browser has loaded the selected PNG. Page
changes remove the previous link and revoke its object URL before new decoding;
errors keep it unavailable. Close, cancel and replacement terminate the worker.
A new File receives a fresh selection identity even when its name and modification
time match the previous file. Preview zoom and background controls reuse the same
PNG bytes and URL. Saving requires an explicit user download action.

## Output verification

Chromium, Firefox and WebKit saved 55 actual PNG downloads from the converter
and viewer clients. Pillow independently reopened each downloaded file and
checked PNG signature, channel precision, dimensions, still-image output and
representative colors/alpha. Checks included oriented JPEG, transparent PNG and
HEIC, multipage TIFF, ICO size selection, optimized GIF/WebP compositing, HEIC image
selection, AVIF, JXL, JP2/J2K, CMYK JPEG, an embedded ICC profile, a 16-bit TIFF and
a PQ JXL gradient. The final page of a 1001-page TIFF and a 56,760,054-byte BMP
also downloaded successfully. Unsupported containers and malformed files did
not expose a download. Client tests additionally exercise stale results,
identical-name/time replacement, pending cancellation and image-load failure.

The client checks observed no external HTTP requests or page errors, and all
owned object URLs and workers were released on close. The external fixture
hashes were checked against the existing viewer fixture manifest before use.
