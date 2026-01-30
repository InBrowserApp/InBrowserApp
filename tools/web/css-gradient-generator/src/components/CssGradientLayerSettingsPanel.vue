<template>
  <n-card class="panel">
    <div class="panel__header">
      <div>
        <div class="panel__title">{{ t('settingsTitle') }}</div>
        <div class="panel__subtitle">{{ t('settingsSubtitle') }}</div>
      </div>
    </div>
    <n-flex vertical :size="12">
      <CssGradientLayerTypeControls
        v-model:layer-type="layerTypeModel"
        v-model:layer-angle="layerAngleModel"
        v-model:layer-center-x="layerCenterXModel"
        v-model:layer-center-y="layerCenterYModel"
      />
      <CssGradientLayerRadialControls
        :layer-type="layerTypeModel"
        v-model:layer-shape="layerShapeModel"
        v-model:layer-size="layerSizeModel"
      />
      <n-divider />
      <CssGradientLayerColorSpaceSelect v-model:layer-color-space="layerColorSpaceModel" />
      <CssGradientLayerBlendModeSelect v-model:layer-blend-mode="layerBlendModeModel" />
    </n-flex>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NDivider, NFlex } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { BlendMode, ColorSpace, GradientType, RadialShape, RadialSize } from '../types'
import CssGradientLayerBlendModeSelect from './CssGradientLayerBlendModeSelect.vue'
import CssGradientLayerColorSpaceSelect from './CssGradientLayerColorSpaceSelect.vue'
import CssGradientLayerRadialControls from './CssGradientLayerRadialControls.vue'
import CssGradientLayerTypeControls from './CssGradientLayerTypeControls.vue'

const { t } = useI18n()

const props = defineProps<{
  layerType: GradientType
  layerAngle: number
  layerCenterX: number
  layerCenterY: number
  layerShape: RadialShape
  layerSize: RadialSize
  layerColorSpace: ColorSpace
  layerBlendMode: BlendMode
}>()

const emit = defineEmits<{
  (event: 'update:layerType', value: GradientType): void
  (event: 'update:layerAngle', value: number): void
  (event: 'update:layerCenterX', value: number): void
  (event: 'update:layerCenterY', value: number): void
  (event: 'update:layerShape', value: RadialShape): void
  (event: 'update:layerSize', value: RadialSize): void
  (event: 'update:layerColorSpace', value: ColorSpace): void
  (event: 'update:layerBlendMode', value: BlendMode): void
}>()

const layerTypeModel = computed({
  get: () => props.layerType,
  set: (value: GradientType) => emit('update:layerType', value),
})

const layerAngleModel = computed({
  get: () => props.layerAngle,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    emit('update:layerAngle', value)
  },
})

const layerCenterXModel = computed({
  get: () => props.layerCenterX,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    emit('update:layerCenterX', value)
  },
})

const layerCenterYModel = computed({
  get: () => props.layerCenterY,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    emit('update:layerCenterY', value)
  },
})

const layerShapeModel = computed({
  get: () => props.layerShape,
  set: (value: RadialShape) => emit('update:layerShape', value),
})

const layerSizeModel = computed({
  get: () => props.layerSize,
  set: (value: RadialSize) => emit('update:layerSize', value),
})

const layerColorSpaceModel = computed({
  get: () => props.layerColorSpace,
  set: (value: ColorSpace) => emit('update:layerColorSpace', value),
})

const layerBlendModeModel = computed({
  get: () => props.layerBlendMode,
  set: (value: BlendMode) => emit('update:layerBlendMode', value),
})
</script>

<i18n lang="json">
{
  "en": {
    "settingsTitle": "Layer Settings",
    "settingsSubtitle": "Tune the geometry and blending."
  },
  "zh": {
    "settingsTitle": "图层设置",
    "settingsSubtitle": "调整几何与混合方式。"
  },
  "zh-CN": {
    "settingsTitle": "图层设置",
    "settingsSubtitle": "调整几何与混合方式。"
  },
  "zh-TW": {
    "settingsTitle": "圖層設定",
    "settingsSubtitle": "調整幾何與混合方式。"
  },
  "zh-HK": {
    "settingsTitle": "圖層設定",
    "settingsSubtitle": "調整幾何與混合方式。"
  },
  "es": {
    "settingsTitle": "Ajustes de capa",
    "settingsSubtitle": "Ajusta la geometría y la mezcla."
  },
  "fr": {
    "settingsTitle": "Réglages du calque",
    "settingsSubtitle": "Ajustez la géométrie et le mélange."
  },
  "de": {
    "settingsTitle": "Ebeneneinstellungen",
    "settingsSubtitle": "Geometrie und Mischmodus anpassen."
  },
  "it": {
    "settingsTitle": "Impostazioni livello",
    "settingsSubtitle": "Regola geometria e fusione."
  },
  "ja": {
    "settingsTitle": "レイヤー設定",
    "settingsSubtitle": "形状とブレンドを調整します。"
  },
  "ko": {
    "settingsTitle": "레이어 설정",
    "settingsSubtitle": "기하와 블렌딩을 조정합니다."
  },
  "ru": {
    "settingsTitle": "Настройки слоя",
    "settingsSubtitle": "Настройте геометрию и смешивание."
  },
  "pt": {
    "settingsTitle": "Configurações da camada",
    "settingsSubtitle": "Ajuste a geometria e a mesclagem."
  },
  "ar": {
    "settingsTitle": "إعدادات الطبقة",
    "settingsSubtitle": "اضبط الهندسة والمزج."
  },
  "hi": {
    "settingsTitle": "परत सेटिंग",
    "settingsSubtitle": "ज्यामिति और ब्लेंडिंग समायोजित करें।"
  },
  "tr": {
    "settingsTitle": "Katman ayarları",
    "settingsSubtitle": "Geometri ve karışımı ayarlayın."
  },
  "nl": {
    "settingsTitle": "Laaginstellingen",
    "settingsSubtitle": "Pas geometrie en blending aan."
  },
  "sv": {
    "settingsTitle": "Lagerinställningar",
    "settingsSubtitle": "Justera geometri och blandning."
  },
  "pl": {
    "settingsTitle": "Ustawienia warstwy",
    "settingsSubtitle": "Dopasuj geometrię i mieszanie."
  },
  "vi": {
    "settingsTitle": "Cài đặt lớp",
    "settingsSubtitle": "Điều chỉnh hình học và hòa trộn."
  },
  "th": {
    "settingsTitle": "ตั้งค่าเลเยอร์",
    "settingsSubtitle": "ปรับเรขาคณิตและการผสมสี"
  },
  "id": {
    "settingsTitle": "Pengaturan lapisan",
    "settingsSubtitle": "Sesuaikan geometri dan blending."
  },
  "he": {
    "settingsTitle": "הגדרות שכבה",
    "settingsSubtitle": "כוונו גאומטריה ומיזוג."
  },
  "ms": {
    "settingsTitle": "Tetapan lapisan",
    "settingsSubtitle": "Laraskan geometri dan campuran."
  },
  "no": {
    "settingsTitle": "Laginnstillinger",
    "settingsSubtitle": "Juster geometri og blanding."
  }
}
</i18n>
