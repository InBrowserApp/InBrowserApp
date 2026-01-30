<template>
  <n-form-item label="IPv6" :rule="rule">
    <n-input v-model:value="ipv6" :placeholder="t('placeholder')" />
  </n-form-item>
</template>

<script setup lang="ts">
import { NInput, NFormItem, type FormItemRule } from 'naive-ui'
import { isIPv6 } from 'is-ip'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  ipv6: string
}>()
const emit = defineEmits<{
  'update:ipv6': [string]
}>()
const { t } = useI18n()
const ipv6 = ref(props.ipv6)
const rule: FormItemRule = {
  trigger: ['input', 'change', 'blur'],
  validator() {
    if (!isIPv6(ipv6.value)) {
      return new Error(t('error'))
    }
  },
}

watch(ipv6, (value: string) => {
  if (isIPv6(value)) {
    emit('update:ipv6', value)
  } else {
    emit('update:ipv6', '')
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "placeholder": "Input IPv6",
    "error": "Invalid IPv6 Address"
  },
  "zh": {
    "placeholder": "输入 IPv6",
    "error": "无效的 IPv6 地址"
  },
  "zh-CN": {
    "placeholder": "输入 IPv6",
    "error": "无效的 IPv6 地址"
  },
  "zh-TW": {
    "placeholder": "輸入 IPv6",
    "error": "無效的 IPv6 位址"
  },
  "zh-HK": {
    "placeholder": "輸入 IPv6",
    "error": "無效的 IPv6 位址"
  },
  "es": {
    "placeholder": "Introduce IPv6",
    "error": "Dirección IPv6 inválida"
  },
  "fr": {
    "placeholder": "Saisir IPv6",
    "error": "Adresse IPv6 invalide"
  },
  "de": {
    "placeholder": "IPv6 eingeben",
    "error": "Ungültige IPv6-Adresse"
  },
  "it": {
    "placeholder": "Inserire IPv6",
    "error": "Indirizzo IPv6 non valido"
  },
  "ja": {
    "placeholder": "IPv6 を入力",
    "error": "無効な IPv6 アドレス"
  },
  "ko": {
    "placeholder": "IPv6 입력",
    "error": "유효하지 않은 IPv6 주소"
  },
  "ru": {
    "placeholder": "Введите IPv6",
    "error": "Недействительный IPv6-адрес"
  },
  "pt": {
    "placeholder": "Digite IPv6",
    "error": "Endereço IPv6 inválido"
  },
  "ar": {
    "placeholder": "أدخل IPv6",
    "error": "عنوان IPv6 غير صالح"
  },
  "hi": {
    "placeholder": "IPv6 दर्ज करें",
    "error": "अमान्य IPv6 पता"
  },
  "tr": {
    "placeholder": "IPv6 girin",
    "error": "Geçersiz IPv6 adresi"
  },
  "nl": {
    "placeholder": "Voer IPv6 in",
    "error": "Ongeldig IPv6-adres"
  },
  "sv": {
    "placeholder": "Ange IPv6",
    "error": "Ogiltig IPv6-adress"
  },
  "pl": {
    "placeholder": "Wprowadź IPv6",
    "error": "Nieprawidłowy adres IPv6"
  },
  "vi": {
    "placeholder": "Nhập IPv6",
    "error": "Địa chỉ IPv6 không hợp lệ"
  },
  "th": {
    "placeholder": "ป้อน IPv6",
    "error": "ที่อยู่ IPv6 ไม่ถูกต้อง"
  },
  "id": {
    "placeholder": "Masukkan IPv6",
    "error": "Alamat IPv6 tidak valid"
  },
  "he": {
    "placeholder": "הזן IPv6",
    "error": "כתובת IPv6 לא תקינה"
  },
  "ms": {
    "placeholder": "Masukkan IPv6",
    "error": "Alamat IPv6 tidak sah"
  },
  "no": {
    "placeholder": "Skriv inn IPv6",
    "error": "Ugyldig IPv6-adresse"
  }
}
</i18n>
