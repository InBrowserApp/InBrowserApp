<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>
    <n-flex align="center" :size="16" wrap>
      <n-flex align="center" :size="8">
        <n-switch
          :value="validateFormats"
          size="small"
          @update:value="$emit('update:validateFormats', $event)"
        />
        <span>{{ validateFormatsLabel }}</span>
      </n-flex>
      <n-flex align="center" :size="8">
        <n-switch
          :value="allErrors"
          size="small"
          @update:value="$emit('update:allErrors', $event)"
        />
        <span>{{ allErrorsLabel }}</span>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex, NSwitch } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  title: string
  validateFormats: boolean
  allErrors: boolean
  validateFormatsLabel: string
  allErrorsLabel: string
}>()

defineEmits<{
  'update:validateFormats': [value: boolean]
  'update:allErrors': [value: boolean]
}>()
</script>
