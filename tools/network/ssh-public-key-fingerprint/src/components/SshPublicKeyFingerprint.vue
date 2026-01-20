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

  <n-alert v-show="parseState.state === 'error'" type="error" :title="t('errorTitle')">
    {{ parseState.message }}
  </n-alert>

  <ToolSectionHeader>{{ t('resultsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-empty v-if="entries.length === 0" :description="t('resultsEmpty')" />
    <n-grid v-else cols="1 s:2 l:3" responsive="screen" :x-gap="12" :y-gap="12">
      <n-gi v-for="(entry, index) in entries" :key="`${entry.keyType}-${index}`">
        <n-card size="small" :title="t('keyLabel', { index: index + 1 })">
          <n-descriptions label-placement="left" bordered :column="1">
            <n-descriptions-item :label="t('keyType')">
              <n-text>{{ entry.keyType }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('keySize')">
              <n-text>{{ formatKeySize(entry.keySize) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('curve')">
              <n-text>{{ formatValue(entry.curve) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('comment')">
              <n-text>{{ formatValue(entry.comment) }}</n-text>
            </n-descriptions-item>
          </n-descriptions>

          <n-space vertical :size="12" class="fingerprint-section">
            <div>
              <n-text strong>{{ t('fingerprintSha256') }}</n-text>
              <n-input
                :value="entry.fingerprints.sha256"
                size="small"
                readonly
                class="monospace-input"
              />
              <n-flex :size="8" class="fingerprint-actions">
                <CopyToClipboardButton :content="entry.fingerprints.sha256" />
              </n-flex>
            </div>
            <div>
              <n-text strong>{{ t('fingerprintMd5') }}</n-text>
              <n-input
                :value="entry.fingerprints.md5"
                size="small"
                readonly
                class="monospace-input"
              />
              <n-flex :size="8" class="fingerprint-actions">
                <CopyToClipboardButton :content="entry.fingerprints.md5" />
              </n-flex>
            </div>
          </n-space>
        </n-card>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { computedAsync, useDebounce, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NEmpty,
  NFlex,
  NGi,
  NGrid,
  NInput,
  NSpace,
  NText,
} from 'naive-ui'
import { TextOrFileInput, CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { parseSshPublicKeys, type ParsedSshPublicKey } from '../ssh-public-key-fingerprint'

const { t } = useI18n()

const defaultInput = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKA+TN2h2fKj3j7KkVlKozY9dwfYR/gnzL5OikweCowV sample@example.com
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDstHdouwFlU60F7/Cx3kwUqgI1Lag+aVXXdo7csOwj8q9oBV+g+ncVYJ44PRpLrnxifKyAv+yypaCy9CuJKeCxETIaT/0Ig6dwzjne3KvXUmkKh4bEWF6nKm5/UhgZJj+7waHxEVwgdrPP/zaUBS/d+RITAstvRM3+ub3JUP/F7E7mlB5hc0fAwDjE7SMyHLl0qf+zWuLwS6sKtTtxqT+UWEhW9bWjDWcAJgzKGspqk56MNlH6gys8TFTjXyohkURTH/aRwczaxtmagjRKY+mQA4gSZeFEzZX2nw2rd+5pBqQDC6Bk5qIRy8gkuWwKbsq5rdN9Zdg9FCupMm8xwA/N sample@example.com`

const storedInput = useStorage('tools:ssh-public-key-fingerprint:input', defaultInput)
const inputValue = ref<string | File>(storedInput.value)
const acceptedFormats = '.pub,.txt,.key,authorized_keys'

watch(inputValue, (value) => {
  if (typeof value === 'string') {
    storedInput.value = value
  }
})

const debouncedInput = useDebounce(inputValue, 150)
const parsing = ref(false)

type ParseState =
  | { state: 'empty' }
  | { state: 'error'; message: string }
  | { state: 'parsed'; entries: ParsedSshPublicKey[] }

const parseState = computedAsync<ParseState>(
  async () => {
    const input = debouncedInput.value
    if (!input) return { state: 'empty' }

    const text = typeof input === 'string' ? input : await input.text()
    const trimmedText = text.trim()
    const entries = trimmedText ? await parseSshPublicKeys(text) : []

    return trimmedText
      ? entries.length
        ? { state: 'parsed', entries }
        : { state: 'error', message: t('errorNoKeys') }
      : { state: 'empty' }
  },
  { state: 'empty' },
  parsing,
)

const entries = computed(() =>
  parseState.value.state === 'parsed' ? parseState.value.entries : [],
)
const inputStatus = computed(() => {
  const hasInput = typeof inputValue.value === 'string' ? inputValue.value.trim().length > 0 : true
  if (!hasInput) return undefined
  if (parseState.value.state === 'error') return 'error'
  if (parseState.value.state === 'parsed') return 'success'
  return undefined
})

function formatValue(value?: string) {
  return value && value.length > 0 ? value : '-'
}

function formatKeySize(value?: number) {
  return value ? `${value} ${t('bits')}` : '-'
}
</script>

<style scoped>
.input-hint {
  margin-top: 8px;
}

.fingerprint-section {
  margin-top: 12px;
}

.fingerprint-actions {
  margin-top: 6px;
}
</style>

<i18n lang="json">
{
  "en": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "zh": {
    "inputTitle": "SSH 公钥",
    "inputPlaceholder": "粘贴 SSH 公钥或 authorized_keys 内容...",
    "inputHint": "支持 OpenSSH 公钥、authorized_keys 选项以及 SSH2 公钥块（RFC4716）。",
    "resultsTitle": "指纹",
    "resultsEmpty": "粘贴公钥以查看指纹。",
    "errorTitle": "解析错误",
    "errorNoKeys": "未找到有效的 SSH 公钥。",
    "keyLabel": "密钥 {index}",
    "keyType": "密钥类型",
    "keySize": "密钥长度",
    "curve": "曲线",
    "comment": "注释",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "位"
  },
  "zh-CN": {
    "inputTitle": "SSH 公钥",
    "inputPlaceholder": "粘贴 SSH 公钥或 authorized_keys 内容...",
    "inputHint": "支持 OpenSSH 公钥、authorized_keys 选项以及 SSH2 公钥块（RFC4716）。",
    "resultsTitle": "指纹",
    "resultsEmpty": "粘贴公钥以查看指纹。",
    "errorTitle": "解析错误",
    "errorNoKeys": "未找到有效的 SSH 公钥。",
    "keyLabel": "密钥 {index}",
    "keyType": "密钥类型",
    "keySize": "密钥长度",
    "curve": "曲线",
    "comment": "注释",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "位"
  },
  "zh-TW": {
    "inputTitle": "SSH 公鑰",
    "inputPlaceholder": "貼上 SSH 公鑰或 authorized_keys 內容...",
    "inputHint": "支援 OpenSSH 公鑰、authorized_keys 選項以及 SSH2 公鑰區塊（RFC4716）。",
    "resultsTitle": "指紋",
    "resultsEmpty": "貼上公鑰以查看指紋。",
    "errorTitle": "解析錯誤",
    "errorNoKeys": "未找到有效的 SSH 公鑰。",
    "keyLabel": "密鑰 {index}",
    "keyType": "密鑰類型",
    "keySize": "密鑰長度",
    "curve": "曲線",
    "comment": "註解",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "位元"
  },
  "zh-HK": {
    "inputTitle": "SSH 公鑰",
    "inputPlaceholder": "貼上 SSH 公鑰或 authorized_keys 內容...",
    "inputHint": "支援 OpenSSH 公鑰、authorized_keys 選項以及 SSH2 公鑰區塊（RFC4716）。",
    "resultsTitle": "指紋",
    "resultsEmpty": "貼上公鑰以查看指紋。",
    "errorTitle": "解析錯誤",
    "errorNoKeys": "未找到有效的 SSH 公鑰。",
    "keyLabel": "密鑰 {index}",
    "keyType": "密鑰類型",
    "keySize": "密鑰長度",
    "curve": "曲線",
    "comment": "註解",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "位元"
  },
  "es": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "fr": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "de": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "it": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "ja": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "ko": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "ru": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "pt": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "ar": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "hi": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "tr": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "nl": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "sv": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "pl": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "vi": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "th": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "id": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "he": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "ms": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "no": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "errorNoKeys": "No valid SSH public keys found.",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  }
}
</i18n>
