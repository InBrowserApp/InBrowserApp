## How to open a GeoTIFF

Choose a .tif or .tiff file or drop it into the viewer. To explore without a file, select **Try an example**. The sample is a small, generated elevation raster. The preview and raster details are processed on your device. The file is never uploaded.

## View a raster or an individual band

Use **Display** to switch between the color image, when available, and individual bands. The viewer stretches single-band values across the grayscale range to reveal detail. Pixels that match the file’s NoData value appear transparent. Large rasters are sampled for display. Zoom in to inspect the preview and select **Fit raster** to return to the full image.

## Read the GeoTIFF metadata

GeoTIFF stores a raster alongside information about where its pixels belong on Earth. Check the pixel dimensions and band count to identify the dataset. The coordinate reference system (CRS) and bounds come from the file’s embedded metadata. Bounds use the original coordinate system, which may be measured in degrees or projected units such as meters. A regular TIFF can still open as an image. Missing spatial metadata is shown as unavailable.
