<template>
  <NFormItem :label="t('bic')" :feedback="feedbackMessage" :validation-status="validationStatus">
    <NInput
      :value="modelValue"
      :placeholder="t('placeholder')"
      :status="inputStatus"
      size="large"
      @update:value="$emit('update:modelValue', $event)"
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
import type { BICValidationResult } from '../data/bic'

const { t } = useI18n()

const props = defineProps<{
  modelValue: string
  validationResult: BICValidationResult
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputStatus = computed(() => {
  if (props.modelValue.length === 0) return undefined
  return props.validationResult.isValid ? 'success' : 'error'
})

const validationStatus = computed(() => {
  if (props.modelValue.length === 0) return undefined
  return props.validationResult.isValid ? 'success' : 'error'
})

const feedbackMessage = computed(() => {
  if (props.modelValue.length === 0) return undefined
  if (props.validationResult.isValid) return t('valid')
  if (!props.validationResult.isLengthValid) return t('invalidLength')
  if (!props.validationResult.isCountryValid) return t('invalidCountry')
  if (!props.validationResult.isBankCodeValid) return t('invalidBank')
  if (!props.validationResult.isLocationCodeValid) return t('invalidLocation')
  if (!props.validationResult.isBranchCodeValid) return t('invalidBranch')
  if (!props.validationResult.isFormatValid) return t('invalidFormat')
  return t('invalid')
})
</script>

<i18n lang="json">
{
  "en": {
    "bic": "BIC / SWIFT Code",
    "placeholder": "Enter BIC or SWIFT code",
    "valid": "Valid BIC / SWIFT code",
    "invalid": "Invalid BIC / SWIFT code",
    "invalidCountry": "Unknown country code",
    "invalidLength": "BIC must be 8 or 11 characters",
    "invalidFormat": "Invalid BIC format",
    "invalidBank": "Invalid bank code",
    "invalidLocation": "Invalid location code",
    "invalidBranch": "Invalid branch code"
  },
  "zh": {
    "bic": "BIC / SWIFT 代码",
    "placeholder": "输入 BIC 或 SWIFT 代码",
    "valid": "有效的 BIC / SWIFT 代码",
    "invalid": "无效的 BIC / SWIFT 代码",
    "invalidCountry": "未知的国家代码",
    "invalidLength": "BIC 必须为 8 或 11 位",
    "invalidFormat": "BIC 格式无效",
    "invalidBank": "银行代码无效",
    "invalidLocation": "地区代码无效",
    "invalidBranch": "分行代码无效"
  },
  "zh-CN": {
    "bic": "BIC / SWIFT 代码",
    "placeholder": "输入 BIC 或 SWIFT 代码",
    "valid": "有效的 BIC / SWIFT 代码",
    "invalid": "无效的 BIC / SWIFT 代码",
    "invalidCountry": "未知的国家代码",
    "invalidLength": "BIC 必须为 8 或 11 位",
    "invalidFormat": "BIC 格式无效",
    "invalidBank": "银行代码无效",
    "invalidLocation": "地区代码无效",
    "invalidBranch": "分行代码无效"
  },
  "zh-TW": {
    "bic": "BIC / SWIFT 代碼",
    "placeholder": "輸入 BIC 或 SWIFT 代碼",
    "valid": "有效的 BIC / SWIFT 代碼",
    "invalid": "無效的 BIC / SWIFT 代碼",
    "invalidCountry": "未知的國家代碼",
    "invalidLength": "BIC 必須為 8 或 11 位",
    "invalidFormat": "BIC 格式無效",
    "invalidBank": "銀行代碼無效",
    "invalidLocation": "地區代碼無效",
    "invalidBranch": "分行代碼無效"
  },
  "zh-HK": {
    "bic": "BIC / SWIFT 代碼",
    "placeholder": "輸入 BIC 或 SWIFT 代碼",
    "valid": "有效的 BIC / SWIFT 代碼",
    "invalid": "無效的 BIC / SWIFT 代碼",
    "invalidCountry": "未知的國家代碼",
    "invalidLength": "BIC 必須為 8 或 11 位",
    "invalidFormat": "BIC 格式無效",
    "invalidBank": "銀行代碼無效",
    "invalidLocation": "地區代碼無效",
    "invalidBranch": "分行代碼無效"
  },
  "es": {
    "bic": "Código BIC / SWIFT",
    "placeholder": "Ingrese el código BIC o SWIFT",
    "valid": "Código BIC / SWIFT válido",
    "invalid": "Código BIC / SWIFT inválido",
    "invalidCountry": "Código de país desconocido",
    "invalidLength": "El BIC debe tener 8 o 11 caracteres",
    "invalidFormat": "Formato de BIC inválido",
    "invalidBank": "Código de banco inválido",
    "invalidLocation": "Código de ubicación inválido",
    "invalidBranch": "Código de sucursal inválido"
  },
  "fr": {
    "bic": "Code BIC / SWIFT",
    "placeholder": "Entrez un code BIC ou SWIFT",
    "valid": "Code BIC / SWIFT valide",
    "invalid": "Code BIC / SWIFT invalide",
    "invalidCountry": "Code pays inconnu",
    "invalidLength": "Le BIC doit comporter 8 ou 11 caractères",
    "invalidFormat": "Format BIC invalide",
    "invalidBank": "Code banque invalide",
    "invalidLocation": "Code de localisation invalide",
    "invalidBranch": "Code d'agence invalide"
  },
  "de": {
    "bic": "BIC / SWIFT-Code",
    "placeholder": "BIC- oder SWIFT-Code eingeben",
    "valid": "Gültiger BIC / SWIFT-Code",
    "invalid": "Ungültiger BIC / SWIFT-Code",
    "invalidCountry": "Unbekannter Ländercode",
    "invalidLength": "BIC muss 8 oder 11 Zeichen haben",
    "invalidFormat": "Ungültiges BIC-Format",
    "invalidBank": "Ungültiger Bankcode",
    "invalidLocation": "Ungültiger Standortcode",
    "invalidBranch": "Ungültiger Filialcode"
  },
  "it": {
    "bic": "Codice BIC / SWIFT",
    "placeholder": "Inserisci il codice BIC o SWIFT",
    "valid": "Codice BIC / SWIFT valido",
    "invalid": "Codice BIC / SWIFT non valido",
    "invalidCountry": "Codice paese sconosciuto",
    "invalidLength": "Il BIC deve avere 8 o 11 caratteri",
    "invalidFormat": "Formato BIC non valido",
    "invalidBank": "Codice banca non valido",
    "invalidLocation": "Codice località non valido",
    "invalidBranch": "Codice filiale non valido"
  },
  "ja": {
    "bic": "BIC / SWIFT コード",
    "placeholder": "BIC または SWIFT コードを入力",
    "valid": "有効な BIC / SWIFT コード",
    "invalid": "無効な BIC / SWIFT コード",
    "invalidCountry": "国コードが不明",
    "invalidLength": "BIC は 8 または 11 文字です",
    "invalidFormat": "BIC の形式が無効",
    "invalidBank": "銀行コードが無効",
    "invalidLocation": "ロケーションコードが無効",
    "invalidBranch": "支店コードが無効"
  },
  "ko": {
    "bic": "BIC / SWIFT 코드",
    "placeholder": "BIC 또는 SWIFT 코드 입력",
    "valid": "유효한 BIC / SWIFT 코드",
    "invalid": "유효하지 않은 BIC / SWIFT 코드",
    "invalidCountry": "알 수 없는 국가 코드",
    "invalidLength": "BIC는 8 또는 11자여야 합니다",
    "invalidFormat": "BIC 형식이 올바르지 않습니다",
    "invalidBank": "은행 코드가 올바르지 않습니다",
    "invalidLocation": "위치 코드가 올바르지 않습니다",
    "invalidBranch": "지점 코드가 올바르지 않습니다"
  },
  "ru": {
    "bic": "Код BIC / SWIFT",
    "placeholder": "Введите код BIC или SWIFT",
    "valid": "Действительный код BIC / SWIFT",
    "invalid": "Недействительный код BIC / SWIFT",
    "invalidCountry": "Неизвестный код страны",
    "invalidLength": "BIC должен содержать 8 или 11 символов",
    "invalidFormat": "Неверный формат BIC",
    "invalidBank": "Неверный код банка",
    "invalidLocation": "Неверный код локации",
    "invalidBranch": "Неверный код филиала"
  },
  "pt": {
    "bic": "Código BIC / SWIFT",
    "placeholder": "Digite o código BIC ou SWIFT",
    "valid": "Código BIC / SWIFT válido",
    "invalid": "Código BIC / SWIFT inválido",
    "invalidCountry": "Código do país desconhecido",
    "invalidLength": "O BIC deve ter 8 ou 11 caracteres",
    "invalidFormat": "Formato de BIC inválido",
    "invalidBank": "Código do banco inválido",
    "invalidLocation": "Código de localização inválido",
    "invalidBranch": "Código de agência inválido"
  },
  "ar": {
    "bic": "رمز BIC / SWIFT",
    "placeholder": "أدخل رمز BIC أو SWIFT",
    "valid": "رمز BIC / SWIFT صالح",
    "invalid": "رمز BIC / SWIFT غير صالح",
    "invalidCountry": "رمز بلد غير معروف",
    "invalidLength": "يجب أن يكون BIC من 8 أو 11 حرفًا",
    "invalidFormat": "تنسيق BIC غير صالح",
    "invalidBank": "رمز البنك غير صالح",
    "invalidLocation": "رمز الموقع غير صالح",
    "invalidBranch": "رمز الفرع غير صالح"
  },
  "hi": {
    "bic": "BIC / SWIFT कोड",
    "placeholder": "BIC या SWIFT कोड दर्ज करें",
    "valid": "मान्य BIC / SWIFT कोड",
    "invalid": "अमान्य BIC / SWIFT कोड",
    "invalidCountry": "अज्ञात देश कोड",
    "invalidLength": "BIC की लंबाई 8 या 11 अक्षर होनी चाहिए",
    "invalidFormat": "BIC प्रारूप अमान्य",
    "invalidBank": "बैंक कोड अमान्य",
    "invalidLocation": "लोकेशन कोड अमान्य",
    "invalidBranch": "शाखा कोड अमान्य"
  },
  "tr": {
    "bic": "BIC / SWIFT Kodu",
    "placeholder": "BIC veya SWIFT kodu girin",
    "valid": "Geçerli BIC / SWIFT kodu",
    "invalid": "Geçersiz BIC / SWIFT kodu",
    "invalidCountry": "Bilinmeyen ülke kodu",
    "invalidLength": "BIC 8 veya 11 karakter olmalıdır",
    "invalidFormat": "Geçersiz BIC biçimi",
    "invalidBank": "Geçersiz banka kodu",
    "invalidLocation": "Geçersiz konum kodu",
    "invalidBranch": "Geçersiz şube kodu"
  },
  "nl": {
    "bic": "BIC / SWIFT-code",
    "placeholder": "Voer BIC- of SWIFT-code in",
    "valid": "Geldige BIC / SWIFT-code",
    "invalid": "Ongeldige BIC / SWIFT-code",
    "invalidCountry": "Onbekende landcode",
    "invalidLength": "BIC moet 8 of 11 tekens hebben",
    "invalidFormat": "Ongeldig BIC-formaat",
    "invalidBank": "Ongeldige bankcode",
    "invalidLocation": "Ongeldige locatiecode",
    "invalidBranch": "Ongeldige filiaalcode"
  },
  "sv": {
    "bic": "BIC / SWIFT-kod",
    "placeholder": "Ange BIC- eller SWIFT-kod",
    "valid": "Giltig BIC / SWIFT-kod",
    "invalid": "Ogiltig BIC / SWIFT-kod",
    "invalidCountry": "Okänd landskod",
    "invalidLength": "BIC måste vara 8 eller 11 tecken",
    "invalidFormat": "Ogiltigt BIC-format",
    "invalidBank": "Ogiltig bankkod",
    "invalidLocation": "Ogiltig platskod",
    "invalidBranch": "Ogiltig filialkod"
  },
  "pl": {
    "bic": "Kod BIC / SWIFT",
    "placeholder": "Wpisz kod BIC lub SWIFT",
    "valid": "Poprawny kod BIC / SWIFT",
    "invalid": "Niepoprawny kod BIC / SWIFT",
    "invalidCountry": "Nieznany kod kraju",
    "invalidLength": "BIC musi mieć 8 lub 11 znaków",
    "invalidFormat": "Nieprawidłowy format BIC",
    "invalidBank": "Nieprawidłowy kod banku",
    "invalidLocation": "Nieprawidłowy kod lokalizacji",
    "invalidBranch": "Nieprawidłowy kod oddziału"
  },
  "vi": {
    "bic": "Mã BIC / SWIFT",
    "placeholder": "Nhập mã BIC hoặc SWIFT",
    "valid": "Mã BIC / SWIFT hợp lệ",
    "invalid": "Mã BIC / SWIFT không hợp lệ",
    "invalidCountry": "Mã quốc gia không xác định",
    "invalidLength": "BIC phải có 8 hoặc 11 ký tự",
    "invalidFormat": "Định dạng BIC không hợp lệ",
    "invalidBank": "Mã ngân hàng không hợp lệ",
    "invalidLocation": "Mã vị trí không hợp lệ",
    "invalidBranch": "Mã chi nhánh không hợp lệ"
  },
  "th": {
    "bic": "รหัส BIC / SWIFT",
    "placeholder": "ป้อนรหัส BIC หรือ SWIFT",
    "valid": "รหัส BIC / SWIFT ถูกต้อง",
    "invalid": "รหัส BIC / SWIFT ไม่ถูกต้อง",
    "invalidCountry": "รหัสประเทศไม่ทราบ",
    "invalidLength": "BIC ต้องยาว 8 หรือ 11 ตัวอักษร",
    "invalidFormat": "รูปแบบ BIC ไม่ถูกต้อง",
    "invalidBank": "รหัสธนาคารไม่ถูกต้อง",
    "invalidLocation": "รหัสตำแหน่งไม่ถูกต้อง",
    "invalidBranch": "รหัสสาขาไม่ถูกต้อง"
  },
  "id": {
    "bic": "Kode BIC / SWIFT",
    "placeholder": "Masukkan kode BIC atau SWIFT",
    "valid": "Kode BIC / SWIFT valid",
    "invalid": "Kode BIC / SWIFT tidak valid",
    "invalidCountry": "Kode negara tidak dikenal",
    "invalidLength": "BIC harus 8 atau 11 karakter",
    "invalidFormat": "Format BIC tidak valid",
    "invalidBank": "Kode bank tidak valid",
    "invalidLocation": "Kode lokasi tidak valid",
    "invalidBranch": "Kode cabang tidak valid"
  },
  "he": {
    "bic": "קוד BIC / SWIFT",
    "placeholder": "הזן קוד BIC או SWIFT",
    "valid": "קוד BIC / SWIFT תקין",
    "invalid": "קוד BIC / SWIFT לא תקין",
    "invalidCountry": "קוד מדינה לא מוכר",
    "invalidLength": "BIC חייב להיות באורך 8 או 11 תווים",
    "invalidFormat": "פורמט BIC לא תקין",
    "invalidBank": "קוד בנק לא תקין",
    "invalidLocation": "קוד מיקום לא תקין",
    "invalidBranch": "קוד סניף לא תקין"
  },
  "ms": {
    "bic": "Kod BIC / SWIFT",
    "placeholder": "Masukkan kod BIC atau SWIFT",
    "valid": "Kod BIC / SWIFT sah",
    "invalid": "Kod BIC / SWIFT tidak sah",
    "invalidCountry": "Kod negara tidak diketahui",
    "invalidLength": "BIC mesti 8 atau 11 aksara",
    "invalidFormat": "Format BIC tidak sah",
    "invalidBank": "Kod bank tidak sah",
    "invalidLocation": "Kod lokasi tidak sah",
    "invalidBranch": "Kod cawangan tidak sah"
  },
  "no": {
    "bic": "BIC / SWIFT-kode",
    "placeholder": "Skriv inn BIC- eller SWIFT-kode",
    "valid": "Gyldig BIC / SWIFT-kode",
    "invalid": "Ugyldig BIC / SWIFT-kode",
    "invalidCountry": "Ukjent landskode",
    "invalidLength": "BIC må være 8 eller 11 tegn",
    "invalidFormat": "Ugyldig BIC-format",
    "invalidBank": "Ugyldig bankkode",
    "invalidLocation": "Ugyldig stedskode",
    "invalidBranch": "Ugyldig avdelingskode"
  }
}
</i18n>
