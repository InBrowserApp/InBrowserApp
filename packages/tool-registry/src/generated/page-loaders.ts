import type { AstroComponentFactory } from "astro/runtime/server/index.js"

type ToolPageModule = { default: AstroComponentFactory }
type ToolPageLoader = () => Promise<ToolPageModule>

export const toolPageLoaders: Readonly<Record<string, ToolPageLoader>> = {
  "base64-encoder-decoder": () => import("@tool/base64-encoder-decoder/page"),
  "csv-to-json-converter": () => import("@tool/csv-to-json-converter/page"),
  "current-network-time": () => import("@tool/current-network-time/page"),
  "docker-run-to-compose-converter": () =>
    import("@tool/docker-run-to-compose-converter/page"),
  "gitignore-generator": () => import("@tool/gitignore-generator/page"),
  "image-resizer": () => import("@tool/image-resizer/page"),
  "isbn-validator": () => import("@tool/isbn-validator/page"),
  "jmespath-tester": () => import("@tool/jmespath-tester/page"),
  "json-diff-path": () => import("@tool/json-diff-path/page"),
  "json-formatter": () => import("@tool/json-formatter/page"),
  "json-schema-validator": () => import("@tool/json-schema-validator/page"),
  "json-to-csv-converter": () => import("@tool/json-to-csv-converter/page"),
  "json-to-toml-converter": () => import("@tool/json-to-toml-converter/page"),
  "json-to-xml-converter": () => import("@tool/json-to-xml-converter/page"),
  "json-to-yaml-converter": () => import("@tool/json-to-yaml-converter/page"),
  "jsonpath-tester": () => import("@tool/jsonpath-tester/page"),
  "nanoid-generator": () => import("@tool/nanoid-generator/page"),
  "openapi-to-typescript-converter": () =>
    import("@tool/openapi-to-typescript-converter/page"),
  "prettier-code-formatter": () => import("@tool/prettier-code-formatter/page"),
  "rot-cipher": () => import("@tool/rot-cipher/page"),
  "sha1-hash-text-or-file": () => import("@tool/sha1-hash-text-or-file/page"),
  "sha256-hash-text-or-file": () =>
    import("@tool/sha256-hash-text-or-file/page"),
  "sha384-hash-text-or-file": () =>
    import("@tool/sha384-hash-text-or-file/page"),
  "sha512-hash-text-or-file": () =>
    import("@tool/sha512-hash-text-or-file/page"),
  "sql-formatter-and-linter": () =>
    import("@tool/sql-formatter-and-linter/page"),
  "text-statistics": () => import("@tool/text-statistics/page"),
  "toml-to-json-converter": () => import("@tool/toml-to-json-converter/page"),
  "toml-to-yaml-converter": () => import("@tool/toml-to-yaml-converter/page"),
  "unicode-invisible-character-checker": () =>
    import("@tool/unicode-invisible-character-checker/page"),
  "url-component-encoder-decoder": () =>
    import("@tool/url-component-encoder-decoder/page"),
  "xml-to-json-converter": () => import("@tool/xml-to-json-converter/page"),
  "yaml-to-json-converter": () => import("@tool/yaml-to-json-converter/page"),
  "yaml-to-toml-converter": () => import("@tool/yaml-to-toml-converter/page"),
}
