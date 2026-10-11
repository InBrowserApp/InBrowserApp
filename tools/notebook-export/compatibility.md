# Notebook export compatibility

The converter reads nbformat 4 files with the same parser and sanitized static
renderer as the Notebook Viewer. It exports the saved state and never starts a
kernel or widget runtime. The format reference is the
[nbformat specification](https://nbformat.readthedocs.io/en/latest/format_description.html).

- HTML retains readable cells, supported saved outputs, safe internal/external
  links, tables, and included raster or sanitized static SVG images. It includes
  a restrictive content security policy and the export notes. Missing resources,
  undecodable images, unknown cells, and unsupported rich output are identified.
- Markdown is reconstructed from the same safe document. Code fences accommodate
  embedded backticks; explicit anchors retain internal destinations. Tables use
  HTML, and images use embedded data URLs, whose support varies between readers.
- Code files contain the original code cells in order, separated by blank lines.
  A recognized `metadata.language_info.name` determines the extension; otherwise
  it is TXT. Markdown/raw cells and outputs are omitted. Magics and shell syntax
  remain literal and may require manual adjustment or the original kernel.
  No code cells means a downloadable empty file.

Saved results may be stale. Remote resources, scripts, widgets, audio and video
are not run or fetched. LaTeX stays source text. Layout, raw-cell formatting
directives, and every notebook-specific feature are not reproduced. Resources
are constrained by the browser, with no fixed file-size or cell-count quota.

## Representative verification

The authored `survey.ipynb` and `unavailable.ipynb` fixtures are shared with
`tools/notebook-viewer/fixtures/`. That directory's README records provenance
and hashes for the four unchanged official Jupyter examples used in browser
checks: Running Code, Working With Markdown Cells, What is the Jupyter Notebook,
and Typesetting Equations. Upstream examples are not redistributed here.

Additional cases cover empty/no-code notebooks, Python and JavaScript scripts,
unknown languages, magics, nested heading anchors, long backtick fences, broken
images, a 51 MiB file, and 1,001 code cells. Tests check original code text,
UTF-8 downloads, safe links and output, image failures, cancellation, replacement,
and absence of stale downloads. Browser verification uses local files and blocks
external requests; exported HTML is also reopened independently offline.
