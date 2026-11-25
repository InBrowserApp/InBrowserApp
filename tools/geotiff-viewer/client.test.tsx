import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import type { RasterPreview } from "./raster"

const workers: MockWorker[] = []
const currentWorker = () => workers.at(-1)!

class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()

  constructor() {
    workers.push(this)
  }

  send(data: unknown) {
    act(() => this.onmessage?.(new MessageEvent("message", { data })))
  }
}

const preview: RasterPreview = {
  details: {
    width: 2,
    height: 1,
    bands: 2,
    color: true,
    crs: "EPSG:4326",
    bounds: [10, 20, 30, 40],
    noData: 0,
  },
  width: 2,
  height: 1,
  pixels: new Uint8ClampedArray(8),
  band: -1,
}

const sample = new File(["sample"], "elevation-example.tif")
const button = (name: string) => screen.getByRole("button", { name })

beforeEach(() => {
  workers.length = 0
  vi.stubGlobal("Worker", MockWorker)
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("loads a sample and keeps the file details while switching bands", () => {
  render(<Client messages={m} lang="en" />)
  fireEvent.click(button(m.example))
  expect(currentWorker().postMessage).toHaveBeenCalledWith({
    source: "example",
  })
  expect(screen.getByRole("status").textContent).toContain(m.loading)
  currentWorker().send({ file: sample, preview })
  expect(screen.getByText("EPSG:4326")).toBeTruthy()
  expect(screen.getByText("2 × 1")).toBeTruthy()
  expect(screen.getByText("10 · 20 · 30 · 40")).toBeTruthy()
  expect(screen.getByRole("region", { name: m.preview })).toBeTruthy()

  fireEvent.click(button(m.zoomIn))
  fireEvent.click(button(m.zoomOut))
  fireEvent.click(button(m.fit))
  fireEvent.change(screen.getByLabelText(m.display), { target: { value: "1" } })
  expect(currentWorker().postMessage).toHaveBeenCalledWith({
    source: sample,
    band: 1,
  })
  expect(screen.getByText("EPSG:4326")).toBeTruthy()
  currentWorker().send({ file: sample, preview: { ...preview, band: 1 } })
  expect(screen.getByRole<HTMLSelectElement>("combobox").value).toBe("1")
  fireEvent.click(button(m.clear))
  expect(button(m.open)).toBe(document.activeElement)
})

test("keeps an unreadable file available to replace", () => {
  render(<Client messages={m} lang="en" />)
  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [sample] },
  })
  currentWorker().send(null)
  expect(screen.getByText(m.error)).toBeTruthy()
  expect(button(m.replace)).toBeTruthy()

  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [sample] },
  })
  currentWorker().send({
    file: sample,
    preview: {
      ...preview,
      band: 0,
      details: {
        ...preview.details,
        color: false,
        crs: null,
        bounds: null,
        noData: null,
      },
    },
  })
  expect(screen.queryByText(m.error)).toBeNull()
  expect(screen.getAllByText(m.unavailable)).toHaveLength(3)
  expect(screen.queryByRole("option", { name: m.color })).toBeNull()
})
