<template>
  <ColorSection label="LAB">
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
  const [l, a, bVal] = convert.rgb.lab(r, g, b)
  return `lab(${l.toFixed(1)}, ${a.toFixed(1)}, ${bVal.toFixed(1)})`
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

function parse(str: string): { l: number; a: number; b: number } | null {
  const match = str.match(/lab\(([\d.]+),?\s*([-\d.]+),?\s*([-\d.]+)\)/)
  if (match && match[1] && match[2] && match[3]) {
    const l = parseFloat(match[1])
    const a = parseFloat(match[2])
    const b = parseFloat(match[3])
    if (l >= 0 && l <= 100) {
      return { l, a, b }
    }
  }
  return null
}

function handleBlur() {
  const parsed = parse(localValue.value)
  if (parsed) {
    const [r, g, b] = convert.lab.rgb(parsed.l, parsed.a, parsed.b)
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
  "en": { "info": "CIE LAB - perceptually uniform color space, no alpha support" },
  "zh": { "info": "CIE LAB - 感知均匀色彩空间，不支持透明度" },
  "zh-CN": { "info": "CIE LAB - 感知均匀色彩空间，不支持透明度" },
  "zh-TW": { "info": "CIE LAB - 感知均勻色彩空間，不支援透明度" },
  "zh-HK": { "info": "CIE LAB - 感知均勻色彩空間，不支援透明度" },
  "es": { "info": "CIE LAB - espacio de color perceptualmente uniforme, sin alfa" },
  "fr": { "info": "CIE LAB - espace colorimétrique perceptuellement uniforme, sans alpha" },
  "de": { "info": "CIE LAB - wahrnehmungsgleichmäßiger Farbraum, ohne Alpha" },
  "it": { "info": "CIE LAB - spazio colore percettivamente uniforme, senza alfa" },
  "ja": { "info": "CIE LAB - 知覚的に均一な色空間、アルファ非対応" },
  "ko": { "info": "CIE LAB - 지각적으로 균일한 색 공간, 알파 미지원" },
  "ru": { "info": "CIE LAB - перцептивно однородное цветовое пространство, без альфа" },
  "pt": { "info": "CIE LAB - espaço de cor perceptualmente uniforme, sem alfa" },
  "ar": { "info": "CIE LAB - فضاء لوني موحد إدراكياً، بدون ألفا" },
  "hi": { "info": "CIE LAB - अवधारणात्मक रूप से एकसमान रंग स्थान, अल्फा नहीं" },
  "tr": { "info": "CIE LAB - algısal olarak tek tip renk alanı, alfa yok" },
  "nl": { "info": "CIE LAB - perceptueel uniforme kleurruimte, geen alfa" },
  "sv": { "info": "CIE LAB - perceptuellt enhetlig färgrymd, ingen alfa" },
  "pl": { "info": "CIE LAB - percepcyjnie jednolita przestrzeń kolorów, bez alfa" },
  "vi": { "info": "CIE LAB - không gian màu đồng nhất tri giác, không alpha" },
  "th": { "info": "CIE LAB - พื้นที่สีสม่ำเสมอทางการรับรู้ ไม่มีอัลฟา" },
  "id": { "info": "CIE LAB - ruang warna seragam perseptual, tanpa alfa" },
  "he": { "info": "CIE LAB - מרחב צבע אחיד תפיסתית, ללא אלפא" },
  "ms": { "info": "CIE LAB - ruang warna seragam persepsi, tiada alfa" },
  "no": { "info": "CIE LAB - perseptuelt ensartet fargerom, ingen alfa" }
}
</i18n>
