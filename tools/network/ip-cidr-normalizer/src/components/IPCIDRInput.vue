<template>
  <n-form-item :label="t('label')" :rule="rule" :show-label="false">
    <n-input v-model:value="ipcidr" :placeholder="t('placeholder')" />
  </n-form-item>
</template>

<script setup lang="ts">
import { NInput, NFormItem, type FormItemRule } from 'naive-ui'
import isCidr from 'is-cidr'
import { isIP } from 'is-ip'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  'update:ipcidr': [string]
}>()
const { t } = useI18n()
const ipcidr = ref('')
const rule: FormItemRule = {
  trigger: ['input', 'change', 'blur'],
  validator() {
    if (isCidr(ipcidr.value) === 0 && !isIP(ipcidr.value)) {
      return new Error(t('error.invalid'))
    }
  },
}

watch(ipcidr, (value: string) => {
  if (isCidr(value) !== 0 || isIP(value)) {
    emit('update:ipcidr', value)
  } else {
    emit('update:ipcidr', '')
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "label": "IP/CIDR",
    "placeholder": "Input IP/CIDR",
    "error.invalid": "Invalid IP/CIDR"
  },
  "zh": {
    "label": "IP/CIDR",
    "placeholder": "输入 IP/CIDR",
    "error.invalid": "无效的 IP/CIDR"
  },
  "zh-CN": {
    "label": "IP/CIDR",
    "placeholder": "输入 IP/CIDR",
    "error.invalid": "无效的 IP/CIDR"
  },
  "zh-TW": {
    "label": "IP/CIDR",
    "placeholder": "輸入 IP/CIDR",
    "error.invalid": "無效的 IP/CIDR"
  },
  "zh-HK": {
    "label": "IP/CIDR",
    "placeholder": "輸入 IP/CIDR",
    "error.invalid": "無效的 IP/CIDR"
  },
  "es": {
    "label": "IP/CIDR",
    "placeholder": "Introducir IP/CIDR",
    "error.invalid": "IP/CIDR inválido"
  },
  "fr": {
    "label": "IP/CIDR",
    "placeholder": "Saisir IP/CIDR",
    "error.invalid": "IP/CIDR invalide"
  },
  "de": {
    "label": "IP/CIDR",
    "placeholder": "IP/CIDR eingeben",
    "error.invalid": "Ungültige IP/CIDR"
  },
  "it": {
    "label": "IP/CIDR",
    "placeholder": "Inserire IP/CIDR",
    "error.invalid": "IP/CIDR non valido"
  },
  "ja": {
    "label": "IP/CIDR",
    "placeholder": "IP/CIDR を入力",
    "error.invalid": "無効な IP/CIDR"
  },
  "ko": {
    "label": "IP/CIDR",
    "placeholder": "IP/CIDR 입력",
    "error.invalid": "유효하지 않은 IP/CIDR"
  },
  "ru": {
    "label": "IP/CIDR",
    "placeholder": "Введите IP/CIDR",
    "error.invalid": "Неверный IP/CIDR"
  },
  "pt": {
    "label": "IP/CIDR",
    "placeholder": "Digite IP/CIDR",
    "error.invalid": "IP/CIDR inválido"
  },
  "ar": {
    "label": "IP/CIDR",
    "placeholder": "أدخل IP/CIDR",
    "error.invalid": "IP/CIDR غير صالح"
  },
  "hi": {
    "label": "IP/CIDR",
    "placeholder": "IP/CIDR दर्ज करें",
    "error.invalid": "अमान्य IP/CIDR"
  },
  "tr": {
    "label": "IP/CIDR",
    "placeholder": "IP/CIDR girin",
    "error.invalid": "Geçersiz IP/CIDR"
  },
  "nl": {
    "label": "IP/CIDR",
    "placeholder": "Voer IP/CIDR in",
    "error.invalid": "Ongeldig IP/CIDR"
  },
  "sv": {
    "label": "IP/CIDR",
    "placeholder": "Ange IP/CIDR",
    "error.invalid": "Ogiltig IP/CIDR"
  },
  "pl": {
    "label": "IP/CIDR",
    "placeholder": "Wprowadź IP/CIDR",
    "error.invalid": "Nieprawidłowy IP/CIDR"
  },
  "vi": {
    "label": "IP/CIDR",
    "placeholder": "Nhập IP/CIDR",
    "error.invalid": "IP/CIDR không hợp lệ"
  },
  "th": {
    "label": "IP/CIDR",
    "placeholder": "ป้อน IP/CIDR",
    "error.invalid": "IP/CIDR ไม่ถูกต้อง"
  },
  "id": {
    "label": "IP/CIDR",
    "placeholder": "Masukkan IP/CIDR",
    "error.invalid": "IP/CIDR tidak valid"
  },
  "he": {
    "label": "IP/CIDR",
    "placeholder": "הזן IP/CIDR",
    "error.invalid": "IP/CIDR לא תקין"
  },
  "ms": {
    "label": "IP/CIDR",
    "placeholder": "Masukkan IP/CIDR",
    "error.invalid": "IP/CIDR tidak sah"
  },
  "no": {
    "label": "IP/CIDR",
    "placeholder": "Skriv inn IP/CIDR",
    "error.invalid": "Ugyldig IP/CIDR"
  }
}
</i18n>
