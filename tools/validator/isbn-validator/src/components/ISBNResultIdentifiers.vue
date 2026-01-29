<template>
  <NDescriptionsItem :label="t('isbn10')">
    <NFlex align="center" :size="8">
      <NText code>{{ isbn10Display }}</NText>
      <CopyToClipboardButton
        v-if="validationResult.isbn10"
        :content="validationResult.isbn10"
        size="small"
      />
    </NFlex>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('isbn13')">
    <NFlex align="center" :size="8">
      <NText code>{{ isbn13Display }}</NText>
      <CopyToClipboardButton
        v-if="validationResult.isbn13"
        :content="validationResult.isbn13"
        size="small"
      />
    </NFlex>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('prefix')">
    <NText depth="3">{{ prefixDisplay }}</NText>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('digits')">
    <NText depth="3">{{ validationResult.length }}</NText>
  </NDescriptionsItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptionsItem, NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { ISBNValidationResult } from '../data/isbn'

const { t } = useI18n()

const props = defineProps<{
  validationResult: ISBNValidationResult
}>()

const isbn10Display = computed(() => {
  if (!props.validationResult.isValid) return t('notAvailable')
  if (props.validationResult.type === 'isbn-13' && props.validationResult.prefix !== '978') {
    return t('notConvertible')
  }
  return props.validationResult.isbn10 ?? t('notAvailable')
})

const isbn13Display = computed(() => {
  if (!props.validationResult.isValid) return t('notAvailable')
  return props.validationResult.isbn13 ?? t('notAvailable')
})

const prefixDisplay = computed(() => {
  if (props.validationResult.type !== 'isbn-13') return '-'
  return props.validationResult.prefix ?? '-'
})
</script>

<i18n lang="json">
{
  "en": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefix",
    "digits": "Total Digits",
    "notAvailable": "Not available",
    "notConvertible": "Not convertible"
  },
  "zh": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "前缀",
    "digits": "总位数",
    "notAvailable": "不可用",
    "notConvertible": "无法转换"
  },
  "zh-CN": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "前缀",
    "digits": "总位数",
    "notAvailable": "不可用",
    "notConvertible": "无法转换"
  },
  "zh-TW": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "前綴",
    "digits": "總位數",
    "notAvailable": "不可用",
    "notConvertible": "無法轉換"
  },
  "zh-HK": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "前綴",
    "digits": "總位數",
    "notAvailable": "不可用",
    "notConvertible": "無法轉換"
  },
  "es": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefijo",
    "digits": "Dígitos totales",
    "notAvailable": "No disponible",
    "notConvertible": "No convertible"
  },
  "fr": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Préfixe",
    "digits": "Chiffres totaux",
    "notAvailable": "Non disponible",
    "notConvertible": "Non convertible"
  },
  "de": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Präfix",
    "digits": "Gesamtziffern",
    "notAvailable": "Nicht verfügbar",
    "notConvertible": "Nicht konvertierbar"
  },
  "it": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefisso",
    "digits": "Cifre totali",
    "notAvailable": "Non disponibile",
    "notConvertible": "Non convertibile"
  },
  "ja": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "プレフィックス",
    "digits": "総桁数",
    "notAvailable": "利用不可",
    "notConvertible": "変換不可"
  },
  "ko": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "접두사",
    "digits": "총 자릿수",
    "notAvailable": "사용할 수 없음",
    "notConvertible": "변환 불가"
  },
  "ru": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Префикс",
    "digits": "Всего цифр",
    "notAvailable": "Недоступно",
    "notConvertible": "Невозможно преобразовать"
  },
  "pt": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefixo",
    "digits": "Total de dígitos",
    "notAvailable": "Indisponível",
    "notConvertible": "Não conversível"
  },
  "ar": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "البادئة",
    "digits": "إجمالي الأرقام",
    "notAvailable": "غير متاح",
    "notConvertible": "غير قابل للتحويل"
  },
  "hi": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "उपसर्ग",
    "digits": "कुल अंक",
    "notAvailable": "उपलब्ध नहीं",
    "notConvertible": "रूपांतरित नहीं हो सकता"
  },
  "tr": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Önek",
    "digits": "Toplam Rakam",
    "notAvailable": "Kullanılamıyor",
    "notConvertible": "Dönüştürülemez"
  },
  "nl": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefix",
    "digits": "Totaal cijfers",
    "notAvailable": "Niet beschikbaar",
    "notConvertible": "Niet converteerbaar"
  },
  "sv": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefix",
    "digits": "Totalt Siffror",
    "notAvailable": "Inte tillgänglig",
    "notConvertible": "Kan inte konverteras"
  },
  "pl": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefiks",
    "digits": "Łączna liczba cyfr",
    "notAvailable": "Niedostępne",
    "notConvertible": "Nie do konwersji"
  },
  "vi": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Tiền tố",
    "digits": "Tổng số chữ số",
    "notAvailable": "Không khả dụng",
    "notConvertible": "Không thể chuyển đổi"
  },
  "th": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "คำนำหน้า",
    "digits": "จำนวนหลักทั้งหมด",
    "notAvailable": "ไม่พร้อมใช้งาน",
    "notConvertible": "ไม่สามารถแปลงได้"
  },
  "id": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefiks",
    "digits": "Total digit",
    "notAvailable": "Tidak tersedia",
    "notConvertible": "Tidak dapat dikonversi"
  },
  "he": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "קידומת",
    "digits": "סה\"כ ספרות",
    "notAvailable": "לא זמין",
    "notConvertible": "לא ניתן להמרה"
  },
  "ms": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Awalan",
    "digits": "Jumlah digit",
    "notAvailable": "Tidak tersedia",
    "notConvertible": "Tidak boleh ditukar"
  },
  "no": {
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefiks",
    "digits": "Totalt Sifre",
    "notAvailable": "Ikke tilgjengelig",
    "notConvertible": "Kan ikke konverteres"
  }
}
</i18n>
