type BrowserBrand = Readonly<{
  brand: string
  version?: string
}>

type BrowserDetectionInput = Readonly<{
  userAgent: string
  brands?: readonly BrowserBrand[]
}>

type CpuArchitectureInput = Readonly<{
  userAgent: string
  architecture?: string
}>

type FormFactorInput = Readonly<{
  explicitFormFactor?: string
  mobile?: boolean
  maxTouchPoints?: number
  viewportWidth?: number
  viewportHeight?: number
}>

type FormFactor = "phone" | "tablet" | "desktop" | "touchDesktop" | "unknown"

type ColorDepth = Readonly<{
  bits: number
  hdr: boolean
}>

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const

function cleanValue(value: string | undefined) {
  const cleaned = value?.trim()
  return cleaned && cleaned.length > 0 ? cleaned : undefined
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return undefined
  }

  if (bytes === 0) {
    return "0 B"
  }

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1
  )
  const value = bytes / 1024 ** exponent
  const fractionDigits = exponent === 0 || value >= 10 ? 0 : 1

  return `${Number(value.toFixed(fractionDigits))} ${BYTE_UNITS[exponent]}`
}

function formatResolution(
  width: number | undefined,
  height: number | undefined
) {
  if (
    width === undefined ||
    height === undefined ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return undefined
  }

  return `${Math.round(width)} x ${Math.round(height)}`
}

function formatTimezone(
  timeZone: string | undefined,
  offsetMinutes: number | undefined
) {
  const cleanedTimeZone = cleanValue(timeZone)

  if (!cleanedTimeZone) {
    return undefined
  }

  if (offsetMinutes === undefined || !Number.isFinite(offsetMinutes)) {
    return cleanedTimeZone
  }

  const sign = offsetMinutes >= 0 ? "+" : "-"
  const absoluteOffset = Math.abs(offsetMinutes)
  const hours = String(Math.floor(absoluteOffset / 60)).padStart(2, "0")
  const minutes = String(Math.round(absoluteOffset % 60)).padStart(2, "0")

  return `${cleanedTimeZone} (UTC${sign}${hours}:${minutes})`
}

function detectBrowser({ userAgent, brands = [] }: BrowserDetectionInput) {
  const normalizedUserAgent = userAgent.toLowerCase()

  if (normalizedUserAgent.includes("edg/")) {
    return "Edge"
  }

  if (
    normalizedUserAgent.includes("opr/") ||
    normalizedUserAgent.includes("opera")
  ) {
    return "Opera"
  }

  if (normalizedUserAgent.includes("firefox/")) {
    return "Firefox"
  }

  if (
    normalizedUserAgent.includes("chrome/") ||
    normalizedUserAgent.includes("crios/")
  ) {
    return "Chrome"
  }

  if (
    normalizedUserAgent.includes("safari/") &&
    !normalizedUserAgent.includes("chrome/")
  ) {
    return "Safari"
  }

  for (const brand of brands) {
    const normalizedBrand = brand.brand.toLowerCase()

    if (normalizedBrand.includes("edge")) {
      return "Edge"
    }

    if (normalizedBrand.includes("opera")) {
      return "Opera"
    }

    if (normalizedBrand.includes("firefox")) {
      return "Firefox"
    }

    if (normalizedBrand.includes("chrome")) {
      return "Chrome"
    }

    if (normalizedBrand.includes("safari")) {
      return "Safari"
    }
  }

  return undefined
}

function detectCpuArchitecture({
  userAgent,
  architecture,
}: CpuArchitectureInput) {
  const explicitArchitecture = cleanValue(architecture)

  if (explicitArchitecture) {
    return explicitArchitecture
  }

  const normalizedUserAgent = userAgent.toLowerCase()

  if (
    normalizedUserAgent.includes("aarch64") ||
    normalizedUserAgent.includes("arm64")
  ) {
    return "ARM64"
  }

  if (/\barm/.test(normalizedUserAgent)) {
    return "ARM"
  }

  if (
    normalizedUserAgent.includes("x86_64") ||
    normalizedUserAgent.includes("x64") ||
    normalizedUserAgent.includes("win64")
  ) {
    return "x86_64"
  }

  if (
    normalizedUserAgent.includes("i686") ||
    normalizedUserAgent.includes("i386") ||
    normalizedUserAgent.includes("x86")
  ) {
    return "x86"
  }

  return undefined
}

function classifyFormFactor({
  explicitFormFactor,
  mobile = false,
  maxTouchPoints = 0,
  viewportWidth = 0,
  viewportHeight = 0,
}: FormFactorInput): FormFactor {
  const cleanedFormFactor = cleanValue(explicitFormFactor)

  if (cleanedFormFactor) {
    return cleanedFormFactor as FormFactor
  }

  const shorterViewportSide = Math.min(viewportWidth, viewportHeight)

  if (mobile) {
    return shorterViewportSide >= 768 ? "tablet" : "phone"
  }

  if (maxTouchPoints > 0 && shorterViewportSide > 0) {
    return shorterViewportSide < 768 ? "tablet" : "touchDesktop"
  }

  if (viewportWidth > 0 || viewportHeight > 0) {
    return "desktop"
  }

  return "unknown"
}

function describeColorDepth(bits: number | undefined): ColorDepth | undefined {
  if (bits === undefined || !Number.isFinite(bits) || bits <= 0) {
    return undefined
  }

  return {
    bits: Math.round(bits),
    hdr: bits > 24,
  }
}

function normalizeConnectionType(
  effectiveType: string | undefined,
  type: string | undefined
) {
  return cleanValue(effectiveType) ?? cleanValue(type)
}

export {
  classifyFormFactor,
  describeColorDepth,
  detectBrowser,
  detectCpuArchitecture,
  formatBytes,
  formatResolution,
  formatTimezone,
  normalizeConnectionType,
}
export type { BrowserBrand, ColorDepth, FormFactor }
