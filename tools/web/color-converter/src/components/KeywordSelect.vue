<template>
  <ColorSection label="CSS Keyword">
    <template #label-suffix>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon :component="Info16Regular" style="cursor: help" />
        </template>
        {{ t('info') }}
      </n-tooltip>
    </template>
    <template #action>
      <CopyToClipboardButton :content="displayValue" size="small" />
    </template>
    <n-select
      :value="displayValue"
      :options="keywordOptions"
      filterable
      :render-label="renderKeywordLabel"
      @update:value="handleUpdate"
    />
  </ColorSection>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NSelect, NTooltip, NIcon } from 'naive-ui'
import type { SelectOption, SelectRenderLabel } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import Info16Regular from '@vicons/fluent/Info16Regular'
import convert from 'color-convert'
import colorNames from 'color-name'
import type { RGBA } from '../types'
import ColorSection from './ColorSection.vue'

const props = defineProps<{
  rgba: RGBA
}>()

const emit = defineEmits<{
  'update:rgba': [value: RGBA]
}>()

const { t } = useI18n()

const displayValue = computed(() => {
  const { r, g, b } = props.rgba
  return convert.rgb.keyword(r, g, b)
})

function handleUpdate(keyword: string) {
  const rgb = colorNames[keyword as keyof typeof colorNames]
  if (rgb) {
    emit('update:rgba', { r: rgb[0], g: rgb[1], b: rgb[2], a: props.rgba.a })
  }
}

// Generate keyword options from color-name
const keywordOptions: SelectOption[] = Object.keys(colorNames).map((name) => ({
  label: name,
  value: name,
}))

// Render label with color swatch
const renderKeywordLabel: SelectRenderLabel = (option) => {
  const name = option.value as string
  const rgb = colorNames[name as keyof typeof colorNames]
  const bgColor = rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : 'transparent'
  return h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
    h('div', {
      style: {
        width: '16px',
        height: '16px',
        borderRadius: '2px',
        backgroundColor: bgColor,
        border: '1px solid var(--n-border-color)',
        flexShrink: 0,
      },
    }),
    h('span', {}, name),
  ])
}
</script>

<i18n lang="json">
{
  "en": { "info": "CSS named colors like red, blue, coral - 140+ predefined colors, no alpha" },
  "zh": { "info": "CSS 命名颜色如 red、blue、coral - 140+ 预定义颜色，不支持透明度" },
  "zh-CN": { "info": "CSS 命名颜色如 red、blue、coral - 140+ 预定义颜色，不支持透明度" },
  "zh-TW": { "info": "CSS 命名顏色如 red、blue、coral - 140+ 預定義顏色，不支援透明度" },
  "zh-HK": { "info": "CSS 命名顏色如 red、blue、coral - 140+ 預定義顏色，不支援透明度" },
  "es": {
    "info": "Colores CSS nombrados como red, blue, coral - 140+ colores predefinidos, sin alfa"
  },
  "fr": {
    "info": "Couleurs CSS nommées comme red, blue, coral - 140+ couleurs prédéfinies, sans alpha"
  },
  "de": { "info": "CSS-Farbnamen wie red, blue, coral - 140+ vordefinierte Farben, ohne Alpha" },
  "it": {
    "info": "Colori CSS nominati come red, blue, coral - 140+ colori predefiniti, senza alfa"
  },
  "ja": {
    "info": "red、blue、coral などの CSS カラーネーム - 140以上の定義済み色、アルファ非対応"
  },
  "ko": { "info": "red, blue, coral 같은 CSS 색상 이름 - 140개 이상 사전 정의 색상, 알파 미지원" },
  "ru": {
    "info": "Именованные CSS-цвета как red, blue, coral - 140+ предопределённых цветов, без альфа"
  },
  "pt": { "info": "Cores CSS nomeadas como red, blue, coral - 140+ cores predefinidas, sem alfa" },
  "ar": {
    "info": "ألوان CSS المسماة مثل red، blue، coral - أكثر من 140 لون محدد مسبقاً، بدون ألفا"
  },
  "hi": { "info": "CSS नामित रंग जैसे red, blue, coral - 140+ पूर्वनिर्धारित रंग, अल्फा नहीं" },
  "tr": { "info": "red, blue, coral gibi CSS renk adları - 140+ önceden tanımlı renk, alfa yok" },
  "nl": {
    "info": "CSS-kleurnamen zoals red, blue, coral - 140+ voorgedefinieerde kleuren, geen alfa"
  },
  "sv": { "info": "CSS-färgnamn som red, blue, coral - 140+ fördefinierade färger, ingen alfa" },
  "pl": {
    "info": "Nazwy kolorów CSS jak red, blue, coral - 140+ predefiniowanych kolorów, bez alfa"
  },
  "vi": { "info": "Tên màu CSS như red, blue, coral - 140+ màu định sẵn, không alpha" },
  "th": { "info": "ชื่อสี CSS เช่น red, blue, coral - 140+ สีที่กำหนดไว้ ไม่มีอัลฟา" },
  "id": { "info": "Nama warna CSS seperti red, blue, coral - 140+ warna terdefinisi, tanpa alfa" },
  "he": { "info": "שמות צבעי CSS כמו red, blue, coral - יותר מ-140 צבעים מוגדרים, ללא אלפא" },
  "ms": { "info": "Nama warna CSS seperti red, blue, coral - 140+ warna pratakrif, tiada alfa" },
  "no": { "info": "CSS-fargenavn som red, blue, coral - 140+ forhåndsdefinerte farger, ingen alfa" }
}
</i18n>
