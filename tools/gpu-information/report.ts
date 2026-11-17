import { COMMON_LIMITS, PRECISION_FORMATS, WEBGL2_LIMITS } from "./parameters"

import type {
  GpuReport,
  GraphicsApi,
  GraphicsContext,
  GraphicsParameter,
  ParameterValue,
  ShaderPrecision,
} from "./types"

function safely<T>(read: () => T, fallback: T): T {
  try {
    return read()
  } catch {
    return fallback
  }
}

function normalizeParameter(value: unknown): ParameterValue {
  if (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  ) {
    return value
  }

  if (
    Array.isArray(value) ||
    (ArrayBuffer.isView(value) && !(value instanceof DataView))
  ) {
    return Array.from(value as ArrayLike<number>)
  }

  return null
}

function readParameter(gl: WebGLRenderingContext, name: string) {
  return safely(() => {
    const token = (gl as unknown as Record<string, number>)[name]
    return token === undefined
      ? null
      : normalizeParameter(gl.getParameter(token))
  }, null)
}

function readString(gl: WebGLRenderingContext, token: number): string | null {
  const value: unknown = safely(() => gl.getParameter(token), null)
  return typeof value === "string" && value.length > 0 ? value : null
}

function readPrecision(gl: WebGLRenderingContext): ShaderPrecision[] {
  return (["vertex", "fragment"] as const).flatMap((stage) =>
    PRECISION_FORMATS.map((format) => {
      const value = safely(
        () =>
          gl.getShaderPrecisionFormat(
            stage === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER,
            gl[format]
          ),
        null
      )

      return {
        stage,
        format,
        rangeMin: value?.rangeMin ?? null,
        rangeMax: value?.rangeMax ?? null,
        precision: value?.precision ?? null,
      }
    })
  )
}

function captureContext(api: GraphicsApi): GraphicsContext {
  let gl: WebGLRenderingContext | null = null

  try {
    const canvas = document.createElement("canvas")
    gl =
      api === "webgl2"
        ? canvas.getContext("webgl2")
        : (canvas.getContext("webgl") ??
          (canvas.getContext(
            "experimental-webgl"
          ) as WebGLRenderingContext | null))

    if (!gl || gl.isContextLost()) {
      return { api, available: false }
    }

    const context = gl
    const debug = safely(
      () => context.getExtension("WEBGL_debug_renderer_info"),
      null
    )
    const unmaskedVendor = debug
      ? readString(gl, debug.UNMASKED_VENDOR_WEBGL)
      : null
    const unmaskedRenderer = debug
      ? readString(gl, debug.UNMASKED_RENDERER_WEBGL)
      : null
    const renderer = readString(gl, gl.RENDERER)
    const names =
      api === "webgl2" ? [...COMMON_LIMITS, ...WEBGL2_LIMITS] : COMMON_LIMITS
    const limits: GraphicsParameter[] = names.map((name) => ({
      name,
      value: readParameter(context, name),
    }))
    const attributes = safely(() => context.getContextAttributes(), null)
    const report: GraphicsContext = {
      api,
      available: true,
      vendor: readString(gl, gl.VENDOR),
      renderer,
      unmaskedVendor,
      unmaskedRenderer,
      version: readString(gl, gl.VERSION),
      shadingLanguage: readString(gl, gl.SHADING_LANGUAGE_VERSION),
      softwareRenderer:
        /swiftshader|llvmpipe|softpipe|software rasterizer|microsoft basic render/i.test(
          unmaskedRenderer ?? renderer ?? ""
        ),
      attributes: Object.entries(attributes ?? {}).map(([name, value]) => ({
        name,
        value: normalizeParameter(value),
      })),
      limits,
      precision: readPrecision(gl),
      extensions: (
        safely(() => context.getSupportedExtensions(), null) ?? []
      ).sort(),
    }

    return gl.isContextLost() ? { api, available: false } : report
  } catch {
    return { api, available: false }
  } finally {
    const context = gl
    safely(
      () => context?.getExtension("WEBGL_lose_context")?.loseContext(),
      undefined
    )
  }
}

function captureGpuReport(): GpuReport {
  return {
    capturedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    contexts: [captureContext("webgl"), captureContext("webgl2")],
  }
}

function serializeTextReport(report: GpuReport): string {
  const lines = [
    `capturedAt: ${report.capturedAt}`,
    `userAgent: ${report.userAgent}`,
  ]

  for (const context of report.contexts) {
    lines.push("", `[${context.api}]`, `available: ${context.available}`)
    if (!context.available) continue

    for (const key of [
      "vendor",
      "renderer",
      "unmaskedVendor",
      "unmaskedRenderer",
      "version",
      "shadingLanguage",
      "softwareRenderer",
    ] as const) {
      lines.push(`${key}: ${context[key] ?? "N/A"}`)
    }
    for (const parameter of [...context.attributes, ...context.limits]) {
      lines.push(`${parameter.name}: ${parameter.value ?? "N/A"}`)
    }
    for (const precision of context.precision) {
      lines.push(
        `${precision.stage}.${precision.format}: rangeMin=${precision.rangeMin ?? "N/A"}, rangeMax=${precision.rangeMax ?? "N/A"}, precision=${precision.precision ?? "N/A"}`
      )
    }
    lines.push(`extensions: ${context.extensions.join(", ")}`)
  }

  return lines.join("\n")
}

export { captureGpuReport, serializeTextReport }
