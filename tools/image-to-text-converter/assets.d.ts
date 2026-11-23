declare module "tesseract.js/dist/worker.min.js?url" {
  const url: string
  export default url
}

declare module "tesseract.js-core/tesseract-core-lstm.wasm.js?url" {
  const url: string
  export default url
}

declare module "virtual:tesseract-model-urls" {
  type Code = import("./languages").Language
  const urls: Readonly<Record<Code, string>>
  export default urls
}
