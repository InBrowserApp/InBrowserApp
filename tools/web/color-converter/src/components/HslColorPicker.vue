<template>
  <ColorSection label="HSL">
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
    <n-color-picker
      :value="displayValue"
      :modes="['hsl']"
      :show-alpha="showAlpha"
      :show-preview="false"
      @update:value="handleUpdate"
    />
  </ColorSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NColorPicker, NTooltip, NIcon } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import Info16Regular from '@vicons/fluent/Info16Regular'
import convert from 'color-convert'
import type { RGBA } from '../types'
import ColorSection from './ColorSection.vue'

const props = defineProps<{
  showAlpha: boolean
}>()

const rgba = defineModel<RGBA>('rgba', { required: true })

const { t } = useI18n()

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

const displayValue = computed(() => {
  const { r, g, b, a } = rgba.value
  const [h, s, l] = convert.rgb.hsl(r, g, b)
  if (props.showAlpha) {
    return `hsla(${h}, ${s}%, ${l}%, ${round2(a)})`
  }
  return `hsl(${h}, ${s}%, ${l}%)`
})

function handleUpdate(val: string) {
  const match = val.match(/hsla?\((\d+),\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/)
  if (match && match[1] && match[2] && match[3]) {
    const h = parseInt(match[1])
    const s = parseInt(match[2])
    const l = parseInt(match[3])
    const a = match[4] ? parseFloat(match[4]) : 1
    const [r, g, b] = convert.hsl.rgb(h, s, l)
    rgba.value = { r, g, b, a }
  }
}
</script>

<i18n lang="json">
{
  "en": { "info": "Hue, Saturation, Lightness - intuitive color adjustments" },
  "zh": { "info": "色相、饱和度、亮度 - 更直观的颜色调整" },
  "zh-CN": { "info": "色相、饱和度、亮度 - 更直观的颜色调整" },
  "zh-TW": { "info": "色相、飽和度、亮度 - 更直觀的顏色調整" },
  "zh-HK": { "info": "色相、飽和度、亮度 - 更直觀的顏色調整" },
  "es": { "info": "Tono, Saturación, Luminosidad - ajustes de color intuitivos" },
  "fr": { "info": "Teinte, Saturation, Luminosité - ajustements de couleur intuitifs" },
  "de": { "info": "Farbton, Sättigung, Helligkeit - intuitive Farbanpassungen" },
  "it": { "info": "Tonalità, Saturazione, Luminosità - regolazioni colore intuitive" },
  "ja": { "info": "色相、彩度、明度 - 直感的な色調整" },
  "ko": { "info": "색상, 채도, 명도 - 직관적인 색상 조정" },
  "ru": { "info": "Оттенок, Насыщенность, Светлота - интуитивная настройка цвета" },
  "pt": { "info": "Matiz, Saturação, Luminosidade - ajustes de cor intuitivos" },
  "ar": { "info": "درجة اللون، التشبع، الإضاءة - تعديلات لون بديهية" },
  "hi": { "info": "ह्यू, सैचुरेशन, लाइटनेस - सहज रंग समायोजन" },
  "tr": { "info": "Ton, Doygunluk, Açıklık - sezgisel renk ayarları" },
  "nl": { "info": "Tint, Verzadiging, Lichtheid - intuïtieve kleuraanpassingen" },
  "sv": { "info": "Nyans, Mättnad, Ljushet - intuitiva färgjusteringar" },
  "pl": { "info": "Barwa, Nasycenie, Jasność - intuicyjne dostosowanie kolorów" },
  "vi": { "info": "Sắc độ, Độ bão hòa, Độ sáng - điều chỉnh màu trực quan" },
  "th": { "info": "เฉดสี ความอิ่มตัว ความสว่าง - ปรับสีได้ง่าย" },
  "id": { "info": "Hue, Saturasi, Kecerahan - penyesuaian warna intuitif" },
  "he": { "info": "גוון, רוויה, בהירות - התאמות צבע אינטואיטיביות" },
  "ms": { "info": "Hue, Ketepuan, Kecerahan - pelarasan warna intuitif" },
  "no": { "info": "Fargetone, Metning, Lyshet - intuitive fargejusteringer" }
}
</i18n>
