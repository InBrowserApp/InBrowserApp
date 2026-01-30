<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <NDescriptionsItem :label="t('brand')">
        <NFlex align="center" :size="8">
          <NIcon
            v-if="validationResult.brand"
            :component="validationResult.brand.icon"
            :size="24"
          />
          <NIcon v-else :component="HelpCircleIcon" :size="24" />
          <span>{{ validationResult.brand?.name ?? t('unknown') }}</span>
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('formattedNumber')">
        <NFlex align="center" :size="8">
          <NText code>{{ validationResult.formattedNumber || '-' }}</NText>
          <CopyToClipboardButton
            v-if="validationResult.formattedNumber"
            :text="validationResult.digits"
            size="small"
          />
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('luhnCheck')">
        <NTag :type="validationResult.isLuhnValid ? 'success' : 'error'" size="small">
          {{ validationResult.isLuhnValid ? t('pass') : t('fail') }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('lengthCheck')">
        <NFlex align="center" :size="8">
          <NTag :type="validationResult.isLengthValid ? 'success' : 'error'" size="small">
            {{ validationResult.isLengthValid ? t('pass') : t('fail') }}
          </NTag>
          <NText v-if="validationResult.brand" depth="3">
            ({{ t('expectedLength', { lengths: validationResult.brand.lengths.join(', ') }) }})
          </NText>
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('digits')">
        <NText depth="3">{{ validationResult.digits.length }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem v-if="validationResult.brand" :label="t('cvcLength')">
        <NText depth="3">{{ validationResult.brand.cvcLength }} {{ t('digitsLabel') }}</NText>
      </NDescriptionsItem>
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NFlex, NIcon, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import HelpCircleIcon from '@vicons/fluent/QuestionCircle16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { ValidationResult } from '../data/cardBrands'

const { t } = useI18n()

defineProps<{
  validationResult: ValidationResult
}>()
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "brand": "Card Brand",
    "unknown": "Unknown",
    "formattedNumber": "Formatted Number",
    "luhnCheck": "Luhn Check",
    "lengthCheck": "Length Check",
    "digits": "Total Digits",
    "cvcLength": "CVC Length",
    "digitsLabel": "digits",
    "pass": "Pass",
    "fail": "Fail",
    "expectedLength": "expected: {lengths}"
  },
  "zh": {
    "result": "验证结果",
    "brand": "卡品牌",
    "unknown": "未知",
    "formattedNumber": "格式化卡号",
    "luhnCheck": "Luhn 校验",
    "lengthCheck": "长度校验",
    "digits": "总位数",
    "cvcLength": "CVC 长度",
    "digitsLabel": "位",
    "pass": "通过",
    "fail": "失败",
    "expectedLength": "期望: {lengths}"
  },
  "zh-CN": {
    "result": "验证结果",
    "brand": "卡品牌",
    "unknown": "未知",
    "formattedNumber": "格式化卡号",
    "luhnCheck": "Luhn 校验",
    "lengthCheck": "长度校验",
    "digits": "总位数",
    "cvcLength": "CVC 长度",
    "digitsLabel": "位",
    "pass": "通过",
    "fail": "失败",
    "expectedLength": "期望: {lengths}"
  },
  "zh-TW": {
    "result": "驗證結果",
    "brand": "卡品牌",
    "unknown": "未知",
    "formattedNumber": "格式化卡號",
    "luhnCheck": "Luhn 校驗",
    "lengthCheck": "長度校驗",
    "digits": "總位數",
    "cvcLength": "CVC 長度",
    "digitsLabel": "位",
    "pass": "通過",
    "fail": "失敗",
    "expectedLength": "期望: {lengths}"
  },
  "zh-HK": {
    "result": "驗證結果",
    "brand": "卡品牌",
    "unknown": "未知",
    "formattedNumber": "格式化卡號",
    "luhnCheck": "Luhn 校驗",
    "lengthCheck": "長度校驗",
    "digits": "總位數",
    "cvcLength": "CVC 長度",
    "digitsLabel": "位",
    "pass": "通過",
    "fail": "失敗",
    "expectedLength": "期望: {lengths}"
  },
  "es": {
    "result": "Resultado de Validación",
    "brand": "Marca de Tarjeta",
    "unknown": "Desconocido",
    "formattedNumber": "Número Formateado",
    "luhnCheck": "Verificación Luhn",
    "lengthCheck": "Verificación de Longitud",
    "digits": "Dígitos Totales",
    "cvcLength": "Longitud CVC",
    "digitsLabel": "dígitos",
    "pass": "Aprobado",
    "fail": "Fallido",
    "expectedLength": "esperado: {lengths}"
  },
  "fr": {
    "result": "Résultat de Validation",
    "brand": "Marque de Carte",
    "unknown": "Inconnu",
    "formattedNumber": "Numéro Formaté",
    "luhnCheck": "Vérification Luhn",
    "lengthCheck": "Vérification de Longueur",
    "digits": "Chiffres Totaux",
    "cvcLength": "Longueur CVC",
    "digitsLabel": "chiffres",
    "pass": "Réussi",
    "fail": "Échoué",
    "expectedLength": "attendu: {lengths}"
  },
  "de": {
    "result": "Validierungsergebnis",
    "brand": "Kartenmarke",
    "unknown": "Unbekannt",
    "formattedNumber": "Formatierte Nummer",
    "luhnCheck": "Luhn-Prüfung",
    "lengthCheck": "Längenprüfung",
    "digits": "Gesamtziffern",
    "cvcLength": "CVC-Länge",
    "digitsLabel": "Ziffern",
    "pass": "Bestanden",
    "fail": "Fehlgeschlagen",
    "expectedLength": "erwartet: {lengths}"
  },
  "it": {
    "result": "Risultato Validazione",
    "brand": "Marca Carta",
    "unknown": "Sconosciuto",
    "formattedNumber": "Numero Formattato",
    "luhnCheck": "Verifica Luhn",
    "lengthCheck": "Verifica Lunghezza",
    "digits": "Cifre Totali",
    "cvcLength": "Lunghezza CVC",
    "digitsLabel": "cifre",
    "pass": "Superato",
    "fail": "Fallito",
    "expectedLength": "previsto: {lengths}"
  },
  "ja": {
    "result": "検証結果",
    "brand": "カードブランド",
    "unknown": "不明",
    "formattedNumber": "フォーマット番号",
    "luhnCheck": "Luhn チェック",
    "lengthCheck": "長さチェック",
    "digits": "総桁数",
    "cvcLength": "CVC 桁数",
    "digitsLabel": "桁",
    "pass": "合格",
    "fail": "不合格",
    "expectedLength": "期待値: {lengths}"
  },
  "ko": {
    "result": "검증 결과",
    "brand": "카드 브랜드",
    "unknown": "알 수 없음",
    "formattedNumber": "포맷된 번호",
    "luhnCheck": "Luhn 검사",
    "lengthCheck": "길이 검사",
    "digits": "총 자릿수",
    "cvcLength": "CVC 길이",
    "digitsLabel": "자리",
    "pass": "통과",
    "fail": "실패",
    "expectedLength": "예상: {lengths}"
  },
  "ru": {
    "result": "Результат Проверки",
    "brand": "Бренд Карты",
    "unknown": "Неизвестно",
    "formattedNumber": "Форматированный Номер",
    "luhnCheck": "Проверка Луна",
    "lengthCheck": "Проверка Длины",
    "digits": "Всего Цифр",
    "cvcLength": "Длина CVC",
    "digitsLabel": "цифр",
    "pass": "Пройдено",
    "fail": "Не пройдено",
    "expectedLength": "ожидается: {lengths}"
  },
  "pt": {
    "result": "Resultado da Validação",
    "brand": "Bandeira do Cartão",
    "unknown": "Desconhecido",
    "formattedNumber": "Número Formatado",
    "luhnCheck": "Verificação Luhn",
    "lengthCheck": "Verificação de Comprimento",
    "digits": "Total de Dígitos",
    "cvcLength": "Comprimento CVC",
    "digitsLabel": "dígitos",
    "pass": "Aprovado",
    "fail": "Reprovado",
    "expectedLength": "esperado: {lengths}"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "brand": "العلامة التجارية للبطاقة",
    "unknown": "غير معروف",
    "formattedNumber": "الرقم المنسق",
    "luhnCheck": "فحص Luhn",
    "lengthCheck": "فحص الطول",
    "digits": "إجمالي الأرقام",
    "cvcLength": "طول CVC",
    "digitsLabel": "أرقام",
    "pass": "ناجح",
    "fail": "فاشل",
    "expectedLength": "المتوقع: {lengths}"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "brand": "कार्ड ब्रांड",
    "unknown": "अज्ञात",
    "formattedNumber": "फॉर्मेटेड नंबर",
    "luhnCheck": "Luhn जांच",
    "lengthCheck": "लंबाई जांच",
    "digits": "कुल अंक",
    "cvcLength": "CVC लंबाई",
    "digitsLabel": "अंक",
    "pass": "उत्तीर्ण",
    "fail": "असफल",
    "expectedLength": "अपेक्षित: {lengths}"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "brand": "Kart Markası",
    "unknown": "Bilinmiyor",
    "formattedNumber": "Biçimlendirilmiş Numara",
    "luhnCheck": "Luhn Kontrolü",
    "lengthCheck": "Uzunluk Kontrolü",
    "digits": "Toplam Rakam",
    "cvcLength": "CVC Uzunluğu",
    "digitsLabel": "rakam",
    "pass": "Geçti",
    "fail": "Başarısız",
    "expectedLength": "beklenen: {lengths}"
  },
  "nl": {
    "result": "Validatieresultaat",
    "brand": "Kaartmerk",
    "unknown": "Onbekend",
    "formattedNumber": "Geformatteerd Nummer",
    "luhnCheck": "Luhn Controle",
    "lengthCheck": "Lengtecontrole",
    "digits": "Totaal Cijfers",
    "cvcLength": "CVC Lengte",
    "digitsLabel": "cijfers",
    "pass": "Geslaagd",
    "fail": "Mislukt",
    "expectedLength": "verwacht: {lengths}"
  },
  "sv": {
    "result": "Valideringsresultat",
    "brand": "Kortmärke",
    "unknown": "Okänt",
    "formattedNumber": "Formaterat Nummer",
    "luhnCheck": "Luhn-kontroll",
    "lengthCheck": "Längdkontroll",
    "digits": "Totalt Siffror",
    "cvcLength": "CVC-längd",
    "digitsLabel": "siffror",
    "pass": "Godkänd",
    "fail": "Misslyckad",
    "expectedLength": "förväntat: {lengths}"
  },
  "pl": {
    "result": "Wynik Walidacji",
    "brand": "Marka Karty",
    "unknown": "Nieznany",
    "formattedNumber": "Sformatowany Numer",
    "luhnCheck": "Sprawdzenie Luhna",
    "lengthCheck": "Sprawdzenie Długości",
    "digits": "Całkowita Liczba Cyfr",
    "cvcLength": "Długość CVC",
    "digitsLabel": "cyfr",
    "pass": "Zaliczony",
    "fail": "Niezaliczony",
    "expectedLength": "oczekiwane: {lengths}"
  },
  "vi": {
    "result": "Kết Quả Xác Thực",
    "brand": "Thương Hiệu Thẻ",
    "unknown": "Không xác định",
    "formattedNumber": "Số Đã Định Dạng",
    "luhnCheck": "Kiểm Tra Luhn",
    "lengthCheck": "Kiểm Tra Độ Dài",
    "digits": "Tổng Số Chữ Số",
    "cvcLength": "Độ Dài CVC",
    "digitsLabel": "chữ số",
    "pass": "Đạt",
    "fail": "Không đạt",
    "expectedLength": "dự kiến: {lengths}"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "brand": "แบรนด์บัตร",
    "unknown": "ไม่ทราบ",
    "formattedNumber": "หมายเลขที่จัดรูปแบบ",
    "luhnCheck": "การตรวจสอบ Luhn",
    "lengthCheck": "การตรวจสอบความยาว",
    "digits": "จำนวนหลักทั้งหมด",
    "cvcLength": "ความยาว CVC",
    "digitsLabel": "หลัก",
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน",
    "expectedLength": "คาดหวัง: {lengths}"
  },
  "id": {
    "result": "Hasil Validasi",
    "brand": "Merek Kartu",
    "unknown": "Tidak diketahui",
    "formattedNumber": "Nomor Terformat",
    "luhnCheck": "Pemeriksaan Luhn",
    "lengthCheck": "Pemeriksaan Panjang",
    "digits": "Total Digit",
    "cvcLength": "Panjang CVC",
    "digitsLabel": "digit",
    "pass": "Lulus",
    "fail": "Gagal",
    "expectedLength": "diharapkan: {lengths}"
  },
  "he": {
    "result": "תוצאת אימות",
    "brand": "מותג כרטיס",
    "unknown": "לא ידוע",
    "formattedNumber": "מספר מעוצב",
    "luhnCheck": "בדיקת Luhn",
    "lengthCheck": "בדיקת אורך",
    "digits": "סה\"כ ספרות",
    "cvcLength": "אורך CVC",
    "digitsLabel": "ספרות",
    "pass": "עבר",
    "fail": "נכשל",
    "expectedLength": "צפוי: {lengths}"
  },
  "ms": {
    "result": "Keputusan Pengesahan",
    "brand": "Jenama Kad",
    "unknown": "Tidak diketahui",
    "formattedNumber": "Nombor Berformat",
    "luhnCheck": "Semakan Luhn",
    "lengthCheck": "Semakan Panjang",
    "digits": "Jumlah Digit",
    "cvcLength": "Panjang CVC",
    "digitsLabel": "digit",
    "pass": "Lulus",
    "fail": "Gagal",
    "expectedLength": "dijangka: {lengths}"
  },
  "no": {
    "result": "Valideringsresultat",
    "brand": "Kortmerke",
    "unknown": "Ukjent",
    "formattedNumber": "Formatert Nummer",
    "luhnCheck": "Luhn-sjekk",
    "lengthCheck": "Lengdesjekk",
    "digits": "Totalt Sifre",
    "cvcLength": "CVC-lengde",
    "digitsLabel": "sifre",
    "pass": "Bestått",
    "fail": "Mislykket",
    "expectedLength": "forventet: {lengths}"
  }
}
</i18n>
