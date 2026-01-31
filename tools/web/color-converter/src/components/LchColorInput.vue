<template>
  <ColorSection label="LCH">
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
    <n-input
      v-model:value="localValue"
      :status="isValid ? undefined : 'error'"
      @blur="handleBlur"
      @keydown.enter="handleEnter"
    />
  </ColorSection>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NInput, NTooltip, NIcon } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import Info16Regular from '@vicons/fluent/Info16Regular'
import convert from 'color-convert'
import type { RGBA } from '../types'
import ColorSection from './ColorSection.vue'

const rgbaModel = defineModel<RGBA>('rgba', { required: true })

const { t } = useI18n()

const displayValue = computed(() => {
  const { r, g, b } = rgbaModel.value
  const [l, c, h] = convert.rgb.lch(r, g, b)
  return `lch(${l.toFixed(1)}, ${c.toFixed(1)}, ${h.toFixed(1)})`
})

const localValue = ref(displayValue.value)
const isValid = ref(true)

watch(displayValue, (newVal) => {
  localValue.value = newVal
  isValid.value = true
})

watch(localValue, (newVal) => {
  isValid.value = validate(newVal)
})

function validate(str: string): boolean {
  return parse(str) !== null
}

function parse(str: string): { l: number; c: number; h: number } | null {
  const match = str.match(/lch\(([\d.]+),?\s*([\d.]+),?\s*([\d.]+)\)/)
  if (match && match[1] && match[2] && match[3]) {
    const l = parseFloat(match[1])
    const c = parseFloat(match[2])
    const h = parseFloat(match[3])
    if (l >= 0 && l <= 100 && c >= 0 && h >= 0 && h <= 360) {
      return { l, c, h }
    }
  }
  return null
}

function handleBlur() {
  const parsed = parse(localValue.value)
  if (parsed) {
    const [r, g, b] = convert.lch.rgb(parsed.l, parsed.c, parsed.h)
    rgbaModel.value = { r, g, b, a: rgbaModel.value.a }
  } else {
    localValue.value = displayValue.value
    isValid.value = true
  }
}

function handleEnter(e: KeyboardEvent) {
  ;(e.target as HTMLInputElement).blur()
}
</script>

<i18n lang="json">
{
  "en": { "info": "Lightness, Chroma, Hue - cylindrical LAB, easier hue adjustments, no alpha" },
  "zh": { "info": "明度、色度、色相 - LAB 的圆柱坐标形式，更易调整色相，不支持透明度" },
  "zh-CN": { "info": "明度、色度、色相 - LAB 的圆柱坐标形式，更易调整色相，不支持透明度" },
  "zh-TW": { "info": "明度、色度、色相 - LAB 的圓柱坐標形式，更易調整色相，不支援透明度" },
  "zh-HK": { "info": "明度、色度、色相 - LAB 的圓柱坐標形式，更易調整色相，不支援透明度" },
  "es": { "info": "Luminosidad, Croma, Tono - LAB cilíndrico, ajuste de tono más fácil, sin alfa" },
  "fr": {
    "info": "Luminosité, Chroma, Teinte - LAB cylindrique, ajustement de teinte plus facile, sans alpha"
  },
  "de": {
    "info": "Helligkeit, Chroma, Farbton - zylindrisches LAB, einfachere Farbtöne, ohne Alpha"
  },
  "it": {
    "info": "Luminosità, Croma, Tonalità - LAB cilindrico, regolazione tonalità più facile, senza alfa"
  },
  "ja": { "info": "明度、彩度、色相 - 円柱座標LAB、色相調整が容易、アルファ非対応" },
  "ko": { "info": "명도, 채도, 색상 - 원통형 LAB, 색상 조정 용이, 알파 미지원" },
  "ru": {
    "info": "Светлота, Цветность, Оттенок - цилиндрический LAB, легче настраивать оттенок, без альфа"
  },
  "pt": {
    "info": "Luminosidade, Croma, Matiz - LAB cilíndrico, ajuste de matiz mais fácil, sem alfa"
  },
  "ar": { "info": "الإضاءة، الكروما، درجة اللون - LAB أسطواني، تعديل درجة لون أسهل، بدون ألفا" },
  "hi": { "info": "लाइटनेस, क्रोमा, ह्यू - बेलनाकार LAB, ह्यू समायोजन आसान, अल्फा नहीं" },
  "tr": { "info": "Parlaklık, Kroma, Ton - silindirik LAB, kolay ton ayarı, alfa yok" },
  "nl": {
    "info": "Lichtheid, Chroma, Tint - cilindrisch LAB, makkelijkere tintaanpassing, geen alfa"
  },
  "sv": { "info": "Ljushet, Kroma, Nyans - cylindrisk LAB, enklare nyansjustering, ingen alfa" },
  "pl": {
    "info": "Jasność, Chroma, Barwa - cylindryczny LAB, łatwiejsze dostosowanie barwy, bez alfa"
  },
  "vi": { "info": "Độ sáng, Sắc độ, Sắc - LAB hình trụ, điều chỉnh sắc dễ hơn, không alpha" },
  "th": { "info": "ความสว่าง โครมา เฉดสี - LAB ทรงกระบอก ปรับเฉดสีง่ายขึ้น ไม่มีอัลฟา" },
  "id": { "info": "Kecerahan, Kroma, Hue - LAB silinder, penyesuaian hue lebih mudah, tanpa alfa" },
  "he": { "info": "בהירות, כרומה, גוון - LAB גלילי, התאמת גוון קלה יותר, ללא אלפא" },
  "ms": { "info": "Kecerahan, Kroma, Hue - LAB silinder, pelarasan hue lebih mudah, tiada alfa" },
  "no": {
    "info": "Lyshet, Kroma, Fargetone - sylindrisk LAB, enklere fargetonejustering, ingen alfa"
  }
}
</i18n>
