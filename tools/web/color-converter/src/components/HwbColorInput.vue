<template>
  <ColorSection label="HWB">
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
import { Info16Regular } from '@shared/icons/fluent'
import convert from 'color-convert'
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
  const [h, w, bk] = convert.rgb.hwb(r, g, b)
  return `hwb(${h}, ${w}%, ${bk}%)`
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

function parse(str: string): { h: number; w: number; b: number } | null {
  const match = str.match(/hwb\((\d+),?\s*(\d+)%?,?\s*(\d+)%?\)/)
  if (match && match[1] && match[2] && match[3]) {
    const h = parseInt(match[1])
    const w = parseInt(match[2])
    const b = parseInt(match[3])
    if (h >= 0 && h <= 360 && w >= 0 && w <= 100 && b >= 0 && b <= 100) {
      return { h, w, b }
    }
  }
  return null
}

function handleBlur() {
  const parsed = parse(localValue.value)
  if (parsed) {
    const [r, g, b] = convert.hwb.rgb(parsed.h, parsed.w, parsed.b)
    emit('update:rgba', { r, g, b, a: props.rgba.a })
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
  "en": { "info": "Hue, Whiteness, Blackness - CSS4 color format, no alpha support" },
  "zh": { "info": "色相、白度、黑度 - CSS4 颜色格式，不支持透明度" },
  "zh-CN": { "info": "色相、白度、黑度 - CSS4 颜色格式，不支持透明度" },
  "zh-TW": { "info": "色相、白度、黑度 - CSS4 顏色格式，不支援透明度" },
  "zh-HK": { "info": "色相、白度、黑度 - CSS4 顏色格式，不支援透明度" },
  "es": { "info": "Tono, Blancura, Negrura - formato CSS4, sin soporte alfa" },
  "fr": { "info": "Teinte, Blancheur, Noirceur - format CSS4, sans alpha" },
  "de": { "info": "Farbton, Weißanteil, Schwarzanteil - CSS4-Format, ohne Alpha" },
  "it": { "info": "Tonalità, Bianchezza, Nerezza - formato CSS4, senza alfa" },
  "ja": { "info": "色相、白さ、黒さ - CSS4形式、アルファ非対応" },
  "ko": { "info": "색상, 백색도, 흑색도 - CSS4 형식, 알파 미지원" },
  "ru": { "info": "Оттенок, Белизна, Чернота - формат CSS4, без альфа" },
  "pt": { "info": "Matiz, Brancura, Escuridão - formato CSS4, sem alfa" },
  "ar": { "info": "درجة اللون، البياض، السواد - تنسيق CSS4، بدون ألفا" },
  "hi": { "info": "ह्यू, व्हाइटनेस, ब्लैकनेस - CSS4 प्रारूप, अल्फा नहीं" },
  "tr": { "info": "Ton, Beyazlık, Siyahlık - CSS4 formatı, alfa yok" },
  "nl": { "info": "Tint, Witheid, Zwartheid - CSS4-formaat, geen alfa" },
  "sv": { "info": "Nyans, Vithet, Svärta - CSS4-format, ingen alfa" },
  "pl": { "info": "Barwa, Białość, Czarność - format CSS4, bez alfa" },
  "vi": { "info": "Sắc độ, Độ trắng, Độ đen - định dạng CSS4, không alpha" },
  "th": { "info": "เฉดสี ความขาว ความดำ - รูปแบบ CSS4 ไม่มีอัลฟา" },
  "id": { "info": "Hue, Putih, Hitam - format CSS4, tanpa alfa" },
  "he": { "info": "גוון, לובן, שחרות - פורמט CSS4, ללא אלפא" },
  "ms": { "info": "Hue, Keputihan, Kehitaman - format CSS4, tiada alfa" },
  "no": { "info": "Fargetone, Hvithet, Svarthet - CSS4-format, ingen alfa" }
}
</i18n>
