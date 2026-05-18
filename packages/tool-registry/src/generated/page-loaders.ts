import type { AstroComponentFactory } from "astro/runtime/server/index.js"

type ToolPageModule = { default: AstroComponentFactory }
type ToolPageLoader = () => Promise<ToolPageModule>

export const toolPageLoaders: Readonly<Record<string, ToolPageLoader>> = {
  "adler32-hash-text-or-file": () =>
    import("@tool/adler32-hash-text-or-file/page"),
  "aes-decryptor": () => import("@tool/aes-decryptor/page"),
  "aes-encryptor": () => import("@tool/aes-encryptor/page"),
  "argon2-hash-password": () => import("@tool/argon2-hash-password/page"),
  "argon2-hash-password-verifier": () =>
    import("@tool/argon2-hash-password-verifier/page"),
  "ascii-art-generator": () => import("@tool/ascii-art-generator/page"),
  "barcode-generator": () => import("@tool/barcode-generator/page"),
  "barcode-reader": () => import("@tool/barcode-reader/page"),
  "base16-decoder": () => import("@tool/base16-decoder/page"),
  "base16-encoder": () => import("@tool/base16-encoder/page"),
  "base32-decoder": () => import("@tool/base32-decoder/page"),
  "base32-encoder": () => import("@tool/base32-encoder/page"),
  "base58-decoder": () => import("@tool/base58-decoder/page"),
  "base58-encoder": () => import("@tool/base58-encoder/page"),
  "base64-encoder-decoder": () => import("@tool/base64-encoder-decoder/page"),
  "base85-decoder": () => import("@tool/base85-decoder/page"),
  "base85-encoder": () => import("@tool/base85-encoder/page"),
  "basic-auth-decoder": () => import("@tool/basic-auth-decoder/page"),
  "basic-auth-generator": () => import("@tool/basic-auth-generator/page"),
  "bcrypt-hash-password": () => import("@tool/bcrypt-hash-password/page"),
  "bcrypt-hash-password-verifier": () =>
    import("@tool/bcrypt-hash-password-verifier/page"),
  "bic-swift-validator": () => import("@tool/bic-swift-validator/page"),
  "bip39-mnemonic-generator": () =>
    import("@tool/bip39-mnemonic-generator/page"),
  "blake2b-hash-text-or-file": () =>
    import("@tool/blake2b-hash-text-or-file/page"),
  "blake2s-hash-text-or-file": () =>
    import("@tool/blake2s-hash-text-or-file/page"),
  "blake3-hash-text-or-file": () =>
    import("@tool/blake3-hash-text-or-file/page"),
  "business-days-calculator": () =>
    import("@tool/business-days-calculator/page"),
  camera: () => import("@tool/camera/page"),
  "case-converter": () => import("@tool/case-converter/page"),
  "certificate-public-key-parser": () =>
    import("@tool/certificate-public-key-parser/page"),
  "chinese-uppercase-number-converter": () =>
    import("@tool/chinese-uppercase-number-converter/page"),
  "chmod-calculator": () => import("@tool/chmod-calculator/page"),
  "cidr-parser": () => import("@tool/cidr-parser/page"),
  "cidrs-merger-excluder": () => import("@tool/cidrs-merger-excluder/page"),
  "cityhash64-hash-text-or-file": () =>
    import("@tool/cityhash64-hash-text-or-file/page"),
  "code-screenshot-generator": () =>
    import("@tool/code-screenshot-generator/page"),
  "color-contrast-checker": () => import("@tool/color-contrast-checker/page"),
  "color-converter": () => import("@tool/color-converter/page"),
  "color-picker": () => import("@tool/color-picker/page"),
  "cookie-parser": () => import("@tool/cookie-parser/page"),
  "crc-checksum-calculator": () => import("@tool/crc-checksum-calculator/page"),
  "credit-card-validator": () => import("@tool/credit-card-validator/page"),
  "cron-expression-generator": () =>
    import("@tool/cron-expression-generator/page"),
  "cron-expression-parser": () => import("@tool/cron-expression-parser/page"),
  "css-box-shadow-generator": () =>
    import("@tool/css-box-shadow-generator/page"),
  "css-gradient-generator": () => import("@tool/css-gradient-generator/page"),
  "csv-to-json-converter": () => import("@tool/csv-to-json-converter/page"),
  "cuid2-generator": () => import("@tool/cuid2-generator/page"),
  "curl-converter": () => import("@tool/curl-converter/page"),
  "current-network-time": () => import("@tool/current-network-time/page"),
  "data-uri-to-file-converter": () =>
    import("@tool/data-uri-to-file-converter/page"),
  "device-information": () => import("@tool/device-information/page"),
  "dns-lookup": () => import("@tool/dns-lookup/page"),
  "docker-run-to-compose-converter": () =>
    import("@tool/docker-run-to-compose-converter/page"),
  "duration-calculator": () => import("@tool/duration-calculator/page"),
  "email-validator": () => import("@tool/email-validator/page"),
  "eu-vat-number-validator": () => import("@tool/eu-vat-number-validator/page"),
  "exif-viewer": () => import("@tool/exif-viewer/page"),
  "file-to-data-uri-converter": () =>
    import("@tool/file-to-data-uri-converter/page"),
  "gif-to-apng-converter": () => import("@tool/gif-to-apng-converter/page"),
  "gitignore-generator": () => import("@tool/gitignore-generator/page"),
  "highwayhash-hash-text-or-file": () =>
    import("@tool/highwayhash-hash-text-or-file/page"),
  "hmac-generator": () => import("@tool/hmac-generator/page"),
  "html-color-names": () => import("@tool/html-color-names/page"),
  "html-entity-encoder-decoder": () =>
    import("@tool/html-entity-encoder-decoder/page"),
  "html-to-markdown-converter": () =>
    import("@tool/html-to-markdown-converter/page"),
  "http-status-code-lookup": () => import("@tool/http-status-code-lookup/page"),
  "iban-validator": () => import("@tool/iban-validator/page"),
  "ical-event-generator": () => import("@tool/ical-event-generator/page"),
  "image-metadata-cleaner": () => import("@tool/image-metadata-cleaner/page"),
  "image-palette-extractor": () => import("@tool/image-palette-extractor/page"),
  "image-resizer": () => import("@tool/image-resizer/page"),
  "image-to-avif-converter": () => import("@tool/image-to-avif-converter/page"),
  "image-to-ico": () => import("@tool/image-to-ico/page"),
  "image-to-webp-converter": () => import("@tool/image-to-webp-converter/page"),
  "imei-validator": () => import("@tool/imei-validator/page"),
  "ip-cidr-normalizer": () => import("@tool/ip-cidr-normalizer/page"),
  "ip-info-lookup": () => import("@tool/ip-info-lookup/page"),
  "ip-range-to-cidr-converter": () =>
    import("@tool/ip-range-to-cidr-converter/page"),
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
  "jwk-pem-converter": () => import("@tool/jwk-pem-converter/page"),
  "jwt-decoder-verifier": () => import("@tool/jwt-decoder-verifier/page"),
  "jwt-signer": () => import("@tool/jwt-signer/page"),
  "keccak-hash-text-or-file": () =>
    import("@tool/keccak-hash-text-or-file/page"),
  "ksuid-generator": () => import("@tool/ksuid-generator/page"),
  "list-comparer": () => import("@tool/list-comparer/page"),
  "local-font-book": () => import("@tool/local-font-book/page"),
  "lorem-ipsum-generator": () => import("@tool/lorem-ipsum-generator/page"),
  "mac-address-to-ipv6-link-local-address-converter": () =>
    import("@tool/mac-address-to-ipv6-link-local-address-converter/page"),
  "markdown-previewer": () => import("@tool/markdown-previewer/page"),
  "markdown-to-html-converter": () =>
    import("@tool/markdown-to-html-converter/page"),
  "md4-hash-text-or-file": () => import("@tool/md4-hash-text-or-file/page"),
  "md5-hash-text-or-file": () => import("@tool/md5-hash-text-or-file/page"),
  "mime-type-lookup": () => import("@tool/mime-type-lookup/page"),
  "morse-code-converter": () => import("@tool/morse-code-converter/page"),
  "murmurhash3-x64-128-hash-text-or-file": () =>
    import("@tool/murmurhash3-x64-128-hash-text-or-file/page"),
  "murmurhash3-x86-128-hash-text-or-file": () =>
    import("@tool/murmurhash3-x86-128-hash-text-or-file/page"),
  "murmurhash3-x86-32-hash-text-or-file": () =>
    import("@tool/murmurhash3-x86-32-hash-text-or-file/page"),
  "my-ip-address": () => import("@tool/my-ip-address/page"),
  "nanoid-generator": () => import("@tool/nanoid-generator/page"),
  "number-base-converter": () => import("@tool/number-base-converter/page"),
  "openapi-to-typescript-converter": () =>
    import("@tool/openapi-to-typescript-converter/page"),
  "password-strength-checker": () =>
    import("@tool/password-strength-checker/page"),
  "pbkdf2-key-derivation": () => import("@tool/pbkdf2-key-derivation/page"),
  "pdf-info-viewer": () => import("@tool/pdf-info-viewer/page"),
  "pgp-key-generator": () => import("@tool/pgp-key-generator/page"),
  "placeholder-image-generator": () =>
    import("@tool/placeholder-image-generator/page"),
  "png-optimizer": () => import("@tool/png-optimizer/page"),
  "port-number-lookup": () => import("@tool/port-number-lookup/page"),
  "prc-id-validator": () => import("@tool/prc-id-validator/page"),
  "prettier-code-formatter": () => import("@tool/prettier-code-formatter/page"),
  "qr-code-generator": () => import("@tool/qr-code-generator/page"),
  "qr-code-reader": () => import("@tool/qr-code-reader/page"),
  "radio-timecode": () => import("@tool/radio-timecode/page"),
  "random-number-generator": () => import("@tool/random-number-generator/page"),
  "random-password-generator": () =>
    import("@tool/random-password-generator/page"),
  "regex-tester-replacer": () => import("@tool/regex-tester-replacer/page"),
  "reverse-ip-lookup": () => import("@tool/reverse-ip-lookup/page"),
  "ripemd128-hash-text-or-file": () =>
    import("@tool/ripemd128-hash-text-or-file/page"),
  "ripemd160-hash-text-or-file": () =>
    import("@tool/ripemd160-hash-text-or-file/page"),
  "ripemd256-hash-text-or-file": () =>
    import("@tool/ripemd256-hash-text-or-file/page"),
  "ripemd320-hash-text-or-file": () =>
    import("@tool/ripemd320-hash-text-or-file/page"),
  "robots-txt-generator": () => import("@tool/robots-txt-generator/page"),
  "roman-numeral-converter": () => import("@tool/roman-numeral-converter/page"),
  "rot-cipher": () => import("@tool/rot-cipher/page"),
  "screen-recorder": () => import("@tool/screen-recorder/page"),
  "scrypt-key-derivation": () => import("@tool/scrypt-key-derivation/page"),
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
  "sha512-224-hash-text-or-file": () =>
    import("@tool/sha512-224-hash-text-or-file/page"),
  "sha512-256-hash-text-or-file": () =>
    import("@tool/sha512-256-hash-text-or-file/page"),
  "sha512-hash-text-or-file": () =>
    import("@tool/sha512-hash-text-or-file/page"),
  "shake128-hash-text-or-file": () =>
    import("@tool/shake128-hash-text-or-file/page"),
  "shake256-hash-text-or-file": () =>
    import("@tool/shake256-hash-text-or-file/page"),
  "siphash-128-2-4-hash-text-or-file": () =>
    import("@tool/siphash-128-2-4-hash-text-or-file/page"),
  "siphash-2-4-hash-text-or-file": () =>
    import("@tool/siphash-2-4-hash-text-or-file/page"),
  "sitemap-xml-generator": () => import("@tool/sitemap-xml-generator/page"),
  "slug-generator": () => import("@tool/slug-generator/page"),
  "sm3-hash-text-or-file": () => import("@tool/sm3-hash-text-or-file/page"),
  "sql-formatter-and-linter": () =>
    import("@tool/sql-formatter-and-linter/page"),
  "sri-hash-generator": () => import("@tool/sri-hash-generator/page"),
  "ssh-key-generator": () => import("@tool/ssh-key-generator/page"),
  "ssh-public-key-fingerprint": () =>
    import("@tool/ssh-public-key-fingerprint/page"),
  stopwatch: () => import("@tool/stopwatch/page"),
  "svg-optimizer": () => import("@tool/svg-optimizer/page"),
  "svg-to-image-converter": () => import("@tool/svg-to-image-converter/page"),
  "text-diff": () => import("@tool/text-diff/page"),
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
  "url-parser-builder": () => import("@tool/url-parser-builder/page"),
  "user-agent-parser": () => import("@tool/user-agent-parser/page"),
  "vin-validator": () => import("@tool/vin-validator/page"),
  "whirlpool-hash-text-or-file": () =>
    import("@tool/whirlpool-hash-text-or-file/page"),
  "xml-to-json-converter": () => import("@tool/xml-to-json-converter/page"),
  "xxhash-xxh3-128-hash-text-or-file": () =>
    import("@tool/xxhash-xxh3-128-hash-text-or-file/page"),
  "xxhash-xxh3-64-hash-text-or-file": () =>
    import("@tool/xxhash-xxh3-64-hash-text-or-file/page"),
  "xxhash-xxh32-hash-text-or-file": () =>
    import("@tool/xxhash-xxh32-hash-text-or-file/page"),
  "xxhash-xxh64-hash-text-or-file": () =>
    import("@tool/xxhash-xxh64-hash-text-or-file/page"),
  "yaml-to-json-converter": () => import("@tool/yaml-to-json-converter/page"),
  "yaml-to-toml-converter": () => import("@tool/yaml-to-toml-converter/page"),
}
