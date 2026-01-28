<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
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
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
/* eslint-disable max-lines */
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { ISBNValidationResult } from '../data/isbn'

const { t } = useI18n()

const props = defineProps<{
  validationResult: ISBNValidationResult
}>()

const typeLabel = computed(() => {
  if (props.validationResult.type === 'isbn-10') return t('isbn10')
  if (props.validationResult.type === 'isbn-13') return t('isbn13')
  return t('unknown')
})

const expectedDigit = computed(() => props.validationResult.expectedCheckDigit ?? '-')
const actualDigit = computed(() => props.validationResult.actualCheckDigit ?? '-')

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
    "result": "Validation Result",
    "type": "ISBN Type",
    "normalized": "Normalized ISBN",
    "checksum": "Checksum",
    "checkDigit": "Check Digit",
    "expected": "Expected",
    "actual": "Actual",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefix",
    "digits": "Total Digits",
    "pass": "Pass",
    "fail": "Fail",
    "unknown": "Unknown",
    "notAvailable": "Not available",
    "notConvertible": "Not convertible"
  },
  "zh": {
    "result": "验证结果",
    "type": "ISBN 类型",
    "normalized": "标准化 ISBN",
    "checksum": "校验和",
    "checkDigit": "校验位",
    "expected": "期望",
    "actual": "实际",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "前缀",
    "digits": "总位数",
    "pass": "通过",
    "fail": "失败",
    "unknown": "未知",
    "notAvailable": "不可用",
    "notConvertible": "无法转换"
  },
  "zh-CN": {
    "result": "验证结果",
    "type": "ISBN 类型",
    "normalized": "标准化 ISBN",
    "checksum": "校验和",
    "checkDigit": "校验位",
    "expected": "期望",
    "actual": "实际",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "前缀",
    "digits": "总位数",
    "pass": "通过",
    "fail": "失败",
    "unknown": "未知",
    "notAvailable": "不可用",
    "notConvertible": "无法转换"
  },
  "zh-TW": {
    "result": "驗證結果",
    "type": "ISBN 類型",
    "normalized": "標準化 ISBN",
    "checksum": "校驗和",
    "checkDigit": "校驗位",
    "expected": "期望",
    "actual": "實際",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "前綴",
    "digits": "總位數",
    "pass": "通過",
    "fail": "失敗",
    "unknown": "未知",
    "notAvailable": "不可用",
    "notConvertible": "無法轉換"
  },
  "zh-HK": {
    "result": "驗證結果",
    "type": "ISBN 類型",
    "normalized": "標準化 ISBN",
    "checksum": "校驗和",
    "checkDigit": "校驗位",
    "expected": "期望",
    "actual": "實際",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "前綴",
    "digits": "總位數",
    "pass": "通過",
    "fail": "失敗",
    "unknown": "未知",
    "notAvailable": "不可用",
    "notConvertible": "無法轉換"
  },
  "es": {
    "result": "Resultado de Validación",
    "type": "Tipo de ISBN",
    "normalized": "ISBN normalizado",
    "checksum": "Suma de verificación",
    "checkDigit": "Dígito de control",
    "expected": "Esperado",
    "actual": "Actual",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefijo",
    "digits": "Dígitos totales",
    "pass": "Aprobado",
    "fail": "Fallido",
    "unknown": "Desconocido",
    "notAvailable": "No disponible",
    "notConvertible": "No convertible"
  },
  "fr": {
    "result": "Résultat de Validation",
    "type": "Type ISBN",
    "normalized": "ISBN normalisé",
    "checksum": "Somme de contrôle",
    "checkDigit": "Chiffre de contrôle",
    "expected": "Attendu",
    "actual": "Actuel",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Préfixe",
    "digits": "Chiffres totaux",
    "pass": "Réussi",
    "fail": "Échoué",
    "unknown": "Inconnu",
    "notAvailable": "Non disponible",
    "notConvertible": "Non convertible"
  },
  "de": {
    "result": "Validierungsergebnis",
    "type": "ISBN-Typ",
    "normalized": "Normalisierte ISBN",
    "checksum": "Prüfsumme",
    "checkDigit": "Prüfziffer",
    "expected": "Erwartet",
    "actual": "Tatsächlich",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Präfix",
    "digits": "Gesamtziffern",
    "pass": "Bestanden",
    "fail": "Fehlgeschlagen",
    "unknown": "Unbekannt",
    "notAvailable": "Nicht verfügbar",
    "notConvertible": "Nicht konvertierbar"
  },
  "it": {
    "result": "Risultato Validazione",
    "type": "Tipo ISBN",
    "normalized": "ISBN normalizzato",
    "checksum": "Somma di controllo",
    "checkDigit": "Cifra di controllo",
    "expected": "Previsto",
    "actual": "Attuale",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefisso",
    "digits": "Cifre totali",
    "pass": "Superato",
    "fail": "Fallito",
    "unknown": "Sconosciuto",
    "notAvailable": "Non disponibile",
    "notConvertible": "Non convertibile"
  },
  "ja": {
    "result": "検証結果",
    "type": "ISBN 種別",
    "normalized": "正規化 ISBN",
    "checksum": "チェックサム",
    "checkDigit": "チェックディジット",
    "expected": "期待",
    "actual": "実際",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "プレフィックス",
    "digits": "総桁数",
    "pass": "合格",
    "fail": "不合格",
    "unknown": "不明",
    "notAvailable": "利用不可",
    "notConvertible": "変換不可"
  },
  "ko": {
    "result": "검증 결과",
    "type": "ISBN 유형",
    "normalized": "정규화된 ISBN",
    "checksum": "체크섬",
    "checkDigit": "체크 디지트",
    "expected": "예상",
    "actual": "실제",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "접두사",
    "digits": "총 자릿수",
    "pass": "통과",
    "fail": "실패",
    "unknown": "알 수 없음",
    "notAvailable": "사용할 수 없음",
    "notConvertible": "변환 불가"
  },
  "ru": {
    "result": "Результат Проверки",
    "type": "Тип ISBN",
    "normalized": "Нормализованный ISBN",
    "checksum": "Контрольная сумма",
    "checkDigit": "Контрольная цифра",
    "expected": "Ожидается",
    "actual": "Фактическая",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Префикс",
    "digits": "Всего цифр",
    "pass": "Пройдено",
    "fail": "Не пройдено",
    "unknown": "Неизвестно",
    "notAvailable": "Недоступно",
    "notConvertible": "Невозможно преобразовать"
  },
  "pt": {
    "result": "Resultado da Validação",
    "type": "Tipo de ISBN",
    "normalized": "ISBN normalizado",
    "checksum": "Soma de verificação",
    "checkDigit": "Dígito verificador",
    "expected": "Esperado",
    "actual": "Atual",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefixo",
    "digits": "Total de dígitos",
    "pass": "Aprovado",
    "fail": "Reprovado",
    "unknown": "Desconhecido",
    "notAvailable": "Indisponível",
    "notConvertible": "Não conversível"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "type": "نوع ISBN",
    "normalized": "ISBN مُطبّع",
    "checksum": "مجموع التحقق",
    "checkDigit": "رقم التحقق",
    "expected": "المتوقع",
    "actual": "الفعلي",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "البادئة",
    "digits": "إجمالي الأرقام",
    "pass": "ناجح",
    "fail": "فاشل",
    "unknown": "غير معروف",
    "notAvailable": "غير متاح",
    "notConvertible": "غير قابل للتحويل"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "type": "ISBN प्रकार",
    "normalized": "मानकीकृत ISBN",
    "checksum": "चेकसम",
    "checkDigit": "चेक अंक",
    "expected": "अपेक्षित",
    "actual": "वास्तविक",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "उपसर्ग",
    "digits": "कुल अंक",
    "pass": "उत्तीर्ण",
    "fail": "असफल",
    "unknown": "अज्ञात",
    "notAvailable": "उपलब्ध नहीं",
    "notConvertible": "रूपांतरित नहीं हो सकता"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "type": "ISBN Türü",
    "normalized": "Normalize ISBN",
    "checksum": "Sağlama toplamı",
    "checkDigit": "Kontrol basamağı",
    "expected": "Beklenen",
    "actual": "Gerçek",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Önek",
    "digits": "Toplam Rakam",
    "pass": "Geçti",
    "fail": "Başarısız",
    "unknown": "Bilinmiyor",
    "notAvailable": "Kullanılamıyor",
    "notConvertible": "Dönüştürülemez"
  },
  "nl": {
    "result": "Validatieresultaat",
    "type": "ISBN-type",
    "normalized": "Genormaliseerde ISBN",
    "checksum": "Controlesom",
    "checkDigit": "Controlecijfer",
    "expected": "Verwacht",
    "actual": "Werkelijk",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefix",
    "digits": "Totaal cijfers",
    "pass": "Geslaagd",
    "fail": "Mislukt",
    "unknown": "Onbekend",
    "notAvailable": "Niet beschikbaar",
    "notConvertible": "Niet converteerbaar"
  },
  "sv": {
    "result": "Valideringsresultat",
    "type": "ISBN-typ",
    "normalized": "Normaliserad ISBN",
    "checksum": "Kontrollsumma",
    "checkDigit": "Kontrollsiffra",
    "expected": "Förväntad",
    "actual": "Faktisk",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefix",
    "digits": "Totalt Siffror",
    "pass": "Godkänd",
    "fail": "Misslyckad",
    "unknown": "Okänt",
    "notAvailable": "Inte tillgänglig",
    "notConvertible": "Kan inte konverteras"
  },
  "pl": {
    "result": "Wynik Walidacji",
    "type": "Typ ISBN",
    "normalized": "Znormalizowany ISBN",
    "checksum": "Suma kontrolna",
    "checkDigit": "Cyfra kontrolna",
    "expected": "Oczekiwane",
    "actual": "Rzeczywiste",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefiks",
    "digits": "Łączna liczba cyfr",
    "pass": "Zaliczony",
    "fail": "Niezaliczony",
    "unknown": "Nieznany",
    "notAvailable": "Niedostępne",
    "notConvertible": "Nie do konwersji"
  },
  "vi": {
    "result": "Kết Quả Xác Thực",
    "type": "Loại ISBN",
    "normalized": "ISBN chuẩn hóa",
    "checksum": "Checksum",
    "checkDigit": "Chữ số kiểm tra",
    "expected": "Dự kiến",
    "actual": "Thực tế",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Tiền tố",
    "digits": "Tổng số chữ số",
    "pass": "Đạt",
    "fail": "Không đạt",
    "unknown": "Không xác định",
    "notAvailable": "Không khả dụng",
    "notConvertible": "Không thể chuyển đổi"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "type": "ประเภท ISBN",
    "normalized": "ISBN ที่ปรับรูปแบบ",
    "checksum": "Checksum",
    "checkDigit": "เลขตรวจสอบ",
    "expected": "ที่คาดไว้",
    "actual": "จริง",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "คำนำหน้า",
    "digits": "จำนวนหลักทั้งหมด",
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน",
    "unknown": "ไม่ทราบ",
    "notAvailable": "ไม่พร้อมใช้งาน",
    "notConvertible": "ไม่สามารถแปลงได้"
  },
  "id": {
    "result": "Hasil Validasi",
    "type": "Tipe ISBN",
    "normalized": "ISBN ternormalisasi",
    "checksum": "Checksum",
    "checkDigit": "Digit pemeriksa",
    "expected": "Diharapkan",
    "actual": "Aktual",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefiks",
    "digits": "Total digit",
    "pass": "Lulus",
    "fail": "Gagal",
    "unknown": "Tidak diketahui",
    "notAvailable": "Tidak tersedia",
    "notConvertible": "Tidak dapat dikonversi"
  },
  "he": {
    "result": "תוצאת אימות",
    "type": "סוג ISBN",
    "normalized": "ISBN מנורמל",
    "checksum": "סכום ביקורת",
    "checkDigit": "ספרת ביקורת",
    "expected": "צפוי",
    "actual": "בפועל",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "קידומת",
    "digits": "סה\"כ ספרות",
    "pass": "עבר",
    "fail": "נכשל",
    "unknown": "לא ידוע",
    "notAvailable": "לא זמין",
    "notConvertible": "לא ניתן להמרה"
  },
  "ms": {
    "result": "Keputusan Pengesahan",
    "type": "Jenis ISBN",
    "normalized": "ISBN dinormalkan",
    "checksum": "Checksum",
    "checkDigit": "Digit semakan",
    "expected": "Dijangka",
    "actual": "Sebenar",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Awalan",
    "digits": "Jumlah digit",
    "pass": "Lulus",
    "fail": "Gagal",
    "unknown": "Tidak diketahui",
    "notAvailable": "Tidak tersedia",
    "notConvertible": "Tidak boleh ditukar"
  },
  "no": {
    "result": "Valideringsresultat",
    "type": "ISBN-type",
    "normalized": "Normalisert ISBN",
    "checksum": "Kontrollsum",
    "checkDigit": "Kontrollsiffer",
    "expected": "Forventet",
    "actual": "Faktisk",
    "isbn10": "ISBN-10",
    "isbn13": "ISBN-13",
    "prefix": "Prefiks",
    "digits": "Totalt Sifre",
    "pass": "Bestått",
    "fail": "Mislykket",
    "unknown": "Ukjent",
    "notAvailable": "Ikke tilgjengelig",
    "notConvertible": "Kan ikke konverteres"
  }
}
</i18n>
