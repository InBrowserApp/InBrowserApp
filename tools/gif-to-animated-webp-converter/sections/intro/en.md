Animated WebP can keep the motion of a GIF while often producing smaller files for websites, product previews, documentation, and chat-friendly assets. This converter runs locally and, when you keep the default scale, speed, and loop settings, sends the original GIF through a lossless `gif2webp` min-size encoder before exporting `.webp` files.

## When to use it

Use this tool when you have animated GIFs that need a more modern web format, especially for pages where file size and loading speed matter. Animated WebP is supported by current major browsers and can preserve transparency, timing, and looping behavior.

## Conversion options

Scale changes every frame before encoding, which is useful when a GIF is larger than the place where it will be displayed. Speed changes playback timing without dropping frames. Loop behavior can follow the source GIF, force infinite playback, or use a custom count for assets that should stop after a specific number of plays. Keeping scale at 100%, speed at 1x, and loop behavior set to Follow GIF uses the default lossless min-size path.

## Privacy and limitations

The conversion runs in your browser. Lossless WebP usually compresses GIF-style animation better, but it cannot guarantee every output will be smaller; tiny or already optimized GIFs can grow because the WebP container still has overhead. Changing scale, speed, or loop behavior requires frame decoding and can use significant memory for very large GIFs. If the source GIF does not contain loop metadata, the default export plays once unless you choose infinite or custom looping.
