<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <NDescriptionsItem :label="t('status')">
        <BICResultStatusTag :is-valid="validationResult.isValid" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('type')">
        <BICResultTypeLabel :type="validationResult.type" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('normalized')">
        <BICResultCopyableValue :value="validationResult.normalized" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('length')">
        <BICResultLengthDisplay :length="validationResult.length" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('bankCode')">
        <BICResultCopyableValue :value="validationResult.bankCode" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('country')">
        <BICResultCountryDisplay :validation-result="validationResult" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('countryStatus')">
        <BICResultCountryStatusTag :is-country-valid="validationResult.isCountryValid" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('locationCode')">
        <BICResultLocationCodeDisplay :location-code="validationResult.locationCode" />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('locationType')">
        <BICResultLocationTypeTag
          :location-code="validationResult.locationCode"
          :is-test-bic="validationResult.isTestBIC"
          :is-passive-participant="validationResult.isPassiveParticipant"
        />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('branchCode')">
        <BICResultBranchCode
          :type="validationResult.type"
          :branch-code="validationResult.branchCode"
        />
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('officeType')">
        <BICResultOfficeTypeTag :is-primary-office="validationResult.isPrimaryOffice" />
      </NDescriptionsItem>
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { BICValidationResult } from '../data/bic'
import BICResultBranchCode from './BICResultBranchCode.vue'
import BICResultCopyableValue from './BICResultCopyableValue.vue'
import BICResultCountryDisplay from './BICResultCountryDisplay.vue'
import BICResultCountryStatusTag from './BICResultCountryStatusTag.vue'
import BICResultLengthDisplay from './BICResultLengthDisplay.vue'
import BICResultLocationCodeDisplay from './BICResultLocationCodeDisplay.vue'
import BICResultLocationTypeTag from './BICResultLocationTypeTag.vue'
import BICResultOfficeTypeTag from './BICResultOfficeTypeTag.vue'
import BICResultStatusTag from './BICResultStatusTag.vue'
import BICResultTypeLabel from './BICResultTypeLabel.vue'

const { t } = useI18n()

defineProps<{
  validationResult: BICValidationResult
}>()
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "status": "Status",
    "type": "BIC Type",
    "normalized": "Normalized BIC",
    "length": "Length",
    "bankCode": "Bank Code",
    "country": "Country",
    "countryStatus": "Country Status",
    "locationCode": "Location Code",
    "locationType": "Location Type",
    "branchCode": "Branch Code",
    "officeType": "Office Type"
  },
  "zh": {
    "result": "验证结果",
    "status": "状态",
    "type": "BIC 类型",
    "normalized": "标准化 BIC",
    "length": "长度",
    "bankCode": "银行代码",
    "country": "国家",
    "countryStatus": "国家状态",
    "locationCode": "地区代码",
    "locationType": "地区类型",
    "branchCode": "分行代码",
    "officeType": "机构类型"
  },
  "zh-CN": {
    "result": "验证结果",
    "status": "状态",
    "type": "BIC 类型",
    "normalized": "标准化 BIC",
    "length": "长度",
    "bankCode": "银行代码",
    "country": "国家",
    "countryStatus": "国家状态",
    "locationCode": "地区代码",
    "locationType": "地区类型",
    "branchCode": "分行代码",
    "officeType": "机构类型"
  },
  "zh-TW": {
    "result": "驗證結果",
    "status": "狀態",
    "type": "BIC 類型",
    "normalized": "標準化 BIC",
    "length": "長度",
    "bankCode": "銀行代碼",
    "country": "國家",
    "countryStatus": "國家狀態",
    "locationCode": "地區代碼",
    "locationType": "地區類型",
    "branchCode": "分行代碼",
    "officeType": "機構類型"
  },
  "zh-HK": {
    "result": "驗證結果",
    "status": "狀態",
    "type": "BIC 類型",
    "normalized": "標準化 BIC",
    "length": "長度",
    "bankCode": "銀行代碼",
    "country": "國家",
    "countryStatus": "國家狀態",
    "locationCode": "地區代碼",
    "locationType": "地區類型",
    "branchCode": "分行代碼",
    "officeType": "機構類型"
  },
  "es": {
    "result": "Resultado de Validación",
    "status": "Estado",
    "type": "Tipo de BIC",
    "normalized": "BIC normalizado",
    "length": "Longitud",
    "bankCode": "Código de banco",
    "country": "País",
    "countryStatus": "Estado del país",
    "locationCode": "Código de ubicación",
    "locationType": "Tipo de ubicación",
    "branchCode": "Código de sucursal",
    "officeType": "Tipo de oficina"
  },
  "fr": {
    "result": "Résultat de Validation",
    "status": "Statut",
    "type": "Type de BIC",
    "normalized": "BIC normalisé",
    "length": "Longueur",
    "bankCode": "Code banque",
    "country": "Pays",
    "countryStatus": "Statut du pays",
    "locationCode": "Code de localisation",
    "locationType": "Type de localisation",
    "branchCode": "Code d'agence",
    "officeType": "Type d'agence"
  },
  "de": {
    "result": "Validierungsergebnis",
    "status": "Status",
    "type": "BIC-Typ",
    "normalized": "Normalisierte BIC",
    "length": "Länge",
    "bankCode": "Bankcode",
    "country": "Land",
    "countryStatus": "Länderstatus",
    "locationCode": "Standortcode",
    "locationType": "Standorttyp",
    "branchCode": "Filialcode",
    "officeType": "Geschäftsstellen-Typ"
  },
  "it": {
    "result": "Risultato di Validazione",
    "status": "Stato",
    "type": "Tipo di BIC",
    "normalized": "BIC normalizzato",
    "length": "Lunghezza",
    "bankCode": "Codice banca",
    "country": "Paese",
    "countryStatus": "Stato del paese",
    "locationCode": "Codice località",
    "locationType": "Tipo di località",
    "branchCode": "Codice filiale",
    "officeType": "Tipo di ufficio"
  },
  "ja": {
    "result": "検証結果",
    "status": "ステータス",
    "type": "BIC 種別",
    "normalized": "正規化 BIC",
    "length": "長さ",
    "bankCode": "銀行コード",
    "country": "国",
    "countryStatus": "国ステータス",
    "locationCode": "ロケーションコード",
    "locationType": "ロケーション種別",
    "branchCode": "支店コード",
    "officeType": "拠点種別"
  },
  "ko": {
    "result": "검증 결과",
    "status": "상태",
    "type": "BIC 유형",
    "normalized": "정규화된 BIC",
    "length": "길이",
    "bankCode": "은행 코드",
    "country": "국가",
    "countryStatus": "국가 상태",
    "locationCode": "위치 코드",
    "locationType": "위치 유형",
    "branchCode": "지점 코드",
    "officeType": "지점 유형"
  },
  "ru": {
    "result": "Результат проверки",
    "status": "Статус",
    "type": "Тип BIC",
    "normalized": "Нормализованный BIC",
    "length": "Длина",
    "bankCode": "Код банка",
    "country": "Страна",
    "countryStatus": "Статус страны",
    "locationCode": "Код местоположения",
    "locationType": "Тип местоположения",
    "branchCode": "Код филиала",
    "officeType": "Тип офиса"
  },
  "pt": {
    "result": "Resultado da Validação",
    "status": "Status",
    "type": "Tipo de BIC",
    "normalized": "BIC normalizado",
    "length": "Comprimento",
    "bankCode": "Código do banco",
    "country": "País",
    "countryStatus": "Status do país",
    "locationCode": "Código de localização",
    "locationType": "Tipo de localização",
    "branchCode": "Código de agência",
    "officeType": "Tipo de agência"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "status": "الحالة",
    "type": "نوع BIC",
    "normalized": "BIC القياسي",
    "length": "الطول",
    "bankCode": "رمز البنك",
    "country": "الدولة",
    "countryStatus": "حالة الدولة",
    "locationCode": "رمز الموقع",
    "locationType": "نوع الموقع",
    "branchCode": "رمز الفرع",
    "officeType": "نوع الفرع"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "status": "स्थिति",
    "type": "BIC प्रकार",
    "normalized": "मानकीकृत BIC",
    "length": "लंबाई",
    "bankCode": "बैंक कोड",
    "country": "देश",
    "countryStatus": "देश स्थिति",
    "locationCode": "लोकेशन कोड",
    "locationType": "लोकेशन प्रकार",
    "branchCode": "शाखा कोड",
    "officeType": "कार्यालय प्रकार"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "status": "Durum",
    "type": "BIC Türü",
    "normalized": "Normalize edilmiş BIC",
    "length": "Uzunluk",
    "bankCode": "Banka kodu",
    "country": "Ülke",
    "countryStatus": "Ülke durumu",
    "locationCode": "Konum kodu",
    "locationType": "Konum türü",
    "branchCode": "Şube kodu",
    "officeType": "Ofis türü"
  },
  "nl": {
    "result": "Validatieresultaat",
    "status": "Status",
    "type": "BIC-type",
    "normalized": "Genormaliseerde BIC",
    "length": "Lengte",
    "bankCode": "Bankcode",
    "country": "Land",
    "countryStatus": "Landstatus",
    "locationCode": "Locatiecode",
    "locationType": "Locatietype",
    "branchCode": "Filiaalcode",
    "officeType": "Kantoortype"
  },
  "sv": {
    "result": "Valideringsresultat",
    "status": "Status",
    "type": "BIC-typ",
    "normalized": "Normaliserad BIC",
    "length": "Längd",
    "bankCode": "Bankkod",
    "country": "Land",
    "countryStatus": "Landsstatus",
    "locationCode": "Platskod",
    "locationType": "Platstyp",
    "branchCode": "Filialkod",
    "officeType": "Kontorstyp"
  },
  "pl": {
    "result": "Wynik walidacji",
    "status": "Status",
    "type": "Typ BIC",
    "normalized": "Znormalizowany BIC",
    "length": "Długość",
    "bankCode": "Kod banku",
    "country": "Kraj",
    "countryStatus": "Status kraju",
    "locationCode": "Kod lokalizacji",
    "locationType": "Typ lokalizacji",
    "branchCode": "Kod oddziału",
    "officeType": "Typ oddziału"
  },
  "vi": {
    "result": "Kết quả kiểm tra",
    "status": "Trạng thái",
    "type": "Loại BIC",
    "normalized": "BIC chuẩn hóa",
    "length": "Độ dài",
    "bankCode": "Mã ngân hàng",
    "country": "Quốc gia",
    "countryStatus": "Trạng thái quốc gia",
    "locationCode": "Mã vị trí",
    "locationType": "Loại vị trí",
    "branchCode": "Mã chi nhánh",
    "officeType": "Loại chi nhánh"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "status": "สถานะ",
    "type": "ประเภท BIC",
    "normalized": "BIC มาตรฐาน",
    "length": "ความยาว",
    "bankCode": "รหัสธนาคาร",
    "country": "ประเทศ",
    "countryStatus": "สถานะประเทศ",
    "locationCode": "รหัสตำแหน่ง",
    "locationType": "ประเภทตำแหน่ง",
    "branchCode": "รหัสสาขา",
    "officeType": "ประเภทสำนักงาน"
  },
  "id": {
    "result": "Hasil Validasi",
    "status": "Status",
    "type": "Tipe BIC",
    "normalized": "BIC ternormalisasi",
    "length": "Panjang",
    "bankCode": "Kode bank",
    "country": "Negara",
    "countryStatus": "Status negara",
    "locationCode": "Kode lokasi",
    "locationType": "Tipe lokasi",
    "branchCode": "Kode cabang",
    "officeType": "Tipe kantor"
  },
  "he": {
    "result": "תוצאת אימות",
    "status": "סטטוס",
    "type": "סוג BIC",
    "normalized": "BIC מנורמל",
    "length": "אורך",
    "bankCode": "קוד בנק",
    "country": "מדינה",
    "countryStatus": "סטטוס מדינה",
    "locationCode": "קוד מיקום",
    "locationType": "סוג מיקום",
    "branchCode": "קוד סניף",
    "officeType": "סוג משרד"
  },
  "ms": {
    "result": "Keputusan Pengesahan",
    "status": "Status",
    "type": "Jenis BIC",
    "normalized": "BIC dinormalkan",
    "length": "Panjang",
    "bankCode": "Kod bank",
    "country": "Negara",
    "countryStatus": "Status negara",
    "locationCode": "Kod lokasi",
    "locationType": "Jenis lokasi",
    "branchCode": "Kod cawangan",
    "officeType": "Jenis pejabat"
  },
  "no": {
    "result": "Valideringsresultat",
    "status": "Status",
    "type": "BIC-type",
    "normalized": "Normalisert BIC",
    "length": "Lengde",
    "bankCode": "Bankkode",
    "country": "Land",
    "countryStatus": "Landstatus",
    "locationCode": "Stedskode",
    "locationType": "Stedstype",
    "branchCode": "Avdelingskode",
    "officeType": "Kontortype"
  }
}
</i18n>
