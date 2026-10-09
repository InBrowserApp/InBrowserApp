# Owned reading samples

All prose and the SVG illustration in source.epub were authored for these
reader tests. cover.jpg is an original programmatically drawn cover. These fixtures contain no third-party book content.

The three binary books were independently generated from source.epub with
official calibre 9.16.0:

```sh
ebook-convert source.epub reading-mobi6.mobi --mobi-file-type old --cover cover.jpg
ebook-convert source.epub reading-kf8.azw3 --cover cover.jpg
ebook-convert source.epub reading-combo.mobi --mobi-file-type both --cover cover.jpg
```

The PalmDB signature is BOOKMOBI. Header versions are respectively 6, 8,
and 6 with a second version 8 header. All use PalmDOC compression and no
encryption. Tests changing only an extension exercise accepted filename aliases,
not a different book encoding. These files exercise contents, a cover,
illustrations, a table, Unicode, right-to-left text, and internal references.

Conversion documentation: https://manual.calibre-ebook.com/generated/en/ebook-convert.html
