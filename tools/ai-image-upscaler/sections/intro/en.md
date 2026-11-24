## How to upscale an image with AI

1. Choose or drop a JPG, PNG, or WebP image. Start with the best copy you have, even if it is small.
2. Select **2×** or **4×** and check the output dimensions. A 400 × 300 image becomes 800 × 600 at 2× or 1600 × 1200 at 4×.
3. Select **Upscale image**, then move the comparison slider to inspect edges and textures. Download the result as a lossless PNG.

## What is AI image super-resolution?

Super-resolution increases the pixel dimensions of a low-resolution image. InBrowser.App uses Real-ESRGAN, a trained model that estimates finer edges and textures from the available pixels. It can make small photos, illustrations, and compressed web images look clearer at larger sizes. Check faces, tiny text, and fine patterns in the preview. The new details are estimates and can differ from the original scene.

## Should I use 2× or 4× upscaling?

Choose 2× for a modest enlargement, such as a thumbnail for a larger layout. Choose 4× when the image needs to fill much more space, such as a small scan you want to display at a larger size. Doubling each side produces four times as many pixels. Quadrupling each side produces sixteen times as many. The input can be up to 2,048 pixels on either side and 1 megapixel in total.

## Is the upscaling done on my device?

Yes. Your browser downloads the Real-ESRGAN model when you first start an upscale. It processes the image on your device using WebGPU when available and can use the CPU through WebAssembly. The first run may take longer, and processing time depends on the image size and your device. Your image stays on your device throughout.
