# PDF export behavior

The converter renders each slide with `PptxPresentation` and embeds a 150 DPI
PNG in a PDF page of the original physical dimensions. All slides, including
hidden ones, are included. Notes, comments, playback and interactivity are not
part of the output. Fonts and graphics are not guaranteed to match PowerPoint.

Package preflight checks XML, local relationships and missing parts before the
renderer runs. It also rejects unsupported embedded objects and media without
an embedded poster. Existing archive, image and canvas budgets apply without
an additional file-size or slide-count quota.

The renderer normally tolerates image decoding failures and draws parser error
pages. That behavior can produce an incomplete PDF with a successful download.
The `@silurus/ooxml` patch adds an opt-in `failOnError` to main-thread
`renderSlide`. The converter enables it for parser errors, pictures,
backgrounds, media posters, picture bullets and chart images. Default viewer
behavior is unchanged. `renderer.test.ts` exercises the real renderer with and
without this option; keep those regressions when upgrading the dependency.

Conversion releases the presentation and every temporary canvas on success,
failure or cancellation. The PDF preview uses the same Blob as the download.
