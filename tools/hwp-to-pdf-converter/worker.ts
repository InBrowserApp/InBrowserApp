import init, { HwpDocument } from "@rhwp/core"
import hwpWasm from "@rhwp/core/rhwp_bg.wasm?url"
import { initWasm, Resvg } from "@resvg/resvg-wasm"
import svgWasm from "@resvg/resvg-wasm/index_bg.wasm?url"
import { PDFDocument } from "pdf-lib"
import { preflight } from "@workspace/hwp/preflight"
import { binaryResources } from "./core/binary"
import { xmlResources } from "./core/xml"
import { failure } from "./core/errors"
import { loadFonts } from "./fonts"
import { fontFamily } from "./font-family"
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
    let fonts: Uint8Array[]
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
      await Promise.all([
        init({ module_or_path: hwpWasm }),
        initWasm(fetch(svgWasm)),
      ])
    } catch (cause) {
      throw new Error("engineUnavailable", { cause })
    }
    document = new HwpDocument(bytes)
    const total = document.pageCount()
    if (!total) throw new Error("invalid")
    if (JSON.parse(document.getExternalImageReferences()).length)
      throw new Error("unsupported")
    const pdf = await PDFDocument.create()
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
      const raster = new Resvg(svg, {
        background: "white",
        fitTo: { mode: "zoom", value: 150 / 96 },
        font: {
          fontBuffers: fonts,
          defaultFontFamily: "Nanum Gothic",
          sansSerifFamily: "Nanum Gothic",
          serifFamily: "Nanum Myeongjo",
        },
      })
      try {
        if (raster.imagesToResolve().length) throw new Error("unsupported")
        const image = raster.render()
        try {
          const embedded = await pdf.embedPng(image.asPng())
          // Embed now to compress this page and release decoded RGB buffers
          // before rendering the next page of a long document.
          await embedded.embed()
          const width = (info.width * 72) / 96,
            height = (info.height * 72) / 96
          pdf
            .addPage([width, height])
            .drawImage(embedded, { x: 0, y: 0, width, height })
        } finally {
          image.free()
        }
      } finally {
        raster.free()
      }
    }
    page = undefined
    send({ type: "progress", stage: "saving" })
    const result = await pdf.save()
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
