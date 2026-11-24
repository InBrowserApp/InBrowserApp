## How to convert SVG to PDF

1. Drop an `.svg` file onto the converter or select **Choose SVG**. Select **Try an example** to see how the export works.
2. Check the SVG preview. Keep **Original SVG size** for a logo, icon, or illustration that needs its own page dimensions. Choose **A4** or **US Letter** when you need a standard sheet.
3. Select **Download PDF** to save a single-page PDF with the same base filename as your SVG. The conversion takes place in your browser, and your SVG file stays on your device.

## What stays vector in the PDF?

Paths, shapes, fills, and strokes are drawn directly in the PDF, so logos, diagrams, and line art stay sharp when you zoom in or print. Any supported embedded bitmap, such as a PNG photo, keeps its original raster resolution. Zooming in on the PDF is a quick way to inspect thin lines and curves before sharing it.

## How does the converter set the PDF page size?

**Original SVG size** uses the SVG canvas dimensions or derives them from its `viewBox`. The conversion uses the standard ratio of 96 SVG pixels per inch. For example, a 960 × 480 px SVG produces a 10 × 5 inch PDF page. **A4** and **US Letter** center the artwork with margins, preserve its proportions, and match the page orientation to the artwork.

## Why does my PDF look different from the SVG preview?

The SVG preview uses your browser's renderer. The PDF renderer supports common vector artwork, but custom fonts, filters, masks, and effects can look different or be omitted. External resources are skipped. For dependable typography and color, outline text in your design editor, embed any PNG or JPEG images, simplify complex effects, and check the downloaded PDF before printing.
