## Read a comic in your browser

Open a local `.cbz` comic archive or drop it into the reader. Start at the first readable image, turn pages, jump to a page number, or browse the collapsible thumbnail strip. Focus reading gives the artwork more room. Fit page shows the whole image, including wide spreads; fit width and zoom help you inspect lettering and high-resolution artwork.

## Page order and reading direction

Pages are sorted naturally by their complete folder and file paths: `chapter2/page2.jpg` comes before `chapter2/page10.jpg`, then `chapter10/page1.jpg`. Sorting uses a fixed English numeric comparison, with exact path and archive position breaking ties. Hidden files, `__MACOSX` folders, and unrelated metadata are ignored. ComicInfo and other metadata never override this order. Unreadable images retain their page numbers, so missing artwork cannot silently shorten the book.

Choose left-to-right or right-to-left reading independently of the site language. Focus the reading area to use the Left and Right arrows in that direction. Page Down and Page Up always move forward and back; Home and End jump to the first and last page. The Previous and Next buttons always mean the previous and next numbered page.

## Supported images and compatibility

JPEG, PNG, GIF, WebP, and BMP pages are supported; AVIF depends on the browser's decoder. Animated formats use the browser's normal image display. TIFF, HEIC, JPEG XL, PSD, and other unsupported image entries remain visible as unreadable pages. SVG images are deliberately not rendered. Files with no recognized image extension are ignored. CBR, RAR, and other archive families are not supported.

Password-protected entries cannot be opened. A damaged image does not stop you reading other pages when the ZIP directory is readable. Broken ZIP directories may prevent the whole comic from opening. The reader checks image decoding as pages and thumbnails are opened, so further problems may appear while you read.

## Privacy and browser resources

The archive is read locally. Comic contents are not uploaded, scripts are not executed, and remote document resources are not fetched. Closing or replacing the comic releases its image URLs. No comic or reading position is saved automatically.

There are no imposed file-size or page-count limits. Image data is extracted on demand, and the thumbnail strip shows a moving group of pages so long comics remain navigable. Very large archives or images can still exhaust browser memory or decoding resources. Close other tabs or use a device with more memory if a resource error occurs.
