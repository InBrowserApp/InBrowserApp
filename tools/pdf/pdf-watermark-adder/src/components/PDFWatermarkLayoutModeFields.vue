<template>
  <n-gi :span="12">
    <n-form-item :label="layoutLabel" :show-feedback="false">
      <n-radio-group
        data-test="layout-mode-group"
        :value="layoutMode"
        name="watermark-layout-mode"
        @update:value="handleLayoutModeChange"
      >
        <n-radio-button value="single">{{ layoutSingleLabel }}</n-radio-button>
        <n-radio-button value="tile">{{ layoutTileLabel }}</n-radio-button>
      </n-radio-group>
    </n-form-item>
  </n-gi>

  <n-gi v-if="layoutMode === 'single'" :span="12">
    <n-form-item :label="positionLabel" :show-feedback="false">
      <n-select
        data-test="position-select"
        :value="position"
        :options="positionOptions"
        :disabled="isGenerating"
        @update:value="handlePositionChange"
      />
    </n-form-item>
  </n-gi>

  <n-gi v-else :span="12">
    <n-form-item :label="tilePresetLabel" :show-feedback="false">
      <n-flex vertical :size="8">
        <n-flex :size="8" wrap>
          <n-button
            data-test="tile-preset-sparse"
            size="small"
            :type="activeTilePreset === 'sparse' ? 'primary' : 'default'"
            :secondary="activeTilePreset !== 'sparse'"
            :disabled="isGenerating"
            @click="emit('apply-tile-preset', 'sparse')"
          >
            {{ tilePresetSparseLabel }}
          </n-button>
          <n-button
            data-test="tile-preset-medium"
            size="small"
            :type="activeTilePreset === 'medium' ? 'primary' : 'default'"
            :secondary="activeTilePreset !== 'medium'"
            :disabled="isGenerating"
            @click="emit('apply-tile-preset', 'medium')"
          >
            {{ tilePresetMediumLabel }}
          </n-button>
          <n-button
            data-test="tile-preset-dense"
            size="small"
            :type="activeTilePreset === 'dense' ? 'primary' : 'default'"
            :secondary="activeTilePreset !== 'dense'"
            :disabled="isGenerating"
            @click="emit('apply-tile-preset', 'dense')"
          >
            {{ tilePresetDenseLabel }}
          </n-button>
        </n-flex>
        <n-text depth="3">{{ tileGapHint }}</n-text>
      </n-flex>
    </n-form-item>
  </n-gi>

  <template v-if="layoutMode === 'single'">
    <n-gi :span="12">
      <n-form-item :label="offsetXLabel" :show-feedback="false">
        <n-input-number
          data-test="offset-x-input"
          style="width: 100%"
          :value="offsetX"
          :step="1"
          :disabled="isGenerating"
          @update:value="emit('update-offset-x', $event)"
        />
      </n-form-item>
    </n-gi>

    <n-gi :span="12">
      <n-form-item :label="offsetYLabel" :show-feedback="false">
        <n-input-number
          data-test="offset-y-input"
          style="width: 100%"
          :value="offsetY"
          :step="1"
          :disabled="isGenerating"
          @update:value="emit('update-offset-y', $event)"
        />
      </n-form-item>
    </n-gi>
  </template>

  <template v-else>
    <n-gi :span="12">
      <n-form-item :label="tileGapXLabel" :show-feedback="false">
        <n-slider
          data-test="tile-gap-x-slider"
          :value="tileGapX"
          :min="0"
          :max="200"
          :step="1"
          :disabled="isGenerating"
          :format-tooltip="formatPercentTooltip"
          @update:value="emit('update-tile-gap-x', $event)"
        />
      </n-form-item>
    </n-gi>

    <n-gi :span="12">
      <n-form-item :label="tileGapYLabel" :show-feedback="false">
        <n-slider
          data-test="tile-gap-y-slider"
          :value="tileGapY"
          :min="0"
          :max="200"
          :step="1"
          :disabled="isGenerating"
          :format-tooltip="formatPercentTooltip"
          @update:value="emit('update-tile-gap-y', $event)"
        />
      </n-form-item>
    </n-gi>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SelectOption } from 'naive-ui'
import {
  NButton,
  NFlex,
  NFormItem,
  NGi,
  NInputNumber,
  NRadioButton,
  NRadioGroup,
  NSelect,
  NSlider,
  NText,
} from 'naive-ui'
import type { WatermarkLayoutMode, WatermarkPosition, WatermarkTilePreset } from '../types'
import { resolveTilePreset } from '../utils/watermark-layout'

const props = defineProps<{
  layoutLabel: string
  layoutSingleLabel: string
  layoutTileLabel: string
  tilePresetLabel: string
  tilePresetSparseLabel: string
  tilePresetMediumLabel: string
  tilePresetDenseLabel: string
  tileGapHint: string
  tileGapXLabel: string
  tileGapYLabel: string
  positionLabel: string
  offsetXLabel: string
  offsetYLabel: string
  positionOptions: SelectOption[]
  layoutMode: WatermarkLayoutMode
  position: WatermarkPosition
  offsetX: number
  offsetY: number
  tileGapX: number
  tileGapY: number
  isGenerating: boolean
}>()

const emit = defineEmits<{
  (event: 'update-layout-mode', value: WatermarkLayoutMode): void
  (event: 'update-position', value: WatermarkPosition): void
  (event: 'update-offset-x', value: number | null): void
  (event: 'update-offset-y', value: number | null): void
  (event: 'apply-tile-preset', value: WatermarkTilePreset): void
  (event: 'update-tile-gap-x', value: number | null): void
  (event: 'update-tile-gap-y', value: number | null): void
}>()

const activeTilePreset = computed(() => resolveTilePreset(props.tileGapX, props.tileGapY))

const handleLayoutModeChange = (value: string): void => {
  if (value === 'single' || value === 'tile') {
    emit('update-layout-mode', value)
  }
}

const handlePositionChange = (value: string): void => {
  if (
    value === 'top-left' ||
    value === 'top-center' ||
    value === 'top-right' ||
    value === 'center-left' ||
    value === 'center' ||
    value === 'center-right' ||
    value === 'bottom-left' ||
    value === 'bottom-center' ||
    value === 'bottom-right'
  ) {
    emit('update-position', value)
  }
}

const formatPercentTooltip = (value: number): string => `${value}%`
</script>
