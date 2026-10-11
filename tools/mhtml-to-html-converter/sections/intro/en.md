## Convert a saved web archive locally

Open a local `.mhtml` or `.mht` archive, inspect the converted main page, and download a standalone UTF-8 HTML file. Bundled resources are kept inside the file so it can open offline. For reading recovered or incomplete archives, use the [MHTML Viewer](../mhtml-viewer/).

## Output and compatibility

Supported content-location and content-ID references are resolved inside the archive. Text, basic formatting, tables, links, bundled raster images and supported styles are preserved in a readable static document. Text remains selectable. Internal bookmarks stay in the document, and external links open only when selected. Preview zoom does not change the downloaded file. Fonts and complex layouts may differ from the original saved page.

Scripts, forms, redirects, embedded apps, SVG and MathML are omitted. Website sessions and interactive features are not restored. Incomplete archives, unsupported text encodings, additional pages and missing resources stop conversion without a partial download. Embedded images, including CSS background images, must decode successfully. Save a complete capture of the main document on its own if conversion fails. Email messages and plain HTML files need their corresponding tools.

## Privacy and browser resources

Files stay in this browser. Missing assets are never fetched from your computer or the live website, and file contents are never uploaded. The generated HTML blocks scripts and external resource loading when opened offline. Following an external link is a separate action that may contact that site. You can cancel, close or replace the archive. There is no fixed file-size or page-count quota; large archives depend on available browser memory, and resource failures are reported when detectable.
