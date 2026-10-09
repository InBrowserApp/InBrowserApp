# FictionBook reading compatibility

The reader opens FictionBook 2 XML in `.fb2` files and ZIP-compressed books in
`.fbz` or `.fb2.zip` files. ZIPs must contain exactly one non-directory `.fb2`
entry. Multiple-book archives are explained rather than arbitrarily selected.
No file-size, section-count, or archive-entry cap is imposed.

## Parsing and local resources

`foliate-js` 1.0.1 converts structural FictionBook markup to reading chapters.
The adapter first decodes BOMs, UTF-16 byte signatures, and declared encodings
with the browser's strict TextDecoder. XML namespaces are normalized so that
prefixed FictionBook documents work too. Malformed XML, external entity/DTD
syntax, and unrelated document roots are rejected before conversion.

Images must refer to embedded binary IDs with supported raster media types.
Missing, remote, and unsupported image references are removed before the engine
can access them. The cover is decoded directly from the validated binary;
the engine's cover-fetch function is never called. Scripts, other active
markup, and remote content cannot run inside the shared reader's sanitized
frame and restrictive CSP. External web links open only after a deliberate
user click. Archive extraction and parsing remain local.

The engine owns generated chapter URLs and releases them on close or file
replacement. The adapter owns the separate cover URL. The engine also creates
one module-level CSS URL, containing only its static reader styles. That URL
is independent of document contents and may remain for the application's
lifetime. Embedded images stay as chapter-local data URLs.

## Reading behavior and limitations

Nested section headings appear in the contents at every available depth.
Sections, paragraphs, emphasis, tables, poems, and raster illustrations are
preserved structurally. A narrow patch in the existing Foliate patch file
preserves poem titles, inline emphasis/links in verse lines, and image IDs used
by internal references. Resource IDs and reading targets are validated separately
so an image can retain a bookmark even when its producer reuses the binary ID. Publisher
stylesheets are not used; this is reflowable reading rather than exact
publisher pagination. Unsupported content may be omitted with a notice.

Named notes/comments bodies are outside the next/previous reading order;
other additional bodies remain reachable sequentially. Any internal reference
can be followed, and the optional back control restores a saved character
position across chapter reloads, including after changing text size. The
history is in memory only and disappears when the book is closed. The shared
controls remain unchanged for tools that do not opt into this capability.

Title, author, and cover have sensible fallbacks. The optional annotation is
shown as plain text in a collapsed disclosure. Missing or broken artwork is
reported without hiding readable text. SVG binaries, custom stylesheets,
interactive content, and audio/video are not supported. Large files can still
exhaust browser memory; converter recursion also limits extremely deep,
pathological markup. These are browser/engine constraints, not product caps.

## Validation samples

`fixtures/README.md` documents owned original samples and an independently
generated calibre 9.16.0 FictionBook. Samples cover nested headings, a note
without a backlink, multiple bodies, a JPEG cover, poetry emphasis, tables,
UTF-8/UTF-16LE/UTF-16BE, Windows-1251 Cyrillic, and mixed writing systems.
A standard ZIP-compressed version gives the same text as the direct FB2.
Regression tests include 1,001 sections and 1,002 archive entries, malformed
markup, missing resources, protected/ambiguous/empty archives, cancellation,
file replacement, and object URL cleanup.

## Primary references

- https://github.com/gribuser/fb2/blob/master/FictionBook.xsd
- https://github.com/johnfactotum/foliate-js/blob/main/fb2.js
- https://gildas-lormeau.github.io/zip.js/api/
- https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
- https://manual.calibre-ebook.com/generated/en/ebook-convert.html
