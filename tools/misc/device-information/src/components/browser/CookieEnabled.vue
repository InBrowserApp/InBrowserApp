<template>
  <InfoStatistic :label="t('cookie-enabled')" :value="cookieEnabled" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const cookieEnabled = computed(() => (navigator.cookieEnabled ? t('yes') : t('no')))
</script>

<i18n lang="json">
{
  "en": {
    "cookie-enabled": "Cookies Enabled",
    "yes": "Yes",
    "no": "No"
  },
  "zh": {
    "cookie-enabled": "Cookie 启用",
    "yes": "是",
    "no": "否"
  },
  "zh-CN": {
    "cookie-enabled": "Cookie 启用",
    "yes": "是",
    "no": "否"
  },
  "zh-TW": {
    "cookie-enabled": "Cookie 啟用",
    "yes": "是",
    "no": "否"
  },
  "zh-HK": {
    "cookie-enabled": "Cookie 啟用",
    "yes": "是",
    "no": "否"
  },
  "es": {
    "cookie-enabled": "Cookies Habilitadas",
    "yes": "Si",
    "no": "No"
  },
  "fr": {
    "cookie-enabled": "Cookies Actives",
    "yes": "Oui",
    "no": "Non"
  },
  "de": {
    "cookie-enabled": "Cookies Aktiviert",
    "yes": "Ja",
    "no": "Nein"
  },
  "it": {
    "cookie-enabled": "Cookie Abilitati",
    "yes": "Si",
    "no": "No"
  },
  "ja": {
    "cookie-enabled": "Cookie 有効",
    "yes": "はい",
    "no": "いいえ"
  },
  "ko": {
    "cookie-enabled": "쿠키 활성화",
    "yes": "예",
    "no": "아니오"
  },
  "ru": {
    "cookie-enabled": "Куки Включены",
    "yes": "Да",
    "no": "Нет"
  },
  "pt": {
    "cookie-enabled": "Cookies Ativados",
    "yes": "Sim",
    "no": "Nao"
  },
  "ar": {
    "cookie-enabled": "ملفات تعريف الارتباط مفعلة",
    "yes": "نعم",
    "no": "لا"
  },
  "hi": {
    "cookie-enabled": "कुकीज सक्षम",
    "yes": "हां",
    "no": "नहीं"
  },
  "tr": {
    "cookie-enabled": "Cerezler Etkin",
    "yes": "Evet",
    "no": "Hayir"
  },
  "nl": {
    "cookie-enabled": "Cookies Ingeschakeld",
    "yes": "Ja",
    "no": "Nee"
  },
  "sv": {
    "cookie-enabled": "Cookies Aktiverade",
    "yes": "Ja",
    "no": "Nej"
  },
  "pl": {
    "cookie-enabled": "Ciasteczka Wlaczone",
    "yes": "Tak",
    "no": "Nie"
  },
  "vi": {
    "cookie-enabled": "Cookie Da Bat",
    "yes": "Co",
    "no": "Khong"
  },
  "th": {
    "cookie-enabled": "คุกกี้เปิดใช้งาน",
    "yes": "ใช่",
    "no": "ไม่"
  },
  "id": {
    "cookie-enabled": "Cookie Diaktifkan",
    "yes": "Ya",
    "no": "Tidak"
  },
  "he": {
    "cookie-enabled": "עוגיות מופעלות",
    "yes": "כן",
    "no": "לא"
  },
  "ms": {
    "cookie-enabled": "Kuki Diaktifkan",
    "yes": "Ya",
    "no": "Tidak"
  },
  "no": {
    "cookie-enabled": "Informasjonskapsler Aktivert",
    "yes": "Ja",
    "no": "Nei"
  }
}
</i18n>
