import { assertSvgMarkup, buildSvgoConfig } from "../core/svg-optimizer"

import type { SvgOptimizerOptions } from "../core/svg-optimizer"

async function optimizeSvgMarkup(
  svgText: string,
  options: SvgOptimizerOptions,
  invalidSvgMessage: string
) {
  const source = assertSvgMarkup(svgText, invalidSvgMessage)
  const { optimize } = await import("svgo/browser")
  const result = optimize(
    source,
    buildSvgoConfig(options) as Parameters<typeof optimize>[1]
  )

  return result.data
}

export { optimizeSvgMarkup }
