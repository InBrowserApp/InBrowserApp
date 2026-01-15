import type { ToolRoute } from '@shared/tools'
import { routes as faviconAssetsGeneratorRoutes } from '@tools/favicon-assets-generator/routes'
import { routes as uuidRoutes } from '@tools/uuid/routes'
import { routes as removePDFOwnerPasswordRoutes } from '@tools/remove-pdf-owner-password/routes'
import { routes as unicodePunycodeConverterRoutes } from '@tools/unicode-punycode-converter/routes'
import { routes as dnsLookupRoutes } from '@tools/dns-lookup/routes'
import { routes as reverseIPLookupRoutes } from '@tools/reverse-ip-lookup/routes'
import { routes as myIPAddressRoutes } from '@tools/my-ip-address/routes'
import { routes as ipInfoLookupRoutes } from '@tools/ip-info-lookup/routes'
import { routes as cidrParserRoutes } from '@tools/cidr-parser/routes'
import { routes as cidrsMergerExcluderRoutes } from '@tools/cidrs-merger-excluder/routes'
import { routes as ipRangeToCIDRRoutes } from '@tools/ip-range-to-cidr/routes'
import { routes as ipCidrNormalizerRoutes } from '@tools/ip-cidr-normalizer/routes'
import { routes as macToIPv6LinkLocalRoutes } from '@tools/mac-to-ipv6-link-local/routes'
import { routes as ipv6ToMacRoutes } from '@tools/ipv6-to-mac/routes'
import { routes as currentNetworkTimeRoutes } from '@tools/current-network-time/routes'
import { routes as pngOptimizerRoutes } from '@tools/png-optimizer/routes'
import { routes as exifViewerRoutes } from '@tools/exif-viewer/routes'
import { routes as networkToolsRoutes } from '@tools/network-tools/routes'
import { routes as pdfToolsRoutes } from '@tools/pdf-tools/routes'
import { routes as imageToolsRoutes } from '@tools/image-tools/routes'
import { routes as sha256HashTextOrFileRoutes } from '@tools/sha256-hash-text-or-file/routes'
import { routes as sha384HashTextOrFileRoutes } from '@tools/sha384-hash-text-or-file/routes'
import { routes as sha512HashTextOrFileRoutes } from '@tools/sha512-hash-text-or-file/routes'
import { routes as sha1HashTextOrFileRoutes } from '@tools/sha1-hash-text-or-file/routes'
import { routes as md5HashTextOrFileRoutes } from '@tools/md5-hash-text-or-file/routes'
import { routes as ripemd160HashTextOrFileRoutes } from '@tools/ripemd160-hash-text-or-file/routes'
import { routes as keccakHashTextOrFileRoutes } from '@tools/keccak-hash-text-or-file/routes'
import { routes as bcryptHashPasswordRoutes } from '@tools/bcrypt-hash-password/routes'
import { routes as bcryptHashPasswordVerifierRoutes } from '@tools/bcrypt-hash-password-verifier/routes'
import { routes as hashToolsRoutes } from '@tools/hash-tools/routes'
import { routes as sriHashGeneratorRoutes } from '@tools/sri-hash-generator/routes'
import { routes as crcChecksumCalculatorRoutes } from '@tools/crc-checksum-calculator/routes'
import { routes as xxhashXxh32HashTextOrFileRoutes } from '@tools/xxhash-xxh32-hash-text-or-file/routes'
import { routes as xxhashXxh64HashTextOrFileRoutes } from '@tools/xxhash-xxh64-hash-text-or-file/routes'
import { routes as blake2bHashTextOrFileRoutes } from '@tools/blake2b-hash-text-or-file/routes'
import { routes as blake2sHashTextOrFileRoutes } from '@tools/blake2s-hash-text-or-file/routes'
import { routes as hmacGeneratorRoutes } from '@tools/hmac-generator/routes'
import { routes as urlComponentEncoderDecoderRoutes } from '@tools/url-component-encoder-decoder/routes'
import { routes as base64EncoderDecoderRoutes } from '@tools/base64-encoder-decoder/routes'
import { routes as fileToDataUriConverterRoutes } from '@tools/file-to-data-uri-converter/routes'
import { routes as dataUriToFileConverterRoutes } from '@tools/data-uri-to-file-converter/routes'
import { routes as urlParserBuilderRoutes } from '@tools/url-parser-builder/routes'
import { routes as userAgentParserRoutes } from '@tools/user-agent-parser/routes'
import { routes as basicAuthGeneratorRoutes } from '@tools/basic-auth-generator/routes'
import { routes as basicAuthDecoderRoutes } from '@tools/basic-auth-decoder/routes'
import { routes as jwtSignerRoutes } from '@tools/jwt-signer/routes'
import { routes as jwtDecoderVerifierRoutes } from '@tools/jwt-decoder-verifier/routes'
import { routes as randomPasswordGeneratorRoutes } from '@tools/random-password-generator/routes'
import { routes as bip39MnemonicGeneratorRoutes } from '@tools/bip39-mnemonic-generator/routes'
import { routes as qrCodeGeneratorRoutes } from '@tools/qr-code-generator/routes'
import { routes as qrCodeReaderRoutes } from '@tools/qr-code-reader/routes'
import { routes as barcodeGeneratorRoutes } from '@tools/barcode-generator/routes'
import { routes as markdownToHtmlConverterRoutes } from '@tools/markdown-to-html-converter/routes'
import { routes as htmlToMarkdownConverterRoutes } from '@tools/html-to-markdown-converter/routes'
import { routes as jsonToYamlBuilderRoutes } from '@tools/json-to-yaml-converter/routes'
import { routes as yamlToJsonConverterRoutes } from '@tools/yaml-to-json-converter/routes'
import { routes as jsonToTomlConverterRoutes } from '@tools/json-to-toml-converter/routes'
import { routes as tomlToJsonConverterRoutes } from '@tools/toml-to-json-converter/routes'
import { routes as yamlToTomlConverterRoutes } from '@tools/yaml-to-toml-converter/routes'
import { routes as tomlToYamlConverterRoutes } from '@tools/toml-to-yaml-converter/routes'
import { routes as xmlToJsonConverterRoutes } from '@tools/xml-to-json-converter/routes'
import { routes as jsonToXmlConverterRoutes } from '@tools/json-to-xml-converter/routes'
import { routes as csvToJsonConverterRoutes } from '@tools/csv-to-json-converter/routes'
import { routes as jsonToCsvConverterRoutes } from '@tools/json-to-csv-converter/routes'
import { routes as jsonFormatterRoutes } from '@tools/json-formatter/routes'
import { routes as jsonSchemaValidatorRoutes } from '@tools/json-schema-validator/routes'
import { routes as openApiToTypescriptRoutes } from '@tools/openapi-to-typescript/routes'
import { routes as passwordStrengthCheckerRoutes } from '@tools/password-strength-checker/routes'
import { routes as prettierCodeFormatterRoutes } from '@tools/prettier-code-formatter/routes'
import { routes as deviceInformationRoutes } from '@tools/device-information/routes'
import { routes as romanNumeralConverterRoutes } from '@tools/roman-numeral-converter/routes'
import { routes as stopwatchRoutes } from '@tools/stopwatch/routes'
import { routes as unixTimestampConverterRoutes } from '@tools/unix-timestamp-converter/routes'
import { routes as timeZoneConverterRoutes } from '@tools/time-zone-converter/routes'
import { routes as timeDiffCalculatorRoutes } from '@tools/time-diff-calculator/routes'
import { routes as durationCalculatorRoutes } from '@tools/duration-calculator/routes'
import { routes as businessDaysCalculatorRoutes } from '@tools/business-days-calculator/routes'
import { routes as cronExpressionParserRoutes } from '@tools/cron-expression-parser/routes'
import { routes as cronExpressionGeneratorRoutes } from '@tools/cron-expression-generator/routes'
import { routes as textDiffRoutes } from '@tools/text-diff/routes'
import { routes as colorConverterRoutes } from '@tools/color-converter/routes'
import { routes as caseConverterRoutes } from '@tools/case-converter/routes'
import { routes as numberBaseConverterRoutes } from '@tools/number-base-converter/routes'
import { routes as unicodeEscapeUnescapeRoutes } from '@tools/unicode-escape-unescape/routes'
import { routes as morseCodeConverterRoutes } from '@tools/morse-code-converter/routes'
import { routes as rotCipherRoutes } from '@tools/rot-cipher/routes'
import { routes as htmlEntityEncoderDecoderRoutes } from '@tools/html-entity-encoder-decoder/routes'
import { routes as chmodCalculatorRoutes } from '@tools/chmod-calculator/routes'
import { routes as asciiArtGeneratorRoutes } from '@tools/ascii-art-generator/routes'
import { routes as aesEncryptorRoutes } from '@tools/aes-encryptor/routes'
import { routes as aesDecryptorRoutes } from '@tools/aes-decryptor/routes'
import { routes as portNumberLookupRoutes } from '@tools/port-number-lookup/routes'
import { routes as httpStatusCodeLookupRoutes } from '@tools/http-status-code-lookup/routes'
import { routes as mimeTypeLookupRoutes } from '@tools/mime-type-lookup/routes'
import { routes as textStatisticsRoutes } from '@tools/text-statistics/routes'
import { routes as regexTesterReplacerRoutes } from '@tools/regex-tester-replacer/routes'
import { routes as loremIpsumGeneratorRoutes } from '@tools/lorem-ipsum-generator/routes'
import { routes as gitignoreGeneratorRoutes } from '@tools/gitignore-generator/routes'
import { routes as creditCardValidatorRoutes } from '@tools/credit-card-validator/routes'
import { routes as isbnValidatorRoutes } from '@tools/isbn-validator/routes'
import { routes as ibanValidatorRoutes } from '@tools/iban-validator/routes'
import { routes as bicSwiftValidatorRoutes } from '@tools/bic-swift-validator/routes'
import { routes as placeholderImageGeneratorRoutes } from '@tools/placeholder-image-generator/routes'
import { routes as slugGeneratorRoutes } from '@tools/slug-generator/routes'
import { routes as sshKeyGeneratorRoutes } from '@tools/ssh-key-generator/routes'
import { routes as certificatePublicKeyParserRoutes } from '@tools/certificate-public-key-parser/routes'
import { routes as htmlColorNamesRoutes } from '@tools/html-color-names/routes'
import { routes as svgOptimizerRoutes } from '@tools/svg-optimizer/routes'

export const routes: ToolRoute[] = [
  ...faviconAssetsGeneratorRoutes,
  ...uuidRoutes,
  ...removePDFOwnerPasswordRoutes,
  ...unicodePunycodeConverterRoutes,
  ...dnsLookupRoutes,
  ...reverseIPLookupRoutes,
  ...myIPAddressRoutes,
  ...ipInfoLookupRoutes,
  ...cidrParserRoutes,
  ...cidrsMergerExcluderRoutes,
  ...ipRangeToCIDRRoutes,
  ...ipCidrNormalizerRoutes,
  ...macToIPv6LinkLocalRoutes,
  ...ipv6ToMacRoutes,
  ...currentNetworkTimeRoutes,
  ...pngOptimizerRoutes,
  ...svgOptimizerRoutes,
  ...exifViewerRoutes,
  ...networkToolsRoutes,
  ...pdfToolsRoutes,
  ...imageToolsRoutes,
  ...sha256HashTextOrFileRoutes,
  ...sha384HashTextOrFileRoutes,
  ...sha512HashTextOrFileRoutes,
  ...sha1HashTextOrFileRoutes,
  ...md5HashTextOrFileRoutes,
  ...ripemd160HashTextOrFileRoutes,
  ...keccakHashTextOrFileRoutes,
  ...bcryptHashPasswordRoutes,
  ...bcryptHashPasswordVerifierRoutes,
  ...hashToolsRoutes,
  ...sriHashGeneratorRoutes,
  ...crcChecksumCalculatorRoutes,
  ...xxhashXxh32HashTextOrFileRoutes,
  ...xxhashXxh64HashTextOrFileRoutes,
  ...blake2bHashTextOrFileRoutes,
  ...blake2sHashTextOrFileRoutes,
  ...hmacGeneratorRoutes,
  ...urlComponentEncoderDecoderRoutes,
  ...base64EncoderDecoderRoutes,
  ...fileToDataUriConverterRoutes,
  ...dataUriToFileConverterRoutes,
  ...urlParserBuilderRoutes,
  ...userAgentParserRoutes,
  ...basicAuthGeneratorRoutes,
  ...basicAuthDecoderRoutes,
  ...jwtSignerRoutes,
  ...jwtDecoderVerifierRoutes,
  ...randomPasswordGeneratorRoutes,
  ...bip39MnemonicGeneratorRoutes,
  ...qrCodeGeneratorRoutes,
  ...qrCodeReaderRoutes,
  ...barcodeGeneratorRoutes,
  ...markdownToHtmlConverterRoutes,
  ...htmlToMarkdownConverterRoutes,
  ...jsonToYamlBuilderRoutes,
  ...yamlToJsonConverterRoutes,
  ...jsonToTomlConverterRoutes,
  ...tomlToJsonConverterRoutes,
  ...yamlToTomlConverterRoutes,
  ...tomlToYamlConverterRoutes,
  ...xmlToJsonConverterRoutes,
  ...jsonToXmlConverterRoutes,
  ...csvToJsonConverterRoutes,
  ...jsonToCsvConverterRoutes,
  ...jsonFormatterRoutes,
  ...jsonSchemaValidatorRoutes,
  ...openApiToTypescriptRoutes,
  ...prettierCodeFormatterRoutes,
  ...passwordStrengthCheckerRoutes,
  ...deviceInformationRoutes,
  ...romanNumeralConverterRoutes,
  ...stopwatchRoutes,
  ...unixTimestampConverterRoutes,
  ...timeZoneConverterRoutes,
  ...timeDiffCalculatorRoutes,
  ...durationCalculatorRoutes,
  ...businessDaysCalculatorRoutes,
  ...cronExpressionParserRoutes,
  ...cronExpressionGeneratorRoutes,
  ...textDiffRoutes,
  ...colorConverterRoutes,
  ...caseConverterRoutes,
  ...numberBaseConverterRoutes,
  ...unicodeEscapeUnescapeRoutes,
  ...morseCodeConverterRoutes,
  ...rotCipherRoutes,
  ...htmlEntityEncoderDecoderRoutes,
  ...chmodCalculatorRoutes,
  ...asciiArtGeneratorRoutes,
  ...aesEncryptorRoutes,
  ...aesDecryptorRoutes,
  ...portNumberLookupRoutes,
  ...httpStatusCodeLookupRoutes,
  ...mimeTypeLookupRoutes,
  ...textStatisticsRoutes,
  ...regexTesterReplacerRoutes,
  ...loremIpsumGeneratorRoutes,
  ...gitignoreGeneratorRoutes,
  ...creditCardValidatorRoutes,
  ...isbnValidatorRoutes,
  ...ibanValidatorRoutes,
  ...bicSwiftValidatorRoutes,
  ...placeholderImageGeneratorRoutes,
  ...slugGeneratorRoutes,
  ...certificatePublicKeyParserRoutes,
  ...sshKeyGeneratorRoutes,
  ...htmlColorNamesRoutes,
]
