<template>
  <n-tabs v-model:value="activeTab" type="line" animated>
    <n-tab-pane name="jwk" :tab="t('tabJwkToPem')">
      <ToolSectionHeader>{{ t('jwkInputTitle') }}</ToolSectionHeader>
      <ToolSection>
        <TextOrFileInput
          v-model:value="jwkInput"
          class="monospace-field"
          :placeholder="t('jwkInputPlaceholder')"
          :accept="jwkAccept"
          :status="jwkInputStatus"
          :wrap-with-form-item="false"
        />
        <n-text depth="3" class="input-hint">{{ t('jwkInputHint') }}</n-text>
      </ToolSection>

      <ToolSection v-if="jwkKeys.length > 1">
        <n-form-item :label="t('keySelectLabel')" class="wide-form-item">
          <n-select v-model:value="selectedJwkIndex" :options="jwkKeyOptions" />
        </n-form-item>
        <n-text depth="3" class="input-hint">{{ t('keySelectHint') }}</n-text>
      </ToolSection>

      <ToolSection>
        <n-form-item :label="t('outputTypeLabel')" class="wide-form-item">
          <n-radio-group v-model:value="jwkOutputType">
            <n-radio-button value="public">{{ t('outputTypePublic') }}</n-radio-button>
            <n-radio-button value="private">{{ t('outputTypePrivate') }}</n-radio-button>
          </n-radio-group>
        </n-form-item>
      </ToolSection>

      <n-alert v-if="jwkError" type="error" :title="t('conversionErrorTitle')">
        {{ jwkError }}
      </n-alert>

      <ToolSectionHeader v-if="jwkOutput">{{ t('outputTitle') }}</ToolSectionHeader>
      <ToolSection v-if="jwkOutput">
        <n-input
          class="monospace-field"
          :value="jwkOutput"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 14 }"
          readonly
        />
      </ToolSection>
      <ToolSection v-if="jwkOutput">
        <n-flex justify="space-between" align="center">
          <CopyToClipboardButton :content="jwkOutput" />
          <n-button tag="a" text :href="jwkDownloadUrl ?? undefined" :download="jwkDownloadName">
            <template #icon>
              <n-icon :component="ArrowDownload16Regular" />
            </template>
            {{ t('downloadButton') }}
          </n-button>
        </n-flex>
      </ToolSection>
    </n-tab-pane>

    <n-tab-pane name="pem" :tab="t('tabPemToJwk')">
      <ToolSectionHeader>{{ t('pemInputTitle') }}</ToolSectionHeader>
      <ToolSection>
        <TextOrFileInput
          v-model:value="pemInput"
          class="monospace-field"
          :placeholder="t('pemInputPlaceholder')"
          :accept="pemAccept"
          :status="pemInputStatus"
          :wrap-with-form-item="false"
        />
        <n-text depth="3" class="input-hint">{{ t('pemInputHint') }}</n-text>
      </ToolSection>

      <ToolSection>
        <n-flex align="center" justify="space-between" class="wide-form-item">
          <n-text>{{ t('prettyJson') }}</n-text>
          <n-switch v-model:value="prettyJson" />
        </n-flex>
      </ToolSection>

      <n-alert v-if="pemError" type="error" :title="t('conversionErrorTitle')">
        {{ pemError }}
      </n-alert>

      <n-alert v-if="pemWarnings.length" type="warning" :title="t('warningsTitle')">
        <n-space vertical :size="4">
          <div v-for="warning in pemWarnings" :key="warning">{{ warning }}</div>
        </n-space>
      </n-alert>

      <ToolSectionHeader v-if="pemOutput">{{ t('outputTitle') }}</ToolSectionHeader>
      <ToolSection v-if="pemOutput">
        <n-input
          class="monospace-field"
          :value="pemOutput"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 14 }"
          readonly
        />
      </ToolSection>
      <ToolSection v-if="pemOutput">
        <n-flex justify="space-between" align="center">
          <CopyToClipboardButton :content="pemOutput" />
          <n-button tag="a" text :href="pemDownloadUrl ?? undefined" :download="pemDownloadName">
            <template #icon>
              <n-icon :component="ArrowDownload16Regular" />
            </template>
            {{ t('downloadButton') }}
          </n-button>
        </n-flex>
      </ToolSection>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebounce, computedAsync, useObjectUrl, useStorage } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NFlex,
  NFormItem,
  NIcon,
  NInput,
  NRadioButton,
  NRadioGroup,
  NSelect,
  NSpace,
  NSwitch,
  NTabPane,
  NTabs,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton, TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import {
  JwkPemError,
  type PemOutputType,
  parseJwkJson,
  jwkToPem,
  pemToJwk,
  type WarningEntry,
} from '../utils/jwkPem'

const { t } = useI18n()

type JwkWithKid = JsonWebKey & { kid?: string }

const defaultJwkInput = `{
  "crv": "Ed25519",
  "d": "IPR8baukbPNU-nM57_prOTFvP9b9QTXY6JYLO1mbWR4",
  "x": "cc2GnZtI8l9tvVNwDyRRebvDto9_DLG9_Zvm4XODEKE",
  "kty": "OKP"
}`

const defaultPemInput = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEICD0fG2rpGzzVPpzOe/6azkxbz/W/UE12OiWCztZm1ke
-----END PRIVATE KEY-----`

const jwkAccept = '.json,.jwk,.txt'
const pemAccept = '.pem,.key,.pub,.txt'

const activeTab = useStorage('tools:jwk-pem-converter:tab', 'jwk')
const storedJwkInput = useStorage('tools:jwk-pem-converter:jwk-input', defaultJwkInput)
const storedPemInput = useStorage('tools:jwk-pem-converter:pem-input', defaultPemInput)
const jwkInput = ref<string | File>(storedJwkInput.value)
const pemInput = ref<string | File>(storedPemInput.value)

watch(jwkInput, (value) => {
  if (typeof value === 'string') {
    storedJwkInput.value = value
  }
})

watch(pemInput, (value) => {
  if (typeof value === 'string') {
    storedPemInput.value = value
  }
})

const jwkOutputType = useStorage<PemOutputType>('tools:jwk-pem-converter:output-type', 'private')
const prettyJson = useStorage('tools:jwk-pem-converter:pretty-json', true)
const selectedJwkIndex = ref(0)

const debouncedJwkInput = useDebounce(jwkInput, 150)
const debouncedPemInput = useDebounce(pemInput, 150)

const jwkParseState = computedAsync(
  async () => {
    const text = await readInputText(debouncedJwkInput.value)
    if (!text.trim()) {
      return { state: 'empty', keys: [] as JsonWebKey[], error: '' } as const
    }
    try {
      const keys = parseJwkJson(text)
      return { state: 'parsed', keys, error: '' } as const
    } catch (error) {
      return { state: 'error', keys: [] as JsonWebKey[], error: formatError(error) } as const
    }
  },
  { state: 'empty', keys: [] as JsonWebKey[], error: '' } as const,
)

const jwkKeys = computed(() =>
  jwkParseState.value.state === 'parsed' ? jwkParseState.value.keys : [],
)

watch(jwkKeys, (keys) => {
  if (selectedJwkIndex.value >= keys.length) {
    selectedJwkIndex.value = 0
  }
})

const jwkKeyOptions = computed(() =>
  jwkKeys.value.map((key, index) => ({
    label: formatKeyLabel(key, index),
    value: index,
  })),
)

const jwkConversionState = computedAsync(
  async () => {
    if (jwkParseState.value.state !== 'parsed') {
      return { state: 'empty', pem: '', error: '' } as const
    }
    const key = jwkKeys.value[selectedJwkIndex.value] ?? jwkKeys.value[0]
    if (!key) {
      return { state: 'empty', pem: '', error: '' } as const
    }
    try {
      const pem = await jwkToPem(key, jwkOutputType.value)
      return { state: 'ready', pem, error: '' } as const
    } catch (error) {
      return { state: 'error', pem: '', error: formatError(error) } as const
    }
  },
  { state: 'empty', pem: '', error: '' } as const,
)

const jwkError = computed(() => {
  if (jwkParseState.value.state === 'error') return jwkParseState.value.error
  if (jwkConversionState.value.state === 'error') return jwkConversionState.value.error
  return ''
})

const jwkOutput = computed(() =>
  jwkConversionState.value.state === 'ready' ? jwkConversionState.value.pem : '',
)

const jwkDownloadBlob = computed(() =>
  jwkOutput.value ? new Blob([jwkOutput.value], { type: 'application/x-pem-file' }) : null,
)
const jwkDownloadUrl = useObjectUrl(jwkDownloadBlob)
const jwkDownloadName = computed(() =>
  jwkOutputType.value === 'public' ? 'public-key.pem' : 'private-key.pem',
)

const pemConversionState = computedAsync(
  async () => {
    const text = await readInputText(debouncedPemInput.value)
    if (!text.trim()) {
      return { state: 'empty', output: '', warnings: [], error: '' } as const
    }
    try {
      const result = await pemToJwk(text)
      const output = JSON.stringify(result.jwk, null, prettyJson.value ? 2 : undefined)
      return { state: 'ready', output, warnings: result.warnings, error: '' } as const
    } catch (error) {
      return { state: 'error', output: '', warnings: [], error: formatError(error) } as const
    }
  },
  { state: 'empty', output: '', warnings: [], error: '' } as const,
)

const pemOutput = computed(() =>
  pemConversionState.value.state === 'ready' ? pemConversionState.value.output : '',
)

const pemWarnings = computed(() =>
  pemConversionState.value.state === 'ready'
    ? pemConversionState.value.warnings.map((warning) => formatWarning(warning))
    : [],
)

const pemDownloadBlob = computed(() =>
  pemOutput.value ? new Blob([pemOutput.value], { type: 'application/json' }) : null,
)
const pemDownloadUrl = useObjectUrl(pemDownloadBlob)
const pemDownloadName = computed(() => 'key.jwk.json')

const jwkInputStatus = computed(() => {
  if (jwkParseState.value.state === 'error' || jwkConversionState.value.state === 'error') {
    return 'error'
  }
  if (jwkParseState.value.state === 'parsed' && jwkOutput.value) return 'success'
  return undefined
})

const pemInputStatus = computed(() => {
  if (pemConversionState.value.state === 'error') return 'error'
  if (pemConversionState.value.state === 'ready' && pemOutput.value) return 'success'
  return undefined
})

const pemError = computed(() =>
  pemConversionState.value.state === 'error' ? pemConversionState.value.error : '',
)

function formatWarning(warning: WarningEntry): string {
  // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
  return t(warning.key, warning.params ?? {})
}

async function readInputText(value: string | File): Promise<string> {
  if (typeof value === 'string') {
    return value
  }
  return await value.text()
}

function formatKeyLabel(key: JwkWithKid, index: number): string {
  const type = key.kty ? key.kty : t('unknownKey')
  const detail = key.crv ? ` ${key.crv}` : ''
  const kid = key.kid ? ` (${key.kid})` : ` #${index + 1}`
  return `${type}${detail}${kid}`
}

function formatError(error: unknown): string {
  if (error instanceof JwkPemError) {
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
.monospace-field :deep(textarea) {
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
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK Input",
    "jwkInputPlaceholder": "Paste a JWK or JWK Set JSON...",
    "jwkInputHint": "Supports RSA, EC, and OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "PEM Input",
    "pemInputPlaceholder": "Paste PEM content or drop a file...",
    "pemInputHint": "Supported: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Output",
    "outputTypeLabel": "PEM Output Type",
    "outputTypePublic": "Public Key (SPKI)",
    "outputTypePrivate": "Private Key (PKCS8)",
    "keySelectLabel": "Select Key",
    "keySelectHint": "Multiple keys detected. Choose which one to convert.",
    "prettyJson": "Pretty JSON",
    "conversionErrorTitle": "Conversion Error",
    "warningsTitle": "Warnings",
    "downloadButton": "Download",
    "unknownKey": "Key",
    "errorInvalidJson": "Invalid JSON input.",
    "errorInvalidJwk": "Invalid JWK input.",
    "errorMissingField": "Missing required field: {field}.",
    "errorUnsupportedKty": "Unsupported key type: {kty}.",
    "errorUnsupportedCurve": "Unsupported curve: {crv}.",
    "errorMissingPrivateKey": "Private key data is missing.",
    "errorMissingPublicKey": "Public key data is missing.",
    "errorInvalidPem": "No valid PEM blocks found.",
    "errorUnsupportedPemLabel": "Unsupported PEM block.",
    "errorUnsupportedAlgorithm": "Unsupported algorithm: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto is not available in this environment.",
    "errorWebCryptoFailed": "WebCrypto import/export failed.",
    "errorOkpPublicKeyMissing": "OKP private key is missing a public key and cannot be derived."
  },
  "zh": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK 输入",
    "jwkInputPlaceholder": "粘贴 JWK 或 JWK Set JSON...",
    "jwkInputHint": "支持 RSA、EC 与 OKP（Ed25519/X25519/Ed448/X448）。",
    "pemInputTitle": "PEM 输入",
    "pemInputPlaceholder": "粘贴 PEM 内容或拖入文件...",
    "pemInputHint": "支持：PUBLIC KEY、PRIVATE KEY、RSA PUBLIC KEY、RSA PRIVATE KEY、EC PRIVATE KEY。",
    "outputTitle": "输出",
    "outputTypeLabel": "PEM 输出类型",
    "outputTypePublic": "公钥 (SPKI)",
    "outputTypePrivate": "私钥 (PKCS8)",
    "keySelectLabel": "选择密钥",
    "keySelectHint": "检测到多个密钥，请选择需要转换的条目。",
    "prettyJson": "美化 JSON",
    "conversionErrorTitle": "转换错误",
    "warningsTitle": "警告",
    "downloadButton": "下载",
    "unknownKey": "密钥",
    "errorInvalidJson": "无效的 JSON 输入。",
    "errorInvalidJwk": "无效的 JWK 输入。",
    "errorMissingField": "缺少必要字段：{field}。",
    "errorUnsupportedKty": "不支持的密钥类型：{kty}。",
    "errorUnsupportedCurve": "不支持的曲线：{crv}。",
    "errorMissingPrivateKey": "缺少私钥数据。",
    "errorMissingPublicKey": "缺少公钥数据。",
    "errorInvalidPem": "未找到有效的 PEM 块。",
    "errorUnsupportedPemLabel": "不支持的 PEM 块。",
    "errorUnsupportedAlgorithm": "不支持的算法：{algorithm}。",
    "errorWebCryptoUnavailable": "当前环境不支持 WebCrypto。",
    "errorWebCryptoFailed": "WebCrypto 导入/导出失败。",
    "errorOkpPublicKeyMissing": "OKP 私钥缺少公钥且无法推导。"
  },
  "zh-CN": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK 输入",
    "jwkInputPlaceholder": "粘贴 JWK 或 JWK Set JSON...",
    "jwkInputHint": "支持 RSA、EC 与 OKP（Ed25519/X25519/Ed448/X448）。",
    "pemInputTitle": "PEM 输入",
    "pemInputPlaceholder": "粘贴 PEM 内容或拖入文件...",
    "pemInputHint": "支持：PUBLIC KEY、PRIVATE KEY、RSA PUBLIC KEY、RSA PRIVATE KEY、EC PRIVATE KEY。",
    "outputTitle": "输出",
    "outputTypeLabel": "PEM 输出类型",
    "outputTypePublic": "公钥 (SPKI)",
    "outputTypePrivate": "私钥 (PKCS8)",
    "keySelectLabel": "选择密钥",
    "keySelectHint": "检测到多个密钥，请选择需要转换的条目。",
    "prettyJson": "美化 JSON",
    "conversionErrorTitle": "转换错误",
    "warningsTitle": "警告",
    "downloadButton": "下载",
    "unknownKey": "密钥",
    "errorInvalidJson": "无效的 JSON 输入。",
    "errorInvalidJwk": "无效的 JWK 输入。",
    "errorMissingField": "缺少必要字段：{field}。",
    "errorUnsupportedKty": "不支持的密钥类型：{kty}。",
    "errorUnsupportedCurve": "不支持的曲线：{crv}。",
    "errorMissingPrivateKey": "缺少私钥数据。",
    "errorMissingPublicKey": "缺少公钥数据。",
    "errorInvalidPem": "未找到有效的 PEM 块。",
    "errorUnsupportedPemLabel": "不支持的 PEM 块。",
    "errorUnsupportedAlgorithm": "不支持的算法：{algorithm}。",
    "errorWebCryptoUnavailable": "当前环境不支持 WebCrypto。",
    "errorWebCryptoFailed": "WebCrypto 导入/导出失败。",
    "errorOkpPublicKeyMissing": "OKP 私钥缺少公钥且无法推导。"
  },
  "zh-TW": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK 輸入",
    "jwkInputPlaceholder": "貼上 JWK 或 JWK Set JSON...",
    "jwkInputHint": "支援 RSA、EC 與 OKP（Ed25519/X25519/Ed448/X448）。",
    "pemInputTitle": "PEM 輸入",
    "pemInputPlaceholder": "貼上 PEM 內容或拖曳檔案...",
    "pemInputHint": "支援：PUBLIC KEY、PRIVATE KEY、RSA PUBLIC KEY、RSA PRIVATE KEY、EC PRIVATE KEY。",
    "outputTitle": "輸出",
    "outputTypeLabel": "PEM 輸出類型",
    "outputTypePublic": "公鑰 (SPKI)",
    "outputTypePrivate": "私鑰 (PKCS8)",
    "keySelectLabel": "選擇金鑰",
    "keySelectHint": "偵測到多個金鑰，請選擇要轉換的項目。",
    "prettyJson": "美化 JSON",
    "conversionErrorTitle": "轉換錯誤",
    "warningsTitle": "警告",
    "downloadButton": "下載",
    "unknownKey": "金鑰",
    "errorInvalidJson": "無效的 JSON 輸入。",
    "errorInvalidJwk": "無效的 JWK 輸入。",
    "errorMissingField": "缺少必要欄位：{field}。",
    "errorUnsupportedKty": "不支援的金鑰類型：{kty}。",
    "errorUnsupportedCurve": "不支援的曲線：{crv}。",
    "errorMissingPrivateKey": "缺少私鑰資料。",
    "errorMissingPublicKey": "缺少公鑰資料。",
    "errorInvalidPem": "未找到有效的 PEM 區塊。",
    "errorUnsupportedPemLabel": "不支援的 PEM 區塊。",
    "errorUnsupportedAlgorithm": "不支援的演算法：{algorithm}。",
    "errorWebCryptoUnavailable": "目前環境不支援 WebCrypto。",
    "errorWebCryptoFailed": "WebCrypto 匯入/匯出失敗。",
    "errorOkpPublicKeyMissing": "OKP 私鑰缺少公鑰且無法推導。"
  },
  "zh-HK": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK 輸入",
    "jwkInputPlaceholder": "貼上 JWK 或 JWK Set JSON...",
    "jwkInputHint": "支援 RSA、EC 與 OKP（Ed25519/X25519/Ed448/X448）。",
    "pemInputTitle": "PEM 輸入",
    "pemInputPlaceholder": "貼上 PEM 內容或拖曳檔案...",
    "pemInputHint": "支援：PUBLIC KEY、PRIVATE KEY、RSA PUBLIC KEY、RSA PRIVATE KEY、EC PRIVATE KEY。",
    "outputTitle": "輸出",
    "outputTypeLabel": "PEM 輸出類型",
    "outputTypePublic": "公鑰 (SPKI)",
    "outputTypePrivate": "私鑰 (PKCS8)",
    "keySelectLabel": "選擇金鑰",
    "keySelectHint": "偵測到多個金鑰，請選擇要轉換的項目。",
    "prettyJson": "美化 JSON",
    "conversionErrorTitle": "轉換錯誤",
    "warningsTitle": "警告",
    "downloadButton": "下載",
    "unknownKey": "金鑰",
    "errorInvalidJson": "無效的 JSON 輸入。",
    "errorInvalidJwk": "無效的 JWK 輸入。",
    "errorMissingField": "缺少必要欄位：{field}。",
    "errorUnsupportedKty": "不支援的金鑰類型：{kty}。",
    "errorUnsupportedCurve": "不支援的曲線：{crv}。",
    "errorMissingPrivateKey": "缺少私鑰資料。",
    "errorMissingPublicKey": "缺少公鑰資料。",
    "errorInvalidPem": "未找到有效的 PEM 區塊。",
    "errorUnsupportedPemLabel": "不支援的 PEM 區塊。",
    "errorUnsupportedAlgorithm": "不支援的演算法：{algorithm}。",
    "errorWebCryptoUnavailable": "目前環境不支援 WebCrypto。",
    "errorWebCryptoFailed": "WebCrypto 匯入/匯出失敗。",
    "errorOkpPublicKeyMissing": "OKP 私鑰缺少公鑰且無法推導。"
  },
  "es": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "Entrada JWK",
    "jwkInputPlaceholder": "Pega un JSON JWK o JWK Set...",
    "jwkInputHint": "Admite RSA, EC y OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "Entrada PEM",
    "pemInputPlaceholder": "Pega el contenido PEM o suelta un archivo...",
    "pemInputHint": "Compatible: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Salida",
    "outputTypeLabel": "Tipo de salida PEM",
    "outputTypePublic": "Clave pública (SPKI)",
    "outputTypePrivate": "Clave privada (PKCS8)",
    "keySelectLabel": "Seleccionar clave",
    "keySelectHint": "Se detectaron varias claves. Elige cuál convertir.",
    "prettyJson": "JSON formateado",
    "conversionErrorTitle": "Error de conversión",
    "warningsTitle": "Advertencias",
    "downloadButton": "Descargar",
    "unknownKey": "Clave",
    "errorInvalidJson": "Entrada JSON no válida.",
    "errorInvalidJwk": "Entrada JWK no válida.",
    "errorMissingField": "Falta el campo requerido: {field}.",
    "errorUnsupportedKty": "Tipo de clave no compatible: {kty}.",
    "errorUnsupportedCurve": "Curva no compatible: {crv}.",
    "errorMissingPrivateKey": "Faltan datos de clave privada.",
    "errorMissingPublicKey": "Faltan datos de clave pública.",
    "errorInvalidPem": "No se encontraron bloques PEM válidos.",
    "errorUnsupportedPemLabel": "Bloque PEM no compatible.",
    "errorUnsupportedAlgorithm": "Algoritmo no compatible: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto no está disponible en este entorno.",
    "errorWebCryptoFailed": "Error al importar/exportar con WebCrypto.",
    "errorOkpPublicKeyMissing": "La clave privada OKP no tiene clave pública y no puede derivarse."
  },
  "fr": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "Entrée JWK",
    "jwkInputPlaceholder": "Collez un JSON JWK ou JWK Set...",
    "jwkInputHint": "Prend en charge RSA, EC et OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "Entrée PEM",
    "pemInputPlaceholder": "Collez le contenu PEM ou déposez un fichier...",
    "pemInputHint": "Pris en charge : PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Sortie",
    "outputTypeLabel": "Type de sortie PEM",
    "outputTypePublic": "Clé publique (SPKI)",
    "outputTypePrivate": "Clé privée (PKCS8)",
    "keySelectLabel": "Sélectionner la clé",
    "keySelectHint": "Plusieurs clés détectées. Choisissez celle à convertir.",
    "prettyJson": "JSON formaté",
    "conversionErrorTitle": "Erreur de conversion",
    "warningsTitle": "Avertissements",
    "downloadButton": "Télécharger",
    "unknownKey": "Clé",
    "errorInvalidJson": "Entrée JSON invalide.",
    "errorInvalidJwk": "Entrée JWK invalide.",
    "errorMissingField": "Champ requis manquant : {field}.",
    "errorUnsupportedKty": "Type de clé non pris en charge : {kty}.",
    "errorUnsupportedCurve": "Courbe non prise en charge : {crv}.",
    "errorMissingPrivateKey": "Données de clé privée manquantes.",
    "errorMissingPublicKey": "Données de clé publique manquantes.",
    "errorInvalidPem": "Aucun bloc PEM valide trouvé.",
    "errorUnsupportedPemLabel": "Bloc PEM non pris en charge.",
    "errorUnsupportedAlgorithm": "Algorithme non pris en charge : {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto n'est pas disponible dans cet environnement.",
    "errorWebCryptoFailed": "Échec de l'import/export WebCrypto.",
    "errorOkpPublicKeyMissing": "La clé privée OKP n'a pas de clé publique et ne peut pas être dérivée."
  },
  "de": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK-Eingabe",
    "jwkInputPlaceholder": "JWK- oder JWK-Set-JSON einfügen...",
    "jwkInputHint": "Unterstützt RSA, EC und OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "PEM-Eingabe",
    "pemInputPlaceholder": "PEM-Inhalt einfügen oder Datei ablegen...",
    "pemInputHint": "Unterstützt: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Ausgabe",
    "outputTypeLabel": "PEM-Ausgabetyp",
    "outputTypePublic": "Öffentlicher Schlüssel (SPKI)",
    "outputTypePrivate": "Privater Schlüssel (PKCS8)",
    "keySelectLabel": "Schlüssel auswählen",
    "keySelectHint": "Mehrere Schlüssel erkannt. Wähle den zu konvertierenden aus.",
    "prettyJson": "JSON formatiert",
    "conversionErrorTitle": "Konvertierungsfehler",
    "warningsTitle": "Warnungen",
    "downloadButton": "Herunterladen",
    "unknownKey": "Schlüssel",
    "errorInvalidJson": "Ungültige JSON-Eingabe.",
    "errorInvalidJwk": "Ungültige JWK-Eingabe.",
    "errorMissingField": "Erforderliches Feld fehlt: {field}.",
    "errorUnsupportedKty": "Nicht unterstützter Schlüsseltyp: {kty}.",
    "errorUnsupportedCurve": "Nicht unterstützte Kurve: {crv}.",
    "errorMissingPrivateKey": "Private Schlüsseldaten fehlen.",
    "errorMissingPublicKey": "Öffentliche Schlüsseldaten fehlen.",
    "errorInvalidPem": "Keine gültigen PEM-Blöcke gefunden.",
    "errorUnsupportedPemLabel": "Nicht unterstützter PEM-Block.",
    "errorUnsupportedAlgorithm": "Nicht unterstützter Algorithmus: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto ist in dieser Umgebung nicht verfügbar.",
    "errorWebCryptoFailed": "WebCrypto-Import/Export fehlgeschlagen.",
    "errorOkpPublicKeyMissing": "OKP-Privatschlüssel hat keinen öffentlichen Schlüssel und kann nicht abgeleitet werden."
  },
  "it": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "Input JWK",
    "jwkInputPlaceholder": "Incolla un JSON JWK o JWK Set...",
    "jwkInputHint": "Supporta RSA, EC e OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "Input PEM",
    "pemInputPlaceholder": "Incolla il contenuto PEM o trascina un file...",
    "pemInputHint": "Supportati: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Output",
    "outputTypeLabel": "Tipo di output PEM",
    "outputTypePublic": "Chiave pubblica (SPKI)",
    "outputTypePrivate": "Chiave privata (PKCS8)",
    "keySelectLabel": "Seleziona chiave",
    "keySelectHint": "Sono state rilevate più chiavi. Scegli quale convertire.",
    "prettyJson": "JSON formattato",
    "conversionErrorTitle": "Errore di conversione",
    "warningsTitle": "Avvisi",
    "downloadButton": "Scarica",
    "unknownKey": "Chiave",
    "errorInvalidJson": "Input JSON non valido.",
    "errorInvalidJwk": "Input JWK non valido.",
    "errorMissingField": "Campo obbligatorio mancante: {field}.",
    "errorUnsupportedKty": "Tipo di chiave non supportato: {kty}.",
    "errorUnsupportedCurve": "Curva non supportata: {crv}.",
    "errorMissingPrivateKey": "Dati della chiave privata mancanti.",
    "errorMissingPublicKey": "Dati della chiave pubblica mancanti.",
    "errorInvalidPem": "Nessun blocco PEM valido trovato.",
    "errorUnsupportedPemLabel": "Blocco PEM non supportato.",
    "errorUnsupportedAlgorithm": "Algoritmo non supportato: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto non disponibile in questo ambiente.",
    "errorWebCryptoFailed": "Importazione/esportazione WebCrypto non riuscita.",
    "errorOkpPublicKeyMissing": "La chiave privata OKP non ha una chiave pubblica e non può essere derivata."
  },
  "ja": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK 入力",
    "jwkInputPlaceholder": "JWK または JWK Set の JSON を貼り付け...",
    "jwkInputHint": "RSA、EC、OKP（Ed25519/X25519/Ed448/X448）に対応。",
    "pemInputTitle": "PEM 入力",
    "pemInputPlaceholder": "PEM を貼り付けるかファイルをドロップ...",
    "pemInputHint": "対応形式: PUBLIC KEY、PRIVATE KEY、RSA PUBLIC KEY、RSA PRIVATE KEY、EC PRIVATE KEY。",
    "outputTitle": "出力",
    "outputTypeLabel": "PEM 出力タイプ",
    "outputTypePublic": "公開鍵 (SPKI)",
    "outputTypePrivate": "秘密鍵 (PKCS8)",
    "keySelectLabel": "キーを選択",
    "keySelectHint": "複数のキーを検出しました。変換するものを選択してください。",
    "prettyJson": "整形 JSON",
    "conversionErrorTitle": "変換エラー",
    "warningsTitle": "警告",
    "downloadButton": "ダウンロード",
    "unknownKey": "キー",
    "errorInvalidJson": "無効な JSON 入力です。",
    "errorInvalidJwk": "無効な JWK 入力です。",
    "errorMissingField": "必須フィールドがありません: {field}。",
    "errorUnsupportedKty": "未対応のキータイプ: {kty}。",
    "errorUnsupportedCurve": "未対応の曲線: {crv}。",
    "errorMissingPrivateKey": "秘密鍵データがありません。",
    "errorMissingPublicKey": "公開鍵データがありません。",
    "errorInvalidPem": "有効な PEM ブロックが見つかりません。",
    "errorUnsupportedPemLabel": "未対応の PEM ブロックです。",
    "errorUnsupportedAlgorithm": "未対応のアルゴリズム: {algorithm}。",
    "errorWebCryptoUnavailable": "この環境では WebCrypto が利用できません。",
    "errorWebCryptoFailed": "WebCrypto のインポート/エクスポートに失敗しました。",
    "errorOkpPublicKeyMissing": "OKP の秘密鍵に公開鍵がなく、導出できません。"
  },
  "ko": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK 입력",
    "jwkInputPlaceholder": "JWK 또는 JWK Set JSON을 붙여넣기...",
    "jwkInputHint": "RSA, EC, OKP(Ed25519/X25519/Ed448/X448) 지원.",
    "pemInputTitle": "PEM 입력",
    "pemInputPlaceholder": "PEM 내용을 붙여넣거나 파일을 드롭...",
    "pemInputHint": "지원: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "출력",
    "outputTypeLabel": "PEM 출력 유형",
    "outputTypePublic": "공개 키 (SPKI)",
    "outputTypePrivate": "개인 키 (PKCS8)",
    "keySelectLabel": "키 선택",
    "keySelectHint": "여러 키가 감지되었습니다. 변환할 키를 선택하세요.",
    "prettyJson": "예쁜 JSON",
    "conversionErrorTitle": "변환 오류",
    "warningsTitle": "경고",
    "downloadButton": "다운로드",
    "unknownKey": "키",
    "errorInvalidJson": "잘못된 JSON 입력입니다.",
    "errorInvalidJwk": "잘못된 JWK 입력입니다.",
    "errorMissingField": "필수 필드 누락: {field}.",
    "errorUnsupportedKty": "지원하지 않는 키 유형: {kty}.",
    "errorUnsupportedCurve": "지원하지 않는 곡선: {crv}.",
    "errorMissingPrivateKey": "개인 키 데이터가 없습니다.",
    "errorMissingPublicKey": "공개 키 데이터가 없습니다.",
    "errorInvalidPem": "유효한 PEM 블록을 찾을 수 없습니다.",
    "errorUnsupportedPemLabel": "지원하지 않는 PEM 블록입니다.",
    "errorUnsupportedAlgorithm": "지원하지 않는 알고리즘: {algorithm}.",
    "errorWebCryptoUnavailable": "이 환경에서 WebCrypto를 사용할 수 없습니다.",
    "errorWebCryptoFailed": "WebCrypto 가져오기/내보내기에 실패했습니다.",
    "errorOkpPublicKeyMissing": "OKP 개인 키에 공개 키가 없어 파생할 수 없습니다."
  },
  "ru": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "Ввод JWK",
    "jwkInputPlaceholder": "Вставьте JSON JWK или JWK Set...",
    "jwkInputHint": "Поддерживает RSA, EC и OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "Ввод PEM",
    "pemInputPlaceholder": "Вставьте PEM или перетащите файл...",
    "pemInputHint": "Поддерживается: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Вывод",
    "outputTypeLabel": "Тип вывода PEM",
    "outputTypePublic": "Публичный ключ (SPKI)",
    "outputTypePrivate": "Приватный ключ (PKCS8)",
    "keySelectLabel": "Выбор ключа",
    "keySelectHint": "Найдено несколько ключей. Выберите нужный.",
    "prettyJson": "Форматированный JSON",
    "conversionErrorTitle": "Ошибка преобразования",
    "warningsTitle": "Предупреждения",
    "downloadButton": "Скачать",
    "unknownKey": "Ключ",
    "errorInvalidJson": "Неверный ввод JSON.",
    "errorInvalidJwk": "Неверный ввод JWK.",
    "errorMissingField": "Отсутствует обязательное поле: {field}.",
    "errorUnsupportedKty": "Неподдерживаемый тип ключа: {kty}.",
    "errorUnsupportedCurve": "Неподдерживаемая кривая: {crv}.",
    "errorMissingPrivateKey": "Отсутствуют данные приватного ключа.",
    "errorMissingPublicKey": "Отсутствуют данные публичного ключа.",
    "errorInvalidPem": "Допустимые PEM-блоки не найдены.",
    "errorUnsupportedPemLabel": "Неподдерживаемый PEM-блок.",
    "errorUnsupportedAlgorithm": "Неподдерживаемый алгоритм: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto недоступен в этой среде.",
    "errorWebCryptoFailed": "Не удалось импортировать/экспортировать через WebCrypto.",
    "errorOkpPublicKeyMissing": "Приватный ключ OKP не содержит публичный ключ и не может быть выведен."
  },
  "pt": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "Entrada JWK",
    "jwkInputPlaceholder": "Cole um JSON JWK ou JWK Set...",
    "jwkInputHint": "Suporta RSA, EC e OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "Entrada PEM",
    "pemInputPlaceholder": "Cole o conteúdo PEM ou solte um arquivo...",
    "pemInputHint": "Compatível: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Saída",
    "outputTypeLabel": "Tipo de saída PEM",
    "outputTypePublic": "Chave pública (SPKI)",
    "outputTypePrivate": "Chave privada (PKCS8)",
    "keySelectLabel": "Selecionar chave",
    "keySelectHint": "Várias chaves detectadas. Escolha qual converter.",
    "prettyJson": "JSON formatado",
    "conversionErrorTitle": "Erro de conversão",
    "warningsTitle": "Avisos",
    "downloadButton": "Baixar",
    "unknownKey": "Chave",
    "errorInvalidJson": "Entrada JSON inválida.",
    "errorInvalidJwk": "Entrada JWK inválida.",
    "errorMissingField": "Campo obrigatório ausente: {field}.",
    "errorUnsupportedKty": "Tipo de chave não suportado: {kty}.",
    "errorUnsupportedCurve": "Curva não suportada: {crv}.",
    "errorMissingPrivateKey": "Dados de chave privada ausentes.",
    "errorMissingPublicKey": "Dados de chave pública ausentes.",
    "errorInvalidPem": "Nenhum bloco PEM válido encontrado.",
    "errorUnsupportedPemLabel": "Bloco PEM não suportado.",
    "errorUnsupportedAlgorithm": "Algoritmo não suportado: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto não está disponível neste ambiente.",
    "errorWebCryptoFailed": "Falha ao importar/exportar com WebCrypto.",
    "errorOkpPublicKeyMissing": "A chave privada OKP não possui chave pública e não pode ser derivada."
  },
  "ar": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "إدخال JWK",
    "jwkInputPlaceholder": "الصق JSON لـ JWK أو JWK Set...",
    "jwkInputHint": "يدعم RSA وEC وOKP ‏(Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "إدخال PEM",
    "pemInputPlaceholder": "الصق محتوى PEM أو اسحب ملفًا...",
    "pemInputHint": "المدعوم: PUBLIC KEY وPRIVATE KEY وRSA PUBLIC KEY وRSA PRIVATE KEY وEC PRIVATE KEY.",
    "outputTitle": "الإخراج",
    "outputTypeLabel": "نوع إخراج PEM",
    "outputTypePublic": "مفتاح عام (SPKI)",
    "outputTypePrivate": "مفتاح خاص (PKCS8)",
    "keySelectLabel": "اختر المفتاح",
    "keySelectHint": "تم اكتشاف عدة مفاتيح. اختر ما تريد تحويله.",
    "prettyJson": "JSON منسق",
    "conversionErrorTitle": "خطأ في التحويل",
    "warningsTitle": "تحذيرات",
    "downloadButton": "تنزيل",
    "unknownKey": "مفتاح",
    "errorInvalidJson": "إدخال JSON غير صالح.",
    "errorInvalidJwk": "إدخال JWK غير صالح.",
    "errorMissingField": "الحقل المطلوب مفقود: {field}.",
    "errorUnsupportedKty": "نوع المفتاح غير مدعوم: {kty}.",
    "errorUnsupportedCurve": "منحنى غير مدعوم: {crv}.",
    "errorMissingPrivateKey": "بيانات المفتاح الخاص مفقودة.",
    "errorMissingPublicKey": "بيانات المفتاح العام مفقودة.",
    "errorInvalidPem": "لم يتم العثور على كتل PEM صالحة.",
    "errorUnsupportedPemLabel": "كتلة PEM غير مدعومة.",
    "errorUnsupportedAlgorithm": "خوارزمية غير مدعومة: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto غير متوفر في هذه البيئة.",
    "errorWebCryptoFailed": "فشل استيراد/تصدير WebCrypto.",
    "errorOkpPublicKeyMissing": "المفتاح الخاص OKP يفتقد مفتاحًا عامًا ولا يمكن اشتقاقه."
  },
  "hi": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK इनपुट",
    "jwkInputPlaceholder": "JWK या JWK Set JSON पेस्ट करें...",
    "jwkInputHint": "RSA, EC और OKP (Ed25519/X25519/Ed448/X448) समर्थित।",
    "pemInputTitle": "PEM इनपुट",
    "pemInputPlaceholder": "PEM सामग्री पेस्ट करें या फ़ाइल ड्रॉप करें...",
    "pemInputHint": "समर्थित: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "आउटपुट",
    "outputTypeLabel": "PEM आउटपुट प्रकार",
    "outputTypePublic": "पब्लिक की (SPKI)",
    "outputTypePrivate": "प्राइवेट की (PKCS8)",
    "keySelectLabel": "की चुनें",
    "keySelectHint": "कई कुंजियां मिलीं। जिसे कन्वर्ट करना है उसे चुनें।",
    "prettyJson": "सजाया हुआ JSON",
    "conversionErrorTitle": "कन्वर्ज़न त्रुटि",
    "warningsTitle": "चेतावनियां",
    "downloadButton": "डाउनलोड",
    "unknownKey": "कुंजी",
    "errorInvalidJson": "अमान्य JSON इनपुट।",
    "errorInvalidJwk": "अमान्य JWK इनपुट।",
    "errorMissingField": "आवश्यक फ़ील्ड गायब है: {field}।",
    "errorUnsupportedKty": "समर्थित नहीं कुंजी प्रकार: {kty}।",
    "errorUnsupportedCurve": "समर्थित नहीं कर्व: {crv}।",
    "errorMissingPrivateKey": "प्राइवेट की डेटा नहीं मिला।",
    "errorMissingPublicKey": "पब्लिक की डेटा नहीं मिला।",
    "errorInvalidPem": "कोई मान्य PEM ब्लॉक नहीं मिला।",
    "errorUnsupportedPemLabel": "असमर्थित PEM ब्लॉक।",
    "errorUnsupportedAlgorithm": "असमर्थित एल्गोरिथ्म: {algorithm}।",
    "errorWebCryptoUnavailable": "इस वातावरण में WebCrypto उपलब्ध नहीं है।",
    "errorWebCryptoFailed": "WebCrypto आयात/निर्यात असफल।",
    "errorOkpPublicKeyMissing": "OKP प्राइवेट की में पब्लिक की नहीं है और डेरिव नहीं की जा सकती।"
  },
  "tr": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK Girdi",
    "jwkInputPlaceholder": "JWK veya JWK Set JSON yapıştırın...",
    "jwkInputHint": "RSA, EC ve OKP (Ed25519/X25519/Ed448/X448) desteklenir.",
    "pemInputTitle": "PEM Girdi",
    "pemInputPlaceholder": "PEM içeriği yapıştırın veya dosya bırakın...",
    "pemInputHint": "Desteklenen: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Çıktı",
    "outputTypeLabel": "PEM Çıktı Türü",
    "outputTypePublic": "Açık Anahtar (SPKI)",
    "outputTypePrivate": "Özel Anahtar (PKCS8)",
    "keySelectLabel": "Anahtar seç",
    "keySelectHint": "Birden fazla anahtar algılandı. Dönüştürülecek olanı seçin.",
    "prettyJson": "Biçimli JSON",
    "conversionErrorTitle": "Dönüştürme Hatası",
    "warningsTitle": "Uyarılar",
    "downloadButton": "İndir",
    "unknownKey": "Anahtar",
    "errorInvalidJson": "Geçersiz JSON girişi.",
    "errorInvalidJwk": "Geçersiz JWK girişi.",
    "errorMissingField": "Gerekli alan eksik: {field}.",
    "errorUnsupportedKty": "Desteklenmeyen anahtar türü: {kty}.",
    "errorUnsupportedCurve": "Desteklenmeyen eğri: {crv}.",
    "errorMissingPrivateKey": "Özel anahtar verisi eksik.",
    "errorMissingPublicKey": "Açık anahtar verisi eksik.",
    "errorInvalidPem": "Geçerli PEM blokları bulunamadı.",
    "errorUnsupportedPemLabel": "Desteklenmeyen PEM bloğu.",
    "errorUnsupportedAlgorithm": "Desteklenmeyen algoritma: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto bu ortamda kullanılamıyor.",
    "errorWebCryptoFailed": "WebCrypto içe/dışa aktarma başarısız.",
    "errorOkpPublicKeyMissing": "OKP özel anahtarında açık anahtar yok ve türetilemiyor."
  },
  "nl": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK-invoer",
    "jwkInputPlaceholder": "Plak JWK- of JWK Set-JSON...",
    "jwkInputHint": "Ondersteunt RSA, EC en OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "PEM-invoer",
    "pemInputPlaceholder": "Plak PEM-inhoud of sleep een bestand...",
    "pemInputHint": "Ondersteund: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Uitvoer",
    "outputTypeLabel": "PEM-uitvoertype",
    "outputTypePublic": "Publieke sleutel (SPKI)",
    "outputTypePrivate": "Privésleutel (PKCS8)",
    "keySelectLabel": "Selecteer sleutel",
    "keySelectHint": "Meerdere sleutels gedetecteerd. Kies welke je wilt converteren.",
    "prettyJson": "Opmaak JSON",
    "conversionErrorTitle": "Conversiefout",
    "warningsTitle": "Waarschuwingen",
    "downloadButton": "Downloaden",
    "unknownKey": "Sleutel",
    "errorInvalidJson": "Ongeldige JSON-invoer.",
    "errorInvalidJwk": "Ongeldige JWK-invoer.",
    "errorMissingField": "Verplicht veld ontbreekt: {field}.",
    "errorUnsupportedKty": "Niet-ondersteund sleuteltype: {kty}.",
    "errorUnsupportedCurve": "Niet-ondersteunde curve: {crv}.",
    "errorMissingPrivateKey": "Privésleutelgegevens ontbreken.",
    "errorMissingPublicKey": "Publieke sleutelgegevens ontbreken.",
    "errorInvalidPem": "Geen geldige PEM-blokken gevonden.",
    "errorUnsupportedPemLabel": "Niet-ondersteund PEM-blok.",
    "errorUnsupportedAlgorithm": "Niet-ondersteund algoritme: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto is niet beschikbaar in deze omgeving.",
    "errorWebCryptoFailed": "WebCrypto importeren/exporteren mislukt.",
    "errorOkpPublicKeyMissing": "OKP-privésleutel mist een publieke sleutel en kan niet worden afgeleid."
  },
  "sv": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK-inmatning",
    "jwkInputPlaceholder": "Klistra in JWK- eller JWK Set-JSON...",
    "jwkInputHint": "Stöd för RSA, EC och OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "PEM-inmatning",
    "pemInputPlaceholder": "Klistra in PEM eller släpp en fil...",
    "pemInputHint": "Stöds: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Utdata",
    "outputTypeLabel": "PEM-utdatatyp",
    "outputTypePublic": "Publik nyckel (SPKI)",
    "outputTypePrivate": "Privat nyckel (PKCS8)",
    "keySelectLabel": "Välj nyckel",
    "keySelectHint": "Flera nycklar hittades. Välj vilken som ska konverteras.",
    "prettyJson": "Formaterad JSON",
    "conversionErrorTitle": "Konverteringsfel",
    "warningsTitle": "Varningar",
    "downloadButton": "Ladda ner",
    "unknownKey": "Nyckel",
    "errorInvalidJson": "Ogiltig JSON-inmatning.",
    "errorInvalidJwk": "Ogiltig JWK-inmatning.",
    "errorMissingField": "Saknar obligatoriskt fält: {field}.",
    "errorUnsupportedKty": "Nyckeltyp stöds inte: {kty}.",
    "errorUnsupportedCurve": "Kurvan stöds inte: {crv}.",
    "errorMissingPrivateKey": "Privat nyckeldata saknas.",
    "errorMissingPublicKey": "Publik nyckeldata saknas.",
    "errorInvalidPem": "Inga giltiga PEM-block hittades.",
    "errorUnsupportedPemLabel": "PEM-block stöds inte.",
    "errorUnsupportedAlgorithm": "Algoritm stöds inte: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto är inte tillgängligt i denna miljö.",
    "errorWebCryptoFailed": "WebCrypto-import/export misslyckades.",
    "errorOkpPublicKeyMissing": "OKP-privat nyckel saknar publik nyckel och kan inte härledas."
  },
  "pl": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "Wejście JWK",
    "jwkInputPlaceholder": "Wklej JSON JWK lub JWK Set...",
    "jwkInputHint": "Obsługuje RSA, EC i OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "Wejście PEM",
    "pemInputPlaceholder": "Wklej PEM lub upuść plik...",
    "pemInputHint": "Obsługiwane: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Wyjście",
    "outputTypeLabel": "Typ wyjścia PEM",
    "outputTypePublic": "Klucz publiczny (SPKI)",
    "outputTypePrivate": "Klucz prywatny (PKCS8)",
    "keySelectLabel": "Wybierz klucz",
    "keySelectHint": "Wykryto wiele kluczy. Wybierz ten do konwersji.",
    "prettyJson": "Sformatowany JSON",
    "conversionErrorTitle": "Błąd konwersji",
    "warningsTitle": "Ostrzeżenia",
    "downloadButton": "Pobierz",
    "unknownKey": "Klucz",
    "errorInvalidJson": "Nieprawidłowe wejście JSON.",
    "errorInvalidJwk": "Nieprawidłowe wejście JWK.",
    "errorMissingField": "Brak wymaganego pola: {field}.",
    "errorUnsupportedKty": "Nieobsługiwany typ klucza: {kty}.",
    "errorUnsupportedCurve": "Nieobsługiwana krzywa: {crv}.",
    "errorMissingPrivateKey": "Brak danych klucza prywatnego.",
    "errorMissingPublicKey": "Brak danych klucza publicznego.",
    "errorInvalidPem": "Nie znaleziono poprawnych bloków PEM.",
    "errorUnsupportedPemLabel": "Nieobsługiwany blok PEM.",
    "errorUnsupportedAlgorithm": "Nieobsługiwany algorytm: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto nie jest dostępne w tym środowisku.",
    "errorWebCryptoFailed": "Nieudany import/eksport WebCrypto.",
    "errorOkpPublicKeyMissing": "Klucz prywatny OKP nie ma klucza publicznego i nie można go wyprowadzić."
  },
  "vi": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "Nhập JWK",
    "jwkInputPlaceholder": "Dán JSON JWK hoặc JWK Set...",
    "jwkInputHint": "Hỗ trợ RSA, EC và OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "Nhập PEM",
    "pemInputPlaceholder": "Dán nội dung PEM hoặc thả tệp...",
    "pemInputHint": "Hỗ trợ: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Kết quả",
    "outputTypeLabel": "Loại đầu ra PEM",
    "outputTypePublic": "Khóa công khai (SPKI)",
    "outputTypePrivate": "Khóa riêng (PKCS8)",
    "keySelectLabel": "Chọn khóa",
    "keySelectHint": "Phát hiện nhiều khóa. Chọn khóa cần chuyển đổi.",
    "prettyJson": "JSON đẹp",
    "conversionErrorTitle": "Lỗi chuyển đổi",
    "warningsTitle": "Cảnh báo",
    "downloadButton": "Tải xuống",
    "unknownKey": "Khóa",
    "errorInvalidJson": "JSON đầu vào không hợp lệ.",
    "errorInvalidJwk": "JWK đầu vào không hợp lệ.",
    "errorMissingField": "Thiếu trường bắt buộc: {field}.",
    "errorUnsupportedKty": "Loại khóa không hỗ trợ: {kty}.",
    "errorUnsupportedCurve": "Đường cong không hỗ trợ: {crv}.",
    "errorMissingPrivateKey": "Thiếu dữ liệu khóa riêng.",
    "errorMissingPublicKey": "Thiếu dữ liệu khóa công khai.",
    "errorInvalidPem": "Không tìm thấy khối PEM hợp lệ.",
    "errorUnsupportedPemLabel": "Khối PEM không hỗ trợ.",
    "errorUnsupportedAlgorithm": "Thuật toán không hỗ trợ: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto không khả dụng trong môi trường này.",
    "errorWebCryptoFailed": "Nhập/xuất WebCrypto thất bại.",
    "errorOkpPublicKeyMissing": "Khóa riêng OKP thiếu khóa công khai và không thể suy ra."
  },
  "th": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "อินพุต JWK",
    "jwkInputPlaceholder": "วาง JSON ของ JWK หรือ JWK Set...",
    "jwkInputHint": "รองรับ RSA, EC และ OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "อินพุต PEM",
    "pemInputPlaceholder": "วางเนื้อหา PEM หรือวางไฟล์...",
    "pemInputHint": "รองรับ: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "ผลลัพธ์",
    "outputTypeLabel": "ชนิดเอาต์พุต PEM",
    "outputTypePublic": "กุญแจสาธารณะ (SPKI)",
    "outputTypePrivate": "กุญแจส่วนตัว (PKCS8)",
    "keySelectLabel": "เลือกกุญแจ",
    "keySelectHint": "ตรวจพบหลายกุญแจ เลือกอันที่ต้องการแปลง.",
    "prettyJson": "JSON จัดรูปแบบ",
    "conversionErrorTitle": "ข้อผิดพลาดการแปลง",
    "warningsTitle": "คำเตือน",
    "downloadButton": "ดาวน์โหลด",
    "unknownKey": "กุญแจ",
    "errorInvalidJson": "อินพุต JSON ไม่ถูกต้อง.",
    "errorInvalidJwk": "อินพุต JWK ไม่ถูกต้อง.",
    "errorMissingField": "ขาดฟิลด์ที่จำเป็น: {field}.",
    "errorUnsupportedKty": "ชนิดกุญแจที่ไม่รองรับ: {kty}.",
    "errorUnsupportedCurve": "เส้นโค้งที่ไม่รองรับ: {crv}.",
    "errorMissingPrivateKey": "ไม่มีข้อมูลกุญแจส่วนตัว.",
    "errorMissingPublicKey": "ไม่มีข้อมูลกุญแจสาธารณะ.",
    "errorInvalidPem": "ไม่พบบล็อก PEM ที่ถูกต้อง.",
    "errorUnsupportedPemLabel": "บล็อก PEM ที่ไม่รองรับ.",
    "errorUnsupportedAlgorithm": "อัลกอริทึมที่ไม่รองรับ: {algorithm}.",
    "errorWebCryptoUnavailable": "ไม่รองรับ WebCrypto ในสภาพแวดล้อมนี้.",
    "errorWebCryptoFailed": "นำเข้า/ส่งออก WebCrypto ล้มเหลว.",
    "errorOkpPublicKeyMissing": "กุญแจส่วนตัว OKP ไม่มีคีย์สาธารณะและไม่สามารถอนุมานได้."
  },
  "id": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "Input JWK",
    "jwkInputPlaceholder": "Tempel JSON JWK atau JWK Set...",
    "jwkInputHint": "Mendukung RSA, EC, dan OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "Input PEM",
    "pemInputPlaceholder": "Tempel konten PEM atau jatuhkan file...",
    "pemInputHint": "Didukung: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Output",
    "outputTypeLabel": "Tipe output PEM",
    "outputTypePublic": "Kunci publik (SPKI)",
    "outputTypePrivate": "Kunci privat (PKCS8)",
    "keySelectLabel": "Pilih kunci",
    "keySelectHint": "Beberapa kunci terdeteksi. Pilih yang akan dikonversi.",
    "prettyJson": "JSON rapi",
    "conversionErrorTitle": "Galat konversi",
    "warningsTitle": "Peringatan",
    "downloadButton": "Unduh",
    "unknownKey": "Kunci",
    "errorInvalidJson": "Input JSON tidak valid.",
    "errorInvalidJwk": "Input JWK tidak valid.",
    "errorMissingField": "Bidang wajib hilang: {field}.",
    "errorUnsupportedKty": "Jenis kunci tidak didukung: {kty}.",
    "errorUnsupportedCurve": "Kurva tidak didukung: {crv}.",
    "errorMissingPrivateKey": "Data kunci privat hilang.",
    "errorMissingPublicKey": "Data kunci publik hilang.",
    "errorInvalidPem": "Blok PEM valid tidak ditemukan.",
    "errorUnsupportedPemLabel": "Blok PEM tidak didukung.",
    "errorUnsupportedAlgorithm": "Algoritme tidak didukung: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto tidak tersedia di lingkungan ini.",
    "errorWebCryptoFailed": "Impor/ekspor WebCrypto gagal.",
    "errorOkpPublicKeyMissing": "Kunci privat OKP tidak memiliki kunci publik dan tidak dapat diturunkan."
  },
  "he": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "קלט JWK",
    "jwkInputPlaceholder": "הדבק JSON של JWK או JWK Set...",
    "jwkInputHint": "תומך ב‑RSA, EC ו‑OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "קלט PEM",
    "pemInputPlaceholder": "הדבק תוכן PEM או גרור קובץ...",
    "pemInputHint": "נתמך: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "פלט",
    "outputTypeLabel": "סוג פלט PEM",
    "outputTypePublic": "מפתח ציבורי (SPKI)",
    "outputTypePrivate": "מפתח פרטי (PKCS8)",
    "keySelectLabel": "בחר מפתח",
    "keySelectHint": "זוהו מספר מפתחות. בחר את המפתח להמרה.",
    "prettyJson": "JSON מעוצב",
    "conversionErrorTitle": "שגיאת המרה",
    "warningsTitle": "אזהרות",
    "downloadButton": "הורדה",
    "unknownKey": "מפתח",
    "errorInvalidJson": "קלט JSON לא תקין.",
    "errorInvalidJwk": "קלט JWK לא תקין.",
    "errorMissingField": "חסר שדה נדרש: {field}.",
    "errorUnsupportedKty": "סוג מפתח לא נתמך: {kty}.",
    "errorUnsupportedCurve": "עקומה לא נתמכת: {crv}.",
    "errorMissingPrivateKey": "חסרים נתוני מפתח פרטי.",
    "errorMissingPublicKey": "חסרים נתוני מפתח ציבורי.",
    "errorInvalidPem": "לא נמצאו בלוקי PEM תקינים.",
    "errorUnsupportedPemLabel": "בלוק PEM לא נתמך.",
    "errorUnsupportedAlgorithm": "אלגוריתם לא נתמך: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto אינו זמין בסביבה זו.",
    "errorWebCryptoFailed": "ייבוא/ייצוא WebCrypto נכשל.",
    "errorOkpPublicKeyMissing": "למפתח פרטי OKP חסר מפתח ציבורי ולא ניתן לגזור אותו."
  },
  "ms": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "Input JWK",
    "jwkInputPlaceholder": "Tampal JSON JWK atau JWK Set...",
    "jwkInputHint": "Menyokong RSA, EC dan OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "Input PEM",
    "pemInputPlaceholder": "Tampal kandungan PEM atau seret fail...",
    "pemInputHint": "Disokong: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Output",
    "outputTypeLabel": "Jenis output PEM",
    "outputTypePublic": "Kunci awam (SPKI)",
    "outputTypePrivate": "Kunci peribadi (PKCS8)",
    "keySelectLabel": "Pilih kunci",
    "keySelectHint": "Beberapa kunci dikesan. Pilih yang hendak ditukar.",
    "prettyJson": "JSON cantik",
    "conversionErrorTitle": "Ralat penukaran",
    "warningsTitle": "Amaran",
    "downloadButton": "Muat turun",
    "unknownKey": "Kunci",
    "errorInvalidJson": "Input JSON tidak sah.",
    "errorInvalidJwk": "Input JWK tidak sah.",
    "errorMissingField": "Medan wajib tiada: {field}.",
    "errorUnsupportedKty": "Jenis kunci tidak disokong: {kty}.",
    "errorUnsupportedCurve": "Lengkung tidak disokong: {crv}.",
    "errorMissingPrivateKey": "Data kunci peribadi tiada.",
    "errorMissingPublicKey": "Data kunci awam tiada.",
    "errorInvalidPem": "Tiada blok PEM sah ditemui.",
    "errorUnsupportedPemLabel": "Blok PEM tidak disokong.",
    "errorUnsupportedAlgorithm": "Algoritma tidak disokong: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto tidak tersedia dalam persekitaran ini.",
    "errorWebCryptoFailed": "Import/eksport WebCrypto gagal.",
    "errorOkpPublicKeyMissing": "Kunci peribadi OKP tiada kunci awam dan tidak boleh diterbitkan."
  },
  "no": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK",
    "jwkInputTitle": "JWK-inndata",
    "jwkInputPlaceholder": "Lim inn JWK- eller JWK Set-JSON...",
    "jwkInputHint": "Støtter RSA, EC og OKP (Ed25519/X25519/Ed448/X448).",
    "pemInputTitle": "PEM-inndata",
    "pemInputPlaceholder": "Lim inn PEM eller dra inn en fil...",
    "pemInputHint": "Støttet: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY.",
    "outputTitle": "Utdata",
    "outputTypeLabel": "PEM-utdatatyp",
    "outputTypePublic": "Offentlig nøkkel (SPKI)",
    "outputTypePrivate": "Privat nøkkel (PKCS8)",
    "keySelectLabel": "Velg nøkkel",
    "keySelectHint": "Flere nøkler oppdaget. Velg hvilken som skal konverteres.",
    "prettyJson": "Formatert JSON",
    "conversionErrorTitle": "Konverteringsfeil",
    "warningsTitle": "Advarsler",
    "downloadButton": "Last ned",
    "unknownKey": "Nøkkel",
    "errorInvalidJson": "Ugyldig JSON-inndata.",
    "errorInvalidJwk": "Ugyldig JWK-inndata.",
    "errorMissingField": "Mangler obligatorisk felt: {field}.",
    "errorUnsupportedKty": "Ikke støttet nøkkeltype: {kty}.",
    "errorUnsupportedCurve": "Ikke støttet kurve: {crv}.",
    "errorMissingPrivateKey": "Mangler privat nøkkeldata.",
    "errorMissingPublicKey": "Mangler offentlig nøkkeldata.",
    "errorInvalidPem": "Fant ingen gyldige PEM-blokker.",
    "errorUnsupportedPemLabel": "Ikke støttet PEM-blokk.",
    "errorUnsupportedAlgorithm": "Ikke støttet algoritme: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto er ikke tilgjengelig i dette miljøet.",
    "errorWebCryptoFailed": "WebCrypto-import/eksport mislyktes.",
    "errorOkpPublicKeyMissing": "OKP-privat nøkkel mangler offentlig nøkkel og kan ikke avledes."
  }
}
</i18n>
