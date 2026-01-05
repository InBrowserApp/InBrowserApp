<template>
  <ToolSection v-if="!isJweMode">
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
    <n-grid :cols="3" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('mode')">
        <n-radio-group :value="mode" name="mode" @update:value="$emit('update:mode', $event)">
          <n-space vertical :size="4">
            <n-radio value="GCM">GCM</n-radio>
            <n-radio value="CBC">CBC</n-radio>
            <n-radio value="CTR">CTR</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi :label="t('keyLength')">
        <n-radio-group
          :value="keyLength"
          name="key-length"
          @update:value="$emit('update:keyLength', $event)"
        >
          <n-space vertical :size="4">
            <n-radio :value="128">128-bit</n-radio>
            <n-radio :value="192">192-bit</n-radio>
            <n-radio :value="256">256-bit</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi :label="t('inputFormat')">
        <n-radio-group
          :value="inputFormat"
          name="input-format"
          @update:value="$emit('update:inputFormat', $event)"
        >
          <n-space vertical :size="4">
            <n-radio value="base64">Base64</n-radio>
            <n-radio value="hex">Hex</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NGrid, NFormItemGi, NRadioGroup, NRadio, NSpace } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { AesMode, KeyLength, OutputFormat } from '@utils/aes'

defineProps<{
  isJweMode: boolean
  mode: AesMode
  keyLength: KeyLength
  inputFormat: OutputFormat
}>()

defineEmits<{
  'update:mode': [value: AesMode]
  'update:keyLength': [value: KeyLength]
  'update:inputFormat': [value: OutputFormat]
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "mode": "Mode",
    "keyLength": "Key Length",
    "inputFormat": "Format"
  },
  "zh": {
    "options": "选项",
    "mode": "模式",
    "keyLength": "密钥长度",
    "inputFormat": "格式"
  }
}
</i18n>
