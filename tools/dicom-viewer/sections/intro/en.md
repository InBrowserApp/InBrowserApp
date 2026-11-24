## How to open DICOM files

Choose **Open DICOM files** or drop one or more files onto the viewer. Select all the images from a CT or MRI series to browse the stack. When the files contain multiple series, use the **Series** selector to switch between them. Files can have a `.dcm` or `.dicom` extension, or no extension at all.

Scroll over the image, focus it and press the up or down arrow, or use the slice slider or buttons. Select **Try sample** to explore a synthetic CT series before opening your own files.

## Adjust window width and level

Window width controls how wide a range of grayscale values is visible. Narrowing the window increases contrast within that range. Window level, also called window center, shifts the range toward lighter or darker values. Enter values under **Window settings**, or drag horizontally to change the width and vertically to change the level. Select **Reset** to restore the current slice's initial settings.

## Inspect DICOM metadata

Open **Metadata** to see tags for the current file, including modality, series description, and image dimensions when present. Search by tag number, attribute name, or value. For a multi-frame file, the table shows attributes common to the file. Metadata may include identifying information. Files and their tags are processed on this device without uploading them.

## Supported DICOM images

The viewer opens grayscale DICOM images with uncompressed or JPEG Lossless pixel data, including files that contain multiple frames. DICOM is a container format, so the encoding of the pixel data determines whether an image can be displayed. If an image uses another encoding, such as JPEG 2000, select an uncompressed DICOM export from the original imaging software. The viewer is for inspecting files and images. Use a clinical workstation for diagnosis.
