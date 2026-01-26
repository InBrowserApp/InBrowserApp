<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>

    <n-grid cols="1 s:2" :x-gap="12" :y-gap="12" responsive="screen">
      <n-form-item-gi :label="scaleLabel" :show-feedback="false">
        <n-flex vertical :size="8" style="width: 100%">
          <n-input-number
            :value="scale"
            :min="minScale"
            :max="maxScale"
            :step="1"
            style="width: 100%"
            @update:value="handleScaleUpdate"
          />
          <n-text depth="3">{{ scaleHint }}</n-text>
        </n-flex>
      </n-form-item-gi>
    </n-grid>

    <n-flex align="center" :size="12" style="margin-top: 12px">
      <n-button secondary @click="emit('reset')">
        <template #icon>
          <n-icon><ArrowReset20Regular /></n-icon>
        </template>
        {{ resetLabel }}
      </n-button>
      <n-button type="primary" :loading="isConverting" :disabled="!canConvert" @click="emit('convert')">
        <template #icon>
          <n-icon><ImageEdit24Regular /></n-icon>
        </template>
        {{ isConverting ? convertingLabel : convertLabel }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NFormItemGi, NGrid, NIcon, NInputNumber, NText } from 'naive-ui'
import ArrowReset20Regular from '@vicons/fluent/ArrowReset20Regular'
import ImageEdit24Regular from '@vicons/fluent/ImageEdit24Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  title: string
  scaleLabel: string
  scaleHint: string
  resetLabel: string
  convertLabel: string
  convertingLabel: string
  scale: number
  minScale: number
  maxScale: number
  isConverting: boolean
  canConvert: boolean
}>()

const emit = defineEmits<{
  'update:scale': [value: number]
  convert: []
  reset: []
}>()

function handleScaleUpdate(value: number | null) {
  if (!value) return
  emit('update:scale', value)
}
</script>
