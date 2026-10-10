import { Previewer } from "pagedjs"
import html2canvas from "html2canvas"
import { PDFDocument } from "pdf-lib"
import { prepare } from "./prepare"
import { checkPage, pageStyle } from "./layout"
import type { Source, Reply } from "./types"

async function render(source: Source, reply: (data: Reply) => void) {
  let page = 0
  try {
    const { fragment, css, text, imageCount } = prepare(source)
    const host = document.createElement("div")
    document.body.append(host)
    const flow = await new Previewer().preview(
      fragment,
      [{ "document.css": css + pageStyle }],
      host
    )
    const pages = Array.from(
      host.querySelectorAll<HTMLElement>(".pagedjs_page")
    )
    if (!pages.length || flow.total !== pages.length) throw new Error("invalid")
    if (
      pages
        .map((element) => element.textContent)
        .join("")
        .replace(/\s/g, "") !== text ||
      host.querySelectorAll("img").length !== imageCount
    )
      throw new Error("unsupported")
    const pdf = await PDFDocument.create()
    const capture = document.createElement("div")
    capture.className = "pagedjs_pages"
    document.body.append(capture)
    // Capture only the current page, avoiding quadratic document cloning.
    host.setAttribute("data-html2canvas-ignore", "true")
    for (const element of pages) {
      page++
      reply({ progress: { page, pages: pages.length } })
      capture.replaceChildren(element)
      await Promise.all(
        Array.from(element.querySelectorAll("img"), (image) => image.decode())
      )
      checkPage(element)
      const canvas = await html2canvas(element, {
        scale: 150 / 96,
        logging: false,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
      })
      try {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png")
        )
        if (!blob) throw new Error("resource")
        const image = await pdf.embedPng(await blob.arrayBuffer())
        const width = (210 * 72) / 25.4
        const height = (297 * 72) / 25.4
        pdf
          .addPage([width, height])
          .drawImage(image, { x: 0, y: 0, width, height })
        await image.embed()
      } finally {
        canvas.width = canvas.height = 0
      }
    }
    reply({ progress: { page, pages: pages.length, saving: true } })
    const bytes = await pdf.save()
    reply({
      result: {
        pdf: new Blob([bytes.slice()], { type: "application/pdf" }),
        pages: pages.length,
      },
    })
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : String(reason)
    reply({
      error: /memory|allocat|array length|array buffer/i.test(message)
        ? "resource"
        : message,
      page,
    })
  }
}

const origin = parent.location.origin
const receive = (event: MessageEvent<{ source: Source; token: string }>) => {
  if (event.source !== parent || event.origin !== origin) return
  window.removeEventListener("message", receive)
  const { source, token } = event.data
  void render(source, (data) => parent.postMessage({ ...data, token }, origin))
}
window.addEventListener("message", receive)
parent.postMessage({ ready: true }, origin)
