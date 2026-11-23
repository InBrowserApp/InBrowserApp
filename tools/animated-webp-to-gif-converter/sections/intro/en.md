## Convert animated WebP to GIF

Animated WebP stores multiple frames in one `.webp` file. Convert it to GIF
when a chat app, documentation site, or other destination expects GIF
animation. Both lossy and lossless animated WebP files can be converted,
and processing stays on your device.

### How to convert animated WebP to GIF

1. Select **Choose file** or drop an animated WebP into the tool.
2. Select **Create GIF** to convert its frames at the original dimensions.
3. Select **Play** to check the GIF, then **Download GIF** to save it.

### What happens to frame timing and loops?

Each frame keeps its own delay, rounded to GIF's 10 ms units with a 20 ms
minimum for playback. For example, a 100 ms frame followed by a 250 ms frame
keeps both delays. A WebP set to play a fixed number of times keeps that total
number of plays. An infinite WebP produces an infinite GIF.

### How does GIF handle transparency and color?

GIF uses an indexed palette of up to 256 entries per frame and a single
transparent entry. WebP can store partial transparency, so translucent shadows
and anti-aliased edges may look different in the GIF. Color-rich frames may
also show banding. Check the preview against the background you plan to use.

### Frequently asked questions

#### Can I convert a still WebP?

This tool requires animation frames. The `.webp` extension is shared by still
and animated images. To build an animation from several still images, use
[GIF Maker](/tools/gif-maker/).

#### Why is the GIF larger than the WebP?

WebP compresses color and changing frame regions efficiently. A GIF can be
larger even when the dimensions and timing match. Check the output size next
to the preview if the destination limits uploads.

### Related animation tools

Use [GIF to Animated WebP](/tools/gif-to-animated-webp-converter/) for the
reverse conversion, or [APNG to GIF](/tools/apng-to-gif-converter/) for an
animated PNG source.
