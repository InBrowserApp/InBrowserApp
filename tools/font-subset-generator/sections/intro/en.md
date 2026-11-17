## What is a font subset?

A font subset contains the characters needed for a particular piece of text,
plus the supporting glyphs required to render them. Removing unused glyphs can
greatly reduce font downloads, especially for large Chinese, Japanese and Korean
fonts or a fixed heading, logo or campaign page.

## How to use this tool

Choose a TTF, OTF, WOFF or WOFF2 file and paste all the text that will use it.
Choose WOFF2 for web delivery or TTF / OTF for an uncompressed font, then generate
the subset. Compare the sizes, check the preview, and download the font and its
matching CSS. Font processing runs locally in a Web Worker.

## What is preserved?

HarfBuzz keeps the glyph dependencies and OpenType layout features needed for
ligatures, kerning, combining marks and complex scripts. Hinting and variable
font axes are retained. Canonically equivalent composed and decomposed text
forms are included where the source font supports them. The preview uses the
generated font, and missing source characters are listed separately.

## Practical tips

- Include spaces, punctuation, numbers and every translated string you need.
  Add the Latin preset if your text will also contain basic Latin characters.
- Regenerate the subset whenever your text changes. A fixed subset is best for
  known content; use broader character coverage for user-generated text.
- Subsetting cannot add characters missing from the original font. Keep a CSS
  fallback font for characters outside the subset.
- Use a font whose license permits modification and web embedding. Font
  collections (`.ttc` / `.otc`) must be exported as individual fonts first.
- Small or already-subset fonts may not become smaller. WOFF2 usually gives
  the smallest web download; glyph counts also include supporting glyphs.
