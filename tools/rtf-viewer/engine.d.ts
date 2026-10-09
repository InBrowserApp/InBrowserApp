declare module "rtf-viewer/assets/rtf_parser.js" {
  export function initSync(options: {
    module: BufferSource | WebAssembly.Module
  }): unknown
  export function parse_rtf(bytes: Uint8Array): string
}
