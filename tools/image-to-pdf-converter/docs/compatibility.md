# Image to PDF compatibility

The converter shares the browser-local raster decoder with Image Viewer and
its PNG/JPG exports. It checks file contents instead of trusting extensions.
See the [decoder fixture provenance](../../image-viewer/fixtures/README.md)
and [format notes](../../image-viewer/COMPATIBILITY.md) for encoding limits.

- Still JPEG, PNG, BMP, WebP, AVIF, HEIC/HEIF, JPEG XL, JP2 and J2K are accepted
  when the bundled decoder supports their encoding.
- TIFF pages, HEIC collection images, ICO variants and composited GIF/WebP/JXL
  animation frames become separate selectable rows. APNG exposes its poster.
- All entries start selected. A failed inspection remains as a named error row;
  a failed page does not hide other pages. Selected errors block generation.
- Queue order controls PDF order. Unselected entries are omitted explicitly.
  Reopening a source for export uses its original pixels, source orientation and
  the row's rotation. The maximum 192-pixel thumbnail size is only for browsing.
- PDF page size, auto/portrait/landscape orientation, contain/cover, margins and
  quality presets remain available. Images are encoded sequentially as 8-bit
  sRGB RGB JPEGs with a white background. No OCR, animation or HDR preservation
  is claimed.
- Only one decoder worker is retained at a time. Source inspection does not
  require the first page to render. Loading and export can be cancelled, clear
  also empties the queue, and obsolete object URLs are revoked. Failed export
  does not offer a partial PDF.
- There is no fixed input-size or page-count quota. Decoding, in-memory PDF
  assembly and the visible page queue still depend on device resources.

## Validation

Native decoder tests cover TIFF page discovery, bounded thumbnails with full
source dimensions, clockwise rotation, corrupt middle-page recovery, RGB JPEG
encoding, source orientation, profiles and supported raster families. Client
and PDF assembly tests exercise selection/order, failed rows, cancellation,
stale downloads, settings, sequential loading and cleanup. Browser validation
uses real files and independently examines the downloaded PDF pages and images.
