import init, { WasmDocument, wasmSimd128Supported } from "djvu-rs"
import type { WasmPage } from "djvu-rs"
import scalar from "djvu-rs/scalar/djvu_rs_bg.wasm?url"
import simd from "djvu-rs/simd128/djvu_rs_bg.wasm?url"
import { PDFDocument } from "pdf-lib"
import { pageRotations } from "./rotation-info"
import { createTextLayer } from "./text-layer"
import type { TextZone } from "./text-layer"
import type { Reply } from "./types"

declare const self: DedicatedWorkerGlobalScope

function send(reply: Reply) {
  self.postMessage(reply)
}

function readText(
  page: WasmPage,
  dpi: number,
  width: number,
  height: number
): TextZone[] {
  try {
    const raw = page.text_zones_json(dpi)
    if (raw === undefined) return []
    const zones = (JSON.parse(raw) as TextZone[]).filter(
      ({ w, h }) => w > 0 && h > 0
    )
    const plain = page.text()
    if (zones.length) {
      // The WASM API trims the leaf zones. Keep separators from the source
      // text so tightly spaced words remain searchable as a phrase.
      if (plain) {
        let end = 0
        let previous: TextZone | undefined
        for (const zone of zones) {
          const start = plain.indexOf(zone.t, end)
          if (start < 0) {
            previous = undefined
            continue
          }
          if (previous && /^[\t\p{Zs}]+$/u.test(plain.slice(end, start))) {
            previous.spaceAfter = true
          }
          previous = zone
          end = start + zone.t.length
        }
      }
      return zones
    }

    // A text chunk can contain plain text without usable OCR boxes.
    const lines = plain
      ?.trim()
      .split(/\r?\n/u)
      .filter((line) => line.trim())
    if (!lines?.length) return []
    const lineHeight = Math.min(dpi / 6, height / lines.length)
    return lines.map((t, index) => ({
      t,
      x: 0,
      y: index * lineHeight,
      w: Math.min(width, Array.from(t).length * lineHeight * 0.5),
      h: lineHeight,
      unpositioned: true,
    }))
  } catch {
    // Preserve the scan if the optional text chunk is damaged.
    return []
  }
}

async function open(file: File) {
  try {
    const bytes = new Uint8Array(await file.arrayBuffer())
    return {
      rotations: pageRotations(bytes),
      document: WasmDocument.from_bytes(bytes),
    }
  } catch {
    return undefined
  }
}

async function convert(file: File) {
  await init(wasmSimd128Supported() ? simd : scalar)
  const opened = await open(file)
  const total = opened?.document.page_count() ?? 0
  if (!opened || !total) {
    opened?.document.free()
    send({ type: "invalid" })
    return
  }
  const { document, rotations } = opened
  try {
    const output = await PDFDocument.create()
    const text = createTextLayer(output)
    const canvas = new OffscreenCanvas(1, 1)
    const context = canvas.getContext("2d", { alpha: false })!
    let searchable = 0
    for (let number = 1; number <= total; number++) {
      send({ type: "page", page: number, total })
      let source: WasmPage | undefined
      try {
        source = document.page(number - 1)
        const nativeDpi = source.dpi()
        const nativeWidth = source.width_at(nativeDpi)
        const nativeHeight = source.height_at(nativeDpi)
        // Keep very large scans within the canvas dimensions supported on iOS.
        const dpi = Math.max(
          1,
          Math.floor(
            nativeDpi * Math.min(1, 4096 / Math.max(nativeWidth, nativeHeight))
          )
        )
        const width = source.width_at(dpi)
        const height = source.height_at(dpi)
        canvas.width = width
        canvas.height = height
        const pixels = source.render(dpi) as Uint8ClampedArray<ArrayBuffer>
        context.putImageData(new ImageData(pixels, width, height), 0, 0)
        const page = output.addPage([
          (nativeWidth * 72) / nativeDpi,
          (nativeHeight * 72) / nativeDpi,
        ])
        const image = await canvas.convertToBlob({
          type: source.bg44_chunk_count() ? "image/jpeg" : "image/png",
          quality: 0.95,
        })
        const bytes = await image.arrayBuffer()
        const embedded =
          image.type === "image/jpeg"
            ? await output.embedJpg(bytes)
            : await output.embedPng(bytes)
        page.drawImage(embedded, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        })
        // Release the decoded pixel buffer before processing the next scan.
        await embedded.embed()
        if (
          text.addPage(
            page,
            readText(source, dpi, width, height),
            width,
            height,
            rotations.length === total ? rotations[number - 1] : 0
          )
        )
          searchable++
      } catch {
        send({ type: "pageError", page: number })
        return
      } finally {
        source?.free()
      }
    }
    send({ type: "saving" })
    await text.embed()
    const bytes = await output.save()
    send({
      type: "ready",
      result: {
        pdf: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
        searchable,
        total,
      },
    })
  } finally {
    document.free()
  }
}

self.onmessage = ({ data }: MessageEvent<File>) => {
  void convert(data).catch(() => send({ type: "failed" }))
}
