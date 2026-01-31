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
        v-model:layer-shape="layerShapeModel"
        v-model:layer-size="layerSizeModel"
        :layer-type="layerTypeModel"
      />
      <n-divider />
      <CssGradientLayerColorSpaceSelect v-model:layer-color-space="layerColorSpaceModel" />
      <CssGradientLayerBlendModeSelect v-model:layer-blend-mode="layerBlendModeModel" />
    </n-flex>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NDivider, NFlex } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { BlendMode, ColorSpace, GradientType, RadialShape, RadialSize } from '../types'
import CssGradientLayerBlendModeSelect from './CssGradientLayerBlendModeSelect.vue'
import CssGradientLayerColorSpaceSelect from './CssGradientLayerColorSpaceSelect.vue'
import CssGradientLayerRadialControls from './CssGradientLayerRadialControls.vue'
import CssGradientLayerTypeControls from './CssGradientLayerTypeControls.vue'

const { t } = useI18n()

const layerTypeModel = defineModel<GradientType>('layerType', { required: true })
const layerAngleModel = defineModel<number>('layerAngle', { required: true })
const layerCenterXModel = defineModel<number>('layerCenterX', { required: true })
const layerCenterYModel = defineModel<number>('layerCenterY', { required: true })
const layerShapeModel = defineModel<RadialShape>('layerShape', { required: true })
const layerSizeModel = defineModel<RadialSize>('layerSize', { required: true })
const layerColorSpaceModel = defineModel<ColorSpace>('layerColorSpace', { required: true })
const layerBlendModeModel = defineModel<BlendMode>('layerBlendMode', { required: true })
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
