import { unzipSync, strFromU8 } from "fflate"
import { PDFDocument } from "pdf-lib"
import { expect, test } from "vitest"
import { exportScore } from "./export"
import {
  cropScorePage,
  flowScorePages,
  inScoreHost,
  paperHeight,
  paperWidth,
  placeFullPage,
  scoreFilename,
} from "./pages"

function section(y: number, height: number, staff = true) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("viewBox", `0 ${y} 704 ${height}`)
  svg.innerHTML = `<g class="${staff ? "abcjs-staff-wrapper" : "header"}"><path d="M 20 ${y + 1} h 80 v 20 Z"/></g>`
  return svg
}

test("keeps a new tune title with its first system and preserves section coordinates", () => {
  const pages = flowScorePages([
    [section(0, 900)],
    [section(0, 90, false), section(90, 90)],
  ])
  expect(pages.map((page) => page.childElementCount)).toEqual([1, 2])
  const staff = pages[1]!.lastElementChild!
  expect(staff.getAttribute("viewBox")).toBe("0 90 704 90")
  expect(staff.getAttribute("y")).toBe("135")
})

test("removes the offscreen host after a failure", async () => {
  let wrapper: HTMLDivElement | undefined
  await expect(
    inScoreHost(paperWidth, (host) => {
      wrapper = host
      expect(host.isConnected).toBe(true)
      throw new Error("render failed")
    })
  ).rejects.toThrow("render failed")
  expect(wrapper!.isConnected).toBe(false)
})

test("exports a single full SVG page with a white paper background", async () => {
  const page = placeFullPage(section(0, 200))
  const { blob, filename } = await exportScore(
    [page],
    "svg",
    scoreFilename("..Étude / n° 1.."),
    "fr"
  )
  expect(filename).toBe("Étude _ n° 1.svg")
  expect(blob.type).toBe("image/svg+xml")
  const document = new DOMParser().parseFromString(
    await blob.text(),
    "image/svg+xml"
  )
  expect(document.documentElement.getAttribute("width")).toBe(
    String(paperWidth)
  )
  expect(document.querySelector("rect")?.getAttribute("fill")).toBe("white")
  expect(document.querySelector("path")).toBeTruthy()
})

test("bundles paginated SVGs in order and keeps vector PDF pages at the same size", async () => {
  const pages = flowScorePages([[section(0, 900), section(900, 200)]])
  const { blob, filename } = await exportScore(pages, "svg", "Etude", "en")
  const files = unzipSync(new Uint8Array(await blob.arrayBuffer()))
  expect(filename).toBe("Etude-svg.zip")
  expect(Object.keys(files)).toEqual(["Etude-1.svg", "Etude-2.svg"])
  expect(strFromU8(files["Etude-2.svg"]!)).toContain("M 20 901")
  const pdfFile = await exportScore(pages, "pdf", "Etude", "en")
  const pdf = await PDFDocument.load(await pdfFile.blob.arrayBuffer())
  expect(pdfFile.filename).toBe("Etude.pdf")
  expect(pdf.getPageCount()).toBe(2)
  for (const page of pdf.getPages()) {
    expect(page.getWidth()).toBeCloseTo(paperWidth * 0.75)
    expect(page.getHeight()).toBeCloseTo(paperHeight * 0.75)
  }
})

test("crops a rendered excerpt to padded ink bounds with a fully white canvas", async () => {
  const rendered = section(50, 900)
  Object.assign(rendered, {
    getBBox: () => ({ x: 100.25, y: 95.5, width: 220.3, height: 45.1 }),
  })
  const page = cropScorePage(rendered)
  const { blob } = await exportScore([page], "svg", "excerpt", "en")
  const svg = new DOMParser().parseFromString(
    await blob.text(),
    "image/svg+xml"
  )
  expect(svg.documentElement.getAttribute("viewBox")).toBe("0 0 245 70")
  expect(svg.querySelector("svg svg")?.getAttribute("viewBox")).toBe(
    "88 83 245 70"
  )
  expect(svg.querySelector("rect")?.getAttribute("width")).toBe("100%")
  expect(svg.querySelector("rect")?.getAttribute("fill")).toBe("white")
})

test("preserves Letter paper dimensions for short tunes", async () => {
  const pages = flowScorePages([[section(0, 100)]], "letter")
  expect(pages[0]?.getAttribute("viewBox")).toBe("0 0 816 1056")
  const { blob } = await exportScore(pages, "pdf", "waltz", "en")
  const pdf = await PDFDocument.load(await blob.arrayBuffer())
  const paper = pdf.getPage(0)
  expect(paper.getWidth()).toBe(612)
  expect(paper.getHeight()).toBe(792)
})
