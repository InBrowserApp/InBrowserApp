## Open a WARC web archive

Choose or drop a `.warc` or `.warc.gz` file, or try the sample archive. The viewer builds a list of capture records and opens the first archived HTML page it finds. Filter by URL or record type to locate a capture, then switch between the page preview and the record details. Indexing a large archive can take a while. Your file stays in your browser.

## Read capture dates and headers

A Web ARChive (WARC) file stores records collected when a crawler or archiving tool visits a website. Multiple records can share a URL. Use the UTC capture date and the original HTTP status to tell them apart. A response record contains the server reply. A request record describes what the crawler sent, and a revisit record may refer to another capture without storing the page again. You can inspect these records even when there is no page preview.

## What does the preview include?

The static preview uses HTML and supported images and style sheets stored in the same archive. Missing resources can change the layout or leave gaps. Scripts are disabled and the preview makes no requests to the original site, so interactive features such as sign-in and video playback are unavailable. The viewer accepts WARC 1.0 and 1.1, including gzip-compressed records.

[WARC format specification](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
