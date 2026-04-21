## Why data URIs show up

Data URIs package a file and its metadata into one string, so they often appear in HTML, CSS, SVG, email templates, API payloads, and browser exports. They are convenient for small assets, but awkward to inspect once all you have is the encoded value.

## What this converter gives you

Paste a full `data:` URI to decode it locally in your browser. The tool shows the MIME type, tells you whether the payload is Base64 or URL encoded, previews text, images, audio, or video when the browser can render them, and suggests a download filename based on the media type.

## What to check before saving

A valid Data URI can still carry the wrong MIME type or a misleading extension. Compare the details panel with what you expected, review the preview when one is available, and rename the output file before downloading if you need a different filename.
