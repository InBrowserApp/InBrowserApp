# Owned FictionBook samples

The original prose in reading.fb2 was written for these tests. cover.jpg data is the owned MOBI fixture cover, generated as simple artwork. reading.fbz is a Python zipfile ZIP containing that same FB2 plus a README. UTF-16 variants encode the same document, and cyrillic.fb2 is a short original Windows-1251 document.

calibre.fb2 was independently generated from the owned tools/mobi-reader/fixtures/source.epub using official calibre 9.16.0: `ebook-convert source.epub calibre.fb2`. No third-party book content is included.

The files exercise a genuine FictionBook XML container, nested sections, verse emphasis, a note without backlink, multiple bodies, metadata, and embedded raster images.
