<template>
  <ToolSection>
    <n-grid cols="1 l:2" :x-gap="24" :y-gap="24" responsive="screen">
      <n-gi>
        <n-flex vertical :size="16">
          <CssGradientPreviewPanel
            :background-image="backgroundImageCss"
            :blend-mode="previewBlendMode"
            @randomize-layer="handleRandomizeLayer"
            @randomize-all="handleRandomizeAll"
          />
          <CssGradientStopsPanel
            v-model:stop-color="activeStopColor"
            v-model:stop-position="activeStopPosition"
            :stops="activeStops"
            :active-stop-id="activeStopId"
            :gradient-css="activeTrackCss"
            :show-error="showStopError"
            @add-stop="handleAddStop"
            @select-stop="setActiveStop"
            @update-stop="updateStopPosition"
            @remove-stop="removeStop"
          />
          <CssGradientPresetsPanel
            :presets="presets"
            :preset-swatch-style-map="presetSwatchStyleMap"
            @apply-preset="applyPreset"
          />
        </n-flex>
      </n-gi>
      <n-gi>
        <n-flex vertical :size="16">
          <CssGradientLayersPanel
            :layers="layers"
            :active-layer-id="activeLayerId"
            :show-error="showLayerError"
            @set-active="setActiveLayer"
            @add-layer="addLayer"
            @duplicate-layer="duplicateLayer"
            @move-layer="moveLayer"
            @remove-layer="removeLayer"
          />
          <CssGradientLayerSettingsPanel
            v-model:layer-type="layerType"
            v-model:layer-angle="layerAngle"
            v-model:layer-center-x="layerCenterX"
            v-model:layer-center-y="layerCenterY"
            v-model:layer-shape="layerShape"
            v-model:layer-size="layerSize"
            v-model:layer-color-space="layerColorSpace"
            v-model:layer-blend-mode="layerBlendMode"
          />
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>

  <ToolSection>
    <n-grid cols="1 l:3" :x-gap="24" :y-gap="24" responsive="screen">
      <n-gi>
        <CssGradientOutputPanel
          v-model:output-format="outputFormat"
          :css-output="cssOutput"
          :background-image-declaration="backgroundImageDeclaration"
          :background-blend-declaration="backgroundBlendDeclaration"
          :background-shorthand="backgroundShorthand"
          :has-blend-modes="hasBlendModes"
          :css-url="cssUrl"
        />
      </n-gi>
      <n-gi>
        <CssGradientExportPanel
          v-model:export-width="exportWidth"
          v-model:export-height="exportHeight"
          :png-url="pngUrl"
          :svg-url="svgUrl"
          :is-exporting-png="isExportingPng"
          :show-error="showExportError"
          @download-png="handlePngDownload"
        />
      </n-gi>
      <n-gi>
        <CssGradientJsonPanel
          v-model:json-input="jsonInput"
          :serialized-config="serializedConfig"
          :json-url="jsonUrl"
          :show-error="showJsonError"
          @load-json="loadJson"
        />
      </n-gi>
    </n-grid>
  </ToolSection>

  <WhatIsCssGradient />
</template>

<script setup lang="ts">
import { NFlex, NGi, NGrid } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import CssGradientExportPanel from './CssGradientExportPanel.vue'
import CssGradientJsonPanel from './CssGradientJsonPanel.vue'
import CssGradientLayerSettingsPanel from './CssGradientLayerSettingsPanel.vue'
import CssGradientLayersPanel from './CssGradientLayersPanel.vue'
import CssGradientOutputPanel from './CssGradientOutputPanel.vue'
import CssGradientPresetsPanel from './CssGradientPresetsPanel.vue'
import CssGradientPreviewPanel from './CssGradientPreviewPanel.vue'
import CssGradientStopsPanel from './CssGradientStopsPanel.vue'
import WhatIsCssGradient from './WhatIsCssGradient.vue'
import { useGradientEditor } from './useGradientEditor'
import { useGradientExport } from './useGradientExport'

const {
  layers,
  activeLayerId,
  activeStopId,
  outputFormat,
  jsonInput,
  showLayerError,
  showStopError,
  showJsonError,
  presets,
  activeStops,
  activeTrackCss,
  activeStopColor,
  activeStopPosition,
  layerType,
  layerAngle,
  layerCenterX,
  layerCenterY,
  layerShape,
  layerSize,
  layerColorSpace,
  layerBlendMode,
  presetSwatchStyleMap,
  backgroundImageCss,
  previewBlendMode,
  cssOutput,
  backgroundImageDeclaration,
  backgroundBlendDeclaration,
  backgroundShorthand,
  hasBlendModes,
  cssUrl,
  serializedConfig,
  jsonUrl,
  setActiveLayer,
  addLayer,
  duplicateLayer,
  moveLayer,
  removeLayer,
  handleAddStop,
  setActiveStop,
  updateStopPosition,
  removeStop,
  handleRandomizeLayer,
  handleRandomizeAll,
  applyPreset,
  loadJson,
} = useGradientEditor()

const {
  exportWidth,
  exportHeight,
  pngUrl,
  svgUrl,
  isExportingPng,
  showExportError,
  handlePngDownload,
} = useGradientExport(layers, outputFormat)
</script>

<style scoped>
:deep(.panel) {
  border-radius: 16px;
  border: 1px solid var(--n-border-color);
}

:deep(.panel__header) {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

:deep(.panel__title) {
  font-weight: 600;
  font-size: 16px;
}

:deep(.panel__subtitle) {
  font-size: 13px;
  color: var(--n-text-color-3);
}

:deep(.panel__alert) {
  margin-top: 12px;
}
</style>

<i18n lang="json">
{
  "en": {},
  "zh": {},
  "zh-CN": {},
  "zh-TW": {},
  "zh-HK": {},
  "es": {},
  "fr": {},
  "de": {},
  "it": {},
  "ja": {},
  "ko": {},
  "ru": {},
  "pt": {},
  "ar": {},
  "hi": {},
  "tr": {},
  "nl": {},
  "sv": {},
  "pl": {},
  "vi": {},
  "th": {},
  "id": {},
  "he": {},
  "ms": {},
  "no": {}
}
</i18n>
