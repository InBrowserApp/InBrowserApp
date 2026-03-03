<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <NDescriptionsItem :label="t('status')">
        <NTag :type="validationResult.isValid ? 'success' : 'error'" size="small">
          {{ validationResult.isValid ? t('valid') : t('invalid') }}
        </NTag>
      </NDescriptionsItem>

      <NDescriptionsItem :label="t('reason')">
        <NText depth="3">{{ reasonText }}</NText>
      </NDescriptionsItem>

      <NDescriptionsItem :label="t('normalized')">
        <NText code>{{ validationResult.normalized || '-' }}</NText>
      </NDescriptionsItem>

      <NDescriptionsItem :label="t('expectedCheckDigit')">
        <NText depth="3">{{ validationResult.expectedCheckDigit ?? '-' }}</NText>
      </NDescriptionsItem>

      <NDescriptionsItem :label="t('actualCheckDigit')">
        <NText depth="3">{{ validationResult.checkDigit ?? '-' }}</NText>
      </NDescriptionsItem>
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { IMEIValidationResult } from '../data/imei'

const props = defineProps<{
  validationResult: IMEIValidationResult
}>()

const { t } = useI18n()

const reasonText = computed(() => {
  if (props.validationResult.reason === 'valid') {
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
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "zh": {
    "result": "验证结果",
    "status": "状态",
    "reason": "原因",
    "normalized": "标准化 IMEI",
    "expectedCheckDigit": "期望校验位",
    "actualCheckDigit": "实际校验位",
    "valid": "有效的 IMEI",
    "invalid": "无效的 IMEI",
    "invalidLength": "IMEI 必须正好为 15 位",
    "invalidFormat": "IMEI 只能包含数字",
    "invalidChecksum": "校验位无效"
  },
  "zh-CN": {
    "result": "验证结果",
    "status": "状态",
    "reason": "原因",
    "normalized": "标准化 IMEI",
    "expectedCheckDigit": "期望校验位",
    "actualCheckDigit": "实际校验位",
    "valid": "有效的 IMEI",
    "invalid": "无效的 IMEI",
    "invalidLength": "IMEI 必须正好为 15 位",
    "invalidFormat": "IMEI 只能包含数字",
    "invalidChecksum": "校验位无效"
  },
  "zh-TW": {
    "result": "驗證結果",
    "status": "狀態",
    "reason": "原因",
    "normalized": "標準化 IMEI",
    "expectedCheckDigit": "期望校驗位",
    "actualCheckDigit": "實際校驗位",
    "valid": "有效的 IMEI",
    "invalid": "無效的 IMEI",
    "invalidLength": "IMEI 必須剛好為 15 位",
    "invalidFormat": "IMEI 只能包含數字",
    "invalidChecksum": "校驗位無效"
  },
  "zh-HK": {
    "result": "驗證結果",
    "status": "狀態",
    "reason": "原因",
    "normalized": "標準化 IMEI",
    "expectedCheckDigit": "期望校驗位",
    "actualCheckDigit": "實際校驗位",
    "valid": "有效的 IMEI",
    "invalid": "無效的 IMEI",
    "invalidLength": "IMEI 必須剛好為 15 位",
    "invalidFormat": "IMEI 只能包含數字",
    "invalidChecksum": "校驗位無效"
  },
  "es": {
    "result": "Resultado de Validación",
    "status": "Estado",
    "reason": "Motivo",
    "normalized": "IMEI normalizado",
    "expectedCheckDigit": "Dígito esperado",
    "actualCheckDigit": "Dígito real",
    "valid": "IMEI válido",
    "invalid": "IMEI inválido",
    "invalidLength": "El IMEI debe tener exactamente 15 dígitos",
    "invalidFormat": "El IMEI solo debe contener dígitos",
    "invalidChecksum": "Dígito de control inválido"
  },
  "fr": {
    "result": "Résultat de Validation",
    "status": "Statut",
    "reason": "Raison",
    "normalized": "IMEI normalisé",
    "expectedCheckDigit": "Chiffre attendu",
    "actualCheckDigit": "Chiffre réel",
    "valid": "IMEI valide",
    "invalid": "IMEI invalide",
    "invalidLength": "L'IMEI doit contenir exactement 15 chiffres",
    "invalidFormat": "L'IMEI ne doit contenir que des chiffres",
    "invalidChecksum": "Chiffre de contrôle invalide"
  },
  "de": {
    "result": "Validierungsergebnis",
    "status": "Status",
    "reason": "Grund",
    "normalized": "Normalisierte IMEI",
    "expectedCheckDigit": "Erwartete Prüfziffer",
    "actualCheckDigit": "Tatsächliche Prüfziffer",
    "valid": "Gültige IMEI",
    "invalid": "Ungültige IMEI",
    "invalidLength": "IMEI muss genau 15 Ziffern haben",
    "invalidFormat": "IMEI darf nur Ziffern enthalten",
    "invalidChecksum": "Ungültige Prüfziffer"
  },
  "it": {
    "result": "Risultato di Validazione",
    "status": "Stato",
    "reason": "Motivo",
    "normalized": "IMEI normalizzato",
    "expectedCheckDigit": "Cifra attesa",
    "actualCheckDigit": "Cifra reale",
    "valid": "IMEI valido",
    "invalid": "IMEI non valido",
    "invalidLength": "L'IMEI deve contenere esattamente 15 cifre",
    "invalidFormat": "L'IMEI deve contenere solo cifre",
    "invalidChecksum": "Cifra di controllo non valida"
  },
  "ja": {
    "result": "検証結果",
    "status": "ステータス",
    "reason": "理由",
    "normalized": "正規化 IMEI",
    "expectedCheckDigit": "期待チェックディジット",
    "actualCheckDigit": "実際のチェックディジット",
    "valid": "有効な IMEI",
    "invalid": "無効な IMEI",
    "invalidLength": "IMEI は 15 桁である必要があります",
    "invalidFormat": "IMEI は数字のみを含める必要があります",
    "invalidChecksum": "チェックディジットが無効です"
  },
  "ko": {
    "result": "검증 결과",
    "status": "상태",
    "reason": "사유",
    "normalized": "정규화된 IMEI",
    "expectedCheckDigit": "예상 체크 디지트",
    "actualCheckDigit": "실제 체크 디지트",
    "valid": "유효한 IMEI",
    "invalid": "유효하지 않은 IMEI",
    "invalidLength": "IMEI는 정확히 15자리여야 합니다",
    "invalidFormat": "IMEI는 숫자만 포함해야 합니다",
    "invalidChecksum": "체크 디지트가 올바르지 않습니다"
  },
  "ru": {
    "result": "Результат проверки",
    "status": "Статус",
    "reason": "Причина",
    "normalized": "Нормализованный IMEI",
    "expectedCheckDigit": "Ожидаемая цифра",
    "actualCheckDigit": "Фактическая цифра",
    "valid": "Действительный IMEI",
    "invalid": "Недействительный IMEI",
    "invalidLength": "IMEI должен содержать ровно 15 цифр",
    "invalidFormat": "IMEI должен содержать только цифры",
    "invalidChecksum": "Неверная контрольная цифра"
  },
  "pt": {
    "result": "Resultado da Validação",
    "status": "Status",
    "reason": "Motivo",
    "normalized": "IMEI normalizado",
    "expectedCheckDigit": "Dígito esperado",
    "actualCheckDigit": "Dígito atual",
    "valid": "IMEI válido",
    "invalid": "IMEI inválido",
    "invalidLength": "O IMEI deve ter exatamente 15 dígitos",
    "invalidFormat": "O IMEI deve conter apenas dígitos",
    "invalidChecksum": "Dígito verificador inválido"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "status": "الحالة",
    "reason": "السبب",
    "normalized": "IMEI بعد التنسيق",
    "expectedCheckDigit": "رقم التحقق المتوقع",
    "actualCheckDigit": "رقم التحقق الفعلي",
    "valid": "IMEI صالح",
    "invalid": "IMEI غير صالح",
    "invalidLength": "يجب أن يتكون IMEI من 15 رقمًا بالضبط",
    "invalidFormat": "يجب أن يحتوي IMEI على أرقام فقط",
    "invalidChecksum": "رقم التحقق غير صالح"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "status": "स्थिति",
    "reason": "कारण",
    "normalized": "मानकीकृत IMEI",
    "expectedCheckDigit": "अपेक्षित चेक अंक",
    "actualCheckDigit": "वास्तविक चेक अंक",
    "valid": "मान्य IMEI",
    "invalid": "अमान्य IMEI",
    "invalidLength": "IMEI ठीक 15 अंकों का होना चाहिए",
    "invalidFormat": "IMEI में केवल अंक होने चाहिए",
    "invalidChecksum": "चेक अंक अमान्य है"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "status": "Durum",
    "reason": "Neden",
    "normalized": "Normalize IMEI",
    "expectedCheckDigit": "Beklenen kontrol hanesi",
    "actualCheckDigit": "Gerçek kontrol hanesi",
    "valid": "Geçerli IMEI",
    "invalid": "Geçersiz IMEI",
    "invalidLength": "IMEI tam olarak 15 haneli olmalıdır",
    "invalidFormat": "IMEI yalnızca rakamlardan oluşmalıdır",
    "invalidChecksum": "Geçersiz kontrol hanesi"
  },
  "nl": {
    "result": "Validatieresultaat",
    "status": "Status",
    "reason": "Reden",
    "normalized": "Genormaliseerde IMEI",
    "expectedCheckDigit": "Verwacht controlecijfer",
    "actualCheckDigit": "Werkelijk controlecijfer",
    "valid": "Geldige IMEI",
    "invalid": "Ongeldige IMEI",
    "invalidLength": "IMEI moet exact 15 cijfers bevatten",
    "invalidFormat": "IMEI mag alleen cijfers bevatten",
    "invalidChecksum": "Ongeldig controlecijfer"
  },
  "sv": {
    "result": "Valideringsresultat",
    "status": "Status",
    "reason": "Orsak",
    "normalized": "Normaliserad IMEI",
    "expectedCheckDigit": "Förväntad kontrollsiffra",
    "actualCheckDigit": "Faktisk kontrollsiffra",
    "valid": "Giltig IMEI",
    "invalid": "Ogiltig IMEI",
    "invalidLength": "IMEI måste bestå av exakt 15 siffror",
    "invalidFormat": "IMEI får endast innehålla siffror",
    "invalidChecksum": "Ogiltig kontrollsiffra"
  },
  "pl": {
    "result": "Wynik walidacji",
    "status": "Status",
    "reason": "Powód",
    "normalized": "Znormalizowany IMEI",
    "expectedCheckDigit": "Oczekiwana cyfra kontrolna",
    "actualCheckDigit": "Rzeczywista cyfra kontrolna",
    "valid": "Prawidłowy IMEI",
    "invalid": "Nieprawidłowy IMEI",
    "invalidLength": "IMEI musi mieć dokładnie 15 cyfr",
    "invalidFormat": "IMEI może zawierać tylko cyfry",
    "invalidChecksum": "Nieprawidłowa cyfra kontrolna"
  },
  "vi": {
    "result": "Kết quả xác thực",
    "status": "Trạng thái",
    "reason": "Lý do",
    "normalized": "IMEI đã chuẩn hóa",
    "expectedCheckDigit": "Chữ số kiểm tra kỳ vọng",
    "actualCheckDigit": "Chữ số kiểm tra thực tế",
    "valid": "IMEI hợp lệ",
    "invalid": "IMEI không hợp lệ",
    "invalidLength": "IMEI phải có đúng 15 chữ số",
    "invalidFormat": "IMEI chỉ được chứa chữ số",
    "invalidChecksum": "Chữ số kiểm tra không hợp lệ"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "status": "สถานะ",
    "reason": "สาเหตุ",
    "normalized": "IMEI ที่จัดรูปแบบ",
    "expectedCheckDigit": "เลขตรวจสอบที่คาดหวัง",
    "actualCheckDigit": "เลขตรวจสอบจริง",
    "valid": "IMEI ถูกต้อง",
    "invalid": "IMEI ไม่ถูกต้อง",
    "invalidLength": "IMEI ต้องมี 15 หลักพอดี",
    "invalidFormat": "IMEI ต้องเป็นตัวเลขเท่านั้น",
    "invalidChecksum": "เลขตรวจสอบไม่ถูกต้อง"
  },
  "id": {
    "result": "Hasil Validasi",
    "status": "Status",
    "reason": "Alasan",
    "normalized": "IMEI ternormalisasi",
    "expectedCheckDigit": "Digit pemeriksa yang diharapkan",
    "actualCheckDigit": "Digit pemeriksa aktual",
    "valid": "IMEI valid",
    "invalid": "IMEI tidak valid",
    "invalidLength": "IMEI harus tepat 15 digit",
    "invalidFormat": "IMEI hanya boleh berisi angka",
    "invalidChecksum": "Digit pemeriksa tidak valid"
  },
  "he": {
    "result": "תוצאת אימות",
    "status": "סטטוס",
    "reason": "סיבה",
    "normalized": "IMEI מנורמל",
    "expectedCheckDigit": "ספרת ביקורת צפויה",
    "actualCheckDigit": "ספרת ביקורת בפועל",
    "valid": "IMEI תקין",
    "invalid": "IMEI לא תקין",
    "invalidLength": "IMEI חייב להכיל בדיוק 15 ספרות",
    "invalidFormat": "IMEI חייב להכיל ספרות בלבד",
    "invalidChecksum": "ספרת ביקורת לא תקינה"
  },
  "ms": {
    "result": "Keputusan Pengesahan",
    "status": "Status",
    "reason": "Sebab",
    "normalized": "IMEI dinormalkan",
    "expectedCheckDigit": "Digit semakan jangkaan",
    "actualCheckDigit": "Digit semakan sebenar",
    "valid": "IMEI sah",
    "invalid": "IMEI tidak sah",
    "invalidLength": "IMEI mesti tepat 15 digit",
    "invalidFormat": "IMEI hanya boleh mengandungi digit",
    "invalidChecksum": "Digit semakan tidak sah"
  },
  "no": {
    "result": "Valideringsresultat",
    "status": "Status",
    "reason": "Årsak",
    "normalized": "Normalisert IMEI",
    "expectedCheckDigit": "Forventet kontrollsiffer",
    "actualCheckDigit": "Faktisk kontrollsiffer",
    "valid": "Gyldig IMEI",
    "invalid": "Ugyldig IMEI",
    "invalidLength": "IMEI må være nøyaktig 15 sifre",
    "invalidFormat": "IMEI kan bare inneholde sifre",
    "invalidChecksum": "Ugyldig kontrollsiffer"
  }
}
</i18n>
