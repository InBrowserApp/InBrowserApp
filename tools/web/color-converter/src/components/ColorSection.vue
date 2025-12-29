<template>
  <ToolSection>
    <n-flex justify="space-between" align="center" class="section-header">
      <n-flex align="center" :size="8">
        <span class="section-title">{{ label }}</span>
        <slot name="label-suffix" />
      </n-flex>
      <slot name="action" />
    </n-flex>
    <slot />
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'

defineProps<{
  label: string
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
</style>
