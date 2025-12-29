<template>
  <ToolSection>
    <n-flex justify="space-between" align="center" class="section-header">
      <span class="section-title">{{ label }}</span>
      <CopyToClipboardButton :content="modelValue" size="small" />
    </n-flex>
    <n-input
      :value="modelValue"
      @update:value="$emit('update:modelValue', $event)"
      :status="status"
      :placeholder="placeholder"
      class="monospace-input"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex, NInput } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  label: string
  modelValue: string
  status?: 'success' | 'warning' | 'error'
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.section-header {
  margin-bottom: 8px;
}

.section-title {
  font-weight: 500;
  font-size: 14px;
}

.monospace-input :deep(input) {
  font-family: var(--n-font-family-mono, monospace);
}
</style>
