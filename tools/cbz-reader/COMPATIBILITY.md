# CBZ reader compatibility

The initial scope is single-page reading of local ZIP-based `.cbz` files. Pages follow fixed-English natural full-path order, then exact path and archive position for ties. Comic metadata never changes page order. Hidden paths and non-image entries are excluded; recognized unsupported images remain numbered page slots.

## Representative fixtures

All artwork under `fixtures/` is original generated artwork. `fixtures/generate.py` documents how to reproduce the unencrypted archives.

| Fixture               | Coverage                                                                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `representative.cbz`  | Nested folders; page2 before page10; corrupt first page; first readable image at page 2 of 11; portrait PNG; wide JPEG; GIF, WebP, BMP, AVIF; 4200×6000 PNG; TIFF/SVG failure slots; transparent RGBA PNG; metadata and hidden files. |
| `avif-compatible.cbz` | AVIF with `mif1` main brand and `avif` compatible brand beyond the first 16 bytes.                                                                                                                                                    |
| `long.cbz`            | 1,201 pages; natural ordering; direct last-page navigation; paginated thumbnails.                                                                                                                                                     |
| `protected.cbz`       | AES-encrypted image entry, reported without asking for a password. Generated with zip.js and a fixture-only password.                                                                                                                 |
| `empty.cbz`           | Metadata without image pages.                                                                                                                                                                                                         |
| `corrupt.cbz`         | Truncated ZIP directory.                                                                                                                                                                                                              |
| `unsupported.cbz`     | TIFF and SVG entries retained as unreadable page slots.                                                                                                                                                                               |
| `disguised-svg.cbz`   | SVG with a script and external image reference under a `.png` filename; rejected by byte-signature validation.                                                                                                                        |

The unit suite also creates real encrypted and CRC-damaged archives at runtime, and tests canceled extraction, stale file replacement, URL cleanup, first-readable-page discovery, preserved failure positions, exact page and zoom inputs, direction-aware keys, thumbnail navigation, and allocation failure messages.

## Browser acceptance

Production-build checks on 2026-10-09 passed in Chromium 154.0.8037.92, Firefox 153.0, and WebKit 26.5. Each engine decoded the representative raster images, the compatible-brand AVIF, the wide spread, and the 4200×6000 page; retained the damaged/unsupported/protected slots; and navigated directly to page 1,201.

Interaction checks covered previous/next and direction-aware keys, exact page and zoom input, invalid-input rollback, fit page/width, thumbnail pagination and active-page following, replacement/close, focus mode and Escape, visible keyboard focus, and a 320-pixel viewport without document overflow. Loaded screenshots were inspected at 1365×960, 320×740, and 844×390 with focus mode and thumbnails. An independent integration check also opened the actual Arabic route at 320 pixels in dark mode in all three browsers, verified active-thumbnail following after manually browsing a different thumbnail group, and confirmed that closing the comic released all document image URLs. The tool was reviewed against the current Web Interface Guidelines; decorative controls are hidden from the accessibility tree while buttons retain localized names.

No unexpected page errors or external HTTP requests occurred during these local production checks. These are fixture-based observations, not a claim that every CBZ or image encoding is supported. Browser memory exhaustion is exercised by unit-level allocation errors rather than deliberately crashing the browser process.

## Resource and safety boundaries

The central directory is indexed, then image bodies are extracted on demand with checksum verification. Only the active page and a moving thumbnail group are decoded. The first readable page is retained until closing or replacing the file; other image URLs are revoked when their view unmounts. There are no file-size or page-count rejection thresholds. Browser allocation failures have a dedicated message; image decoding failures explicitly mention damaged encodings and browser decoding resources because browser image errors do not reliably distinguish these causes.

Entries render only through local raster image URLs after signature checking. No archive scripts or SVG are rendered, ComicInfo is not interpreted, and document references cannot initiate network requests. No document or reading position is stored automatically.

## Remaining limitations

- CBR/RAR and other archive families, password entry, continuous scrolling, and automatic two-page spread pairing are outside this issue.
- TIFF, HEIC, JPEG XL, PSD, SVG, and other recognized unsupported image extensions retain explanatory failure slots. Unknown extensions are ignored.
- AVIF support depends on the browser decoder. These fixtures establish compatibility for their encodings, not every variant of any image format.
- Individual damaged images can be skipped, but damaged or encrypted ZIP directories can prevent indexing the book.
- Images are checked as they are opened, so additional damaged pages can be reported later. Browser/process termination from severe memory pressure cannot always be caught by JavaScript.
- The current page number does not constitute an image-text alternative for a screen reader; the reader exposes filenames and page navigation, not OCR.

## Implementation references

- [zip.js ZipReader](https://gildas-lormeau.github.io/zip.js/api/classes/ZipReader.html) and [FileEntry](https://gildas-lormeau.github.io/zip.js/api/interfaces/FileEntry.html): local Blob reading, entry extraction, encryption metadata, and checksums.
- [YACReader reading controls](https://android.yacreader.com/user-guide/): single-page presentation, direction choice, and full-page/width fit informed the compact reading controls.
- [Astro components](https://docs.astro.build/en/basics/astro-components/): the tool keeps its composition root in Astro and interactive reader in a hydrated React island.
