<template>
  <n-form-item label="CIDR" :rule="rule" :show-label="false">
    <n-input v-model:value="cidr" :placeholder="t('placeholder')" />
  </n-form-item>
</template>

<script setup lang="ts">
import { NInput, NFormItem, type FormItemRule } from 'naive-ui'
import isCidr from 'is-cidr'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const cidrModel = defineModel<string>('cidr', { default: '' })
const { t } = useI18n()
const cidr = ref(cidrModel.value ?? '')
const rule: FormItemRule = {
  trigger: ['input', 'change', 'blur'],
  validator() {
    if (isCidr(cidr.value) === 0) {
      return new Error(t('invalidCidr'))
    }
  },
}

watch(cidr, (value: string) => {
  if (isCidr(value) !== 0) {
    cidrModel.value = value
  } else {
    cidrModel.value = ''
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "placeholder": "10.0.0.0/24 or 2001:db8::/32",
    "invalidCidr": "Invalid CIDR"
  },
  "zh": {
    "placeholder": "10.0.0.0/24 或 2001:db8::/32",
    "invalidCidr": "无效的 CIDR"
  },
  "zh-CN": {
    "placeholder": "10.0.0.0/24 或 2001:db8::/32",
    "invalidCidr": "无效的 CIDR"
  },
  "zh-TW": {
    "placeholder": "10.0.0.0/24 或 2001:db8::/32",
    "invalidCidr": "無效的 CIDR"
  },
  "zh-HK": {
    "placeholder": "10.0.0.0/24 或 2001:db8::/32",
    "invalidCidr": "無效的 CIDR"
  },
  "es": {
    "placeholder": "10.0.0.0/24 o 2001:db8::/32",
    "invalidCidr": "CIDR inválido"
  },
  "fr": {
    "placeholder": "10.0.0.0/24 ou 2001:db8::/32",
    "invalidCidr": "CIDR invalide"
  },
  "de": {
    "placeholder": "10.0.0.0/24 oder 2001:db8::/32",
    "invalidCidr": "Ungültiges CIDR"
  },
  "it": {
    "placeholder": "10.0.0.0/24 o 2001:db8::/32",
    "invalidCidr": "CIDR non valido"
  },
  "ja": {
    "placeholder": "10.0.0.0/24 または 2001:db8::/32",
    "invalidCidr": "無効な CIDR"
  },
  "ko": {
    "placeholder": "10.0.0.0/24 또는 2001:db8::/32",
    "invalidCidr": "유효하지 않은 CIDR"
  },
  "ru": {
    "placeholder": "10.0.0.0/24 или 2001:db8::/32",
    "invalidCidr": "Недопустимый CIDR"
  },
  "pt": {
    "placeholder": "10.0.0.0/24 ou 2001:db8::/32",
    "invalidCidr": "CIDR inválido"
  },
  "ar": {
    "placeholder": "10.0.0.0/24 أو 2001:db8::/32",
    "invalidCidr": "CIDR غير صالح"
  },
  "hi": {
    "placeholder": "10.0.0.0/24 या 2001:db8::/32",
    "invalidCidr": "अमान्य CIDR"
  },
  "tr": {
    "placeholder": "10.0.0.0/24 veya 2001:db8::/32",
    "invalidCidr": "Geçersiz CIDR"
  },
  "nl": {
    "placeholder": "10.0.0.0/24 of 2001:db8::/32",
    "invalidCidr": "Ongeldig CIDR"
  },
  "sv": {
    "placeholder": "10.0.0.0/24 eller 2001:db8::/32",
    "invalidCidr": "Ogiltigt CIDR"
  },
  "pl": {
    "placeholder": "10.0.0.0/24 lub 2001:db8::/32",
    "invalidCidr": "Nieprawidłowy CIDR"
  },
  "vi": {
    "placeholder": "10.0.0.0/24 hoặc 2001:db8::/32",
    "invalidCidr": "CIDR không hợp lệ"
  },
  "th": {
    "placeholder": "10.0.0.0/24 หรือ 2001:db8::/32",
    "invalidCidr": "CIDR ไม่ถูกต้อง"
  },
  "id": {
    "placeholder": "10.0.0.0/24 atau 2001:db8::/32",
    "invalidCidr": "CIDR tidak valid"
  },
  "he": {
    "placeholder": "10.0.0.0/24 או 2001:db8::/32",
    "invalidCidr": "CIDR לא תקין"
  },
  "ms": {
    "placeholder": "10.0.0.0/24 atau 2001:db8::/32",
    "invalidCidr": "CIDR tidak sah"
  },
  "no": {
    "placeholder": "10.0.0.0/24 eller 2001:db8::/32",
    "invalidCidr": "Ugyldig CIDR"
  }
}
</i18n>
