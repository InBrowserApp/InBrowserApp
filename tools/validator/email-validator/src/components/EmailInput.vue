<template>
  <NFormItem :label="t('email')" :feedback="feedbackMessage" :validation-status="validationStatus">
    <NInput
      :value="modelValue"
      :placeholder="t('placeholder')"
      :status="inputStatus"
      size="large"
      @update:value="$emit('update:modelValue', $event)"
    >
      <template #prefix>
        <NIcon :component="MailIcon" :size="24" />
      </template>
    </NInput>
  </NFormItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItem, NInput, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import MailIcon from '@vicons/fluent/Mail24Regular'
import type { EmailValidationResult } from '../data/email'

const props = defineProps<{
  modelValue: string
  validationResult: EmailValidationResult
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()

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
  if (!props.validationResult.hasSingleAt) return t('invalidAt')
  if (!props.validationResult.isLocalLengthValid) return t('invalidLocalLength')
  if (!props.validationResult.isDomainLengthValid) return t('invalidDomainLength')
  if (!props.validationResult.isLengthValid) return t('invalidLength')
  if (!props.validationResult.isLocalCharsValid || !props.validationResult.isLocalDotsValid) {
    return t('invalidLocal')
  }
  if (
    !props.validationResult.isDomainCharsValid ||
    !props.validationResult.isDomainDotsValid ||
    !props.validationResult.isDomainLabelCharsValid ||
    !props.validationResult.isDomainLabelLengthValid
  ) {
    return t('invalidDomain')
  }
  if (!props.validationResult.isTldValid) return t('invalidTld')
  return t('invalid')
})
</script>

<i18n lang="json">
{
  "en": {
    "email": "Email Address",
    "placeholder": "name{'@'}example.com",
    "valid": "Valid email address",
    "invalid": "Invalid email address",
    "invalidAt": "Email must contain a single {'@'}",
    "invalidLength": "Email must be at most 254 characters",
    "invalidLocalLength": "Local part must be 1-64 characters",
    "invalidDomainLength": "Domain must be 1-253 characters",
    "invalidLocal": "Local part is invalid",
    "invalidDomain": "Domain is invalid",
    "invalidTld": "Domain must include a top-level domain"
  },
  "zh": {
    "email": "邮箱地址",
    "placeholder": "name{'@'}example.com",
    "valid": "有效的邮箱地址",
    "invalid": "无效的邮箱地址",
    "invalidAt": "邮箱必须包含且仅包含一个 {'@'}",
    "invalidLength": "邮箱长度不能超过 254 个字符",
    "invalidLocalLength": "本地部分长度需为 1-64 个字符",
    "invalidDomainLength": "域名长度需为 1-253 个字符",
    "invalidLocal": "本地部分无效",
    "invalidDomain": "域名无效",
    "invalidTld": "域名必须包含顶级域名"
  },
  "zh-CN": {
    "email": "邮箱地址",
    "placeholder": "name{'@'}example.com",
    "valid": "有效的邮箱地址",
    "invalid": "无效的邮箱地址",
    "invalidAt": "邮箱必须包含且仅包含一个 {'@'}",
    "invalidLength": "邮箱长度不能超过 254 个字符",
    "invalidLocalLength": "本地部分长度需为 1-64 个字符",
    "invalidDomainLength": "域名长度需为 1-253 个字符",
    "invalidLocal": "本地部分无效",
    "invalidDomain": "域名无效",
    "invalidTld": "域名必须包含顶级域名"
  },
  "zh-TW": {
    "email": "電子郵件地址",
    "placeholder": "name{'@'}example.com",
    "valid": "有效的電子郵件地址",
    "invalid": "無效的電子郵件地址",
    "invalidAt": "電子郵件必須且只能包含一個 {'@'}",
    "invalidLength": "電子郵件長度不可超過 254 個字元",
    "invalidLocalLength": "本地部分長度需為 1-64 個字元",
    "invalidDomainLength": "網域長度需為 1-253 個字元",
    "invalidLocal": "本地部分無效",
    "invalidDomain": "網域無效",
    "invalidTld": "網域必須包含頂級網域"
  },
  "zh-HK": {
    "email": "電郵地址",
    "placeholder": "name{'@'}example.com",
    "valid": "有效的電郵地址",
    "invalid": "無效的電郵地址",
    "invalidAt": "電郵必須且只能包含一個 {'@'}",
    "invalidLength": "電郵長度不可超過 254 個字元",
    "invalidLocalLength": "本地部分長度需為 1-64 個字元",
    "invalidDomainLength": "網域長度需為 1-253 個字元",
    "invalidLocal": "本地部分無效",
    "invalidDomain": "網域無效",
    "invalidTld": "網域必須包含頂級網域"
  },
  "es": {
    "email": "Correo electrónico",
    "placeholder": "name{'@'}example.com",
    "valid": "Dirección de correo válida",
    "invalid": "Dirección de correo inválida",
    "invalidAt": "El correo debe contener un único {'@'}",
    "invalidLength": "El correo debe tener como máximo 254 caracteres",
    "invalidLocalLength": "La parte local debe tener 1-64 caracteres",
    "invalidDomainLength": "El dominio debe tener 1-253 caracteres",
    "invalidLocal": "La parte local no es válida",
    "invalidDomain": "El dominio no es válido",
    "invalidTld": "El dominio debe incluir un TLD"
  },
  "fr": {
    "email": "Adresse e-mail",
    "placeholder": "name{'@'}example.com",
    "valid": "Adresse e-mail valide",
    "invalid": "Adresse e-mail invalide",
    "invalidAt": "L'e-mail doit contenir un seul {'@'}",
    "invalidLength": "L'e-mail doit avoir au maximum 254 caractères",
    "invalidLocalLength": "La partie locale doit faire 1-64 caractères",
    "invalidDomainLength": "Le domaine doit faire 1-253 caractères",
    "invalidLocal": "La partie locale est invalide",
    "invalidDomain": "Le domaine est invalide",
    "invalidTld": "Le domaine doit inclure un TLD"
  },
  "de": {
    "email": "E-Mail-Adresse",
    "placeholder": "name{'@'}example.com",
    "valid": "Gültige E-Mail-Adresse",
    "invalid": "Ungültige E-Mail-Adresse",
    "invalidAt": "Die E-Mail muss genau ein {'@'} enthalten",
    "invalidLength": "Die E-Mail darf höchstens 254 Zeichen lang sein",
    "invalidLocalLength": "Der lokale Teil muss 1-64 Zeichen haben",
    "invalidDomainLength": "Die Domain muss 1-253 Zeichen haben",
    "invalidLocal": "Der lokale Teil ist ungültig",
    "invalidDomain": "Die Domain ist ungültig",
    "invalidTld": "Die Domain muss eine TLD enthalten"
  },
  "it": {
    "email": "Indirizzo email",
    "placeholder": "name{'@'}example.com",
    "valid": "Indirizzo email valido",
    "invalid": "Indirizzo email non valido",
    "invalidAt": "L'email deve contenere un solo {'@'}",
    "invalidLength": "L'email deve avere al massimo 254 caratteri",
    "invalidLocalLength": "La parte locale deve avere 1-64 caratteri",
    "invalidDomainLength": "Il dominio deve avere 1-253 caratteri",
    "invalidLocal": "La parte locale non è valida",
    "invalidDomain": "Il dominio non è valido",
    "invalidTld": "Il dominio deve includere un TLD"
  },
  "ja": {
    "email": "メールアドレス",
    "placeholder": "name{'@'}example.com",
    "valid": "有効なメールアドレス",
    "invalid": "無効なメールアドレス",
    "invalidAt": "メールには {'@'} が 1 つ必要です",
    "invalidLength": "メールは 254 文字以内である必要があります",
    "invalidLocalLength": "ローカル部は 1〜64 文字です",
    "invalidDomainLength": "ドメインは 1〜253 文字です",
    "invalidLocal": "ローカル部が無効です",
    "invalidDomain": "ドメインが無効です",
    "invalidTld": "ドメインに TLD が必要です"
  },
  "ko": {
    "email": "이메일 주소",
    "placeholder": "name{'@'}example.com",
    "valid": "유효한 이메일 주소",
    "invalid": "유효하지 않은 이메일 주소",
    "invalidAt": "이메일에는 {'@'}가 하나만 있어야 합니다",
    "invalidLength": "이메일은 254자 이하여야 합니다",
    "invalidLocalLength": "로컬 부분은 1-64자여야 합니다",
    "invalidDomainLength": "도메인은 1-253자여야 합니다",
    "invalidLocal": "로컬 부분이 올바르지 않습니다",
    "invalidDomain": "도메인이 올바르지 않습니다",
    "invalidTld": "도메인에 TLD가 필요합니다"
  },
  "ru": {
    "email": "Адрес электронной почты",
    "placeholder": "name{'@'}example.com",
    "valid": "Действительный адрес электронной почты",
    "invalid": "Недействительный адрес электронной почты",
    "invalidAt": "Адрес должен содержать ровно один символ {'@'}",
    "invalidLength": "Адрес должен быть не длиннее 254 символов",
    "invalidLocalLength": "Локальная часть должна быть 1-64 символа",
    "invalidDomainLength": "Домен должен быть 1-253 символа",
    "invalidLocal": "Локальная часть недействительна",
    "invalidDomain": "Домен недействителен",
    "invalidTld": "Домен должен содержать TLD"
  },
  "pt": {
    "email": "Endereço de e-mail",
    "placeholder": "name{'@'}example.com",
    "valid": "Endereço de e-mail válido",
    "invalid": "Endereço de e-mail inválido",
    "invalidAt": "O e-mail deve conter um único {'@'}",
    "invalidLength": "O e-mail deve ter no máximo 254 caracteres",
    "invalidLocalLength": "A parte local deve ter 1-64 caracteres",
    "invalidDomainLength": "O domínio deve ter 1-253 caracteres",
    "invalidLocal": "A parte local é inválida",
    "invalidDomain": "O domínio é inválido",
    "invalidTld": "O domínio deve incluir um TLD"
  },
  "ar": {
    "email": "عنوان البريد الإلكتروني",
    "placeholder": "name{'@'}example.com",
    "valid": "عنوان بريد إلكتروني صالح",
    "invalid": "عنوان بريد إلكتروني غير صالح",
    "invalidAt": "يجب أن يحتوي البريد الإلكتروني على {'@'} واحد فقط",
    "invalidLength": "يجب ألا يزيد البريد الإلكتروني عن 254 حرفًا",
    "invalidLocalLength": "يجب أن يتراوح الجزء المحلي بين 1 و64 حرفًا",
    "invalidDomainLength": "يجب أن يتراوح النطاق بين 1 و253 حرفًا",
    "invalidLocal": "الجزء المحلي غير صالح",
    "invalidDomain": "النطاق غير صالح",
    "invalidTld": "يجب أن يتضمن النطاق نطاقًا علويًا"
  },
  "hi": {
    "email": "ईमेल पता",
    "placeholder": "name{'@'}example.com",
    "valid": "मान्य ईमेल पता",
    "invalid": "अमान्य ईमेल पता",
    "invalidAt": "ईमेल में केवल एक {'@'} होना चाहिए",
    "invalidLength": "ईमेल 254 वर्णों से अधिक नहीं होना चाहिए",
    "invalidLocalLength": "लोकल भाग 1-64 वर्ण होना चाहिए",
    "invalidDomainLength": "डोमेन 1-253 वर्ण होना चाहिए",
    "invalidLocal": "लोकल भाग अमान्य है",
    "invalidDomain": "डोमेन अमान्य है",
    "invalidTld": "डोमेन में TLD होना चाहिए"
  },
  "tr": {
    "email": "E-posta adresi",
    "placeholder": "name{'@'}example.com",
    "valid": "Geçerli e-posta adresi",
    "invalid": "Geçersiz e-posta adresi",
    "invalidAt": "E-posta tek bir {'@'} içermelidir",
    "invalidLength": "E-posta en fazla 254 karakter olmalıdır",
    "invalidLocalLength": "Yerel bölüm 1-64 karakter olmalıdır",
    "invalidDomainLength": "Alan adı 1-253 karakter olmalıdır",
    "invalidLocal": "Yerel bölüm geçersiz",
    "invalidDomain": "Alan adı geçersiz",
    "invalidTld": "Alan adı bir TLD içermelidir"
  },
  "nl": {
    "email": "E-mailadres",
    "placeholder": "name{'@'}example.com",
    "valid": "Geldig e-mailadres",
    "invalid": "Ongeldig e-mailadres",
    "invalidAt": "E-mail moet precies één {'@'} bevatten",
    "invalidLength": "E-mail mag maximaal 254 tekens zijn",
    "invalidLocalLength": "Lokaal deel moet 1-64 tekens zijn",
    "invalidDomainLength": "Domein moet 1-253 tekens zijn",
    "invalidLocal": "Lokaal deel is ongeldig",
    "invalidDomain": "Domein is ongeldig",
    "invalidTld": "Domein moet een TLD bevatten"
  },
  "sv": {
    "email": "E-postadress",
    "placeholder": "name{'@'}example.com",
    "valid": "Giltig e-postadress",
    "invalid": "Ogiltig e-postadress",
    "invalidAt": "E-post måste innehålla exakt ett {'@'}",
    "invalidLength": "E-post får vara högst 254 tecken",
    "invalidLocalLength": "Lokaldelen måste vara 1-64 tecken",
    "invalidDomainLength": "Domänen måste vara 1-253 tecken",
    "invalidLocal": "Lokaldelen är ogiltig",
    "invalidDomain": "Domänen är ogiltig",
    "invalidTld": "Domänen måste innehålla en TLD"
  },
  "pl": {
    "email": "Adres e-mail",
    "placeholder": "name{'@'}example.com",
    "valid": "Poprawny adres e-mail",
    "invalid": "Niepoprawny adres e-mail",
    "invalidAt": "Adres e-mail musi zawierać dokładnie jeden {'@'}",
    "invalidLength": "Adres e-mail może mieć maksymalnie 254 znaki",
    "invalidLocalLength": "Część lokalna musi mieć 1-64 znaki",
    "invalidDomainLength": "Domena musi mieć 1-253 znaki",
    "invalidLocal": "Część lokalna jest niepoprawna",
    "invalidDomain": "Domena jest niepoprawna",
    "invalidTld": "Domena musi zawierać TLD"
  },
  "vi": {
    "email": "Địa chỉ email",
    "placeholder": "name{'@'}example.com",
    "valid": "Địa chỉ email hợp lệ",
    "invalid": "Địa chỉ email không hợp lệ",
    "invalidAt": "Email phải có đúng một ký tự {'@'}",
    "invalidLength": "Email tối đa 254 ký tự",
    "invalidLocalLength": "Phần cục bộ phải có 1-64 ký tự",
    "invalidDomainLength": "Tên miền phải có 1-253 ký tự",
    "invalidLocal": "Phần cục bộ không hợp lệ",
    "invalidDomain": "Tên miền không hợp lệ",
    "invalidTld": "Tên miền phải có TLD"
  },
  "th": {
    "email": "ที่อยู่อีเมล",
    "placeholder": "name{'@'}example.com",
    "valid": "ที่อยู่อีเมลถูกต้อง",
    "invalid": "ที่อยู่อีเมลไม่ถูกต้อง",
    "invalidAt": "อีเมลต้องมี {'@'} เพียงตัวเดียว",
    "invalidLength": "อีเมลยาวได้ไม่เกิน 254 ตัวอักษร",
    "invalidLocalLength": "ส่วนโลคัลต้องยาว 1-64 ตัวอักษร",
    "invalidDomainLength": "โดเมนต้องยาว 1-253 ตัวอักษร",
    "invalidLocal": "ส่วนโลคัลไม่ถูกต้อง",
    "invalidDomain": "โดเมนไม่ถูกต้อง",
    "invalidTld": "โดเมนต้องมี TLD"
  },
  "id": {
    "email": "Alamat email",
    "placeholder": "name{'@'}example.com",
    "valid": "Alamat email valid",
    "invalid": "Alamat email tidak valid",
    "invalidAt": "Email harus memiliki satu {'@'}",
    "invalidLength": "Email maksimal 254 karakter",
    "invalidLocalLength": "Bagian lokal harus 1-64 karakter",
    "invalidDomainLength": "Domain harus 1-253 karakter",
    "invalidLocal": "Bagian lokal tidak valid",
    "invalidDomain": "Domain tidak valid",
    "invalidTld": "Domain harus memiliki TLD"
  },
  "he": {
    "email": "כתובת דוא\"ל",
    "placeholder": "name{'@'}example.com",
    "valid": "כתובת דוא\"ל תקינה",
    "invalid": "כתובת דוא\"ל לא תקינה",
    "invalidAt": "כתובת הדוא\"ל חייבת לכלול {'@'} אחד בלבד",
    "invalidLength": "אורך הדוא\"ל עד 254 תווים",
    "invalidLocalLength": "החלק המקומי חייב להיות 1-64 תווים",
    "invalidDomainLength": "הדומיין חייב להיות 1-253 תווים",
    "invalidLocal": "החלק המקומי אינו תקין",
    "invalidDomain": "הדומיין אינו תקין",
    "invalidTld": "הדומיין חייב לכלול TLD"
  },
  "ms": {
    "email": "Alamat e-mel",
    "placeholder": "name{'@'}example.com",
    "valid": "Alamat e-mel sah",
    "invalid": "Alamat e-mel tidak sah",
    "invalidAt": "E-mel mesti mengandungi satu {'@'}",
    "invalidLength": "E-mel maksimum 254 aksara",
    "invalidLocalLength": "Bahagian lokal mestilah 1-64 aksara",
    "invalidDomainLength": "Domain mestilah 1-253 aksara",
    "invalidLocal": "Bahagian lokal tidak sah",
    "invalidDomain": "Domain tidak sah",
    "invalidTld": "Domain mesti mengandungi TLD"
  },
  "no": {
    "email": "E-postadresse",
    "placeholder": "name{'@'}example.com",
    "valid": "Gyldig e-postadresse",
    "invalid": "Ugyldig e-postadresse",
    "invalidAt": "E-post må inneholde nøyaktig én {'@'}",
    "invalidLength": "E-post kan ikke være lengre enn 254 tegn",
    "invalidLocalLength": "Lokal del må være 1-64 tegn",
    "invalidDomainLength": "Domene må være 1-253 tegn",
    "invalidLocal": "Lokal del er ugyldig",
    "invalidDomain": "Domene er ugyldig",
    "invalidTld": "Domene må inneholde en TLD"
  }
}
</i18n>
