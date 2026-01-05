<template>
  <ToolSection v-if="!isJweMode">
    <n-collapse>
      <n-collapse-item :title="t('advancedOptions')" name="advanced">
        <n-grid :cols="2" :x-gap="12" :y-gap="12">
          <n-form-item-gi v-if="keyType === 'password'" :label="t('pbkdf2Iterations')">
            <n-input-number
              :value="pbkdf2Iterations"
              :min="1000"
              :max="10000000"
              :step="10000"
              style="width: 100%"
              @update:value="$event !== null && $emit('update:pbkdf2Iterations', $event)"
            />
          </n-form-item-gi>
          <n-form-item-gi v-if="keyType === 'password'" :label="t('pbkdf2Hash')">
            <n-select
              :value="pbkdf2Hash"
              :options="pbkdf2HashOptions"
              @update:value="$emit('update:pbkdf2Hash', $event)"
            />
          </n-form-item-gi>
        </n-grid>
      </n-collapse-item>
    </n-collapse>
  </ToolSection>
</template>

<script setup lang="ts">
import { NGrid, NFormItemGi, NCollapse, NCollapseItem, NInputNumber, NSelect } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import type { KeyType, Pbkdf2Hash } from '@utils/aes'

defineProps<{
  isJweMode: boolean
  keyType: KeyType
  pbkdf2Iterations: number
  pbkdf2Hash: Pbkdf2Hash
}>()

defineEmits<{
  'update:pbkdf2Iterations': [value: number]
  'update:pbkdf2Hash': [value: Pbkdf2Hash]
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
    "pbkdf2Hash": "PBKDF2 Hash"
  },
  "zh": {
    "advancedOptions": "高级选项",
    "pbkdf2Iterations": "PBKDF2 迭代次数",
    "pbkdf2Hash": "PBKDF2 哈希"
  }
}
</i18n>
