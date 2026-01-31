<template>
  <NText depth="3">{{ genderLabel }}</NText>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { ResidentIdGender } from '../data/residentId'

const props = defineProps<{
  gender: ResidentIdGender
}>()

const { t } = useI18n()

const genderLabel = computed(() => {
  switch (props.gender) {
    case 'male':
      return t('male')
    case 'female':
      return t('female')
    default:
      return t('unknown')
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "male": "Male",
    "female": "Female",
    "unknown": "Unknown"
  },
  "zh": {
    "male": "男",
    "female": "女",
    "unknown": "未知"
  },
  "zh-CN": {
    "male": "男",
    "female": "女",
    "unknown": "未知"
  },
  "zh-TW": {
    "male": "男",
    "female": "女",
    "unknown": "未知"
  },
  "zh-HK": {
    "male": "男",
    "female": "女",
    "unknown": "未知"
  },
  "es": {
    "male": "Masculino",
    "female": "Femenino",
    "unknown": "Desconocido"
  },
  "fr": {
    "male": "Homme",
    "female": "Femme",
    "unknown": "Inconnu"
  },
  "de": {
    "male": "Männlich",
    "female": "Weiblich",
    "unknown": "Unbekannt"
  },
  "it": {
    "male": "Maschio",
    "female": "Femmina",
    "unknown": "Sconosciuto"
  },
  "ja": {
    "male": "男性",
    "female": "女性",
    "unknown": "不明"
  },
  "ko": {
    "male": "남성",
    "female": "여성",
    "unknown": "알 수 없음"
  },
  "ru": {
    "male": "Мужской",
    "female": "Женский",
    "unknown": "Неизвестен"
  },
  "pt": {
    "male": "Masculino",
    "female": "Feminino",
    "unknown": "Desconhecido"
  },
  "ar": {
    "male": "ذكر",
    "female": "أنثى",
    "unknown": "غير معروف"
  },
  "hi": {
    "male": "पुरुष",
    "female": "महिला",
    "unknown": "अज्ञात"
  },
  "tr": {
    "male": "Erkek",
    "female": "Kadın",
    "unknown": "Bilinmeyen"
  },
  "nl": {
    "male": "Man",
    "female": "Vrouw",
    "unknown": "Onbekend"
  },
  "sv": {
    "male": "Man",
    "female": "Kvinna",
    "unknown": "Okänd"
  },
  "pl": {
    "male": "Mężczyzna",
    "female": "Kobieta",
    "unknown": "Nieznany"
  },
  "vi": {
    "male": "Nam",
    "female": "Nữ",
    "unknown": "Không xác định"
  },
  "th": {
    "male": "ชาย",
    "female": "หญิง",
    "unknown": "ไม่ทราบ"
  },
  "id": {
    "male": "Laki-laki",
    "female": "Perempuan",
    "unknown": "Tidak dikenal"
  },
  "he": {
    "male": "זכר",
    "female": "נקבה",
    "unknown": "לא ידוע"
  },
  "ms": {
    "male": "Lelaki",
    "female": "Perempuan",
    "unknown": "Tidak diketahui"
  },
  "no": {
    "male": "Mann",
    "female": "Kvinne",
    "unknown": "Ukjent"
  }
}
</i18n>
