## Make an animated GIF from images

Turn a sequence of PNG, JPG (JPEG), WebP, or AVIF images into one animated GIF.
Each image becomes a frame. Combine screenshots to show how an interface works,
animate a set of illustrations, or make a short photo slideshow you can share
as a single file.

## How to turn images into a GIF

1. **Add images.** Choose or drop at least two image files. You can mix the
   supported formats in the same animation.
2. **Arrange the frames.** Drag the frames into order or use the up and down
   arrows. The list shows the order in which your images will play.
3. **Set the timing.** Change the duration next to any frame. To start with a
   consistent pace, enter a duration and select **Apply to all**, then adjust
   the frames that need more or less time.
4. **Create, preview, and download.** Set the loop count and select **Create
   GIF**. Use **Play** to check the exported animation, then select **Download
   GIF**. You can edit the existing frames and create another version.

## Choose frame duration and loop count

Duration is how long a frame stays visible, in milliseconds. The default is
200 ms, which shows five evenly timed frames per second. Use shorter durations
for quick motion and a longer duration when viewers need time to read text.
Set durations in 10 ms increments, starting at 20 ms.

The loop count is the total number of times the animation plays. Enter
**0** to repeat indefinitely, **1** to play once, or a number such as **3** to
play the whole sequence three times.

For a three-step tutorial, try **200 ms**, **200 ms**, and **600 ms**. Each play
lasts one second, with a longer pause on the final screenshot. Set the loop
count to **3** for a three-second animation.

## Mix image sizes and keep transparent backgrounds

The GIF uses a single canvas based on the widest and tallest frames. Images
are centered and the extra space around smaller frames stays transparent.
If the canvas exceeds 1280 pixels on its longest side, the tool scales it down
proportionally. To keep the same framing throughout the animation, prepare
images with matching dimensions in the [Image Resizer](../image-resizer/).

GIF uses fully transparent or fully opaque pixels. Soft edges and translucent
shadows can look different in the exported animation. Use the preview to check
those details.

## Frequently asked questions

### How can I make the GIF smaller?

Use smaller source images or remove frames that add little movement. You can
check the exported dimensions and file size in the preview. For a web project
that supports animated WebP, try the [GIF to Animated WebP Converter](../gif-to-animated-webp-converter/).

### Where are my images processed?

Your browser reads the images and creates the GIF on your device. The
downloaded GIF is a single file you can save and share.
