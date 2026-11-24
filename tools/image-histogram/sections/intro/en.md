## How to view an image histogram

Choose or drop a photo, screenshot, or illustration to see its histogram next to the image. You can also try the sample photo. Start with **Brightness** to see the overall tonal distribution, then switch to **RGB** to compare red, green, and blue on the same scale. Select a single channel for a closer look.

## How to read shadows, midtones, and highlights

The horizontal axis goes from 0 (darkest) to 255 (brightest). Shadows are on the left, midtones in the middle, and highlights on the right. Taller bars mean more pixels at that level. Hover over or tap the chart, or use the level slider with the arrow keys, to read the exact pixel count.

A spike at either end can point to clipped shadows or highlights, where detail may be lost. In the red channel, for example, a spike at 255 can reveal red-channel clipping even when the brightness histogram has room on the right. A pure white background can also create an end spike, so check the image preview for context. The **Shadows** and **Highlights** figures show the percentage of analyzed pixels at exactly 0 and 255.

## When to use a logarithmic scale

Use **Linear** to compare bar heights in direct proportion to pixel counts. Try **Logarithmic** when a large area of one color makes the rest of the histogram hard to see. The scale changes the chart height for each bin while keeping its pixel count the same.

## What the viewer measures

The viewer counts pixels from the browser-rendered 8-bit image without resizing it first. Brightness uses a weighted combination of red, green, and blue, giving green the most weight. Fully transparent pixels are skipped, and each partially transparent pixel counts once, though its RGB values can be rounded during rendering. Animated images are analyzed as a still frame. Your images are processed on your device.
