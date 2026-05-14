type SvgOptimizerOptions = Readonly<{
  cleanupIds: boolean
  convertColors: boolean
  inlineStyles: boolean
  multipass: boolean
  removeComments: boolean
  removeDimensions: boolean
  removeMetadata: boolean
}>

type SvgoPresetPlugin = Readonly<{
  name: "preset-default"
  params: Readonly<{
    overrides: Record<string, false | Record<string, never>>
  }>
}>

type SvgoConfig = Readonly<{
  multipass: boolean
  plugins: readonly (SvgoPresetPlugin | "removeDimensions")[]
}>

type SvgOptimizationMetrics = Readonly<{
  originalBytes: number
  optimizedBytes: number
  savedBytes: number
  savedPercent: number
}>

const DEFAULT_OPTIONS: SvgOptimizerOptions = {
  cleanupIds: true,
  convertColors: true,
  inlineStyles: false,
  multipass: true,
  removeComments: true,
  removeDimensions: false,
  removeMetadata: true,
}

const SAMPLE_SVG = `<svg width="240" height="160" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <metadata>Created by InBrowser.App sample artwork</metadata>
  <!-- This comment and redundant grouping are safe to remove. -->
  <g id="layer-1" transform="translate(0, 0)">
    <rect x="24" y="24" width="192" height="112" rx="24" fill="#2563ff" />
    <circle cx="84" cy="80" r="28" fill="#ffffff" opacity="0.95" />
    <path d="M128.0000 104.0000 L176.0000 56.0000" stroke="#ffffff" stroke-width="12" stroke-linecap="round" />
  </g>
</svg>`

function normalizeSvgText(svgText: string) {
  return svgText.trim()
}

function isLikelySvgMarkup(svgText: string) {
  const normalized = normalizeSvgText(svgText)

  if (!normalized) {
    return false
  }

  if (normalized.startsWith("<svg")) {
    return /<svg(?:\s|>|\/)/i.test(normalized)
  }

  return normalized.startsWith("<?xml") && /<svg(?:\s|>|\/)/i.test(normalized)
}

function assertSvgMarkup(svgText: string, message: string) {
  const normalized = normalizeSvgText(svgText)

  if (!isLikelySvgMarkup(normalized)) {
    throw new Error(message)
  }

  return normalized
}

function buildSvgoConfig(options: SvgOptimizerOptions): SvgoConfig {
  const overrides: Record<string, false | Record<string, never>> = {}

  if (!options.removeComments) overrides.removeComments = false
  if (!options.removeMetadata) overrides.removeMetadata = false
  if (!options.cleanupIds) overrides.cleanupIds = false
  if (!options.convertColors) overrides.convertColors = false
  overrides.inlineStyles = options.inlineStyles ? {} : false

  const plugins: (SvgoPresetPlugin | "removeDimensions")[] = [
    {
      name: "preset-default",
      params: {
        overrides,
      },
    },
  ]

  if (options.removeDimensions) {
    plugins.push("removeDimensions")
  }

  return {
    multipass: options.multipass,
    plugins,
  }
}

function getByteSize(value: string) {
  return new TextEncoder().encode(value).byteLength
}

function calculateMetrics(
  originalSvg: string,
  optimizedSvg: string
): SvgOptimizationMetrics {
  const originalBytes = getByteSize(originalSvg)
  const optimizedBytes = getByteSize(optimizedSvg)
  const savedBytes = originalBytes - optimizedBytes
  const savedPercent =
    originalBytes === 0 ? 0 : (savedBytes / originalBytes) * 100

  return {
    optimizedBytes,
    originalBytes,
    savedBytes,
    savedPercent,
  }
}

function formatByteSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function deriveOptimizedFileName(fileName: string) {
  const trimmedName = fileName.trim()
  const withoutExtension = trimmedName.replace(/\.svg$/i, "")
  const baseName = withoutExtension || "optimized"

  return `${baseName}.optimized.svg`
}

function createSvgBlob(svgText: string) {
  return new Blob([svgText], { type: "image/svg+xml" })
}

export {
  DEFAULT_OPTIONS,
  SAMPLE_SVG,
  assertSvgMarkup,
  buildSvgoConfig,
  calculateMetrics,
  createSvgBlob,
  deriveOptimizedFileName,
  formatByteSize,
  getByteSize,
  isLikelySvgMarkup,
  normalizeSvgText,
}
export type { SvgOptimizationMetrics, SvgOptimizerOptions }
