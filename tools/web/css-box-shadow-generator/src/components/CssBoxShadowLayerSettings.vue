<template>
  <n-flex vertical :size="12">
    <n-text strong>{{ t('layer-settings-title') }}</n-text>
    <n-form-item :label="t('offset-x')">
      <n-flex align="center" :size="12" class="control-row">
        <n-slider
          v-model:value="offsetX"
          :min="offsetRange.min"
          :max="offsetRange.max"
          :step="1"
          data-testid="offset-x-slider"
        />
        <n-input-number
          v-model:value="offsetX"
          :min="offsetRange.min"
          :max="offsetRange.max"
          :step="1"
          size="small"
          data-testid="offset-x-input"
        />
        <n-text depth="3">{{ t('unit-px') }}</n-text>
      </n-flex>
    </n-form-item>
    <n-form-item :label="t('offset-y')">
      <n-flex align="center" :size="12" class="control-row">
        <n-slider
          v-model:value="offsetY"
          :min="offsetRange.min"
          :max="offsetRange.max"
          :step="1"
          data-testid="offset-y-slider"
        />
        <n-input-number
          v-model:value="offsetY"
          :min="offsetRange.min"
          :max="offsetRange.max"
          :step="1"
          size="small"
          data-testid="offset-y-input"
        />
        <n-text depth="3">{{ t('unit-px') }}</n-text>
      </n-flex>
    </n-form-item>
    <n-form-item :label="t('blur')">
      <n-flex align="center" :size="12" class="control-row">
        <n-slider
          v-model:value="blur"
          :min="blurRange.min"
          :max="blurRange.max"
          :step="1"
          data-testid="blur-slider"
        />
        <n-input-number
          v-model:value="blur"
          :min="blurRange.min"
          :max="blurRange.max"
          :step="1"
          size="small"
          data-testid="blur-input"
        />
        <n-text depth="3">{{ t('unit-px') }}</n-text>
      </n-flex>
    </n-form-item>
    <n-form-item :label="t('spread')">
      <n-flex align="center" :size="12" class="control-row">
        <n-slider
          v-model:value="spread"
          :min="spreadRange.min"
          :max="spreadRange.max"
          :step="1"
          data-testid="spread-slider"
        />
        <n-input-number
          v-model:value="spread"
          :min="spreadRange.min"
          :max="spreadRange.max"
          :step="1"
          size="small"
          data-testid="spread-input"
        />
        <n-text depth="3">{{ t('unit-px') }}</n-text>
      </n-flex>
    </n-form-item>
    <n-form-item :label="t('color')">
      <n-color-picker
        v-model:value="color"
        :modes="['hex']"
        :show-alpha="true"
        :swatches="swatches"
        data-testid="color-picker"
      />
    </n-form-item>
    <n-form-item :label="t('inset')">
      <n-switch v-model:value="inset" data-testid="inset-switch" />
    </n-form-item>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NColorPicker, NFlex, NFormItem, NInputNumber, NSlider, NSwitch, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { ShadowLayer } from '../utils/shadow'

const { t } = useI18n()

const props = defineProps<{
  activeLayer: ShadowLayer
  offsetRange: { min: number; max: number }
  blurRange: { min: number; max: number }
  spreadRange: { min: number; max: number }
  swatches: string[]
}>()

const emit = defineEmits<{
  (event: 'update-layer', value: Partial<ShadowLayer>): void
}>()

const offsetX = computed({
  get: () => props.activeLayer.offsetX,
  set: (value: number) => emit('update-layer', { offsetX: value }),
})

const offsetY = computed({
  get: () => props.activeLayer.offsetY,
  set: (value: number) => emit('update-layer', { offsetY: value }),
})

const blur = computed({
  get: () => props.activeLayer.blur,
  set: (value: number) => emit('update-layer', { blur: value }),
})

const spread = computed({
  get: () => props.activeLayer.spread,
  set: (value: number) => emit('update-layer', { spread: value }),
})

const color = computed({
  get: () => props.activeLayer.color,
  set: (value: string) => emit('update-layer', { color: value }),
})

const inset = computed({
  get: () => props.activeLayer.inset,
  set: (value: boolean) => emit('update-layer', { inset: value }),
})
</script>

<style scoped>
.control-row {
  width: 100%;
}

.control-row :deep(.n-slider) {
  flex: 1;
  min-width: 120px;
}
</style>

<i18n lang="json">
{
  "en": {
    "layer-settings-title": "Layer settings",
    "offset-x": "Offset X",
    "offset-y": "Offset Y",
    "blur": "Blur",
    "spread": "Spread",
    "color": "Color",
    "inset": "Inset",
    "unit-px": "px"
  },
  "zh": {
    "layer-settings-title": "图层设置",
    "offset-x": "水平偏移",
    "offset-y": "垂直偏移",
    "blur": "模糊",
    "spread": "扩展",
    "color": "颜色",
    "inset": "内阴影",
    "unit-px": "px"
  },
  "zh-CN": {
    "layer-settings-title": "图层设置",
    "offset-x": "水平偏移",
    "offset-y": "垂直偏移",
    "blur": "模糊",
    "spread": "扩展",
    "color": "颜色",
    "inset": "内阴影",
    "unit-px": "px"
  },
  "zh-TW": {
    "layer-settings-title": "圖層設定",
    "offset-x": "水平位移",
    "offset-y": "垂直位移",
    "blur": "模糊",
    "spread": "擴展",
    "color": "顏色",
    "inset": "內陰影",
    "unit-px": "px"
  },
  "zh-HK": {
    "layer-settings-title": "圖層設定",
    "offset-x": "水平位移",
    "offset-y": "垂直位移",
    "blur": "模糊",
    "spread": "擴展",
    "color": "顏色",
    "inset": "內陰影",
    "unit-px": "px"
  },
  "es": {
    "layer-settings-title": "Ajustes de capa",
    "offset-x": "Desplazamiento X",
    "offset-y": "Desplazamiento Y",
    "blur": "Desenfoque",
    "spread": "Expansión",
    "color": "Color",
    "inset": "Interior",
    "unit-px": "px"
  },
  "fr": {
    "layer-settings-title": "Paramètres du calque",
    "offset-x": "Décalage X",
    "offset-y": "Décalage Y",
    "blur": "Flou",
    "spread": "Diffusion",
    "color": "Couleur",
    "inset": "Interne",
    "unit-px": "px"
  },
  "de": {
    "layer-settings-title": "Einstellungen der Ebene",
    "offset-x": "Versatz X",
    "offset-y": "Versatz Y",
    "blur": "Weichzeichnung",
    "spread": "Ausbreitung",
    "color": "Farbe",
    "inset": "Innen",
    "unit-px": "px"
  },
  "it": {
    "layer-settings-title": "Impostazioni livello",
    "offset-x": "Offset X",
    "offset-y": "Offset Y",
    "blur": "Sfocatura",
    "spread": "Espansione",
    "color": "Colore",
    "inset": "Interno",
    "unit-px": "px"
  },
  "ja": {
    "layer-settings-title": "レイヤー設定",
    "offset-x": "Xオフセット",
    "offset-y": "Yオフセット",
    "blur": "ぼかし",
    "spread": "拡がり",
    "color": "色",
    "inset": "内側",
    "unit-px": "px"
  },
  "ko": {
    "layer-settings-title": "레이어 설정",
    "offset-x": "X 오프셋",
    "offset-y": "Y 오프셋",
    "blur": "흐림",
    "spread": "퍼짐",
    "color": "색상",
    "inset": "내부",
    "unit-px": "px"
  },
  "ru": {
    "layer-settings-title": "Настройки слоя",
    "offset-x": "Смещение X",
    "offset-y": "Смещение Y",
    "blur": "Размытие",
    "spread": "Рассеивание",
    "color": "Цвет",
    "inset": "Внутренний",
    "unit-px": "px"
  },
  "pt": {
    "layer-settings-title": "Configurações da camada",
    "offset-x": "Deslocamento X",
    "offset-y": "Deslocamento Y",
    "blur": "Desfoque",
    "spread": "Espalhamento",
    "color": "Cor",
    "inset": "Interno",
    "unit-px": "px"
  },
  "ar": {
    "layer-settings-title": "إعدادات الطبقة",
    "offset-x": "إزاحة X",
    "offset-y": "إزاحة Y",
    "blur": "تمويه",
    "spread": "انتشار",
    "color": "اللون",
    "inset": "داخلي",
    "unit-px": "px"
  },
  "hi": {
    "layer-settings-title": "परत सेटिंग्स",
    "offset-x": "X ऑफ़सेट",
    "offset-y": "Y ऑफ़सेट",
    "blur": "धुंधलापन",
    "spread": "फैलाव",
    "color": "रंग",
    "inset": "भीतरी",
    "unit-px": "px"
  },
  "tr": {
    "layer-settings-title": "Katman ayarları",
    "offset-x": "X kaydırma",
    "offset-y": "Y kaydırma",
    "blur": "Bulanıklık",
    "spread": "Yayılma",
    "color": "Renk",
    "inset": "İç",
    "unit-px": "px"
  },
  "nl": {
    "layer-settings-title": "Laaginstellingen",
    "offset-x": "Offset X",
    "offset-y": "Offset Y",
    "blur": "Vervaging",
    "spread": "Spreiding",
    "color": "Kleur",
    "inset": "Binnen",
    "unit-px": "px"
  },
  "sv": {
    "layer-settings-title": "Lagerinställningar",
    "offset-x": "Offset X",
    "offset-y": "Offset Y",
    "blur": "Oskärpa",
    "spread": "Spridning",
    "color": "Färg",
    "inset": "Inre",
    "unit-px": "px"
  },
  "pl": {
    "layer-settings-title": "Ustawienia warstwy",
    "offset-x": "Przesunięcie X",
    "offset-y": "Przesunięcie Y",
    "blur": "Rozmycie",
    "spread": "Rozszerzenie",
    "color": "Kolor",
    "inset": "Wewnętrzny",
    "unit-px": "px"
  },
  "vi": {
    "layer-settings-title": "Cài đặt lớp",
    "offset-x": "Độ lệch X",
    "offset-y": "Độ lệch Y",
    "blur": "Làm mờ",
    "spread": "Lan rộng",
    "color": "Màu",
    "inset": "Bên trong",
    "unit-px": "px"
  },
  "th": {
    "layer-settings-title": "การตั้งค่าเลเยอร์",
    "offset-x": "ระยะเลื่อน X",
    "offset-y": "ระยะเลื่อน Y",
    "blur": "ความเบลอ",
    "spread": "การกระจาย",
    "color": "สี",
    "inset": "ด้านใน",
    "unit-px": "px"
  },
  "id": {
    "layer-settings-title": "Pengaturan lapisan",
    "offset-x": "Offset X",
    "offset-y": "Offset Y",
    "blur": "Blur",
    "spread": "Sebaran",
    "color": "Warna",
    "inset": "Inset",
    "unit-px": "px"
  },
  "he": {
    "layer-settings-title": "הגדרות שכבה",
    "offset-x": "היסט X",
    "offset-y": "היסט Y",
    "blur": "טשטוש",
    "spread": "פריסה",
    "color": "צבע",
    "inset": "פנימי",
    "unit-px": "px"
  },
  "ms": {
    "layer-settings-title": "Tetapan lapisan",
    "offset-x": "Ofset X",
    "offset-y": "Ofset Y",
    "blur": "Kabur",
    "spread": "Sebaran",
    "color": "Warna",
    "inset": "Dalam",
    "unit-px": "px"
  },
  "no": {
    "layer-settings-title": "Laginnstillinger",
    "offset-x": "Forskyvning X",
    "offset-y": "Forskyvning Y",
    "blur": "Uskarphet",
    "spread": "Spredning",
    "color": "Farge",
    "inset": "Innvendig",
    "unit-px": "px"
  }
}
</i18n>
