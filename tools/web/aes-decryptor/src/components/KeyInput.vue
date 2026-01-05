<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('keySettings') }}</ToolSectionHeader>
    <n-space vertical :size="12">
      <n-radio-group
        :value="keyType"
        name="key-type"
        @update:value="$emit('update:keyType', $event)"
      >
        <n-radio-button value="password">{{ t('password') }}</n-radio-button>
        <n-radio-button value="raw">{{ t('rawKey') }}</n-radio-button>
      </n-radio-group>

      <template v-if="keyType === 'password'">
        <n-input
          :value="password"
          type="password"
          show-password-on="click"
          :placeholder="t('passwordPlaceholder')"
          @update:value="$emit('update:password', $event)"
        />
      </template>

      <template v-else>
        <n-input
          :value="rawKey"
          :placeholder="t('rawKeyPlaceholder')"
          :status="rawKeyStatus"
          style="font-family: monospace"
          @update:value="$emit('update:rawKey', $event)"
        />
        <n-text v-if="rawKeyError" type="error" depth="3">{{ rawKeyError }}</n-text>
        <n-text depth="3">{{ t('keyLengthHint', { length: expectedKeyLength }) }}</n-text>
      </template>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NSpace, NRadioGroup, NRadioButton, NInput, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { type KeyType, type KeyLength, isValidHex } from '@utils/aes'

const props = defineProps<{
  keyType: KeyType
  password: string
  rawKey: string
  keyLength: KeyLength
}>()

defineEmits<{
  'update:keyType': [value: KeyType]
  'update:password': [value: string]
  'update:rawKey': [value: string]
}>()

const { t } = useI18n()

const expectedKeyLength = computed(() => props.keyLength / 4)

const rawKeyStatus = computed(() => {
  if (!props.rawKey) return undefined
  if (!isValidHex(props.rawKey)) return 'error'
  const cleanHex = props.rawKey.replace(/\s/g, '')
  if (cleanHex.length !== expectedKeyLength.value) return 'error'
  return 'success'
})

const rawKeyError = computed(() => {
  if (!props.rawKey) return ''
  if (!isValidHex(props.rawKey)) return t('invalidHex')
  const cleanHex = props.rawKey.replace(/\s/g, '')
  if (cleanHex.length !== expectedKeyLength.value) {
    return t('wrongKeyLength', {
      expected: expectedKeyLength.value,
      actual: cleanHex.length,
    })
  }
  return ''
})
</script>

<i18n lang="json">
{
  "en": {
    "keySettings": "Key Settings",
    "password": "Password",
    "rawKey": "Raw Key",
    "passwordPlaceholder": "Enter password...",
    "rawKeyPlaceholder": "Enter hex key...",
    "keyLengthHint": "Expected {length} hex characters",
    "invalidHex": "Invalid hex format",
    "wrongKeyLength": "Expected {expected} hex chars, got {actual}"
  },
  "zh": {
    "keySettings": "密钥设置",
    "password": "密码",
    "rawKey": "原始密钥",
    "passwordPlaceholder": "输入密码...",
    "rawKeyPlaceholder": "输入十六进制密钥...",
    "keyLengthHint": "需要 {length} 个十六进制字符",
    "invalidHex": "无效的十六进制格式",
    "wrongKeyLength": "需要 {expected} 个字符，当前 {actual} 个"
  }
}
</i18n>
