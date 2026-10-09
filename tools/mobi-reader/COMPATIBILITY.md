# MOBI and KF8 reading compatibility

The reader opens unencrypted, reflowable MOBI containers with `.mobi`, `.azw`,
`.azw3`, or `.prc` filenames. The PalmDB/MOBI headers determine compatibility;
filename aliases do not represent four independently verified encodings.
Unrelated PRC databases, KFX, protected books, and fixed-layout books receive
explicit feedback. Combo containers use the KF8 representation once.

## Engine and reading surface

`foliate-js` 1.0.1 supplies MOBI6 and KF8 parsing. The reader validates record
boundaries, compression/encoding, encryption, EXTH metadata, and both headers of
a combo file before opening text. It never removes encryption. `fflate`
inflates embedded font resources locally.

The shared reading surface is also used by EPUB. Its narrow interface supports
asynchronous internal destinations and optional per-chapter release; it does
not expose format-specific spine or archive structures. KF8 placeholder
sections are omitted while destination indexes are remapped. Superseded link
resolutions cannot override a newer chapter selection. Chapter reads and KF8
link resolution share one queue because both advance the engine's decompressed
text buffers.

MOBI6 and KF8 own their chapter/resource URL caches. Visiting another chapter
does not revoke URLs that the engine will reuse. Closing/replacing the book
releases all engine URLs and the optional cover; a load finishing after close
also releases its late URLs. MOBI6 reads all text records during opening, and
KF8 accumulates decompressed text as needed. There is no preset input/chapter
cap, but actual browser memory can still be exhausted.

## Upstream correction

`patches/foliate-js@1.0.1.patch` clears the MOBI6 text cache after collecting
`filepos` anchors. Its guide reader may cache the first chapter earlier, before
those anchors exist. Without the patch, first-chapter footnote navigation
returns to the top even though later chapters work. A genuine MOBI6 regression
checks that the first-chapter footnote destination exists. No EPUB engine code
is patched.

## Fixtures and observed boundaries

`fixtures/` contains owned source material and genuine calibre 9.16.0 outputs:
MOBI6, KF8/AZW3, and a combo MOBI. They cover title/author/cover, chapter order,
local artwork, internal references, a table, Unicode, and right-to-left text.
Uppercase AZW/PRC filename tests exercise aliases of the verified MOBI container.
Header mutations test protected, fixed-layout, damaged and unsupported outcomes;
they are not examples of decrypting protected publications.

Older MOBI formatting is deliberately simpler: calibre converts some headings
to styled paragraphs and may discard language tags or detailed typography.
Missing covers do not block reading. Invalid chapter resources can leave a
chapter unavailable, with other chapters still navigable. Complex fonts,
footnotes, and artwork may differ from dedicated reading applications.

All chapter HTML is sanitized before it enters the reading frame. A first-head
CSP blocks script execution and external document resources. Native navigation
attributes are removed; only sanitized inert link commands reach the reader.
The sandbox allows parent-owned keyboard handlers for WebKit, while the CSP
continues to forbid book scripts. Ordinary HTTP(S) links require an explicit
activation and open with `noopener,noreferrer`. The tool performs no upload,
account access, editing, conversion, or persistent book storage.

## Primary references

- https://github.com/johnfactotum/foliate-js
- https://github.com/johnfactotum/foliate-js/blob/main/mobi.js
- https://manual.calibre-ebook.com/generated/en/ebook-convert.html
- https://pnpm.io/cli/patch
