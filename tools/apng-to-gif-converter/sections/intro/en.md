## Convert animated PNG to GIF

APNG stores multiple frames in a PNG file. Convert it to GIF for chat apps,
forums, or documentation that expect a GIF for animation. Animated files may end
in `.apng` or `.png`. The converter reads the animation inside the file and
processes it on your device.

### How to convert APNG to GIF

1. Select **Choose file** or drop an animated PNG into the tool.
2. Select **Create GIF** to convert its frames at the original dimensions.
3. Select **Play** to check the GIF, then **Download GIF** to save it.

### What happens to frame timing and loops?

Each frame keeps its own delay, rounded to GIF's 10 ms units with a 20 ms
minimum for playback. For example, a 100 ms frame followed by a 250 ms frame
keeps both delays. The GIF keeps the source play count, whether it plays
once, several times, or forever. GIF supports at most 65,536 total plays for a
finite animation.

### How does GIF handle transparency and color?

APNG supports partial transparency and full-color frames. GIF uses an indexed
palette of up to 256 entries per frame and a single transparent entry. Soft
edges and shadows can look sharper, and smooth gradients can show bands.
Check the GIF preview before sharing. If the destination supports animated PNG,
the source keeps its full color and partial transparency.

### Frequently asked questions

#### Can I convert a regular PNG?

This tool requires PNG animation data. A file may have a `.png` extension and
still be animated. If your animation has a separate fallback image for static
PNG viewers, the GIF starts with the first animation frame.

#### Will the GIF be smaller than the APNG?

File size depends on canvas dimensions, frame count, and image detail. A GIF
can be larger, especially when the source APNG stores only small regions that
change between frames. Check the output size beside the GIF preview.

### Related animation tools

Use [GIF to APNG](/tools/gif-to-apng-converter/) for the reverse conversion,
or [Animated WebP to GIF](/tools/animated-webp-to-gif-converter/) for a WebP source.
