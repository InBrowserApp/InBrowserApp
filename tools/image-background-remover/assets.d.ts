declare module "onnxruntime-web/ort-wasm-simd-threaded.wasm?url" {
  const url: string
  export default url
}

declare module "*.onnx?url" {
  const url: string
  export default url
}
