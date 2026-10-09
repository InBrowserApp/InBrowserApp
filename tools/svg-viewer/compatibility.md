# SVG/SVGZ viewing contract

Files are read, gzip-decoded when their bytes identify gzip, and parsed in a
cancellable worker. Saxes parses XML without a browser document or fetching
entities. Document type declarations are rejected. The reconstructed SVG is
displayed as a local image URL; source markup is never attached to the app DOM.
The worker terminates after success, failure, replacement, or cancellation.
The image URL is revoked when its preview closes or is replaced.

The static subset retains SVG shapes, text, local references, gradients,
clipping, masks, and filters. CSS is parsed as CSS, and only static presentation
properties with local fragment URLs are retained. At-rules, variables, external
resources, event handlers, scripts, animation, foreign namespaces, embedded HTML,
and unsupported elements are omitted. Embedded base64 PNG/JPEG/static WebP images
are retained; PNG animation control chunks, animated WebP, GIF, nested SVG,
external files, and downloaded fonts are excluded. The details panel reports
omissions. An image decode failure has its own visible error state.

The viewer preserves the declared viewBox and aspect-ratio behavior. Absolute
width and height determine the initial coordinate viewport at 96 CSS pixels per
inch; otherwise the viewBox supplies missing dimensions, with a 300 × 150
fallback when neither is available. The UI shows original declared dimensions
and viewBox, and disables actual size for relative or missing dimensions. Root
CSS sizing is normalized to this declared viewport rather than treated as an
application layout. Art outside that viewport is not automatically measured or
included. Installed fonts and browser-specific filter behavior can differ.

There is no file-size, element-count, or decompressed-size quota. A worker lets
the user cancel a large parse, and actual allocation failures have a distinct
resource message. Extremely large coordinate spaces and complex filters remain
subject to native browser rendering limits.

## Primary references

- [SVG as an image: browser restrictions](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image)
- [SVG 2 coordinate systems and intrinsic sizing](https://www.w3.org/TR/SVG2/coords.html)
- [Saxes parser](https://github.com/lddubeau/saxes)
- [CSSTree parser and structured CSS traversal](https://github.com/csstree/csstree)
- [DecompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream)

## Representative verification

The checked-in W3C examples and owned fixtures cover viewBox scaling, paths and
text, negative origins, gradients, masks, filters, PNG images, transparency, and
omitted active content. SVG and SVGZ are compared by rendered pixels, not only by
successful parsing. Browser checks include fractional zoom, keyboard/mouse pan,
fit/reset, all backgrounds, mobile focus mode, RTL layout, and landscape reading.

Additional runtime fixtures cover UTF-16, malformed XML/gzip, document type
declarations, missing/percentage sizes, 1,001 drawing elements, and a file larger
than 51 MiB without truncation. Network, worker, and object-URL instrumentation
check that documents never request external resources and that replacement and
close release the preview. The viewer does not claim full SVG feature parity,
animation playback, text editing, or reproduction of unavailable fonts.
