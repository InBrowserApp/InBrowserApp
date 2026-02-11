<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HashTextOrFileTemplate :hash="hashFunction" />
    <ToolSectionHeader>
      {{ t('config') }}
    </ToolSectionHeader>
    <ToolSection>
      <n-form-item :label="t('output-size-label')">
        <n-select v-model:value="outputSize" :options="outputSizeOptions" />
      </n-form-item>
      <n-form-item
        :label="t('key-label')"
        :validation-status="keyStatus"
        :feedback="keyFeedback"
        :show-feedback="!!keyFeedback"
      >
        <n-input v-model:value="keyInput" :placeholder="t('key-placeholder')" />
      </n-form-item>
    </ToolSection>
    <WhatIsHighwayHash />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import WhatIsHighwayHash from './WhatIsHighwayHash.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItem, NInput, NSelect } from 'naive-ui'
import { decodeBase16 } from '@utils/base16'
import { HighwayHash } from 'highwayhasher'

const { t } = useI18n()

type HighwayHashOutputSize = 64 | 128 | 256

const outputSize = ref<HighwayHashOutputSize>(64)
const keyInput = ref('')

const outputSizeOptions = computed(() => [
  { label: t('output-size-64'), value: 64 },
  { label: t('output-size-128'), value: 128 },
  { label: t('output-size-256'), value: 256 },
])

const parseKey = (input: string) => {
  if (!input.trim()) {
    return { key: undefined, isValid: true }
  }

  try {
    const bytes = decodeBase16(input)
    if (bytes.length !== 32) {
      return { key: undefined, isValid: false }
    }
    return { key: bytes, isValid: true }
  } catch {
    return { key: undefined, isValid: false }
  }
}

const keyState = computed(() => parseKey(keyInput.value))
const keyStatus = computed(() => (keyState.value.isValid ? undefined : 'error'))
const keyFeedback = computed(() => (keyState.value.isValid ? '' : t('key-invalid')))

const hashFunction = computed(() => {
  const key = keyState.value.key
  const bits = outputSize.value

  return async (blob: Blob): Promise<ArrayBuffer> => {
    const hasher = await HighwayHash.load(key)
    const reader = blob.stream().getReader()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        hasher.append(value)
      }
    } finally {
      reader.releaseLock()
    }

    let hashBytes: Uint8Array
    switch (bits) {
      case 128:
        hashBytes = hasher.finalize128()
        break
      case 256:
        hashBytes = hasher.finalize256()
        break
      default:
        hashBytes = hasher.finalize64()
        break
    }

    const output = new Uint8Array(hashBytes.length)
    output.set(hashBytes)
    return output.buffer
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "zh": {
    "config": "配置",
    "output-size-label": "输出长度",
    "output-size-64": "64 位",
    "output-size-128": "128 位",
    "output-size-256": "256 位",
    "key-label": "密钥（32 字节十六进制，可选）",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "请输入 64 位十六进制字符的 32 字节密钥（可选 0x 前缀）。"
  },
  "zh-CN": {
    "config": "配置",
    "output-size-label": "输出长度",
    "output-size-64": "64 位",
    "output-size-128": "128 位",
    "output-size-256": "256 位",
    "key-label": "密钥（32 字节十六进制，可选）",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "请输入 64 位十六进制字符的 32 字节密钥（可选 0x 前缀）。"
  },
  "zh-TW": {
    "config": "設定",
    "output-size-label": "輸出長度",
    "output-size-64": "64 位元",
    "output-size-128": "128 位元",
    "output-size-256": "256 位元",
    "key-label": "金鑰（32 位元組十六進位，可選）",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "請輸入 64 位十六進位字元的 32 位元組金鑰（可選 0x 前綴）。"
  },
  "zh-HK": {
    "config": "設定",
    "output-size-label": "輸出長度",
    "output-size-64": "64 位元",
    "output-size-128": "128 位元",
    "output-size-256": "256 位元",
    "key-label": "金鑰（32 位元組十六進位，可選）",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "請輸入 64 位十六進位字元的 32 位元組金鑰（可選 0x 前綴）。"
  },
  "es": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "fr": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "de": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "it": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "ja": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "ko": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "ru": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "pt": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "ar": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "hi": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "tr": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "nl": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "sv": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "pl": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "vi": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "th": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "id": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "he": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "ms": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  },
  "no": {
    "config": "Configuration",
    "output-size-label": "Output Size",
    "output-size-64": "64-bit",
    "output-size-128": "128-bit",
    "output-size-256": "256-bit",
    "key-label": "Secret Key (Hex, 32 bytes, optional)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    "key-invalid": "Enter a 32-byte key as 64 hex characters (0x optional)."
  }
}
</i18n>
