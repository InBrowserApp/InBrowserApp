<template>
  <NFormItem :label="t('imei')" :feedback="feedbackMessage" :validation-status="validationStatus">
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
import type { IMEIValidationResult } from '../data/imei'

const props = defineProps<{
  validationResult: IMEIValidationResult
}>()

const modelValue = defineModel<string>({ required: true })

const { t } = useI18n()

const hasInput = computed(() => modelValue.value.length > 0)

const inputStatus = computed(() => {
  if (!hasInput.value) {
    return undefined
  }

  return props.validationResult.isValid ? 'success' : 'error'
})

const validationStatus = computed(() => {
  if (!hasInput.value) {
    return undefined
  }

  return props.validationResult.isValid ? 'success' : 'error'
})

const feedbackMessage = computed(() => {
  if (!hasInput.value) {
    return undefined
  }

  if (props.validationResult.isValid) {
    return t('valid')
  }

  if (props.validationResult.reason === 'invalid-length') {
    return t('invalidLength')
  }

  if (props.validationResult.reason === 'invalid-format') {
    return t('invalidFormat')
  }

  if (props.validationResult.reason === 'invalid-checksum') {
    return t('invalidChecksum')
  }

  return t('invalid')
})
</script>

<i18n lang="json">
{
  "en": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "zh": {
    "imei": "IMEI",
    "placeholder": "输入 15 位 IMEI",
    "valid": "有效的 IMEI",
    "invalid": "无效的 IMEI",
    "invalidLength": "IMEI 必须正好为 15 位",
    "invalidFormat": "IMEI 只能包含数字",
    "invalidChecksum": "校验位无效"
  },
  "zh-CN": {
    "imei": "IMEI",
    "placeholder": "输入 15 位 IMEI",
    "valid": "有效的 IMEI",
    "invalid": "无效的 IMEI",
    "invalidLength": "IMEI 必须正好为 15 位",
    "invalidFormat": "IMEI 只能包含数字",
    "invalidChecksum": "校验位无效"
  },
  "zh-TW": {
    "imei": "IMEI",
    "placeholder": "輸入 15 位 IMEI",
    "valid": "有效的 IMEI",
    "invalid": "無效的 IMEI",
    "invalidLength": "IMEI 必須剛好為 15 位",
    "invalidFormat": "IMEI 只能包含數字",
    "invalidChecksum": "校驗位無效"
  },
  "zh-HK": {
    "imei": "IMEI",
    "placeholder": "輸入 15 位 IMEI",
    "valid": "有效的 IMEI",
    "invalid": "無效的 IMEI",
    "invalidLength": "IMEI 必須剛好為 15 位",
    "invalidFormat": "IMEI 只能包含數字",
    "invalidChecksum": "校驗位無效"
  },
  "es": {
    "imei": "IMEI",
    "placeholder": "Ingrese un IMEI de 15 dígitos",
    "valid": "IMEI válido",
    "invalid": "IMEI inválido",
    "invalidLength": "El IMEI debe tener exactamente 15 dígitos",
    "invalidFormat": "El IMEI solo debe contener dígitos",
    "invalidChecksum": "Dígito de control inválido"
  },
  "fr": {
    "imei": "IMEI",
    "placeholder": "Entrez un IMEI à 15 chiffres",
    "valid": "IMEI valide",
    "invalid": "IMEI invalide",
    "invalidLength": "L'IMEI doit contenir exactement 15 chiffres",
    "invalidFormat": "L'IMEI ne doit contenir que des chiffres",
    "invalidChecksum": "Chiffre de contrôle invalide"
  },
  "de": {
    "imei": "IMEI",
    "placeholder": "Geben Sie eine 15-stellige IMEI ein",
    "valid": "Gültige IMEI",
    "invalid": "Ungültige IMEI",
    "invalidLength": "IMEI muss genau 15 Ziffern haben",
    "invalidFormat": "IMEI darf nur Ziffern enthalten",
    "invalidChecksum": "Ungültige Prüfziffer"
  },
  "it": {
    "imei": "IMEI",
    "placeholder": "Inserisci un IMEI di 15 cifre",
    "valid": "IMEI valido",
    "invalid": "IMEI non valido",
    "invalidLength": "L'IMEI deve contenere esattamente 15 cifre",
    "invalidFormat": "L'IMEI deve contenere solo cifre",
    "invalidChecksum": "Cifra di controllo non valida"
  },
  "ja": {
    "imei": "IMEI",
    "placeholder": "15桁のIMEIを入力",
    "valid": "有効な IMEI",
    "invalid": "無効な IMEI",
    "invalidLength": "IMEI は 15 桁である必要があります",
    "invalidFormat": "IMEI は数字のみを含める必要があります",
    "invalidChecksum": "チェックディジットが無効です"
  },
  "ko": {
    "imei": "IMEI",
    "placeholder": "15자리 IMEI 입력",
    "valid": "유효한 IMEI",
    "invalid": "유효하지 않은 IMEI",
    "invalidLength": "IMEI는 정확히 15자리여야 합니다",
    "invalidFormat": "IMEI는 숫자만 포함해야 합니다",
    "invalidChecksum": "체크 디지트가 올바르지 않습니다"
  },
  "ru": {
    "imei": "IMEI",
    "placeholder": "Введите 15-значный IMEI",
    "valid": "Действительный IMEI",
    "invalid": "Недействительный IMEI",
    "invalidLength": "IMEI должен содержать ровно 15 цифр",
    "invalidFormat": "IMEI должен содержать только цифры",
    "invalidChecksum": "Неверная контрольная цифра"
  },
  "pt": {
    "imei": "IMEI",
    "placeholder": "Digite um IMEI de 15 dígitos",
    "valid": "IMEI válido",
    "invalid": "IMEI inválido",
    "invalidLength": "O IMEI deve ter exatamente 15 dígitos",
    "invalidFormat": "O IMEI deve conter apenas dígitos",
    "invalidChecksum": "Dígito verificador inválido"
  },
  "ar": {
    "imei": "IMEI",
    "placeholder": "أدخل IMEI مكوّنًا من 15 رقمًا",
    "valid": "IMEI صالح",
    "invalid": "IMEI غير صالح",
    "invalidLength": "يجب أن يتكون IMEI من 15 رقمًا بالضبط",
    "invalidFormat": "يجب أن يحتوي IMEI على أرقام فقط",
    "invalidChecksum": "رقم التحقق غير صالح"
  },
  "hi": {
    "imei": "IMEI",
    "placeholder": "15 अंकों का IMEI दर्ज करें",
    "valid": "मान्य IMEI",
    "invalid": "अमान्य IMEI",
    "invalidLength": "IMEI ठीक 15 अंकों का होना चाहिए",
    "invalidFormat": "IMEI में केवल अंक होने चाहिए",
    "invalidChecksum": "चेक अंक अमान्य है"
  },
  "tr": {
    "imei": "IMEI",
    "placeholder": "15 haneli IMEI girin",
    "valid": "Geçerli IMEI",
    "invalid": "Geçersiz IMEI",
    "invalidLength": "IMEI tam olarak 15 haneli olmalıdır",
    "invalidFormat": "IMEI yalnızca rakamlardan oluşmalıdır",
    "invalidChecksum": "Geçersiz kontrol hanesi"
  },
  "nl": {
    "imei": "IMEI",
    "placeholder": "Voer een 15-cijferige IMEI in",
    "valid": "Geldige IMEI",
    "invalid": "Ongeldige IMEI",
    "invalidLength": "IMEI moet exact 15 cijfers bevatten",
    "invalidFormat": "IMEI mag alleen cijfers bevatten",
    "invalidChecksum": "Ongeldig controlecijfer"
  },
  "sv": {
    "imei": "IMEI",
    "placeholder": "Ange ett 15-siffrigt IMEI",
    "valid": "Giltig IMEI",
    "invalid": "Ogiltig IMEI",
    "invalidLength": "IMEI måste bestå av exakt 15 siffror",
    "invalidFormat": "IMEI får endast innehålla siffror",
    "invalidChecksum": "Ogiltig kontrollsiffra"
  },
  "pl": {
    "imei": "IMEI",
    "placeholder": "Wprowadź 15-cyfrowy IMEI",
    "valid": "Prawidłowy IMEI",
    "invalid": "Nieprawidłowy IMEI",
    "invalidLength": "IMEI musi mieć dokładnie 15 cyfr",
    "invalidFormat": "IMEI może zawierać tylko cyfry",
    "invalidChecksum": "Nieprawidłowa cyfra kontrolna"
  },
  "vi": {
    "imei": "IMEI",
    "placeholder": "Nhập IMEI 15 chữ số",
    "valid": "IMEI hợp lệ",
    "invalid": "IMEI không hợp lệ",
    "invalidLength": "IMEI phải có đúng 15 chữ số",
    "invalidFormat": "IMEI chỉ được chứa chữ số",
    "invalidChecksum": "Chữ số kiểm tra không hợp lệ"
  },
  "th": {
    "imei": "IMEI",
    "placeholder": "กรอก IMEI 15 หลัก",
    "valid": "IMEI ถูกต้อง",
    "invalid": "IMEI ไม่ถูกต้อง",
    "invalidLength": "IMEI ต้องมี 15 หลักพอดี",
    "invalidFormat": "IMEI ต้องเป็นตัวเลขเท่านั้น",
    "invalidChecksum": "เลขตรวจสอบไม่ถูกต้อง"
  },
  "id": {
    "imei": "IMEI",
    "placeholder": "Masukkan IMEI 15 digit",
    "valid": "IMEI valid",
    "invalid": "IMEI tidak valid",
    "invalidLength": "IMEI harus tepat 15 digit",
    "invalidFormat": "IMEI hanya boleh berisi angka",
    "invalidChecksum": "Digit pemeriksa tidak valid"
  },
  "he": {
    "imei": "IMEI",
    "placeholder": "הזן IMEI בן 15 ספרות",
    "valid": "IMEI תקין",
    "invalid": "IMEI לא תקין",
    "invalidLength": "IMEI חייב להכיל בדיוק 15 ספרות",
    "invalidFormat": "IMEI חייב להכיל ספרות בלבד",
    "invalidChecksum": "ספרת ביקורת לא תקינה"
  },
  "ms": {
    "imei": "IMEI",
    "placeholder": "Masukkan IMEI 15 digit",
    "valid": "IMEI sah",
    "invalid": "IMEI tidak sah",
    "invalidLength": "IMEI mesti tepat 15 digit",
    "invalidFormat": "IMEI hanya boleh mengandungi digit",
    "invalidChecksum": "Digit semakan tidak sah"
  },
  "no": {
    "imei": "IMEI",
    "placeholder": "Skriv inn en 15-sifret IMEI",
    "valid": "Gyldig IMEI",
    "invalid": "Ugyldig IMEI",
    "invalidLength": "IMEI må være nøyaktig 15 sifre",
    "invalidFormat": "IMEI kan bare inneholde sifre",
    "invalidChecksum": "Ugyldig kontrollsiffer"
  }
}
</i18n>
