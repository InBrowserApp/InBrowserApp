## Read text and logs locally

Open a .txt, .text, or .log file to read it with line numbers, adjustable text size, optional wrapping, and focused reading. Jump to a line, move to the beginning or end, or use Find text to search the entire file. Search is literal and case-sensitive; next and previous wrap around the file.

## Large files and long lines

The reader displays a section at a time to keep large files usable. Every section remains accessible, including the continuation of very long lines. Selection and your browser's Find command cover the current section; the reader's Find text searches the complete decoded file, including matches across section boundaries. No file-size or line-count cap is imposed. Available browser memory still sets a practical limit.

Blank lines, tabs, mixed CRLF/CR/LF line endings, and Unicode text are preserved. Line endings are displayed as line breaks. Markup and terminal escape sequences stay inert text. Some control characters have no visible glyph; files containing NUL characters receive a binary-file notice.

## Choose the right encoding

Automatic mode recognizes UTF-8 and UTF-16 byte-order marks and otherwise uses strict UTF-8. You can choose UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030, or Shift JIS. A decoding error stops the preview instead of silently replacing unreadable characters. Try another encoding if the file is unreadable or looks garbled; the viewer cannot determine every file's original encoding.

Files are processed on your device without uploads, remote resources, or automatic storage. Closing or replacing a file releases its reading session. This viewer does not edit files, interpret HTML or terminal commands, or follow a live log.
