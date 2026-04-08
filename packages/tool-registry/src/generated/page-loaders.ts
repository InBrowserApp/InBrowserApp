import type { AstroComponentFactory } from "astro/runtime/server/index.js"

type ToolPageModule = { default: AstroComponentFactory }
type ToolPageLoader = () => Promise<ToolPageModule>

export const toolPageLoaders: Readonly<Record<string, ToolPageLoader>> = {
  "base64-encoder-decoder": () => import("@tool/base64-encoder-decoder/page"),
  "csv-to-json-converter": () => import("@tool/csv-to-json-converter/page"),
  "docker-run-to-compose-converter": () =>
    import("@tool/docker-run-to-compose-converter/page"),
  "image-resizer": () => import("@tool/image-resizer/page"),
  "json-formatter": () => import("@tool/json-formatter/page"),
  "json-schema-validator": () => import("@tool/json-schema-validator/page"),
  "json-to-csv-converter": () => import("@tool/json-to-csv-converter/page"),
  "json-to-toml-converter": () => import("@tool/json-to-toml-converter/page"),
  "json-to-xml-converter": () => import("@tool/json-to-xml-converter/page"),
  "json-to-yaml-converter": () => import("@tool/json-to-yaml-converter/page"),
  "toml-to-json-converter": () => import("@tool/toml-to-json-converter/page"),
  "toml-to-yaml-converter": () => import("@tool/toml-to-yaml-converter/page"),
  "xml-to-json-converter": () => import("@tool/xml-to-json-converter/page"),
  "yaml-to-json-converter": () => import("@tool/yaml-to-json-converter/page"),
  "yaml-to-toml-converter": () => import("@tool/yaml-to-toml-converter/page"),
}
