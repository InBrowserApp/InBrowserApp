# FB2 to EPUB compatibility

Accepts local FB2 books and FBZ / FB2.ZIP archives containing exactly one FB2
book. The existing reader handles UTF-8, supported declared encodings and
UTF-16 byte-order marks. Empty, malformed, encrypted, ambiguous and bookless
archives receive explicit errors rather than a partial download.

Reuses the shared ebook snapshot, EPUB writer and preview. Text, chapter order,
nested contents, resolved internal links and notes, title/author/language,
description, cover and supported images are retained in a simple reflowable copy.
Optional missing resources are disclosed; missing images get text placeholders.
Missing required chapters prevent incomplete downloads. A missing/invalid source
language uses `und`. Source styles and exact pagination are not reproduced.
Scripts, forms, audio/video and remote resources are not executed or fetched.

Representative original samples live in `../fb2-reader/fixtures`: FB2, FBZ,
Calibre-generated FB2, Cyrillic and both UTF-16 byte orders. Validation covers
EPUBCheck, independent Calibre rendering, browser downloads, internal links,
images, replacement/cancellation and mobile/RTL layouts. No product file-size
or chapter-count quotas are imposed; actual browser resources remain finite.
