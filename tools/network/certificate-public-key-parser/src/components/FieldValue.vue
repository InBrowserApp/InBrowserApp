<template>
  <n-flex align="center" justify="space-between" :wrap="false" class="value-row">
    <n-text code class="value-text">{{ displayValue }}</n-text>
    <CopyToClipboardButton v-if="canCopy" :content="displayValue" size="small" />
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NText } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'

const props = defineProps<{
  value?: string | number | string[]
  emptyValue: string
  suffix?: string
}>()

const displayValue = computed(() => {
  if (props.value === undefined || props.value === null || props.value === '') {
    return props.emptyValue
  }

  if (Array.isArray(props.value)) {
    return props.value.length ? props.value.join(', ') : props.emptyValue
  }

  if (typeof props.value === 'number') {
    return props.suffix ? `${props.value} ${props.suffix}` : String(props.value)
  }

  return props.suffix ? `${props.value} ${props.suffix}` : String(props.value)
})

const canCopy = computed(() => displayValue.value !== props.emptyValue)
</script>

<style scoped>
.value-row {
  gap: 12px;
}

.value-text {
  word-break: break-all;
}
</style>
