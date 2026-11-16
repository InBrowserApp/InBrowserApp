import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import GpuInformationClient from "./client"
import messages from "./messages/en.json"
import { captureGpuReport } from "./report"
import type { AvailableContext, GpuReport } from "./types"

vi.mock("./report", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./report")>()),
  captureGpuReport: vi.fn(),
}))

function context(api: "webgl" | "webgl2"): AvailableContext {
  return {
    api,
    available: true,
    vendor: "Browser",
    renderer: "WebGL renderer",
    unmaskedVendor: "NVIDIA",
    unmaskedRenderer: api === "webgl2" ? "RTX 4070" : "RTX 4070 (WebGL 1)",
    version: "WebGL 2.0",
    shadingLanguage: "GLSL ES 3.00",
    softwareRenderer: false,
    limits: [
      { name: "MAX_TEXTURE_SIZE", value: 16384 },
      { name: "MAX_VIEWPORT_DIMS", value: [16384, 16384] },
      { name: "SAMPLES", value: 0 },
    ],
    attributes: [
      { name: "alpha", value: true },
      { name: "antialias", value: false },
      { name: "powerPreference", value: "default" },
    ],
    precision: [
      {
        stage: "vertex",
        format: "HIGH_FLOAT",
        rangeMin: 127,
        rangeMax: 127,
        precision: 23,
      },
      {
        stage: "fragment",
        format: "HIGH_INT",
        rangeMin: 31,
        rangeMax: 30,
        precision: 0,
      },
    ],
    extensions: ["EXT_color_buffer_float", "OES_texture_float"],
  }
}

function report(): GpuReport {
  return {
    capturedAt: "2026-11-16T09:00:00.000Z",
    userAgent: "Test browser",
    contexts: [context("webgl"), context("webgl2")],
  }
}

beforeEach(() => {
  vi.mocked(captureGpuReport).mockReturnValue(report())
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

describe("GpuInformationClient", () => {
  it("shows WebGL 2 by default and exports the full report as text and JSON", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal("navigator", { clipboard: { writeText } })
    render(<GpuInformationClient messages={messages} />)

    expect(screen.getAllByText("RTX 4070")).toHaveLength(2)
    expect(screen.getByText("16384 × 16384")).toBeTruthy()
    expect(screen.getByText("Yes")).toBeTruthy()
    expect(screen.getByText("No")).toBeTruthy()
    expect(
      screen.getByRole("tab", { name: "WebGL 2" }).getAttribute("aria-selected")
    ).toBe("true")
    const download = screen.getByRole("link", { name: messages.downloadJson })
    expect(download.getAttribute("download")).toBe("gpu-information.json")
    const data = decodeURIComponent(
      download.getAttribute("href")!.split(",")[1]!
    )
    expect(JSON.parse(data)).toEqual(report())

    fireEvent.click(screen.getByRole("button", { name: messages.copyText }))
    await waitFor(() => expect(writeText).toHaveBeenCalledOnce())
    expect(writeText.mock.calls[0]![0]).toContain("unmaskedRenderer: RTX 4070")
    expect(writeText.mock.calls[0]![0]).toContain("[webgl]")
    expect(await screen.findByText(messages.copied)).toBeTruthy()
  })

  it("filters extensions case-insensitively and reports empty results", () => {
    render(<GpuInformationClient messages={messages} />)
    const search = screen.getByRole("searchbox", {
      name: messages.searchExtensions,
    })
    fireEvent.change(search, { target: { value: "  EXT_COLOR  " } })
    expect(screen.getByText("EXT_color_buffer_float")).toBeTruthy()
    expect(screen.queryByText("OES_texture_float")).toBeNull()
    expect(screen.getByText("1 / 2")).toBeTruthy()
    fireEvent.change(search, { target: { value: "not-an-extension" } })
    expect(screen.getByText(messages.noMatches)).toBeTruthy()
    fireEvent.change(search, { target: { value: "" } })
    expect(screen.getByText("OES_texture_float")).toBeTruthy()
  })

  it("switches contexts and refreshes the complete report", () => {
    render(<GpuInformationClient messages={messages} />)
    fireEvent.mouseDown(screen.getByRole("tab", { name: "WebGL 1" }), {
      button: 0,
      ctrlKey: false,
    })
    expect(screen.getAllByText("RTX 4070 (WebGL 1)")).toHaveLength(2)
    const changed = report()
    vi.mocked(captureGpuReport).mockReturnValue({
      ...changed,
      contexts: [
        { ...context("webgl"), unmaskedRenderer: "Updated GPU" },
        context("webgl2"),
      ],
    })
    fireEvent.click(screen.getByRole("button", { name: messages.refresh }))
    expect(captureGpuReport).toHaveBeenCalledTimes(2)
    expect(screen.getAllByText("Updated GPU")).toHaveLength(2)
  })

  it("shows generic renderer details without claiming WebGL is unsupported", () => {
    const generic: AvailableContext = {
      ...context("webgl"),
      unmaskedRenderer: null,
      unmaskedVendor: null,
      attributes: [],
      extensions: [],
      precision: [
        {
          stage: "vertex",
          format: "HIGH_FLOAT",
          rangeMin: null,
          rangeMax: null,
          precision: null,
        },
      ],
      limits: [{ name: "MAX_TEXTURE_SIZE", value: null }],
    }
    vi.mocked(captureGpuReport).mockReturnValue({
      ...report(),
      contexts: [generic, { api: "webgl2", available: false }],
    })
    render(<GpuInformationClient messages={messages} />)
    expect(screen.getByText(messages.privacyTitle)).toBeTruthy()
    expect(screen.getByText("WebGL 1: Available")).toBeTruthy()
    expect(screen.getByText("WebGL 2: Unavailable")).toBeTruthy()
    expect(screen.getByText(messages.noExtensions)).toBeTruthy()
    expect(screen.getAllByText(messages.notReported).length).toBeGreaterThan(2)
    expect(screen.queryByText(messages.unavailableTitle)).toBeNull()
  })

  it("explains software rendering and unavailable contexts", () => {
    vi.mocked(captureGpuReport).mockReturnValue({
      ...report(),
      contexts: [
        {
          ...context("webgl"),
          unmaskedRenderer: "SwiftShader",
          softwareRenderer: true,
        },
        { api: "webgl2", available: false },
      ],
    })
    render(<GpuInformationClient messages={messages} />)
    expect(screen.getByText(messages.softwareTitle)).toBeTruthy()
    fireEvent.mouseDown(screen.getByRole("tab", { name: "WebGL 2" }), {
      button: 0,
      ctrlKey: false,
    })
    expect(screen.getByText(messages.unavailableTitle)).toBeTruthy()
    expect(screen.queryByText(messages.softwareTitle)).toBeNull()
    expect(screen.getAllByText(messages.notReported)).toHaveLength(2)
  })

  it("handles browsers where neither API can create a context", () => {
    vi.mocked(captureGpuReport).mockReturnValue({
      ...report(),
      contexts: [
        { api: "webgl", available: false },
        { api: "webgl2", available: false },
      ],
    })
    render(<GpuInformationClient messages={messages} />)
    expect(screen.getByText(messages.unavailableDescription)).toBeTruthy()
    expect(screen.queryByRole("searchbox")).toBeNull()
  })
})
