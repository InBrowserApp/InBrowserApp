# Notebook compatibility

The viewer reads local UTF-8 `.ipynb` files using the public
[nbformat 4 structure](https://nbformat.readthedocs.io/en/latest/format_description.html).
Known cells and outputs in newer minor versions are supported. Other major
versions receive an explicit format notice. String and multiline-array fields
preserve their specified joining behavior; traceback frames retain line breaks.
Metadata is optional. No size, cell-count, output-count, or outline-count cap is
applied; practical limits are available browser memory and DOM capacity.

Cells remain in file order. Markdown, code, and raw text have visible identities.
Code and saved output collapse independently. The outline lists every cell and
heading, including headings inside collapsed saved output. Python, JavaScript,
TypeScript, JSON, Bash, SQL, R, and Julia receive syntax colors when their language
is declared; other languages remain readable escaped source. Terminal escape
commands are stripped; full terminal cursor/backspace emulation is not provided.

Saved stream and error text, HTML tables, Markdown output, JSON, plain text,
PNG/JPEG/GIF/WebP, and sanitized SVG images are supported. Rich representations
are preferred, with a saved plain-text alternative when sanitization leaves no
readable HTML or SVG. Cell attachments are resolved only within their own cell.
Embedded raster images may animate if their format contains animation. Corrupt
raster data is subject to browser image decoding. LaTeX remains source text.

Every rich fragment is sanitized separately before it joins trusted cell markup.
Saved output styles cannot restyle other cells. SVG is sanitized and displayed
as an image; scripts, foreign objects, animation, external references and styles
are removed. A first-head CSP blocks scripts, remote resources, frames, forms,
and network connections in the preview. External links open only when selected.
Missing local assets and blocked remote resources have reading notices. HTML
styles, font metrics, SVG styles, and interactive visualizations can differ from
Jupyter. No kernel, JavaScript, widget runtime, package installation, audio, or
video playback is started. Available static widget text remains readable.

Validation includes the original fixtures and four unchanged official Jupyter
examples listed in `fixtures/README.md`. The examples cover ordered cells,
Markdown, saved streams, included images, and literal mathematics. The viewer
shows saved data only: it neither recomputes nor verifies its freshness. It does
not edit, export, upload, or persist the notebook.
