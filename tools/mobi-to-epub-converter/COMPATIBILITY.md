# MOBI / AZW3 to EPUB compatibility

This tool creates a reflowable EPUB reading copy entirely in the browser.
It accepts the unencrypted MOBI 6, KF8/AZW3 and combination books supported by
MOBI Reader. AZW and PRC extensions use the same format checks; unrelated PRC,
KFX, protected and fixed-layout books are rejected.

The existing ebook snapshot retains text in reading order, resolvable internal
links and footnotes, available title/author/language, cover and embedded images.
The EPUB contains local XHTML chapters, navigation, a manifest and a spine.
Supporting sections are included as non-linear reading content. Original inline
contents remain when they are part of the source chapter text. Empty sanitized
sections are omitted; a missing required chapter prevents a partial download.

Publisher CSS, exact pagination, scripts, forms, audio, video and remote resources
are not reproduced. Missing images become marked placeholders and conversion
notes disclose missing resources and unresolved links. Validated SVG/raster
images are packaged locally; browser-readable non-core image formats are
converted to PNG. Language falls back to `und` when source metadata is absent or
invalid. This is not a DRM removal tool.

Validation uses the original demonstration fixtures in `../mobi-reader/fixtures`,
plus the Unicode/links fixture in this tool. Exported books are checked with
EPUBCheck and opened independently with Calibre. Browser checks cover Chromium,
Firefox and WebKit, cancellation/replacement, mobile and RTL layouts. There are
no product file-size or chapter-count quotas; actual browser resource failures
remain possible.
