<template>
  <ToolSectionHeader>{{ t('layoutTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('fontSize')" :show-feedback="false">
        <n-input-number
          v-model:value="fontSize"
          :min="12"
          :max="28"
          size="small"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('lineHeight')" :show-feedback="false">
        <n-input-number
          v-model:value="lineHeight"
          :min="1.2"
          :max="2"
          :step="0.05"
          size="small"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('cardPadding')" :show-feedback="false">
        <n-input-number
          v-model:value="cardPadding"
          :min="12"
          :max="60"
          size="small"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('framePadding')" :show-feedback="false">
        <n-input-number
          v-model:value="framePadding"
          :min="isBackgroundNone ? 0 : 16"
          :max="120"
          size="small"
          style="width: 100%"
          :disabled="isBackgroundNone"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('radius')" :show-feedback="false">
        <n-input-number
          v-model:value="radius"
          :min="6"
          :max="40"
          size="small"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('shadow')" :show-feedback="false">
        <n-switch v-model:value="shadow" :disabled="isBackgroundNone" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('tabSize')" :show-feedback="false">
        <n-input-number
          v-model:value="tabSize"
          :min="2"
          :max="8"
          size="small"
          style="width: 100%"
        />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInputNumber, NSwitch } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  isBackgroundNone: boolean
}>()

const fontSize = defineModel<number>('fontSize', { required: true })
const lineHeight = defineModel<number>('lineHeight', { required: true })
const cardPadding = defineModel<number>('cardPadding', { required: true })
const framePadding = defineModel<number>('framePadding', { required: true })
const radius = defineModel<number>('radius', { required: true })
const shadow = defineModel<boolean>('shadow', { required: true })
const tabSize = defineModel<number>('tabSize', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "layoutTitle": "Layout",
    "fontSize": "Font size",
    "lineHeight": "Line height",
    "cardPadding": "Card padding",
    "framePadding": "Canvas padding",
    "radius": "Corner radius",
    "shadow": "Shadow",
    "tabSize": "Tab size"
  },
  "zh": {
    "layoutTitle": "布局",
    "fontSize": "字号",
    "lineHeight": "行高",
    "cardPadding": "卡片内边距",
    "framePadding": "画布边距",
    "radius": "圆角",
    "shadow": "阴影",
    "tabSize": "Tab 宽度"
  },
  "zh-CN": {
    "layoutTitle": "布局",
    "fontSize": "字号",
    "lineHeight": "行高",
    "cardPadding": "卡片内边距",
    "framePadding": "画布边距",
    "radius": "圆角",
    "shadow": "阴影",
    "tabSize": "Tab 宽度"
  },
  "zh-TW": {
    "layoutTitle": "版面",
    "fontSize": "字級",
    "lineHeight": "行高",
    "cardPadding": "卡片內距",
    "framePadding": "畫布邊距",
    "radius": "圓角",
    "shadow": "陰影",
    "tabSize": "Tab 寬度"
  },
  "zh-HK": {
    "layoutTitle": "版面",
    "fontSize": "字級",
    "lineHeight": "行高",
    "cardPadding": "卡片內距",
    "framePadding": "畫布邊距",
    "radius": "圓角",
    "shadow": "陰影",
    "tabSize": "Tab 寬度"
  },
  "es": {
    "layoutTitle": "Disposición",
    "fontSize": "Tamaño de fuente",
    "lineHeight": "Altura de línea",
    "cardPadding": "Relleno de tarjeta",
    "framePadding": "Relleno del lienzo",
    "radius": "Radio",
    "shadow": "Sombra",
    "tabSize": "Tamaño de tabulación"
  },
  "fr": {
    "layoutTitle": "Mise en page",
    "fontSize": "Taille de police",
    "lineHeight": "Hauteur de ligne",
    "cardPadding": "Marge interne",
    "framePadding": "Marge du canevas",
    "radius": "Rayon",
    "shadow": "Ombre",
    "tabSize": "Taille de tabulation"
  },
  "de": {
    "layoutTitle": "Layout",
    "fontSize": "Schriftgröße",
    "lineHeight": "Zeilenhöhe",
    "cardPadding": "Innenabstand",
    "framePadding": "Canvas-Abstand",
    "radius": "Radius",
    "shadow": "Schatten",
    "tabSize": "Tabulatorgröße"
  },
  "it": {
    "layoutTitle": "Layout",
    "fontSize": "Dimensione font",
    "lineHeight": "Interlinea",
    "cardPadding": "Padding scheda",
    "framePadding": "Padding canvas",
    "radius": "Raggio",
    "shadow": "Ombra",
    "tabSize": "Dimensione tab"
  },
  "ja": {
    "layoutTitle": "レイアウト",
    "fontSize": "フォントサイズ",
    "lineHeight": "行間",
    "cardPadding": "カード余白",
    "framePadding": "キャンバス余白",
    "radius": "角丸",
    "shadow": "影",
    "tabSize": "タブ幅"
  },
  "ko": {
    "layoutTitle": "레이아웃",
    "fontSize": "글꼴 크기",
    "lineHeight": "줄 간격",
    "cardPadding": "카드 여백",
    "framePadding": "캔버스 여백",
    "radius": "모서리 반경",
    "shadow": "그림자",
    "tabSize": "탭 크기"
  },
  "ru": {
    "layoutTitle": "Макет",
    "fontSize": "Размер шрифта",
    "lineHeight": "Высота строки",
    "cardPadding": "Внутренние поля",
    "framePadding": "Поля холста",
    "radius": "Радиус",
    "shadow": "Тень",
    "tabSize": "Размер табуляции"
  },
  "pt": {
    "layoutTitle": "Layout",
    "fontSize": "Tamanho da fonte",
    "lineHeight": "Altura da linha",
    "cardPadding": "Padding do cartão",
    "framePadding": "Padding do canvas",
    "radius": "Raio",
    "shadow": "Sombra",
    "tabSize": "Tamanho da tabulação"
  },
  "ar": {
    "layoutTitle": "التخطيط",
    "fontSize": "حجم الخط",
    "lineHeight": "ارتفاع السطر",
    "cardPadding": "حشو البطاقة",
    "framePadding": "حشو اللوحة",
    "radius": "نصف القطر",
    "shadow": "الظل",
    "tabSize": "حجم التبويب"
  },
  "hi": {
    "layoutTitle": "लेआउट",
    "fontSize": "फ़ॉन्ट आकार",
    "lineHeight": "लाइन ऊंचाई",
    "cardPadding": "कार्ड पैडिंग",
    "framePadding": "कैनवास पैडिंग",
    "radius": "रेडियस",
    "shadow": "छाया",
    "tabSize": "टैब आकार"
  },
  "tr": {
    "layoutTitle": "Düzen",
    "fontSize": "Yazı tipi boyutu",
    "lineHeight": "Satır yüksekliği",
    "cardPadding": "Kart dolgusu",
    "framePadding": "Tuval dolgusu",
    "radius": "Yarıçap",
    "shadow": "Gölge",
    "tabSize": "Sekme boyutu"
  },
  "nl": {
    "layoutTitle": "Lay-out",
    "fontSize": "Lettergrootte",
    "lineHeight": "Regelhoogte",
    "cardPadding": "Kaartopvulling",
    "framePadding": "Canvas-opvulling",
    "radius": "Radius",
    "shadow": "Schaduw",
    "tabSize": "Tabgrootte"
  },
  "sv": {
    "layoutTitle": "Layout",
    "fontSize": "Teckenstorlek",
    "lineHeight": "Radhöjd",
    "cardPadding": "Kortmarginal",
    "framePadding": "Canvas-marginal",
    "radius": "Radie",
    "shadow": "Skugga",
    "tabSize": "Tabbstorlek"
  },
  "pl": {
    "layoutTitle": "Układ",
    "fontSize": "Rozmiar czcionki",
    "lineHeight": "Wysokość wiersza",
    "cardPadding": "Wypełnienie karty",
    "framePadding": "Wypełnienie płótna",
    "radius": "Promień",
    "shadow": "Cień",
    "tabSize": "Rozmiar tabulatora"
  },
  "vi": {
    "layoutTitle": "Bố cục",
    "fontSize": "Cỡ chữ",
    "lineHeight": "Chiều cao dòng",
    "cardPadding": "Lề trong thẻ",
    "framePadding": "Lề canvas",
    "radius": "Bo góc",
    "shadow": "Bóng",
    "tabSize": "Cỡ tab"
  },
  "th": {
    "layoutTitle": "เลย์เอาต์",
    "fontSize": "ขนาดตัวอักษร",
    "lineHeight": "ความสูงบรรทัด",
    "cardPadding": "ระยะขอบการ์ด",
    "framePadding": "ระยะขอบผ้าใบ",
    "radius": "รัศมี",
    "shadow": "เงา",
    "tabSize": "ขนาดแท็บ"
  },
  "id": {
    "layoutTitle": "Tata letak",
    "fontSize": "Ukuran font",
    "lineHeight": "Tinggi baris",
    "cardPadding": "Padding kartu",
    "framePadding": "Padding kanvas",
    "radius": "Radius",
    "shadow": "Bayangan",
    "tabSize": "Ukuran tab"
  },
  "he": {
    "layoutTitle": "פריסה",
    "fontSize": "גודל גופן",
    "lineHeight": "גובה שורה",
    "cardPadding": "ריפוד כרטיס",
    "framePadding": "ריפוד קנבס",
    "radius": "רדיוס",
    "shadow": "צל",
    "tabSize": "גודל טאב"
  },
  "ms": {
    "layoutTitle": "Susun atur",
    "fontSize": "Saiz fon",
    "lineHeight": "Ketinggian baris",
    "cardPadding": "Padding kad",
    "framePadding": "Padding kanvas",
    "radius": "Jejari",
    "shadow": "Bayang",
    "tabSize": "Saiz tab"
  },
  "no": {
    "layoutTitle": "Oppsett",
    "fontSize": "Skriftstørrelse",
    "lineHeight": "Linjehøyde",
    "cardPadding": "Kortpadding",
    "framePadding": "Canvas-padding",
    "radius": "Radius",
    "shadow": "Skygge",
    "tabSize": "Tabbstørrelse"
  }
}
</i18n>
