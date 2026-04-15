import type { AstroComponentFactory } from "astro/runtime/server/index.js"

type ToolPageModule = { default: AstroComponentFactory }
type ToolPageLoader = () => Promise<ToolPageModule>

export const toolPageLoaders: Readonly<Record<string, ToolPageLoader>> = {
  "adler32-hash-text-or-file": () =>
    import("@tool/adler32-hash-text-or-file/page"),
  "ascii-art-generator": () => import("@tool/ascii-art-generator/page"),
  "barcode-generator": () => import("@tool/barcode-generator/page"),
  "base16-decoder": () => import("@tool/base16-decoder/page"),
  "base64-encoder-decoder": () => import("@tool/base64-encoder-decoder/page"),
  "basic-auth-decoder": () => import("@tool/basic-auth-decoder/page"),
  "basic-auth-generator": () => import("@tool/basic-auth-generator/page"),
  "case-converter": () => import("@tool/case-converter/page"),
  "csv-to-json-converter": () => import("@tool/csv-to-json-converter/page"),
  "cuid2-generator": () => import("@tool/cuid2-generator/page"),
  "current-network-time": () => import("@tool/current-network-time/page"),
  "docker-run-to-compose-converter": () =>
    import("@tool/docker-run-to-compose-converter/page"),
  "duration-calculator": () => import("@tool/duration-calculator/page"),
  "gitignore-generator": () => import("@tool/gitignore-generator/page"),
  "hmac-generator": () => import("@tool/hmac-generator/page"),
  "image-metadata-cleaner": () => import("@tool/image-metadata-cleaner/page"),
  "image-resizer": () => import("@tool/image-resizer/page"),
  "image-to-ico": () => import("@tool/image-to-ico/page"),
  "imei-validator": () => import("@tool/imei-validator/page"),
  "isbn-validator": () => import("@tool/isbn-validator/page"),
  "jmespath-tester": () => import("@tool/jmespath-tester/page"),
  "json-diff-path": () => import("@tool/json-diff-path/page"),
  "json-formatter": () => import("@tool/json-formatter/page"),
  "json-schema-generator": () => import("@tool/json-schema-generator/page"),
  "json-schema-validator": () => import("@tool/json-schema-validator/page"),
  "json-to-csv-converter": () => import("@tool/json-to-csv-converter/page"),
  "json-to-toml-converter": () => import("@tool/json-to-toml-converter/page"),
  "json-to-xml-converter": () => import("@tool/json-to-xml-converter/page"),
  "json-to-yaml-converter": () => import("@tool/json-to-yaml-converter/page"),
  "jsonpath-tester": () => import("@tool/jsonpath-tester/page"),
  "list-comparer": () => import("@tool/list-comparer/page"),
  "nanoid-generator": () => import("@tool/nanoid-generator/page"),
  "openapi-to-typescript-converter": () =>
    import("@tool/openapi-to-typescript-converter/page"),
  "password-strength-checker": () =>
    import("@tool/password-strength-checker/page"),
  "pbkdf2-key-derivation": () => import("@tool/pbkdf2-key-derivation/page"),
  "placeholder-image-generator": () =>
    import("@tool/placeholder-image-generator/page"),
  "port-number-lookup": () => import("@tool/port-number-lookup/page"),
  "prettier-code-formatter": () => import("@tool/prettier-code-formatter/page"),
  "random-number-generator": () => import("@tool/random-number-generator/page"),
  "random-password-generator": () =>
    import("@tool/random-password-generator/page"),
  "regex-tester-replacer": () => import("@tool/regex-tester-replacer/page"),
  "rot-cipher": () => import("@tool/rot-cipher/page"),
  "sha1-hash-text-or-file": () => import("@tool/sha1-hash-text-or-file/page"),
  "sha256-hash-text-or-file": () =>
    import("@tool/sha256-hash-text-or-file/page"),
  "sha384-hash-text-or-file": () =>
    import("@tool/sha384-hash-text-or-file/page"),
  "sha512-hash-text-or-file": () =>
    import("@tool/sha512-hash-text-or-file/page"),
  "slug-generator": () => import("@tool/slug-generator/page"),
  "sql-formatter-and-linter": () =>
    import("@tool/sql-formatter-and-linter/page"),
  "sri-hash-generator": () => import("@tool/sri-hash-generator/page"),
  stopwatch: () => import("@tool/stopwatch/page"),
  "svg-to-image-converter": () => import("@tool/svg-to-image-converter/page"),
  "text-statistics": () => import("@tool/text-statistics/page"),
  "time-zone-converter": () => import("@tool/time-zone-converter/page"),
  "toml-to-json-converter": () => import("@tool/toml-to-json-converter/page"),
  "toml-to-yaml-converter": () => import("@tool/toml-to-yaml-converter/page"),
  "unicode-escape-unescape": () => import("@tool/unicode-escape-unescape/page"),
  "unicode-invisible-character-checker": () =>
    import("@tool/unicode-invisible-character-checker/page"),
  "unicode-punycode-converter": () =>
    import("@tool/unicode-punycode-converter/page"),
  "unix-timestamp-converter": () =>
    import("@tool/unix-timestamp-converter/page"),
  "url-component-encoder-decoder": () =>
    import("@tool/url-component-encoder-decoder/page"),
  "vin-validator": () => import("@tool/vin-validator/page"),
  "xml-to-json-converter": () => import("@tool/xml-to-json-converter/page"),
  "yaml-to-json-converter": () => import("@tool/yaml-to-json-converter/page"),
  "yaml-to-toml-converter": () => import("@tool/yaml-to-toml-converter/page"),
}
