## Export a saved Jupyter notebook

Open an IPYNB notebook and choose HTML, Markdown or code. HTML and Markdown keep cells in their saved order, including supported saved outputs. Everything stays in your browser. No kernel, code or widget runtime is started.

## Choose a useful output

HTML is a standalone reading copy with selectable text, supported included images and readable tables. Markdown provides reusable document content; tables may contain safe HTML and images use embedded data URLs, which some Markdown applications do not display. Original layout and formatting can change.

Code export keeps code cells in order and omits Markdown, raw cells and saved output. A recognized notebook language determines the script extension; unknown languages use TXT. Notebook magics and shell syntax remain as written, so the exported code may need manual adjustment or the original notebook kernel. A notebook without code cells produces an empty code file.

## Saved results and compatibility

The converter reads notebook format 4. Results come from the saved file and may be stale. Unsupported rich content and unavailable images are identified. Remote resources are not fetched; scripts, widgets, audio and video are not run. LaTeX stays as source text, and raw or unknown cells appear as readable text in document exports.

Browser resources determine practical limits; there is no fixed file-size or cell-count quota. To inspect the original notebook, use the [Jupyter Notebook Viewer](/tools/notebook-viewer/).
