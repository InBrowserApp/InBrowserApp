<template>
  <ToolSection>
    <n-flex justify="space-between" align="center" class="section-header">
      <span class="section-title">{{ label }}</span>
      <CopyToClipboardButton :content="value" size="small" />
    </n-flex>
    <n-text code class="output-value">{{ value || '-' }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex, NText } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  label: string
  value: string
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

.output-value {
  word-break: break-all;
  width: 100%;
  padding: 8px 12px;
}
</style>
