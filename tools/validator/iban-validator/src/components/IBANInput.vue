<template>
  <NFormItem :label="t('iban')" :feedback="feedbackMessage" :validation-status="validationStatus">
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
import type { IBANValidationResult } from '../data/iban'

const props = defineProps<{
  validationResult: IBANValidationResult
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
  if (!props.validationResult.isCountryValid) return t('invalidCountry')
  if (!props.validationResult.isLengthValid) return t('invalidLength')
  if (!props.validationResult.isFormatValid || !props.validationResult.isStructureValid) {
    return t('invalidFormat')
  }
  if (!props.validationResult.isChecksumValid) return t('invalidChecksum')
  return t('invalid')
})
</script>

<i18n lang="json">
{
  "en": {
    "iban": "IBAN",
    "placeholder": "Enter IBAN",
    "valid": "Valid IBAN",
    "invalid": "Invalid IBAN",
    "invalidCountry": "Unknown country code",
    "invalidLength": "Invalid IBAN length",
    "invalidFormat": "Invalid IBAN format",
    "invalidChecksum": "Invalid checksum"
  },
  "zh": {
    "iban": "IBAN",
    "placeholder": "输入 IBAN",
    "valid": "有效的 IBAN",
    "invalid": "无效的 IBAN",
    "invalidCountry": "未知的国家代码",
    "invalidLength": "IBAN 长度无效",
    "invalidFormat": "IBAN 格式无效",
    "invalidChecksum": "校验和无效"
  },
  "zh-CN": {
    "iban": "IBAN",
    "placeholder": "输入 IBAN",
    "valid": "有效的 IBAN",
    "invalid": "无效的 IBAN",
    "invalidCountry": "未知的国家代码",
    "invalidLength": "IBAN 长度无效",
    "invalidFormat": "IBAN 格式无效",
    "invalidChecksum": "校验和无效"
  },
  "zh-TW": {
    "iban": "IBAN",
    "placeholder": "輸入 IBAN",
    "valid": "有效的 IBAN",
    "invalid": "無效的 IBAN",
    "invalidCountry": "未知的國家代碼",
    "invalidLength": "IBAN 長度無效",
    "invalidFormat": "IBAN 格式無效",
    "invalidChecksum": "校驗和無效"
  },
  "zh-HK": {
    "iban": "IBAN",
    "placeholder": "輸入 IBAN",
    "valid": "有效的 IBAN",
    "invalid": "無效的 IBAN",
    "invalidCountry": "未知的國家代碼",
    "invalidLength": "IBAN 長度無效",
    "invalidFormat": "IBAN 格式無效",
    "invalidChecksum": "校驗和無效"
  },
  "es": {
    "iban": "IBAN",
    "placeholder": "Ingrese IBAN",
    "valid": "IBAN válido",
    "invalid": "IBAN inválido",
    "invalidCountry": "Código de país desconocido",
    "invalidLength": "Longitud de IBAN inválida",
    "invalidFormat": "Formato de IBAN inválido",
    "invalidChecksum": "Suma de verificación inválida"
  },
  "fr": {
    "iban": "IBAN",
    "placeholder": "Entrez un IBAN",
    "valid": "IBAN valide",
    "invalid": "IBAN invalide",
    "invalidCountry": "Code pays inconnu",
    "invalidLength": "Longueur d'IBAN invalide",
    "invalidFormat": "Format d'IBAN invalide",
    "invalidChecksum": "Somme de contrôle invalide"
  },
  "de": {
    "iban": "IBAN",
    "placeholder": "IBAN eingeben",
    "valid": "Gültige IBAN",
    "invalid": "Ungültige IBAN",
    "invalidCountry": "Unbekannter Ländercode",
    "invalidLength": "Ungültige IBAN-Länge",
    "invalidFormat": "Ungültiges IBAN-Format",
    "invalidChecksum": "Ungültige Prüfsumme"
  },
  "it": {
    "iban": "IBAN",
    "placeholder": "Inserisci IBAN",
    "valid": "IBAN valido",
    "invalid": "IBAN non valido",
    "invalidCountry": "Codice paese sconosciuto",
    "invalidLength": "Lunghezza IBAN non valida",
    "invalidFormat": "Formato IBAN non valido",
    "invalidChecksum": "Checksum non valido"
  },
  "ja": {
    "iban": "IBAN",
    "placeholder": "IBAN を入力",
    "valid": "有効な IBAN",
    "invalid": "無効な IBAN",
    "invalidCountry": "国コードが不明",
    "invalidLength": "IBAN の長さが無効",
    "invalidFormat": "IBAN の形式が無効",
    "invalidChecksum": "チェックサムが無効"
  },
  "ko": {
    "iban": "IBAN",
    "placeholder": "IBAN 입력",
    "valid": "유효한 IBAN",
    "invalid": "유효하지 않은 IBAN",
    "invalidCountry": "알 수 없는 국가 코드",
    "invalidLength": "IBAN 길이 오류",
    "invalidFormat": "IBAN 형식이 올바르지 않습니다",
    "invalidChecksum": "체크섬이 잘못됨"
  },
  "ru": {
    "iban": "IBAN",
    "placeholder": "Введите IBAN",
    "valid": "Действительный IBAN",
    "invalid": "Недействительный IBAN",
    "invalidCountry": "Неизвестный код страны",
    "invalidLength": "Неверная длина IBAN",
    "invalidFormat": "Неверный формат IBAN",
    "invalidChecksum": "Неверная контрольная сумма"
  },
  "pt": {
    "iban": "IBAN",
    "placeholder": "Digite o IBAN",
    "valid": "IBAN válido",
    "invalid": "IBAN inválido",
    "invalidCountry": "Código do país desconhecido",
    "invalidLength": "Comprimento do IBAN inválido",
    "invalidFormat": "Formato de IBAN inválido",
    "invalidChecksum": "Dígito verificador inválido"
  },
  "ar": {
    "iban": "IBAN",
    "placeholder": "أدخل IBAN",
    "valid": "IBAN صالح",
    "invalid": "IBAN غير صالح",
    "invalidCountry": "رمز بلد غير معروف",
    "invalidLength": "طول IBAN غير صالح",
    "invalidFormat": "تنسيق IBAN غير صالح",
    "invalidChecksum": "مجموع التحقق غير صالح"
  },
  "hi": {
    "iban": "IBAN",
    "placeholder": "IBAN दर्ज करें",
    "valid": "मान्य IBAN",
    "invalid": "अमान्य IBAN",
    "invalidCountry": "अज्ञात देश कोड",
    "invalidLength": "IBAN की लंबाई अमान्य",
    "invalidFormat": "IBAN प्रारूप अमान्य",
    "invalidChecksum": "चेकसम अमान्य"
  },
  "tr": {
    "iban": "IBAN",
    "placeholder": "IBAN girin",
    "valid": "Geçerli IBAN",
    "invalid": "Geçersiz IBAN",
    "invalidCountry": "Bilinmeyen ülke kodu",
    "invalidLength": "Geçersiz IBAN uzunluğu",
    "invalidFormat": "Geçersiz IBAN biçimi",
    "invalidChecksum": "Geçersiz sağlama toplamı"
  },
  "nl": {
    "iban": "IBAN",
    "placeholder": "IBAN invoeren",
    "valid": "Geldige IBAN",
    "invalid": "Ongeldige IBAN",
    "invalidCountry": "Onbekende landcode",
    "invalidLength": "Ongeldige IBAN-lengte",
    "invalidFormat": "Ongeldig IBAN-formaat",
    "invalidChecksum": "Ongeldige controlesom"
  },
  "sv": {
    "iban": "IBAN",
    "placeholder": "Ange IBAN",
    "valid": "Giltig IBAN",
    "invalid": "Ogiltig IBAN",
    "invalidCountry": "Okänd landskod",
    "invalidLength": "Ogiltig IBAN-längd",
    "invalidFormat": "Ogiltigt IBAN-format",
    "invalidChecksum": "Ogiltig kontrollsumma"
  },
  "pl": {
    "iban": "IBAN",
    "placeholder": "Wpisz IBAN",
    "valid": "Poprawny IBAN",
    "invalid": "Niepoprawny IBAN",
    "invalidCountry": "Nieznany kod kraju",
    "invalidLength": "Nieprawidłowa długość IBAN",
    "invalidFormat": "Nieprawidłowy format IBAN",
    "invalidChecksum": "Nieprawidłowa suma kontrolna"
  },
  "vi": {
    "iban": "IBAN",
    "placeholder": "Nhập IBAN",
    "valid": "IBAN hợp lệ",
    "invalid": "IBAN không hợp lệ",
    "invalidCountry": "Mã quốc gia không xác định",
    "invalidLength": "Độ dài IBAN không hợp lệ",
    "invalidFormat": "Định dạng IBAN không hợp lệ",
    "invalidChecksum": "Checksum không hợp lệ"
  },
  "th": {
    "iban": "IBAN",
    "placeholder": "ป้อน IBAN",
    "valid": "IBAN ถูกต้อง",
    "invalid": "IBAN ไม่ถูกต้อง",
    "invalidCountry": "รหัสประเทศไม่ทราบ",
    "invalidLength": "ความยาว IBAN ไม่ถูกต้อง",
    "invalidFormat": "รูปแบบ IBAN ไม่ถูกต้อง",
    "invalidChecksum": "ผลรวมตรวจสอบไม่ถูกต้อง"
  },
  "id": {
    "iban": "IBAN",
    "placeholder": "Masukkan IBAN",
    "valid": "IBAN valid",
    "invalid": "IBAN tidak valid",
    "invalidCountry": "Kode negara tidak dikenal",
    "invalidLength": "Panjang IBAN tidak valid",
    "invalidFormat": "Format IBAN tidak valid",
    "invalidChecksum": "Checksum tidak valid"
  },
  "he": {
    "iban": "IBAN",
    "placeholder": "הזן IBAN",
    "valid": "IBAN תקין",
    "invalid": "IBAN לא תקין",
    "invalidCountry": "קוד מדינה לא מוכר",
    "invalidLength": "אורך IBAN לא תקין",
    "invalidFormat": "פורמט IBAN לא תקין",
    "invalidChecksum": "סכום ביקורת לא תקין"
  },
  "ms": {
    "iban": "IBAN",
    "placeholder": "Masukkan IBAN",
    "valid": "IBAN sah",
    "invalid": "IBAN tidak sah",
    "invalidCountry": "Kod negara tidak diketahui",
    "invalidLength": "Panjang IBAN tidak sah",
    "invalidFormat": "Format IBAN tidak sah",
    "invalidChecksum": "Checksum tidak sah"
  },
  "no": {
    "iban": "IBAN",
    "placeholder": "Skriv inn IBAN",
    "valid": "Gyldig IBAN",
    "invalid": "Ugyldig IBAN",
    "invalidCountry": "Ukjent landskode",
    "invalidLength": "Ugyldig IBAN-lengde",
    "invalidFormat": "Ugyldig IBAN-format",
    "invalidChecksum": "Ugyldig kontrollsum"
  }
}
</i18n>
