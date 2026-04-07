import type { AstroComponentFactory } from "astro/runtime/server/index.js"

type ToolPageModule = { default: AstroComponentFactory }
type ToolPageLoader = () => Promise<ToolPageModule>

export const toolPageLoaders: Readonly<Record<string, ToolPageLoader>> = {
  "base64-encoder-decoder": () => import("@tool/base64-encoder-decoder/page"),
  "image-resizer": () => import("@tool/image-resizer/page"),
  "json-schema-validator": () => import("@tool/json-schema-validator/page"),
}
