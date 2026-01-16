import type { ToolInfo, ToolRoute } from '@shared/tools'
export type { ToolInfo, ToolRoute }
import { toolInfo as faviconAssetsGeneratorToolInfo } from '@tools/favicon-assets-generator'
import { tools as uuidTools } from '@tools/uuid'
import { toolInfo as removePDFOwnerPasswordToolInfo } from '@tools/remove-pdf-owner-password'
import { toolInfo as unicodePunycodeConverterToolInfo } from '@tools/unicode-punycode-converter'
import { toolInfo as dnsLookupToolInfo } from '@tools/dns-lookup'
import { toolInfo as reverseIPLookupToolInfo } from '@tools/reverse-ip-lookup'
import { toolInfo as myIPAddressToolInfo } from '@tools/my-ip-address'
import { tools as redirectsTools } from '@tools/redirects'
import { toolInfo as ipInfoLookupToolInfo } from '@tools/ip-info-lookup'
import { toolInfo as cidrParserToolInfo } from '@tools/cidr-parser'
import { toolInfo as cidrsMergerExcluderToolInfo } from '@tools/cidrs-merger-excluder'
import { toolInfo as ipRangeToCIDRToolInfo } from '@tools/ip-range-to-cidr'
import { toolInfo as ipCidrNormalizerToolInfo } from '@tools/ip-cidr-normalizer'
import { toolInfo as macToIPv6LinkLocalToolInfo } from '@tools/mac-to-ipv6-link-local'
import { toolInfo as ipv6ToMacToolInfo } from '@tools/ipv6-to-mac'
import { toolInfo as currentNetworkTimeToolInfo } from '@tools/current-network-time'
import { toolInfo as pngOptimizerToolInfo } from '@tools/png-optimizer'
import { toolInfo as exifViewerToolInfo } from '@tools/exif-viewer'
import { toolInfo as imageMetadataCleanerToolInfo } from '@tools/image-metadata-cleaner'
import { toolInfo as networkToolsToolInfo } from '@tools/network-tools'
import { toolInfo as pdfToolsToolInfo } from '@tools/pdf-tools'
import { toolInfo as imageToolsToolInfo } from '@tools/image-tools'
import { toolInfo as sha256HashTextOrFileToolInfo } from '@tools/sha256-hash-text-or-file'
import { toolInfo as sha384HashTextOrFileToolInfo } from '@tools/sha384-hash-text-or-file'
import { toolInfo as sha512HashTextOrFileToolInfo } from '@tools/sha512-hash-text-or-file'
import { toolInfo as sha1HashTextOrFileToolInfo } from '@tools/sha1-hash-text-or-file'
import { toolInfo as md5HashTextOrFileToolInfo } from '@tools/md5-hash-text-or-file'
import { toolInfo as ripemd160HashTextOrFileToolInfo } from '@tools/ripemd160-hash-text-or-file'
import { toolInfo as keccakHashTextOrFileToolInfo } from '@tools/keccak-hash-text-or-file'
import { toolInfo as bcryptHashPasswordToolInfo } from '@tools/bcrypt-hash-password'
import { toolInfo as bcryptHashPasswordVerifierToolInfo } from '@tools/bcrypt-hash-password-verifier'
import { toolInfo as hashToolsToolInfo } from '@tools/hash-tools'
import { toolInfo as sriHashGeneratorToolInfo } from '@tools/sri-hash-generator'
import { toolInfo as crcChecksumCalculatorToolInfo } from '@tools/crc-checksum-calculator'
import { toolInfo as xxhashXxh32HashTextOrFileToolInfo } from '@tools/xxhash-xxh32-hash-text-or-file'
import { toolInfo as xxhashXxh64HashTextOrFileToolInfo } from '@tools/xxhash-xxh64-hash-text-or-file'
import { toolInfo as blake2bHashTextOrFileToolInfo } from '@tools/blake2b-hash-text-or-file'
import { toolInfo as blake2sHashTextOrFileToolInfo } from '@tools/blake2s-hash-text-or-file'
import { toolInfo as hmacGeneratorToolInfo } from '@tools/hmac-generator'
import { toolInfo as urlComponentEncoderDecoderToolInfo } from '@tools/url-component-encoder-decoder'
import { toolInfo as base64EncoderDecoderToolInfo } from '@tools/base64-encoder-decoder'
import { toolInfo as fileToDataUriConverterToolInfo } from '@tools/file-to-data-uri-converter'
import { toolInfo as dataUriToFileConverterToolInfo } from '@tools/data-uri-to-file-converter'
import { toolInfo as urlParserBuilderToolInfo } from '@tools/url-parser-builder'
import { toolInfo as userAgentParserToolInfo } from '@tools/user-agent-parser'
import { toolInfo as basicAuthGeneratorToolInfo } from '@tools/basic-auth-generator'
import { toolInfo as basicAuthDecoderToolInfo } from '@tools/basic-auth-decoder'
import { toolInfo as jwtSignerToolInfo } from '@tools/jwt-signer'
import { toolInfo as jwtDecoderVerifierToolInfo } from '@tools/jwt-decoder-verifier'
import { toolInfo as randomPasswordGeneratorToolInfo } from '@tools/random-password-generator'
import { toolInfo as bip39MnemonicGeneratorToolInfo } from '@tools/bip39-mnemonic-generator'
import { toolInfo as ksuidGeneratorToolInfo } from '@tools/ksuid-generator'
import { toolInfo as nanoidGeneratorToolInfo } from '@tools/nanoid-generator'
import { toolInfo as qrCodeGeneratorToolInfo } from '@tools/qr-code-generator'
import { toolInfo as qrCodeReaderToolInfo } from '@tools/qr-code-reader'
import { toolInfo as barcodeGeneratorToolInfo } from '@tools/barcode-generator'
import { toolInfo as markdownToHtmlConverterToolInfo } from '@tools/markdown-to-html-converter'
import { toolInfo as htmlToMarkdownConverterToolInfo } from '@tools/html-to-markdown-converter'
import { toolInfo as jsonToYamlBuilderToolInfo } from '@tools/json-to-yaml-converter'
import { toolInfo as yamlToJsonConverterToolInfo } from '@tools/yaml-to-json-converter'
import { toolInfo as jsonToTomlConverterToolInfo } from '@tools/json-to-toml-converter'
import { toolInfo as tomlToJsonConverterToolInfo } from '@tools/toml-to-json-converter'
import { toolInfo as yamlToTomlConverterToolInfo } from '@tools/yaml-to-toml-converter'
import { toolInfo as tomlToYamlConverterToolInfo } from '@tools/toml-to-yaml-converter'
import { toolInfo as xmlToJsonConverterToolInfo } from '@tools/xml-to-json-converter'
import { toolInfo as jsonToXmlConverterToolInfo } from '@tools/json-to-xml-converter'
import { toolInfo as csvToJsonConverterToolInfo } from '@tools/csv-to-json-converter'
import { toolInfo as jsonToCsvConverterToolInfo } from '@tools/json-to-csv-converter'
import { toolInfo as jsonFormatterToolInfo } from '@tools/json-formatter'
import { toolInfo as jmespathTesterToolInfo } from '@tools/jmespath-tester'
import { toolInfo as jsonpathTesterToolInfo } from '@tools/jsonpath-tester'
import { toolInfo as openApiToTypescriptToolInfo } from '@tools/openapi-to-typescript'
import { toolInfo as prettierCodeFormatterToolInfo } from '@tools/prettier-code-formatter'
import { toolInfo as jsonSchemaValidatorToolInfo } from '@tools/json-schema-validator'
import { toolInfo as passwordStrengthCheckerToolInfo } from '@tools/password-strength-checker'
import { toolInfo as deviceInformationToolInfo } from '@tools/device-information'
import { toolInfo as romanNumeralConverterToolInfo } from '@tools/roman-numeral-converter'
import { toolInfo as stopwatchToolInfo } from '@tools/stopwatch'
import { toolInfo as unixTimestampConverterToolInfo } from '@tools/unix-timestamp-converter'
import { toolInfo as icalEventGeneratorToolInfo } from '@tools/ical-event-generator'
import { toolInfo as timeZoneConverterToolInfo } from '@tools/time-zone-converter'
import { toolInfo as timeDiffCalculatorToolInfo } from '@tools/time-diff-calculator'
import { toolInfo as durationCalculatorToolInfo } from '@tools/duration-calculator'
import { toolInfo as businessDaysCalculatorToolInfo } from '@tools/business-days-calculator'
import { toolInfo as cronExpressionParserToolInfo } from '@tools/cron-expression-parser'
import { toolInfo as cronExpressionGeneratorToolInfo } from '@tools/cron-expression-generator'
import { toolInfo as textDiffToolInfo } from '@tools/text-diff'
import { toolInfo as colorPickerToolInfo } from '@tools/color-picker'
import { toolInfo as colorConverterToolInfo } from '@tools/color-converter'
import { toolInfo as caseConverterToolInfo } from '@tools/case-converter'
import { toolInfo as numberBaseConverterToolInfo } from '@tools/number-base-converter'
import { toolInfo as unicodeEscapeUnescapeToolInfo } from '@tools/unicode-escape-unescape'
import { toolInfo as morseCodeConverterToolInfo } from '@tools/morse-code-converter'
import { toolInfo as rotCipherToolInfo } from '@tools/rot-cipher'
import { toolInfo as htmlEntityEncoderDecoderToolInfo } from '@tools/html-entity-encoder-decoder'
import { toolInfo as chmodCalculatorToolInfo } from '@tools/chmod-calculator'
import { toolInfo as asciiArtGeneratorToolInfo } from '@tools/ascii-art-generator'
import { toolInfo as aesEncryptorToolInfo } from '@tools/aes-encryptor'
import { toolInfo as aesDecryptorToolInfo } from '@tools/aes-decryptor'
import { toolInfo as portNumberLookupToolInfo } from '@tools/port-number-lookup'
import { toolInfo as httpStatusCodeLookupToolInfo } from '@tools/http-status-code-lookup'
import { toolInfo as mimeTypeLookupToolInfo } from '@tools/mime-type-lookup'
import { toolInfo as textStatisticsToolInfo } from '@tools/text-statistics'
import { toolInfo as regexTesterReplacerToolInfo } from '@tools/regex-tester-replacer'
import { toolInfo as loremIpsumGeneratorToolInfo } from '@tools/lorem-ipsum-generator'
import { toolInfo as gitignoreGeneratorToolInfo } from '@tools/gitignore-generator'
import { toolInfo as creditCardValidatorToolInfo } from '@tools/credit-card-validator'
import { toolInfo as isbnValidatorToolInfo } from '@tools/isbn-validator'
import { toolInfo as ibanValidatorToolInfo } from '@tools/iban-validator'
import { toolInfo as bicSwiftValidatorToolInfo } from '@tools/bic-swift-validator'
import { toolInfo as placeholderImageGeneratorToolInfo } from '@tools/placeholder-image-generator'
import { toolInfo as slugGeneratorToolInfo } from '@tools/slug-generator'
import { toolInfo as sshKeyGeneratorToolInfo } from '@tools/ssh-key-generator'
import { toolInfo as certificatePublicKeyParserToolInfo } from '@tools/certificate-public-key-parser'
import { toolInfo as htmlColorNamesToolInfo } from '@tools/html-color-names'
import { toolInfo as svgOptimizerToolInfo } from '@tools/svg-optimizer'
import { toolInfo as svgToImageConverterToolInfo } from '@tools/svg-to-image-converter'

export const tools: ToolInfo[] = [
  // Network Tools
  cidrParserToolInfo,
  cidrsMergerExcluderToolInfo,
  currentNetworkTimeToolInfo,
  dnsLookupToolInfo,
  ipCidrNormalizerToolInfo,
  ipInfoLookupToolInfo,
  ipRangeToCIDRToolInfo,
  ipv6ToMacToolInfo,
  macToIPv6LinkLocalToolInfo,
  myIPAddressToolInfo,
  portNumberLookupToolInfo,
  httpStatusCodeLookupToolInfo,
  mimeTypeLookupToolInfo,
  reverseIPLookupToolInfo,
  networkToolsToolInfo,
  unicodePunycodeConverterToolInfo,

  // UUID/ID Tools
  ...uuidTools,

  // Image Tools
  imageToolsToolInfo,
  faviconAssetsGeneratorToolInfo,
  pngOptimizerToolInfo,
  svgOptimizerToolInfo,
  svgToImageConverterToolInfo,
  exifViewerToolInfo,
  imageMetadataCleanerToolInfo,
  qrCodeGeneratorToolInfo,
  qrCodeReaderToolInfo,
  barcodeGeneratorToolInfo,
  markdownToHtmlConverterToolInfo,
  htmlToMarkdownConverterToolInfo,
  jsonToYamlBuilderToolInfo,
  yamlToJsonConverterToolInfo,
  jsonToTomlConverterToolInfo,
  tomlToJsonConverterToolInfo,
  yamlToTomlConverterToolInfo,
  tomlToYamlConverterToolInfo,
  xmlToJsonConverterToolInfo,
  jsonToXmlConverterToolInfo,
  csvToJsonConverterToolInfo,
  jsonToCsvConverterToolInfo,
  jsonFormatterToolInfo,
  jmespathTesterToolInfo,
  jsonpathTesterToolInfo,
  openApiToTypescriptToolInfo,
  prettierCodeFormatterToolInfo,

  // PDF Tools
  pdfToolsToolInfo,
  removePDFOwnerPasswordToolInfo,

  // Hash Tools
  sha256HashTextOrFileToolInfo,
  sha384HashTextOrFileToolInfo,
  sha512HashTextOrFileToolInfo,
  sha1HashTextOrFileToolInfo,
  md5HashTextOrFileToolInfo,
  ripemd160HashTextOrFileToolInfo,
  keccakHashTextOrFileToolInfo,
  bcryptHashPasswordToolInfo,
  bcryptHashPasswordVerifierToolInfo,
  hashToolsToolInfo,
  sriHashGeneratorToolInfo,
  crcChecksumCalculatorToolInfo,
  xxhashXxh32HashTextOrFileToolInfo,
  xxhashXxh64HashTextOrFileToolInfo,
  blake2bHashTextOrFileToolInfo,
  blake2sHashTextOrFileToolInfo,
  hmacGeneratorToolInfo,

  // Web Tools
  urlComponentEncoderDecoderToolInfo,
  base64EncoderDecoderToolInfo,
  fileToDataUriConverterToolInfo,
  dataUriToFileConverterToolInfo,
  urlParserBuilderToolInfo,
  userAgentParserToolInfo,
  basicAuthGeneratorToolInfo,
  basicAuthDecoderToolInfo,
  jwtSignerToolInfo,
  jwtDecoderVerifierToolInfo,
  randomPasswordGeneratorToolInfo,
  bip39MnemonicGeneratorToolInfo,
  ksuidGeneratorToolInfo,
  nanoidGeneratorToolInfo,

  // Other Tools
  ...redirectsTools,
  deviceInformationToolInfo,
  romanNumeralConverterToolInfo,

  // Time Tools
  stopwatchToolInfo,
  unixTimestampConverterToolInfo,
  icalEventGeneratorToolInfo,
  timeZoneConverterToolInfo,
  timeDiffCalculatorToolInfo,
  durationCalculatorToolInfo,
  businessDaysCalculatorToolInfo,
  cronExpressionParserToolInfo,
  cronExpressionGeneratorToolInfo,

  // Document Tools
  textDiffToolInfo,

  // Web Tools (Color)
  colorPickerToolInfo,
  colorConverterToolInfo,
  htmlColorNamesToolInfo,

  // Text Tools
  caseConverterToolInfo,

  // Number Tools
  numberBaseConverterToolInfo,

  // Unicode Tools
  unicodeEscapeUnescapeToolInfo,

  // Misc Tools
  morseCodeConverterToolInfo,
  rotCipherToolInfo,
  htmlEntityEncoderDecoderToolInfo,
  chmodCalculatorToolInfo,
  loremIpsumGeneratorToolInfo,
  gitignoreGeneratorToolInfo,

  // Text Tools
  regexTesterReplacerToolInfo,
  asciiArtGeneratorToolInfo,
  textStatisticsToolInfo,

  // Encryption Tools
  aesEncryptorToolInfo,
  aesDecryptorToolInfo,

  // Validator Tools
  jsonSchemaValidatorToolInfo,
  passwordStrengthCheckerToolInfo,
  creditCardValidatorToolInfo,
  isbnValidatorToolInfo,
  ibanValidatorToolInfo,
  bicSwiftValidatorToolInfo,

  // Web Tools (Slug)
  slugGeneratorToolInfo,

  // Image Tools (Placeholder)
  placeholderImageGeneratorToolInfo,

  // Security Tools
  certificatePublicKeyParserToolInfo,
  sshKeyGeneratorToolInfo,
]
