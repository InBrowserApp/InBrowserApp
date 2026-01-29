<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <IBANResultStatus
        :is-valid="validationResult.isValid"
        :is-country-valid="validationResult.isCountryValid"
        :country-display="countryDisplay"
      />
      <IBANResultChecks
        :expected-length="expectedLength"
        :actual-length="validationResult.length"
        :is-checksum-valid="validationResult.isChecksumValid"
        :expected-check-digits="expectedCheckDigits"
        :actual-check-digits="actualCheckDigits"
      />
      <IBANResultFormats
        :normalized="normalizedDisplay"
        :normalized-raw="validationResult.normalized"
        :formatted="formattedDisplay"
        :formatted-raw="validationResult.formatted"
        :bban="bbanDisplay"
        :bban-raw="validationResult.bban"
      />
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptions } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { IBANValidationResult } from '../data/iban'
import IBANResultChecks from './IBANResultChecks.vue'
import IBANResultFormats from './IBANResultFormats.vue'
import IBANResultStatus from './IBANResultStatus.vue'

const { t, locale } = useI18n()

const props = defineProps<{
  validationResult: IBANValidationResult
}>()

const displayNames = computed(() => {
  if (typeof Intl === 'undefined' || typeof Intl.DisplayNames === 'undefined') return null

  try {
    return new Intl.DisplayNames([locale.value], { type: 'region' })
  } catch {
    return new Intl.DisplayNames(['en'], { type: 'region' })
  }
})

const countryName = computed(() => {
  const code = props.validationResult.countryCode
  if (!code || !props.validationResult.isCountryValid || !displayNames.value) return null
  return displayNames.value.of(code) ?? null
})

const countryDisplay = computed(() => {
  const code = props.validationResult.countryCode
  if (!code) return t('notAvailable')
  if (!props.validationResult.isCountryValid) return code
  if (countryName.value) return `${countryName.value} (${code})`
  return code
})

const expectedLength = computed(() =>
  props.validationResult.expectedLength ? `${props.validationResult.expectedLength}` : t('unknown'),
)

const expectedCheckDigits = computed(
  () => props.validationResult.expectedCheckDigits ?? t('notAvailable'),
)

const actualCheckDigits = computed(() => props.validationResult.checkDigits ?? t('notAvailable'))

const normalizedDisplay = computed(() => props.validationResult.normalized || t('notAvailable'))

const formattedDisplay = computed(() => props.validationResult.formatted || t('notAvailable'))

const bbanDisplay = computed(() => props.validationResult.bban || t('notAvailable'))
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "notAvailable": "Not available",
    "unknown": "Unknown"
  },
  "zh": {
    "result": "验证结果",
    "notAvailable": "不可用",
    "unknown": "未知"
  },
  "zh-CN": {
    "result": "验证结果",
    "notAvailable": "不可用",
    "unknown": "未知"
  },
  "zh-TW": {
    "result": "驗證結果",
    "notAvailable": "不可用",
    "unknown": "未知"
  },
  "zh-HK": {
    "result": "驗證結果",
    "notAvailable": "不可用",
    "unknown": "未知"
  },
  "es": {
    "result": "Resultado de Validación",
    "notAvailable": "No disponible",
    "unknown": "Desconocido"
  },
  "fr": {
    "result": "Résultat de Validation",
    "notAvailable": "Non disponible",
    "unknown": "Inconnu"
  },
  "de": {
    "result": "Validierungsergebnis",
    "notAvailable": "Nicht verfügbar",
    "unknown": "Unbekannt"
  },
  "it": {
    "result": "Risultato di Validazione",
    "notAvailable": "Non disponibile",
    "unknown": "Sconosciuto"
  },
  "ja": {
    "result": "検証結果",
    "notAvailable": "利用不可",
    "unknown": "不明"
  },
  "ko": {
    "result": "검증 결과",
    "notAvailable": "사용 불가",
    "unknown": "알 수 없음"
  },
  "ru": {
    "result": "Результат проверки",
    "notAvailable": "Недоступно",
    "unknown": "Неизвестно"
  },
  "pt": {
    "result": "Resultado da Validação",
    "notAvailable": "Não disponível",
    "unknown": "Desconhecido"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "notAvailable": "غير متوفر",
    "unknown": "غير معروف"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "notAvailable": "उपलब्ध नहीं",
    "unknown": "अज्ञात"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "notAvailable": "Kullanılamaz",
    "unknown": "Bilinmeyen"
  },
  "nl": {
    "result": "Validatieresultaat",
    "notAvailable": "Niet beschikbaar",
    "unknown": "Onbekend"
  },
  "sv": {
    "result": "Valideringsresultat",
    "notAvailable": "Inte tillgänglig",
    "unknown": "Okänd"
  },
  "pl": {
    "result": "Wynik walidacji",
    "notAvailable": "Niedostępne",
    "unknown": "Nieznany"
  },
  "vi": {
    "result": "Kết quả kiểm tra",
    "notAvailable": "Không có",
    "unknown": "Không rõ"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "notAvailable": "ไม่พร้อมใช้งาน",
    "unknown": "ไม่ทราบ"
  },
  "id": {
    "result": "Hasil Validasi",
    "notAvailable": "Tidak tersedia",
    "unknown": "Tidak diketahui"
  },
  "he": {
    "result": "תוצאת אימות",
    "notAvailable": "לא זמין",
    "unknown": "לא ידוע"
  },
  "ms": {
    "result": "Keputusan Pengesahan",
    "notAvailable": "Tidak tersedia",
    "unknown": "Tidak diketahui"
  },
  "no": {
    "result": "Valideringsresultat",
    "notAvailable": "Ikke tilgjengelig",
    "unknown": "Ukjent"
  }
}
</i18n>
