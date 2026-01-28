<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>

    <n-grid cols="1 s:2 l:3" :x-gap="12" :y-gap="12" responsive="screen">
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
      <n-form-item-gi :label="speedLabel" :show-feedback="false">
        <n-flex vertical :size="8" style="width: 100%">
          <n-input-number
            :value="speed"
            :min="minSpeed"
            :max="maxSpeed"
            :step="0.1"
            style="width: 100%"
            @update:value="handleSpeedUpdate"
          />
          <n-text depth="3">{{ speedHint }}</n-text>
        </n-flex>
      </n-form-item-gi>
      <n-form-item-gi :label="loopLabel" :show-feedback="false">
        <n-flex vertical :size="8" style="width: 100%">
          <n-select
            :value="loopMode"
            :options="loopOptions"
            style="width: 100%"
            @update:value="handleLoopModeUpdate"
          />
          <n-text depth="3">{{ loopHint }}</n-text>
        </n-flex>
      </n-form-item-gi>
    </n-grid>

    <n-collapse-transition :show="loopMode === 'custom'">
      <n-grid cols="1 s:2 l:3" :x-gap="12" :y-gap="12" responsive="screen" style="margin-top: 12px">
        <n-form-item-gi :label="loopCountLabel" :show-feedback="false">
          <n-input-number
            :value="loopCount"
            :min="1"
            :step="1"
            style="width: 100%"
            @update:value="handleLoopCountUpdate"
          />
        </n-form-item-gi>
      </n-grid>
    </n-collapse-transition>

    <n-grid cols="1 s:2 l:3" :x-gap="12" :y-gap="12" responsive="screen" style="margin-top: 12px">
      <n-form-item-gi :label="optimizeLabel" :show-feedback="false">
        <n-switch :value="optimize" @update:value="handleOptimizeUpdate" />
      </n-form-item-gi>
      <n-form-item-gi :label="optimizeLevelLabel" :show-feedback="false">
        <n-flex vertical :size="8" style="width: 100%">
          <n-input-number
            :value="optimizeLevel"
            :min="0"
            :max="6"
            :step="1"
            style="width: 100%"
            :disabled="!optimize"
            @update:value="handleOptimizeLevelUpdate"
          />
          <n-text depth="3">{{ optimizeHint }}</n-text>
        </n-flex>
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
import { computed } from 'vue'
import {
  NButton,
  NCollapseTransition,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInputNumber,
  NSelect,
  NSwitch,
  NText,
} from 'naive-ui'
import ImageEdit24Regular from '@vicons/fluent/ImageEdit24Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { GifLoopMode } from '../types'

const props = defineProps<{
  title: string
  scaleLabel: string
  scaleHint: string
  speedLabel: string
  speedHint: string
  loopLabel: string
  loopHint: string
  loopCountLabel: string
  loopInheritLabel: string
  loopInfiniteLabel: string
  loopCustomLabel: string
  optimizeLabel: string
  optimizeLevelLabel: string
  optimizeHint: string
  convertLabel: string
  convertingLabel: string
  scale: number
  speed: number
  loopMode: GifLoopMode
  loopCount: number | null
  optimize: boolean
  optimizeLevel: number
  minScale: number
  maxScale: number
  minSpeed: number
  maxSpeed: number
  isConverting: boolean
  canConvert: boolean
}>()

const emit = defineEmits<{
  'update:scale': [value: number]
  'update:speed': [value: number]
  'update:loopMode': [value: GifLoopMode]
  'update:loopCount': [value: number | null]
  'update:optimize': [value: boolean]
  'update:optimizeLevel': [value: number]
  convert: []
}>()

const loopOptions = computed(() => [
  { label: props.loopInheritLabel, value: 'inherit' },
  { label: props.loopInfiniteLabel, value: 'infinite' },
  { label: props.loopCustomLabel, value: 'custom' },
])

function handleScaleUpdate(value: number | null) {
  emit('update:scale', value ?? props.scale)
}

function handleSpeedUpdate(value: number | null) {
  emit('update:speed', value ?? props.speed)
}

function handleLoopModeUpdate(value: GifLoopMode | null) {
  emit('update:loopMode', value ?? props.loopMode)
}

function handleLoopCountUpdate(value: number | null) {
  emit('update:loopCount', value)
}

function handleOptimizeUpdate(value: boolean) {
  emit('update:optimize', value)
}

function handleOptimizeLevelUpdate(value: number | null) {
  emit('update:optimizeLevel', value ?? props.optimizeLevel)
}
</script>
