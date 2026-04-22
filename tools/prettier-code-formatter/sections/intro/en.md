## What Is Prettier Code Formatter?

Prettier Code Formatter runs the official Prettier standalone pipeline directly
in your browser so you can normalize source files without sending code to a
server. It is useful when you need a quick formatting pass, want to compare
different print settings, or need a clean file you can copy or download
immediately.

## Supported Formats

This rewrite keeps the tool focused on the formats Prettier already handles well in the browser: JavaScript, JSX, TypeScript, TSX, Flow, JSON variants, HTML, XML, CSS, PostCSS, SCSS, Less, Markdown, MDX, YAML, GraphQL, and template formats such as Angular, Vue, Svelte, LWC, MJML, and Handlebars. The language selector controls which parser runs, and importing a file will auto-detect the parser when the extension is recognized.

## How This Rewrite Works

The rewrite keeps heavy formatting logic out of the main UI path. Formatting
requests are built from pure tool-local config, then executed through a lazy
worker-backed Prettier pipeline so normal typing stays responsive. Large inputs
pause automatic formatting and switch to an explicit `Format now` action, which
is more predictable than trying to reformat a huge file on every keystroke.
