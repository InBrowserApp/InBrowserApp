<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <NDescriptionsItem :label="t('status')">
        <VATResultStatusTag :is-valid="validationResult.isValid" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('country')">
        <VATResultCountryDisplay :validation-result="validationResult" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('countryStatus')">
        <VATResultCountryStatusTag :validation-result="validationResult" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('format')">
        <VATResultFormatDisplay :format-hint="validationResult.formatHint" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('formatStatus')">
        <VATResultFormatStatusTag :is-format-valid="validationResult.isFormatValid" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('checksum')">
        <VATResultChecksumStatusTag
          :is-country-supported="validationResult.isCountrySupported"
          :is-format-valid="validationResult.isFormatValid"
          :is-checksum-supported="validationResult.isChecksumSupported"
          :is-checksum-valid="validationResult.isChecksumValid"
        />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('normalized')">
        <VATResultCopyableValue :value="validationResult.normalized" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('number')">
        <VATResultCopyableValue :value="validationResult.number" />
      </NDescriptionsItem>
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { VATValidationResult } from '../data/vat'
import VATResultChecksumStatusTag from './VATResultChecksumStatusTag.vue'
import VATResultCopyableValue from './VATResultCopyableValue.vue'
import VATResultCountryDisplay from './VATResultCountryDisplay.vue'
import VATResultCountryStatusTag from './VATResultCountryStatusTag.vue'
import VATResultFormatDisplay from './VATResultFormatDisplay.vue'
import VATResultFormatStatusTag from './VATResultFormatStatusTag.vue'
import VATResultStatusTag from './VATResultStatusTag.vue'

defineProps<{
  validationResult: VATValidationResult
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "status": "Status",
    "country": "Country",
    "countryStatus": "Country Status",
    "format": "Format",
    "formatStatus": "Format Check",
    "checksum": "Checksum",
    "normalized": "Normalized VAT",
    "number": "VAT Number"
  },
  "zh": {
    "result": "验证结果",
    "status": "状态",
    "country": "国家",
    "countryStatus": "国家状态",
    "format": "格式",
    "formatStatus": "格式检查",
    "checksum": "校验和",
    "normalized": "标准化 VAT",
    "number": "VAT 号码"
  },
  "zh-CN": {
    "result": "验证结果",
    "status": "状态",
    "country": "国家",
    "countryStatus": "国家状态",
    "format": "格式",
    "formatStatus": "格式检查",
    "checksum": "校验和",
    "normalized": "标准化 VAT",
    "number": "VAT 号码"
  },
  "zh-TW": {
    "result": "驗證結果",
    "status": "狀態",
    "country": "國家",
    "countryStatus": "國家狀態",
    "format": "格式",
    "formatStatus": "格式檢查",
    "checksum": "校驗和",
    "normalized": "標準化 VAT",
    "number": "VAT 號碼"
  },
  "zh-HK": {
    "result": "驗證結果",
    "status": "狀態",
    "country": "國家",
    "countryStatus": "國家狀態",
    "format": "格式",
    "formatStatus": "格式檢查",
    "checksum": "校驗和",
    "normalized": "標準化 VAT",
    "number": "VAT 號碼"
  },
  "es": {
    "result": "Resultado de validación",
    "status": "Estado",
    "country": "País",
    "countryStatus": "Estado del país",
    "format": "Formato",
    "formatStatus": "Comprobación de formato",
    "checksum": "Suma de verificación",
    "normalized": "IVA normalizado",
    "number": "Número de IVA"
  },
  "fr": {
    "result": "Résultat de validation",
    "status": "Statut",
    "country": "Pays",
    "countryStatus": "Statut du pays",
    "format": "Format",
    "formatStatus": "Vérification du format",
    "checksum": "Somme de contrôle",
    "normalized": "TVA normalisée",
    "number": "Numéro de TVA"
  },
  "de": {
    "result": "Validierungsergebnis",
    "status": "Status",
    "country": "Land",
    "countryStatus": "Länderstatus",
    "format": "Format",
    "formatStatus": "Formatprüfung",
    "checksum": "Prüfsumme",
    "normalized": "Normalisierte USt-IdNr.",
    "number": "USt-IdNr."
  },
  "it": {
    "result": "Risultato della validazione",
    "status": "Stato",
    "country": "Paese",
    "countryStatus": "Stato del paese",
    "format": "Formato",
    "formatStatus": "Controllo formato",
    "checksum": "Checksum",
    "normalized": "Partita IVA normalizzata",
    "number": "Partita IVA"
  },
  "ja": {
    "result": "検証結果",
    "status": "ステータス",
    "country": "国",
    "countryStatus": "国の状態",
    "format": "形式",
    "formatStatus": "形式チェック",
    "checksum": "チェックサム",
    "normalized": "正規化された VAT",
    "number": "VAT 番号"
  },
  "ko": {
    "result": "검증 결과",
    "status": "상태",
    "country": "국가",
    "countryStatus": "국가 상태",
    "format": "형식",
    "formatStatus": "형식 검사",
    "checksum": "체크섬",
    "normalized": "정규화된 VAT",
    "number": "VAT 번호"
  },
  "ru": {
    "result": "Результат проверки",
    "status": "Статус",
    "country": "Страна",
    "countryStatus": "Статус страны",
    "format": "Формат",
    "formatStatus": "Проверка формата",
    "checksum": "Контрольная сумма",
    "normalized": "Нормализованный НДС",
    "number": "Номер НДС"
  },
  "pt": {
    "result": "Resultado da validação",
    "status": "Status",
    "country": "País",
    "countryStatus": "Status do país",
    "format": "Formato",
    "formatStatus": "Verificação de formato",
    "checksum": "Soma de verificação",
    "normalized": "IVA normalizado",
    "number": "Número de IVA"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "status": "الحالة",
    "country": "البلد",
    "countryStatus": "حالة البلد",
    "format": "التنسيق",
    "formatStatus": "فحص التنسيق",
    "checksum": "المجموع الاختباري",
    "normalized": "رقم ضريبة القيمة المضافة المُطبَّع",
    "number": "رقم ضريبة القيمة المضافة"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "status": "स्थिति",
    "country": "देश",
    "countryStatus": "देश की स्थिति",
    "format": "प्रारूप",
    "formatStatus": "प्रारूप जांच",
    "checksum": "चेकसम",
    "normalized": "मानकीकृत VAT",
    "number": "VAT नंबर"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "status": "Durum",
    "country": "Ülke",
    "countryStatus": "Ülke durumu",
    "format": "Biçim",
    "formatStatus": "Biçim kontrolü",
    "checksum": "Sağlama toplamı",
    "normalized": "Normalleştirilmiş KDV",
    "number": "KDV numarası"
  },
  "nl": {
    "result": "Validatieresultaat",
    "status": "Status",
    "country": "Land",
    "countryStatus": "Landstatus",
    "format": "Formaat",
    "formatStatus": "Formaatcontrole",
    "checksum": "Controlesom",
    "normalized": "Genormaliseerd btw-nummer",
    "number": "Btw-nummer"
  },
  "sv": {
    "result": "Valideringsresultat",
    "status": "Status",
    "country": "Land",
    "countryStatus": "Landstatus",
    "format": "Format",
    "formatStatus": "Formatkontroll",
    "checksum": "Kontrollsumma",
    "normalized": "Normaliserat VAT-nummer",
    "number": "VAT-nummer"
  },
  "pl": {
    "result": "Wynik weryfikacji",
    "status": "Status",
    "country": "Kraj",
    "countryStatus": "Status kraju",
    "format": "Format",
    "formatStatus": "Sprawdzenie formatu",
    "checksum": "Suma kontrolna",
    "normalized": "Znormalizowany VAT",
    "number": "Numer VAT"
  },
  "vi": {
    "result": "Kết quả xác thực",
    "status": "Trạng thái",
    "country": "Quốc gia",
    "countryStatus": "Trạng thái quốc gia",
    "format": "Định dạng",
    "formatStatus": "Kiểm tra định dạng",
    "checksum": "Checksum",
    "normalized": "VAT đã chuẩn hóa",
    "number": "Số VAT"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "status": "สถานะ",
    "country": "ประเทศ",
    "countryStatus": "สถานะประเทศ",
    "format": "รูปแบบ",
    "formatStatus": "ตรวจสอบรูปแบบ",
    "checksum": "ผลรวมตรวจสอบ",
    "normalized": "VAT ที่ทำให้เป็นมาตรฐาน",
    "number": "หมายเลข VAT"
  },
  "id": {
    "result": "Hasil validasi",
    "status": "Status",
    "country": "Negara",
    "countryStatus": "Status negara",
    "format": "Format",
    "formatStatus": "Pemeriksaan format",
    "checksum": "Checksum",
    "normalized": "VAT ternormalisasi",
    "number": "Nomor VAT"
  },
  "he": {
    "result": "תוצאת אימות",
    "status": "סטטוס",
    "country": "מדינה",
    "countryStatus": "סטטוס מדינה",
    "format": "פורמט",
    "formatStatus": "בדיקת פורמט",
    "checksum": "סכום ביקורת",
    "normalized": "מספר מע״מ מנורמל",
    "number": "מספר מע״מ"
  },
  "ms": {
    "result": "Hasil pengesahan",
    "status": "Status",
    "country": "Negara",
    "countryStatus": "Status negara",
    "format": "Format",
    "formatStatus": "Semakan format",
    "checksum": "Checksum",
    "normalized": "VAT dinormalkan",
    "number": "Nombor VAT"
  },
  "no": {
    "result": "Valideringsresultat",
    "status": "Status",
    "country": "Land",
    "countryStatus": "Landstatus",
    "format": "Format",
    "formatStatus": "Formatkontroll",
    "checksum": "Kontrollsum",
    "normalized": "Normalisert MVA",
    "number": "MVA-nummer"
  }
}
</i18n>
