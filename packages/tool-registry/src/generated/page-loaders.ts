import type { AstroComponentFactory } from "astro/runtime/server/index.js"

type ToolPageModule = { default: AstroComponentFactory }
type ToolPageLoader = () => Promise<ToolPageModule>

export const toolPageLoaders: Readonly<Record<string, ToolPageLoader>> = {
  "adler32-hash-text-or-file": () =>
    import("@tool/adler32-hash-text-or-file/page"),
  "ascii-art-generator": () => import("@tool/ascii-art-generator/page"),
  "barcode-generator": () => import("@tool/barcode-generator/page"),
  "base16-decoder": () => import("@tool/base16-decoder/page"),
  "base16-encoder": () => import("@tool/base16-encoder/page"),
  "base32-decoder": () => import("@tool/base32-decoder/page"),
  "base64-encoder-decoder": () => import("@tool/base64-encoder-decoder/page"),
  "basic-auth-decoder": () => import("@tool/basic-auth-decoder/page"),
  "basic-auth-generator": () => import("@tool/basic-auth-generator/page"),
  "bic-swift-validator": () => import("@tool/bic-swift-validator/page"),
  "bip39-mnemonic-generator": () =>
    import("@tool/bip39-mnemonic-generator/page"),
  "blake2b-hash-text-or-file": () =>
    import("@tool/blake2b-hash-text-or-file/page"),
  "blake2s-hash-text-or-file": () =>
    import("@tool/blake2s-hash-text-or-file/page"),
  "case-converter": () => import("@tool/case-converter/page"),
  "credit-card-validator": () => import("@tool/credit-card-validator/page"),
  "csv-to-json-converter": () => import("@tool/csv-to-json-converter/page"),
  "cuid2-generator": () => import("@tool/cuid2-generator/page"),
  "current-network-time": () => import("@tool/current-network-time/page"),
  "docker-run-to-compose-converter": () =>
    import("@tool/docker-run-to-compose-converter/page"),
  "duration-calculator": () => import("@tool/duration-calculator/page"),
  "email-validator": () => import("@tool/email-validator/page"),
  "gitignore-generator": () => import("@tool/gitignore-generator/page"),
  "hmac-generator": () => import("@tool/hmac-generator/page"),
  "html-entity-encoder-decoder": () =>
    import("@tool/html-entity-encoder-decoder/page"),
  "iban-validator": () => import("@tool/iban-validator/page"),
  "image-metadata-cleaner": () => import("@tool/image-metadata-cleaner/page"),
  "image-resizer": () => import("@tool/image-resizer/page"),
  "image-to-ico": () => import("@tool/image-to-ico/page"),
  "imei-validator": () => import("@tool/imei-validator/page"),
  "ipv6-address-to-mac-address-converter": () =>
    import("@tool/ipv6-address-to-mac-address-converter/page"),
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
  "ksuid-generator": () => import("@tool/ksuid-generator/page"),
  "list-comparer": () => import("@tool/list-comparer/page"),
  "lorem-ipsum-generator": () => import("@tool/lorem-ipsum-generator/page"),
  "mac-address-to-ipv6-link-local-address-converter": () =>
    import("@tool/mac-address-to-ipv6-link-local-address-converter/page"),
  "md5-hash-text-or-file": () => import("@tool/md5-hash-text-or-file/page"),
  "morse-code-converter": () => import("@tool/morse-code-converter/page"),
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
  "ripemd160-hash-text-or-file": () =>
    import("@tool/ripemd160-hash-text-or-file/page"),
  "roman-numeral-converter": () => import("@tool/roman-numeral-converter/page"),
  "rot-cipher": () => import("@tool/rot-cipher/page"),
  "sha1-hash-text-or-file": () => import("@tool/sha1-hash-text-or-file/page"),
  "sha224-hash-text-or-file": () =>
    import("@tool/sha224-hash-text-or-file/page"),
  "sha256-hash-text-or-file": () =>
    import("@tool/sha256-hash-text-or-file/page"),
  "sha3-224-hash-text-or-file": () =>
    import("@tool/sha3-224-hash-text-or-file/page"),
  "sha3-256-hash-text-or-file": () =>
    import("@tool/sha3-256-hash-text-or-file/page"),
  "sha3-384-hash-text-or-file": () =>
    import("@tool/sha3-384-hash-text-or-file/page"),
  "sha3-512-hash-text-or-file": () =>
    import("@tool/sha3-512-hash-text-or-file/page"),
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
  "time-diff-calculator": () => import("@tool/time-diff-calculator/page"),
  "time-zone-converter": () => import("@tool/time-zone-converter/page"),
  timer: () => import("@tool/timer/page"),
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
