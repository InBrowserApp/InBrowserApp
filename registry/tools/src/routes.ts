import type { ToolRoute } from '@shared/tools'
import { routes as faviconAssetsGeneratorRoutes } from '@tools/favicon-assets-generator/routes'
import { routes as uuidRoutes } from '@tools/uuid/routes'
import { routes as removePDFOwnerPasswordRoutes } from '@tools/remove-pdf-owner-password/routes'
import { routes as pdfInfoViewerRoutes } from '@tools/pdf-info-viewer/routes'
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
import { routes as imageToIcoRoutes } from '@tools/image-to-ico/routes'
import { routes as exifViewerRoutes } from '@tools/exif-viewer/routes'
import { routes as imageMetadataCleanerRoutes } from '@tools/image-metadata-cleaner/routes'
import { routes as imagePaletteExtractorRoutes } from '@tools/image-palette-extractor/routes'
import { routes as networkToolsRoutes } from '@tools/network-tools/routes'
import { routes as pdfToolsRoutes } from '@tools/pdf-tools/routes'
import { routes as imageToolsRoutes } from '@tools/image-tools/routes'
import { routes as sha256HashTextOrFileRoutes } from '@tools/sha256-hash-text-or-file/routes'
import { routes as sha224HashTextOrFileRoutes } from '@tools/sha224-hash-text-or-file/routes'
import { routes as sha3_256HashTextOrFileRoutes } from '@tools/sha3-256-hash-text-or-file/routes'
import { routes as sha3_512HashTextOrFileRoutes } from '@tools/sha3-512-hash-text-or-file/routes'
import { routes as sha384HashTextOrFileRoutes } from '@tools/sha384-hash-text-or-file/routes'
import { routes as sha512HashTextOrFileRoutes } from '@tools/sha512-hash-text-or-file/routes'
import { routes as sha1HashTextOrFileRoutes } from '@tools/sha1-hash-text-or-file/routes'
import { routes as md5HashTextOrFileRoutes } from '@tools/md5-hash-text-or-file/routes'
import { routes as sm3HashTextOrFileRoutes } from '@tools/sm3-hash-text-or-file/routes'
import { routes as ripemd160HashTextOrFileRoutes } from '@tools/ripemd160-hash-text-or-file/routes'
import { routes as keccakHashTextOrFileRoutes } from '@tools/keccak-hash-text-or-file/routes'
import { routes as bcryptHashPasswordRoutes } from '@tools/bcrypt-hash-password/routes'
import { routes as bcryptHashPasswordVerifierRoutes } from '@tools/bcrypt-hash-password-verifier/routes'
import { routes as hashToolsRoutes } from '@tools/hash-tools/routes'
import { routes as sriHashGeneratorRoutes } from '@tools/sri-hash-generator/routes'
import { routes as crcChecksumCalculatorRoutes } from '@tools/crc-checksum-calculator/routes'
import { routes as cityhash64HashTextOrFileRoutes } from '@tools/cityhash64-hash-text-or-file/routes'
import { routes as murmurhash3X64_128HashTextOrFileRoutes } from '@tools/murmurhash3-x64-128-hash-text-or-file/routes'
import { routes as murmurhash3X86_128HashTextOrFileRoutes } from '@tools/murmurhash3-x86-128-hash-text-or-file/routes'
import { routes as murmurhash3X86_32HashTextOrFileRoutes } from '@tools/murmurhash3-x86-32-hash-text-or-file/routes'
import { routes as xxhashXxh32HashTextOrFileRoutes } from '@tools/xxhash-xxh32-hash-text-or-file/routes'
import { routes as xxhashXxh64HashTextOrFileRoutes } from '@tools/xxhash-xxh64-hash-text-or-file/routes'
import { routes as blake2bHashTextOrFileRoutes } from '@tools/blake2b-hash-text-or-file/routes'
import { routes as blake2sHashTextOrFileRoutes } from '@tools/blake2s-hash-text-or-file/routes'
import { routes as blake3HashTextOrFileRoutes } from '@tools/blake3-hash-text-or-file/routes'
import { routes as hmacGeneratorRoutes } from '@tools/hmac-generator/routes'
import { routes as urlComponentEncoderDecoderRoutes } from '@tools/url-component-encoder-decoder/routes'
import { routes as base16EncoderRoutes } from '@tools/base16-encoder/routes'
import { routes as base16DecoderRoutes } from '@tools/base16-decoder/routes'
import { routes as base32EncoderRoutes } from '@tools/base32-encoder/routes'
import { routes as base32DecoderRoutes } from '@tools/base32-decoder/routes'
import { routes as base58EncoderRoutes } from '@tools/base58-encoder/routes'
import { routes as base58DecoderRoutes } from '@tools/base58-decoder/routes'
import { routes as base64EncoderDecoderRoutes } from '@tools/base64-encoder-decoder/routes'
import { routes as fileToDataUriConverterRoutes } from '@tools/file-to-data-uri-converter/routes'
import { routes as dataUriToFileConverterRoutes } from '@tools/data-uri-to-file-converter/routes'
import { routes as urlParserBuilderRoutes } from '@tools/url-parser-builder/routes'
import { routes as userAgentParserRoutes } from '@tools/user-agent-parser/routes'
import { routes as basicAuthGeneratorRoutes } from '@tools/basic-auth-generator/routes'
import { routes as basicAuthDecoderRoutes } from '@tools/basic-auth-decoder/routes'
import { routes as jwtSignerRoutes } from '@tools/jwt-signer/routes'
import { routes as jwtDecoderVerifierRoutes } from '@tools/jwt-decoder-verifier/routes'
import { routes as jwkPemConverterRoutes } from '@tools/jwk-pem-converter/routes'
import { routes as randomPasswordGeneratorRoutes } from '@tools/random-password-generator/routes'
import { routes as randomNumberGeneratorRoutes } from '@tools/random-number-generator/routes'
import { routes as bip39MnemonicGeneratorRoutes } from '@tools/bip39-mnemonic-generator/routes'
import { routes as ksuidGeneratorRoutes } from '@tools/ksuid-generator/routes'
import { routes as nanoidGeneratorRoutes } from '@tools/nanoid-generator/routes'
import { routes as cuid2GeneratorRoutes } from '@tools/cuid2-generator/routes'
import { routes as qrCodeGeneratorRoutes } from '@tools/qr-code-generator/routes'
import { routes as qrCodeReaderRoutes } from '@tools/qr-code-reader/routes'
import { routes as barcodeGeneratorRoutes } from '@tools/barcode-generator/routes'
import { routes as barcodeReaderRoutes } from '@tools/barcode-reader/routes'
import { routes as markdownToHtmlConverterRoutes } from '@tools/markdown-to-html-converter/routes'
import { routes as markdownPreviewerRoutes } from '@tools/markdown-previewer/routes'
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
import { routes as jmespathTesterRoutes } from '@tools/jmespath-tester/routes'
import { routes as jsonpathTesterRoutes } from '@tools/jsonpath-tester/routes'
import { routes as jsonSchemaGeneratorRoutes } from '@tools/json-schema-generator/routes'
import { routes as jsonSchemaValidatorRoutes } from '@tools/json-schema-validator/routes'
import { routes as openApiToTypescriptRoutes } from '@tools/openapi-to-typescript/routes'
import { routes as passwordStrengthCheckerRoutes } from '@tools/password-strength-checker/routes'
import { routes as prettierCodeFormatterRoutes } from '@tools/prettier-code-formatter/routes'
import { routes as codeScreenshotGeneratorRoutes } from '@tools/code-screenshot-generator/routes'
import { routes as curlConverterRoutes } from '@tools/curl-converter/routes'
import { routes as dockerRunToComposeRoutes } from '@tools/docker-run-to-compose/routes'
import { routes as deviceInformationRoutes } from '@tools/device-information/routes'
import { routes as romanNumeralConverterRoutes } from '@tools/roman-numeral-converter/routes'
import { routes as chineseUppercaseNumberConverterRoutes } from '@tools/chinese-uppercase-number-converter/routes'
import { routes as stopwatchRoutes } from '@tools/stopwatch/routes'
import { routes as timerRoutes } from '@tools/timer/routes'
import { routes as unixTimestampConverterRoutes } from '@tools/unix-timestamp-converter/routes'
import { routes as icalEventGeneratorRoutes } from '@tools/ical-event-generator/routes'
import { routes as timeZoneConverterRoutes } from '@tools/time-zone-converter/routes'
import { routes as timeDiffCalculatorRoutes } from '@tools/time-diff-calculator/routes'
import { routes as radioTimecodeRoutes } from '@tools/radio-timecode/routes'
import { routes as durationCalculatorRoutes } from '@tools/duration-calculator/routes'
import { routes as businessDaysCalculatorRoutes } from '@tools/business-days-calculator/routes'
import { routes as cronExpressionParserRoutes } from '@tools/cron-expression-parser/routes'
import { routes as cronExpressionGeneratorRoutes } from '@tools/cron-expression-generator/routes'
import { routes as textDiffRoutes } from '@tools/text-diff/routes'
import { routes as colorPickerRoutes } from '@tools/color-picker/routes'
import { routes as colorConverterRoutes } from '@tools/color-converter/routes'
import { routes as colorContrastCheckerRoutes } from '@tools/color-contrast-checker/routes'
import { routes as cssBoxShadowGeneratorRoutes } from '@tools/css-box-shadow-generator/routes'
import { routes as cssGradientGeneratorRoutes } from '@tools/css-gradient-generator/routes'
import { routes as caseConverterRoutes } from '@tools/case-converter/routes'
import { routes as numberBaseConverterRoutes } from '@tools/number-base-converter/routes'
import { routes as unicodeInvisibleCharacterCheckerRoutes } from '@tools/unicode-invisible-character-checker/routes'
import { routes as unicodeEscapeUnescapeRoutes } from '@tools/unicode-escape-unescape/routes'
import { routes as audioRecorderRoutes } from '@tools/audio-recorder/routes'
import { routes as screenRecorderRoutes } from '@tools/screen-recorder/routes'
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
import { routes as emailValidatorRoutes } from '@tools/email-validator/routes'
import { routes as creditCardValidatorRoutes } from '@tools/credit-card-validator/routes'
import { routes as vinValidatorRoutes } from '@tools/vin-validator/routes'
import { routes as prcIdValidatorRoutes } from '@tools/prc-id-validator/routes'
import { routes as isbnValidatorRoutes } from '@tools/isbn-validator/routes'
import { routes as ibanValidatorRoutes } from '@tools/iban-validator/routes'
import { routes as bicSwiftValidatorRoutes } from '@tools/bic-swift-validator/routes'
import { routes as vatValidatorRoutes } from '@tools/vat-validator/routes'
import { routes as placeholderImageGeneratorRoutes } from '@tools/placeholder-image-generator/routes'
import { routes as robotsTxtGeneratorRoutes } from '@tools/robots-txt-generator/routes'
import { routes as sitemapXmlGeneratorRoutes } from '@tools/sitemap-xml-generator/routes'
import { routes as slugGeneratorRoutes } from '@tools/slug-generator/routes'
import { routes as certificatePublicKeyParserRoutes } from '@tools/certificate-public-key-parser/routes'
import { routes as csrGeneratorRoutes } from '@tools/csr-generator/routes'
import { routes as pgpKeyGeneratorRoutes } from '@tools/pgp-key-generator/routes'
import { routes as sshKeyGeneratorRoutes } from '@tools/ssh-key-generator/routes'
import { routes as sshPublicKeyFingerprintRoutes } from '@tools/ssh-public-key-fingerprint/routes'
import { routes as htmlColorNamesRoutes } from '@tools/html-color-names/routes'
import { routes as svgOptimizerRoutes } from '@tools/svg-optimizer/routes'
import { routes as svgToImageConverterRoutes } from '@tools/svg-to-image-converter/routes'

export const routes: ToolRoute[] = [
  ...faviconAssetsGeneratorRoutes,
  ...uuidRoutes,
  ...removePDFOwnerPasswordRoutes,
  ...pdfInfoViewerRoutes,
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
  ...imageToIcoRoutes,
  ...svgOptimizerRoutes,
  ...svgToImageConverterRoutes,
  ...exifViewerRoutes,
  ...imageMetadataCleanerRoutes,
  ...imagePaletteExtractorRoutes,
  ...networkToolsRoutes,
  ...pdfToolsRoutes,
  ...imageToolsRoutes,
  ...sha256HashTextOrFileRoutes,
  ...sha224HashTextOrFileRoutes,
  ...sha3_256HashTextOrFileRoutes,
  ...sha3_512HashTextOrFileRoutes,
  ...sha384HashTextOrFileRoutes,
  ...sha512HashTextOrFileRoutes,
  ...sha1HashTextOrFileRoutes,
  ...md5HashTextOrFileRoutes,
  ...sm3HashTextOrFileRoutes,
  ...ripemd160HashTextOrFileRoutes,
  ...keccakHashTextOrFileRoutes,
  ...bcryptHashPasswordRoutes,
  ...bcryptHashPasswordVerifierRoutes,
  ...hashToolsRoutes,
  ...sriHashGeneratorRoutes,
  ...crcChecksumCalculatorRoutes,
  ...cityhash64HashTextOrFileRoutes,
  ...murmurhash3X86_32HashTextOrFileRoutes,
  ...murmurhash3X86_128HashTextOrFileRoutes,
  ...murmurhash3X64_128HashTextOrFileRoutes,
  ...xxhashXxh32HashTextOrFileRoutes,
  ...xxhashXxh64HashTextOrFileRoutes,
  ...blake2bHashTextOrFileRoutes,
  ...blake2sHashTextOrFileRoutes,
  ...blake3HashTextOrFileRoutes,
  ...hmacGeneratorRoutes,
  ...urlComponentEncoderDecoderRoutes,
  ...base16EncoderRoutes,
  ...base16DecoderRoutes,
  ...base32EncoderRoutes,
  ...base32DecoderRoutes,
  ...base58EncoderRoutes,
  ...base58DecoderRoutes,
  ...base64EncoderDecoderRoutes,
  ...fileToDataUriConverterRoutes,
  ...dataUriToFileConverterRoutes,
  ...urlParserBuilderRoutes,
  ...userAgentParserRoutes,
  ...basicAuthGeneratorRoutes,
  ...basicAuthDecoderRoutes,
  ...jwtSignerRoutes,
  ...jwtDecoderVerifierRoutes,
  ...jwkPemConverterRoutes,
  ...randomPasswordGeneratorRoutes,
  ...randomNumberGeneratorRoutes,
  ...bip39MnemonicGeneratorRoutes,
  ...ksuidGeneratorRoutes,
  ...nanoidGeneratorRoutes,
  ...cuid2GeneratorRoutes,
  ...qrCodeGeneratorRoutes,
  ...qrCodeReaderRoutes,
  ...barcodeGeneratorRoutes,
  ...barcodeReaderRoutes,
  ...markdownToHtmlConverterRoutes,
  ...markdownPreviewerRoutes,
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
  ...jmespathTesterRoutes,
  ...jsonpathTesterRoutes,
  ...jsonSchemaGeneratorRoutes,
  ...jsonSchemaValidatorRoutes,
  ...openApiToTypescriptRoutes,
  ...prettierCodeFormatterRoutes,
  ...codeScreenshotGeneratorRoutes,
  ...curlConverterRoutes,
  ...dockerRunToComposeRoutes,
  ...passwordStrengthCheckerRoutes,
  ...deviceInformationRoutes,
  ...romanNumeralConverterRoutes,
  ...chineseUppercaseNumberConverterRoutes,
  ...stopwatchRoutes,
  ...timerRoutes,
  ...unixTimestampConverterRoutes,
  ...icalEventGeneratorRoutes,
  ...timeZoneConverterRoutes,
  ...timeDiffCalculatorRoutes,
  ...radioTimecodeRoutes,
  ...durationCalculatorRoutes,
  ...businessDaysCalculatorRoutes,
  ...cronExpressionParserRoutes,
  ...cronExpressionGeneratorRoutes,
  ...textDiffRoutes,
  ...colorPickerRoutes,
  ...colorConverterRoutes,
  ...colorContrastCheckerRoutes,
  ...cssBoxShadowGeneratorRoutes,
  ...cssGradientGeneratorRoutes,
  ...caseConverterRoutes,
  ...numberBaseConverterRoutes,
  ...unicodeInvisibleCharacterCheckerRoutes,
  ...unicodeEscapeUnescapeRoutes,
  ...audioRecorderRoutes,
  ...screenRecorderRoutes,
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
  ...emailValidatorRoutes,
  ...creditCardValidatorRoutes,
  ...vinValidatorRoutes,
  ...prcIdValidatorRoutes,
  ...isbnValidatorRoutes,
  ...ibanValidatorRoutes,
  ...bicSwiftValidatorRoutes,
  ...vatValidatorRoutes,
  ...placeholderImageGeneratorRoutes,
  ...robotsTxtGeneratorRoutes,
  ...sitemapXmlGeneratorRoutes,
  ...slugGeneratorRoutes,
  ...certificatePublicKeyParserRoutes,
  ...csrGeneratorRoutes,
  ...pgpKeyGeneratorRoutes,
  ...sshKeyGeneratorRoutes,
  ...sshPublicKeyFingerprintRoutes,
  ...htmlColorNamesRoutes,
]
