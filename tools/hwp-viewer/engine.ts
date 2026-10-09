import init, { HwpDocument } from "@rhwp/core"
import wasmUrl from "@rhwp/core/rhwp_bg.wasm?url"
import { preflight } from "./preflight"

export async function openEngine(bytes: Uint8Array) {
  preflight(bytes)
  if (typeof OffscreenCanvas === "undefined")
    throw new Error("browserUnsupported")
  const context = new OffscreenCanvas(1, 1).getContext("2d")
  if (!context) throw new Error("browserUnsupported")
  Object.assign(globalThis, {
    measureTextWidth: (font: string, text: string) => {
      context.font = font
      return context.measureText(text).width
    },
  })
  try {
    await init({ module_or_path: wasmUrl })
  } catch (cause) {
    throw new Error("engineUnavailable", { cause })
  }
  const document = new HwpDocument(bytes)
  if (!document.pageCount()) {
    document.free()
    throw new Error("empty")
  }
  return document
}
