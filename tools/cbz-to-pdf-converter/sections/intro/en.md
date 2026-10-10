## Convert a comic to PDF

Open a local CBZ archive. Each image becomes one PDF page, then you can inspect the result and choose Download PDF. The preview shows the source image filename for the current page. Closing or replacing the comic cancels conversion and clears the previous download. The CBZ Reader also offers PDF export while you read.

## Page order and appearance

Pages follow natural order by their full folder and file paths: page2 precedes page10. Hidden files, \_\_MACOSX folders, and unrelated metadata are ignored. ComicInfo metadata and reading direction do not change the exported sequence.

Each PDF page follows its image's proportions and orientation, with no cropping. Images are decoded at their original pixel dimensions; transparent areas become white. Animated images use their default static frame. PDF page sizes are fitted to a common long edge, so the result does not preserve physical print sizes from image metadata. Browser color handling may affect appearance. This is an image PDF without OCR or selectable text.

## Compatibility and incomplete archives

JPEG, PNG, GIF, WebP, BMP, and browser-supported AVIF images are accepted. CBR and RAR archives, encrypted entries, SVG, and other unsupported image formats cannot be converted. If any recognized image page cannot be read, the tool identifies its position and filename and offers no incomplete PDF for download. The CBZ Reader can help inspect the remaining pages of a damaged comic.

## Keep your comic local

All processing happens in this browser. The comic is not uploaded, scripts are not executed, and remote document resources are not fetched. There is no fixed file-size or page-count quota. Very large images or archives can still exceed browser memory or decoding resources; close other tabs or try a device with more memory if needed.
