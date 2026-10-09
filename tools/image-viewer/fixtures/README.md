# Representative images

The checked-in color chart and related fixtures are original test artwork made for this repository with Pillow 12.1.1. They use the repository's license. They are real encoded files, not renamed substitutes:

- `color-chart.png`: 320 × 200 RGBA. Left orange `(232,92,40,255)`, upper right teal `(20,132,150,255)`, lower right green `(80,166,63,128)`.
- `color-chart.avif`, `.jp2`, `.j2k`: the chart encoded by Pillow's AVIF/OpenJPEG libraries. The codestream has a real SOC/SIZ header, not a JP2 wrapper.
- `color-chart.jxl`: chart encoded with the pinned WASM engine. This is a round-trip regression fixture; independent libjxl fixtures were also used for browser verification below.
- `big.tiff`: genuine little-endian BigTIFF, 73 × 91 RGB teal, produced with Pillow `big_tiff=True`.
- `pages.tiff`: three LZW TIFF pages: 320 × 200 chart, 200 × 320 teal and 100 × 100 orange.
- `multi-size.ico`: five actual PNG-backed icon entries at 16, 32, 64, 128 and 256 pixels, generated from a square orange image.
- `animation.gif`, `animation.animated.webp`: three optimized 100 × 100 frames with orange background, teal rectangle and green rectangle; durations 100, 200 and 300 ms. Later frames contain smaller offset rectangles, so correct preview requires coalescing. WebP is lossy; pixel tests allow codec rounding.
- `animation.apng`: the same animation in APNG; explicitly receives a default-still-only outcome.
- `orientation-6.jpg`: chart with EXIF orientation 6; displayed size is 200 × 320.
- `profiled.png`: chart with a real sRGB ICC profile created by Pillow/ImageCms.
- `high-depth.tiff`: 200 × 100, 16-bit grayscale, value 32768; preview precision is explicitly 8-bit.

## Independent files used in browser verification

These were downloaded only for development verification. They are not automatically requested by the application and are not redistributed in this directory. Pin and SHA-256 values are recorded in `verification-files.json`.

- [libheif example.heic](https://github.com/strukturag/libheif/blob/178b11afc84a43da8b57e17b40ce77dedb5bb414/examples/example.heic): real two-image HEIC collection, both 1280 × 854, with different pixel content. Both items were checked.
- [libheif alpha sample](https://github.com/strukturag/libheif/blob/178b11afc84a43da8b57e17b40ce77dedb5bb414/tests/data/with-alpha-512x512.heic): HEIC with alpha.
- [libheif sequence corpus](https://github.com/strukturag/libheif/blob/178b11afc84a43da8b57e17b40ce77dedb5bb414/fuzzing/data/sequence_corpus/seq_seed.heif): actual `msf1` timed-track container; explicit unsupported sequence outcome.
- [libjxl cropped traffic light](https://github.com/libjxl/testdata/blob/73695d303670c90e4d506ea89d9901b081385089/jxl/blending/cropped_traffic_light.jxl): four 50 × 80 frames with distinct composited pixels. Testdata is credited to the JPEG XL project under CC BY 4.0; see its [license](https://github.com/libjxl/testdata/blob/73695d303670c90e4d506ea89d9901b081385089/LICENSE).
- [libjxl PQ gradient](https://github.com/libjxl/testdata/blob/73695d303670c90e4d506ea89d9901b081385089/jxl/pq_gradient.jxl): 1088 × 64, 16-bit PQ source. Opens as an explicitly limited 8-bit preview; no HDR fidelity claim.
- [OPF JPEG 2000 corpus](https://github.com/openplanets/format-corpus/tree/366f068cec399d0cdfd61fa473de3ab6dc858098/jp2k-formats): `balloon.jpf` is actual JPX made by Kakadu 6.4, `balloon.jpm` is actual JPM made by Luratech, and `Speedway.mj2` is Motion JPEG 2000 made by OpenJPEG. All receive explicit unsupported-container feedback. The balloon source is public domain; the corpus documents its source and creators. A `.jpf` suffix is a JPX format variant, not proof of a separate decoder.

## Uncapped resource checks

A genuine **56,760,054-byte BMP** was generated from a 4400 × 4300 RGB array using `random.Random(1084).randbytes(4400 * 4300 * 3)` and Pillow's BMP writer. It opens at full pixel dimensions, permits actual-size panning, and can be cancelled/replaced while opening. A genuine **1001-page TIFF** was generated with 1 × 1 RGB pages colored `(index % 256,92,40)`; page 1001 displays `(232,92,40)`. These large or repetitive fixtures are generated during manual verification rather than committed.
