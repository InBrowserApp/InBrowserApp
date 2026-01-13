<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <NDescriptionsItem :label="t('status')">
        <NTag :type="validationResult.isValid ? 'success' : 'error'" size="small">
          {{ validationResult.isValid ? t('valid') : t('invalid') }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('type')">
        <NText depth="3">{{ typeLabel }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('normalized')">
        <NFlex align="center" :size="8">
          <NText code>{{ normalizedDisplay }}</NText>
          <CopyToClipboardButton
            v-if="validationResult.normalized"
            :content="validationResult.normalized"
            size="small"
          />
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('length')">
        <NText depth="3">{{ lengthDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('bankCode')">
        <NFlex align="center" :size="8">
          <NText code>{{ bankCodeDisplay }}</NText>
          <CopyToClipboardButton
            v-if="validationResult.bankCode"
            :content="validationResult.bankCode"
            size="small"
          />
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('country')">
        <NText depth="3">{{ countryDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('countryStatus')">
        <NTag :type="validationResult.isCountryValid ? 'success' : 'warning'" size="small">
          {{ validationResult.isCountryValid ? t('supported') : t('unknown') }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('locationCode')">
        <NText code>{{ locationCodeDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('locationType')">
        <NTag :type="locationTypeTag" size="small">{{ locationTypeLabel }}</NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('branchCode')">
        <NFlex align="center" :size="8">
          <NText code>{{ branchCodeDisplay }}</NText>
          <CopyToClipboardButton v-if="branchCopyValue" :content="branchCopyValue" size="small" />
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('officeType')">
        <NTag :type="validationResult.isPrimaryOffice ? 'success' : 'info'" size="small">
          {{ validationResult.isPrimaryOffice ? t('primaryOffice') : t('branchOffice') }}
        </NTag>
      </NDescriptionsItem>
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { BICValidationResult } from '../data/bic'

const { t, locale } = useI18n()

const props = defineProps<{
  validationResult: BICValidationResult
}>()

const displayNames = computed(() => {
  if (typeof Intl === 'undefined' || typeof Intl.DisplayNames === 'undefined') return null

  try {
    return new Intl.DisplayNames([locale.value], { type: 'region' })
  } catch {
    return new Intl.DisplayNames(['en'], { type: 'region' })
  }
})

const countryName = computed(() => {
  const code = props.validationResult.countryCode
  if (!code || !props.validationResult.isCountryValid || !displayNames.value) return null
  return displayNames.value.of(code) ?? null
})

const countryDisplay = computed(() => {
  const code = props.validationResult.countryCode
  if (!code) return t('notAvailable')
  if (!props.validationResult.isCountryValid) return code
  if (countryName.value) return `${countryName.value} (${code})`
  return code
})

const typeLabel = computed(() => {
  if (props.validationResult.type === 'bic-8') return t('bic8')
  if (props.validationResult.type === 'bic-11') return t('bic11')
  return t('unknown')
})

const normalizedDisplay = computed(() => props.validationResult.normalized || t('notAvailable'))

const lengthDisplay = computed(() =>
  props.validationResult.length > 0 ? `${props.validationResult.length}` : t('notAvailable'),
)

const bankCodeDisplay = computed(() => props.validationResult.bankCode || t('notAvailable'))

const locationCodeDisplay = computed(() => props.validationResult.locationCode || t('notAvailable'))

const branchCodeDisplay = computed(() => {
  if (props.validationResult.type === 'bic-8') return 'XXX'
  return props.validationResult.branchCode || t('notAvailable')
})

const branchCopyValue = computed(() => {
  if (props.validationResult.type === 'bic-8') return 'XXX'
  return props.validationResult.branchCode || ''
})

const locationTypeLabel = computed(() => {
  if (!props.validationResult.locationCode) return t('unknown')
  if (props.validationResult.isTestBIC) return t('test')
  if (props.validationResult.isPassiveParticipant) return t('passive')
  return t('standard')
})

const locationTypeTag = computed(() => {
  if (!props.validationResult.locationCode) return 'default'
  if (props.validationResult.isTestBIC) return 'warning'
  if (props.validationResult.isPassiveParticipant) return 'info'
  return 'success'
})
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "type": "BIC Type",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "Normalized BIC",
    "length": "Length",
    "bankCode": "Bank Code",
    "country": "Country",
    "countryStatus": "Country Status",
    "supported": "Supported",
    "locationCode": "Location Code",
    "locationType": "Location Type",
    "branchCode": "Branch Code",
    "officeType": "Office Type",
    "primaryOffice": "Primary Office",
    "branchOffice": "Branch Office",
    "standard": "Standard",
    "test": "Test",
    "passive": "Passive",
    "unknown": "Unknown",
    "notAvailable": "Not available"
  },
  "zh": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "type": "BIC 类型",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "标准化 BIC",
    "length": "长度",
    "bankCode": "银行代码",
    "country": "国家",
    "countryStatus": "国家状态",
    "supported": "已支持",
    "locationCode": "地区代码",
    "locationType": "地区类型",
    "branchCode": "分行代码",
    "officeType": "机构类型",
    "primaryOffice": "主行",
    "branchOffice": "分行",
    "standard": "标准",
    "test": "测试",
    "passive": "被动",
    "unknown": "未知",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "type": "BIC 类型",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "标准化 BIC",
    "length": "长度",
    "bankCode": "银行代码",
    "country": "国家",
    "countryStatus": "国家状态",
    "supported": "已支持",
    "locationCode": "地区代码",
    "locationType": "地区类型",
    "branchCode": "分行代码",
    "officeType": "机构类型",
    "primaryOffice": "主行",
    "branchOffice": "分行",
    "standard": "标准",
    "test": "测试",
    "passive": "被动",
    "unknown": "未知",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "type": "BIC 類型",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "標準化 BIC",
    "length": "長度",
    "bankCode": "銀行代碼",
    "country": "國家",
    "countryStatus": "國家狀態",
    "supported": "已支援",
    "locationCode": "地區代碼",
    "locationType": "地區類型",
    "branchCode": "分行代碼",
    "officeType": "機構類型",
    "primaryOffice": "主行",
    "branchOffice": "分行",
    "standard": "標準",
    "test": "測試",
    "passive": "被動",
    "unknown": "未知",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "type": "BIC 類型",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "標準化 BIC",
    "length": "長度",
    "bankCode": "銀行代碼",
    "country": "國家",
    "countryStatus": "國家狀態",
    "supported": "已支援",
    "locationCode": "地區代碼",
    "locationType": "地區類型",
    "branchCode": "分行代碼",
    "officeType": "機構類型",
    "primaryOffice": "主行",
    "branchOffice": "分行",
    "standard": "標準",
    "test": "測試",
    "passive": "被動",
    "unknown": "未知",
    "notAvailable": "不可用"
  },
  "es": {
    "result": "Resultado de Validación",
    "status": "Estado",
    "valid": "Válido",
    "invalid": "Inválido",
    "type": "Tipo de BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "BIC normalizado",
    "length": "Longitud",
    "bankCode": "Código de banco",
    "country": "País",
    "countryStatus": "Estado del país",
    "supported": "Compatible",
    "locationCode": "Código de ubicación",
    "locationType": "Tipo de ubicación",
    "branchCode": "Código de sucursal",
    "officeType": "Tipo de oficina",
    "primaryOffice": "Oficina principal",
    "branchOffice": "Sucursal",
    "standard": "Estándar",
    "test": "Prueba",
    "passive": "Pasivo",
    "unknown": "Desconocido",
    "notAvailable": "No disponible"
  },
  "fr": {
    "result": "Résultat de Validation",
    "status": "Statut",
    "valid": "Valide",
    "invalid": "Invalide",
    "type": "Type de BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "BIC normalisé",
    "length": "Longueur",
    "bankCode": "Code banque",
    "country": "Pays",
    "countryStatus": "Statut du pays",
    "supported": "Pris en charge",
    "locationCode": "Code de localisation",
    "locationType": "Type de localisation",
    "branchCode": "Code d'agence",
    "officeType": "Type d'agence",
    "primaryOffice": "Siège",
    "branchOffice": "Agence",
    "standard": "Standard",
    "test": "Test",
    "passive": "Passif",
    "unknown": "Inconnu",
    "notAvailable": "Non disponible"
  },
  "de": {
    "result": "Validierungsergebnis",
    "status": "Status",
    "valid": "Gültig",
    "invalid": "Ungültig",
    "type": "BIC-Typ",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "Normalisierte BIC",
    "length": "Länge",
    "bankCode": "Bankcode",
    "country": "Land",
    "countryStatus": "Länderstatus",
    "supported": "Unterstützt",
    "locationCode": "Standortcode",
    "locationType": "Standorttyp",
    "branchCode": "Filialcode",
    "officeType": "Geschäftsstellen-Typ",
    "primaryOffice": "Hauptstelle",
    "branchOffice": "Filiale",
    "standard": "Standard",
    "test": "Test",
    "passive": "Passiv",
    "unknown": "Unbekannt",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "result": "Risultato di Validazione",
    "status": "Stato",
    "valid": "Valido",
    "invalid": "Non valido",
    "type": "Tipo di BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "BIC normalizzato",
    "length": "Lunghezza",
    "bankCode": "Codice banca",
    "country": "Paese",
    "countryStatus": "Stato del paese",
    "supported": "Supportato",
    "locationCode": "Codice località",
    "locationType": "Tipo di località",
    "branchCode": "Codice filiale",
    "officeType": "Tipo di ufficio",
    "primaryOffice": "Sede principale",
    "branchOffice": "Filiale",
    "standard": "Standard",
    "test": "Test",
    "passive": "Passivo",
    "unknown": "Sconosciuto",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "result": "検証結果",
    "status": "ステータス",
    "valid": "有効",
    "invalid": "無効",
    "type": "BIC 種別",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "正規化 BIC",
    "length": "長さ",
    "bankCode": "銀行コード",
    "country": "国",
    "countryStatus": "国ステータス",
    "supported": "サポート済み",
    "locationCode": "ロケーションコード",
    "locationType": "ロケーション種別",
    "branchCode": "支店コード",
    "officeType": "拠点種別",
    "primaryOffice": "本店",
    "branchOffice": "支店",
    "standard": "標準",
    "test": "テスト",
    "passive": "受動",
    "unknown": "不明",
    "notAvailable": "利用不可"
  },
  "ko": {
    "result": "검증 결과",
    "status": "상태",
    "valid": "유효",
    "invalid": "유효하지 않음",
    "type": "BIC 유형",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "정규화된 BIC",
    "length": "길이",
    "bankCode": "은행 코드",
    "country": "국가",
    "countryStatus": "국가 상태",
    "supported": "지원됨",
    "locationCode": "위치 코드",
    "locationType": "위치 유형",
    "branchCode": "지점 코드",
    "officeType": "지점 유형",
    "primaryOffice": "본점",
    "branchOffice": "지점",
    "standard": "표준",
    "test": "테스트",
    "passive": "수동",
    "unknown": "알 수 없음",
    "notAvailable": "사용 불가"
  },
  "ru": {
    "result": "Результат проверки",
    "status": "Статус",
    "valid": "Действителен",
    "invalid": "Недействителен",
    "type": "Тип BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "Нормализованный BIC",
    "length": "Длина",
    "bankCode": "Код банка",
    "country": "Страна",
    "countryStatus": "Статус страны",
    "supported": "Поддерживается",
    "locationCode": "Код местоположения",
    "locationType": "Тип местоположения",
    "branchCode": "Код филиала",
    "officeType": "Тип офиса",
    "primaryOffice": "Головной офис",
    "branchOffice": "Филиал",
    "standard": "Стандарт",
    "test": "Тестовый",
    "passive": "Пассивный",
    "unknown": "Неизвестно",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "result": "Resultado da Validação",
    "status": "Status",
    "valid": "Válido",
    "invalid": "Inválido",
    "type": "Tipo de BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "BIC normalizado",
    "length": "Comprimento",
    "bankCode": "Código do banco",
    "country": "País",
    "countryStatus": "Status do país",
    "supported": "Compatível",
    "locationCode": "Código de localização",
    "locationType": "Tipo de localização",
    "branchCode": "Código de agência",
    "officeType": "Tipo de agência",
    "primaryOffice": "Agência principal",
    "branchOffice": "Agência",
    "standard": "Padrão",
    "test": "Teste",
    "passive": "Passivo",
    "unknown": "Desconhecido",
    "notAvailable": "Não disponível"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "status": "الحالة",
    "valid": "صالح",
    "invalid": "غير صالح",
    "type": "نوع BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "BIC القياسي",
    "length": "الطول",
    "bankCode": "رمز البنك",
    "country": "الدولة",
    "countryStatus": "حالة الدولة",
    "supported": "مدعوم",
    "locationCode": "رمز الموقع",
    "locationType": "نوع الموقع",
    "branchCode": "رمز الفرع",
    "officeType": "نوع الفرع",
    "primaryOffice": "الفرع الرئيسي",
    "branchOffice": "فرع",
    "standard": "قياسي",
    "test": "اختبار",
    "passive": "سلبي",
    "unknown": "غير معروف",
    "notAvailable": "غير متوفر"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "status": "स्थिति",
    "valid": "मान्य",
    "invalid": "अमान्य",
    "type": "BIC प्रकार",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "मानकीकृत BIC",
    "length": "लंबाई",
    "bankCode": "बैंक कोड",
    "country": "देश",
    "countryStatus": "देश स्थिति",
    "supported": "समर्थित",
    "locationCode": "लोकेशन कोड",
    "locationType": "लोकेशन प्रकार",
    "branchCode": "शाखा कोड",
    "officeType": "कार्यालय प्रकार",
    "primaryOffice": "मुख्य कार्यालय",
    "branchOffice": "शाखा कार्यालय",
    "standard": "मानक",
    "test": "परीक्षण",
    "passive": "निष्क्रिय",
    "unknown": "अज्ञात",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "status": "Durum",
    "valid": "Geçerli",
    "invalid": "Geçersiz",
    "type": "BIC Türü",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "Normalize edilmiş BIC",
    "length": "Uzunluk",
    "bankCode": "Banka kodu",
    "country": "Ülke",
    "countryStatus": "Ülke durumu",
    "supported": "Destekleniyor",
    "locationCode": "Konum kodu",
    "locationType": "Konum türü",
    "branchCode": "Şube kodu",
    "officeType": "Ofis türü",
    "primaryOffice": "Merkez şube",
    "branchOffice": "Şube",
    "standard": "Standart",
    "test": "Test",
    "passive": "Pasif",
    "unknown": "Bilinmeyen",
    "notAvailable": "Kullanılamaz"
  },
  "nl": {
    "result": "Validatieresultaat",
    "status": "Status",
    "valid": "Geldig",
    "invalid": "Ongeldig",
    "type": "BIC-type",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "Genormaliseerde BIC",
    "length": "Lengte",
    "bankCode": "Bankcode",
    "country": "Land",
    "countryStatus": "Landstatus",
    "supported": "Ondersteund",
    "locationCode": "Locatiecode",
    "locationType": "Locatietype",
    "branchCode": "Filiaalcode",
    "officeType": "Kantoortype",
    "primaryOffice": "Hoofdkantoor",
    "branchOffice": "Filiaal",
    "standard": "Standaard",
    "test": "Test",
    "passive": "Passief",
    "unknown": "Onbekend",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "result": "Valideringsresultat",
    "status": "Status",
    "valid": "Giltig",
    "invalid": "Ogiltig",
    "type": "BIC-typ",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "Normaliserad BIC",
    "length": "Längd",
    "bankCode": "Bankkod",
    "country": "Land",
    "countryStatus": "Landsstatus",
    "supported": "Stöds",
    "locationCode": "Platskod",
    "locationType": "Platstyp",
    "branchCode": "Filialkod",
    "officeType": "Kontorstyp",
    "primaryOffice": "Huvudkontor",
    "branchOffice": "Filial",
    "standard": "Standard",
    "test": "Test",
    "passive": "Passiv",
    "unknown": "Okänd",
    "notAvailable": "Inte tillgänglig"
  },
  "pl": {
    "result": "Wynik walidacji",
    "status": "Status",
    "valid": "Poprawny",
    "invalid": "Niepoprawny",
    "type": "Typ BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "Znormalizowany BIC",
    "length": "Długość",
    "bankCode": "Kod banku",
    "country": "Kraj",
    "countryStatus": "Status kraju",
    "supported": "Obsługiwany",
    "locationCode": "Kod lokalizacji",
    "locationType": "Typ lokalizacji",
    "branchCode": "Kod oddziału",
    "officeType": "Typ oddziału",
    "primaryOffice": "Siedziba główna",
    "branchOffice": "Oddział",
    "standard": "Standard",
    "test": "Test",
    "passive": "Pasywny",
    "unknown": "Nieznany",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "result": "Kết quả kiểm tra",
    "status": "Trạng thái",
    "valid": "Hợp lệ",
    "invalid": "Không hợp lệ",
    "type": "Loại BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "BIC chuẩn hóa",
    "length": "Độ dài",
    "bankCode": "Mã ngân hàng",
    "country": "Quốc gia",
    "countryStatus": "Trạng thái quốc gia",
    "supported": "Được hỗ trợ",
    "locationCode": "Mã vị trí",
    "locationType": "Loại vị trí",
    "branchCode": "Mã chi nhánh",
    "officeType": "Loại chi nhánh",
    "primaryOffice": "Trụ sở chính",
    "branchOffice": "Chi nhánh",
    "standard": "Tiêu chuẩn",
    "test": "Kiểm tra",
    "passive": "Thụ động",
    "unknown": "Không rõ",
    "notAvailable": "Không có"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "status": "สถานะ",
    "valid": "ถูกต้อง",
    "invalid": "ไม่ถูกต้อง",
    "type": "ประเภท BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "BIC มาตรฐาน",
    "length": "ความยาว",
    "bankCode": "รหัสธนาคาร",
    "country": "ประเทศ",
    "countryStatus": "สถานะประเทศ",
    "supported": "รองรับ",
    "locationCode": "รหัสตำแหน่ง",
    "locationType": "ประเภทตำแหน่ง",
    "branchCode": "รหัสสาขา",
    "officeType": "ประเภทสำนักงาน",
    "primaryOffice": "สำนักงานใหญ่",
    "branchOffice": "สาขา",
    "standard": "มาตรฐาน",
    "test": "ทดสอบ",
    "passive": "พาสซีฟ",
    "unknown": "ไม่ทราบ",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "result": "Hasil Validasi",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Tidak valid",
    "type": "Tipe BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "BIC ternormalisasi",
    "length": "Panjang",
    "bankCode": "Kode bank",
    "country": "Negara",
    "countryStatus": "Status negara",
    "supported": "Didukung",
    "locationCode": "Kode lokasi",
    "locationType": "Tipe lokasi",
    "branchCode": "Kode cabang",
    "officeType": "Tipe kantor",
    "primaryOffice": "Kantor utama",
    "branchOffice": "Cabang",
    "standard": "Standar",
    "test": "Uji",
    "passive": "Pasif",
    "unknown": "Tidak diketahui",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "result": "תוצאת אימות",
    "status": "סטטוס",
    "valid": "תקין",
    "invalid": "לא תקין",
    "type": "סוג BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "BIC מנורמל",
    "length": "אורך",
    "bankCode": "קוד בנק",
    "country": "מדינה",
    "countryStatus": "סטטוס מדינה",
    "supported": "נתמך",
    "locationCode": "קוד מיקום",
    "locationType": "סוג מיקום",
    "branchCode": "קוד סניף",
    "officeType": "סוג משרד",
    "primaryOffice": "משרד ראשי",
    "branchOffice": "סניף",
    "standard": "סטנדרטי",
    "test": "בדיקה",
    "passive": "פסיבי",
    "unknown": "לא ידוע",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "result": "Keputusan Pengesahan",
    "status": "Status",
    "valid": "Sah",
    "invalid": "Tidak sah",
    "type": "Jenis BIC",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "BIC dinormalkan",
    "length": "Panjang",
    "bankCode": "Kod bank",
    "country": "Negara",
    "countryStatus": "Status negara",
    "supported": "Disokong",
    "locationCode": "Kod lokasi",
    "locationType": "Jenis lokasi",
    "branchCode": "Kod cawangan",
    "officeType": "Jenis pejabat",
    "primaryOffice": "Pejabat utama",
    "branchOffice": "Cawangan",
    "standard": "Standard",
    "test": "Ujian",
    "passive": "Pasif",
    "unknown": "Tidak diketahui",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "result": "Valideringsresultat",
    "status": "Status",
    "valid": "Gyldig",
    "invalid": "Ugyldig",
    "type": "BIC-type",
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "normalized": "Normalisert BIC",
    "length": "Lengde",
    "bankCode": "Bankkode",
    "country": "Land",
    "countryStatus": "Landstatus",
    "supported": "Støttet",
    "locationCode": "Stedskode",
    "locationType": "Stedstype",
    "branchCode": "Avdelingskode",
    "officeType": "Kontortype",
    "primaryOffice": "Hovedkontor",
    "branchOffice": "Avdeling",
    "standard": "Standard",
    "test": "Test",
    "passive": "Passiv",
    "unknown": "Ukjent",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
