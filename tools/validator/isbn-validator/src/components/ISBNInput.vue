<template>
  <NFormItem :label="t('isbn')" :feedback="feedbackMessage" :validation-status="validationStatus">
    <NInput
      :value="modelValue"
      :placeholder="t('placeholder')"
      :status="inputStatus"
      size="large"
      @update:value="$emit('update:modelValue', $event)"
    >
      <template #prefix>
        <NIcon :component="BookSearchIcon" :size="24" />
      </template>
    </NInput>
  </NFormItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItem, NInput, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { BookSearch20Regular as BookSearchIcon } from '@shared/icons/fluent'
import type { ISBNValidationResult } from '../data/isbn'

const { t } = useI18n()

const props = defineProps<{
  modelValue: string
  validationResult: ISBNValidationResult
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
  if (!props.validationResult.isChecksumValid) return t('invalidChecksum')
  return t('invalid')
})
</script>

<i18n lang="json">
{
  "en": {
    "isbn": "ISBN",
    "placeholder": "Enter ISBN-10 or ISBN-13",
    "valid": "Valid ISBN",
    "invalid": "Invalid ISBN",
    "invalidChecksum": "Invalid checksum",
    "invalidLength": "ISBN must be 10 or 13 digits",
    "invalidFormat": "Invalid ISBN format"
  },
  "zh": {
    "isbn": "ISBN",
    "placeholder": "输入 ISBN-10 或 ISBN-13",
    "valid": "有效的 ISBN",
    "invalid": "无效的 ISBN",
    "invalidChecksum": "校验和无效",
    "invalidLength": "ISBN 必须为 10 或 13 位",
    "invalidFormat": "ISBN 格式无效"
  },
  "zh-CN": {
    "isbn": "ISBN",
    "placeholder": "输入 ISBN-10 或 ISBN-13",
    "valid": "有效的 ISBN",
    "invalid": "无效的 ISBN",
    "invalidChecksum": "校验和无效",
    "invalidLength": "ISBN 必须为 10 或 13 位",
    "invalidFormat": "ISBN 格式无效"
  },
  "zh-TW": {
    "isbn": "ISBN",
    "placeholder": "輸入 ISBN-10 或 ISBN-13",
    "valid": "有效的 ISBN",
    "invalid": "無效的 ISBN",
    "invalidChecksum": "校驗和無效",
    "invalidLength": "ISBN 必須為 10 或 13 位",
    "invalidFormat": "ISBN 格式無效"
  },
  "zh-HK": {
    "isbn": "ISBN",
    "placeholder": "輸入 ISBN-10 或 ISBN-13",
    "valid": "有效的 ISBN",
    "invalid": "無效的 ISBN",
    "invalidChecksum": "校驗和無效",
    "invalidLength": "ISBN 必須為 10 或 13 位",
    "invalidFormat": "ISBN 格式無效"
  },
  "es": {
    "isbn": "ISBN",
    "placeholder": "Ingrese ISBN-10 o ISBN-13",
    "valid": "ISBN válido",
    "invalid": "ISBN inválido",
    "invalidChecksum": "Suma de verificación inválida",
    "invalidLength": "El ISBN debe tener 10 o 13 dígitos",
    "invalidFormat": "Formato de ISBN inválido"
  },
  "fr": {
    "isbn": "ISBN",
    "placeholder": "Entrez un ISBN-10 ou ISBN-13",
    "valid": "ISBN valide",
    "invalid": "ISBN invalide",
    "invalidChecksum": "Somme de contrôle invalide",
    "invalidLength": "L'ISBN doit comporter 10 ou 13 chiffres",
    "invalidFormat": "Format ISBN invalide"
  },
  "de": {
    "isbn": "ISBN",
    "placeholder": "ISBN-10 oder ISBN-13 eingeben",
    "valid": "Gültige ISBN",
    "invalid": "Ungültige ISBN",
    "invalidChecksum": "Ungültige Prüfsumme",
    "invalidLength": "ISBN muss 10 oder 13 Ziffern haben",
    "invalidFormat": "Ungültiges ISBN-Format"
  },
  "it": {
    "isbn": "ISBN",
    "placeholder": "Inserisci ISBN-10 o ISBN-13",
    "valid": "ISBN valido",
    "invalid": "ISBN non valido",
    "invalidChecksum": "Checksum non valido",
    "invalidLength": "L'ISBN deve avere 10 o 13 cifre",
    "invalidFormat": "Formato ISBN non valido"
  },
  "ja": {
    "isbn": "ISBN",
    "placeholder": "ISBN-10 または ISBN-13 を入力",
    "valid": "有効な ISBN",
    "invalid": "無効な ISBN",
    "invalidChecksum": "チェックサムが無効",
    "invalidLength": "ISBN は 10 桁または 13 桁です",
    "invalidFormat": "ISBN の形式が無効"
  },
  "ko": {
    "isbn": "ISBN",
    "placeholder": "ISBN-10 또는 ISBN-13 입력",
    "valid": "유효한 ISBN",
    "invalid": "유효하지 않은 ISBN",
    "invalidChecksum": "체크섬이 잘못됨",
    "invalidLength": "ISBN은 10자리 또는 13자리여야 합니다",
    "invalidFormat": "ISBN 형식이 올바르지 않습니다"
  },
  "ru": {
    "isbn": "ISBN",
    "placeholder": "Введите ISBN-10 или ISBN-13",
    "valid": "Действительный ISBN",
    "invalid": "Недействительный ISBN",
    "invalidChecksum": "Неверная контрольная сумма",
    "invalidLength": "ISBN должен содержать 10 или 13 цифр",
    "invalidFormat": "Неверный формат ISBN"
  },
  "pt": {
    "isbn": "ISBN",
    "placeholder": "Digite ISBN-10 ou ISBN-13",
    "valid": "ISBN válido",
    "invalid": "ISBN inválido",
    "invalidChecksum": "Dígito verificador inválido",
    "invalidLength": "O ISBN deve ter 10 ou 13 dígitos",
    "invalidFormat": "Formato de ISBN inválido"
  },
  "ar": {
    "isbn": "ISBN",
    "placeholder": "أدخل ISBN-10 أو ISBN-13",
    "valid": "ISBN صالح",
    "invalid": "ISBN غير صالح",
    "invalidChecksum": "مجموع التحقق غير صالح",
    "invalidLength": "يجب أن يكون ISBN 10 أو 13 رقمًا",
    "invalidFormat": "تنسيق ISBN غير صالح"
  },
  "hi": {
    "isbn": "ISBN",
    "placeholder": "ISBN-10 या ISBN-13 दर्ज करें",
    "valid": "मान्य ISBN",
    "invalid": "अमान्य ISBN",
    "invalidChecksum": "चेकसम अमान्य",
    "invalidLength": "ISBN 10 या 13 अंकों का होना चाहिए",
    "invalidFormat": "ISBN प्रारूप अमान्य"
  },
  "tr": {
    "isbn": "ISBN",
    "placeholder": "ISBN-10 veya ISBN-13 girin",
    "valid": "Geçerli ISBN",
    "invalid": "Geçersiz ISBN",
    "invalidChecksum": "Geçersiz sağlama toplamı",
    "invalidLength": "ISBN 10 veya 13 haneli olmalıdır",
    "invalidFormat": "Geçersiz ISBN biçimi"
  },
  "nl": {
    "isbn": "ISBN",
    "placeholder": "Voer ISBN-10 of ISBN-13 in",
    "valid": "Geldige ISBN",
    "invalid": "Ongeldige ISBN",
    "invalidChecksum": "Ongeldige controlesom",
    "invalidLength": "ISBN moet 10 of 13 cijfers hebben",
    "invalidFormat": "Ongeldig ISBN-formaat"
  },
  "sv": {
    "isbn": "ISBN",
    "placeholder": "Ange ISBN-10 eller ISBN-13",
    "valid": "Giltig ISBN",
    "invalid": "Ogiltig ISBN",
    "invalidChecksum": "Ogiltig kontrollsumma",
    "invalidLength": "ISBN måste ha 10 eller 13 siffror",
    "invalidFormat": "Ogiltigt ISBN-format"
  },
  "pl": {
    "isbn": "ISBN",
    "placeholder": "Wpisz ISBN-10 lub ISBN-13",
    "valid": "Prawidłowy ISBN",
    "invalid": "Nieprawidłowy ISBN",
    "invalidChecksum": "Nieprawidłowa suma kontrolna",
    "invalidLength": "ISBN musi mieć 10 lub 13 cyfr",
    "invalidFormat": "Nieprawidłowy format ISBN"
  },
  "vi": {
    "isbn": "ISBN",
    "placeholder": "Nhập ISBN-10 hoặc ISBN-13",
    "valid": "ISBN hợp lệ",
    "invalid": "ISBN không hợp lệ",
    "invalidChecksum": "Checksum không hợp lệ",
    "invalidLength": "ISBN phải có 10 hoặc 13 chữ số",
    "invalidFormat": "Định dạng ISBN không hợp lệ"
  },
  "th": {
    "isbn": "ISBN",
    "placeholder": "กรอก ISBN-10 หรือ ISBN-13",
    "valid": "ISBN ถูกต้อง",
    "invalid": "ISBN ไม่ถูกต้อง",
    "invalidChecksum": "Checksum ไม่ถูกต้อง",
    "invalidLength": "ISBN ต้องมี 10 หรือ 13 หลัก",
    "invalidFormat": "รูปแบบ ISBN ไม่ถูกต้อง"
  },
  "id": {
    "isbn": "ISBN",
    "placeholder": "Masukkan ISBN-10 atau ISBN-13",
    "valid": "ISBN valid",
    "invalid": "ISBN tidak valid",
    "invalidChecksum": "Checksum tidak valid",
    "invalidLength": "ISBN harus 10 atau 13 digit",
    "invalidFormat": "Format ISBN tidak valid"
  },
  "he": {
    "isbn": "ISBN",
    "placeholder": "הזן ISBN-10 או ISBN-13",
    "valid": "ISBN תקין",
    "invalid": "ISBN לא תקין",
    "invalidChecksum": "סכום ביקורת לא תקין",
    "invalidLength": "ISBN חייב להיות בן 10 או 13 ספרות",
    "invalidFormat": "תבנית ISBN לא תקינה"
  },
  "ms": {
    "isbn": "ISBN",
    "placeholder": "Masukkan ISBN-10 atau ISBN-13",
    "valid": "ISBN sah",
    "invalid": "ISBN tidak sah",
    "invalidChecksum": "Checksum tidak sah",
    "invalidLength": "ISBN mesti 10 atau 13 digit",
    "invalidFormat": "Format ISBN tidak sah"
  },
  "no": {
    "isbn": "ISBN",
    "placeholder": "Skriv inn ISBN-10 eller ISBN-13",
    "valid": "Gyldig ISBN",
    "invalid": "Ugyldig ISBN",
    "invalidChecksum": "Ugyldig kontrollsum",
    "invalidLength": "ISBN må ha 10 eller 13 sifre",
    "invalidFormat": "Ugyldig ISBN-format"
  }
}
</i18n>
