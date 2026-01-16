<template>
  <NFormItem
    :label="t('idNumber')"
    :feedback="feedbackMessage"
    :validation-status="validationStatus"
  >
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
import { TextNumberFormat20Regular as TextNumberFormatIcon } from '@shared/icons/fluent'
import type { ResidentIdValidationResult } from '../data/residentId'

const { t } = useI18n()

const props = defineProps<{
  modelValue: string
  validationResult: ResidentIdValidationResult
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
  if (!props.validationResult.isFormatValid) return t('invalidFormat')
  if (!props.validationResult.isRegionValid) return t('invalidRegion')
  if (!props.validationResult.isBirthdateValid) return t('invalidBirthdate')
  if (!props.validationResult.isChecksumValid) return t('invalidChecksum')
  return t('invalid')
})
</script>

<i18n lang="json">
{
  "en": {
    "idNumber": "Resident ID Number",
    "placeholder": "Enter 18-digit ID number",
    "valid": "Valid ID number",
    "invalid": "Invalid ID number",
    "invalidLength": "ID number must be 18 digits",
    "invalidFormat": "Invalid format (digits or X)",
    "invalidRegion": "Unknown administrative region code",
    "invalidBirthdate": "Invalid birthdate",
    "invalidChecksum": "Invalid checksum"
  },
  "zh": {
    "idNumber": "居民身份证号",
    "placeholder": "输入18位身份证号",
    "valid": "有效的身份证号",
    "invalid": "无效的身份证号",
    "invalidLength": "身份证号长度必须为18位",
    "invalidFormat": "格式无效（仅数字或 X）",
    "invalidRegion": "行政区划代码不存在",
    "invalidBirthdate": "出生日期无效",
    "invalidChecksum": "校验位无效"
  },
  "zh-CN": {
    "idNumber": "居民身份证号",
    "placeholder": "输入18位身份证号",
    "valid": "有效的身份证号",
    "invalid": "无效的身份证号",
    "invalidLength": "身份证号长度必须为18位",
    "invalidFormat": "格式无效（仅数字或 X）",
    "invalidRegion": "行政区划代码不存在",
    "invalidBirthdate": "出生日期无效",
    "invalidChecksum": "校验位无效"
  },
  "zh-TW": {
    "idNumber": "居民身分證號",
    "placeholder": "輸入18位身分證號",
    "valid": "有效的身分證號",
    "invalid": "無效的身分證號",
    "invalidLength": "身分證號長度必須為18位",
    "invalidFormat": "格式無效（僅數字或 X）",
    "invalidRegion": "行政區劃代碼不存在",
    "invalidBirthdate": "出生日期無效",
    "invalidChecksum": "校驗位無效"
  },
  "zh-HK": {
    "idNumber": "居民身份證號",
    "placeholder": "輸入18位身份證號",
    "valid": "有效的身份證號",
    "invalid": "無效的身份證號",
    "invalidLength": "身份證號長度必須為18位",
    "invalidFormat": "格式無效（僅數字或 X）",
    "invalidRegion": "行政區劃代碼不存在",
    "invalidBirthdate": "出生日期無效",
    "invalidChecksum": "校驗位無效"
  },
  "es": {
    "idNumber": "Número de identificación de residente",
    "placeholder": "Ingrese el número de identificación de 18 dígitos",
    "valid": "Número de identificación válido",
    "invalid": "Número de identificación inválido",
    "invalidLength": "El número debe tener 18 dígitos",
    "invalidFormat": "Formato inválido (solo dígitos o X)",
    "invalidRegion": "Código de región administrativa desconocido",
    "invalidBirthdate": "Fecha de nacimiento inválida",
    "invalidChecksum": "Checksum inválido"
  },
  "fr": {
    "idNumber": "Numéro d'identité de résident",
    "placeholder": "Entrez le numéro d'identité à 18 chiffres",
    "valid": "Numéro d'identité valide",
    "invalid": "Numéro d'identité invalide",
    "invalidLength": "Le numéro doit contenir 18 chiffres",
    "invalidFormat": "Format invalide (chiffres ou X)",
    "invalidRegion": "Code de région administrative inconnu",
    "invalidBirthdate": "Date de naissance invalide",
    "invalidChecksum": "Somme de contrôle invalide"
  },
  "de": {
    "idNumber": "Residenten-ID-Nummer",
    "placeholder": "18-stellige ID-Nummer eingeben",
    "valid": "Gültige ID-Nummer",
    "invalid": "Ungültige ID-Nummer",
    "invalidLength": "Die Nummer muss 18 Stellen haben",
    "invalidFormat": "Ungültiges Format (Ziffern oder X)",
    "invalidRegion": "Unbekannter Verwaltungsregionscode",
    "invalidBirthdate": "Ungültiges Geburtsdatum",
    "invalidChecksum": "Ungültige Prüfsumme"
  },
  "it": {
    "idNumber": "Numero di ID del residente",
    "placeholder": "Inserisci il numero ID di 18 cifre",
    "valid": "Numero ID valido",
    "invalid": "Numero ID non valido",
    "invalidLength": "Il numero deve avere 18 cifre",
    "invalidFormat": "Formato non valido (solo cifre o X)",
    "invalidRegion": "Codice regione amministrativa sconosciuto",
    "invalidBirthdate": "Data di nascita non valida",
    "invalidChecksum": "Checksum non valido"
  },
  "ja": {
    "idNumber": "中国居民身分証番号",
    "placeholder": "18桁のID番号を入力",
    "valid": "有効なID番号",
    "invalid": "無効なID番号",
    "invalidLength": "18桁である必要があります",
    "invalidFormat": "形式が無効（数字またはX）",
    "invalidRegion": "行政区コードが不明",
    "invalidBirthdate": "生年月日が無効",
    "invalidChecksum": "チェックサムが無効"
  },
  "ko": {
    "idNumber": "중국 주민 신분증 번호",
    "placeholder": "18자리 ID 번호를 입력하세요",
    "valid": "유효한 ID 번호",
    "invalid": "유효하지 않은 ID 번호",
    "invalidLength": "번호는 18자리여야 합니다",
    "invalidFormat": "형식이 올바르지 않습니다 (숫자 또는 X)",
    "invalidRegion": "알 수 없는 행정 구역 코드",
    "invalidBirthdate": "생년월일이 올바르지 않습니다",
    "invalidChecksum": "체크섬이 잘못됨"
  },
  "ru": {
    "idNumber": "Номер удостоверения личности резидента",
    "placeholder": "Введите 18-значный номер ID",
    "valid": "Действительный номер ID",
    "invalid": "Недействительный номер ID",
    "invalidLength": "Номер должен содержать 18 цифр",
    "invalidFormat": "Неверный формат (цифры или X)",
    "invalidRegion": "Неизвестный административный код региона",
    "invalidBirthdate": "Неверная дата рождения",
    "invalidChecksum": "Неверная контрольная сумма"
  },
  "pt": {
    "idNumber": "Número de ID do residente",
    "placeholder": "Digite o número de ID de 18 dígitos",
    "valid": "Número de ID válido",
    "invalid": "Número de ID inválido",
    "invalidLength": "O número deve ter 18 dígitos",
    "invalidFormat": "Formato inválido (somente dígitos ou X)",
    "invalidRegion": "Código de região administrativa desconhecido",
    "invalidBirthdate": "Data de nascimento inválida",
    "invalidChecksum": "Checksum inválido"
  },
  "ar": {
    "idNumber": "رقم هوية المقيم",
    "placeholder": "أدخل رقم الهوية المكون من 18 رقمًا",
    "valid": "رقم هوية صالح",
    "invalid": "رقم هوية غير صالح",
    "invalidLength": "يجب أن يكون الرقم من 18 رقمًا",
    "invalidFormat": "تنسيق غير صالح (أرقام أو X)",
    "invalidRegion": "رمز المنطقة الإدارية غير معروف",
    "invalidBirthdate": "تاريخ الميلاد غير صالح",
    "invalidChecksum": "المجموع الاختباري غير صالح"
  },
  "hi": {
    "idNumber": "निवासी आईडी नंबर",
    "placeholder": "18 अंकों का आईडी नंबर दर्ज करें",
    "valid": "मान्य आईडी नंबर",
    "invalid": "अमान्य आईडी नंबर",
    "invalidLength": "नंबर 18 अंकों का होना चाहिए",
    "invalidFormat": "अमान्य प्रारूप (अंक या X)",
    "invalidRegion": "अज्ञात प्रशासनिक क्षेत्र कोड",
    "invalidBirthdate": "अमान्य जन्म तिथि",
    "invalidChecksum": "अमान्य चेकसम"
  },
  "tr": {
    "idNumber": "Yerleşik kimlik numarası",
    "placeholder": "18 haneli kimlik numarasını girin",
    "valid": "Geçerli kimlik numarası",
    "invalid": "Geçersiz kimlik numarası",
    "invalidLength": "Numara 18 haneli olmalıdır",
    "invalidFormat": "Geçersiz biçim (rakamlar veya X)",
    "invalidRegion": "Bilinmeyen idari bölge kodu",
    "invalidBirthdate": "Geçersiz doğum tarihi",
    "invalidChecksum": "Geçersiz sağlama toplamı"
  },
  "nl": {
    "idNumber": "Resident-ID-nummer",
    "placeholder": "Voer een ID-nummer van 18 cijfers in",
    "valid": "Geldig ID-nummer",
    "invalid": "Ongeldig ID-nummer",
    "invalidLength": "Het nummer moet 18 cijfers bevatten",
    "invalidFormat": "Ongeldig formaat (cijfers of X)",
    "invalidRegion": "Onbekende administratieve regiocode",
    "invalidBirthdate": "Ongeldige geboortedatum",
    "invalidChecksum": "Ongeldige controlesom"
  },
  "sv": {
    "idNumber": "Resident-ID-nummer",
    "placeholder": "Ange ett 18-siffrigt ID-nummer",
    "valid": "Giltigt ID-nummer",
    "invalid": "Ogiltigt ID-nummer",
    "invalidLength": "Numret måste vara 18 siffror",
    "invalidFormat": "Ogiltigt format (siffror eller X)",
    "invalidRegion": "Okänd administrativ regionkod",
    "invalidBirthdate": "Ogiltigt födelsedatum",
    "invalidChecksum": "Ogiltig kontrollsumma"
  },
  "pl": {
    "idNumber": "Numer ID mieszkańca",
    "placeholder": "Wprowadź 18-cyfrowy numer ID",
    "valid": "Prawidłowy numer ID",
    "invalid": "Nieprawidłowy numer ID",
    "invalidLength": "Numer musi mieć 18 cyfr",
    "invalidFormat": "Nieprawidłowy format (cyfry lub X)",
    "invalidRegion": "Nieznany kod regionu administracyjnego",
    "invalidBirthdate": "Nieprawidłowa data urodzenia",
    "invalidChecksum": "Nieprawidłowa suma kontrolna"
  },
  "vi": {
    "idNumber": "Số ID cư trú",
    "placeholder": "Nhập số ID 18 chữ số",
    "valid": "Số ID hợp lệ",
    "invalid": "Số ID không hợp lệ",
    "invalidLength": "Số phải có 18 chữ số",
    "invalidFormat": "Định dạng không hợp lệ (chữ số hoặc X)",
    "invalidRegion": "Mã vùng hành chính không xác định",
    "invalidBirthdate": "Ngày sinh không hợp lệ",
    "invalidChecksum": "Checksum không hợp lệ"
  },
  "th": {
    "idNumber": "หมายเลขบัตรประจำตัวผู้พำนัก",
    "placeholder": "กรอกหมายเลข 18 หลัก",
    "valid": "หมายเลขถูกต้อง",
    "invalid": "หมายเลขไม่ถูกต้อง",
    "invalidLength": "หมายเลขต้องมี 18 หลัก",
    "invalidFormat": "รูปแบบไม่ถูกต้อง (ตัวเลขหรือ X)",
    "invalidRegion": "รหัสเขตการปกครองไม่รู้จัก",
    "invalidBirthdate": "วันเกิดไม่ถูกต้อง",
    "invalidChecksum": "เช็คซัมไม่ถูกต้อง"
  },
  "id": {
    "idNumber": "Nomor ID penduduk",
    "placeholder": "Masukkan nomor ID 18 digit",
    "valid": "Nomor ID valid",
    "invalid": "Nomor ID tidak valid",
    "invalidLength": "Nomor harus 18 digit",
    "invalidFormat": "Format tidak valid (digit atau X)",
    "invalidRegion": "Kode wilayah administratif tidak dikenal",
    "invalidBirthdate": "Tanggal lahir tidak valid",
    "invalidChecksum": "Checksum tidak valid"
  },
  "he": {
    "idNumber": "מספר מזהה תושב",
    "placeholder": "הזן מספר מזהה בן 18 ספרות",
    "valid": "מספר מזהה תקין",
    "invalid": "מספר מזהה לא תקין",
    "invalidLength": "המספר חייב להכיל 18 ספרות",
    "invalidFormat": "פורמט לא תקין (ספרות או X)",
    "invalidRegion": "קוד אזור מנהלי לא מוכר",
    "invalidBirthdate": "תאריך לידה לא תקין",
    "invalidChecksum": "סכום ביקורת לא תקין"
  },
  "ms": {
    "idNumber": "Nombor ID penduduk",
    "placeholder": "Masukkan nombor ID 18 digit",
    "valid": "Nombor ID sah",
    "invalid": "Nombor ID tidak sah",
    "invalidLength": "Nombor mesti 18 digit",
    "invalidFormat": "Format tidak sah (digit atau X)",
    "invalidRegion": "Kod wilayah pentadbiran tidak diketahui",
    "invalidBirthdate": "Tarikh lahir tidak sah",
    "invalidChecksum": "Checksum tidak sah"
  },
  "no": {
    "idNumber": "Resident-ID-nummer",
    "placeholder": "Skriv inn et 18-sifret ID-nummer",
    "valid": "Gyldig ID-nummer",
    "invalid": "Ugyldig ID-nummer",
    "invalidLength": "Nummeret må være 18 sifre",
    "invalidFormat": "Ugyldig format (sifre eller X)",
    "invalidRegion": "Ukjent administrativ regionskode",
    "invalidBirthdate": "Ugyldig fødselsdato",
    "invalidChecksum": "Ugyldig kontrollsum"
  }
}
</i18n>
