import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../core/render", () => ({
  drawLayersToCanvas: vi.fn(() => true),
}))

import { createLayer } from "../core/gradient"
import { drawLayersToCanvas } from "../core/render"
import {
  exportRasterImage,
  updateActiveLayer,
  updateStop,
} from "./gradient-editor-helpers"

import type { GradientLayer } from "../core/gradient"

const mockedDrawLayersToCanvas = vi.mocked(drawLayersToCanvas)

function createMockCanvas(
  createElement: typeof document.createElement,
  options: Readonly<{
    context?: CanvasRenderingContext2D | null
    toBlob?: HTMLCanvasElement["toBlob"]
  }> = {}
) {
  const canvas = createElement("canvas")
  Object.defineProperty(canvas, "getContext", {
    configurable: true,
    value: vi.fn(() =>
      options.context === undefined
        ? ({} as CanvasRenderingContext2D)
        : options.context
    ),
  })

  if (options.toBlob) {
    Object.defineProperty(canvas, "toBlob", {
      configurable: true,
      value: options.toBlob,
    })
  }

  return canvas
}

describe("gradient-editor-helpers", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
    mockedDrawLayersToCanvas.mockReturnValue(true)

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:mock"),
    })
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("updates the active layer and preserves selection", () => {
    const activeLayer = createLayer({
      angle: 32,
      centerX: 25,
      id: "layer-active",
      stops: [
        { color: "#0EA5E9FF", id: "stop-a", position: 0 },
        { color: "#38BDF8FF", id: "stop-b", position: 50 },
        { color: "#F97316FF", id: "stop-c", position: 100 },
      ],
    })
    const siblingLayer = createLayer({ id: "layer-sibling" })
    const mutateLayers = vi.fn()
    const setShowLayerError = vi.fn()

    updateActiveLayer({
      activeLayer,
      activeStop: activeLayer.stops[1]!,
      mutateLayers,
      patch: {
        angle: 420,
        centerX: -10,
        type: "conic",
      },
      setShowLayerError,
    })

    expect(setShowLayerError).toHaveBeenCalledWith(false)
    expect(mutateLayers).toHaveBeenCalledTimes(1)

    const [updater, overrides] = mutateLayers.mock.calls[0] as [
      (layers: readonly GradientLayer[]) => readonly GradientLayer[],
      { activeLayerId: string; activeStopId: string; presetId: null },
    ]
    const nextLayers = updater([activeLayer, siblingLayer])

    expect(overrides).toEqual({
      activeLayerId: "layer-active",
      activeStopId: "stop-b",
      presetId: null,
    })
    expect(nextLayers[0]).toMatchObject({
      angle: 360,
      centerX: 0,
      id: "layer-active",
      type: "conic",
    })
    expect(nextLayers[1]).toBe(siblingLayer)
  })

  it("updates, clamps, and sorts stops", () => {
    const activeLayer = createLayer({
      id: "layer-active",
      stops: [
        { color: "#0EA5E9FF", id: "stop-a", position: 0 },
        { color: "#38BDF8FF", id: "stop-b", position: 50 },
        { color: "#F97316FF", id: "stop-c", position: 100 },
      ],
    })
    const mutateLayers = vi.fn()
    const setShowStopError = vi.fn()

    updateStop({
      activeLayer,
      mutateLayers,
      patch: {
        color: "#111111FF",
        position: 120,
      },
      setShowStopError,
      stopId: "stop-b",
    })

    expect(setShowStopError).toHaveBeenCalledWith(false)
    expect(mutateLayers).toHaveBeenCalledTimes(1)

    const [updater, overrides] = mutateLayers.mock.calls[0] as [
      (layers: readonly GradientLayer[]) => readonly GradientLayer[],
      { activeLayerId: string; activeStopId: string; presetId: null },
    ]
    const nextLayer = updater([activeLayer])[0]!

    expect(overrides).toEqual({
      activeLayerId: "layer-active",
      activeStopId: "stop-b",
      presetId: null,
    })
    expect(nextLayer.stops.map((stop) => stop.position)).toEqual([0, 100, 100])
    expect(nextLayer.stops.find((stop) => stop.id === "stop-b")).toMatchObject({
      color: "#111111FF",
      id: "stop-b",
      position: 100,
    })
  })

  it("exports a png raster image", async () => {
    const realCreateElement = document.createElement.bind(document)
    const link = realCreateElement("a")
    const clickSpy = vi.spyOn(link, "click").mockImplementation(() => {})
    const toBlob = vi.fn(
      (callback: BlobCallback, _type?: string, _quality?: number) => {
        callback(new Blob(["png"]))
      }
    )
    const baseCanvas = createMockCanvas(realCreateElement, { toBlob })
    const elementQueue = [baseCanvas]
    vi.spyOn(document, "createElement").mockImplementation(((
      tagName: string
    ) => {
      if (tagName === "canvas") {
        return elementQueue.shift() ?? realCreateElement("canvas")
      }

      if (tagName === "a") {
        return link
      }

      return realCreateElement(tagName as keyof HTMLElementTagNameMap)
    }) as typeof document.createElement)

    const setShowExportError = vi.fn()

    await exportRasterImage({
      exportHeight: 512,
      exportWidth: 768,
      format: "png",
      layers: [createLayer()],
      setShowExportError,
    })

    expect(setShowExportError).toHaveBeenCalledWith(false)
    expect(mockedDrawLayersToCanvas).toHaveBeenCalledOnce()
    expect(toBlob).toHaveBeenCalledOnce()
    expect(toBlob.mock.calls[0]?.[1]).toBe("image/png")
    expect(toBlob.mock.calls[0]?.[2]).toBeUndefined()
    expect(link.download).toBe("css-gradient.png")
    expect(link.href).toBe("blob:mock")
    expect(clickSpy).toHaveBeenCalledOnce()

    vi.runAllTimers()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock")
  })

  it("flattens jpeg exports onto a white canvas", async () => {
    const realCreateElement = document.createElement.bind(document)
    const link = realCreateElement("a")
    vi.spyOn(link, "click").mockImplementation(() => {})

    const jpegContext = {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: "",
    } as unknown as CanvasRenderingContext2D
    const jpegToBlob = vi.fn(
      (callback: BlobCallback, _type?: string, _quality?: number) => {
        callback(new Blob(["jpeg"]))
      }
    )
    const baseCanvas = createMockCanvas(realCreateElement, {
      toBlob: vi.fn(),
    })
    const jpegCanvas = createMockCanvas(realCreateElement, {
      context: jpegContext,
      toBlob: jpegToBlob,
    })
    const elementQueue = [baseCanvas, jpegCanvas]

    vi.spyOn(document, "createElement").mockImplementation(((
      tagName: string
    ) => {
      if (tagName === "canvas") {
        return elementQueue.shift() ?? realCreateElement("canvas")
      }

      if (tagName === "a") {
        return link
      }

      return realCreateElement(tagName as keyof HTMLElementTagNameMap)
    }) as typeof document.createElement)

    const setShowExportError = vi.fn()

    await exportRasterImage({
      exportHeight: 360,
      exportWidth: 640,
      format: "jpeg",
      layers: [createLayer()],
      setShowExportError,
    })

    expect(setShowExportError).toHaveBeenCalledWith(false)
    expect(jpegContext.fillStyle).toBe("#ffffff")
    expect(jpegContext.fillRect).toHaveBeenCalledWith(0, 0, 640, 360)
    expect(jpegContext.drawImage).toHaveBeenCalledWith(baseCanvas, 0, 0)
    expect(jpegToBlob.mock.calls[0]?.[1]).toBe("image/jpeg")
    expect(jpegToBlob.mock.calls[0]?.[2]).toBe(0.92)
    expect(link.download).toBe("css-gradient.jpg")
  })

  it("shows an error when a jpeg export canvas cannot be prepared", async () => {
    const realCreateElement = document.createElement.bind(document)
    const baseCanvas = createMockCanvas(realCreateElement, {
      toBlob: vi.fn(),
    })
    const brokenJpegCanvas = createMockCanvas(realCreateElement, {
      context: null,
      toBlob: vi.fn(),
    })
    const link = realCreateElement("a")
    const elementQueue = [baseCanvas, brokenJpegCanvas]

    vi.spyOn(document, "createElement").mockImplementation(((
      tagName: string
    ) => {
      if (tagName === "canvas") {
        return elementQueue.shift() ?? realCreateElement("canvas")
      }

      if (tagName === "a") {
        return link
      }

      return realCreateElement(tagName as keyof HTMLElementTagNameMap)
    }) as typeof document.createElement)

    const setShowExportError = vi.fn()

    await exportRasterImage({
      exportHeight: 256,
      exportWidth: 256,
      format: "jpeg",
      layers: [createLayer()],
      setShowExportError,
    })

    expect(setShowExportError).toHaveBeenLastCalledWith(true)
  })
})
