<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex align="center">
      <n-input
        :value="modelValue"
        :placeholder="t('placeholder')"
        size="large"
        style="max-width: 200px; font-family: monospace"
        :status="isValid ? undefined : 'error'"
        @update:value="$emit('update:modelValue', $event)"
      />
      <CopyToClipboardButton :content="modelValue" />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NInput, NFlex } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  modelValue: string
  isValid: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "Symbolic Permission",
    "placeholder": "e.g., rwxr-xr-x"
  },
  "zh": {
    "title": "符号权限",
    "placeholder": "例如 rwxr-xr-x"
  },
  "zh-CN": {
    "title": "符号权限",
    "placeholder": "例如 rwxr-xr-x"
  },
  "zh-TW": {
    "title": "符號權限",
    "placeholder": "例如 rwxr-xr-x"
  },
  "zh-HK": {
    "title": "符號權限",
    "placeholder": "例如 rwxr-xr-x"
  },
  "es": {
    "title": "Permiso simbólico",
    "placeholder": "ej., rwxr-xr-x"
  },
  "fr": {
    "title": "Permission symbolique",
    "placeholder": "ex., rwxr-xr-x"
  },
  "de": {
    "title": "Symbolische Berechtigung",
    "placeholder": "z.B. rwxr-xr-x"
  },
  "it": {
    "title": "Permesso simbolico",
    "placeholder": "es., rwxr-xr-x"
  },
  "ja": {
    "title": "シンボリックパーミッション",
    "placeholder": "例: rwxr-xr-x"
  },
  "ko": {
    "title": "기호 권한",
    "placeholder": "예: rwxr-xr-x"
  },
  "ru": {
    "title": "Символьное разрешение",
    "placeholder": "напр., rwxr-xr-x"
  },
  "pt": {
    "title": "Permissão simbólica",
    "placeholder": "ex., rwxr-xr-x"
  },
  "ar": {
    "title": "الإذن الرمزي",
    "placeholder": "مثال: rwxr-xr-x"
  },
  "hi": {
    "title": "प्रतीकात्मक अनुमति",
    "placeholder": "उदा., rwxr-xr-x"
  },
  "tr": {
    "title": "Sembolik İzin",
    "placeholder": "örn., rwxr-xr-x"
  },
  "nl": {
    "title": "Symbolische machtiging",
    "placeholder": "bijv. rwxr-xr-x"
  },
  "sv": {
    "title": "Symbolisk behörighet",
    "placeholder": "t.ex. rwxr-xr-x"
  },
  "pl": {
    "title": "Uprawnienie symboliczne",
    "placeholder": "np. rwxr-xr-x"
  },
  "vi": {
    "title": "Quyền dạng ký hiệu",
    "placeholder": "ví dụ: rwxr-xr-x"
  },
  "th": {
    "title": "สิทธิ์แบบสัญลักษณ์",
    "placeholder": "เช่น rwxr-xr-x"
  },
  "id": {
    "title": "Izin Simbolik",
    "placeholder": "mis., rwxr-xr-x"
  },
  "he": {
    "title": "הרשאה סימבולית",
    "placeholder": "לדוגמה, rwxr-xr-x"
  },
  "ms": {
    "title": "Kebenaran Simbolik",
    "placeholder": "cth., rwxr-xr-x"
  },
  "no": {
    "title": "Symbolsk tillatelse",
    "placeholder": "f.eks. rwxr-xr-x"
  }
}
</i18n>
