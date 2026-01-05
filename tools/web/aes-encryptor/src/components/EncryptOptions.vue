<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
    <n-grid :cols="4" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('outputMode')">
        <n-radio-group
          :value="outputMode"
          name="output-mode"
          @update:value="$emit('update:outputMode', $event)"
        >
          <n-space vertical :size="4">
            <n-radio value="jwe" :disabled="mode === 'CTR'">
              JWE
              <n-text depth="3" style="font-size: 12px">({{ t('recommended') }})</n-text>
            </n-radio>
            <n-radio value="raw">Raw</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi :label="t('mode')">
        <n-radio-group :value="mode" name="mode" @update:value="$emit('update:mode', $event)">
          <n-space vertical :size="4">
            <n-radio value="GCM">GCM</n-radio>
            <n-radio value="CBC" :disabled="outputMode === 'jwe' && keyType === 'raw'">
              CBC
            </n-radio>
            <n-radio value="CTR">CTR</n-radio>
          </n-space>
        </n-radio-group>
        <template v-if="mode === 'CTR'" #feedback>
          <n-text type="warning" style="font-size: 12px">{{ t('ctrWarning') }}</n-text>
        </template>
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
      <n-form-item-gi v-if="outputMode === 'raw'" :label="t('outputFormat')">
        <n-radio-group
          :value="outputFormat"
          name="output-format"
          @update:value="$emit('update:outputFormat', $event)"
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
import { NGrid, NFormItemGi, NRadioGroup, NRadio, NSpace, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { AesMode, KeyLength, KeyType, OutputFormat, OutputMode } from '@utils/aes'

defineProps<{
  outputMode: OutputMode
  mode: AesMode
  keyLength: KeyLength
  outputFormat: OutputFormat
  keyType: KeyType
}>()

defineEmits<{
  'update:outputMode': [value: OutputMode]
  'update:mode': [value: AesMode]
  'update:keyLength': [value: KeyLength]
  'update:outputFormat': [value: OutputFormat]
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "outputMode": "Output Format",
    "recommended": "recommended",
    "mode": "Mode",
    "keyLength": "Key Length",
    "outputFormat": "Encoding",
    "ctrWarning": "CTR mode has no authentication - data can be tampered"
  },
  "zh": {
    "options": "选项",
    "outputMode": "输出格式",
    "recommended": "推荐",
    "mode": "模式",
    "keyLength": "密钥长度",
    "outputFormat": "编码",
    "ctrWarning": "CTR 模式无认证 - 数据可能被篡改"
  }
}
</i18n>
