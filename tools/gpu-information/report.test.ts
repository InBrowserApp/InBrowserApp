import { afterEach, describe, expect, it, vi } from "vitest"

import { COMMON_LIMITS, PRECISION_FORMATS, WEBGL2_LIMITS } from "./parameters"
import { captureGpuReport, serializeTextReport } from "./report"

function createContext() {
  const names = [
    "VENDOR",
    "RENDERER",
    "VERSION",
    "SHADING_LANGUAGE_VERSION",
    "VERTEX_SHADER",
    "FRAGMENT_SHADER",
    ...PRECISION_FORMATS,
    ...COMMON_LIMITS,
    ...WEBGL2_LIMITS,
  ]
  const constants = Object.fromEntries(
    names.map((name, index) => [name, index + 1])
  )
  const debug = { UNMASKED_VENDOR_WEBGL: 1001, UNMASKED_RENDERER_WEBGL: 1002 }
  const values = new Map<number, unknown>([
    [constants.VENDOR!, "Browser vendor"],
    [constants.RENDERER!, "WebGL renderer"],
    [constants.VERSION!, "WebGL 2.0"],
    [constants.SHADING_LANGUAGE_VERSION!, "WebGL GLSL ES 3.00"],
    [constants.MAX_TEXTURE_SIZE!, 16384],
    [constants.MAX_VIEWPORT_DIMS!, new Int32Array([16384, 16384])],
    [constants.ALIASED_LINE_WIDTH_RANGE!, [1, 1]],
    [constants.SAMPLES!, 0],
    [debug.UNMASKED_VENDOR_WEBGL, "NVIDIA Corporation"],
    [
      debug.UNMASKED_RENDERER_WEBGL,
      "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070, D3D11)",
    ],
  ])
  const loseContext = vi.fn()
  const gl = {
    ...constants,
    isContextLost: vi.fn(() => false),
    getExtension: vi.fn((name: string) => {
      if (name === "WEBGL_debug_renderer_info") return debug
      if (name === "WEBGL_lose_context") return { loseContext }
      return null
    }),
    getParameter: vi.fn((token: number) => values.get(token)),
    getContextAttributes: vi.fn(() => ({
      alpha: true,
      antialias: false,
      powerPreference: "default",
    })),
    getShaderPrecisionFormat: vi.fn(() => ({
      rangeMin: 127,
      rangeMax: 127,
      precision: 23,
    })),
    getSupportedExtensions: vi.fn((): string[] | null => [
      "OES_texture_float",
      "EXT_color_buffer_float",
    ]),
  }
  return { gl, constants, debug, values, loseContext }
}

function installCanvases(
  contexts: ReturnType<typeof createContext>["gl"][],
  fallback = false
) {
  const canvasInstances: object[] = []
  const createElement = document.createElement.bind(document)
  vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
    if (tagName !== "canvas") return createElement(tagName)
    const context = contexts[canvasInstances.length]
    let mode: string | null = null
    const canvas = {
      getContext: vi.fn((requestedMode: string) => {
        if (!context || (mode && mode !== requestedMode)) return null
        if (fallback && requestedMode === "webgl") return null
        mode = requestedMode
        return context
      }),
    }
    canvasInstances.push(canvas)
    return canvas as unknown as HTMLCanvasElement
  })
  return canvasInstances
}

afterEach(() => vi.restoreAllMocks())

describe("captureGpuReport", () => {
  it("uses independent canvases, serializes typed limits, and releases both contexts", () => {
    const first = createContext()
    const second = createContext()
    const canvases = installCanvases([first.gl, second.gl])
    const report = captureGpuReport()

    expect(canvases).toHaveLength(2)
    expect(report.contexts.map((entry) => entry.available)).toEqual([
      true,
      true,
    ])
    expect(report.capturedAt).toMatch(/^\d{4}-\d\d-/)
    expect(report.userAgent).toBe(navigator.userAgent)
    expect(report.contexts[1]).toMatchObject({
      api: "webgl2",
      vendor: "Browser vendor",
      softwareRenderer: false,
      unmaskedRenderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070, D3D11)",
      limits: expect.arrayContaining([
        { name: "MAX_VIEWPORT_DIMS", value: [16384, 16384] },
        { name: "ALIASED_LINE_WIDTH_RANGE", value: [1, 1] },
        { name: "SAMPLES", value: 0 },
        { name: "MAX_3D_TEXTURE_SIZE", value: null },
      ]),
      attributes: [
        { name: "alpha", value: true },
        { name: "antialias", value: false },
        { name: "powerPreference", value: "default" },
      ],
      extensions: ["EXT_color_buffer_float", "OES_texture_float"],
    })
    expect(first.loseContext).toHaveBeenCalledOnce()
    expect(second.loseContext).toHaveBeenCalledOnce()
    const json = JSON.parse(JSON.stringify(report))
    expect(json.contexts[0].precision).toHaveLength(12)
    expect(
      json.contexts[0].limits.some(
        (entry: { name: string }) => entry.name === "MAX_3D_TEXTURE_SIZE"
      )
    ).toBe(false)
  })

  it("retains working WebGL when optional queries are unavailable or throw", () => {
    const { gl, constants, values } = createContext()
    gl.getExtension.mockImplementation(() => {
      throw new Error("blocked")
    })
    gl.getContextAttributes.mockImplementation(() => {
      throw new Error("blocked")
    })
    gl.getSupportedExtensions.mockReturnValue(null)
    gl.getShaderPrecisionFormat.mockImplementation(() => {
      throw new Error("blocked")
    })
    values.set(constants.VENDOR!, "")
    values.set(constants.RENDERER!, false)
    values.set(constants.MAX_TEXTURE_SIZE!, Number.NaN)
    Reflect.deleteProperty(gl, "MAX_RENDERBUFFER_SIZE")
    const read = gl.getParameter.getMockImplementation()!
    gl.getParameter.mockImplementation((token) => {
      if (token === constants.MAX_CUBE_MAP_TEXTURE_SIZE)
        throw new Error("blocked")
      return read(token)
    })
    installCanvases([gl])
    const report = captureGpuReport()
    expect(report.contexts[0]).toMatchObject({
      available: true,
      vendor: null,
      renderer: null,
      unmaskedRenderer: null,
      unmaskedVendor: null,
      attributes: [],
      extensions: [],
      precision: expect.arrayContaining([
        {
          stage: "vertex",
          format: "HIGH_FLOAT",
          rangeMin: null,
          rangeMax: null,
          precision: null,
        },
      ]),
    })
    expect(report.contexts[1]).toEqual({ api: "webgl2", available: false })
  })

  it("supports legacy context names and recognizes software rendering", () => {
    const { gl, debug, values } = createContext()
    values.set(
      debug.UNMASKED_RENDERER_WEBGL,
      "ANGLE (Google, Vulkan SwiftShader Device)"
    )
    gl.getShaderPrecisionFormat.mockReturnValue(null as never)
    installCanvases([gl], true)
    expect(captureGpuReport().contexts[0]).toMatchObject({
      available: true,
      softwareRenderer: true,
    })
  })

  it("can identify software through the standard renderer without a debug extension", () => {
    const { gl, constants, values } = createContext()
    gl.getExtension.mockReturnValue(null)
    values.set(constants.RENDERER!, "llvmpipe (LLVM)")
    installCanvases([gl])
    expect(captureGpuReport().contexts[0]).toMatchObject({
      available: true,
      softwareRenderer: true,
      unmaskedRenderer: null,
    })
  })

  it.each(["before", "during"])(
    "handles context loss %s collection and still releases resources",
    (when) => {
      const { gl, loseContext } = createContext()
      gl.isContextLost
        .mockReturnValueOnce(when === "before")
        .mockReturnValue(true)
      installCanvases([gl])
      expect(captureGpuReport().contexts[0]).toEqual({
        api: "webgl",
        available: false,
      })
      expect(loseContext).toHaveBeenCalledOnce()
    }
  )

  it("reports blocked canvas access without throwing", () => {
    vi.spyOn(document, "createElement").mockImplementation(() => {
      throw new Error("canvas blocked")
    })
    expect(captureGpuReport().contexts).toEqual([
      { api: "webgl", available: false },
      { api: "webgl2", available: false },
    ])
  })
})

describe("serializeTextReport", () => {
  it("includes both API states, all diagnostic values, shader precision, and extensions", () => {
    const { gl, debug, values } = createContext()
    values.set(debug.UNMASKED_VENDOR_WEBGL, null)
    gl.getShaderPrecisionFormat.mockReturnValue(null as never)
    installCanvases([gl])
    const text = serializeTextReport(captureGpuReport())
    expect(text).toContain("[webgl]\navailable: true")
    expect(text).toContain("[webgl2]\navailable: false")
    expect(text).toContain("unmaskedVendor: N/A")
    expect(text).toContain("MAX_VIEWPORT_DIMS: 16384,16384")
    expect(text).toContain("SAMPLES: 0")
    expect(text).toContain("antialias: false")
    expect(text).toContain(
      "vertex.HIGH_FLOAT: rangeMin=N/A, rangeMax=N/A, precision=N/A"
    )
    expect(text).toContain(
      "extensions: EXT_color_buffer_float, OES_texture_float"
    )
  })
})
