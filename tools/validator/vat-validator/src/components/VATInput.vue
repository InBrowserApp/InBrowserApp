<template>
  <NFormItem :label="t('vat')" :feedback="feedbackMessage" :validation-status="validationStatus">
    <NInput
      :value="modelValue"
      :placeholder="t('placeholder')"
      :status="inputStatus"
      size="large"
      @update:value="modelValue = $event"
    >
      <template #prefix>
        <NIcon :component="TextNumberFormatIcon" :size="24" />
      </template>
    </NInput>
  </NFormItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItem, NInput, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import TextNumberFormatIcon from '@vicons/fluent/TextNumberFormat20Regular'
import type { VATValidationResult } from '../data/vat'

const props = defineProps<{
  validationResult: VATValidationResult
}>()

const modelValue = defineModel<string>({ required: true })

const { t } = useI18n()

const inputStatus = computed(() => {
  if (modelValue.value.length === 0) return undefined
  return props.validationResult.isValid ? 'success' : 'error'
})

const validationStatus = computed(() => {
  if (modelValue.value.length === 0) return undefined
  return props.validationResult.isValid ? 'success' : 'error'
})

const feedbackMessage = computed(() => {
  if (modelValue.value.length === 0) return undefined
  if (props.validationResult.isValid) return t('valid')
  if (!props.validationResult.isCountryCodeValid) return t('invalidCountryCode')
  if (!props.validationResult.isCountrySupported) return t('unsupportedCountry')
  if (!props.validationResult.isFormatValid) return t('invalidFormat')
  if (props.validationResult.isChecksumSupported && !props.validationResult.isChecksumValid) {
    return t('invalidChecksum')
  }
  return t('invalid')
})
</script>

<i18n lang="json">
{
  "en": {
    "vat": "VAT Number",
    "placeholder": "Enter VAT number",
    "valid": "Valid VAT number",
    "invalid": "Invalid VAT number",
    "invalidCountryCode": "Invalid country code",
    "unsupportedCountry": "Country not supported",
    "invalidFormat": "Invalid VAT format",
    "invalidChecksum": "Invalid checksum"
  },
  "zh": {
    "vat": "VAT 号码",
    "placeholder": "输入 VAT 号码",
    "valid": "有效的 VAT 号码",
    "invalid": "无效的 VAT 号码",
    "invalidCountryCode": "国家代码无效",
    "unsupportedCountry": "不支持的国家",
    "invalidFormat": "VAT 格式无效",
    "invalidChecksum": "校验和无效"
  },
  "zh-CN": {
    "vat": "VAT 号码",
    "placeholder": "输入 VAT 号码",
    "valid": "有效的 VAT 号码",
    "invalid": "无效的 VAT 号码",
    "invalidCountryCode": "国家代码无效",
    "unsupportedCountry": "不支持的国家",
    "invalidFormat": "VAT 格式无效",
    "invalidChecksum": "校验和无效"
  },
  "zh-TW": {
    "vat": "VAT 號碼",
    "placeholder": "輸入 VAT 號碼",
    "valid": "有效的 VAT 號碼",
    "invalid": "無效的 VAT 號碼",
    "invalidCountryCode": "國家代碼無效",
    "unsupportedCountry": "不支援的國家",
    "invalidFormat": "VAT 格式無效",
    "invalidChecksum": "校驗和無效"
  },
  "zh-HK": {
    "vat": "VAT 號碼",
    "placeholder": "輸入 VAT 號碼",
    "valid": "有效的 VAT 號碼",
    "invalid": "無效的 VAT 號碼",
    "invalidCountryCode": "國家代碼無效",
    "unsupportedCountry": "不支援的國家",
    "invalidFormat": "VAT 格式無效",
    "invalidChecksum": "校驗和無效"
  },
  "es": {
    "vat": "Número de IVA",
    "placeholder": "Ingrese el número de IVA",
    "valid": "Número de IVA válido",
    "invalid": "Número de IVA inválido",
    "invalidCountryCode": "Código de país inválido",
    "unsupportedCountry": "País no compatible",
    "invalidFormat": "Formato de IVA inválido",
    "invalidChecksum": "Suma de verificación inválida"
  },
  "fr": {
    "vat": "Numéro de TVA",
    "placeholder": "Entrez le numéro de TVA",
    "valid": "Numéro de TVA valide",
    "invalid": "Numéro de TVA invalide",
    "invalidCountryCode": "Code pays invalide",
    "unsupportedCountry": "Pays non pris en charge",
    "invalidFormat": "Format de TVA invalide",
    "invalidChecksum": "Somme de contrôle invalide"
  },
  "de": {
    "vat": "USt-IdNr.",
    "placeholder": "USt-IdNr. eingeben",
    "valid": "Gültige USt-IdNr.",
    "invalid": "Ungültige USt-IdNr.",
    "invalidCountryCode": "Ungültiger Ländercode",
    "unsupportedCountry": "Land nicht unterstützt",
    "invalidFormat": "Ungültiges USt-IdNr.-Format",
    "invalidChecksum": "Ungültige Prüfsumme"
  },
  "it": {
    "vat": "Partita IVA",
    "placeholder": "Inserisci la partita IVA",
    "valid": "Partita IVA valida",
    "invalid": "Partita IVA non valida",
    "invalidCountryCode": "Codice paese non valido",
    "unsupportedCountry": "Paese non supportato",
    "invalidFormat": "Formato partita IVA non valido",
    "invalidChecksum": "Checksum non valido"
  },
  "ja": {
    "vat": "VAT 番号",
    "placeholder": "VAT 番号を入力",
    "valid": "有効な VAT 番号",
    "invalid": "無効な VAT 番号",
    "invalidCountryCode": "国コードが無効",
    "unsupportedCountry": "未対応の国",
    "invalidFormat": "VAT の形式が無効",
    "invalidChecksum": "チェックサムが無効"
  },
  "ko": {
    "vat": "VAT 번호",
    "placeholder": "VAT 번호 입력",
    "valid": "유효한 VAT 번호",
    "invalid": "유효하지 않은 VAT 번호",
    "invalidCountryCode": "국가 코드가 올바르지 않습니다",
    "unsupportedCountry": "지원되지 않는 국가",
    "invalidFormat": "VAT 형식이 올바르지 않습니다",
    "invalidChecksum": "체크섬이 올바르지 않습니다"
  },
  "ru": {
    "vat": "Номер НДС",
    "placeholder": "Введите номер НДС",
    "valid": "Действительный номер НДС",
    "invalid": "Недействительный номер НДС",
    "invalidCountryCode": "Недействительный код страны",
    "unsupportedCountry": "Страна не поддерживается",
    "invalidFormat": "Неверный формат НДС",
    "invalidChecksum": "Неверная контрольная сумма"
  },
  "pt": {
    "vat": "Número de IVA",
    "placeholder": "Digite o número de IVA",
    "valid": "Número de IVA válido",
    "invalid": "Número de IVA inválido",
    "invalidCountryCode": "Código de país inválido",
    "unsupportedCountry": "País não suportado",
    "invalidFormat": "Formato de IVA inválido",
    "invalidChecksum": "Checksum inválido"
  },
  "ar": {
    "vat": "رقم ضريبة القيمة المضافة",
    "placeholder": "أدخل رقم ضريبة القيمة المضافة",
    "valid": "رقم ضريبة القيمة المضافة صالح",
    "invalid": "رقم ضريبة القيمة المضافة غير صالح",
    "invalidCountryCode": "رمز البلد غير صالح",
    "unsupportedCountry": "البلد غير مدعوم",
    "invalidFormat": "تنسيق رقم ضريبة القيمة المضافة غير صالح",
    "invalidChecksum": "المجموع الاختباري غير صالح"
  },
  "hi": {
    "vat": "VAT नंबर",
    "placeholder": "VAT नंबर दर्ज करें",
    "valid": "मान्य VAT नंबर",
    "invalid": "अमान्य VAT नंबर",
    "invalidCountryCode": "अमान्य देश कोड",
    "unsupportedCountry": "देश समर्थित नहीं है",
    "invalidFormat": "VAT प्रारूप अमान्य है",
    "invalidChecksum": "चेकसम अमान्य है"
  },
  "tr": {
    "vat": "KDV Numarası",
    "placeholder": "KDV numarası girin",
    "valid": "Geçerli KDV numarası",
    "invalid": "Geçersiz KDV numarası",
    "invalidCountryCode": "Geçersiz ülke kodu",
    "unsupportedCountry": "Ülke desteklenmiyor",
    "invalidFormat": "Geçersiz KDV formatı",
    "invalidChecksum": "Geçersiz sağlama toplamı"
  },
  "nl": {
    "vat": "Btw-nummer",
    "placeholder": "Voer btw-nummer in",
    "valid": "Geldig btw-nummer",
    "invalid": "Ongeldig btw-nummer",
    "invalidCountryCode": "Ongeldige landcode",
    "unsupportedCountry": "Land niet ondersteund",
    "invalidFormat": "Ongeldig btw-formaat",
    "invalidChecksum": "Ongeldige controlesom"
  },
  "sv": {
    "vat": "VAT-nummer",
    "placeholder": "Ange VAT-nummer",
    "valid": "Giltigt VAT-nummer",
    "invalid": "Ogiltigt VAT-nummer",
    "invalidCountryCode": "Ogiltig landskod",
    "unsupportedCountry": "Land stöds inte",
    "invalidFormat": "Ogiltigt VAT-format",
    "invalidChecksum": "Ogiltig kontrollsumma"
  },
  "pl": {
    "vat": "Numer VAT",
    "placeholder": "Wpisz numer VAT",
    "valid": "Poprawny numer VAT",
    "invalid": "Niepoprawny numer VAT",
    "invalidCountryCode": "Nieprawidłowy kod kraju",
    "unsupportedCountry": "Kraj nieobsługiwany",
    "invalidFormat": "Nieprawidłowy format VAT",
    "invalidChecksum": "Nieprawidłowa suma kontrolna"
  },
  "vi": {
    "vat": "Số VAT",
    "placeholder": "Nhập số VAT",
    "valid": "Số VAT hợp lệ",
    "invalid": "Số VAT không hợp lệ",
    "invalidCountryCode": "Mã quốc gia không hợp lệ",
    "unsupportedCountry": "Quốc gia không được hỗ trợ",
    "invalidFormat": "Định dạng VAT không hợp lệ",
    "invalidChecksum": "Checksum không hợp lệ"
  },
  "th": {
    "vat": "หมายเลข VAT",
    "placeholder": "กรอกหมายเลข VAT",
    "valid": "หมายเลข VAT ถูกต้อง",
    "invalid": "หมายเลข VAT ไม่ถูกต้อง",
    "invalidCountryCode": "รหัสประเทศไม่ถูกต้อง",
    "unsupportedCountry": "ประเทศไม่รองรับ",
    "invalidFormat": "รูปแบบ VAT ไม่ถูกต้อง",
    "invalidChecksum": "ผลรวมตรวจสอบไม่ถูกต้อง"
  },
  "id": {
    "vat": "Nomor VAT",
    "placeholder": "Masukkan nomor VAT",
    "valid": "Nomor VAT valid",
    "invalid": "Nomor VAT tidak valid",
    "invalidCountryCode": "Kode negara tidak valid",
    "unsupportedCountry": "Negara tidak didukung",
    "invalidFormat": "Format VAT tidak valid",
    "invalidChecksum": "Checksum tidak valid"
  },
  "he": {
    "vat": "מספר מע״מ",
    "placeholder": "הזן מספר מע״מ",
    "valid": "מספר מע״מ תקין",
    "invalid": "מספר מע״מ לא תקין",
    "invalidCountryCode": "קוד מדינה לא תקין",
    "unsupportedCountry": "מדינה לא נתמכת",
    "invalidFormat": "פורמט מע״מ לא תקין",
    "invalidChecksum": "סכום ביקורת לא תקין"
  },
  "ms": {
    "vat": "Nombor VAT",
    "placeholder": "Masukkan nombor VAT",
    "valid": "Nombor VAT sah",
    "invalid": "Nombor VAT tidak sah",
    "invalidCountryCode": "Kod negara tidak sah",
    "unsupportedCountry": "Negara tidak disokong",
    "invalidFormat": "Format VAT tidak sah",
    "invalidChecksum": "Checksum tidak sah"
  },
  "no": {
    "vat": "MVA-nummer",
    "placeholder": "Skriv inn MVA-nummer",
    "valid": "Gyldig MVA-nummer",
    "invalid": "Ugyldig MVA-nummer",
    "invalidCountryCode": "Ugyldig landskode",
    "unsupportedCountry": "Land støttes ikke",
    "invalidFormat": "Ugyldig MVA-format",
    "invalidChecksum": "Ugyldig kontrollsum"
  }
}
</i18n>
