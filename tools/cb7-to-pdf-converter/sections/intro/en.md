## How to convert CB7 to PDF

Choose a `.cb7` comic or drop it onto the converter. A `.7z` archive containing comic page images works too. Each image becomes one PDF page. Check the preview, then choose **Download PDF**. For example, `volume-01.cb7` becomes `volume-01.pdf`.

## Page order, image quality, and searchable lettering

CB7 stores comic pages in a 7z archive. The converter sorts full folder and file paths in natural order, so `chapter2/page2.jpg` comes before `chapter2/page10.jpg`. It keeps the original pixel dimensions and proportions of portrait pages and wide spreads. Supported images include JPEG, PNG, GIF, WebP, BMP, and AVIF where your browser can decode it.

The lettering stays part of the artwork. To search the dialogue, open the finished PDF in [PDF OCR](../pdf-ocr/) and select the language used in the comic.

## Working with a large or protected archive

Conversion runs on your device and shows the current page as it processes the comic. In a large solid 7z archive, several images share compressed data, so reading pages can take longer. Use **Cancel conversion** to stop and choose another file. For a password-protected or split archive, unpack it first and use a single readable archive. Use the [CB7 Comic Reader](../cb7-reader/) to browse the original, or [CBZ to PDF](../cbz-to-pdf-converter/) for ZIP-based comics.
