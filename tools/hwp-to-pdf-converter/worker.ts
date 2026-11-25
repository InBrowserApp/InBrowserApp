import init, { HwpDocument } from "@rhwp/core"
import hwpWasm from "@rhwp/core/rhwp_bg.wasm?gzip-url"
import PDFDocument from "pdfkit"
import SVGtoPDF from "svg-to-pdfkit"
import { preflight } from "@workspace/hwp/preflight"
import { loadWasmSource } from "@workspace/hwp/wasm"
import { binaryResources } from "./core/binary"
import { xmlResources } from "./core/xml"
import { failure } from "./core/errors"
import { loadCjkFont, loadFonts } from "./fonts"
import { cjkFamily, fontFamily } from "./font-family"
import type { Request, Reply } from "./protocol"

const send = (reply: Reply) => postMessage(reply)
let resume: ((svg: string) => void) | undefined
function exchange(reply: Reply) {
  return new Promise<string>((resolve) => {
    resume = resolve
    send(reply)
  })
}

async function convert(bytes: Uint8Array) {
  let document: HwpDocument | undefined
  let page: number | undefined
  try {
    preflight(bytes)
    const resources =
      bytes[0] === 0x50 ? xmlResources(bytes) : binaryResources(bytes)
    await exchange({ type: "resources", resources })
    send({ type: "progress", stage: "engineLoading" })
    if (typeof OffscreenCanvas === "undefined")
      throw new Error("browserUnsupported")
    const context = new OffscreenCanvas(1, 1).getContext("2d")
    if (!context) throw new Error("browserUnsupported")
    let fonts: Awaited<ReturnType<typeof loadFonts>>
    try {
      fonts = await loadFonts()
    } catch (cause) {
      if (["browserUnsupported", "resource"].includes(failure(cause).code))
        throw cause
      throw new Error("engineUnavailable", { cause })
    }
    Object.assign(globalThis, {
      measureTextWidth: (font: string, text: string) => {
        const size = /^(.*?\d+(?:\.\d+)?px)\s/.exec(font)?.[1] ?? "13px"
        context.font = `${size} "${fontFamily(font)}"`
        return context.measureText(text).width
      },
    })
    try {
      await init({ module_or_path: await loadWasmSource(hwpWasm) })
    } catch (cause) {
      throw new Error("engineUnavailable", { cause })
    }
    document = new HwpDocument(bytes)
    const total = document.pageCount()
    if (!total) throw new Error("invalid")
    if (JSON.parse(document.getExternalImageReferences()).length)
      throw new Error("unsupported")
    // Register only the bundled faces. The worker has no system fonts.
    const pdf = new PDFDocument({ autoFirstPage: false, font: "" })
    for (const { family, weight, bytes } of fonts)
      pdf.registerFont(`${family}-${weight}`, bytes)
    let cjkRegistered = false
    for (let index = 0; index < total; index++) {
      page = index + 1
      const info = JSON.parse(document.getPageInfo(index)) as {
        width: number
        height: number
      }
      if (
        ![info.width, info.height].every(
          (value) => Number.isFinite(value) && value > 0
        )
      )
        throw new Error("invalid")
      const svg = await exchange({
        type: "page",
        svg: document.renderPageSvgWithProfile(index, "print"),
        page,
        total,
      })
      if (!cjkRegistered && svg.includes(`font-family="${cjkFamily}"`)) {
        pdf.registerFont(cjkFamily, await loadCjkFont())
        cjkRegistered = true
      }
      pdf.addPage({ size: [info.width * 0.75, info.height * 0.75], margin: 0 })
      // The library's declaration incorrectly types this PDF instance as a class.
      SVGtoPDF(pdf as unknown as typeof PDFDocument, svg, 0, 0, {
        width: info.width,
        height: info.height,
        fontCallback(family, bold, italic, options) {
          options.fauxItalic = italic
          if (family === cjkFamily) {
            options.fauxBold = bold
            return cjkFamily
          }
          return `${fontFamily(family)}-${bold ? "700" : "400"}`
        },
        warningCallback(message) {
          throw new Error("unsupported", { cause: message })
        },
      })
    }
    page = undefined
    send({ type: "progress", stage: "saving" })
    const chunks: Uint8Array<ArrayBuffer>[] = []
    await new Promise<void>((resolve, reject) => {
      pdf.on("data", (chunk: Uint8Array<ArrayBuffer>) => chunks.push(chunk))
      pdf.once("end", resolve)
      pdf.once("error", reject)
      pdf.end()
    })
    const result = new Uint8Array(await new Blob(chunks).arrayBuffer())
    postMessage(
      { type: "result", bytes: result, pages: total } satisfies Reply,
      { transfer: [result.buffer] }
    )
  } catch (reason) {
    send({ type: "error", ...failure(reason), page })
  } finally {
    document?.free()
  }
}

self.onmessage = (event: MessageEvent<Request>) => {
  if (event.data.type === "continue") {
    const next = resume
    resume = undefined
    next?.(event.data.svg ?? "")
  } else void convert(event.data.bytes)
}
