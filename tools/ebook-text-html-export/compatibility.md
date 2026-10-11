# Ebook text and HTML export

The converter uses the same pinned, patched local parsers as the EPUB, MOBI and
FB2 readers. It accepts reflowable unencrypted EPUB; supported MOBI 6 and KF8
books in MOBI/AZW/AZW3/PRC containers; and FB2, FBZ or single-book FB2.ZIP.
Protected input, unsupported compression/encoding and fixed layouts are rejected.

Main reading sections retain their order. EPUB navigation documents and repeated
spine IDs are skipped. Export additionally includes non-spine HTML/XHTML manifest
items as supporting sections, so footnotes outside the spine remain available.
Nonlinear supporting sections follow the main reading text. Missing or unreadable
chapters block the download. Existing readers retain their original section lists.

HTML keeps sanitized semantic content in a simple responsive layout. Internal
references are resolved against original engine selectors before IDs are replaced
with unique export IDs. Unresolvable or removed destinations retain their text
without a broken link. Safe external links require a user click. Publisher styles,
active content, multimedia and remote resources are omitted. MathML falls back to
its readable text, without claiming preservation of equation layout.

Included supported raster and static SVG images are embedded and decoded before
export. Missing, unsupported or undecodable images become labelled placeholders.
SVG resources that the underlying parser cannot resolve are omitted and disclosed.
The output has a restrictive CSP and requires no source file or blob URL. TXT is
UTF-8 with chapter boundaries, supporting content, image descriptions and external
link addresses; it is not a paginated or layout-preserving representation.

Book resource ownership lasts through conversion and ends on success, failure,
replacement or cancellation. Chapters are loaded sequentially (required by KF8's
incremental decompression) and yield between sections. There are no fixed file-size
or chapter-count quotas; browser memory and decoding support set practical limits.

Validation includes existing genuine MOBI/KF8/combo and FB2 fixtures plus the owned
EPUB fixture described in `fixtures/README.md`. Browser checks reopen downloaded
HTML independently, verify images and internal links, and observe document network
requests rather than relying only on parser output strings.
