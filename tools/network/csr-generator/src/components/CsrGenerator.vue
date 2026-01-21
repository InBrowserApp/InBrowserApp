<template>
  <ToolSectionHeader>{{ t('keySourceTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-radio-group v-model:value="keySource">
      <n-radio-button value="generate">{{ t('keySourceGenerate') }}</n-radio-button>
      <n-radio-button value="import">{{ t('keySourceImport') }}</n-radio-button>
    </n-radio-group>
    <n-text depth="3" class="input-hint">
      {{ keySource === 'generate' ? t('keySourceGenerateHint') : t('keySourceImportHint') }}
    </n-text>
  </ToolSection>

  <ToolSection v-if="keySource === 'generate'">
    <n-form-item :label="t('algorithmLabel')" class="wide-form-item">
      <n-radio-group v-model:value="algorithm">
        <n-radio-button value="rsa">RSA</n-radio-button>
        <n-radio-button value="ecdsa">ECDSA</n-radio-button>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <n-radio-button value="ed25519">Ed25519</n-radio-button>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <n-radio-button value="ed448">Ed448</n-radio-button>
      </n-radio-group>
    </n-form-item>

    <n-form-item v-show="algorithm === 'rsa'" :label="t('rsaKeySizeLabel')" class="wide-form-item">
      <n-select v-model:value="rsaKeySize" :options="rsaKeySizeOptions" />
    </n-form-item>

    <n-form-item v-show="algorithm === 'rsa'" :label="t('rsaHashLabel')" class="wide-form-item">
      <n-select v-model:value="rsaHash" :options="rsaHashOptions" />
    </n-form-item>

    <n-form-item v-show="algorithm === 'ecdsa'" :label="t('ecCurveLabel')" class="wide-form-item">
      <n-select v-model:value="ecCurve" :options="ecCurveOptions" />
    </n-form-item>
  </ToolSection>

  <ToolSection v-else>
    <TextOrFileInput
      v-model:value="keyInput"
      class="monospace-field"
      :placeholder="t('privateKeyPlaceholder')"
      :accept="keyAccept"
      :status="keyInputStatus"
      :wrap-with-form-item="false"
    />
    <n-text depth="3" class="input-hint">{{ t('privateKeyHint') }}</n-text>
  </ToolSection>

  <ToolSectionHeader>{{ t('subjectTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item :label="t('commonName')">
        <n-input v-model:value="subject.commonName" class="monospace-field" />
      </n-form-item>
      <n-form-item :label="t('organization')">
        <n-input v-model:value="subject.organization" class="monospace-field" />
      </n-form-item>
      <n-form-item :label="t('organizationalUnit')">
        <n-input v-model:value="subject.organizationalUnit" class="monospace-field" />
      </n-form-item>
      <n-form-item :label="t('country')">
        <n-input v-model:value="subject.country" class="monospace-field" />
      </n-form-item>
      <n-form-item :label="t('state')">
        <n-input v-model:value="subject.state" class="monospace-field" />
      </n-form-item>
      <n-form-item :label="t('locality')">
        <n-input v-model:value="subject.locality" class="monospace-field" />
      </n-form-item>
      <n-form-item :label="t('emailAddress')">
        <n-input v-model:value="subject.emailAddress" class="monospace-field" />
      </n-form-item>
    </n-grid>
    <n-text depth="3" class="input-hint">{{ t('subjectHint') }}</n-text>
  </ToolSection>

  <ToolSectionHeader>{{ t('sanTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item :label="t('sanDnsLabel')">
        <n-input
          v-model:value="sanDns"
          class="monospace-field"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="t('sanDnsPlaceholder')"
        />
      </n-form-item>
      <n-form-item :label="t('sanIpLabel')">
        <n-input
          v-model:value="sanIp"
          class="monospace-field"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="t('sanIpPlaceholder')"
        />
      </n-form-item>
      <n-form-item :label="t('sanEmailLabel')">
        <n-input
          v-model:value="sanEmail"
          class="monospace-field"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="t('sanEmailPlaceholder')"
        />
      </n-form-item>
      <n-form-item :label="t('sanUriLabel')">
        <n-input
          v-model:value="sanUri"
          class="monospace-field"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="t('sanUriPlaceholder')"
        />
      </n-form-item>
    </n-grid>
    <n-text depth="3" class="input-hint">{{ t('sanHint') }}</n-text>
  </ToolSection>

  <ToolSection>
    <n-button type="primary" :loading="generating" @click="generate">
      <template #icon>
        <n-icon :component="Key24Regular" />
      </template>
      {{ t('generateCsr') }}
    </n-button>
  </ToolSection>

  <n-alert v-show="errorMessage" type="error" :title="t('errorTitle')">
    {{ errorMessage }}
  </n-alert>

  <ToolSectionHeader v-show="csrOutput">{{ t('csrOutputTitle') }}</ToolSectionHeader>
  <ToolSection v-show="csrOutput">
    <n-input
      class="monospace-field"
      :value="csrOutput"
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 14 }"
      readonly
    />
    <n-text v-show="keyAlgorithmLabel" depth="3" class="input-hint">
      {{ t('keyAlgorithmLabel', { algorithm: keyAlgorithmLabel }) }}
    </n-text>
  </ToolSection>
  <ToolSection v-show="csrOutput">
    <n-flex justify="space-between" align="center">
      <CopyToClipboardButton :content="csrOutput" />
      <n-button tag="a" text :href="csrDownloadUrl ?? undefined" download="request.csr">
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('downloadCsr') }}
      </n-button>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader v-show="privateKeyOutput">{{ t('privateKeyTitle') }}</ToolSectionHeader>
  <ToolSection v-show="privateKeyOutput">
    <n-input
      class="monospace-field"
      :value="privateKeyOutput"
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 14 }"
      readonly
    />
  </ToolSection>
  <ToolSection v-show="privateKeyOutput">
    <n-flex justify="space-between" align="center">
      <CopyToClipboardButton :content="privateKeyOutput" />
      <n-button tag="a" text :href="privateKeyDownloadUrl ?? undefined" download="private-key.pem">
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('downloadKey') }}
      </n-button>
    </n-flex>
    <n-text depth="3" class="input-hint">{{ t('privateKeyWarning') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl, useStorage } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NFlex,
  NFormItem,
  NGrid,
  NIcon,
  NInput,
  NRadioButton,
  NRadioGroup,
  NSelect,
  NText,
} from 'naive-ui'
import { CopyToClipboardButton, TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Key24Regular from '@vicons/fluent/Key24Regular'
import {
  CsrGeneratorError,
  createCsr,
  type CsrCreateInput,
  type EcCurve,
  type HashAlgorithm,
  type KeyAlgorithm,
  type KeySource,
  type RsaKeySize,
  type SubjectInput,
} from '../utils/csr'

const { t } = useI18n()

const keyAccept = '.pem,.key,.txt'

const rsaKeySizeOptions = [
  { label: '2048', value: 2048 },
  { label: '3072', value: 3072 },
  { label: '4096', value: 4096 },
]

const rsaHashOptions = [
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
]

const ecCurveOptions = [
  { label: 'P-256', value: 'P-256' },
  { label: 'P-384', value: 'P-384' },
  { label: 'P-521', value: 'P-521' },
]

const keySource = useStorage<KeySource>('tools:csr-generator:key-source', 'generate')
const algorithm = useStorage<KeyAlgorithm>('tools:csr-generator:algorithm', 'rsa')
const rsaKeySize = useStorage<RsaKeySize>('tools:csr-generator:rsa-key-size', 2048)
const rsaHash = useStorage<HashAlgorithm>('tools:csr-generator:rsa-hash', 'SHA-256')
const ecCurve = useStorage<EcCurve>('tools:csr-generator:ec-curve', 'P-256')

const defaultSubject: SubjectInput = {
  commonName: 'example.com',
  organization: '',
  organizationalUnit: '',
  country: '',
  state: '',
  locality: '',
  emailAddress: '',
}

const subject = useStorage<SubjectInput>('tools:csr-generator:subject', defaultSubject)

const sanDns = useStorage('tools:csr-generator:san-dns', '')
const sanIp = useStorage('tools:csr-generator:san-ip', '')
const sanEmail = useStorage('tools:csr-generator:san-email', '')
const sanUri = useStorage('tools:csr-generator:san-uri', '')

const storedKeyInput = useStorage('tools:csr-generator:private-key', '')
const keyInput = ref<string | File>(storedKeyInput.value)

watch(keyInput, (value) => {
  if (typeof value === 'string') {
    storedKeyInput.value = value
  }
})

const csrOutput = ref('')
const privateKeyOutput = ref('')
const keyAlgorithmLabel = ref('')
const errorMessage = ref('')
const generating = ref(false)

const csrDownloadBlob = computed(() =>
  csrOutput.value ? new Blob([csrOutput.value], { type: 'application/pkcs10' }) : null,
)
const csrDownloadUrl = useObjectUrl(csrDownloadBlob)

const privateKeyDownloadBlob = computed(() =>
  privateKeyOutput.value
    ? new Blob([privateKeyOutput.value], { type: 'application/x-pem-file' })
    : null,
)
const privateKeyDownloadUrl = useObjectUrl(privateKeyDownloadBlob)

const keyInputStatus = computed(() => {
  if (keySource.value !== 'import') return undefined
  if (!errorMessage.value) return undefined
  return 'error'
})

watch([keySource, algorithm, rsaKeySize, rsaHash, ecCurve], () => {
  resetOutputs()
})

function resetOutputs() {
  csrOutput.value = ''
  privateKeyOutput.value = ''
  keyAlgorithmLabel.value = ''
  errorMessage.value = ''
}

function splitLines(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

async function readInputText(value: string | File): Promise<string> {
  if (typeof value === 'string') {
    return value
  }
  return await value.text()
}

async function generate() {
  generating.value = true
  errorMessage.value = ''

  try {
    const keyPem = keySource.value === 'import' ? await readInputText(keyInput.value) : ''
    const input: CsrCreateInput = {
      keySource: keySource.value,
      algorithm: algorithm.value,
      rsaKeySize: rsaKeySize.value,
      rsaHash: rsaHash.value,
      ecCurve: ecCurve.value,
      keyPem,
      subject: subject.value,
      san: {
        dns: splitLines(sanDns.value),
        ip: splitLines(sanIp.value),
        email: splitLines(sanEmail.value),
        uri: splitLines(sanUri.value),
      },
    }

    const result = await createCsr(input)
    csrOutput.value = result.csrPem
    privateKeyOutput.value = result.privateKeyPem ?? ''
    keyAlgorithmLabel.value = result.keyAlgorithmLabel
  } catch (error) {
    csrOutput.value = ''
    privateKeyOutput.value = ''
    keyAlgorithmLabel.value = ''
    errorMessage.value = formatError(error)
  } finally {
    generating.value = false
  }
}

function formatError(error: unknown): string {
  if (error instanceof CsrGeneratorError) {
    // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
    return t(error.key, error.params ?? {})
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
</script>

<style scoped>
.monospace-field :deep(textarea),
.monospace-field :deep(input) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

.input-hint {
  display: block;
  margin-top: 8px;
}

.wide-form-item :deep(.n-form-item-blank) {
  width: 100%;
}
</style>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "keySourceTitle": "Key Source",
    "keySourceGenerate": "Generate New Key",
    "keySourceImport": "Import Private Key",
    "keySourceGenerateHint": "Each generation creates a new key pair in your browser.",
    "keySourceImportHint": "Paste a PEM private key (PKCS#8, RSA, EC). Encrypted keys are not supported.",
    "algorithmLabel": "Key Algorithm",
    "rsaKeySizeLabel": "RSA Key Size",
    "rsaHashLabel": "RSA Hash",
    "ecCurveLabel": "EC Curve",
    "privateKeyPlaceholder": "Paste a PEM private key...",
    "privateKeyHint": "Supported: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organization (O)",
    "organizationalUnit": "Organizational Unit (OU)",
    "country": "Country (C)",
    "state": "State / Province (ST)",
    "locality": "Locality / City (L)",
    "emailAddress": "Email Address",
    "subjectHint": "At least one Subject field or SAN entry is required.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS Names",
    "sanIpLabel": "IP Addresses",
    "sanEmailLabel": "Email Addresses",
    "sanUriLabel": "URIs",
    "sanDnsPlaceholder": "one per line, e.g. example.com",
    "sanIpPlaceholder": "one per line, e.g. 192.0.2.1",
    "sanEmailPlaceholder": "one per line, e.g. admin{'@'}example.com",
    "sanUriPlaceholder": "one per line, e.g. https://example.com",
    "sanHint": "SAN is recommended for modern TLS certificates.",
    "generateCsr": "Generate CSR",
    "csrOutputTitle": "CSR Output",
    "privateKeyTitle": "Private Key (PKCS#8)",
    "privateKeyWarning": "Keep this private key safe. Anyone with it can impersonate your certificate.",
    "downloadCsr": "Download CSR",
    "downloadKey": "Download Private Key",
    "errorTitle": "Error",
    "keyAlgorithmLabel": "Key: {algorithm}",
    "errorMissingSubjectOrSan": "Provide at least one Subject field or SAN entry.",
    "errorInvalidPem": "Invalid PEM input.",
    "errorUnsupportedPem": "Unsupported PEM block. Provide a private key.",
    "errorEncryptedKey": "Encrypted private keys are not supported.",
    "errorUnsupportedCurve": "Unsupported elliptic curve.",
    "errorUnsupportedKeyType": "Unsupported key type for CSR signing.",
    "errorMissingPrivateKey": "Private key input is required.",
    "errorInvalidSanIp": "Invalid IP address in SAN: {message}"
  },
  "zh": {
    "keySourceTitle": "密钥来源",
    "keySourceGenerate": "生成新密钥",
    "keySourceImport": "导入私钥",
    "keySourceGenerateHint": "每次生成都会在浏览器中创建新的密钥对。",
    "keySourceImportHint": "粘贴 PEM 私钥（PKCS#8、RSA、EC）。不支持加密私钥。",
    "algorithmLabel": "密钥算法",
    "rsaKeySizeLabel": "RSA 密钥长度",
    "rsaHashLabel": "RSA 哈希",
    "ecCurveLabel": "EC 曲线",
    "privateKeyPlaceholder": "粘贴 PEM 私钥...",
    "privateKeyHint": "支持：PRIVATE KEY（PKCS#8）、RSA PRIVATE KEY、EC PRIVATE KEY。",
    "subjectTitle": "主体（DN）",
    "commonName": "通用名称（CN）",
    "organization": "组织（O）",
    "organizationalUnit": "组织单位（OU）",
    "country": "国家/地区（C）",
    "state": "省/州（ST）",
    "locality": "城市（L）",
    "emailAddress": "邮箱地址",
    "subjectHint": "主体或 SAN 至少填写一项。",
    "sanTitle": "主题备用名称（SAN）",
    "sanDnsLabel": "DNS 名称",
    "sanIpLabel": "IP 地址",
    "sanEmailLabel": "邮箱地址",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "每行一个，例如 example.com",
    "sanIpPlaceholder": "每行一个，例如 192.0.2.1",
    "sanEmailPlaceholder": "每行一个，例如 admin{'@'}example.com",
    "sanUriPlaceholder": "每行一个，例如 https://example.com",
    "sanHint": "现代 TLS 证书推荐使用 SAN。",
    "generateCsr": "生成 CSR",
    "csrOutputTitle": "CSR 输出",
    "privateKeyTitle": "私钥（PKCS#8）",
    "privateKeyWarning": "请妥善保管私钥，任何持有者都可冒用该证书。",
    "downloadCsr": "下载 CSR",
    "downloadKey": "下载私钥",
    "errorTitle": "错误",
    "keyAlgorithmLabel": "密钥：{algorithm}",
    "errorMissingSubjectOrSan": "请至少填写一项主体或 SAN。",
    "errorInvalidPem": "无效的 PEM 输入。",
    "errorUnsupportedPem": "不支持的 PEM 块，请提供私钥。",
    "errorEncryptedKey": "不支持加密私钥。",
    "errorUnsupportedCurve": "不支持的椭圆曲线。",
    "errorUnsupportedKeyType": "该密钥类型不支持 CSR 签名。",
    "errorMissingPrivateKey": "需要提供私钥。",
    "errorInvalidSanIp": "SAN 中的 IP 地址无效：{message}"
  },
  "zh-CN": {
    "keySourceTitle": "密钥来源",
    "keySourceGenerate": "生成新密钥",
    "keySourceImport": "导入私钥",
    "keySourceGenerateHint": "每次生成都会在浏览器中创建新的密钥对。",
    "keySourceImportHint": "粘贴 PEM 私钥（PKCS#8、RSA、EC）。不支持加密私钥。",
    "algorithmLabel": "密钥算法",
    "rsaKeySizeLabel": "RSA 密钥长度",
    "rsaHashLabel": "RSA 哈希",
    "ecCurveLabel": "EC 曲线",
    "privateKeyPlaceholder": "粘贴 PEM 私钥...",
    "privateKeyHint": "支持：PRIVATE KEY（PKCS#8）、RSA PRIVATE KEY、EC PRIVATE KEY。",
    "subjectTitle": "主体（DN）",
    "commonName": "通用名称（CN）",
    "organization": "组织（O）",
    "organizationalUnit": "组织单位（OU）",
    "country": "国家/地区（C）",
    "state": "省/州（ST）",
    "locality": "城市（L）",
    "emailAddress": "邮箱地址",
    "subjectHint": "主体或 SAN 至少填写一项。",
    "sanTitle": "主题备用名称（SAN）",
    "sanDnsLabel": "DNS 名称",
    "sanIpLabel": "IP 地址",
    "sanEmailLabel": "邮箱地址",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "每行一个，例如 example.com",
    "sanIpPlaceholder": "每行一个，例如 192.0.2.1",
    "sanEmailPlaceholder": "每行一个，例如 admin{'@'}example.com",
    "sanUriPlaceholder": "每行一个，例如 https://example.com",
    "sanHint": "现代 TLS 证书推荐使用 SAN。",
    "generateCsr": "生成 CSR",
    "csrOutputTitle": "CSR 输出",
    "privateKeyTitle": "私钥（PKCS#8）",
    "privateKeyWarning": "请妥善保管私钥，任何持有者都可冒用该证书。",
    "downloadCsr": "下载 CSR",
    "downloadKey": "下载私钥",
    "errorTitle": "错误",
    "keyAlgorithmLabel": "密钥：{algorithm}",
    "errorMissingSubjectOrSan": "请至少填写一项主体或 SAN。",
    "errorInvalidPem": "无效的 PEM 输入。",
    "errorUnsupportedPem": "不支持的 PEM 块，请提供私钥。",
    "errorEncryptedKey": "不支持加密私钥。",
    "errorUnsupportedCurve": "不支持的椭圆曲线。",
    "errorUnsupportedKeyType": "该密钥类型不支持 CSR 签名。",
    "errorMissingPrivateKey": "需要提供私钥。",
    "errorInvalidSanIp": "SAN 中的 IP 地址无效：{message}"
  },
  "zh-TW": {
    "keySourceTitle": "金鑰來源",
    "keySourceGenerate": "產生新金鑰",
    "keySourceImport": "匯入私鑰",
    "keySourceGenerateHint": "每次產生都會在瀏覽器中建立新的金鑰對。",
    "keySourceImportHint": "貼上 PEM 私鑰（PKCS#8、RSA、EC）。不支援加密私鑰。",
    "algorithmLabel": "金鑰演算法",
    "rsaKeySizeLabel": "RSA 金鑰長度",
    "rsaHashLabel": "RSA 雜湊",
    "ecCurveLabel": "EC 曲線",
    "privateKeyPlaceholder": "貼上 PEM 私鑰...",
    "privateKeyHint": "支援：PRIVATE KEY（PKCS#8）、RSA PRIVATE KEY、EC PRIVATE KEY。",
    "subjectTitle": "主體（DN）",
    "commonName": "一般名稱（CN）",
    "organization": "組織（O）",
    "organizationalUnit": "組織單位（OU）",
    "country": "國家/地區（C）",
    "state": "州/省（ST）",
    "locality": "城市（L）",
    "emailAddress": "電子郵件",
    "subjectHint": "主體或 SAN 至少填寫一項。",
    "sanTitle": "主體替代名稱（SAN）",
    "sanDnsLabel": "DNS 名稱",
    "sanIpLabel": "IP 位址",
    "sanEmailLabel": "電子郵件",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "每行一個，例如 example.com",
    "sanIpPlaceholder": "每行一個，例如 192.0.2.1",
    "sanEmailPlaceholder": "每行一個，例如 admin{'@'}example.com",
    "sanUriPlaceholder": "每行一個，例如 https://example.com",
    "sanHint": "現代 TLS 憑證建議使用 SAN。",
    "generateCsr": "產生 CSR",
    "csrOutputTitle": "CSR 輸出",
    "privateKeyTitle": "私鑰（PKCS#8）",
    "privateKeyWarning": "請妥善保管私鑰，任何持有者都可冒用該憑證。",
    "downloadCsr": "下載 CSR",
    "downloadKey": "下載私鑰",
    "errorTitle": "錯誤",
    "keyAlgorithmLabel": "金鑰：{algorithm}",
    "errorMissingSubjectOrSan": "請至少填寫一項主體或 SAN。",
    "errorInvalidPem": "無效的 PEM 輸入。",
    "errorUnsupportedPem": "不支援的 PEM 區塊，請提供私鑰。",
    "errorEncryptedKey": "不支援加密私鑰。",
    "errorUnsupportedCurve": "不支援的橢圓曲線。",
    "errorUnsupportedKeyType": "此金鑰類型不支援 CSR 簽章。",
    "errorMissingPrivateKey": "需要提供私鑰。",
    "errorInvalidSanIp": "SAN 中的 IP 位址無效：{message}"
  },
  "zh-HK": {
    "keySourceTitle": "金鑰來源",
    "keySourceGenerate": "產生新金鑰",
    "keySourceImport": "匯入私鑰",
    "keySourceGenerateHint": "每次產生都會在瀏覽器中建立新的金鑰對。",
    "keySourceImportHint": "貼上 PEM 私鑰（PKCS#8、RSA、EC）。不支援加密私鑰。",
    "algorithmLabel": "金鑰演算法",
    "rsaKeySizeLabel": "RSA 金鑰長度",
    "rsaHashLabel": "RSA 雜湊",
    "ecCurveLabel": "EC 曲線",
    "privateKeyPlaceholder": "貼上 PEM 私鑰...",
    "privateKeyHint": "支援：PRIVATE KEY（PKCS#8）、RSA PRIVATE KEY、EC PRIVATE KEY。",
    "subjectTitle": "主體（DN）",
    "commonName": "一般名稱（CN）",
    "organization": "組織（O）",
    "organizationalUnit": "組織單位（OU）",
    "country": "國家/地區（C）",
    "state": "州/省（ST）",
    "locality": "城市（L）",
    "emailAddress": "電子郵件",
    "subjectHint": "主體或 SAN 至少填寫一項。",
    "sanTitle": "主體替代名稱（SAN）",
    "sanDnsLabel": "DNS 名稱",
    "sanIpLabel": "IP 位址",
    "sanEmailLabel": "電子郵件",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "每行一個，例如 example.com",
    "sanIpPlaceholder": "每行一個，例如 192.0.2.1",
    "sanEmailPlaceholder": "每行一個，例如 admin{'@'}example.com",
    "sanUriPlaceholder": "每行一個，例如 https://example.com",
    "sanHint": "現代 TLS 證書建議使用 SAN。",
    "generateCsr": "產生 CSR",
    "csrOutputTitle": "CSR 輸出",
    "privateKeyTitle": "私鑰（PKCS#8）",
    "privateKeyWarning": "請妥善保管私鑰，任何持有者都可冒用該證書。",
    "downloadCsr": "下載 CSR",
    "downloadKey": "下載私鑰",
    "errorTitle": "錯誤",
    "keyAlgorithmLabel": "金鑰：{algorithm}",
    "errorMissingSubjectOrSan": "請至少填寫一項主體或 SAN。",
    "errorInvalidPem": "無效的 PEM 輸入。",
    "errorUnsupportedPem": "不支援的 PEM 區塊，請提供私鑰。",
    "errorEncryptedKey": "不支援加密私鑰。",
    "errorUnsupportedCurve": "不支援的橢圓曲線。",
    "errorUnsupportedKeyType": "此金鑰類型不支援 CSR 簽章。",
    "errorMissingPrivateKey": "需要提供私鑰。",
    "errorInvalidSanIp": "SAN 中的 IP 位址無效：{message}"
  },
  "es": {
    "keySourceTitle": "Origen de clave",
    "keySourceGenerate": "Generar nueva clave",
    "keySourceImport": "Importar clave privada",
    "keySourceGenerateHint": "Cada generación crea un nuevo par de claves en tu navegador.",
    "keySourceImportHint": "Pega una clave privada PEM (PKCS#8, RSA, EC). Las claves cifradas no están soportadas.",
    "algorithmLabel": "Algoritmo de clave",
    "rsaKeySizeLabel": "Tamaño de clave RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Curva EC",
    "privateKeyPlaceholder": "Pega una clave privada PEM...",
    "privateKeyHint": "Compatible: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Sujeto (DN)",
    "commonName": "Nombre común (CN)",
    "organization": "Organización (O)",
    "organizationalUnit": "Unidad organizativa (OU)",
    "country": "País (C)",
    "state": "Estado / Provincia (ST)",
    "locality": "Localidad / Ciudad (L)",
    "emailAddress": "Correo electrónico",
    "subjectHint": "Se requiere al menos un campo de Subject o una entrada SAN.",
    "sanTitle": "Nombres alternativos del sujeto (SAN)",
    "sanDnsLabel": "Nombres DNS",
    "sanIpLabel": "Direcciones IP",
    "sanEmailLabel": "Correos electrónicos",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "uno por línea, p. ej. example.com",
    "sanIpPlaceholder": "uno por línea, p. ej. 192.0.2.1",
    "sanEmailPlaceholder": "uno por línea, p. ej. admin{'@'}example.com",
    "sanUriPlaceholder": "uno por línea, p. ej. https://example.com",
    "sanHint": "SAN se recomienda para certificados TLS modernos.",
    "generateCsr": "Generar CSR",
    "csrOutputTitle": "Salida CSR",
    "privateKeyTitle": "Clave privada (PKCS#8)",
    "privateKeyWarning": "Guarda esta clave privada de forma segura. Cualquiera que la tenga puede suplantar el certificado.",
    "downloadCsr": "Descargar CSR",
    "downloadKey": "Descargar clave privada",
    "errorTitle": "Error",
    "keyAlgorithmLabel": "Clave: {algorithm}",
    "errorMissingSubjectOrSan": "Introduce al menos un campo de Subject o un SAN.",
    "errorInvalidPem": "Entrada PEM no válida.",
    "errorUnsupportedPem": "Bloque PEM no compatible. Proporciona una clave privada.",
    "errorEncryptedKey": "Las claves privadas cifradas no están soportadas.",
    "errorUnsupportedCurve": "Curva elíptica no compatible.",
    "errorUnsupportedKeyType": "Tipo de clave no compatible para firmar CSR.",
    "errorMissingPrivateKey": "Se requiere la clave privada.",
    "errorInvalidSanIp": "Dirección IP no válida en SAN: {message}"
  },
  "fr": {
    "keySourceTitle": "Source de clé",
    "keySourceGenerate": "Générer une nouvelle clé",
    "keySourceImport": "Importer une clé privée",
    "keySourceGenerateHint": "Chaque génération crée une nouvelle paire de clés dans votre navigateur.",
    "keySourceImportHint": "Collez une clé privée PEM (PKCS#8, RSA, EC). Les clés chiffrées ne sont pas prises en charge.",
    "algorithmLabel": "Algorithme de clé",
    "rsaKeySizeLabel": "Taille de clé RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Courbe EC",
    "privateKeyPlaceholder": "Collez une clé privée PEM...",
    "privateKeyHint": "Pris en charge : PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Sujet (DN)",
    "commonName": "Nom commun (CN)",
    "organization": "Organisation (O)",
    "organizationalUnit": "Unité organisationnelle (OU)",
    "country": "Pays (C)",
    "state": "État / Province (ST)",
    "locality": "Ville / Localité (L)",
    "emailAddress": "Adresse e-mail",
    "subjectHint": "Au moins un champ Subject ou une entrée SAN est requis.",
    "sanTitle": "Noms alternatifs du sujet (SAN)",
    "sanDnsLabel": "Noms DNS",
    "sanIpLabel": "Adresses IP",
    "sanEmailLabel": "Adresses e-mail",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "un par ligne, ex. example.com",
    "sanIpPlaceholder": "un par ligne, ex. 192.0.2.1",
    "sanEmailPlaceholder": "un par ligne, ex. admin{'@'}example.com",
    "sanUriPlaceholder": "un par ligne, ex. https://example.com",
    "sanHint": "SAN est recommandé pour les certificats TLS modernes.",
    "generateCsr": "Générer un CSR",
    "csrOutputTitle": "Sortie CSR",
    "privateKeyTitle": "Clé privée (PKCS#8)",
    "privateKeyWarning": "Conservez cette clé privée en sécurité. Toute personne l'ayant peut usurper le certificat.",
    "downloadCsr": "Télécharger le CSR",
    "downloadKey": "Télécharger la clé privée",
    "errorTitle": "Erreur",
    "keyAlgorithmLabel": "Clé : {algorithm}",
    "errorMissingSubjectOrSan": "Fournissez au moins un champ Subject ou un SAN.",
    "errorInvalidPem": "Entrée PEM invalide.",
    "errorUnsupportedPem": "Bloc PEM non pris en charge. Fournissez une clé privée.",
    "errorEncryptedKey": "Les clés privées chiffrées ne sont pas prises en charge.",
    "errorUnsupportedCurve": "Courbe elliptique non prise en charge.",
    "errorUnsupportedKeyType": "Type de clé non pris en charge pour signer un CSR.",
    "errorMissingPrivateKey": "La clé privée est requise.",
    "errorInvalidSanIp": "Adresse IP SAN invalide : {message}"
  },
  "de": {
    "keySourceTitle": "Schlüsselquelle",
    "keySourceGenerate": "Neuen Schlüssel erzeugen",
    "keySourceImport": "Privaten Schlüssel importieren",
    "keySourceGenerateHint": "Jede Generierung erstellt ein neues Schlüsselpaar im Browser.",
    "keySourceImportHint": "Fügen Sie einen PEM-Privatschlüssel ein (PKCS#8, RSA, EC). Verschlüsselte Schlüssel werden nicht unterstützt.",
    "algorithmLabel": "Schlüsselalgorithmus",
    "rsaKeySizeLabel": "RSA-Schlüssellänge",
    "rsaHashLabel": "RSA-Hash",
    "ecCurveLabel": "EC-Kurve",
    "privateKeyPlaceholder": "PEM-Privatschlüssel einfügen...",
    "privateKeyHint": "Unterstützt: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisation (O)",
    "organizationalUnit": "Organisationseinheit (OU)",
    "country": "Land (C)",
    "state": "Bundesland / Region (ST)",
    "locality": "Ort / Stadt (L)",
    "emailAddress": "E-Mail-Adresse",
    "subjectHint": "Mindestens ein Subject-Feld oder ein SAN-Eintrag ist erforderlich.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS-Namen",
    "sanIpLabel": "IP-Adressen",
    "sanEmailLabel": "E-Mail-Adressen",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "eine pro Zeile, z. B. example.com",
    "sanIpPlaceholder": "eine pro Zeile, z. B. 192.0.2.1",
    "sanEmailPlaceholder": "eine pro Zeile, z. B. admin{'@'}example.com",
    "sanUriPlaceholder": "eine pro Zeile, z. B. https://example.com",
    "sanHint": "SAN wird für moderne TLS-Zertifikate empfohlen.",
    "generateCsr": "CSR erzeugen",
    "csrOutputTitle": "CSR-Ausgabe",
    "privateKeyTitle": "Privater Schlüssel (PKCS#8)",
    "privateKeyWarning": "Bewahren Sie diesen privaten Schlüssel sicher auf. Jeder, der ihn hat, kann das Zertifikat missbrauchen.",
    "downloadCsr": "CSR herunterladen",
    "downloadKey": "Privaten Schlüssel herunterladen",
    "errorTitle": "Fehler",
    "keyAlgorithmLabel": "Schlüssel: {algorithm}",
    "errorMissingSubjectOrSan": "Geben Sie mindestens ein Subject-Feld oder SAN an.",
    "errorInvalidPem": "Ungültige PEM-Eingabe.",
    "errorUnsupportedPem": "Nicht unterstützter PEM-Block. Geben Sie einen privaten Schlüssel an.",
    "errorEncryptedKey": "Verschlüsselte private Schlüssel werden nicht unterstützt.",
    "errorUnsupportedCurve": "Nicht unterstützte Elliptische Kurve.",
    "errorUnsupportedKeyType": "Nicht unterstützter Schlüsseltyp für CSR-Signatur.",
    "errorMissingPrivateKey": "Privater Schlüssel ist erforderlich.",
    "errorInvalidSanIp": "Ungültige IP-Adresse im SAN: {message}"
  },
  "it": {
    "keySourceTitle": "Origine chiave",
    "keySourceGenerate": "Genera nuova chiave",
    "keySourceImport": "Importa chiave privata",
    "keySourceGenerateHint": "Ogni generazione crea una nuova coppia di chiavi nel browser.",
    "keySourceImportHint": "Incolla una chiave privata PEM (PKCS#8, RSA, EC). Le chiavi cifrate non sono supportate.",
    "algorithmLabel": "Algoritmo chiave",
    "rsaKeySizeLabel": "Dimensione chiave RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Curva EC",
    "privateKeyPlaceholder": "Incolla una chiave privata PEM...",
    "privateKeyHint": "Supportato: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Soggetto (DN)",
    "commonName": "Nome comune (CN)",
    "organization": "Organizzazione (O)",
    "organizationalUnit": "Unità organizzativa (OU)",
    "country": "Paese (C)",
    "state": "Stato / Provincia (ST)",
    "locality": "Località / Città (L)",
    "emailAddress": "Email",
    "subjectHint": "È richiesto almeno un campo Subject o un SAN.",
    "sanTitle": "Nomi alternativi del soggetto (SAN)",
    "sanDnsLabel": "Nomi DNS",
    "sanIpLabel": "Indirizzi IP",
    "sanEmailLabel": "Email",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "uno per riga, es. example.com",
    "sanIpPlaceholder": "uno per riga, es. 192.0.2.1",
    "sanEmailPlaceholder": "uno per riga, es. admin{'@'}example.com",
    "sanUriPlaceholder": "uno per riga, es. https://example.com",
    "sanHint": "SAN è consigliato per i certificati TLS moderni.",
    "generateCsr": "Genera CSR",
    "csrOutputTitle": "Output CSR",
    "privateKeyTitle": "Chiave privata (PKCS#8)",
    "privateKeyWarning": "Conserva questa chiave privata al sicuro. Chiunque la possieda può impersonare il certificato.",
    "downloadCsr": "Scarica CSR",
    "downloadKey": "Scarica chiave privata",
    "errorTitle": "Errore",
    "keyAlgorithmLabel": "Chiave: {algorithm}",
    "errorMissingSubjectOrSan": "Inserisci almeno un campo Subject o un SAN.",
    "errorInvalidPem": "Input PEM non valido.",
    "errorUnsupportedPem": "Blocco PEM non supportato. Fornisci una chiave privata.",
    "errorEncryptedKey": "Le chiavi private cifrate non sono supportate.",
    "errorUnsupportedCurve": "Curva ellittica non supportata.",
    "errorUnsupportedKeyType": "Tipo di chiave non supportato per firmare CSR.",
    "errorMissingPrivateKey": "La chiave privata è obbligatoria.",
    "errorInvalidSanIp": "Indirizzo IP SAN non valido: {message}"
  },
  "ja": {
    "keySourceTitle": "鍵の種類",
    "keySourceGenerate": "新しい鍵を生成",
    "keySourceImport": "既存の秘密鍵をインポート",
    "keySourceGenerateHint": "生成するたびにブラウザ内で新しい鍵ペアを作成します。",
    "keySourceImportHint": "PEM 形式の秘密鍵（PKCS#8 / RSA / EC）を貼り付けてください。暗号化された鍵は未対応です。",
    "algorithmLabel": "鍵アルゴリズム",
    "rsaKeySizeLabel": "RSA 鍵長",
    "rsaHashLabel": "RSA ハッシュ",
    "ecCurveLabel": "EC 曲線",
    "privateKeyPlaceholder": "PEM 秘密鍵を貼り付け...",
    "privateKeyHint": "対応形式: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY。",
    "subjectTitle": "Subject（DN）",
    "commonName": "コモンネーム（CN）",
    "organization": "組織（O）",
    "organizationalUnit": "組織単位（OU）",
    "country": "国（C）",
    "state": "都道府県（ST）",
    "locality": "市区町村（L）",
    "emailAddress": "メールアドレス",
    "subjectHint": "Subject または SAN のいずれかを最低 1 つ入力してください。",
    "sanTitle": "Subject Alternative Names（SAN）",
    "sanDnsLabel": "DNS 名",
    "sanIpLabel": "IP アドレス",
    "sanEmailLabel": "メールアドレス",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "1 行に 1 つ（例: example.com）",
    "sanIpPlaceholder": "1 行に 1 つ（例: 192.0.2.1）",
    "sanEmailPlaceholder": "1 行に 1 つ（例: admin{'@'}example.com）",
    "sanUriPlaceholder": "1 行に 1 つ（例: https://example.com）",
    "sanHint": "最新の TLS 証明書では SAN の使用が推奨されます。",
    "generateCsr": "CSR を生成",
    "csrOutputTitle": "CSR 出力",
    "privateKeyTitle": "秘密鍵（PKCS#8）",
    "privateKeyWarning": "秘密鍵は厳重に保管してください。所持者は証明書を悪用できます。",
    "downloadCsr": "CSR をダウンロード",
    "downloadKey": "秘密鍵をダウンロード",
    "errorTitle": "エラー",
    "keyAlgorithmLabel": "鍵: {algorithm}",
    "errorMissingSubjectOrSan": "Subject または SAN を最低 1 つ入力してください。",
    "errorInvalidPem": "PEM 入力が無効です。",
    "errorUnsupportedPem": "未対応の PEM ブロックです。秘密鍵を指定してください。",
    "errorEncryptedKey": "暗号化された秘密鍵は未対応です。",
    "errorUnsupportedCurve": "未対応の楕円曲線です。",
    "errorUnsupportedKeyType": "この鍵タイプでは CSR 署名をサポートしていません。",
    "errorMissingPrivateKey": "秘密鍵が必要です。",
    "errorInvalidSanIp": "SAN の IP アドレスが無効です: {message}"
  },
  "ko": {
    "keySourceTitle": "키 소스",
    "keySourceGenerate": "새 키 생성",
    "keySourceImport": "개인 키 가져오기",
    "keySourceGenerateHint": "생성할 때마다 브라우저에서 새 키 쌍이 만들어집니다.",
    "keySourceImportHint": "PEM 개인 키(PKCS#8, RSA, EC)를 붙여넣으세요. 암호화된 키는 지원되지 않습니다.",
    "algorithmLabel": "키 알고리즘",
    "rsaKeySizeLabel": "RSA 키 길이",
    "rsaHashLabel": "RSA 해시",
    "ecCurveLabel": "EC 곡선",
    "privateKeyPlaceholder": "PEM 개인 키를 붙여넣기...",
    "privateKeyHint": "지원: PRIVATE KEY(PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "주체(DN)",
    "commonName": "일반 이름(CN)",
    "organization": "조직(O)",
    "organizationalUnit": "조직 단위(OU)",
    "country": "국가(C)",
    "state": "주/도(ST)",
    "locality": "도시(L)",
    "emailAddress": "이메일 주소",
    "subjectHint": "Subject 또는 SAN 중 하나 이상이 필요합니다.",
    "sanTitle": "주체 대체 이름(SAN)",
    "sanDnsLabel": "DNS 이름",
    "sanIpLabel": "IP 주소",
    "sanEmailLabel": "이메일 주소",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "한 줄에 하나씩, 예: example.com",
    "sanIpPlaceholder": "한 줄에 하나씩, 예: 192.0.2.1",
    "sanEmailPlaceholder": "한 줄에 하나씩, 예: admin{'@'}example.com",
    "sanUriPlaceholder": "한 줄에 하나씩, 예: https://example.com",
    "sanHint": "현대 TLS 인증서에는 SAN 사용이 권장됩니다.",
    "generateCsr": "CSR 생성",
    "csrOutputTitle": "CSR 출력",
    "privateKeyTitle": "개인 키(PKCS#8)",
    "privateKeyWarning": "개인 키를 안전하게 보관하세요. 소유자는 인증서를 가장할 수 있습니다.",
    "downloadCsr": "CSR 다운로드",
    "downloadKey": "개인 키 다운로드",
    "errorTitle": "오류",
    "keyAlgorithmLabel": "키: {algorithm}",
    "errorMissingSubjectOrSan": "Subject 또는 SAN을 하나 이상 입력하세요.",
    "errorInvalidPem": "유효하지 않은 PEM 입력입니다.",
    "errorUnsupportedPem": "지원되지 않는 PEM 블록입니다. 개인 키를 제공하세요.",
    "errorEncryptedKey": "암호화된 개인 키는 지원되지 않습니다.",
    "errorUnsupportedCurve": "지원되지 않는 타원 곡선입니다.",
    "errorUnsupportedKeyType": "이 키 유형은 CSR 서명을 지원하지 않습니다.",
    "errorMissingPrivateKey": "개인 키가 필요합니다.",
    "errorInvalidSanIp": "SAN의 IP 주소가 올바르지 않습니다: {message}"
  },
  "ru": {
    "keySourceTitle": "Источник ключа",
    "keySourceGenerate": "Создать новый ключ",
    "keySourceImport": "Импортировать приватный ключ",
    "keySourceGenerateHint": "Каждая генерация создаёт новую пару ключей в браузере.",
    "keySourceImportHint": "Вставьте приватный ключ PEM (PKCS#8, RSA, EC). Зашифрованные ключи не поддерживаются.",
    "algorithmLabel": "Алгоритм ключа",
    "rsaKeySizeLabel": "Размер ключа RSA",
    "rsaHashLabel": "Хэш RSA",
    "ecCurveLabel": "Кривая EC",
    "privateKeyPlaceholder": "Вставьте приватный ключ PEM...",
    "privateKeyHint": "Поддерживается: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Общее имя (CN)",
    "organization": "Организация (O)",
    "organizationalUnit": "Подразделение (OU)",
    "country": "Страна (C)",
    "state": "Регион / область (ST)",
    "locality": "Город (L)",
    "emailAddress": "Email",
    "subjectHint": "Нужно указать хотя бы одно поле Subject или SAN.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS-имена",
    "sanIpLabel": "IP-адреса",
    "sanEmailLabel": "Email-адреса",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "по одному в строке, напр. example.com",
    "sanIpPlaceholder": "по одному в строке, напр. 192.0.2.1",
    "sanEmailPlaceholder": "по одному в строке, напр. admin{'@'}example.com",
    "sanUriPlaceholder": "по одному в строке, напр. https://example.com",
    "sanHint": "SAN рекомендуется для современных TLS сертификатов.",
    "generateCsr": "Сгенерировать CSR",
    "csrOutputTitle": "Вывод CSR",
    "privateKeyTitle": "Приватный ключ (PKCS#8)",
    "privateKeyWarning": "Храните приватный ключ в безопасности. Любой, кто его получит, сможет подделать сертификат.",
    "downloadCsr": "Скачать CSR",
    "downloadKey": "Скачать приватный ключ",
    "errorTitle": "Ошибка",
    "keyAlgorithmLabel": "Ключ: {algorithm}",
    "errorMissingSubjectOrSan": "Укажите хотя бы одно поле Subject или SAN.",
    "errorInvalidPem": "Некорректный PEM-ввод.",
    "errorUnsupportedPem": "Неподдерживаемый PEM-блок. Укажите приватный ключ.",
    "errorEncryptedKey": "Зашифрованные приватные ключи не поддерживаются.",
    "errorUnsupportedCurve": "Неподдерживаемая эллиптическая кривая.",
    "errorUnsupportedKeyType": "Этот тип ключа не поддерживается для подписи CSR.",
    "errorMissingPrivateKey": "Нужен приватный ключ.",
    "errorInvalidSanIp": "Неверный IP-адрес в SAN: {message}"
  },
  "pt": {
    "keySourceTitle": "Fonte da chave",
    "keySourceGenerate": "Gerar nova chave",
    "keySourceImport": "Importar chave privada",
    "keySourceGenerateHint": "Cada geração cria um novo par de chaves no navegador.",
    "keySourceImportHint": "Cole uma chave privada PEM (PKCS#8, RSA, EC). Chaves criptografadas não são suportadas.",
    "algorithmLabel": "Algoritmo da chave",
    "rsaKeySizeLabel": "Tamanho da chave RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Curva EC",
    "privateKeyPlaceholder": "Cole uma chave privada PEM...",
    "privateKeyHint": "Compatível: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Assunto (DN)",
    "commonName": "Nome comum (CN)",
    "organization": "Organização (O)",
    "organizationalUnit": "Unidade organizacional (OU)",
    "country": "País (C)",
    "state": "Estado / Província (ST)",
    "locality": "Localidade / Cidade (L)",
    "emailAddress": "E-mail",
    "subjectHint": "É necessário pelo menos um campo Subject ou SAN.",
    "sanTitle": "Nomes alternativos do assunto (SAN)",
    "sanDnsLabel": "Nomes DNS",
    "sanIpLabel": "Endereços IP",
    "sanEmailLabel": "E-mails",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "um por linha, ex. example.com",
    "sanIpPlaceholder": "um por linha, ex. 192.0.2.1",
    "sanEmailPlaceholder": "um por linha, ex. admin{'@'}example.com",
    "sanUriPlaceholder": "um por linha, ex. https://example.com",
    "sanHint": "SAN é recomendado para certificados TLS modernos.",
    "generateCsr": "Gerar CSR",
    "csrOutputTitle": "Saída do CSR",
    "privateKeyTitle": "Chave privada (PKCS#8)",
    "privateKeyWarning": "Mantenha esta chave privada segura. Quem a tiver pode se passar pelo certificado.",
    "downloadCsr": "Baixar CSR",
    "downloadKey": "Baixar chave privada",
    "errorTitle": "Erro",
    "keyAlgorithmLabel": "Chave: {algorithm}",
    "errorMissingSubjectOrSan": "Informe pelo menos um campo Subject ou SAN.",
    "errorInvalidPem": "Entrada PEM inválida.",
    "errorUnsupportedPem": "Bloco PEM não suportado. Forneça uma chave privada.",
    "errorEncryptedKey": "Chaves privadas criptografadas não são suportadas.",
    "errorUnsupportedCurve": "Curva elíptica não suportada.",
    "errorUnsupportedKeyType": "Tipo de chave não suportado para assinar CSR.",
    "errorMissingPrivateKey": "A chave privada é obrigatória.",
    "errorInvalidSanIp": "Endereço IP inválido no SAN: {message}"
  },
  "ar": {
    "keySourceTitle": "مصدر المفتاح",
    "keySourceGenerate": "إنشاء مفتاح جديد",
    "keySourceImport": "استيراد مفتاح خاص",
    "keySourceGenerateHint": "كل عملية إنشاء تُنتج زوج مفاتيح جديد داخل المتصفح.",
    "keySourceImportHint": "الصق مفتاحًا خاصًا بصيغة PEM (PKCS#8 أو RSA أو EC). المفاتيح المشفّرة غير مدعومة.",
    "algorithmLabel": "خوارزمية المفتاح",
    "rsaKeySizeLabel": "طول مفتاح RSA",
    "rsaHashLabel": "تجزئة RSA",
    "ecCurveLabel": "منحنى EC",
    "privateKeyPlaceholder": "الصق مفتاح PEM الخاص...",
    "privateKeyHint": "مدعوم: PRIVATE KEY (PKCS#8) و RSA PRIVATE KEY و EC PRIVATE KEY.",
    "subjectTitle": "الموضوع (DN)",
    "commonName": "الاسم الشائع (CN)",
    "organization": "المؤسسة (O)",
    "organizationalUnit": "الوحدة التنظيمية (OU)",
    "country": "الدولة (C)",
    "state": "الولاية / المنطقة (ST)",
    "locality": "المدينة (L)",
    "emailAddress": "البريد الإلكتروني",
    "subjectHint": "يلزم إدخال حقل واحد على الأقل في Subject أو SAN.",
    "sanTitle": "الأسماء البديلة للموضوع (SAN)",
    "sanDnsLabel": "أسماء DNS",
    "sanIpLabel": "عناوين IP",
    "sanEmailLabel": "عناوين البريد",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "واحد في كل سطر، مثل example.com",
    "sanIpPlaceholder": "واحد في كل سطر، مثل 192.0.2.1",
    "sanEmailPlaceholder": "واحد في كل سطر، مثل admin{'@'}example.com",
    "sanUriPlaceholder": "واحد في كل سطر، مثل https://example.com",
    "sanHint": "يوصى باستخدام SAN لشهادات TLS الحديثة.",
    "generateCsr": "إنشاء CSR",
    "csrOutputTitle": "مخرجات CSR",
    "privateKeyTitle": "المفتاح الخاص (PKCS#8)",
    "privateKeyWarning": "احتفظ بالمفتاح الخاص بأمان. من يمتلكه يمكنه انتحال الشهادة.",
    "downloadCsr": "تنزيل CSR",
    "downloadKey": "تنزيل المفتاح الخاص",
    "errorTitle": "خطأ",
    "keyAlgorithmLabel": "المفتاح: {algorithm}",
    "errorMissingSubjectOrSan": "أدخل حقلًا واحدًا على الأقل في Subject أو SAN.",
    "errorInvalidPem": "إدخال PEM غير صالح.",
    "errorUnsupportedPem": "كتلة PEM غير مدعومة. قدّم مفتاحًا خاصًا.",
    "errorEncryptedKey": "المفاتيح الخاصة المشفّرة غير مدعومة.",
    "errorUnsupportedCurve": "منحنى بيضاوي غير مدعوم.",
    "errorUnsupportedKeyType": "نوع المفتاح غير مدعوم لتوقيع CSR.",
    "errorMissingPrivateKey": "المفتاح الخاص مطلوب.",
    "errorInvalidSanIp": "عنوان IP غير صالح في SAN: {message}"
  },
  "hi": {
    "keySourceTitle": "कुंजी स्रोत",
    "keySourceGenerate": "नई कुंजी बनाएँ",
    "keySourceImport": "निजी कुंजी आयात करें",
    "keySourceGenerateHint": "हर बार जनरेट करने पर ब्राउज़र में नया कुंजी युग्म बनता है।",
    "keySourceImportHint": "PEM निजी कुंजी (PKCS#8, RSA, EC) पेस्ट करें। एन्क्रिप्टेड कुंजियाँ समर्थित नहीं हैं।",
    "algorithmLabel": "कुंजी एल्गोरिथ्म",
    "rsaKeySizeLabel": "RSA कुंजी आकार",
    "rsaHashLabel": "RSA हैश",
    "ecCurveLabel": "EC कर्व",
    "privateKeyPlaceholder": "PEM निजी कुंजी पेस्ट करें...",
    "privateKeyHint": "समर्थित: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY।",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organization (O)",
    "organizationalUnit": "Organizational Unit (OU)",
    "country": "Country (C)",
    "state": "State / Province (ST)",
    "locality": "Locality / City (L)",
    "emailAddress": "ईमेल पता",
    "subjectHint": "कम से कम एक Subject फ़ील्ड या SAN एंट्री आवश्यक है।",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS नाम",
    "sanIpLabel": "IP पते",
    "sanEmailLabel": "ईमेल पते",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "प्रत्येक लाइन में एक, जैसे example.com",
    "sanIpPlaceholder": "प्रत्येक लाइन में एक, जैसे 192.0.2.1",
    "sanEmailPlaceholder": "प्रत्येक लाइन में एक, जैसे admin{'@'}example.com",
    "sanUriPlaceholder": "प्रत्येक लाइन में एक, जैसे https://example.com",
    "sanHint": "आधुनिक TLS प्रमाणपत्रों के लिए SAN की सिफारिश की जाती है।",
    "generateCsr": "CSR बनाएँ",
    "csrOutputTitle": "CSR आउटपुट",
    "privateKeyTitle": "निजी कुंजी (PKCS#8)",
    "privateKeyWarning": "निजी कुंजी सुरक्षित रखें। इसके होने पर कोई भी प्रमाणपत्र का दुरुपयोग कर सकता है।",
    "downloadCsr": "CSR डाउनलोड करें",
    "downloadKey": "निजी कुंजी डाउनलोड करें",
    "errorTitle": "त्रुटि",
    "keyAlgorithmLabel": "कुंजी: {algorithm}",
    "errorMissingSubjectOrSan": "कम से कम एक Subject या SAN दें।",
    "errorInvalidPem": "अमान्य PEM इनपुट।",
    "errorUnsupportedPem": "असमर्थित PEM ब्लॉक। निजी कुंजी प्रदान करें।",
    "errorEncryptedKey": "एन्क्रिप्टेड निजी कुंजियाँ समर्थित नहीं हैं।",
    "errorUnsupportedCurve": "असमर्थित एलिप्टिक कर्व।",
    "errorUnsupportedKeyType": "इस कुंजी प्रकार से CSR साइन समर्थित नहीं है।",
    "errorMissingPrivateKey": "निजी कुंजी आवश्यक है।",
    "errorInvalidSanIp": "SAN में IP पता अमान्य है: {message}"
  },
  "tr": {
    "keySourceTitle": "Anahtar kaynağı",
    "keySourceGenerate": "Yeni anahtar oluştur",
    "keySourceImport": "Özel anahtar içe aktar",
    "keySourceGenerateHint": "Her oluşturma tarayıcıda yeni bir anahtar çifti üretir.",
    "keySourceImportHint": "PEM özel anahtarını yapıştırın (PKCS#8, RSA, EC). Şifreli anahtarlar desteklenmez.",
    "algorithmLabel": "Anahtar algoritması",
    "rsaKeySizeLabel": "RSA anahtar uzunluğu",
    "rsaHashLabel": "RSA özeti",
    "ecCurveLabel": "EC eğrisi",
    "privateKeyPlaceholder": "PEM özel anahtarını yapıştır...",
    "privateKeyHint": "Desteklenenler: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Kuruluş (O)",
    "organizationalUnit": "Organizasyon Birimi (OU)",
    "country": "Ülke (C)",
    "state": "Eyalet / Bölge (ST)",
    "locality": "Şehir (L)",
    "emailAddress": "E-posta",
    "subjectHint": "En az bir Subject alanı veya SAN girdisi gereklidir.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS adları",
    "sanIpLabel": "IP adresleri",
    "sanEmailLabel": "E-posta adresleri",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "satır başına bir, örn. example.com",
    "sanIpPlaceholder": "satır başına bir, örn. 192.0.2.1",
    "sanEmailPlaceholder": "satır başına bir, örn. admin{'@'}example.com",
    "sanUriPlaceholder": "satır başına bir, örn. https://example.com",
    "sanHint": "Modern TLS sertifikaları için SAN önerilir.",
    "generateCsr": "CSR oluştur",
    "csrOutputTitle": "CSR çıktısı",
    "privateKeyTitle": "Özel anahtar (PKCS#8)",
    "privateKeyWarning": "Özel anahtarınızı güvenli tutun. Elinde olan kişi sertifikayı taklit edebilir.",
    "downloadCsr": "CSR indir",
    "downloadKey": "Özel anahtarı indir",
    "errorTitle": "Hata",
    "keyAlgorithmLabel": "Anahtar: {algorithm}",
    "errorMissingSubjectOrSan": "En az bir Subject alanı veya SAN girin.",
    "errorInvalidPem": "Geçersiz PEM girdisi.",
    "errorUnsupportedPem": "Desteklenmeyen PEM bloğu. Özel anahtar sağlayın.",
    "errorEncryptedKey": "Şifreli özel anahtarlar desteklenmez.",
    "errorUnsupportedCurve": "Desteklenmeyen eliptik eğri.",
    "errorUnsupportedKeyType": "Bu anahtar türü CSR imzasını desteklemez.",
    "errorMissingPrivateKey": "Özel anahtar gerekli.",
    "errorInvalidSanIp": "SAN içinde geçersiz IP adresi: {message}"
  },
  "nl": {
    "keySourceTitle": "Sleutelbron",
    "keySourceGenerate": "Nieuwe sleutel genereren",
    "keySourceImport": "Privésleutel importeren",
    "keySourceGenerateHint": "Elke generatie maakt een nieuw sleutelpaar in je browser.",
    "keySourceImportHint": "Plak een PEM-privésleutel (PKCS#8, RSA, EC). Versleutelde sleutels worden niet ondersteund.",
    "algorithmLabel": "Sleutelalgoritme",
    "rsaKeySizeLabel": "RSA-sleutellengte",
    "rsaHashLabel": "RSA-hash",
    "ecCurveLabel": "EC-curve",
    "privateKeyPlaceholder": "Plak een PEM-privésleutel...",
    "privateKeyHint": "Ondersteund: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisatie (O)",
    "organizationalUnit": "Organisatie-eenheid (OU)",
    "country": "Land (C)",
    "state": "Staat / Provincie (ST)",
    "locality": "Plaats / Stad (L)",
    "emailAddress": "E-mailadres",
    "subjectHint": "Minstens één Subject-veld of SAN is vereist.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS-namen",
    "sanIpLabel": "IP-adressen",
    "sanEmailLabel": "E-mailadressen",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "één per regel, bv. example.com",
    "sanIpPlaceholder": "één per regel, bv. 192.0.2.1",
    "sanEmailPlaceholder": "één per regel, bv. admin{'@'}example.com",
    "sanUriPlaceholder": "één per regel, bv. https://example.com",
    "sanHint": "SAN wordt aanbevolen voor moderne TLS-certificaten.",
    "generateCsr": "CSR genereren",
    "csrOutputTitle": "CSR-uitvoer",
    "privateKeyTitle": "Privésleutel (PKCS#8)",
    "privateKeyWarning": "Bewaar deze privésleutel veilig. Iedereen met toegang kan het certificaat misbruiken.",
    "downloadCsr": "CSR downloaden",
    "downloadKey": "Privésleutel downloaden",
    "errorTitle": "Fout",
    "keyAlgorithmLabel": "Sleutel: {algorithm}",
    "errorMissingSubjectOrSan": "Vul minstens één Subject-veld of SAN in.",
    "errorInvalidPem": "Ongeldige PEM-invoer.",
    "errorUnsupportedPem": "Niet-ondersteunde PEM-blok. Geef een privésleutel op.",
    "errorEncryptedKey": "Versleutelde privésleutels worden niet ondersteund.",
    "errorUnsupportedCurve": "Niet-ondersteunde elliptische curve.",
    "errorUnsupportedKeyType": "Niet-ondersteund sleuteltype voor CSR-ondertekening.",
    "errorMissingPrivateKey": "Privésleutel is vereist.",
    "errorInvalidSanIp": "Ongeldig IP-adres in SAN: {message}"
  },
  "sv": {
    "keySourceTitle": "Nyckelkälla",
    "keySourceGenerate": "Generera ny nyckel",
    "keySourceImport": "Importera privat nyckel",
    "keySourceGenerateHint": "Varje generering skapar ett nytt nyckelpar i webbläsaren.",
    "keySourceImportHint": "Klistra in en PEM-privatnyckel (PKCS#8, RSA, EC). Krypterade nycklar stöds inte.",
    "algorithmLabel": "Nyckelalgoritm",
    "rsaKeySizeLabel": "RSA-nyckelstorlek",
    "rsaHashLabel": "RSA-hash",
    "ecCurveLabel": "EC-kurva",
    "privateKeyPlaceholder": "Klistra in en PEM-privatnyckel...",
    "privateKeyHint": "Stöd: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisation (O)",
    "organizationalUnit": "Organisationsenhet (OU)",
    "country": "Land (C)",
    "state": "Region / Län (ST)",
    "locality": "Ort / Stad (L)",
    "emailAddress": "E-postadress",
    "subjectHint": "Minst ett Subject-fält eller SAN krävs.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS-namn",
    "sanIpLabel": "IP-adresser",
    "sanEmailLabel": "E-postadresser",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "en per rad, t.ex. example.com",
    "sanIpPlaceholder": "en per rad, t.ex. 192.0.2.1",
    "sanEmailPlaceholder": "en per rad, t.ex. admin{'@'}example.com",
    "sanUriPlaceholder": "en per rad, t.ex. https://example.com",
    "sanHint": "SAN rekommenderas för moderna TLS-certifikat.",
    "generateCsr": "Generera CSR",
    "csrOutputTitle": "CSR-utdata",
    "privateKeyTitle": "Privat nyckel (PKCS#8)",
    "privateKeyWarning": "Förvara den privata nyckeln säkert. Den som har den kan missbruka certifikatet.",
    "downloadCsr": "Ladda ner CSR",
    "downloadKey": "Ladda ner privat nyckel",
    "errorTitle": "Fel",
    "keyAlgorithmLabel": "Nyckel: {algorithm}",
    "errorMissingSubjectOrSan": "Ange minst ett Subject-fält eller SAN.",
    "errorInvalidPem": "Ogiltig PEM-inmatning.",
    "errorUnsupportedPem": "Ej stödd PEM-block. Ange en privat nyckel.",
    "errorEncryptedKey": "Krypterade privata nycklar stöds inte.",
    "errorUnsupportedCurve": "Ej stödd elliptisk kurva.",
    "errorUnsupportedKeyType": "Nyckeltypen stöds inte för CSR-signering.",
    "errorMissingPrivateKey": "Privat nyckel krävs.",
    "errorInvalidSanIp": "Ogiltig IP-adress i SAN: {message}"
  },
  "pl": {
    "keySourceTitle": "Źródło klucza",
    "keySourceGenerate": "Wygeneruj nowy klucz",
    "keySourceImport": "Importuj klucz prywatny",
    "keySourceGenerateHint": "Każde generowanie tworzy nową parę kluczy w przeglądarce.",
    "keySourceImportHint": "Wklej klucz prywatny PEM (PKCS#8, RSA, EC). Klucze zaszyfrowane nie są obsługiwane.",
    "algorithmLabel": "Algorytm klucza",
    "rsaKeySizeLabel": "Rozmiar klucza RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Krzywa EC",
    "privateKeyPlaceholder": "Wklej klucz prywatny PEM...",
    "privateKeyHint": "Obsługiwane: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organizacja (O)",
    "organizationalUnit": "Jednostka organizacyjna (OU)",
    "country": "Kraj (C)",
    "state": "Województwo / Region (ST)",
    "locality": "Miejscowość (L)",
    "emailAddress": "Adres e-mail",
    "subjectHint": "Wymagane jest co najmniej jedno pole Subject lub SAN.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "Nazwy DNS",
    "sanIpLabel": "Adresy IP",
    "sanEmailLabel": "Adresy e-mail",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "jeden na linię, np. example.com",
    "sanIpPlaceholder": "jeden na linię, np. 192.0.2.1",
    "sanEmailPlaceholder": "jeden na linię, np. admin{'@'}example.com",
    "sanUriPlaceholder": "jeden na linię, np. https://example.com",
    "sanHint": "SAN jest zalecany dla nowoczesnych certyfikatów TLS.",
    "generateCsr": "Generuj CSR",
    "csrOutputTitle": "Wyjście CSR",
    "privateKeyTitle": "Klucz prywatny (PKCS#8)",
    "privateKeyWarning": "Chroń klucz prywatny. Każdy, kto go ma, może podszyć się pod certyfikat.",
    "downloadCsr": "Pobierz CSR",
    "downloadKey": "Pobierz klucz prywatny",
    "errorTitle": "Błąd",
    "keyAlgorithmLabel": "Klucz: {algorithm}",
    "errorMissingSubjectOrSan": "Podaj co najmniej jedno pole Subject lub SAN.",
    "errorInvalidPem": "Nieprawidłowe dane PEM.",
    "errorUnsupportedPem": "Nieobsługiwany blok PEM. Podaj klucz prywatny.",
    "errorEncryptedKey": "Zaszyfrowane klucze prywatne nie są obsługiwane.",
    "errorUnsupportedCurve": "Nieobsługiwana krzywa eliptyczna.",
    "errorUnsupportedKeyType": "Ten typ klucza nie obsługuje podpisu CSR.",
    "errorMissingPrivateKey": "Klucz prywatny jest wymagany.",
    "errorInvalidSanIp": "Nieprawidłowy adres IP w SAN: {message}"
  },
  "vi": {
    "keySourceTitle": "Nguồn khóa",
    "keySourceGenerate": "Tạo khóa mới",
    "keySourceImport": "Nhập khóa riêng",
    "keySourceGenerateHint": "Mỗi lần tạo sẽ sinh một cặp khóa mới ngay trong trình duyệt.",
    "keySourceImportHint": "Dán khóa riêng PEM (PKCS#8, RSA, EC). Không hỗ trợ khóa đã mã hóa.",
    "algorithmLabel": "Thuật toán khóa",
    "rsaKeySizeLabel": "Kích thước khóa RSA",
    "rsaHashLabel": "Băm RSA",
    "ecCurveLabel": "Đường cong EC",
    "privateKeyPlaceholder": "Dán khóa riêng PEM...",
    "privateKeyHint": "Hỗ trợ: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Tổ chức (O)",
    "organizationalUnit": "Đơn vị (OU)",
    "country": "Quốc gia (C)",
    "state": "Tỉnh/Bang (ST)",
    "locality": "Thành phố (L)",
    "emailAddress": "Email",
    "subjectHint": "Cần ít nhất một trường Subject hoặc SAN.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "Tên DNS",
    "sanIpLabel": "Địa chỉ IP",
    "sanEmailLabel": "Địa chỉ email",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "mỗi dòng một, ví dụ example.com",
    "sanIpPlaceholder": "mỗi dòng một, ví dụ 192.0.2.1",
    "sanEmailPlaceholder": "mỗi dòng một, ví dụ admin{'@'}example.com",
    "sanUriPlaceholder": "mỗi dòng một, ví dụ https://example.com",
    "sanHint": "SAN được khuyến nghị cho chứng chỉ TLS hiện đại.",
    "generateCsr": "Tạo CSR",
    "csrOutputTitle": "Kết quả CSR",
    "privateKeyTitle": "Khóa riêng (PKCS#8)",
    "privateKeyWarning": "Hãy giữ khóa riêng an toàn. Ai có khóa này có thể giả mạo chứng chỉ.",
    "downloadCsr": "Tải CSR",
    "downloadKey": "Tải khóa riêng",
    "errorTitle": "Lỗi",
    "keyAlgorithmLabel": "Khóa: {algorithm}",
    "errorMissingSubjectOrSan": "Vui lòng nhập ít nhất một trường Subject hoặc SAN.",
    "errorInvalidPem": "PEM không hợp lệ.",
    "errorUnsupportedPem": "Khối PEM không được hỗ trợ. Hãy cung cấp khóa riêng.",
    "errorEncryptedKey": "Không hỗ trợ khóa riêng đã mã hóa.",
    "errorUnsupportedCurve": "Đường cong elip không được hỗ trợ.",
    "errorUnsupportedKeyType": "Loại khóa không hỗ trợ ký CSR.",
    "errorMissingPrivateKey": "Cần có khóa riêng.",
    "errorInvalidSanIp": "Địa chỉ IP SAN không hợp lệ: {message}"
  },
  "th": {
    "keySourceTitle": "แหล่งที่มาของคีย์",
    "keySourceGenerate": "สร้างคีย์ใหม่",
    "keySourceImport": "นำเข้าคีย์ส่วนตัว",
    "keySourceGenerateHint": "ทุกครั้งที่สร้างจะได้คู่คีย์ใหม่ในเบราว์เซอร์ของคุณ.",
    "keySourceImportHint": "วางคีย์ส่วนตัว PEM (PKCS#8, RSA, EC) ไม่รองรับคีย์ที่เข้ารหัส.",
    "algorithmLabel": "อัลกอริทึมคีย์",
    "rsaKeySizeLabel": "ขนาดคีย์ RSA",
    "rsaHashLabel": "แฮช RSA",
    "ecCurveLabel": "เส้นโค้ง EC",
    "privateKeyPlaceholder": "วางคีย์ส่วนตัว PEM...",
    "privateKeyHint": "รองรับ: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "องค์กร (O)",
    "organizationalUnit": "หน่วยงาน (OU)",
    "country": "ประเทศ (C)",
    "state": "รัฐ/จังหวัด (ST)",
    "locality": "เมือง (L)",
    "emailAddress": "อีเมล",
    "subjectHint": "ต้องมีอย่างน้อยหนึ่งฟิลด์ Subject หรือ SAN.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "ชื่อ DNS",
    "sanIpLabel": "ที่อยู่ IP",
    "sanEmailLabel": "อีเมล",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "หนึ่งต่อบรรทัด เช่น example.com",
    "sanIpPlaceholder": "หนึ่งต่อบรรทัด เช่น 192.0.2.1",
    "sanEmailPlaceholder": "หนึ่งต่อบรรทัด เช่น admin{'@'}example.com",
    "sanUriPlaceholder": "หนึ่งต่อบรรทัด เช่น https://example.com",
    "sanHint": "แนะนำให้ใช้ SAN สำหรับใบรับรอง TLS สมัยใหม่.",
    "generateCsr": "สร้าง CSR",
    "csrOutputTitle": "ผลลัพธ์ CSR",
    "privateKeyTitle": "คีย์ส่วนตัว (PKCS#8)",
    "privateKeyWarning": "เก็บคีย์ส่วนตัวให้ปลอดภัย ผู้ที่มีคีย์สามารถปลอมแปลงใบรับรองได้.",
    "downloadCsr": "ดาวน์โหลด CSR",
    "downloadKey": "ดาวน์โหลดคีย์ส่วนตัว",
    "errorTitle": "ข้อผิดพลาด",
    "keyAlgorithmLabel": "คีย์: {algorithm}",
    "errorMissingSubjectOrSan": "กรอกอย่างน้อยหนึ่งฟิลด์ Subject หรือ SAN.",
    "errorInvalidPem": "ข้อมูล PEM ไม่ถูกต้อง.",
    "errorUnsupportedPem": "บล็อก PEM ไม่รองรับ โปรดระบุคีย์ส่วนตัว.",
    "errorEncryptedKey": "ไม่รองรับคีย์ส่วนตัวที่เข้ารหัส.",
    "errorUnsupportedCurve": "เส้นโค้งวงรีไม่รองรับ.",
    "errorUnsupportedKeyType": "ประเภทคีย์นี้ไม่รองรับการลงนาม CSR.",
    "errorMissingPrivateKey": "จำเป็นต้องมีคีย์ส่วนตัว.",
    "errorInvalidSanIp": "ที่อยู่ IP ใน SAN ไม่ถูกต้อง: {message}"
  },
  "id": {
    "keySourceTitle": "Sumber kunci",
    "keySourceGenerate": "Buat kunci baru",
    "keySourceImport": "Impor kunci privat",
    "keySourceGenerateHint": "Setiap pembuatan menghasilkan pasangan kunci baru di browser.",
    "keySourceImportHint": "Tempel kunci privat PEM (PKCS#8, RSA, EC). Kunci terenkripsi tidak didukung.",
    "algorithmLabel": "Algoritma kunci",
    "rsaKeySizeLabel": "Ukuran kunci RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Kurva EC",
    "privateKeyPlaceholder": "Tempel kunci privat PEM...",
    "privateKeyHint": "Didukung: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisasi (O)",
    "organizationalUnit": "Unit organisasi (OU)",
    "country": "Negara (C)",
    "state": "Provinsi / Negara bagian (ST)",
    "locality": "Kota (L)",
    "emailAddress": "Email",
    "subjectHint": "Minimal satu field Subject atau SAN diperlukan.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "Nama DNS",
    "sanIpLabel": "Alamat IP",
    "sanEmailLabel": "Alamat email",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "satu per baris, mis. example.com",
    "sanIpPlaceholder": "satu per baris, mis. 192.0.2.1",
    "sanEmailPlaceholder": "satu per baris, mis. admin{'@'}example.com",
    "sanUriPlaceholder": "satu per baris, mis. https://example.com",
    "sanHint": "SAN direkomendasikan untuk sertifikat TLS modern.",
    "generateCsr": "Buat CSR",
    "csrOutputTitle": "Output CSR",
    "privateKeyTitle": "Kunci privat (PKCS#8)",
    "privateKeyWarning": "Simpan kunci privat dengan aman. Siapa pun yang memilikinya bisa menyamar sebagai sertifikat.",
    "downloadCsr": "Unduh CSR",
    "downloadKey": "Unduh kunci privat",
    "errorTitle": "Kesalahan",
    "keyAlgorithmLabel": "Kunci: {algorithm}",
    "errorMissingSubjectOrSan": "Masukkan minimal satu field Subject atau SAN.",
    "errorInvalidPem": "Input PEM tidak valid.",
    "errorUnsupportedPem": "Blok PEM tidak didukung. Berikan kunci privat.",
    "errorEncryptedKey": "Kunci privat terenkripsi tidak didukung.",
    "errorUnsupportedCurve": "Kurva eliptik tidak didukung.",
    "errorUnsupportedKeyType": "Jenis kunci ini tidak mendukung penandatanganan CSR.",
    "errorMissingPrivateKey": "Kunci privat diperlukan.",
    "errorInvalidSanIp": "Alamat IP di SAN tidak valid: {message}"
  },
  "he": {
    "keySourceTitle": "מקור מפתח",
    "keySourceGenerate": "צור מפתח חדש",
    "keySourceImport": "ייבא מפתח פרטי",
    "keySourceGenerateHint": "כל יצירה יוצרת זוג מפתחות חדש בדפדפן.",
    "keySourceImportHint": "הדבק מפתח פרטי PEM (PKCS#8, RSA, EC). מפתחות מוצפנים אינם נתמכים.",
    "algorithmLabel": "אלגוריתם מפתח",
    "rsaKeySizeLabel": "גודל מפתח RSA",
    "rsaHashLabel": "האש RSA",
    "ecCurveLabel": "עקומת EC",
    "privateKeyPlaceholder": "הדבק מפתח פרטי PEM...",
    "privateKeyHint": "נתמך: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "ארגון (O)",
    "organizationalUnit": "יחידה ארגונית (OU)",
    "country": "מדינה (C)",
    "state": "מחוז / מדינה (ST)",
    "locality": "עיר (L)",
    "emailAddress": "דוא\"ל",
    "subjectHint": "נדרש לפחות שדה Subject אחד או SAN.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "שמות DNS",
    "sanIpLabel": "כתובות IP",
    "sanEmailLabel": "כתובות דוא\"ל",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "אחד בכל שורה, לדוגמה example.com",
    "sanIpPlaceholder": "אחד בכל שורה, לדוגמה 192.0.2.1",
    "sanEmailPlaceholder": "אחד בכל שורה, לדוגמה admin{'@'}example.com",
    "sanUriPlaceholder": "אחד בכל שורה, לדוגמה https://example.com",
    "sanHint": "SAN מומלץ לתעודות TLS מודרניות.",
    "generateCsr": "צור CSR",
    "csrOutputTitle": "פלט CSR",
    "privateKeyTitle": "מפתח פרטי (PKCS#8)",
    "privateKeyWarning": "שמור את המפתח הפרטי בבטחה. מי שברשותו יכול להתחזות לתעודה.",
    "downloadCsr": "הורד CSR",
    "downloadKey": "הורד מפתח פרטי",
    "errorTitle": "שגיאה",
    "keyAlgorithmLabel": "מפתח: {algorithm}",
    "errorMissingSubjectOrSan": "הזן לפחות שדה Subject אחד או SAN.",
    "errorInvalidPem": "קלט PEM לא תקין.",
    "errorUnsupportedPem": "בלוק PEM לא נתמך. ספק מפתח פרטי.",
    "errorEncryptedKey": "מפתחות פרטיים מוצפנים אינם נתמכים.",
    "errorUnsupportedCurve": "עקומה אליפטית לא נתמכת.",
    "errorUnsupportedKeyType": "סוג מפתח זה לא תומך בחתימת CSR.",
    "errorMissingPrivateKey": "נדרש מפתח פרטי.",
    "errorInvalidSanIp": "כתובת IP לא תקינה ב-SAN: {message}"
  },
  "ms": {
    "keySourceTitle": "Sumber kunci",
    "keySourceGenerate": "Jana kunci baharu",
    "keySourceImport": "Import kunci peribadi",
    "keySourceGenerateHint": "Setiap penjanaan akan menghasilkan pasangan kunci baharu dalam pelayar.",
    "keySourceImportHint": "Tampal kunci peribadi PEM (PKCS#8, RSA, EC). Kunci yang disulitkan tidak disokong.",
    "algorithmLabel": "Algoritma kunci",
    "rsaKeySizeLabel": "Saiz kunci RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Lengkung EC",
    "privateKeyPlaceholder": "Tampal kunci peribadi PEM...",
    "privateKeyHint": "Disokong: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisasi (O)",
    "organizationalUnit": "Unit organisasi (OU)",
    "country": "Negara (C)",
    "state": "Negeri / Wilayah (ST)",
    "locality": "Bandar (L)",
    "emailAddress": "E-mel",
    "subjectHint": "Sekurang-kurangnya satu medan Subject atau SAN diperlukan.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "Nama DNS",
    "sanIpLabel": "Alamat IP",
    "sanEmailLabel": "Alamat e-mel",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "satu per baris, contohnya example.com",
    "sanIpPlaceholder": "satu per baris, contohnya 192.0.2.1",
    "sanEmailPlaceholder": "satu per baris, contohnya admin{'@'}example.com",
    "sanUriPlaceholder": "satu per baris, contohnya https://example.com",
    "sanHint": "SAN disyorkan untuk sijil TLS moden.",
    "generateCsr": "Jana CSR",
    "csrOutputTitle": "Output CSR",
    "privateKeyTitle": "Kunci peribadi (PKCS#8)",
    "privateKeyWarning": "Simpan kunci peribadi dengan selamat. Sesiapa yang memilikinya boleh menyamar sebagai sijil.",
    "downloadCsr": "Muat turun CSR",
    "downloadKey": "Muat turun kunci peribadi",
    "errorTitle": "Ralat",
    "keyAlgorithmLabel": "Kunci: {algorithm}",
    "errorMissingSubjectOrSan": "Masukkan sekurang-kurangnya satu medan Subject atau SAN.",
    "errorInvalidPem": "Input PEM tidak sah.",
    "errorUnsupportedPem": "Blok PEM tidak disokong. Sila berikan kunci peribadi.",
    "errorEncryptedKey": "Kunci peribadi yang disulitkan tidak disokong.",
    "errorUnsupportedCurve": "Lengkung eliptik tidak disokong.",
    "errorUnsupportedKeyType": "Jenis kunci ini tidak menyokong penandatanganan CSR.",
    "errorMissingPrivateKey": "Kunci peribadi diperlukan.",
    "errorInvalidSanIp": "Alamat IP dalam SAN tidak sah: {message}"
  },
  "no": {
    "keySourceTitle": "Nøkkelkilde",
    "keySourceGenerate": "Generer ny nøkkel",
    "keySourceImport": "Importer privat nøkkel",
    "keySourceGenerateHint": "Hver generering lager et nytt nøkkelpar i nettleseren.",
    "keySourceImportHint": "Lim inn en PEM-privatnøkkel (PKCS#8, RSA, EC). Krypterte nøkler støttes ikke.",
    "algorithmLabel": "Nøkkelalgoritme",
    "rsaKeySizeLabel": "RSA-nøkkelstørrelse",
    "rsaHashLabel": "RSA-hash",
    "ecCurveLabel": "EC-kurve",
    "privateKeyPlaceholder": "Lim inn PEM-privatnøkkel...",
    "privateKeyHint": "Støttet: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY.",
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisasjon (O)",
    "organizationalUnit": "Organisasjonsenhet (OU)",
    "country": "Land (C)",
    "state": "Fylke / Region (ST)",
    "locality": "Sted / By (L)",
    "emailAddress": "E-post",
    "subjectHint": "Minst ett Subject-felt eller SAN er påkrevd.",
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS-navn",
    "sanIpLabel": "IP-adresser",
    "sanEmailLabel": "E-postadresser",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "én per linje, f.eks. example.com",
    "sanIpPlaceholder": "én per linje, f.eks. 192.0.2.1",
    "sanEmailPlaceholder": "én per linje, f.eks. admin{'@'}example.com",
    "sanUriPlaceholder": "én per linje, f.eks. https://example.com",
    "sanHint": "SAN anbefales for moderne TLS-sertifikater.",
    "generateCsr": "Generer CSR",
    "csrOutputTitle": "CSR-utdata",
    "privateKeyTitle": "Privat nøkkel (PKCS#8)",
    "privateKeyWarning": "Oppbevar privatnøkkelen sikkert. Den som har den kan misbruke sertifikatet.",
    "downloadCsr": "Last ned CSR",
    "downloadKey": "Last ned privat nøkkel",
    "errorTitle": "Feil",
    "keyAlgorithmLabel": "Nøkkel: {algorithm}",
    "errorMissingSubjectOrSan": "Oppgi minst ett Subject-felt eller SAN.",
    "errorInvalidPem": "Ugyldig PEM-inndata.",
    "errorUnsupportedPem": "Ikke støttet PEM-blokk. Oppgi en privat nøkkel.",
    "errorEncryptedKey": "Krypterte private nøkler støttes ikke.",
    "errorUnsupportedCurve": "Ikke støttet elliptisk kurve.",
    "errorUnsupportedKeyType": "Denne nøkkeltypen støtter ikke CSR-signering.",
    "errorMissingPrivateKey": "Privat nøkkel er påkrevd.",
    "errorInvalidSanIp": "Ugyldig IP-adresse i SAN: {message}"
  }
}
</i18n>
