<template>
  <ToolSection>
    <n-collapse>
      <n-collapse-item :title="t('advancedOptions')" name="advanced">
        <n-grid :cols="2" :x-gap="12" :y-gap="12">
          <n-form-item-gi v-if="keyType === 'password'" :label="t('pbkdf2Iterations')">
            <n-input-number
              :value="pbkdf2Iterations"
              :min="1000"
              :max="10000000"
              :step="10000"
              :status="pbkdf2Iterations < 10000 ? 'warning' : undefined"
              style="width: 100%"
              @update:value="$event !== null && $emit('update:pbkdf2Iterations', $event)"
            />
            <template v-if="pbkdf2Iterations < 10000" #feedback>
              <n-text type="warning" style="font-size: 12px">{{
                t('lowIterationsWarning')
              }}</n-text>
            </template>
          </n-form-item-gi>
          <n-form-item-gi v-if="keyType === 'password'" :label="t('pbkdf2Hash')">
            <n-select
              :value="pbkdf2Hash"
              :options="pbkdf2HashOptions"
              :disabled="outputMode === 'jwe'"
              @update:value="$emit('update:pbkdf2Hash', $event)"
            />
            <template v-if="outputMode === 'jwe'" #feedback>
              {{ t('jweHashNote') }}
            </template>
          </n-form-item-gi>
          <n-form-item-gi v-if="outputMode === 'raw'" label="Salt">
            <n-space vertical :size="8">
              <n-radio-group
                :value="saltMode"
                name="salt-mode"
                @update:value="$emit('update:saltMode', $event)"
              >
                <n-radio value="auto">{{ t('autoGenerate') }}</n-radio>
                <n-radio value="manual">{{ t('manual') }}</n-radio>
              </n-radio-group>
              <n-input
                v-if="saltMode === 'manual'"
                :value="manualSalt"
                :placeholder="t('saltPlaceholder')"
                style="font-family: monospace"
                @update:value="$emit('update:manualSalt', $event)"
              />
            </n-space>
          </n-form-item-gi>
          <n-form-item-gi v-if="outputMode === 'raw'" label="IV">
            <n-space vertical :size="8">
              <n-radio-group
                :value="ivMode"
                name="iv-mode"
                @update:value="$emit('update:ivMode', $event)"
              >
                <n-radio value="auto">{{ t('autoGenerate') }}</n-radio>
                <n-radio value="manual">{{ t('manual') }}</n-radio>
              </n-radio-group>
              <n-input
                v-if="ivMode === 'manual'"
                :value="manualIv"
                :placeholder="t('ivPlaceholder', { length: ivLength * 2 })"
                style="font-family: monospace"
                @update:value="$emit('update:manualIv', $event)"
              />
            </n-space>
          </n-form-item-gi>
        </n-grid>
      </n-collapse-item>
    </n-collapse>
  </ToolSection>
</template>

<script setup lang="ts">
import {
  NGrid,
  NFormItemGi,
  NCollapse,
  NCollapseItem,
  NInputNumber,
  NSelect,
  NRadioGroup,
  NRadio,
  NInput,
  NSpace,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import type { KeyType, OutputMode, Pbkdf2Hash } from '@utils/aes'

defineProps<{
  keyType: KeyType
  outputMode: OutputMode
  ivLength: number
  pbkdf2Iterations: number
  pbkdf2Hash: Pbkdf2Hash
  saltMode: 'auto' | 'manual'
  manualSalt: string
  ivMode: 'auto' | 'manual'
  manualIv: string
}>()

defineEmits<{
  'update:pbkdf2Iterations': [value: number]
  'update:pbkdf2Hash': [value: Pbkdf2Hash]
  'update:saltMode': [value: 'auto' | 'manual']
  'update:manualSalt': [value: string]
  'update:ivMode': [value: 'auto' | 'manual']
  'update:manualIv': [value: string]
}>()

const { t } = useI18n()

const pbkdf2HashOptions = [
  { label: 'SHA-1', value: 'SHA-1' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
] satisfies Array<{ label: string; value: Pbkdf2Hash }>
</script>

<i18n lang="json">
{
  "en": {
    "advancedOptions": "Advanced Options",
    "pbkdf2Iterations": "PBKDF2 Iterations",
    "pbkdf2Hash": "PBKDF2 Hash",
    "jweHashNote": "JWE uses hash based on key length",
    "lowIterationsWarning": "Too low - recommend at least 100,000",
    "autoGenerate": "Auto generate",
    "manual": "Manual",
    "saltPlaceholder": "32 hex characters",
    "ivPlaceholder": "{length} hex characters"
  },
  "zh": {
    "advancedOptions": "高级选项",
    "pbkdf2Iterations": "PBKDF2 迭代次数",
    "pbkdf2Hash": "PBKDF2 哈希",
    "jweHashNote": "JWE 根据密钥长度自动选择哈希",
    "lowIterationsWarning": "迭代次数过低 - 建议至少 100,000",
    "autoGenerate": "自动生成",
    "manual": "手动输入",
    "saltPlaceholder": "32 个十六进制字符",
    "ivPlaceholder": "{length} 个十六进制字符"
  }
}
</i18n>
