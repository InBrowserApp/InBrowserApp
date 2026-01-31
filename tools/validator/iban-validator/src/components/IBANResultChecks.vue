<template>
  <NDescriptionsItem :label="t('length')">
    <NFlex align="center" :size="8">
      <NText depth="3">{{ t('expected') }}: {{ expectedLength }}</NText>
      <NText depth="3">{{ t('actual') }}: {{ actualLength }}</NText>
    </NFlex>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('checksum')">
    <NTag :type="isChecksumValid ? 'success' : 'error'" size="small">
      {{ isChecksumValid ? t('pass') : t('fail') }}
    </NTag>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('checkDigits')">
    <NFlex align="center" :size="8">
      <NText depth="3">{{ t('expected') }}: {{ expectedCheckDigits }}</NText>
      <NText depth="3">{{ t('actual') }}: {{ actualCheckDigits }}</NText>
    </NFlex>
  </NDescriptionsItem>
</template>

<script setup lang="ts">
import { NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'

defineProps<{
  expectedLength: string
  actualLength: number
  isChecksumValid: boolean
  expectedCheckDigits: string
  actualCheckDigits: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "length": "Length",
    "expected": "Expected",
    "actual": "Actual",
    "checksum": "Checksum",
    "checkDigits": "Check Digits",
    "pass": "Pass",
    "fail": "Fail"
  },
  "zh": {
    "length": "长度",
    "expected": "期望",
    "actual": "实际",
    "checksum": "校验和",
    "checkDigits": "校验位",
    "pass": "通过",
    "fail": "失败"
  },
  "zh-CN": {
    "length": "长度",
    "expected": "期望",
    "actual": "实际",
    "checksum": "校验和",
    "checkDigits": "校验位",
    "pass": "通过",
    "fail": "失败"
  },
  "zh-TW": {
    "length": "長度",
    "expected": "期望",
    "actual": "實際",
    "checksum": "校驗和",
    "checkDigits": "校驗位",
    "pass": "通過",
    "fail": "失敗"
  },
  "zh-HK": {
    "length": "長度",
    "expected": "期望",
    "actual": "實際",
    "checksum": "校驗和",
    "checkDigits": "校驗位",
    "pass": "通過",
    "fail": "失敗"
  },
  "es": {
    "length": "Longitud",
    "expected": "Esperado",
    "actual": "Actual",
    "checksum": "Suma de verificación",
    "checkDigits": "Dígitos de control",
    "pass": "Aprobado",
    "fail": "Fallido"
  },
  "fr": {
    "length": "Longueur",
    "expected": "Attendu",
    "actual": "Actuel",
    "checksum": "Somme de contrôle",
    "checkDigits": "Chiffres de contrôle",
    "pass": "Réussi",
    "fail": "Échoué"
  },
  "de": {
    "length": "Länge",
    "expected": "Erwartet",
    "actual": "Tatsächlich",
    "checksum": "Prüfsumme",
    "checkDigits": "Prüfziffern",
    "pass": "Bestanden",
    "fail": "Fehlgeschlagen"
  },
  "it": {
    "length": "Lunghezza",
    "expected": "Atteso",
    "actual": "Attuale",
    "checksum": "Checksum",
    "checkDigits": "Cifre di controllo",
    "pass": "Superato",
    "fail": "Fallito"
  },
  "ja": {
    "length": "長さ",
    "expected": "期待値",
    "actual": "実際",
    "checksum": "チェックサム",
    "checkDigits": "チェックディジット",
    "pass": "合格",
    "fail": "失敗"
  },
  "ko": {
    "length": "길이",
    "expected": "예상",
    "actual": "실제",
    "checksum": "체크섬",
    "checkDigits": "체크 디지트",
    "pass": "통과",
    "fail": "실패"
  },
  "ru": {
    "length": "Длина",
    "expected": "Ожидаемая",
    "actual": "Фактическая",
    "checksum": "Контрольная сумма",
    "checkDigits": "Контрольные цифры",
    "pass": "Пройдено",
    "fail": "Не пройдено"
  },
  "pt": {
    "length": "Comprimento",
    "expected": "Esperado",
    "actual": "Atual",
    "checksum": "Checksum",
    "checkDigits": "Dígitos de verificação",
    "pass": "Aprovado",
    "fail": "Reprovado"
  },
  "ar": {
    "length": "الطول",
    "expected": "متوقع",
    "actual": "فعلي",
    "checksum": "المجموع الاختباري",
    "checkDigits": "أرقام التحقق",
    "pass": "ناجح",
    "fail": "فشل"
  },
  "hi": {
    "length": "लंबाई",
    "expected": "अपेक्षित",
    "actual": "वास्तविक",
    "checksum": "चेकसम",
    "checkDigits": "चेक अंकों",
    "pass": "उत्तीर्ण",
    "fail": "विफल"
  },
  "tr": {
    "length": "Uzunluk",
    "expected": "Beklenen",
    "actual": "Gerçek",
    "checksum": "Sağlama toplamı",
    "checkDigits": "Kontrol haneleri",
    "pass": "Geçti",
    "fail": "Başarısız"
  },
  "nl": {
    "length": "Lengte",
    "expected": "Verwacht",
    "actual": "Werkelijk",
    "checksum": "Controlesom",
    "checkDigits": "Controlecijfers",
    "pass": "Geslaagd",
    "fail": "Mislukt"
  },
  "sv": {
    "length": "Längd",
    "expected": "Förväntad",
    "actual": "Faktisk",
    "checksum": "Kontrollsumma",
    "checkDigits": "Kontrollsiffror",
    "pass": "Godkänd",
    "fail": "Underkänd"
  },
  "pl": {
    "length": "Długość",
    "expected": "Oczekiwane",
    "actual": "Rzeczywiste",
    "checksum": "Suma kontrolna",
    "checkDigits": "Cyfry kontrolne",
    "pass": "Zaliczony",
    "fail": "Nie zaliczony"
  },
  "vi": {
    "length": "Độ dài",
    "expected": "Kỳ vọng",
    "actual": "Thực tế",
    "checksum": "Checksum",
    "checkDigits": "Chữ số kiểm tra",
    "pass": "Đạt",
    "fail": "Không đạt"
  },
  "th": {
    "length": "ความยาว",
    "expected": "ที่คาดไว้",
    "actual": "จริง",
    "checksum": "ผลรวมตรวจสอบ",
    "checkDigits": "เลขตรวจสอบ",
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน"
  },
  "id": {
    "length": "Panjang",
    "expected": "Diharapkan",
    "actual": "Aktual",
    "checksum": "Checksum",
    "checkDigits": "Digit pemeriksa",
    "pass": "Lulus",
    "fail": "Gagal"
  },
  "he": {
    "length": "אורך",
    "expected": "צפוי",
    "actual": "בפועל",
    "checksum": "סכום ביקורת",
    "checkDigits": "ספרות ביקורת",
    "pass": "עבר",
    "fail": "נכשל"
  },
  "ms": {
    "length": "Panjang",
    "expected": "Dijangka",
    "actual": "Sebenar",
    "checksum": "Checksum",
    "checkDigits": "Digit semakan",
    "pass": "Lulus",
    "fail": "Gagal"
  },
  "no": {
    "length": "Lengde",
    "expected": "Forventet",
    "actual": "Faktisk",
    "checksum": "Kontrollsum",
    "checkDigits": "Kontrollsifre",
    "pass": "Bestått",
    "fail": "Mislykket"
  }
}
</i18n>
