## Inspect local images

Open a local image to inspect its detail and transparency without uploading it. Fit the image to the workspace, view it at actual size, or zoom and pan. Switch between a transparency grid, light and dark backgrounds. Focus mode gives the image more room.

## Formats and multiple images

The viewer reads JPEG, PNG, GIF, BMP, WebP, AVIF still images, TIFF, ICO, HEIC/HEIF still images and collections, JPEG XL, JP2 and JPEG 2000 codestreams (J2K). It detects the file content rather than trusting the filename. Availability depends on the encoding inside the file.

Browse TIFF pages, icon sizes, image collections and animation frames with the image controls. GIF, animated WebP and JPEG XL frames are composited into complete still previews; there is no automatic playback. Animated PNG shows only its default still image and is labeled accordingly. HEIF/AVIF timed sequences, JPEG 2000 compositions (JPX/JPF/JPM) and Motion JPEG 2000 (MJ2) are not supported. Auxiliary images and depth maps are not shown.

## Preview fidelity and privacy

Orientation is applied to the displayed image. Previews use 8-bit channels, so high bit depth and HDR are reduced. Embedded color profiles are retained where supported, but this viewer is not a substitute for a color-managed editor. Browser and decoder resource limits may prevent very large or complex images from opening; there is no fixed file-size or image-count cap.

Files stay on this device. Closing or replacing a file releases its decoder and preview. This viewer does not automatically save your images. Decoder licenses and corresponding source information are available from the image details.

## Save a PNG

Download the currently selected image, page, icon variant or composited animation frame as a still PNG. The saved image keeps the full pixel dimensions, applied orientation and supported transparency; zoom and preview backgrounds do not change it. PNG export uses the same 8-bit image as the preview, so it does not preserve high bit depth or HDR. Animated PNG exports only the default still image. No animation or container metadata preservation is promised.

## Save a JPG

Choose JPG as the download format to preview the actual compressed output. Set quality from 1 to 100 and choose white, black or a custom color to fill transparency. Higher quality usually makes a larger file; even quality 100 is lossy. The selected page or frame and its full pixel dimensions are retained when settings change. JPG uses 8-bit sRGB color and reduces high bit depth and HDR. Zoom and preview backgrounds do not change the saved JPG. Only the JPG background setting fills transparent pixels.
