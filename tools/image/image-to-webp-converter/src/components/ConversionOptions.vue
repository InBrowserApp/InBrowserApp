<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>

    <n-grid cols="1 s:2 l:4" :x-gap="12" :y-gap="12" responsive="screen">
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
      <n-form-item-gi :label="qualityLabel" :show-feedback="false">
        <n-flex vertical :size="8" style="width: 100%">
          <n-input-number
            :value="quality"
            :min="0"
            :max="100"
            :step="1"
            style="width: 100%"
            @update:value="handleQualityUpdate"
          />
          <n-text depth="3">{{ qualityHint }}</n-text>
        </n-flex>
      </n-form-item-gi>
      <n-form-item-gi :label="methodLabel" :show-feedback="false">
        <n-flex vertical :size="8" style="width: 100%">
          <n-input-number
            :value="method"
            :min="0"
            :max="6"
            :step="1"
            style="width: 100%"
            @update:value="handleMethodUpdate"
          />
          <n-text depth="3">{{ methodHint }}</n-text>
        </n-flex>
      </n-form-item-gi>
      <n-form-item-gi :label="losslessLabel" :show-feedback="false">
        <n-switch :value="lossless" @update:value="handleLosslessUpdate" />
      </n-form-item-gi>
    </n-grid>

    <n-flex align="center" :size="12" style="margin-top: 12px">
      <n-button
        type="primary"
        :loading="isConverting"
        :disabled="!canConvert"
        @click="emit('convert')"
      >
        <template #icon>
          <n-icon><ImageEdit24Regular /></n-icon>
        </template>
        {{ isConverting ? convertingLabel : convertLabel }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NFormItemGi, NGrid, NIcon, NInputNumber, NSwitch, NText } from 'naive-ui'
import ImageEdit24Regular from '@vicons/fluent/ImageEdit24Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  title: string
  scaleLabel: string
  scaleHint: string
  qualityLabel: string
  qualityHint: string
  methodLabel: string
  methodHint: string
  losslessLabel: string
  convertLabel: string
  convertingLabel: string
  scale: number
  quality: number
  method: number
  lossless: boolean
  minScale: number
  maxScale: number
  isConverting: boolean
  canConvert: boolean
}>()

const emit = defineEmits<{
  'update:scale': [value: number]
  'update:quality': [value: number]
  'update:method': [value: number]
  'update:lossless': [value: boolean]
  convert: []
}>()

function handleScaleUpdate(value: number | null) {
  if (value === null) return
  emit('update:scale', value)
}

function handleQualityUpdate(value: number | null) {
  if (value === null) return
  emit('update:quality', value)
}

function handleMethodUpdate(value: number | null) {
  if (value === null) return
  emit('update:method', value)
}

function handleLosslessUpdate(value: boolean) {
  emit('update:lossless', value)
}
</script>
