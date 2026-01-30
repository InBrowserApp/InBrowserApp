<template>
  <NDescriptionsItem :label="t('birthdate')">
    <ResidentIdTextValue :value="validationResult.birthDateText" />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('age')">
    <ResidentIdTextValue :value="validationResult.age" />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('gender')">
    <ResidentIdGenderDisplay :gender="validationResult.gender" />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('sequenceCode')">
    <ResidentIdTextValue :value="validationResult.sequenceCode" />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('checksum')">
    <ResidentIdChecksumTag :is-checksum-valid="validationResult.isChecksumValid" />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('checkDigit')">
    <ResidentIdCheckDigitDisplay
      :expected="validationResult.expectedCheckDigit"
      :actual="validationResult.actualCheckDigit"
    />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('normalized')">
    <ResidentIdCopyableValue :value="validationResult.normalized" />
  </NDescriptionsItem>
</template>

<script setup lang="ts">
import { NDescriptionsItem } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { ResidentIdValidationResult } from '../data/residentId'
import ResidentIdCheckDigitDisplay from './ResidentIdCheckDigitDisplay.vue'
import ResidentIdChecksumTag from './ResidentIdChecksumTag.vue'
import ResidentIdCopyableValue from './ResidentIdCopyableValue.vue'
import ResidentIdGenderDisplay from './ResidentIdGenderDisplay.vue'
import ResidentIdTextValue from './ResidentIdTextValue.vue'

defineProps<{
  validationResult: ResidentIdValidationResult
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "birthdate": "Birthdate",
    "age": "Age",
    "gender": "Gender",
    "sequenceCode": "Sequence Code",
    "checksum": "Checksum",
    "checkDigit": "Check Digit",
    "normalized": "Normalized ID"
  },
  "zh": {
    "birthdate": "出生日期",
    "age": "年龄",
    "gender": "性别",
    "sequenceCode": "顺序码",
    "checksum": "校验和",
    "checkDigit": "校验位",
    "normalized": "标准化身份证号"
  },
  "zh-CN": {
    "birthdate": "出生日期",
    "age": "年龄",
    "gender": "性别",
    "sequenceCode": "顺序码",
    "checksum": "校验和",
    "checkDigit": "校验位",
    "normalized": "标准化身份证号"
  },
  "zh-TW": {
    "birthdate": "出生日期",
    "age": "年齡",
    "gender": "性別",
    "sequenceCode": "順序碼",
    "checksum": "校驗和",
    "checkDigit": "校驗位",
    "normalized": "標準化身分證號"
  },
  "zh-HK": {
    "birthdate": "出生日期",
    "age": "年齡",
    "gender": "性別",
    "sequenceCode": "順序碼",
    "checksum": "校驗和",
    "checkDigit": "校驗位",
    "normalized": "標準化身份證號"
  },
  "es": {
    "birthdate": "Fecha de nacimiento",
    "age": "Edad",
    "gender": "Género",
    "sequenceCode": "Código de secuencia",
    "checksum": "Checksum",
    "checkDigit": "Dígito de control",
    "normalized": "ID normalizado"
  },
  "fr": {
    "birthdate": "Date de naissance",
    "age": "Âge",
    "gender": "Genre",
    "sequenceCode": "Code de séquence",
    "checksum": "Somme de contrôle",
    "checkDigit": "Chiffre de contrôle",
    "normalized": "ID normalisé"
  },
  "de": {
    "birthdate": "Geburtsdatum",
    "age": "Alter",
    "gender": "Geschlecht",
    "sequenceCode": "Sequenzcode",
    "checksum": "Prüfsumme",
    "checkDigit": "Prüfziffer",
    "normalized": "Normalisierte ID"
  },
  "it": {
    "birthdate": "Data di nascita",
    "age": "Età",
    "gender": "Genere",
    "sequenceCode": "Codice di sequenza",
    "checksum": "Checksum",
    "checkDigit": "Cifra di controllo",
    "normalized": "ID normalizzato"
  },
  "ja": {
    "birthdate": "生年月日",
    "age": "年齢",
    "gender": "性別",
    "sequenceCode": "順序コード",
    "checksum": "チェックサム",
    "checkDigit": "チェックディジット",
    "normalized": "正規化ID"
  },
  "ko": {
    "birthdate": "생년월일",
    "age": "나이",
    "gender": "성별",
    "sequenceCode": "순번 코드",
    "checksum": "체크섬",
    "checkDigit": "검증 자리",
    "normalized": "정규화된 ID"
  },
  "ru": {
    "birthdate": "Дата рождения",
    "age": "Возраст",
    "gender": "Пол",
    "sequenceCode": "Код последовательности",
    "checksum": "Контрольная сумма",
    "checkDigit": "Контрольный знак",
    "normalized": "Нормализованный ID"
  },
  "pt": {
    "birthdate": "Data de nascimento",
    "age": "Idade",
    "gender": "Gênero",
    "sequenceCode": "Código de sequência",
    "checksum": "Checksum",
    "checkDigit": "Dígito verificador",
    "normalized": "ID normalizado"
  },
  "ar": {
    "birthdate": "تاريخ الميلاد",
    "age": "العمر",
    "gender": "الجنس",
    "sequenceCode": "رمز التسلسل",
    "checksum": "المجموع الاختباري",
    "checkDigit": "رقم التحقق",
    "normalized": "الرقم الموحّد"
  },
  "hi": {
    "birthdate": "जन्म तिथि",
    "age": "आयु",
    "gender": "लिंग",
    "sequenceCode": "अनुक्रम कोड",
    "checksum": "चेकसम",
    "checkDigit": "जाँच अंक",
    "normalized": "मानकीकृत आईडी"
  },
  "tr": {
    "birthdate": "Doğum tarihi",
    "age": "Yaş",
    "gender": "Cinsiyet",
    "sequenceCode": "Sıra kodu",
    "checksum": "Sağlama toplamı",
    "checkDigit": "Kontrol basamağı",
    "normalized": "Normalize edilmiş ID"
  },
  "nl": {
    "birthdate": "Geboortedatum",
    "age": "Leeftijd",
    "gender": "Geslacht",
    "sequenceCode": "Volgnummercode",
    "checksum": "Controlegetal",
    "checkDigit": "Controlecijfer",
    "normalized": "Genormaliseerde ID"
  },
  "sv": {
    "birthdate": "Födelsedatum",
    "age": "Ålder",
    "gender": "Kön",
    "sequenceCode": "Sekvenskod",
    "checksum": "Kontrollsumma",
    "checkDigit": "Kontrollsiffra",
    "normalized": "Normaliserat ID"
  },
  "pl": {
    "birthdate": "Data urodzenia",
    "age": "Wiek",
    "gender": "Płeć",
    "sequenceCode": "Kod sekwencji",
    "checksum": "Suma kontrolna",
    "checkDigit": "Cyfra kontrolna",
    "normalized": "Znormalizowane ID"
  },
  "vi": {
    "birthdate": "Ngày sinh",
    "age": "Tuổi",
    "gender": "Giới tính",
    "sequenceCode": "Mã thứ tự",
    "checksum": "Checksum",
    "checkDigit": "Chữ số kiểm tra",
    "normalized": "ID chuẩn hóa"
  },
  "th": {
    "birthdate": "วันเกิด",
    "age": "อายุ",
    "gender": "เพศ",
    "sequenceCode": "รหัสลำดับ",
    "checksum": "เช็คซัม",
    "checkDigit": "เลขตรวจสอบ",
    "normalized": "ID ที่ปรับมาตรฐาน"
  },
  "id": {
    "birthdate": "Tanggal lahir",
    "age": "Usia",
    "gender": "Jenis kelamin",
    "sequenceCode": "Kode urutan",
    "checksum": "Checksum",
    "checkDigit": "Digit pemeriksa",
    "normalized": "ID ternormalisasi"
  },
  "he": {
    "birthdate": "תאריך לידה",
    "age": "גיל",
    "gender": "מגדר",
    "sequenceCode": "קוד רצף",
    "checksum": "סכום ביקורת",
    "checkDigit": "ספרת ביקורת",
    "normalized": "מזהה מנורמל"
  },
  "ms": {
    "birthdate": "Tarikh lahir",
    "age": "Umur",
    "gender": "Jantina",
    "sequenceCode": "Kod urutan",
    "checksum": "Checksum",
    "checkDigit": "Digit semakan",
    "normalized": "ID dinormalkan"
  },
  "no": {
    "birthdate": "Fødselsdato",
    "age": "Alder",
    "gender": "Kjønn",
    "sequenceCode": "Sekvenskode",
    "checksum": "Kontrollsum",
    "checkDigit": "Kontrollsiffer",
    "normalized": "Normalisert ID"
  }
}
</i18n>
