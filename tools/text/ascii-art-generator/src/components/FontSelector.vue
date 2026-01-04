<template>
  <ToolSectionHeader>{{ t('font') }}</ToolSectionHeader>
  <ToolSection>
    <NSelect
      :value="modelValue"
      :options="fontOptions"
      size="large"
      @update:value="$emit('update:modelValue', $event)"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NSelect } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { fontNames } from '../utils/fonts'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()

const fontOptions = computed(() => fontNames.map((f) => ({ label: f, value: f })))
</script>

<i18n lang="json">
{
  "en": { "font": "Font" },
  "zh": { "font": "字体" },
  "zh-CN": { "font": "字体" },
  "zh-TW": { "font": "字型" },
  "zh-HK": { "font": "字型" },
  "es": { "font": "Fuente" },
  "fr": { "font": "Police" },
  "de": { "font": "Schriftart" },
  "it": { "font": "Font" },
  "ja": { "font": "フォント" },
  "ko": { "font": "글꼴" },
  "ru": { "font": "Шрифт" },
  "pt": { "font": "Fonte" },
  "ar": { "font": "الخط" },
  "hi": { "font": "फ़ॉन्ट" },
  "tr": { "font": "Yazi Tipi" },
  "nl": { "font": "Lettertype" },
  "sv": { "font": "Typsnitt" },
  "pl": { "font": "Czcionka" },
  "vi": { "font": "Phong Chu" },
  "th": { "font": "แบบอักษร" },
  "id": { "font": "Font" },
  "he": { "font": "גופן" },
  "ms": { "font": "Fon" },
  "no": { "font": "Skrifttype" }
}
</i18n>
