# Real-ESRGAN General x4v3

The bundled ONNX model uses the official
[realesr-general-x4v3 weights](https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesr-general-x4v3.pth)
from Xintao Wang’s [Real-ESRGAN project](https://github.com/xinntao/Real-ESRGAN).
The [BSD 3-Clause license](../../../apps/web/public/licenses/ai-image-upscaler.txt)
accompanies the model at `/licenses/ai-image-upscaler.txt`.

The weights were exported with PyTorch 2.7.1 from the upstream
[SRVGGNetCompact architecture](https://github.com/xinntao/Real-ESRGAN/blob/master/realesrgan/archs/srvgg_arch.py)
with 64 feature channels, 32 body convolutions, PReLU, and native 4× scaling.
The export uses float32, ONNX opset 13, and dynamic height and width.
`image` accepts RGB in NCHW layout in the 0–1 range, and `upscaled` returns
the 4× RGB prediction in NCHW layout.

- Upstream checkpoint SHA-256: `8dc7edb9ac80ccdc30c3a5dca6616509367f05fbc184ad95b731f05bece96292`
- Bundled ONNX SHA-256: `c24d8288116e805dfb447b90f8988e78e746a8ab794e922a8b5e8d7b2df49914`
