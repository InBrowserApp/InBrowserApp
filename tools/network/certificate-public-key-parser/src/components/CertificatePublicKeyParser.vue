<template>
  <ToolSectionHeader>{{ t('inputTitle') }}</ToolSectionHeader>
  <ToolSection>
    <TextOrFileInput
      v-model:value="inputValue"
      class="monospace-input"
      :placeholder="t('inputPlaceholder')"
      :status="inputStatus"
      :accept="acceptedFormats"
    />
    <n-text depth="3" class="input-hint">{{ t('inputHint') }}</n-text>
  </ToolSection>

  <n-alert v-if="parseState.state === 'error'" type="error" :title="t('parseErrorTitle')">
    {{ parseState.message }}
  </n-alert>

  <n-alert v-if="warnings.length" type="warning" :title="t('warningsTitle')">
    <n-space vertical :size="4">
      <div v-for="warning in warnings" :key="warning">{{ warning }}</div>
    </n-space>
  </n-alert>

  <ToolSectionHeader v-if="hasParsed">{{ t('resultsTitle') }}</ToolSectionHeader>
  <ToolSection v-if="hasParsed">
    <n-tabs v-if="entries.length > 1" type="line">
      <n-tab-pane
        v-for="entry in entries"
        :key="entry.label"
        :name="entry.label"
        :tab="entry.label"
      >
        <ParsedEntryDetails :entry="entry" :labels="labels" />
      </n-tab-pane>
    </n-tabs>

    <ParsedEntryDetails v-else :entry="entries[0]!" :labels="labels" />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { computedAsync, useDebounce, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  AuthorityKeyIdentifierExtension,
  BasicConstraintsExtension,
  ExtendedKeyUsage,
  ExtendedKeyUsageExtension,
  KeyUsageFlags,
  KeyUsagesExtension,
  PublicKey,
  SubjectAlternativeNameExtension,
  SubjectKeyIdentifierExtension,
  X509Certificate,
} from '@peculiar/x509'
import { NAlert, NTabPane, NTabs, NSpace, NText } from 'naive-ui'
import { TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ParsedEntryDetails from './ParsedEntryDetails.vue'

type AlgorithmInfo = Algorithm & {
  hash?: Algorithm
  modulusLength?: number
  namedCurve?: string
}

type Fingerprints = {
  sha1: string
  sha256: string
}

type CertificateExtensions = {
  subjectAlternativeNames?: string[]
  keyUsage?: string[]
  extendedKeyUsage?: string[]
  basicConstraints?: string
  subjectKeyIdentifier?: string
  authorityKeyIdentifier?: string
}

type CertificateEntry = {
  type: 'certificate'
  label: string
  subject: string
  issuer: string
  serialNumber: string
  notBefore: string
  notAfter: string
  signatureAlgorithm: string
  publicKeyAlgorithm: string
  publicKeySize?: number
  publicKeyCurve?: string
  fingerprints: Fingerprints
  extensions: CertificateExtensions
}

type PublicKeyEntry = {
  type: 'publicKey'
  label: string
  algorithm: string
  keySize?: number
  curve?: string
  fingerprints: Fingerprints
}

type ParsedEntry = CertificateEntry | PublicKeyEntry

type ParseState =
  | { state: 'empty' }
  | { state: 'error'; message: string }
  | { state: 'parsed'; entries: ParsedEntry[]; warnings: string[] }

const { t } = useI18n()

const defaultInput = `-----BEGIN CERTIFICATE-----
MIIBgTCCASegAwIBAgIUftI0mqWgxqcX9lWIS/FSiGXdbekwCgYIKoZIzj0EAwIw
FjEUMBIGA1UEAwwLZXhhbXBsZS5jb20wHhcNMjYwMTEzMDkxMTQ5WhcNMjcwMTEz
MDkxMTQ5WjAWMRQwEgYDVQQDDAtleGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqG
SM49AwEHA0IABLCYkUdrGAE8Kx15ZvhkqEvUPKLZyolQe9ySpKR/SdxsIk2GiLeb
V1YvmZpQ0ti51b7a8LE1sVbUA35GYnxdlZijUzBRMB0GA1UdDgQWBBQ36VA4D6ZE
UkQrQYbeEIF6deRE4TAfBgNVHSMEGDAWgBQ36VA4D6ZEUkQrQYbeEIF6deRE4TAP
BgNVHRMBAf8EBTADAQH/MAoGCCqGSM49BAMCA0gAMEUCIBYqVd8kI1xAIbgGDS8j
DGp+7YYIS154UJiV5nYAsNNeAiEAvKuZ5GUl+PwvetdfKjmrhGSuxUsNR/lxk8Fl
KyUxsKk=
-----END CERTIFICATE-----
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEsJiRR2sYATwrHXlm+GSoS9Q8otnK
iVB73JKkpH9J3GwiTYaIt5tXVi+ZmlDS2LnVvtrwsTWxVtQDfkZifF2VmA==
-----END PUBLIC KEY-----`

const storedInput = useStorage('tools:certificate-public-key-parser:input', defaultInput)
const inputValue = ref<string | File>(storedInput.value)
const acceptedFormats = '.pem,.crt,.cer,.der,.key,.pub,.txt'

watch(inputValue, (value) => {
  if (typeof value === 'string') {
    storedInput.value = value
  }
})

const debouncedInput = useDebounce(inputValue, 150)
const parsing = ref(false)

const parseState = computedAsync<ParseState>(
  async () => {
    const input = debouncedInput.value
    if (typeof input === 'string') {
      if (!input.trim()) {
        return { state: 'empty' }
      }
    }

    if (!input) {
      return { state: 'empty' }
    }

    try {
      return await parseInput(input)
    } catch (error) {
      return {
        state: 'error',
        message: error instanceof Error ? error.message : String(error),
      }
    }
  },
  { state: 'empty' },
  parsing,
)

const entries = computed(() =>
  parseState.value.state === 'parsed' ? parseState.value.entries : [],
)
const warnings = computed(() =>
  parseState.value.state === 'parsed' ? parseState.value.warnings : [],
)
const hasParsed = computed(() => parseState.value.state === 'parsed' && entries.value.length > 0)
const inputStatus = computed(() => {
  const hasInput = typeof inputValue.value === 'string' ? inputValue.value.trim().length > 0 : true
  if (!hasInput) return undefined
  if (parseState.value.state === 'error') return 'error'
  if (parseState.value.state === 'parsed') return 'success'
  return undefined
})

const labels = computed(() => ({
  certificate: t('certificate'),
  publicKey: t('publicKey'),
  overview: t('overview'),
  subjectIssuer: t('subjectIssuer'),
  validity: t('validity'),
  keyAlgorithm: t('keyAlgorithm'),
  keySize: t('keySize'),
  curve: t('curve'),
  serialNumber: t('serialNumber'),
  signatureAlgorithm: t('signatureAlgorithm'),
  subject: t('subject'),
  issuer: t('issuer'),
  notBefore: t('notBefore'),
  notAfter: t('notAfter'),
  fingerprints: t('fingerprints'),
  fingerprintSha1: t('fingerprintSha1'),
  fingerprintSha256: t('fingerprintSha256'),
  extensions: t('extensions'),
  subjectAltName: t('subjectAltName'),
  keyUsage: t('keyUsage'),
  extendedKeyUsage: t('extendedKeyUsage'),
  basicConstraints: t('basicConstraints'),
  subjectKeyIdentifier: t('subjectKeyIdentifier'),
  authorityKeyIdentifier: t('authorityKeyIdentifier'),
  notAvailable: t('notAvailable'),
  bits: t('bits'),
}))

async function parseInput(input: string | File): Promise<ParseState> {
  if (typeof input === 'string') {
    const trimmed = input.trim()
    if (!trimmed) {
      return { state: 'empty' }
    }

    if (trimmed.includes('-----BEGIN')) {
      const { entries: parsedEntries, warnings: parsedWarnings } = await parsePem(trimmed)
      return { state: 'parsed', entries: parsedEntries, warnings: parsedWarnings }
    }

    if (isBase64Input(trimmed)) {
      const buffer = base64ToArrayBuffer(trimmed)
      const parsedEntries = await parseDer(buffer, t('certificateTab', { index: 1 }))
      return { state: 'parsed', entries: parsedEntries, warnings: [] }
    }

    throw new Error(t('invalidInput'))
  }

  const preview = await input.slice(0, 2048).text()
  if (preview.includes('-----BEGIN')) {
    const text = await input.text()
    const { entries: parsedEntries, warnings: parsedWarnings } = await parsePem(text)
    return { state: 'parsed', entries: parsedEntries, warnings: parsedWarnings }
  }

  const buffer = await input.arrayBuffer()
  const parsedEntries = await parseDer(buffer, input.name || t('certificateTab', { index: 1 }))
  return { state: 'parsed', entries: parsedEntries, warnings: [] }
}

async function parsePem(text: string): Promise<{ entries: ParsedEntry[]; warnings: string[] }> {
  const blocks = extractPemBlocks(text)
  if (blocks.length === 0) {
    throw new Error(t('invalidPem'))
  }

  const entries: ParsedEntry[] = []
  const warnings: string[] = []
  let certificateIndex = 0
  let publicKeyIndex = 0

  for (const block of blocks) {
    const label = block.label.toUpperCase()
    if (isCertificateLabel(label)) {
      certificateIndex += 1
      const entryLabel = t('certificateTab', { index: certificateIndex })
      try {
        entries.push(await parseCertificate(block.der, entryLabel))
      } catch {
        warnings.push(`${t('parseFailed')} (${block.label})`)
      }
      continue
    }

    if (label === 'PUBLIC KEY') {
      publicKeyIndex += 1
      const entryLabel = t('publicKeyTab', { index: publicKeyIndex })
      try {
        entries.push(await parsePublicKey(block.der, entryLabel))
      } catch {
        warnings.push(`${t('parseFailed')} (${block.label})`)
      }
      continue
    }

    warnings.push(t('unsupportedPemBlock', { label: block.label }))
  }

  if (entries.length === 0) {
    throw new Error(warnings[0] ?? t('parseFailed'))
  }

  return { entries, warnings }
}

async function parseDer(buffer: ArrayBuffer, label: string): Promise<ParsedEntry[]> {
  try {
    const cert = await parseCertificate(buffer, label)
    return [cert]
  } catch {
    // Continue to public key parsing.
  }

  try {
    const key = await parsePublicKey(buffer, label)
    return [key]
  } catch {
    throw new Error(t('parseFailed'))
  }
}

async function parseCertificate(buffer: ArrayBuffer, label: string): Promise<CertificateEntry> {
  const cert = new X509Certificate(buffer)
  const publicKey = cert.publicKey
  const keyInfo = describeKey(publicKey)

  return {
    type: 'certificate',
    label,
    subject: cert.subject,
    issuer: cert.issuer,
    serialNumber: formatHexString(cert.serialNumber),
    notBefore: cert.notBefore.toISOString(),
    notAfter: cert.notAfter.toISOString(),
    signatureAlgorithm: formatAlgorithm(cert.signatureAlgorithm as AlgorithmInfo),
    publicKeyAlgorithm: keyInfo.algorithm,
    publicKeySize: keyInfo.size,
    publicKeyCurve: keyInfo.curve,
    fingerprints: await computeFingerprints(cert.rawData),
    extensions: extractExtensions(cert),
  }
}

async function parsePublicKey(buffer: ArrayBuffer, label: string): Promise<PublicKeyEntry> {
  const publicKey = new PublicKey(buffer)
  const keyInfo = describeKey(publicKey)

  return {
    type: 'publicKey',
    label,
    algorithm: keyInfo.algorithm,
    keySize: keyInfo.size,
    curve: keyInfo.curve,
    fingerprints: await computeFingerprints(publicKey.rawData),
  }
}

function describeKey(publicKey: PublicKey): { algorithm: string; size?: number; curve?: string } {
  const algorithm = publicKey.algorithm as AlgorithmInfo

  return {
    algorithm: formatAlgorithm(algorithm),
    size: typeof algorithm.modulusLength === 'number' ? algorithm.modulusLength : undefined,
    curve: algorithm.namedCurve,
  }
}

function extractExtensions(cert: X509Certificate): CertificateExtensions {
  const extensions: CertificateExtensions = {}

  const subjectAltName = cert.getExtension(SubjectAlternativeNameExtension)
  if (subjectAltName?.names?.items?.length) {
    extensions.subjectAlternativeNames = subjectAltName.names.items.map((item) =>
      formatGeneralName(item.type, item.value),
    )
  }

  const keyUsage = cert.getExtension(KeyUsagesExtension)
  if (keyUsage) {
    const usageList = keyUsageLabels
      .filter(([flag]) => (keyUsage.usages & flag) === flag)
      .map(([, label]) => label)

    if (usageList.length) {
      extensions.keyUsage = usageList
    }
  }

  const extendedKeyUsage = cert.getExtension(ExtendedKeyUsageExtension)
  if (extendedKeyUsage) {
    const usageList = extendedKeyUsage.usages.map(
      (usage) => extendedKeyUsageLabels[usage as string] ?? String(usage),
    )

    if (usageList.length) {
      extensions.extendedKeyUsage = usageList
    }
  }

  const basicConstraints = cert.getExtension(BasicConstraintsExtension)
  if (basicConstraints) {
    const pathLength =
      typeof basicConstraints.pathLength === 'number'
        ? `, Path Length: ${basicConstraints.pathLength}`
        : ''
    extensions.basicConstraints = `CA: ${basicConstraints.ca}${pathLength}`
  }

  const subjectKeyIdentifier = cert.getExtension(SubjectKeyIdentifierExtension)
  if (subjectKeyIdentifier?.keyId) {
    extensions.subjectKeyIdentifier = formatHexString(subjectKeyIdentifier.keyId)
  }

  const authorityKeyIdentifier = cert.getExtension(AuthorityKeyIdentifierExtension)
  if (authorityKeyIdentifier?.keyId) {
    extensions.authorityKeyIdentifier = formatHexString(authorityKeyIdentifier.keyId)
  }

  return extensions
}

const keyUsageLabels: Array<[number, string]> = [
  [KeyUsageFlags.digitalSignature, 'Digital Signature'],
  [KeyUsageFlags.nonRepudiation, 'Non Repudiation'],
  [KeyUsageFlags.keyEncipherment, 'Key Encipherment'],
  [KeyUsageFlags.dataEncipherment, 'Data Encipherment'],
  [KeyUsageFlags.keyAgreement, 'Key Agreement'],
  [KeyUsageFlags.keyCertSign, 'Key Cert Sign'],
  [KeyUsageFlags.cRLSign, 'CRL Sign'],
  [KeyUsageFlags.encipherOnly, 'Encipher Only'],
  [KeyUsageFlags.decipherOnly, 'Decipher Only'],
]

const extendedKeyUsageLabels: Record<string, string> = {
  [ExtendedKeyUsage.serverAuth]: 'TLS Web Server Authentication',
  [ExtendedKeyUsage.clientAuth]: 'TLS Web Client Authentication',
  [ExtendedKeyUsage.codeSigning]: 'Code Signing',
  [ExtendedKeyUsage.emailProtection]: 'Email Protection',
  [ExtendedKeyUsage.timeStamping]: 'Time Stamping',
  [ExtendedKeyUsage.ocspSigning]: 'OCSP Signing',
}

const generalNameLabels: Record<string, string> = {
  dns: 'DNS',
  dn: 'DN',
  email: 'Email',
  ip: 'IP',
  url: 'URI',
  guid: 'GUID',
  upn: 'UPN',
  id: 'Registered ID',
}

function formatGeneralName(type: string, value: string): string {
  const label = generalNameLabels[type] ?? type
  return `${label}: ${value}`
}

function extractPemBlocks(input: string): Array<{ label: string; der: ArrayBuffer }> {
  const blocks: Array<{ label: string; der: ArrayBuffer }> = []
  const pattern = /-----BEGIN ([^-]+)-----([\s\S]*?)-----END \1-----/g

  for (const match of input.matchAll(pattern)) {
    const label = match[1]?.trim()
    const body = match[2]?.replace(/[\r\n\s]/g, '')
    if (!label || !body) {
      continue
    }
    try {
      blocks.push({ label, der: base64ToArrayBuffer(body) })
    } catch {
      // Skip invalid blocks
    }
  }

  return blocks
}

function isCertificateLabel(label: string): boolean {
  const normalized = label.toUpperCase()
  return normalized.includes('CERTIFICATE') && !normalized.includes('REQUEST')
}

function isBase64Input(value: string): boolean {
  const cleaned = value.replace(/\s+/g, '')
  if (!cleaned) return false
  return /^[A-Za-z0-9+/=]+$/.test(cleaned)
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

function formatAlgorithm(algorithm: AlgorithmInfo): string {
  if (!algorithm || typeof algorithm !== 'object' || !('name' in algorithm)) {
    return t('notAvailable')
  }

  const name = algorithm.name
  if (algorithm.hash && typeof algorithm.hash === 'object' && 'name' in algorithm.hash) {
    return `${name} (${algorithm.hash.name})`
  }

  return name
}

async function computeFingerprints(buffer: ArrayBuffer): Promise<Fingerprints> {
  const [sha1, sha256] = await Promise.all([
    crypto.subtle.digest('SHA-1', buffer),
    crypto.subtle.digest('SHA-256', buffer),
  ])

  return {
    sha1: formatHex(sha1),
    sha256: formatHex(sha256),
  }
}

function formatHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join(':')
    .toUpperCase()
}

function formatHexString(value: string): string {
  const cleaned = value.replace(/^0x/i, '').replace(/[^0-9a-fA-F]/g, '')
  if (!cleaned) return value
  const pairs = cleaned.match(/.{1,2}/g)
  return pairs ? pairs.join(':').toUpperCase() : cleaned.toUpperCase()
}
</script>

<style scoped>
.monospace-input :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

.input-hint {
  display: block;
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "inputTitle": "Certificate or Public Key",
    "inputPlaceholder": "Paste PEM/DER content or drop a file...",
    "inputHint": "Supported: X.509 certificates (PEM/DER) and PUBLIC KEY (SPKI). Multiple PEM blocks are supported.",
    "resultsTitle": "Parsed Result",
    "parseErrorTitle": "Parsing Error",
    "warningsTitle": "Warnings",
    "invalidInput": "Unrecognized input format. Provide PEM/DER data.",
    "invalidPem": "No valid PEM blocks found.",
    "parseFailed": "Unable to parse as a certificate or public key.",
    "unsupportedPemBlock": "Unsupported PEM block: {label}",
    "certificateTab": "Certificate {index}",
    "publicKeyTab": "Public Key {index}",
    "certificate": "Certificate",
    "publicKey": "Public Key",
    "overview": "Overview",
    "subjectIssuer": "Subject & Issuer",
    "validity": "Validity",
    "keyAlgorithm": "Key Algorithm",
    "keySize": "Key Size",
    "curve": "Curve",
    "serialNumber": "Serial Number",
    "signatureAlgorithm": "Signature Algorithm",
    "subject": "Subject",
    "issuer": "Issuer",
    "notBefore": "Not Before",
    "notAfter": "Not After",
    "fingerprints": "Fingerprints",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Extensions",
    "subjectAltName": "Subject Alternative Name",
    "keyUsage": "Key Usage",
    "extendedKeyUsage": "Extended Key Usage",
    "basicConstraints": "Basic Constraints",
    "subjectKeyIdentifier": "Subject Key Identifier",
    "authorityKeyIdentifier": "Authority Key Identifier",
    "notAvailable": "Not available",
    "bits": "bits"
  },
  "zh": {
    "inputTitle": "证书或公钥",
    "inputPlaceholder": "粘贴 PEM/DER 内容或拖放文件...",
    "inputHint": "支持：X.509 证书（PEM/DER）和 PUBLIC KEY（SPKI）。支持多个 PEM 块。",
    "resultsTitle": "解析结果",
    "parseErrorTitle": "解析错误",
    "warningsTitle": "警告",
    "invalidInput": "无法识别的输入格式。请提供 PEM/DER 数据。",
    "invalidPem": "未找到有效的 PEM 块。",
    "parseFailed": "无法解析为证书或公钥。",
    "unsupportedPemBlock": "不支持的 PEM 块：{label}",
    "certificateTab": "证书 {index}",
    "publicKeyTab": "公钥 {index}",
    "certificate": "证书",
    "publicKey": "公钥",
    "overview": "概览",
    "subjectIssuer": "主体与颁发者",
    "validity": "有效期",
    "keyAlgorithm": "密钥算法",
    "keySize": "密钥长度",
    "curve": "曲线",
    "serialNumber": "序列号",
    "signatureAlgorithm": "签名算法",
    "subject": "主体",
    "issuer": "颁发者",
    "notBefore": "起始时间",
    "notAfter": "截止时间",
    "fingerprints": "指纹",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "扩展",
    "subjectAltName": "主题备用名称",
    "keyUsage": "密钥用法",
    "extendedKeyUsage": "扩展密钥用法",
    "basicConstraints": "基本约束",
    "subjectKeyIdentifier": "主题密钥标识符",
    "authorityKeyIdentifier": "颁发者密钥标识符",
    "notAvailable": "不可用",
    "bits": "位"
  },
  "zh-CN": {
    "inputTitle": "证书或公钥",
    "inputPlaceholder": "粘贴 PEM/DER 内容或拖放文件...",
    "inputHint": "支持：X.509 证书（PEM/DER）和 PUBLIC KEY（SPKI）。支持多个 PEM 块。",
    "resultsTitle": "解析结果",
    "parseErrorTitle": "解析错误",
    "warningsTitle": "警告",
    "invalidInput": "无法识别的输入格式。请提供 PEM/DER 数据。",
    "invalidPem": "未找到有效的 PEM 块。",
    "parseFailed": "无法解析为证书或公钥。",
    "unsupportedPemBlock": "不支持的 PEM 块：{label}",
    "certificateTab": "证书 {index}",
    "publicKeyTab": "公钥 {index}",
    "certificate": "证书",
    "publicKey": "公钥",
    "overview": "概览",
    "subjectIssuer": "主体与颁发者",
    "validity": "有效期",
    "keyAlgorithm": "密钥算法",
    "keySize": "密钥长度",
    "curve": "曲线",
    "serialNumber": "序列号",
    "signatureAlgorithm": "签名算法",
    "subject": "主体",
    "issuer": "颁发者",
    "notBefore": "起始时间",
    "notAfter": "截止时间",
    "fingerprints": "指纹",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "扩展",
    "subjectAltName": "主题备用名称",
    "keyUsage": "密钥用法",
    "extendedKeyUsage": "扩展密钥用法",
    "basicConstraints": "基本约束",
    "subjectKeyIdentifier": "主题密钥标识符",
    "authorityKeyIdentifier": "颁发者密钥标识符",
    "notAvailable": "不可用",
    "bits": "位"
  },
  "zh-TW": {
    "inputTitle": "憑證或公鑰",
    "inputPlaceholder": "貼上 PEM/DER 內容或拖放檔案...",
    "inputHint": "支援：X.509 憑證（PEM/DER）與 PUBLIC KEY（SPKI）。支援多個 PEM 區塊。",
    "resultsTitle": "解析結果",
    "parseErrorTitle": "解析錯誤",
    "warningsTitle": "警告",
    "invalidInput": "無法辨識的輸入格式。請提供 PEM/DER 資料。",
    "invalidPem": "未找到有效的 PEM 區塊。",
    "parseFailed": "無法解析為憑證或公鑰。",
    "unsupportedPemBlock": "不支援的 PEM 區塊：{label}",
    "certificateTab": "憑證 {index}",
    "publicKeyTab": "公鑰 {index}",
    "certificate": "憑證",
    "publicKey": "公鑰",
    "overview": "概覽",
    "subjectIssuer": "主體與簽發者",
    "validity": "有效期",
    "keyAlgorithm": "金鑰演算法",
    "keySize": "金鑰長度",
    "curve": "曲線",
    "serialNumber": "序號",
    "signatureAlgorithm": "簽章演算法",
    "subject": "主體",
    "issuer": "簽發者",
    "notBefore": "起始時間",
    "notAfter": "截止時間",
    "fingerprints": "指紋",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "擴充",
    "subjectAltName": "主體替代名稱",
    "keyUsage": "金鑰用途",
    "extendedKeyUsage": "擴充金鑰用途",
    "basicConstraints": "基本約束",
    "subjectKeyIdentifier": "主體金鑰識別碼",
    "authorityKeyIdentifier": "簽發者金鑰識別碼",
    "notAvailable": "不可用",
    "bits": "位元"
  },
  "zh-HK": {
    "inputTitle": "證書或公鑰",
    "inputPlaceholder": "貼上 PEM/DER 內容或拖放檔案...",
    "inputHint": "支援：X.509 證書（PEM/DER）及 PUBLIC KEY（SPKI）。支援多個 PEM 區塊。",
    "resultsTitle": "解析結果",
    "parseErrorTitle": "解析錯誤",
    "warningsTitle": "警告",
    "invalidInput": "無法辨識的輸入格式。請提供 PEM/DER 資料。",
    "invalidPem": "未找到有效的 PEM 區塊。",
    "parseFailed": "無法解析為證書或公鑰。",
    "unsupportedPemBlock": "不支援的 PEM 區塊：{label}",
    "certificateTab": "證書 {index}",
    "publicKeyTab": "公鑰 {index}",
    "certificate": "證書",
    "publicKey": "公鑰",
    "overview": "概覽",
    "subjectIssuer": "主體與簽發者",
    "validity": "有效期",
    "keyAlgorithm": "金鑰演算法",
    "keySize": "金鑰長度",
    "curve": "曲線",
    "serialNumber": "序號",
    "signatureAlgorithm": "簽署演算法",
    "subject": "主體",
    "issuer": "簽發者",
    "notBefore": "起始時間",
    "notAfter": "截止時間",
    "fingerprints": "指紋",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "擴展",
    "subjectAltName": "主體替代名稱",
    "keyUsage": "金鑰用途",
    "extendedKeyUsage": "擴展金鑰用途",
    "basicConstraints": "基本約束",
    "subjectKeyIdentifier": "主體金鑰識別碼",
    "authorityKeyIdentifier": "簽發者金鑰識別碼",
    "notAvailable": "不可用",
    "bits": "位元"
  },
  "es": {
    "inputTitle": "Certificado o clave pública",
    "inputPlaceholder": "Pega contenido PEM/DER o suelta un archivo...",
    "inputHint": "Compatibles: certificados X.509 (PEM/DER) y PUBLIC KEY (SPKI). Se admiten varios bloques PEM.",
    "resultsTitle": "Resultado del análisis",
    "parseErrorTitle": "Error de análisis",
    "warningsTitle": "Advertencias",
    "invalidInput": "Formato de entrada no reconocido. Proporciona datos PEM/DER.",
    "invalidPem": "No se encontraron bloques PEM válidos.",
    "parseFailed": "No se pudo analizar como certificado o clave pública.",
    "unsupportedPemBlock": "Bloque PEM no compatible: {label}",
    "certificateTab": "Certificado {index}",
    "publicKeyTab": "Clave Pública {index}",
    "certificate": "Certificado",
    "publicKey": "Clave Pública",
    "overview": "Resumen",
    "subjectIssuer": "Sujeto y emisor",
    "validity": "Validez",
    "keyAlgorithm": "Algoritmo de clave",
    "keySize": "Tamaño de clave",
    "curve": "Curva",
    "serialNumber": "Número de serie",
    "signatureAlgorithm": "Algoritmo de firma",
    "subject": "Sujeto",
    "issuer": "Emisor",
    "notBefore": "No antes de",
    "notAfter": "No después de",
    "fingerprints": "Huellas digitales",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Extensiones",
    "subjectAltName": "Nombre alternativo del sujeto",
    "keyUsage": "Uso de la clave",
    "extendedKeyUsage": "Uso extendido de la clave",
    "basicConstraints": "Restricciones básicas",
    "subjectKeyIdentifier": "Identificador de clave del sujeto",
    "authorityKeyIdentifier": "Identificador de clave de la autoridad",
    "notAvailable": "No disponible",
    "bits": "bits"
  },
  "fr": {
    "inputTitle": "Certificat ou clé publique",
    "inputPlaceholder": "Collez du contenu PEM/DER ou déposez un fichier...",
    "inputHint": "Pris en charge : certificats X.509 (PEM/DER) et PUBLIC KEY (SPKI). Plusieurs blocs PEM sont pris en charge.",
    "resultsTitle": "Résultat d'analyse",
    "parseErrorTitle": "Erreur d'analyse",
    "warningsTitle": "Avertissements",
    "invalidInput": "Format d'entrée non reconnu. Fournissez des données PEM/DER.",
    "invalidPem": "Aucun bloc PEM valide trouvé.",
    "parseFailed": "Impossible d'analyser comme certificat ou clé publique.",
    "unsupportedPemBlock": "Bloc PEM non pris en charge : {label}",
    "certificateTab": "Certificat {index}",
    "publicKeyTab": "Clé Publique {index}",
    "certificate": "Certificat",
    "publicKey": "Clé Publique",
    "overview": "Aperçu",
    "subjectIssuer": "Sujet et émetteur",
    "validity": "Validité",
    "keyAlgorithm": "Algorithme de clé",
    "keySize": "Taille de clé",
    "curve": "Courbe",
    "serialNumber": "Numéro de série",
    "signatureAlgorithm": "Algorithme de signature",
    "subject": "Sujet",
    "issuer": "Émetteur",
    "notBefore": "Pas avant",
    "notAfter": "Pas après",
    "fingerprints": "Empreintes",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Extensions",
    "subjectAltName": "Nom alternatif du sujet",
    "keyUsage": "Utilisation de la clé",
    "extendedKeyUsage": "Utilisation étendue de la clé",
    "basicConstraints": "Contraintes de base",
    "subjectKeyIdentifier": "Identifiant de clé du sujet",
    "authorityKeyIdentifier": "Identifiant de clé d'autorité",
    "notAvailable": "Indisponible",
    "bits": "bits"
  },
  "de": {
    "inputTitle": "Zertifikat oder öffentlicher Schlüssel",
    "inputPlaceholder": "PEM/DER-Inhalt einfügen oder Datei ablegen...",
    "inputHint": "Unterstützt: X.509-Zertifikate (PEM/DER) und PUBLIC KEY (SPKI). Mehrere PEM-Blöcke werden unterstützt.",
    "resultsTitle": "Analyseergebnis",
    "parseErrorTitle": "Analysefehler",
    "warningsTitle": "Warnungen",
    "invalidInput": "Nicht erkanntes Eingabeformat. Bitte PEM/DER-Daten angeben.",
    "invalidPem": "Keine gültigen PEM-Blöcke gefunden.",
    "parseFailed": "Konnte nicht als Zertifikat oder öffentlicher Schlüssel analysiert werden.",
    "unsupportedPemBlock": "Nicht unterstützter PEM-Block: {label}",
    "certificateTab": "Zertifikat {index}",
    "publicKeyTab": "Öffentlicher Schlüssel {index}",
    "certificate": "Zertifikat",
    "publicKey": "Öffentlicher Schlüssel",
    "overview": "Übersicht",
    "subjectIssuer": "Subjekt und Aussteller",
    "validity": "Gültigkeit",
    "keyAlgorithm": "Schlüsselalgorithmus",
    "keySize": "Schlüsselgröße",
    "curve": "Kurve",
    "serialNumber": "Seriennummer",
    "signatureAlgorithm": "Signaturalgorithmus",
    "subject": "Subjekt",
    "issuer": "Aussteller",
    "notBefore": "Nicht vor",
    "notAfter": "Nicht nach",
    "fingerprints": "Fingerabdrücke",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Erweiterungen",
    "subjectAltName": "Subjekt-Alternativname",
    "keyUsage": "Schlüsselverwendung",
    "extendedKeyUsage": "Erweiterte Schlüsselverwendung",
    "basicConstraints": "Grundlegende Einschränkungen",
    "subjectKeyIdentifier": "Subjektschlüsselkennung",
    "authorityKeyIdentifier": "Ausstellerschlüsselkennung",
    "notAvailable": "Nicht verfügbar",
    "bits": "Bit"
  },
  "it": {
    "inputTitle": "Certificato o chiave pubblica",
    "inputPlaceholder": "Incolla contenuto PEM/DER o trascina un file...",
    "inputHint": "Supporta: certificati X.509 (PEM/DER) e PUBLIC KEY (SPKI). Sono supportati più blocchi PEM.",
    "resultsTitle": "Risultato dell'analisi",
    "parseErrorTitle": "Errore di analisi",
    "warningsTitle": "Avvisi",
    "invalidInput": "Formato di input non riconosciuto. Fornisci dati PEM/DER.",
    "invalidPem": "Nessun blocco PEM valido trovato.",
    "parseFailed": "Impossibile analizzare come certificato o chiave pubblica.",
    "unsupportedPemBlock": "Blocco PEM non supportato: {label}",
    "certificateTab": "Certificato {index}",
    "publicKeyTab": "Chiave Pubblica {index}",
    "certificate": "Certificato",
    "publicKey": "Chiave Pubblica",
    "overview": "Panoramica",
    "subjectIssuer": "Soggetto e emittente",
    "validity": "Validità",
    "keyAlgorithm": "Algoritmo della chiave",
    "keySize": "Dimensione chiave",
    "curve": "Curva",
    "serialNumber": "Numero di serie",
    "signatureAlgorithm": "Algoritmo di firma",
    "subject": "Soggetto",
    "issuer": "Emittente",
    "notBefore": "Non prima",
    "notAfter": "Non dopo",
    "fingerprints": "Impronte digitali",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Estensioni",
    "subjectAltName": "Nome alternativo del soggetto",
    "keyUsage": "Uso della chiave",
    "extendedKeyUsage": "Uso esteso della chiave",
    "basicConstraints": "Vincoli di base",
    "subjectKeyIdentifier": "Identificatore chiave del soggetto",
    "authorityKeyIdentifier": "Identificatore chiave dell'autorità",
    "notAvailable": "Non disponibile",
    "bits": "bit"
  },
  "ja": {
    "inputTitle": "証明書または公開鍵",
    "inputPlaceholder": "PEM/DER 内容を貼り付けるかファイルをドロップ...",
    "inputHint": "対応：X.509 証明書（PEM/DER）と PUBLIC KEY（SPKI）。複数の PEM ブロックに対応します。",
    "resultsTitle": "解析結果",
    "parseErrorTitle": "解析エラー",
    "warningsTitle": "警告",
    "invalidInput": "入力形式を認識できません。PEM/DER データを指定してください。",
    "invalidPem": "有効な PEM ブロックが見つかりません。",
    "parseFailed": "証明書または公開鍵として解析できません。",
    "unsupportedPemBlock": "未対応の PEM ブロック：{label}",
    "certificateTab": "証明書 {index}",
    "publicKeyTab": "公開鍵 {index}",
    "certificate": "証明書",
    "publicKey": "公開鍵",
    "overview": "概要",
    "subjectIssuer": "サブジェクトと発行者",
    "validity": "有効期間",
    "keyAlgorithm": "鍵アルゴリズム",
    "keySize": "キーサイズ",
    "curve": "曲線",
    "serialNumber": "シリアル番号",
    "signatureAlgorithm": "署名アルゴリズム",
    "subject": "サブジェクト",
    "issuer": "発行者",
    "notBefore": "有効開始",
    "notAfter": "有効終了",
    "fingerprints": "フィンガープリント",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "拡張",
    "subjectAltName": "サブジェクト代替名",
    "keyUsage": "鍵用途",
    "extendedKeyUsage": "拡張鍵用途",
    "basicConstraints": "基本制約",
    "subjectKeyIdentifier": "サブジェクト鍵識別子",
    "authorityKeyIdentifier": "認証局鍵識別子",
    "notAvailable": "利用不可",
    "bits": "ビット"
  },
  "ko": {
    "inputTitle": "인증서 또는 공개 키",
    "inputPlaceholder": "PEM/DER 내용을 붙여넣거나 파일을 드롭하세요...",
    "inputHint": "지원: X.509 인증서(PEM/DER) 및 PUBLIC KEY(SPKI). 여러 PEM 블록을 지원합니다.",
    "resultsTitle": "분석 결과",
    "parseErrorTitle": "분석 오류",
    "warningsTitle": "경고",
    "invalidInput": "인식할 수 없는 입력 형식입니다. PEM/DER 데이터를 제공하세요.",
    "invalidPem": "유효한 PEM 블록을 찾을 수 없습니다.",
    "parseFailed": "인증서 또는 공개 키로 분석할 수 없습니다.",
    "unsupportedPemBlock": "지원되지 않는 PEM 블록: {label}",
    "certificateTab": "인증서 {index}",
    "publicKeyTab": "공개 키 {index}",
    "certificate": "인증서",
    "publicKey": "공개 키",
    "overview": "개요",
    "subjectIssuer": "주체 및 발급자",
    "validity": "유효 기간",
    "keyAlgorithm": "키 알고리즘",
    "keySize": "키 크기",
    "curve": "곡선",
    "serialNumber": "일련 번호",
    "signatureAlgorithm": "서명 알고리즘",
    "subject": "주체",
    "issuer": "발급자",
    "notBefore": "유효 시작",
    "notAfter": "유효 종료",
    "fingerprints": "지문",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "확장",
    "subjectAltName": "주체 대체 이름",
    "keyUsage": "키 사용",
    "extendedKeyUsage": "확장 키 사용",
    "basicConstraints": "기본 제약",
    "subjectKeyIdentifier": "주체 키 식별자",
    "authorityKeyIdentifier": "발급자 키 식별자",
    "notAvailable": "사용할 수 없음",
    "bits": "비트"
  },
  "ru": {
    "inputTitle": "Сертификат или открытый ключ",
    "inputPlaceholder": "Вставьте содержимое PEM/DER или перетащите файл...",
    "inputHint": "Поддерживаются: сертификаты X.509 (PEM/DER) и PUBLIC KEY (SPKI). Поддерживаются несколько PEM-блоков.",
    "resultsTitle": "Результат разбора",
    "parseErrorTitle": "Ошибка разбора",
    "warningsTitle": "Предупреждения",
    "invalidInput": "Нераспознанный формат ввода. Предоставьте данные PEM/DER.",
    "invalidPem": "Не найдены действительные PEM-блоки.",
    "parseFailed": "Не удалось разобрать как сертификат или открытый ключ.",
    "unsupportedPemBlock": "Неподдерживаемый PEM-блок: {label}",
    "certificateTab": "Сертификат {index}",
    "publicKeyTab": "Открытый Ключ {index}",
    "certificate": "Сертификат",
    "publicKey": "Открытый Ключ",
    "overview": "Обзор",
    "subjectIssuer": "Субъект и издатель",
    "validity": "Срок действия",
    "keyAlgorithm": "Алгоритм ключа",
    "keySize": "Размер ключа",
    "curve": "Кривая",
    "serialNumber": "Серийный номер",
    "signatureAlgorithm": "Алгоритм подписи",
    "subject": "Субъект",
    "issuer": "Издатель",
    "notBefore": "Не раньше",
    "notAfter": "Не позже",
    "fingerprints": "Отпечатки",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Расширения",
    "subjectAltName": "Альтернативное имя субъекта",
    "keyUsage": "Назначение ключа",
    "extendedKeyUsage": "Расширенное назначение ключа",
    "basicConstraints": "Основные ограничения",
    "subjectKeyIdentifier": "Идентификатор ключа субъекта",
    "authorityKeyIdentifier": "Идентификатор ключа издателя",
    "notAvailable": "Недоступно",
    "bits": "бит"
  },
  "pt": {
    "inputTitle": "Certificado ou chave pública",
    "inputPlaceholder": "Cole conteúdo PEM/DER ou solte um arquivo...",
    "inputHint": "Suportado: certificados X.509 (PEM/DER) e PUBLIC KEY (SPKI). Vários blocos PEM são suportados.",
    "resultsTitle": "Resultado da análise",
    "parseErrorTitle": "Erro de análise",
    "warningsTitle": "Avisos",
    "invalidInput": "Formato de entrada não reconhecido. Forneça dados PEM/DER.",
    "invalidPem": "Nenhum bloco PEM válido encontrado.",
    "parseFailed": "Não foi possível analisar como certificado ou chave pública.",
    "unsupportedPemBlock": "Bloco PEM não suportado: {label}",
    "certificateTab": "Certificado {index}",
    "publicKeyTab": "Chave Pública {index}",
    "certificate": "Certificado",
    "publicKey": "Chave Pública",
    "overview": "Visão geral",
    "subjectIssuer": "Sujeito e emissor",
    "validity": "Validade",
    "keyAlgorithm": "Algoritmo da chave",
    "keySize": "Tamanho da chave",
    "curve": "Curva",
    "serialNumber": "Número de série",
    "signatureAlgorithm": "Algoritmo de assinatura",
    "subject": "Sujeito",
    "issuer": "Emissor",
    "notBefore": "Não antes de",
    "notAfter": "Não depois de",
    "fingerprints": "Impressões digitais",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Extensões",
    "subjectAltName": "Nome alternativo do sujeito",
    "keyUsage": "Uso da chave",
    "extendedKeyUsage": "Uso estendido da chave",
    "basicConstraints": "Restrições básicas",
    "subjectKeyIdentifier": "Identificador da chave do sujeito",
    "authorityKeyIdentifier": "Identificador da chave da autoridade",
    "notAvailable": "Indisponível",
    "bits": "bits"
  },
  "ar": {
    "inputTitle": "الشهادة أو المفتاح العام",
    "inputPlaceholder": "الصق محتوى PEM/DER أو أسقط ملفًا...",
    "inputHint": "المدعوم: شهادات X.509 (PEM/DER) و PUBLIC KEY (SPKI). يتم دعم كتل PEM متعددة.",
    "resultsTitle": "نتيجة التحليل",
    "parseErrorTitle": "خطأ في التحليل",
    "warningsTitle": "تحذيرات",
    "invalidInput": "تنسيق إدخال غير معروف. يرجى توفير بيانات PEM/DER.",
    "invalidPem": "لم يتم العثور على كتل PEM صالحة.",
    "parseFailed": "تعذر التحليل كشهادة أو مفتاح عام.",
    "unsupportedPemBlock": "كتلة PEM غير مدعومة: {label}",
    "certificateTab": "شهادة {index}",
    "publicKeyTab": "المفتاح العام {index}",
    "certificate": "شهادة",
    "publicKey": "المفتاح العام",
    "overview": "نظرة عامة",
    "subjectIssuer": "الموضوع والجهة المُصدِرة",
    "validity": "الصلاحية",
    "keyAlgorithm": "خوارزمية المفتاح",
    "keySize": "حجم المفتاح",
    "curve": "المنحنى",
    "serialNumber": "الرقم التسلسلي",
    "signatureAlgorithm": "خوارزمية التوقيع",
    "subject": "الموضوع",
    "issuer": "الجهة المُصدِرة",
    "notBefore": "غير صالح قبل",
    "notAfter": "غير صالح بعد",
    "fingerprints": "البصمات",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "الامتدادات",
    "subjectAltName": "الاسم البديل للموضوع",
    "keyUsage": "استخدام المفتاح",
    "extendedKeyUsage": "استخدام المفتاح الموسّع",
    "basicConstraints": "القيود الأساسية",
    "subjectKeyIdentifier": "معرّف مفتاح الموضوع",
    "authorityKeyIdentifier": "معرّف مفتاح الجهة المُصدِرة",
    "notAvailable": "غير متاح",
    "bits": "بت"
  },
  "hi": {
    "inputTitle": "प्रमाणपत्र या सार्वजनिक कुंजी",
    "inputPlaceholder": "PEM/DER सामग्री पेस्ट करें या फ़ाइल ड्रॉप करें...",
    "inputHint": "समर्थित: X.509 प्रमाणपत्र (PEM/DER) और PUBLIC KEY (SPKI)। कई PEM ब्लॉक समर्थित हैं।",
    "resultsTitle": "पार्स परिणाम",
    "parseErrorTitle": "पार्सिंग त्रुटि",
    "warningsTitle": "चेतावनियाँ",
    "invalidInput": "इनपुट प्रारूप पहचाना नहीं गया। PEM/DER डेटा प्रदान करें।",
    "invalidPem": "कोई वैध PEM ब्लॉक नहीं मिला।",
    "parseFailed": "प्रमाणपत्र या सार्वजनिक कुंजी के रूप में पार्स नहीं किया जा सका।",
    "unsupportedPemBlock": "असमर्थित PEM ब्लॉक: {label}",
    "certificateTab": "प्रमाणपत्र {index}",
    "publicKeyTab": "सार्वजनिक कुंजी {index}",
    "certificate": "प्रमाणपत्र",
    "publicKey": "सार्वजनिक कुंजी",
    "overview": "सारांश",
    "subjectIssuer": "विषय और जारीकर्ता",
    "validity": "वैधता",
    "keyAlgorithm": "कुंजी एल्गोरिथम",
    "keySize": "कुंजी का आकार",
    "curve": "वक्र",
    "serialNumber": "क्रमांक",
    "signatureAlgorithm": "हस्ताक्षर एल्गोरिथम",
    "subject": "विषय",
    "issuer": "जारीकर्ता",
    "notBefore": "इससे पहले नहीं",
    "notAfter": "इसके बाद नहीं",
    "fingerprints": "फिंगरप्रिंट",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "विस्तार",
    "subjectAltName": "विषय वैकल्पिक नाम",
    "keyUsage": "कुंजी उपयोग",
    "extendedKeyUsage": "विस्तारित कुंजी उपयोग",
    "basicConstraints": "मूल प्रतिबंध",
    "subjectKeyIdentifier": "विषय कुंजी पहचानकर्ता",
    "authorityKeyIdentifier": "जारीकर्ता कुंजी पहचानकर्ता",
    "notAvailable": "उपलब्ध नहीं",
    "bits": "बिट्स"
  },
  "tr": {
    "inputTitle": "Sertifika veya genel anahtar",
    "inputPlaceholder": "PEM/DER içeriğini yapıştırın veya dosya bırakın...",
    "inputHint": "Desteklenen: X.509 sertifikaları (PEM/DER) ve PUBLIC KEY (SPKI). Birden fazla PEM bloğu desteklenir.",
    "resultsTitle": "Ayrıştırma Sonucu",
    "parseErrorTitle": "Ayrıştırma Hatası",
    "warningsTitle": "Uyarılar",
    "invalidInput": "Tanınmayan giriş biçimi. PEM/DER verisi sağlayın.",
    "invalidPem": "Geçerli PEM blokları bulunamadı.",
    "parseFailed": "Sertifika veya genel anahtar olarak ayrıştırılamadı.",
    "unsupportedPemBlock": "Desteklenmeyen PEM bloğu: {label}",
    "certificateTab": "Sertifika {index}",
    "publicKeyTab": "Genel Anahtar {index}",
    "certificate": "Sertifika",
    "publicKey": "Genel Anahtar",
    "overview": "Genel Bakış",
    "subjectIssuer": "Konu ve Düzenleyici",
    "validity": "Geçerlilik",
    "keyAlgorithm": "Anahtar Algoritması",
    "keySize": "Anahtar Boyutu",
    "curve": "Eğri",
    "serialNumber": "Seri Numarası",
    "signatureAlgorithm": "İmza Algoritması",
    "subject": "Konu",
    "issuer": "Düzenleyici",
    "notBefore": "Başlangıç",
    "notAfter": "Bitiş",
    "fingerprints": "Parmak izleri",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Uzantılar",
    "subjectAltName": "Konu Alternatif Adı",
    "keyUsage": "Anahtar Kullanımı",
    "extendedKeyUsage": "Genişletilmiş Anahtar Kullanımı",
    "basicConstraints": "Temel Kısıtlamalar",
    "subjectKeyIdentifier": "Konu Anahtar Tanımlayıcı",
    "authorityKeyIdentifier": "Düzenleyici Anahtar Tanımlayıcı",
    "notAvailable": "Kullanılamaz",
    "bits": "bit"
  },
  "nl": {
    "inputTitle": "Certificaat of publieke sleutel",
    "inputPlaceholder": "Plak PEM/DER-inhoud of sleep een bestand...",
    "inputHint": "Ondersteund: X.509-certificaten (PEM/DER) en PUBLIC KEY (SPKI). Meerdere PEM-blokken worden ondersteund.",
    "resultsTitle": "Geparseerd resultaat",
    "parseErrorTitle": "Parseerfout",
    "warningsTitle": "Waarschuwingen",
    "invalidInput": "Onherkend invoerformaat. Geef PEM/DER-gegevens op.",
    "invalidPem": "Geen geldige PEM-blokken gevonden.",
    "parseFailed": "Kon niet als certificaat of publieke sleutel worden geparseerd.",
    "unsupportedPemBlock": "Niet-ondersteund PEM-blok: {label}",
    "certificateTab": "Certificaat {index}",
    "publicKeyTab": "Publieke Sleutel {index}",
    "certificate": "Certificaat",
    "publicKey": "Publieke Sleutel",
    "overview": "Overzicht",
    "subjectIssuer": "Subject en uitgever",
    "validity": "Geldigheid",
    "keyAlgorithm": "Sleutelalgoritme",
    "keySize": "Sleutelgrootte",
    "curve": "Kromme",
    "serialNumber": "Serienummer",
    "signatureAlgorithm": "Handtekeningalgoritme",
    "subject": "Subject",
    "issuer": "Uitgever",
    "notBefore": "Niet vóór",
    "notAfter": "Niet ná",
    "fingerprints": "Vingerafdrukken",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Extensies",
    "subjectAltName": "Alternatieve naam van subject",
    "keyUsage": "Sleutelgebruik",
    "extendedKeyUsage": "Uitgebreid sleutelgebruik",
    "basicConstraints": "Basisbeperkingen",
    "subjectKeyIdentifier": "Subject-sleutelidentificatie",
    "authorityKeyIdentifier": "Uitgever-sleutelidentificatie",
    "notAvailable": "Niet beschikbaar",
    "bits": "bits"
  },
  "sv": {
    "inputTitle": "Certifikat eller publik nyckel",
    "inputPlaceholder": "Klistra in PEM/DER-innehåll eller släpp en fil...",
    "inputHint": "Stöds: X.509-certifikat (PEM/DER) och PUBLIC KEY (SPKI). Flera PEM-block stöds.",
    "resultsTitle": "Analyserat resultat",
    "parseErrorTitle": "Tolkningsfel",
    "warningsTitle": "Varningar",
    "invalidInput": "Okänt inmatningsformat. Ange PEM/DER-data.",
    "invalidPem": "Inga giltiga PEM-block hittades.",
    "parseFailed": "Kunde inte tolka som certifikat eller publik nyckel.",
    "unsupportedPemBlock": "PEM-block som inte stöds: {label}",
    "certificateTab": "Certifikat {index}",
    "publicKeyTab": "Publik Nyckel {index}",
    "certificate": "Certifikat",
    "publicKey": "Publik Nyckel",
    "overview": "Översikt",
    "subjectIssuer": "Subjekt och utfärdare",
    "validity": "Giltighet",
    "keyAlgorithm": "Nyckelalgoritm",
    "keySize": "Nyckelstorlek",
    "curve": "Kurva",
    "serialNumber": "Serienummer",
    "signatureAlgorithm": "Signaturalgoritm",
    "subject": "Subjekt",
    "issuer": "Utfärdare",
    "notBefore": "Inte före",
    "notAfter": "Inte efter",
    "fingerprints": "Fingeravtryck",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Tillägg",
    "subjectAltName": "Alternativt namn för subjekt",
    "keyUsage": "Nyckelanvändning",
    "extendedKeyUsage": "Utökad nyckelanvändning",
    "basicConstraints": "Grundläggande begränsningar",
    "subjectKeyIdentifier": "Subjektets nyckelidentifierare",
    "authorityKeyIdentifier": "Utfärdarens nyckelidentifierare",
    "notAvailable": "Ej tillgänglig",
    "bits": "bitar"
  },
  "pl": {
    "inputTitle": "Certyfikat lub klucz publiczny",
    "inputPlaceholder": "Wklej zawartość PEM/DER lub upuść plik...",
    "inputHint": "Obsługiwane: certyfikaty X.509 (PEM/DER) i PUBLIC KEY (SPKI). Obsługiwane są wiele bloków PEM.",
    "resultsTitle": "Wynik analizy",
    "parseErrorTitle": "Błąd analizy",
    "warningsTitle": "Ostrzeżenia",
    "invalidInput": "Nierozpoznany format danych wejściowych. Podaj dane PEM/DER.",
    "invalidPem": "Nie znaleziono prawidłowych bloków PEM.",
    "parseFailed": "Nie można przeanalizować jako certyfikat lub klucz publiczny.",
    "unsupportedPemBlock": "Nieobsługiwany blok PEM: {label}",
    "certificateTab": "Certyfikat {index}",
    "publicKeyTab": "Klucz Publiczny {index}",
    "certificate": "Certyfikat",
    "publicKey": "Klucz Publiczny",
    "overview": "Przegląd",
    "subjectIssuer": "Podmiot i wystawca",
    "validity": "Ważność",
    "keyAlgorithm": "Algorytm klucza",
    "keySize": "Rozmiar klucza",
    "curve": "Krzywa",
    "serialNumber": "Numer seryjny",
    "signatureAlgorithm": "Algorytm podpisu",
    "subject": "Podmiot",
    "issuer": "Wystawca",
    "notBefore": "Nie wcześniej niż",
    "notAfter": "Nie później niż",
    "fingerprints": "Odciski palca",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Rozszerzenia",
    "subjectAltName": "Alternatywna nazwa podmiotu",
    "keyUsage": "Użycie klucza",
    "extendedKeyUsage": "Rozszerzone użycie klucza",
    "basicConstraints": "Podstawowe ograniczenia",
    "subjectKeyIdentifier": "Identyfikator klucza podmiotu",
    "authorityKeyIdentifier": "Identyfikator klucza wystawcy",
    "notAvailable": "Niedostępne",
    "bits": "bitów"
  },
  "vi": {
    "inputTitle": "Chứng chỉ hoặc khóa công khai",
    "inputPlaceholder": "Dán nội dung PEM/DER hoặc thả tệp...",
    "inputHint": "Hỗ trợ: chứng chỉ X.509 (PEM/DER) và PUBLIC KEY (SPKI). Hỗ trợ nhiều khối PEM.",
    "resultsTitle": "Kết quả phân tích",
    "parseErrorTitle": "Lỗi phân tích",
    "warningsTitle": "Cảnh báo",
    "invalidInput": "Định dạng đầu vào không được nhận dạng. Cung cấp dữ liệu PEM/DER.",
    "invalidPem": "Không tìm thấy khối PEM hợp lệ.",
    "parseFailed": "Không thể phân tích thành chứng chỉ hoặc khóa công khai.",
    "unsupportedPemBlock": "Khối PEM không được hỗ trợ: {label}",
    "certificateTab": "Chứng chỉ {index}",
    "publicKeyTab": "Khóa Công Khai {index}",
    "certificate": "Chứng chỉ",
    "publicKey": "Khóa Công Khai",
    "overview": "Tổng quan",
    "subjectIssuer": "Chủ thể và tổ chức phát hành",
    "validity": "Hiệu lực",
    "keyAlgorithm": "Thuật toán khóa",
    "keySize": "Kích thước khóa",
    "curve": "Đường cong",
    "serialNumber": "Số sê-ri",
    "signatureAlgorithm": "Thuật toán chữ ký",
    "subject": "Chủ thể",
    "issuer": "Tổ chức phát hành",
    "notBefore": "Không trước",
    "notAfter": "Không sau",
    "fingerprints": "Dấu vân tay",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Phần mở rộng",
    "subjectAltName": "Tên thay thế của chủ thể",
    "keyUsage": "Mục đích sử dụng khóa",
    "extendedKeyUsage": "Mục đích sử dụng khóa mở rộng",
    "basicConstraints": "Ràng buộc cơ bản",
    "subjectKeyIdentifier": "Định danh khóa của chủ thể",
    "authorityKeyIdentifier": "Định danh khóa của cơ quan phát hành",
    "notAvailable": "Không khả dụng",
    "bits": "bit"
  },
  "th": {
    "inputTitle": "ใบรับรองหรือกุญแจสาธารณะ",
    "inputPlaceholder": "วางเนื้อหา PEM/DER หรือวางไฟล์...",
    "inputHint": "รองรับ: ใบรับรอง X.509 (PEM/DER) และ PUBLIC KEY (SPKI) รองรับหลายบล็อก PEM",
    "resultsTitle": "ผลลัพธ์การวิเคราะห์",
    "parseErrorTitle": "ข้อผิดพลาดในการวิเคราะห์",
    "warningsTitle": "คำเตือน",
    "invalidInput": "รูปแบบอินพุตไม่ถูกต้อง โปรดระบุข้อมูล PEM/DER",
    "invalidPem": "ไม่พบบล็อก PEM ที่ถูกต้อง",
    "parseFailed": "ไม่สามารถวิเคราะห์เป็นใบรับรองหรือกุญแจสาธารณะ",
    "unsupportedPemBlock": "บล็อก PEM ที่ไม่รองรับ: {label}",
    "certificateTab": "ใบรับรอง {index}",
    "publicKeyTab": "คีย์สาธารณะ {index}",
    "certificate": "ใบรับรอง",
    "publicKey": "คีย์สาธารณะ",
    "overview": "ภาพรวม",
    "subjectIssuer": "ผู้ถือและผู้ออก",
    "validity": "ระยะเวลาใช้งาน",
    "keyAlgorithm": "อัลกอริทึมของคีย์",
    "keySize": "ขนาดคีย์",
    "curve": "เส้นโค้ง",
    "serialNumber": "หมายเลขซีเรียล",
    "signatureAlgorithm": "อัลกอริทึมลายเซ็น",
    "subject": "ผู้ถือ",
    "issuer": "ผู้ออก",
    "notBefore": "เริ่มใช้",
    "notAfter": "หมดอายุ",
    "fingerprints": "ลายนิ้วมือ",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "ส่วนขยาย",
    "subjectAltName": "ชื่อทางเลือกของผู้ถือ",
    "keyUsage": "การใช้คีย์",
    "extendedKeyUsage": "การใช้คีย์แบบขยาย",
    "basicConstraints": "ข้อจำกัดพื้นฐาน",
    "subjectKeyIdentifier": "ตัวระบุคีย์ของผู้ถือ",
    "authorityKeyIdentifier": "ตัวระบุคีย์ของผู้ออก",
    "notAvailable": "ไม่พร้อมใช้งาน",
    "bits": "บิต"
  },
  "id": {
    "inputTitle": "Sertifikat atau kunci publik",
    "inputPlaceholder": "Tempel konten PEM/DER atau jatuhkan file...",
    "inputHint": "Didukung: sertifikat X.509 (PEM/DER) dan PUBLIC KEY (SPKI). Beberapa blok PEM didukung.",
    "resultsTitle": "Hasil analisis",
    "parseErrorTitle": "Kesalahan analisis",
    "warningsTitle": "Peringatan",
    "invalidInput": "Format input tidak dikenali. Sediakan data PEM/DER.",
    "invalidPem": "Tidak ditemukan blok PEM yang valid.",
    "parseFailed": "Tidak dapat dianalisis sebagai sertifikat atau kunci publik.",
    "unsupportedPemBlock": "Blok PEM tidak didukung: {label}",
    "certificateTab": "Sertifikat {index}",
    "publicKeyTab": "Kunci Publik {index}",
    "certificate": "Sertifikat",
    "publicKey": "Kunci Publik",
    "overview": "Ringkasan",
    "subjectIssuer": "Subjek dan penerbit",
    "validity": "Masa berlaku",
    "keyAlgorithm": "Algoritma kunci",
    "keySize": "Ukuran Kunci",
    "curve": "Kurva",
    "serialNumber": "Nomor seri",
    "signatureAlgorithm": "Algoritma tanda tangan",
    "subject": "Subjek",
    "issuer": "Penerbit",
    "notBefore": "Tidak sebelum",
    "notAfter": "Tidak setelah",
    "fingerprints": "Sidik jari",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Ekstensi",
    "subjectAltName": "Nama alternatif subjek",
    "keyUsage": "Penggunaan kunci",
    "extendedKeyUsage": "Penggunaan kunci diperluas",
    "basicConstraints": "Batasan dasar",
    "subjectKeyIdentifier": "Pengenal kunci subjek",
    "authorityKeyIdentifier": "Pengenal kunci otoritas",
    "notAvailable": "Tidak tersedia",
    "bits": "bit"
  },
  "he": {
    "inputTitle": "תעודה או מפתח ציבורי",
    "inputPlaceholder": "הדבק תוכן PEM/DER או גרור קובץ...",
    "inputHint": "נתמך: תעודות X.509 (PEM/DER) ו PUBLIC KEY (SPKI). נתמכים מספר בלוקי PEM.",
    "resultsTitle": "תוצאת הניתוח",
    "parseErrorTitle": "שגיאת ניתוח",
    "warningsTitle": "אזהרות",
    "invalidInput": "פורמט קלט לא מזוהה. ספק נתוני PEM/DER.",
    "invalidPem": "לא נמצאו בלוקי PEM תקינים.",
    "parseFailed": "לא ניתן לנתח כתעודה או כמפתח ציבורי.",
    "unsupportedPemBlock": "בלוק PEM לא נתמך: {label}",
    "certificateTab": "תעודה {index}",
    "publicKeyTab": "מפתח ציבורי {index}",
    "certificate": "תעודה",
    "publicKey": "מפתח ציבורי",
    "overview": "סקירה",
    "subjectIssuer": "נושא ומנפיק",
    "validity": "תוקף",
    "keyAlgorithm": "אלגוריתם מפתח",
    "keySize": "גודל מפתח",
    "curve": "עקומה",
    "serialNumber": "מספר סידורי",
    "signatureAlgorithm": "אלגוריתם חתימה",
    "subject": "נושא",
    "issuer": "מנפיק",
    "notBefore": "לא לפני",
    "notAfter": "לא אחרי",
    "fingerprints": "טביעות אצבע",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "הרחבות",
    "subjectAltName": "שם חלופי של הנושא",
    "keyUsage": "שימוש במפתח",
    "extendedKeyUsage": "שימוש מורחב במפתח",
    "basicConstraints": "הגבלות בסיסיות",
    "subjectKeyIdentifier": "מזהה מפתח הנושא",
    "authorityKeyIdentifier": "מזהה מפתח הרשות",
    "notAvailable": "לא זמין",
    "bits": "ביט"
  },
  "ms": {
    "inputTitle": "Sijil atau kunci awam",
    "inputPlaceholder": "Tampal kandungan PEM/DER atau lepaskan fail...",
    "inputHint": "Disokong: sijil X.509 (PEM/DER) dan PUBLIC KEY (SPKI). Berbilang blok PEM disokong.",
    "resultsTitle": "Hasil analisis",
    "parseErrorTitle": "Ralat analisis",
    "warningsTitle": "Amaran",
    "invalidInput": "Format input tidak dikenali. Sediakan data PEM/DER.",
    "invalidPem": "Tiada blok PEM yang sah ditemui.",
    "parseFailed": "Tidak dapat dianalisis sebagai sijil atau kunci awam.",
    "unsupportedPemBlock": "Blok PEM tidak disokong: {label}",
    "certificateTab": "Sijil {index}",
    "publicKeyTab": "Kunci Awam {index}",
    "certificate": "Sijil",
    "publicKey": "Kunci Awam",
    "overview": "Gambaran keseluruhan",
    "subjectIssuer": "Subjek dan pengeluar",
    "validity": "Tempoh sah",
    "keyAlgorithm": "Algoritma kunci",
    "keySize": "Saiz Kunci",
    "curve": "Lengkung",
    "serialNumber": "Nombor siri",
    "signatureAlgorithm": "Algoritma tandatangan",
    "subject": "Subjek",
    "issuer": "Pengeluar",
    "notBefore": "Tidak sebelum",
    "notAfter": "Tidak selepas",
    "fingerprints": "Cap jari",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Sambungan",
    "subjectAltName": "Nama alternatif subjek",
    "keyUsage": "Penggunaan kunci",
    "extendedKeyUsage": "Penggunaan kunci lanjutan",
    "basicConstraints": "Kekangan asas",
    "subjectKeyIdentifier": "Pengenal kunci subjek",
    "authorityKeyIdentifier": "Pengenal kunci pengeluar",
    "notAvailable": "Tidak tersedia",
    "bits": "bit"
  },
  "no": {
    "inputTitle": "Sertifikat eller offentlig nøkkel",
    "inputPlaceholder": "Lim inn PEM/DER-innhold eller slipp en fil...",
    "inputHint": "Støttet: X.509-sertifikater (PEM/DER) og PUBLIC KEY (SPKI). Flere PEM-blokker støttes.",
    "resultsTitle": "Analyseresultat",
    "parseErrorTitle": "Analysefeil",
    "warningsTitle": "Advarsler",
    "invalidInput": "Ukjent inndataformat. Oppgi PEM/DER-data.",
    "invalidPem": "Fant ingen gyldige PEM-blokker.",
    "parseFailed": "Kunne ikke analysere som sertifikat eller offentlig nøkkel.",
    "unsupportedPemBlock": "Ikke støttet PEM-blokk: {label}",
    "certificateTab": "Sertifikat {index}",
    "publicKeyTab": "Offentlig Nøkkel {index}",
    "certificate": "Sertifikat",
    "publicKey": "Offentlig Nøkkel",
    "overview": "Oversikt",
    "subjectIssuer": "Subjekt og utsteder",
    "validity": "Gyldighet",
    "keyAlgorithm": "Nøkkelalgoritme",
    "keySize": "Nøkkelstørrelse",
    "curve": "Kurve",
    "serialNumber": "Serienummer",
    "signatureAlgorithm": "Signaturalgoritme",
    "subject": "Subjekt",
    "issuer": "Utsteder",
    "notBefore": "Ikke før",
    "notAfter": "Ikke etter",
    "fingerprints": "Fingeravtrykk",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "extensions": "Utvidelser",
    "subjectAltName": "Alternativt navn for subjekt",
    "keyUsage": "Nøkkelbruk",
    "extendedKeyUsage": "Utvidet nøkkelbruk",
    "basicConstraints": "Grunnleggende begrensninger",
    "subjectKeyIdentifier": "Subjektets nøkkelidentifikator",
    "authorityKeyIdentifier": "Utsteders nøkkelidentifikator",
    "notAvailable": "Ikke tilgjengelig",
    "bits": "biter"
  }
}
</i18n>
