import { createBackgroundImage, createBlendModeCss } from "./gradient"

import type { ColorFormat, GradientLayer } from "./gradient"

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function createGradientSvgMarkup(
  layers: readonly GradientLayer[],
  format: ColorFormat,
  width: number,
  height: number
) {
  const style = [
    "width:100%;height:100%;",
    "background-image:" + createBackgroundImage(layers, format) + ";",
    "background-repeat:no-repeat;",
    "background-size:cover;",
  ]

  const blendMode = createBlendModeCss(layers)
  if (blendMode) {
    style.push("background-blend-mode:" + blendMode + ";")
  }

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      width +
      '" height="' +
      height +
      '" viewBox="0 0 ' +
      width +
      " " +
      height +
      '">',
    '<foreignObject width="100%" height="100%">',
    '<div xmlns="http://www.w3.org/1999/xhtml" style="' +
      escapeHtml(style.join("")) +
      '"></div>',
    "</foreignObject>",
    "</svg>",
    "",
  ].join("\n")
}

export { createGradientSvgMarkup }
