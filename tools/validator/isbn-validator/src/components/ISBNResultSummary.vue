<template>
  <NDescriptionsItem :label="t('type')">
    <NText depth="3">{{ typeLabel }}</NText>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('normalized')">
    <NFlex align="center" :size="8">
      <NText code>{{ validationResult.normalized || '-' }}</NText>
      <CopyToClipboardButton
        v-if="validationResult.normalized"
        :content="validationResult.normalized"
        size="small"
      />
    </NFlex>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('checksum')">
    <NTag :type="validationResult.isChecksumValid ? 'success' : 'error'" size="small">
      {{ validationResult.isChecksumValid ? t('pass') : t('fail') }}
    </NTag>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('checkDigit')">
    <NFlex align="center" :size="8">
      <NText depth="3">{{ t('expected') }}: {{ expectedDigit }}</NText>
      <NText depth="3">{{ t('actual') }}: {{ actualDigit }}</NText>
    </NFlex>
  </NDescriptionsItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { ISBNValidationResult } from '../data/isbn'

const props = defineProps<{
  validationResult: ISBNValidationResult
}>()

const { t } = useI18n()

const typeLabel = computed(() => {
  if (props.validationResult.type === 'isbn-10') return t('isbn10')
  if (props.validationResult.type === 'isbn-13') return t('isbn13')
  return t('unknown')
})

const expectedDigit = computed(() => props.validationResult.expectedCheckDigit ?? '-')
const actualDigit = computed(() => props.validationResult.actualCheckDigit ?? '-')
</script>

<i18n lang="json">
{
  "en": {
    "type": "ISBN Type",
    "normalized": "Normalized ISBN",
    "checksum": "Checksum",
    "checkDigit": "Check Digit",
    "expected": "Expected",
    "actual": "Actual",
    "pass": "Pass",
    "fail": "Fail",
    "unknown": "Unknown",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "zh": {
    "type": "ISBN 类型",
    "normalized": "标准化 ISBN",
    "checksum": "校验和",
    "checkDigit": "校验位",
    "expected": "期望",
    "actual": "实际",
    "pass": "通过",
    "fail": "失败",
    "unknown": "未知",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "zh-CN": {
    "type": "ISBN 类型",
    "normalized": "标准化 ISBN",
    "checksum": "校验和",
    "checkDigit": "校验位",
    "expected": "期望",
    "actual": "实际",
    "pass": "通过",
    "fail": "失败",
    "unknown": "未知",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "zh-TW": {
    "type": "ISBN 類型",
    "normalized": "標準化 ISBN",
    "checksum": "校驗和",
    "checkDigit": "校驗位",
    "expected": "期望",
    "actual": "實際",
    "pass": "通過",
    "fail": "失敗",
    "unknown": "未知",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "zh-HK": {
    "type": "ISBN 類型",
    "normalized": "標準化 ISBN",
    "checksum": "校驗和",
    "checkDigit": "校驗位",
    "expected": "期望",
    "actual": "實際",
    "pass": "通過",
    "fail": "失敗",
    "unknown": "未知",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "es": {
    "type": "Tipo de ISBN",
    "normalized": "ISBN normalizado",
    "checksum": "Suma de verificación",
    "checkDigit": "Dígito de control",
    "expected": "Esperado",
    "actual": "Actual",
    "pass": "Aprobado",
    "fail": "Fallido",
    "unknown": "Desconocido",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "fr": {
    "type": "Type ISBN",
    "normalized": "ISBN normalisé",
    "checksum": "Somme de contrôle",
    "checkDigit": "Chiffre de contrôle",
    "expected": "Attendu",
    "actual": "Actuel",
    "pass": "Réussi",
    "fail": "Échoué",
    "unknown": "Inconnu",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "de": {
    "type": "ISBN-Typ",
    "normalized": "Normalisierte ISBN",
    "checksum": "Prüfsumme",
    "checkDigit": "Prüfziffer",
    "expected": "Erwartet",
    "actual": "Tatsächlich",
    "pass": "Bestanden",
    "fail": "Fehlgeschlagen",
    "unknown": "Unbekannt",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "it": {
    "type": "Tipo ISBN",
    "normalized": "ISBN normalizzato",
    "checksum": "Somma di controllo",
    "checkDigit": "Cifra di controllo",
    "expected": "Previsto",
    "actual": "Attuale",
    "pass": "Superato",
    "fail": "Fallito",
    "unknown": "Sconosciuto",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "ja": {
    "type": "ISBN 種別",
    "normalized": "正規化 ISBN",
    "checksum": "チェックサム",
    "checkDigit": "チェックディジット",
    "expected": "期待",
    "actual": "実際",
    "pass": "合格",
    "fail": "不合格",
    "unknown": "不明",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "ko": {
    "type": "ISBN 유형",
    "normalized": "정규화된 ISBN",
    "checksum": "체크섬",
    "checkDigit": "체크 디지트",
    "expected": "예상",
    "actual": "실제",
    "pass": "통과",
    "fail": "실패",
    "unknown": "알 수 없음",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "ru": {
    "type": "Тип ISBN",
    "normalized": "Нормализованный ISBN",
    "checksum": "Контрольная сумма",
    "checkDigit": "Контрольная цифра",
    "expected": "Ожидается",
    "actual": "Фактическая",
    "pass": "Пройдено",
    "fail": "Не пройдено",
    "unknown": "Неизвестно",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "pt": {
    "type": "Tipo de ISBN",
    "normalized": "ISBN normalizado",
    "checksum": "Soma de verificação",
    "checkDigit": "Dígito verificador",
    "expected": "Esperado",
    "actual": "Atual",
    "pass": "Aprovado",
    "fail": "Reprovado",
    "unknown": "Desconhecido",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "ar": {
    "type": "نوع ISBN",
    "normalized": "ISBN مُطبّع",
    "checksum": "مجموع التحقق",
    "checkDigit": "رقم التحقق",
    "expected": "المتوقع",
    "actual": "الفعلي",
    "pass": "ناجح",
    "fail": "فاشل",
    "unknown": "غير معروف",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "hi": {
    "type": "ISBN प्रकार",
    "normalized": "मानकीकृत ISBN",
    "checksum": "चेकसम",
    "checkDigit": "चेक अंक",
    "expected": "अपेक्षित",
    "actual": "वास्तविक",
    "pass": "उत्तीर्ण",
    "fail": "असफल",
    "unknown": "अज्ञात",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "tr": {
    "type": "ISBN Türü",
    "normalized": "Normalize ISBN",
    "checksum": "Sağlama toplamı",
    "checkDigit": "Kontrol basamağı",
    "expected": "Beklenen",
    "actual": "Gerçek",
    "pass": "Geçti",
    "fail": "Başarısız",
    "unknown": "Bilinmiyor",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "nl": {
    "type": "ISBN-type",
    "normalized": "Genormaliseerde ISBN",
    "checksum": "Controlesom",
    "checkDigit": "Controlecijfer",
    "expected": "Verwacht",
    "actual": "Werkelijk",
    "pass": "Geslaagd",
    "fail": "Mislukt",
    "unknown": "Onbekend",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "sv": {
    "type": "ISBN-typ",
    "normalized": "Normaliserad ISBN",
    "checksum": "Kontrollsumma",
    "checkDigit": "Kontrollsiffra",
    "expected": "Förväntad",
    "actual": "Faktisk",
    "pass": "Godkänd",
    "fail": "Misslyckad",
    "unknown": "Okänt",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "pl": {
    "type": "Typ ISBN",
    "normalized": "Znormalizowany ISBN",
    "checksum": "Suma kontrolna",
    "checkDigit": "Cyfra kontrolna",
    "expected": "Oczekiwane",
    "actual": "Rzeczywiste",
    "pass": "Zaliczony",
    "fail": "Niezaliczony",
    "unknown": "Nieznany",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "vi": {
    "type": "Loại ISBN",
    "normalized": "ISBN chuẩn hóa",
    "checksum": "Checksum",
    "checkDigit": "Chữ số kiểm tra",
    "expected": "Dự kiến",
    "actual": "Thực tế",
    "pass": "Đạt",
    "fail": "Không đạt",
    "unknown": "Không xác định",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "th": {
    "type": "ประเภท ISBN",
    "normalized": "ISBN ที่ปรับรูปแบบ",
    "checksum": "Checksum",
    "checkDigit": "เลขตรวจสอบ",
    "expected": "ที่คาดไว้",
    "actual": "จริง",
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน",
    "unknown": "ไม่ทราบ",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "id": {
    "type": "Tipe ISBN",
    "normalized": "ISBN ternormalisasi",
    "checksum": "Checksum",
    "checkDigit": "Digit pemeriksa",
    "expected": "Diharapkan",
    "actual": "Aktual",
    "pass": "Lulus",
    "fail": "Gagal",
    "unknown": "Tidak diketahui",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "he": {
    "type": "סוג ISBN",
    "normalized": "ISBN מנורמל",
    "checksum": "סכום ביקורת",
    "checkDigit": "ספרת ביקורת",
    "expected": "צפוי",
    "actual": "בפועל",
    "pass": "עבר",
    "fail": "נכשל",
    "unknown": "לא ידוע",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "ms": {
    "type": "Jenis ISBN",
    "normalized": "ISBN dinormalkan",
    "checksum": "Checksum",
    "checkDigit": "Digit semakan",
    "expected": "Dijangka",
    "actual": "Sebenar",
    "pass": "Lulus",
    "fail": "Gagal",
    "unknown": "Tidak diketahui",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  },
  "no": {
    "type": "ISBN-type",
    "normalized": "Normalisert ISBN",
    "checksum": "Kontrollsum",
    "checkDigit": "Kontrollsiffer",
    "expected": "Forventet",
    "actual": "Faktisk",
    "pass": "Bestått",
    "fail": "Mislykket",
    "unknown": "Ukjent",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13"
  }
}
</i18n>
