## What the PNG Optimizer Does

The PNG Optimizer compresses PNG images with lossless Oxipng optimization. It rewrites the PNG structure, compression settings, palette data, and alpha information where possible without changing the visible pixels.

## When to Use It

Use it before publishing screenshots, UI assets, diagrams, icons, or transparent graphics where PNG is the right output format. It is useful when you need a smaller file but cannot accept quality loss, color shifts, or conversion to a different image format.

## Options That Matter

The compression level controls how much work Oxipng performs. Lower levels return faster, while higher levels try more combinations and can take longer on large images. PNG interlacing can help older viewers show a coarse preview while loading, but it can also increase size. Alpha optimization is usually worth keeping on because it only applies lossless transparent-pixel improvements.

## Privacy and File Handling

The image is processed locally in your browser. The tool creates a temporary browser object URL for preview and download, and it does not upload the PNG to a server.

## Practical Notes

Lossless PNG optimization is not guaranteed to shrink every file. Some images have already been optimized, and occasionally a different PNG layout can be the same size or slightly larger. In that case, keep the original file or try a lower compression level.
