<template>
  <NFormItem
    :label="t('cardNumber')"
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
        <NIcon v-if="validationResult.brand" :component="validationResult.brand.icon" :size="24" />
        <NIcon v-else :component="CreditCardIcon" :size="24" />
      </template>
    </NInput>
  </NFormItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItem, NInput, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import CreditCardIcon from '@vicons/fluent/Payment20Regular'
import type { ValidationResult } from '../data/cardBrands'

const { t } = useI18n()

const props = defineProps<{
  modelValue: string
  validationResult: ValidationResult
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
  if (!props.validationResult.isLuhnValid) return t('invalidLuhn')
  if (!props.validationResult.isLengthValid) return t('invalidLength')
  return t('invalid')
})
</script>

<i18n lang="json">
{
  "en": {
    "cardNumber": "Credit Card Number",
    "placeholder": "Enter credit card number",
    "valid": "Valid card number",
    "invalid": "Invalid card number",
    "invalidLuhn": "Invalid checksum (Luhn algorithm failed)",
    "invalidLength": "Invalid card number length"
  },
  "zh": {
    "cardNumber": "信用卡号",
    "placeholder": "输入信用卡号",
    "valid": "有效的卡号",
    "invalid": "无效的卡号",
    "invalidLuhn": "校验和无效 (Luhn 算法失败)",
    "invalidLength": "卡号长度无效"
  },
  "zh-CN": {
    "cardNumber": "信用卡号",
    "placeholder": "输入信用卡号",
    "valid": "有效的卡号",
    "invalid": "无效的卡号",
    "invalidLuhn": "校验和无效 (Luhn 算法失败)",
    "invalidLength": "卡号长度无效"
  },
  "zh-TW": {
    "cardNumber": "信用卡號",
    "placeholder": "輸入信用卡號",
    "valid": "有效的卡號",
    "invalid": "無效的卡號",
    "invalidLuhn": "校驗碼無效 (Luhn 演算法失敗)",
    "invalidLength": "卡號長度無效"
  },
  "zh-HK": {
    "cardNumber": "信用卡號",
    "placeholder": "輸入信用卡號",
    "valid": "有效的卡號",
    "invalid": "無效的卡號",
    "invalidLuhn": "校驗碼無效 (Luhn 演算法失敗)",
    "invalidLength": "卡號長度無效"
  },
  "es": {
    "cardNumber": "Número de Tarjeta de Crédito",
    "placeholder": "Ingrese el número de tarjeta de crédito",
    "valid": "Número de tarjeta válido",
    "invalid": "Número de tarjeta inválido",
    "invalidLuhn": "Suma de verificación inválida (algoritmo de Luhn falló)",
    "invalidLength": "Longitud del número de tarjeta inválida"
  },
  "fr": {
    "cardNumber": "Numéro de Carte de Crédit",
    "placeholder": "Entrez le numéro de carte de crédit",
    "valid": "Numéro de carte valide",
    "invalid": "Numéro de carte invalide",
    "invalidLuhn": "Somme de contrôle invalide (algorithme de Luhn échoué)",
    "invalidLength": "Longueur du numéro de carte invalide"
  },
  "de": {
    "cardNumber": "Kreditkartennummer",
    "placeholder": "Kreditkartennummer eingeben",
    "valid": "Gültige Kartennummer",
    "invalid": "Ungültige Kartennummer",
    "invalidLuhn": "Ungültige Prüfsumme (Luhn-Algorithmus fehlgeschlagen)",
    "invalidLength": "Ungültige Kartennummernlänge"
  },
  "it": {
    "cardNumber": "Numero Carta di Credito",
    "placeholder": "Inserisci il numero della carta di credito",
    "valid": "Numero carta valido",
    "invalid": "Numero carta non valido",
    "invalidLuhn": "Checksum non valido (algoritmo di Luhn fallito)",
    "invalidLength": "Lunghezza numero carta non valida"
  },
  "ja": {
    "cardNumber": "クレジットカード番号",
    "placeholder": "クレジットカード番号を入力",
    "valid": "有効なカード番号",
    "invalid": "無効なカード番号",
    "invalidLuhn": "チェックサムが無効 (Luhnアルゴリズム失敗)",
    "invalidLength": "カード番号の長さが無効"
  },
  "ko": {
    "cardNumber": "신용카드 번호",
    "placeholder": "신용카드 번호 입력",
    "valid": "유효한 카드 번호",
    "invalid": "유효하지 않은 카드 번호",
    "invalidLuhn": "체크섬 오류 (Luhn 알고리즘 실패)",
    "invalidLength": "카드 번호 길이 오류"
  },
  "ru": {
    "cardNumber": "Номер Кредитной Карты",
    "placeholder": "Введите номер кредитной карты",
    "valid": "Действительный номер карты",
    "invalid": "Недействительный номер карты",
    "invalidLuhn": "Неверная контрольная сумма (алгоритм Луна не пройден)",
    "invalidLength": "Неверная длина номера карты"
  },
  "pt": {
    "cardNumber": "Número do Cartão de Crédito",
    "placeholder": "Digite o número do cartão de crédito",
    "valid": "Número do cartão válido",
    "invalid": "Número do cartão inválido",
    "invalidLuhn": "Checksum inválido (algoritmo de Luhn falhou)",
    "invalidLength": "Comprimento do número do cartão inválido"
  },
  "ar": {
    "cardNumber": "رقم بطاقة الائتمان",
    "placeholder": "أدخل رقم بطاقة الائتمان",
    "valid": "رقم بطاقة صالح",
    "invalid": "رقم بطاقة غير صالح",
    "invalidLuhn": "المجموع الاختباري غير صالح (فشل خوارزمية Luhn)",
    "invalidLength": "طول رقم البطاقة غير صالح"
  },
  "hi": {
    "cardNumber": "क्रेडिट कार्ड नंबर",
    "placeholder": "क्रेडिट कार्ड नंबर दर्ज करें",
    "valid": "मान्य कार्ड नंबर",
    "invalid": "अमान्य कार्ड नंबर",
    "invalidLuhn": "अमान्य चेकसम (Luhn एल्गोरिथम विफल)",
    "invalidLength": "अमान्य कार्ड नंबर लंबाई"
  },
  "tr": {
    "cardNumber": "Kredi Kartı Numarası",
    "placeholder": "Kredi kartı numarasını girin",
    "valid": "Geçerli kart numarası",
    "invalid": "Geçersiz kart numarası",
    "invalidLuhn": "Geçersiz sağlama toplamı (Luhn algoritması başarısız)",
    "invalidLength": "Geçersiz kart numarası uzunluğu"
  },
  "nl": {
    "cardNumber": "Creditcardnummer",
    "placeholder": "Voer creditcardnummer in",
    "valid": "Geldig kaartnummer",
    "invalid": "Ongeldig kaartnummer",
    "invalidLuhn": "Ongeldige controlesom (Luhn-algoritme mislukt)",
    "invalidLength": "Ongeldige kaartnummerlengte"
  },
  "sv": {
    "cardNumber": "Kreditkortsnummer",
    "placeholder": "Ange kreditkortsnummer",
    "valid": "Giltigt kortnummer",
    "invalid": "Ogiltigt kortnummer",
    "invalidLuhn": "Ogiltig kontrollsumma (Luhn-algoritm misslyckades)",
    "invalidLength": "Ogiltig kortnummerlängd"
  },
  "pl": {
    "cardNumber": "Numer Karty Kredytowej",
    "placeholder": "Wprowadź numer karty kredytowej",
    "valid": "Prawidłowy numer karty",
    "invalid": "Nieprawidłowy numer karty",
    "invalidLuhn": "Nieprawidłowa suma kontrolna (algorytm Luhna nie powiódł się)",
    "invalidLength": "Nieprawidłowa długość numeru karty"
  },
  "vi": {
    "cardNumber": "Số Thẻ Tín Dụng",
    "placeholder": "Nhập số thẻ tín dụng",
    "valid": "Số thẻ hợp lệ",
    "invalid": "Số thẻ không hợp lệ",
    "invalidLuhn": "Checksum không hợp lệ (thuật toán Luhn thất bại)",
    "invalidLength": "Độ dài số thẻ không hợp lệ"
  },
  "th": {
    "cardNumber": "หมายเลขบัตรเครดิต",
    "placeholder": "ใส่หมายเลขบัตรเครดิต",
    "valid": "หมายเลขบัตรถูกต้อง",
    "invalid": "หมายเลขบัตรไม่ถูกต้อง",
    "invalidLuhn": "Checksum ไม่ถูกต้อง (อัลกอริทึม Luhn ล้มเหลว)",
    "invalidLength": "ความยาวหมายเลขบัตรไม่ถูกต้อง"
  },
  "id": {
    "cardNumber": "Nomor Kartu Kredit",
    "placeholder": "Masukkan nomor kartu kredit",
    "valid": "Nomor kartu valid",
    "invalid": "Nomor kartu tidak valid",
    "invalidLuhn": "Checksum tidak valid (algoritma Luhn gagal)",
    "invalidLength": "Panjang nomor kartu tidak valid"
  },
  "he": {
    "cardNumber": "מספר כרטיס אשראי",
    "placeholder": "הזן מספר כרטיס אשראי",
    "valid": "מספר כרטיס תקין",
    "invalid": "מספר כרטיס לא תקין",
    "invalidLuhn": "סכום ביקורת לא תקין (אלגוריתם Luhn נכשל)",
    "invalidLength": "אורך מספר כרטיס לא תקין"
  },
  "ms": {
    "cardNumber": "Nombor Kad Kredit",
    "placeholder": "Masukkan nombor kad kredit",
    "valid": "Nombor kad sah",
    "invalid": "Nombor kad tidak sah",
    "invalidLuhn": "Checksum tidak sah (algoritma Luhn gagal)",
    "invalidLength": "Panjang nombor kad tidak sah"
  },
  "no": {
    "cardNumber": "Kredittkortnummer",
    "placeholder": "Skriv inn kredittkortnummer",
    "valid": "Gyldig kortnummer",
    "invalid": "Ugyldig kortnummer",
    "invalidLuhn": "Ugyldig kontrollsum (Luhn-algoritme mislyktes)",
    "invalidLength": "Ugyldig kortnummerlengde"
  }
}
</i18n>
