## What This Tool Does

Markdown Previewer opens `.md`, `.markdown`, `.mdown`, and `.txt` documents locally in your browser. Read mode hides the source editor, while focus mode gives the document the screen. Adjust text size, reading width, and the clean or slate theme without losing your place. The collapsible outline navigates Markdown headings, and wide tables and code blocks scroll independently.

## When To Use It

Use it for READMEs, release notes, runbooks, and other Markdown documents. Standard Markdown and GitHub-style tables, task lists, strikethrough, and fenced code are supported. Code has no syntax highlighting; math, diagrams, footnotes, and other dialect extensions are not rendered. Inline HTML is sanitized, and scripts, styles, forms, and embeds cannot run. Remote images and fonts are not fetched. Relative images need files that have not been provided; alternative text remains visible when available. Embedded raster images work, but SVG images and links to other local documents are not loaded.

## Workflow Tips

Open or drop a file to start reading, then choose Edit to inspect or change its source. Local file contents and edits stay in memory and are discarded when you close or reload the page; your original file is never changed. The separate editing draft is saved in this browser and restored when you close a local file. Use Clear text with no file open to remove that saved draft. Copy HTML, Download HTML, and Print keep the rendered content and selected theme. Exports use the same safe resource restrictions as the preview; reader text size and width are not included.
