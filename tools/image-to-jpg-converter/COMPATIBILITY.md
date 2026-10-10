# Image to JPG compatibility

The converter and Image Viewer share `@workspace/raster-image`, including its
source detection, native decoder, page/frame selection, worker lifecycle and
license downloads. Existing decoder and fixture provenance are documented in
`../image-viewer/COMPATIBILITY.md` and `../image-viewer/fixtures/`. The original
PNG converter remains available with transparency-preserving output.

## Output contract

- Encode the selected full-resolution, oriented image as an 8-bit still JPEG.
  Preview and download use the exact same bytes and MIME type. No screenshot,
  canvas round trip or display-size resize is involved.
- Accept integer quality 1–100, default 90. JPEG is always lossy, including
  quality 100 and JPEG-to-JPEG conversion. Higher quality usually increases size.
- Convert supported embedded source color profiles to sRGB before compositing.
  Unprofiled sources use their decoded colorspace. Flatten transparency against
  the selected sRGB background: white, black or a custom six-digit hex color.
- Embed a standard sRGB profile generated locally with LittleCMS through Pillow
  `ImageCms.createProfile("sRGB")`. Encoding explicitly requests TrueColor so
  grayscale inputs also produce RGB JPEGs matching that profile. No profile
  download or external conversion service is used.
- The pinned decoder is Q8 without HDRI. High bit depth and HDR are reduced.
  Color-managed editor equivalence and container/auxiliary metadata retention
  are not promised.
- Multi-image exports use one selected TIFF page, icon size, HEIC collection image
  or composited GIF/WebP/JXL frame. Filenames include its one-based index. APNG
  exports only the default still image with a `-poster` filename suffix.
- Timed HEIF/AVIF, JPX/JPF/JPM compositions and MJ2 remain unsupported. SVG uses
  the existing dedicated vector conversion tools. There are no application
  file-size or image-count quotas; actual browser/decoder resources still apply.

## Settings and lifecycle

The Image Viewer starts with PNG and can switch to JPG. Its quality/background
controls match the standalone JPG converter. Settings changes retain the selected
page and zoom while immediately hiding the previous preview/download. Pending
results are accepted only for the current render request. Only a successfully
loaded current preview exposes a download. Close, cancel, replacement and unmount
release the worker and object URLs. Changing preview zoom or its surrounding
background never modifies the saved pixels. Downloads require a user action.

## Verification

Unit tests use the actual pinned WASM encoder for quality, alpha compositing,
ICC conversion, orientation, grayscale RGB output, native dimensions and invalid
settings. Client tests cover format changes, selected-page persistence, stale
responses, cancellation, replacement and errors; existing PNG tests cover the
shared-renderer regression surface. Browser checks reopen saved downloads with
Pillow, independently checking JPEG signature, RGB mode, ICC presence, dimensions,
orientation and representative pixels.
