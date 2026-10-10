## Convert an image to JPG

Open a local image, choose JPG quality and a background color, inspect the actual compressed preview and download the selected image. The output keeps its full pixel dimensions and applied orientation. Zoom and preview backgrounds do not resize or recolor the saved image.

## Formats and image selection

Read JPEG, PNG, GIF, BMP, WebP, AVIF still images, TIFF, ICO, HEIC/HEIF still images and collections, JPEG XL, JP2 and JPEG 2000 codestreams (J2K). The file content is checked rather than trusting its extension. Support depends on the encoding inside the file. Use the separate SVG converters for vector SVG images.

For files containing several images, select the TIFF page, icon size, collection image or animation frame before downloading. Each download is one still JPG, with its page or frame number included in the filename. GIF, animated WebP and JPEG XL frames are composited into complete images. Animated PNG exports only its default still image, labeled as a poster; other frames and animation export are unavailable.

## Quality, transparency and color

JPG compression is lossy, including when converting an existing JPEG. Choose a quality from 1 to 100; higher quality usually produces a larger file, and 100 is still not lossless. The preview displays the bytes that will be downloaded. Changing quality or the JPG background prepares a new preview for the selected image.

JPG does not support transparency. Transparent pixels are filled with white, black or your custom JPG background color. The output uses 8-bit sRGB color; embedded source profiles are used for conversion where supported. High bit depth and HDR are reduced, and colors may differ from a color-managed editor. Auxiliary images, depth maps and container metadata are not preserved.

## Local processing and limits

Files stay on this device. Cancel, close or replace a file to release its decoder and current download. A file is saved only when you choose Download JPG. The Image Viewer also offers JPG export with the same quality and background settings.

HEIF/AVIF timed sequences, JPEG 2000 compositions (JPX/JPF/JPM) and Motion JPEG 2000 (MJ2) are unsupported. Damaged or unsupported images show an error instead of a successful download. Very large or complex images may exceed browser or decoder resources; there is no fixed file-size or image-count cap.
