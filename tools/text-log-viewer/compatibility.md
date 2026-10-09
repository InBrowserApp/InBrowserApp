# Text and log reader compatibility

The reader opens local `.txt`, `.text`, and `.log` files. It does not upload,
execute, edit, export, tail, or automatically store their contents. Source text
is escaped before it enters a sandboxed frame with a restrictive Content
Security Policy. HTML, URLs, and terminal escape sequences stay inert text.

## Decoding and display

Automatic decoding recognizes UTF-16 little-endian and big-endian BOMs and
otherwise uses strict UTF-8, including an optional UTF-8 BOM. The encoding
picker also offers explicit UTF-8, UTF-16LE/BE, Windows-1252, Windows-1251,
GB18030, and Shift_JIS. Invalid byte sequences reject the file rather than
silently inserting replacement characters. A wrong encoding that happens to
decode successfully can still produce incorrect text; select the known source
encoding. There is no probabilistic encoding detection.

Decoded NUL characters trigger the binary-content notice. This is a practical
signal, not a complete binary-file detector. Other control characters remain in
the text and may have no visible glyph. CRLF, LF, and CR delimit lines; mixed
endings, blank lines, tabs, astral Unicode, and the final empty line are retained.
Line ending bytes appear as visual line breaks rather than literal glyphs.

The complete file is decoded and indexed in a disposable worker. Memory use
therefore grows with the decoded text and number of lines. Browser resource
exhaustion can prevent an otherwise valid file from opening. Reportable read,
decoding, allocation, worker, and binary-content failures have separate useful
states; a browser process that is killed by the operating system cannot report
an in-page error. Close, replace, and encoding correction release the old worker.

## Sections and search

There is no configured file-size, line-count, line-length, or match-count limit.
For responsive reading, each displayed section contains at most 256 lines and
approximately 32,768 UTF-16 units. CRLF and surrogate pairs stay intact at a
section boundary. Long lines continue in adjacent sections with the same line
number and a continuation indicator. Beginning/end, adjacent-section controls,
line navigation, and search can reach every section.

Search is case-sensitive literal text over the complete decoded file. Next and
previous include overlapping matches, cross decoded-chunk and section
boundaries, and wrap at the ends. It does not build an unbounded list of match
objects. A match spanning sections highlights its intersecting text in the
displayed section; adjacent sections expose the remaining source characters.
Selection, copying, and the browser's own Find apply to the current section.
Wrap, font size, and resize preserve a visible reading position within that
section. Line numbers are excluded from native selection.

Search leaves focus in its controls so Enter and Shift+Enter can be repeated.
Line navigation scrolls the requested row into view and requests focus without
scrolling the outer page. In the Firefox validation run, a large line jump left
focus on the reading frame's body rather than the target row; the requested row
remained visible and the reading frame retained keyboard focus.

## Representative validation files

The repository's `fixtures/mixed.log` is an authored test fixture containing
mixed endings, a tab, a blank line, multilingual Unicode, literal HTML, and ANSI
escape bytes. Additional generated fixtures exercise UTF-16 BOMs, the four
legacy encodings, invalid UTF-8, NUL bytes, empty input, matches spanning display
boundaries, 1,001 lines, and overlapping matches.

Large-file browser checks use real files on disk, without Playwright's buffer
upload limit: a 53,477,401-byte single line (1,633 displayed sections), and a
70,000,070-byte log containing 1,000,001 terminated lines plus the final empty
line. Checks reach the final text through whole-file search, line navigation,
and end navigation; they also close and replace a file during indexing.

Two independent upstream documents are checked locally without altering their
bytes or committing them into this repository:

- [CPython `Misc/HISTORY`](https://github.com/python/cpython/blob/5a22a62b96a68c2dd31784c5e3427ad7b365388a/Misc/HISTORY),
  revision `5a22a62b96a68c2dd31784c5e3427ad7b365388a`, 1,355,294 bytes;
  SHA-256 `a4c1489f93a38989ad0fed9f2faf7dc5c12429c0be633602ff4bb3e018522258`.
  Its [license](https://github.com/python/cpython/blob/5a22a62b96a68c2dd31784c5e3427ad7b365388a/LICENSE)
  contains the Python Software Foundation terms and historical notices.
- [Loghub Apache sample](https://github.com/logpai/loghub/blob/dd61d0952749ee7963bde24220d1be5ede023033/Apache/Apache_2k.log),
  revision `dd61d0952749ee7963bde24220d1be5ede023033`, 171,239 bytes;
  SHA-256 `c7efa3eb686e3a96bd2f8f4457b2a7887e9cf2f3649327f1b4e87af841363ce8`.
  Loghub's [license](https://github.com/logpai/loghub/blob/dd61d0952749ee7963bde24220d1be5ede023033/LICENSE)
  permits research or academic use with attribution. It is an additional local
  validation sample, not an unrestricted redistributable fixture.

Focused tests cover strict streaming decoding, chunk-boundary CRLF and Unicode,
section reconstruction, search direction/overlap/cancellation, escaped rendering,
stale worker results, worker disposal, frame-local navigation, and user controls.
Browser validation checks the production reader in Chromium, Firefox, and
WebKit, including native selection, encoding recovery, zero document network
requests, focus/Escape, narrow screens, landscape, RTL controls, and large input.
