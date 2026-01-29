<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <EmailResultOverview
      :is-valid="validationResult.isValid"
      :normalized="normalizedDisplay"
      :normalized-raw="validationResult.normalized"
      :local-part="localDisplay"
      :local-part-raw="validationResult.localPart"
      :domain="domainDisplay"
      :domain-raw="validationResult.domain"
    />
    <EmailResultLengths
      :length="lengthDisplay"
      :local-length="localLengthDisplay"
      :domain-length="domainLengthDisplay"
    />
    <EmailResultChecks
      :length-status="lengthStatus"
      :local-status="localStatus"
      :domain-status="domainStatus"
      :tld-status="tldStatus"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { EmailValidationResult } from '../data/email'
import EmailResultChecks from './EmailResultChecks.vue'
import EmailResultLengths from './EmailResultLengths.vue'
import EmailResultOverview from './EmailResultOverview.vue'

const { t } = useI18n()

type TagType = 'success' | 'error' | 'default' | 'warning' | 'primary' | 'info'

type TagStatus = {
  label: string
  type: TagType
}

const props = defineProps<{
  validationResult: EmailValidationResult
}>()

const normalizedDisplay = computed(() => props.validationResult.normalized || t('notAvailable'))

const localDisplay = computed(() => props.validationResult.localPart || t('notAvailable'))

const domainDisplay = computed(() => props.validationResult.domain || t('notAvailable'))

const lengthDisplay = computed(() =>
  props.validationResult.length > 0 ? `${props.validationResult.length}` : t('notAvailable'),
)

const localLengthDisplay = computed(() =>
  props.validationResult.localLength > 0
    ? `${props.validationResult.localLength}`
    : t('notAvailable'),
)

const domainLengthDisplay = computed(() =>
  props.validationResult.domainLength > 0
    ? `${props.validationResult.domainLength}`
    : t('notAvailable'),
)

const checkStatus = (value: boolean, available = true): TagStatus => {
  if (!available) {
    return { label: t('notAvailable'), type: 'default' }
  }

  return value ? { label: t('pass'), type: 'success' } : { label: t('fail'), type: 'error' }
}

const hasLocalPart = computed(() => props.validationResult.localLength > 0)
const hasDomain = computed(() => props.validationResult.domainLength > 0)

const lengthStatus = computed(() =>
  checkStatus(props.validationResult.isLengthValid, props.validationResult.length > 0),
)
const localStatus = computed(() =>
  checkStatus(
    props.validationResult.isLocalLengthValid &&
      props.validationResult.isLocalCharsValid &&
      props.validationResult.isLocalDotsValid,
    hasLocalPart.value,
  ),
)
const domainStatus = computed(() =>
  checkStatus(
    props.validationResult.isDomainLengthValid &&
      props.validationResult.isDomainCharsValid &&
      props.validationResult.isDomainDotsValid &&
      props.validationResult.isDomainLabelLengthValid &&
      props.validationResult.isDomainLabelCharsValid,
    hasDomain.value,
  ),
)
const tldStatus = computed(() => checkStatus(props.validationResult.isTldValid, hasDomain.value))
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "zh": {
    "result": "验证结果",
    "pass": "通过",
    "fail": "失败",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "result": "验证结果",
    "pass": "通过",
    "fail": "失败",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "result": "驗證結果",
    "pass": "通過",
    "fail": "失敗",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "result": "驗證結果",
    "pass": "通過",
    "fail": "失敗",
    "notAvailable": "不可用"
  },
  "es": {
    "result": "Resultado de validación",
    "pass": "Aprobado",
    "fail": "Fallido",
    "notAvailable": "No disponible"
  },
  "fr": {
    "result": "Résultat de validation",
    "pass": "Réussi",
    "fail": "Échoué",
    "notAvailable": "Non disponible"
  },
  "de": {
    "result": "Validierungsergebnis",
    "pass": "Bestanden",
    "fail": "Fehlgeschlagen",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "result": "Risultato della validazione",
    "pass": "Superato",
    "fail": "Non superato",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "result": "検証結果",
    "pass": "合格",
    "fail": "不合格",
    "notAvailable": "利用不可"
  },
  "ko": {
    "result": "검증 결과",
    "pass": "통과",
    "fail": "실패",
    "notAvailable": "사용 불가"
  },
  "ru": {
    "result": "Результат проверки",
    "pass": "Пройдено",
    "fail": "Не пройдено",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "result": "Resultado da validação",
    "pass": "Aprovado",
    "fail": "Reprovado",
    "notAvailable": "Não disponível"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "pass": "تم",
    "fail": "فشل",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "pass": "सफल",
    "fail": "असफल",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "pass": "Geçti",
    "fail": "Kaldı",
    "notAvailable": "Mevcut değil"
  },
  "nl": {
    "result": "Validatieresultaat",
    "pass": "Geslaagd",
    "fail": "Mislukt",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "result": "Valideringsresultat",
    "pass": "Godkänd",
    "fail": "Underkänd",
    "notAvailable": "Ej tillgänglig"
  },
  "pl": {
    "result": "Wynik walidacji",
    "pass": "Zaliczone",
    "fail": "Nie zaliczone",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "result": "Kết quả xác thực",
    "pass": "Đạt",
    "fail": "Không đạt",
    "notAvailable": "Không khả dụng"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน",
    "notAvailable": "ไม่พร้อมใช้"
  },
  "id": {
    "result": "Hasil validasi",
    "pass": "Lulus",
    "fail": "Gagal",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "result": "תוצאת אימות",
    "pass": "עבר",
    "fail": "נכשל",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "result": "Hasil pengesahan",
    "pass": "Lulus",
    "fail": "Gagal",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "result": "Valideringsresultat",
    "pass": "Bestått",
    "fail": "Ikke bestått",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
