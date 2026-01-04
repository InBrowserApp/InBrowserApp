<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex align="center">
      <n-input
        :value="modelValue"
        :placeholder="t('placeholder')"
        size="large"
        style="max-width: 200px"
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
    "title": "Numeric Permission",
    "placeholder": "e.g., 755"
  },
  "zh": {
    "title": "数字权限",
    "placeholder": "例如 755"
  },
  "zh-CN": {
    "title": "数字权限",
    "placeholder": "例如 755"
  },
  "zh-TW": {
    "title": "數字權限",
    "placeholder": "例如 755"
  },
  "zh-HK": {
    "title": "數字權限",
    "placeholder": "例如 755"
  },
  "es": {
    "title": "Permiso numérico",
    "placeholder": "ej., 755"
  },
  "fr": {
    "title": "Permission numérique",
    "placeholder": "ex., 755"
  },
  "de": {
    "title": "Numerische Berechtigung",
    "placeholder": "z.B. 755"
  },
  "it": {
    "title": "Permesso numerico",
    "placeholder": "es., 755"
  },
  "ja": {
    "title": "数値パーミッション",
    "placeholder": "例: 755"
  },
  "ko": {
    "title": "숫자 권한",
    "placeholder": "예: 755"
  },
  "ru": {
    "title": "Числовое разрешение",
    "placeholder": "напр., 755"
  },
  "pt": {
    "title": "Permissão numérica",
    "placeholder": "ex., 755"
  },
  "ar": {
    "title": "الإذن الرقمي",
    "placeholder": "مثال: 755"
  },
  "hi": {
    "title": "संख्यात्मक अनुमति",
    "placeholder": "उदा., 755"
  },
  "tr": {
    "title": "Sayısal İzin",
    "placeholder": "örn., 755"
  },
  "nl": {
    "title": "Numerieke machtiging",
    "placeholder": "bijv. 755"
  },
  "sv": {
    "title": "Numerisk behörighet",
    "placeholder": "t.ex. 755"
  },
  "pl": {
    "title": "Uprawnienie numeryczne",
    "placeholder": "np. 755"
  },
  "vi": {
    "title": "Quyền dạng số",
    "placeholder": "ví dụ: 755"
  },
  "th": {
    "title": "สิทธิ์แบบตัวเลข",
    "placeholder": "เช่น 755"
  },
  "id": {
    "title": "Izin Numerik",
    "placeholder": "mis., 755"
  },
  "he": {
    "title": "הרשאה מספרית",
    "placeholder": "לדוגמה, 755"
  },
  "ms": {
    "title": "Kebenaran Numerik",
    "placeholder": "cth., 755"
  },
  "no": {
    "title": "Numerisk tillatelse",
    "placeholder": "f.eks. 755"
  }
}
</i18n>
