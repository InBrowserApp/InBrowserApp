<template>
  <n-space vertical :size="16">
    <ToolSection>
      <ToolSectionHeader>{{ t('input') }}</ToolSectionHeader>
      <n-text depth="3" style="font-size: 12px; margin-bottom: 8px; display: block">
        {{ t('supportedFormats') }}
      </n-text>
      <TextOrFileInput v-model:value="input" :placeholder="t('inputPlaceholder')" />
      <n-space v-if="detectedFormat" style="margin-top: 8px" align="center">
        <n-tag :type="detectedFormat === 'jwe' ? 'success' : 'info'" size="small">
          {{ t('detected', { format: detectedFormat.toUpperCase() }) }}
        </n-tag>
        <n-text v-if="detectedInfo" depth="3" style="font-size: 12px">
          {{ detectedInfo }}
        </n-text>
      </n-space>
    </ToolSection>

    <KeyInput
      :key-type="keyType"
      :password="password"
      :raw-key="rawKey"
      :key-length="keyLength"
      @update:key-type="keyType = $event"
      @update:password="password = $event"
      @update:raw-key="rawKey = $event"
    />

    <DecryptOptions
      :is-jwe-mode="detectedFormat === 'jwe'"
      :mode="mode"
      :key-length="keyLength"
      :input-format="inputFormat"
      @update:mode="mode = $event"
      @update:key-length="keyLength = $event"
      @update:input-format="inputFormat = $event"
    />

    <AdvancedOptions
      :is-jwe-mode="detectedFormat === 'jwe'"
      :key-type="keyType"
      :pbkdf2-iterations="pbkdf2Iterations"
      :pbkdf2-hash="pbkdf2Hash"
      @update:pbkdf2-iterations="pbkdf2Iterations = $event"
      @update:pbkdf2-hash="pbkdf2Hash = $event"
    />

    <n-button type="primary" :loading="decrypting" :disabled="!canDecrypt" @click="handleDecrypt">
      <template #icon>
        <n-icon :component="LockOpen16Regular" />
      </template>
      {{ t('decrypt') }}
    </n-button>

    <DecryptResult
      :result="result"
      :result-hex="resultHex"
      :result-binary="resultBinary"
      :error="error"
    />
  </n-space>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NSpace, NButton, NIcon, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { TextOrFileInput } from '@shared/ui/base'
import { LockOpen16Regular } from '@shared/icons/fluent'
import {
  type AesMode,
  type KeyLength,
  type KeyType,
  type OutputFormat,
  type Pbkdf2Hash,
  PBKDF2_HASH,
  PBKDF2_ITERATIONS,
  decryptWithPassword,
  decryptWithRawKey,
  decryptJweWithPassword,
  decryptJweWithRawKey,
  isJweFormat,
  parseJweHeader,
  getConfigFromJweEnc,
  arrayBufferToString,
  arrayBufferToHex,
  arrayBufferToBase64,
  isValidHex,
} from '@utils/aes'
import KeyInput from './KeyInput.vue'
import DecryptOptions from './DecryptOptions.vue'
import AdvancedOptions from './AdvancedOptions.vue'
import DecryptResult from './DecryptResult.vue'

const { t } = useI18n()

// Input
const input = ref<string | File>('')

// Key settings
const password = useStorage<string>('tools:aes-decryptor:password', '')
const rawKey = useStorage<string>('tools:aes-decryptor:rawKey', '')
const keyType = useStorage<KeyType>('tools:aes-decryptor:keyType', 'password')

// Options
const mode = useStorage<AesMode>('tools:aes-decryptor:mode', 'GCM')
const keyLength = useStorage<KeyLength>('tools:aes-decryptor:keyLength', 256)
const inputFormat = useStorage<OutputFormat>('tools:aes-decryptor:inputFormat', 'base64')

// Advanced options
const pbkdf2Iterations = useStorage<number>(
  'tools:aes-decryptor:pbkdf2Iterations',
  PBKDF2_ITERATIONS,
)
const pbkdf2Hash = useStorage<Pbkdf2Hash>('tools:aes-decryptor:pbkdf2Hash', PBKDF2_HASH)

// Result
const result = ref('')
const resultBinary = ref<ArrayBuffer | null>(null)
const resultHex = ref('')
const error = ref('')
const decrypting = ref(false)

// Computed
const expectedKeyLength = computed(() => keyLength.value / 4)

const rawKeyStatus = computed(() => {
  if (!rawKey.value) return undefined
  if (!isValidHex(rawKey.value)) return 'error'
  const cleanHex = rawKey.value.replace(/\s/g, '')
  if (cleanHex.length !== expectedKeyLength.value) return 'error'
  return 'success'
})

// Auto-detect format
const inputText = computed(() => {
  if (typeof input.value === 'string') {
    return input.value.trim()
  }
  return ''
})

const detectedFormat = computed<'jwe' | 'base64' | 'hex' | null>(() => {
  if (!inputText.value) return null
  if (isJweFormat(inputText.value)) return 'jwe'
  if (isValidHex(inputText.value)) return 'hex'
  // Try base64
  try {
    atob(inputText.value)
    return 'base64'
  } catch {
    return null
  }
})

const detectedInfo = computed(() => {
  if (detectedFormat.value !== 'jwe') return ''
  const header = parseJweHeader(inputText.value)
  if (!header) return ''
  const config = getConfigFromJweEnc(header.enc)
  const parts: string[] = []
  if (config) {
    parts.push(`${config.mode}-${config.keyLength}`)
  }
  if (header.p2c) {
    parts.push(`iterations: ${header.p2c.toLocaleString()}`)
  }
  parts.push(`alg: ${header.alg}`)
  return parts.join(', ')
})

// Auto-update mode/keyLength from JWE header
watch(inputText, () => {
  if (detectedFormat.value === 'jwe') {
    const header = parseJweHeader(inputText.value)
    if (header) {
      const config = getConfigFromJweEnc(header.enc)
      if (config) {
        mode.value = config.mode
        keyLength.value = config.keyLength
      }
    }
  }
})

const canDecrypt = computed(() => {
  if (!input.value) return false
  if (keyType.value === 'password') {
    return password.value.length > 0
  } else {
    return rawKeyStatus.value === 'success'
  }
})

// Functions
async function handleDecrypt() {
  error.value = ''
  result.value = ''
  resultBinary.value = null
  resultHex.value = ''
  decrypting.value = true

  try {
    let data: string
    if (typeof input.value === 'string') {
      data = input.value.trim()
    } else {
      // File input - read as text for JWE/base64/hex, or as binary
      const file = input.value
      if (file.name.endsWith('.bin') || file.type === 'application/octet-stream') {
        // Binary file - read as ArrayBuffer and convert to appropriate format
        const buffer = await file.arrayBuffer()
        data = arrayBufferToBase64(buffer)
        inputFormat.value = 'base64'
      } else {
        data = (await file.text()).trim()
      }
    }

    let decrypted: ArrayBuffer

    // Auto-detect and use JWE if detected
    if (detectedFormat.value === 'jwe' || isJweFormat(data)) {
      if (keyType.value === 'password') {
        decrypted = await decryptJweWithPassword(data, password.value)
      } else {
        decrypted = await decryptJweWithRawKey(data, rawKey.value)
      }
    } else {
      // Raw mode decryption
      const format = detectedFormat.value === 'hex' ? 'hex' : inputFormat.value

      if (keyType.value === 'password') {
        decrypted = await decryptWithPassword(
          data,
          password.value,
          mode.value,
          keyLength.value,
          format,
          {
            iterations: pbkdf2Iterations.value,
            hash: pbkdf2Hash.value,
          },
        )
      } else {
        decrypted = await decryptWithRawKey(data, rawKey.value, mode.value, keyLength.value, format)
      }
    }

    resultBinary.value = decrypted
    result.value = arrayBufferToString(decrypted)
    resultHex.value = arrayBufferToHex(decrypted)
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('decryptionFailed')
  } finally {
    decrypting.value = false
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "input": "Encrypted Data",
    "supportedFormats": "Supports: JWE (auto-detected), Base64, Hex",
    "inputPlaceholder": "Paste encrypted data here...",
    "detected": "Detected: {format}",
    "decrypt": "Decrypt",
    "decryptionFailed": "Decryption failed. Check your password/key and settings."
  },
  "zh": {
    "input": "加密数据",
    "supportedFormats": "支持格式: JWE (自动检测)、Base64、Hex",
    "inputPlaceholder": "在此粘贴加密数据...",
    "detected": "检测到: {format}",
    "decrypt": "解密",
    "decryptionFailed": "解密失败。请检查密码/密钥和设置。"
  }
}
</i18n>
