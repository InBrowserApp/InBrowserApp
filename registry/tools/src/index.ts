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
import { toolInfo as urlComponentEncoderDecoderToolInfo } from '@tools/url-component-encoder-decoder'
import { toolInfo as base64EncoderDecoderToolInfo } from '@tools/base64-encoder-decoder'
import { toolInfo as urlParserBuilderToolInfo } from '@tools/url-parser-builder'
import { toolInfo as basicAuthGeneratorToolInfo } from '@tools/basic-auth-generator'
import { toolInfo as basicAuthDecoderToolInfo } from '@tools/basic-auth-decoder'
import { toolInfo as jwtSignerToolInfo } from '@tools/jwt-signer'
import { toolInfo as jwtDecoderVerifierToolInfo } from '@tools/jwt-decoder-verifier'
import { toolInfo as randomPasswordGeneratorToolInfo } from '@tools/random-password-generator'
import { toolInfo as qrCodeGeneratorToolInfo } from '@tools/qr-code-generator'
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
import { toolInfo as deviceInformationToolInfo } from '@tools/device-information'
import { toolInfo as romanNumeralConverterToolInfo } from '@tools/roman-numeral-converter'
import { toolInfo as unixTimestampConverterToolInfo } from '@tools/unix-timestamp-converter'
import { toolInfo as textDiffToolInfo } from '@tools/text-diff'
import { toolInfo as colorConverterToolInfo } from '@tools/color-converter'
import { toolInfo as caseConverterToolInfo } from '@tools/case-converter'
import { toolInfo as numberBaseConverterToolInfo } from '@tools/number-base-converter'

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
  reverseIPLookupToolInfo,
  networkToolsToolInfo,
  unicodePunycodeConverterToolInfo,

  // UUID/ID Tools
  ...uuidTools,

  // Image Tools
  imageToolsToolInfo,
  faviconAssetsGeneratorToolInfo,
  pngOptimizerToolInfo,
  qrCodeGeneratorToolInfo,
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

  // Web Tools
  urlComponentEncoderDecoderToolInfo,
  base64EncoderDecoderToolInfo,
  urlParserBuilderToolInfo,
  basicAuthGeneratorToolInfo,
  basicAuthDecoderToolInfo,
  jwtSignerToolInfo,
  jwtDecoderVerifierToolInfo,
  randomPasswordGeneratorToolInfo,

  // Other Tools
  ...redirectsTools,
  deviceInformationToolInfo,
  romanNumeralConverterToolInfo,

  // Time Tools
  unixTimestampConverterToolInfo,

  // Document Tools
  textDiffToolInfo,

  // Web Tools (Color)
  colorConverterToolInfo,

  // Text Tools
  caseConverterToolInfo,

  // Number Tools
  numberBaseConverterToolInfo,
]
