<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HashTextOrFileTemplate :hash="hashFunction" />
    <ToolSectionHeader>
      {{ t('key-config') }}
    </ToolSectionHeader>
    <ToolSection>
      <n-form-item
        :label="t('key-label')"
        :validation-status="keyStatus"
        :feedback="keyFeedback"
        :show-feedback="!!keyFeedback"
      >
        <n-input v-model:value="keyInput" :placeholder="t('key-placeholder')" />
      </n-form-item>
    </ToolSection>
    <WhatIsSipHash />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import WhatIsSipHash from './WhatIsSipHash.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItem, NInput } from 'naive-ui'
import { decodeBase16 } from '@utils/base16'
import { siphash24 } from './siphash'

const { t } = useI18n()

const keyInput = ref('')

const parseKey = (input: string) => {
  if (!input.trim()) {
    return { key: new Uint8Array(16), isValid: true }
  }

  try {
    const bytes = decodeBase16(input)
    if (bytes.length !== 16) {
      return { key: new Uint8Array(16), isValid: false }
    }
    return { key: bytes, isValid: true }
  } catch {
    return { key: new Uint8Array(16), isValid: false }
  }
}

const keyState = computed(() => parseKey(keyInput.value))
const keyStatus = computed(() => (keyState.value.isValid ? undefined : 'error'))
const keyFeedback = computed(() => (keyState.value.isValid ? '' : t('key-invalid')))

const hashFunction = computed(() => {
  const key = keyState.value.key
  return async (blob: Blob): Promise<ArrayBuffer> => {
    const arrayBuffer = await blob.arrayBuffer()
    const hashBytes = siphash24(new Uint8Array(arrayBuffer), key)
    const output = new Uint8Array(hashBytes.length)
    output.set(hashBytes)
    return output.buffer
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "zh": {
    "key-config": "密钥",
    "key-label": "密钥（16 字节十六进制）",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "请输入 32 位十六进制字符的 16 字节密钥（可选 0x 前缀）。"
  },
  "zh-CN": {
    "key-config": "密钥",
    "key-label": "密钥（16 字节十六进制）",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "请输入 32 位十六进制字符的 16 字节密钥（可选 0x 前缀）。"
  },
  "zh-TW": {
    "key-config": "金鑰",
    "key-label": "金鑰（16 位元組十六進位）",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "請輸入 32 位十六進位字元的 16 位元組金鑰（可選 0x 前綴）。"
  },
  "zh-HK": {
    "key-config": "金鑰",
    "key-label": "金鑰（16 位元組十六進位）",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "請輸入 32 位十六進位字元的 16 位元組金鑰（可選 0x 前綴）。"
  },
  "es": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "fr": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "de": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "it": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "ja": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "ko": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "ru": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "pt": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "ar": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "hi": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "tr": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "nl": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "sv": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "pl": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "vi": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "th": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "id": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "he": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "ms": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  },
  "no": {
    "key-config": "Key",
    "key-label": "Key (Hex, 16 bytes)",
    "key-placeholder": "0x000102030405060708090a0b0c0d0e0f",
    "key-invalid": "Enter a 16-byte key as 32 hex characters (0x optional)."
  }
}
</i18n>
