## Convert an image to PNG

Open a local image, inspect the preview and download the selected image as a PNG. The saved image keeps its full pixel dimensions, applied orientation and supported transparency. Zoom, fit and background controls affect only the preview; they do not resize the output or flatten transparency.

## Formats and image selection

Read JPEG, PNG, GIF, BMP, WebP, AVIF still images, TIFF, ICO, HEIC/HEIF still images and collections, JPEG XL, JP2 and JPEG 2000 codestreams (J2K). The file content is checked rather than trusting its extension. Support depends on the encoding inside the file. Use the separate SVG to PNG tool for vector SVG images.

For files containing several images, select the TIFF page, icon size, collection image or animation frame before downloading. Each download is one still PNG, with its page or frame number included in the filename. GIF, animated WebP and JPEG XL frames are composited into complete images. Animated PNG exports only its default still image, labeled as a poster; it cannot export other frames or preserve animation.

## Fidelity and unsupported files

The output uses 8-bit channels. High bit depth and HDR are reduced, so converting to PNG does not recover the source precision. Embedded color profiles are retained where supported, but colors may differ from a color-managed editor. Auxiliary images, depth maps and container metadata are not preserved as part of the conversion.

HEIF/AVIF timed sequences, JPEG 2000 compositions (JPX/JPF/JPM) and Motion JPEG 2000 (MJ2) are unsupported. Damaged or unsupported images show an error instead of a successful download. Very large or complex images may exceed browser or decoder resources; there is no fixed file-size or image-count cap.

## Local processing and downloads

Files stay on this device. Cancel, close or replace a file to release its decoder and current download. Changing the selected image removes the previous download while the next image is prepared. A file is saved only when you choose Download PNG. The Image Viewer also offers the same selected-image PNG download.
