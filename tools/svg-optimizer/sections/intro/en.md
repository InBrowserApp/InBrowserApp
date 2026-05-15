## What this tool does

This SVG optimizer compresses one local SVG file or pasted SVG document in your
browser. It uses SVGO cleanup passes to remove comments, metadata, redundant
attributes, unnecessary precision, and other markup that does not change the
visible image.

## Why it helps

SVG files exported from design tools often contain editor metadata, verbose
paths, unused IDs, and comments. Optimizing them can reduce download size,
improve page loading, and make inline SVG code easier to review before it ships
in a website, app, email, or documentation page.

## How it works

Upload an `.svg` file or paste SVG markup, choose the safe preset or tune the
individual SVGO passes, then run optimization. The tool shows the original and
optimized previews, the byte savings, and the final markup so you can copy it or
download an `.optimized.svg` file. The SVG never needs to leave your device.

## Practical notes

- Keep the safe preset when the SVG depends on external CSS, scripted IDs, or
  symbol references you cannot easily inspect.
- Use the aggressive preset for simple exported icons, logos, and illustrations
  where removing dimensions and inlining styles is acceptable.
- Preview the optimized image before replacing source artwork, especially when
  the source uses masks, gradients, filters, or linked assets.
