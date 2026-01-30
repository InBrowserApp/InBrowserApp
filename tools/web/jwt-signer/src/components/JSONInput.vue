<template>
  <n-form-item
    label="JSON"
    :feedback="error ? t('invalid-json') : undefined"
    :validation-status="error ? 'error' : undefined"
  >
    <n-input v-model:value="value" :placeholder="placeholder" type="textarea" />
  </n-form-item>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NInput, NFormItem } from 'naive-ui'
import { useI18n } from 'vue-i18n'

defineProps<{
  placeholder?: string
}>()

const modelValue = defineModel<string>('value', { required: true })

const { t } = useI18n()

const error = ref<boolean>(false)

const value = ref(modelValue.value)

watch(value, (v) => {
  try {
    JSON.parse(v)
    error.value = false
    modelValue.value = v
  } catch {
    error.value = true
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "invalid-json": "Invalid JSON"
  },
  "zh": {
    "invalid-json": "无效的 JSON"
  },
  "zh-CN": {
    "invalid-json": "无效的 JSON"
  },
  "zh-TW": {
    "invalid-json": "無效的 JSON"
  },
  "zh-HK": {
    "invalid-json": "無效的 JSON"
  },
  "es": {
    "invalid-json": "JSON no válido"
  },
  "fr": {
    "invalid-json": "JSON invalide"
  },
  "de": {
    "invalid-json": "Ungültiges JSON"
  },
  "it": {
    "invalid-json": "JSON non valido"
  },
  "ja": {
    "invalid-json": "無効なJSON"
  },
  "ko": {
    "invalid-json": "잘못된 JSON"
  },
  "ru": {
    "invalid-json": "Недопустимый JSON"
  },
  "pt": {
    "invalid-json": "JSON inválido"
  },
  "ar": {
    "invalid-json": "JSON غير صالح"
  },
  "hi": {
    "invalid-json": "अमान्य JSON"
  },
  "tr": {
    "invalid-json": "Geçersiz JSON"
  },
  "nl": {
    "invalid-json": "Ongeldige JSON"
  },
  "sv": {
    "invalid-json": "Ogiltig JSON"
  },
  "pl": {
    "invalid-json": "Nieprawidłowy JSON"
  },
  "vi": {
    "invalid-json": "JSON không hợp lệ"
  },
  "th": {
    "invalid-json": "JSON ไม่ถูกต้อง"
  },
  "id": {
    "invalid-json": "JSON tidak valid"
  },
  "he": {
    "invalid-json": "JSON לא חוקי"
  },
  "ms": {
    "invalid-json": "JSON tidak sah"
  },
  "no": {
    "invalid-json": "Ugyldig JSON"
  }
}
</i18n>
