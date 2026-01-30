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
  <SshPublicKeyFingerprintResults
    :entries="entries"
    :error-message="errorMessage"
    :has-error="parseState.state === 'error'"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { computedAsync, useDebounce, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NText } from 'naive-ui'
import { TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { parseSshPublicKeys, type ParsedSshPublicKey } from '../ssh-public-key-fingerprint'
import SshPublicKeyFingerprintResults from './SshPublicKeyFingerprintResults.vue'

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

const errorMessage = computed(() =>
  parseState.value.state === 'error' ? parseState.value.message : '',
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
</script>

<style scoped>
.input-hint {
  margin-top: 8px;
}

.monospace-input :deep(.n-input__textarea-el),
.monospace-input :deep(.n-input__textarea-mirror) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  word-break: break-all !important;
  overflow-wrap: anywhere;
}

.monospace-input :deep(input) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "zh": {
    "inputTitle": "SSH 公钥",
    "inputPlaceholder": "粘贴 SSH 公钥或 authorized_keys 内容...",
    "inputHint": "支持 OpenSSH 公钥、authorized_keys 选项以及 SSH2 公钥块（RFC4716）。",
    "errorNoKeys": "未找到有效的 SSH 公钥。"
  },
  "zh-CN": {
    "inputTitle": "SSH 公钥",
    "inputPlaceholder": "粘贴 SSH 公钥或 authorized_keys 内容...",
    "inputHint": "支持 OpenSSH 公钥、authorized_keys 选项以及 SSH2 公钥块（RFC4716）。",
    "errorNoKeys": "未找到有效的 SSH 公钥。"
  },
  "zh-TW": {
    "inputTitle": "SSH 公鑰",
    "inputPlaceholder": "貼上 SSH 公鑰或 authorized_keys 內容...",
    "inputHint": "支援 OpenSSH 公鑰、authorized_keys 選項以及 SSH2 公鑰區塊（RFC4716）。",
    "errorNoKeys": "未找到有效的 SSH 公鑰。"
  },
  "zh-HK": {
    "inputTitle": "SSH 公鑰",
    "inputPlaceholder": "貼上 SSH 公鑰或 authorized_keys 內容...",
    "inputHint": "支援 OpenSSH 公鑰、authorized_keys 選項以及 SSH2 公鑰區塊（RFC4716）。",
    "errorNoKeys": "未找到有效的 SSH 公鑰。"
  },
  "es": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "fr": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "de": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "it": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "ja": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "ko": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "ru": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "pt": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "ar": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "hi": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "tr": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "nl": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "sv": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "pl": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "vi": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "th": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "id": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "he": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "ms": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  },
  "no": {
    "inputTitle": "SSH Public Key",
    "inputPlaceholder": "Paste an SSH public key or authorized_keys content...",
    "inputHint": "Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).",
    "errorNoKeys": "No valid SSH public keys found."
  }
}
</i18n>
