<template>
  <n-collapse-item :title="title" :name="name">
    <n-descriptions label-placement="left" bordered :column="1">
      <n-descriptions-item v-for="(value, key) in data" :key="key" :label="String(key)">
        <n-flex align="center" justify="space-between" :wrap="false">
          <n-text code style="word-break: break-all">{{ formatValue(value) }}</n-text>
          <CopyToClipboardButton :content="String(formatValue(value))" />
        </n-flex>
      </n-descriptions-item>
    </n-descriptions>
    <slot name="extra" />
  </n-collapse-item>
</template>

<script setup lang="ts">
import { NCollapseItem, NDescriptions, NDescriptionsItem, NFlex, NText } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  name: string
  title: string
  data: Record<string, unknown>
}>()

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '-'
  }

  if (value instanceof Date) {
    return value.toLocaleString()
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  if (typeof value === 'object') {
    if (value instanceof ArrayBuffer || value instanceof Uint8Array) {
      return `[Binary data: ${(value as ArrayBuffer).byteLength || (value as Uint8Array).length} bytes]`
    }
    return JSON.stringify(value)
  }

  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return String(value)
    }
    return value.toFixed(4).replace(/\.?0+$/, '')
  }

  return String(value)
}
</script>
