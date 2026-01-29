<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <NDescriptionsItem :label="t('status')">
        <NTag :type="validationResult.isValid ? 'success' : 'error'" size="small">
          {{ validationResult.isValid ? t('valid') : t('invalid') }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('country')">
        <NText depth="3">{{ countryDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('countryStatus')">
        <NTag :type="countryStatus.type" size="small">
          {{ countryStatus.label }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('format')">
        <NText depth="3">{{ formatDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('formatStatus')">
        <NTag :type="formatStatus.type" size="small">
          {{ formatStatus.label }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('checksum')">
        <NTag :type="checksumStatus.type" size="small">
          {{ checksumStatus.label }}
        </NTag>
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
      <NDescriptionsItem :label="t('number')">
        <NFlex align="center" :size="8">
          <NText code>{{ numberDisplay }}</NText>
          <CopyToClipboardButton
            v-if="validationResult.number"
            :content="validationResult.number"
            size="small"
          />
        </NFlex>
      </NDescriptionsItem>
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
/* eslint-disable max-lines */
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { VATValidationResult } from '../data/vat'

const { t, locale } = useI18n()

type TagType = 'success' | 'error' | 'default' | 'warning' | 'primary' | 'info'

type TagStatus = {
  label: string
  type: TagType
}

const props = defineProps<{
  validationResult: VATValidationResult
}>()

const displayNames = computed(() => {
  if (typeof Intl === 'undefined' || typeof Intl.DisplayNames === 'undefined') return null

  try {
    return new Intl.DisplayNames([locale.value], { type: 'region' })
  } catch {
    return new Intl.DisplayNames(['en'], { type: 'region' })
  }
})

const countryRegionCode = computed(() => {
  const code = props.validationResult.countryCode
  if (!code) return null
  return code === 'EL' ? 'GR' : code
})

const countryName = computed(() => {
  const code = countryRegionCode.value
  if (!code || !props.validationResult.isCountryCodeValid || !displayNames.value) return null
  return displayNames.value.of(code) ?? null
})

const countryDisplay = computed(() => {
  const resolvedName = countryName.value
  const code = props.validationResult.countryCode
  if (!code) return t('notAvailable')
  if (!props.validationResult.isCountryCodeValid) return code
  if (resolvedName) return `${resolvedName} (${code})`
  return code
})

const countryStatus = computed<TagStatus>(() => {
  if (!props.validationResult.countryCode) {
    return { label: t('notAvailable'), type: 'default' }
  }
  if (!props.validationResult.isCountryCodeValid) {
    return { label: t('invalidCode'), type: 'error' }
  }
  if (!props.validationResult.isCountrySupported) {
    return { label: t('unsupported'), type: 'warning' }
  }
  return { label: t('supported'), type: 'success' }
})

const formatDisplay = computed(() => props.validationResult.formatHint ?? t('notAvailable'))

const formatStatus = computed<TagStatus>(() =>
  props.validationResult.isFormatValid
    ? { label: t('pass'), type: 'success' }
    : { label: t('fail'), type: 'error' },
)

const checksumStatus = computed<TagStatus>(() => {
  if (!props.validationResult.isCountrySupported || !props.validationResult.isFormatValid) {
    return { label: t('notAvailable'), type: 'default' }
  }
  if (!props.validationResult.isChecksumSupported) {
    return { label: t('notSupported'), type: 'info' }
  }
  return props.validationResult.isChecksumValid
    ? { label: t('pass'), type: 'success' }
    : { label: t('fail'), type: 'error' }
})

const normalizedDisplay = computed(() => props.validationResult.normalized || t('notAvailable'))

const numberDisplay = computed(() => props.validationResult.number || t('notAvailable'))
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "country": "Country",
    "countryStatus": "Country Status",
    "supported": "Supported",
    "unsupported": "Unsupported",
    "invalidCode": "Invalid code",
    "format": "Format",
    "formatStatus": "Format Check",
    "checksum": "Checksum",
    "normalized": "Normalized VAT",
    "number": "VAT Number",
    "pass": "Pass",
    "fail": "Fail",
    "notSupported": "Not supported",
    "notAvailable": "Not available"
  },
  "zh": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "country": "国家",
    "countryStatus": "国家状态",
    "supported": "已支持",
    "unsupported": "不支持",
    "invalidCode": "代码无效",
    "format": "格式",
    "formatStatus": "格式检查",
    "checksum": "校验和",
    "normalized": "标准化 VAT",
    "number": "VAT 号码",
    "pass": "通过",
    "fail": "失败",
    "notSupported": "不支持",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "country": "国家",
    "countryStatus": "国家状态",
    "supported": "已支持",
    "unsupported": "不支持",
    "invalidCode": "代码无效",
    "format": "格式",
    "formatStatus": "格式检查",
    "checksum": "校验和",
    "normalized": "标准化 VAT",
    "number": "VAT 号码",
    "pass": "通过",
    "fail": "失败",
    "notSupported": "不支持",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "country": "國家",
    "countryStatus": "國家狀態",
    "supported": "已支援",
    "unsupported": "不支援",
    "invalidCode": "代碼無效",
    "format": "格式",
    "formatStatus": "格式檢查",
    "checksum": "校驗和",
    "normalized": "標準化 VAT",
    "number": "VAT 號碼",
    "pass": "通過",
    "fail": "失敗",
    "notSupported": "不支援",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "country": "國家",
    "countryStatus": "國家狀態",
    "supported": "已支援",
    "unsupported": "不支援",
    "invalidCode": "代碼無效",
    "format": "格式",
    "formatStatus": "格式檢查",
    "checksum": "校驗和",
    "normalized": "標準化 VAT",
    "number": "VAT 號碼",
    "pass": "通過",
    "fail": "失敗",
    "notSupported": "不支援",
    "notAvailable": "不可用"
  },
  "es": {
    "result": "Resultado de validación",
    "status": "Estado",
    "valid": "Válido",
    "invalid": "Inválido",
    "country": "País",
    "countryStatus": "Estado del país",
    "supported": "Compatible",
    "unsupported": "No compatible",
    "invalidCode": "Código inválido",
    "format": "Formato",
    "formatStatus": "Comprobación de formato",
    "checksum": "Suma de verificación",
    "normalized": "IVA normalizado",
    "number": "Número de IVA",
    "pass": "Aprobado",
    "fail": "Fallido",
    "notSupported": "No compatible",
    "notAvailable": "No disponible"
  },
  "fr": {
    "result": "Résultat de validation",
    "status": "Statut",
    "valid": "Valide",
    "invalid": "Invalide",
    "country": "Pays",
    "countryStatus": "Statut du pays",
    "supported": "Pris en charge",
    "unsupported": "Non pris en charge",
    "invalidCode": "Code invalide",
    "format": "Format",
    "formatStatus": "Vérification du format",
    "checksum": "Somme de contrôle",
    "normalized": "TVA normalisée",
    "number": "Numéro de TVA",
    "pass": "Réussi",
    "fail": "Échec",
    "notSupported": "Non pris en charge",
    "notAvailable": "Non disponible"
  },
  "de": {
    "result": "Validierungsergebnis",
    "status": "Status",
    "valid": "Gültig",
    "invalid": "Ungültig",
    "country": "Land",
    "countryStatus": "Länderstatus",
    "supported": "Unterstützt",
    "unsupported": "Nicht unterstützt",
    "invalidCode": "Ungültiger Code",
    "format": "Format",
    "formatStatus": "Formatprüfung",
    "checksum": "Prüfsumme",
    "normalized": "Normalisierte USt-IdNr.",
    "number": "USt-IdNr.",
    "pass": "Bestanden",
    "fail": "Fehlgeschlagen",
    "notSupported": "Nicht unterstützt",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "result": "Risultato della validazione",
    "status": "Stato",
    "valid": "Valido",
    "invalid": "Non valido",
    "country": "Paese",
    "countryStatus": "Stato del paese",
    "supported": "Supportato",
    "unsupported": "Non supportato",
    "invalidCode": "Codice non valido",
    "format": "Formato",
    "formatStatus": "Controllo formato",
    "checksum": "Checksum",
    "normalized": "Partita IVA normalizzata",
    "number": "Partita IVA",
    "pass": "Superato",
    "fail": "Fallito",
    "notSupported": "Non supportato",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "result": "検証結果",
    "status": "ステータス",
    "valid": "有効",
    "invalid": "無効",
    "country": "国",
    "countryStatus": "国の状態",
    "supported": "対応",
    "unsupported": "未対応",
    "invalidCode": "無効なコード",
    "format": "形式",
    "formatStatus": "形式チェック",
    "checksum": "チェックサム",
    "normalized": "正規化された VAT",
    "number": "VAT 番号",
    "pass": "合格",
    "fail": "不合格",
    "notSupported": "未対応",
    "notAvailable": "利用不可"
  },
  "ko": {
    "result": "검증 결과",
    "status": "상태",
    "valid": "유효",
    "invalid": "무효",
    "country": "국가",
    "countryStatus": "국가 상태",
    "supported": "지원됨",
    "unsupported": "지원되지 않음",
    "invalidCode": "잘못된 코드",
    "format": "형식",
    "formatStatus": "형식 검사",
    "checksum": "체크섬",
    "normalized": "정규화된 VAT",
    "number": "VAT 번호",
    "pass": "통과",
    "fail": "실패",
    "notSupported": "지원되지 않음",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "result": "Результат проверки",
    "status": "Статус",
    "valid": "Действителен",
    "invalid": "Недействителен",
    "country": "Страна",
    "countryStatus": "Статус страны",
    "supported": "Поддерживается",
    "unsupported": "Не поддерживается",
    "invalidCode": "Неверный код",
    "format": "Формат",
    "formatStatus": "Проверка формата",
    "checksum": "Контрольная сумма",
    "normalized": "Нормализованный НДС",
    "number": "Номер НДС",
    "pass": "Пройдено",
    "fail": "Ошибка",
    "notSupported": "Не поддерживается",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "result": "Resultado da validação",
    "status": "Status",
    "valid": "Válido",
    "invalid": "Inválido",
    "country": "País",
    "countryStatus": "Status do país",
    "supported": "Suportado",
    "unsupported": "Não suportado",
    "invalidCode": "Código inválido",
    "format": "Formato",
    "formatStatus": "Verificação de formato",
    "checksum": "Soma de verificação",
    "normalized": "IVA normalizado",
    "number": "Número de IVA",
    "pass": "Aprovado",
    "fail": "Reprovado",
    "notSupported": "Não suportado",
    "notAvailable": "Não disponível"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "status": "الحالة",
    "valid": "صالح",
    "invalid": "غير صالح",
    "country": "البلد",
    "countryStatus": "حالة البلد",
    "supported": "مدعوم",
    "unsupported": "غير مدعوم",
    "invalidCode": "رمز غير صالح",
    "format": "التنسيق",
    "formatStatus": "فحص التنسيق",
    "checksum": "المجموع الاختباري",
    "normalized": "رقم ضريبة القيمة المضافة المُطبَّع",
    "number": "رقم ضريبة القيمة المضافة",
    "pass": "نجاح",
    "fail": "فشل",
    "notSupported": "غير مدعوم",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "status": "स्थिति",
    "valid": "मान्य",
    "invalid": "अमान्य",
    "country": "देश",
    "countryStatus": "देश की स्थिति",
    "supported": "समर्थित",
    "unsupported": "असमर्थित",
    "invalidCode": "अमान्य कोड",
    "format": "प्रारूप",
    "formatStatus": "प्रारूप जांच",
    "checksum": "चेकसम",
    "normalized": "मानकीकृत VAT",
    "number": "VAT नंबर",
    "pass": "पास",
    "fail": "फेल",
    "notSupported": "समर्थित नहीं",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "status": "Durum",
    "valid": "Geçerli",
    "invalid": "Geçersiz",
    "country": "Ülke",
    "countryStatus": "Ülke durumu",
    "supported": "Destekleniyor",
    "unsupported": "Desteklenmiyor",
    "invalidCode": "Geçersiz kod",
    "format": "Biçim",
    "formatStatus": "Biçim kontrolü",
    "checksum": "Sağlama toplamı",
    "normalized": "Normalleştirilmiş KDV",
    "number": "KDV numarası",
    "pass": "Geçti",
    "fail": "Kaldı",
    "notSupported": "Desteklenmiyor",
    "notAvailable": "Kullanılamıyor"
  },
  "nl": {
    "result": "Validatieresultaat",
    "status": "Status",
    "valid": "Geldig",
    "invalid": "Ongeldig",
    "country": "Land",
    "countryStatus": "Landstatus",
    "supported": "Ondersteund",
    "unsupported": "Niet ondersteund",
    "invalidCode": "Ongeldige code",
    "format": "Formaat",
    "formatStatus": "Formaatcontrole",
    "checksum": "Controlesom",
    "normalized": "Genormaliseerd btw-nummer",
    "number": "Btw-nummer",
    "pass": "Geslaagd",
    "fail": "Mislukt",
    "notSupported": "Niet ondersteund",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "result": "Valideringsresultat",
    "status": "Status",
    "valid": "Giltig",
    "invalid": "Ogiltig",
    "country": "Land",
    "countryStatus": "Landstatus",
    "supported": "Stöds",
    "unsupported": "Stöds inte",
    "invalidCode": "Ogiltig kod",
    "format": "Format",
    "formatStatus": "Formatkontroll",
    "checksum": "Kontrollsumma",
    "normalized": "Normaliserat VAT-nummer",
    "number": "VAT-nummer",
    "pass": "Godkänd",
    "fail": "Underkänd",
    "notSupported": "Stöds inte",
    "notAvailable": "Inte tillgänglig"
  },
  "pl": {
    "result": "Wynik weryfikacji",
    "status": "Status",
    "valid": "Poprawny",
    "invalid": "Niepoprawny",
    "country": "Kraj",
    "countryStatus": "Status kraju",
    "supported": "Obsługiwany",
    "unsupported": "Nieobsługiwany",
    "invalidCode": "Nieprawidłowy kod",
    "format": "Format",
    "formatStatus": "Sprawdzenie formatu",
    "checksum": "Suma kontrolna",
    "normalized": "Znormalizowany VAT",
    "number": "Numer VAT",
    "pass": "Zaliczony",
    "fail": "Nieudany",
    "notSupported": "Nieobsługiwany",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "result": "Kết quả xác thực",
    "status": "Trạng thái",
    "valid": "Hợp lệ",
    "invalid": "Không hợp lệ",
    "country": "Quốc gia",
    "countryStatus": "Trạng thái quốc gia",
    "supported": "Được hỗ trợ",
    "unsupported": "Không được hỗ trợ",
    "invalidCode": "Mã không hợp lệ",
    "format": "Định dạng",
    "formatStatus": "Kiểm tra định dạng",
    "checksum": "Checksum",
    "normalized": "VAT đã chuẩn hóa",
    "number": "Số VAT",
    "pass": "Đạt",
    "fail": "Không đạt",
    "notSupported": "Không được hỗ trợ",
    "notAvailable": "Không có sẵn"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "status": "สถานะ",
    "valid": "ถูกต้อง",
    "invalid": "ไม่ถูกต้อง",
    "country": "ประเทศ",
    "countryStatus": "สถานะประเทศ",
    "supported": "รองรับ",
    "unsupported": "ไม่รองรับ",
    "invalidCode": "รหัสไม่ถูกต้อง",
    "format": "รูปแบบ",
    "formatStatus": "ตรวจสอบรูปแบบ",
    "checksum": "ผลรวมตรวจสอบ",
    "normalized": "VAT ที่ทำให้เป็นมาตรฐาน",
    "number": "หมายเลข VAT",
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน",
    "notSupported": "ไม่รองรับ",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "result": "Hasil validasi",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Tidak valid",
    "country": "Negara",
    "countryStatus": "Status negara",
    "supported": "Didukung",
    "unsupported": "Tidak didukung",
    "invalidCode": "Kode tidak valid",
    "format": "Format",
    "formatStatus": "Pemeriksaan format",
    "checksum": "Checksum",
    "normalized": "VAT ternormalisasi",
    "number": "Nomor VAT",
    "pass": "Lulus",
    "fail": "Gagal",
    "notSupported": "Tidak didukung",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "result": "תוצאת אימות",
    "status": "סטטוס",
    "valid": "תקין",
    "invalid": "לא תקין",
    "country": "מדינה",
    "countryStatus": "סטטוס מדינה",
    "supported": "נתמך",
    "unsupported": "לא נתמך",
    "invalidCode": "קוד לא תקין",
    "format": "פורמט",
    "formatStatus": "בדיקת פורמט",
    "checksum": "סכום ביקורת",
    "normalized": "מספר מע״מ מנורמל",
    "number": "מספר מע״מ",
    "pass": "עבר",
    "fail": "נכשל",
    "notSupported": "לא נתמך",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "result": "Hasil pengesahan",
    "status": "Status",
    "valid": "Sah",
    "invalid": "Tidak sah",
    "country": "Negara",
    "countryStatus": "Status negara",
    "supported": "Disokong",
    "unsupported": "Tidak disokong",
    "invalidCode": "Kod tidak sah",
    "format": "Format",
    "formatStatus": "Semakan format",
    "checksum": "Checksum",
    "normalized": "VAT dinormalkan",
    "number": "Nombor VAT",
    "pass": "Lulus",
    "fail": "Gagal",
    "notSupported": "Tidak disokong",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "result": "Valideringsresultat",
    "status": "Status",
    "valid": "Gyldig",
    "invalid": "Ugyldig",
    "country": "Land",
    "countryStatus": "Landstatus",
    "supported": "Støttet",
    "unsupported": "Ikke støttet",
    "invalidCode": "Ugyldig kode",
    "format": "Format",
    "formatStatus": "Formatkontroll",
    "checksum": "Kontrollsum",
    "normalized": "Normalisert MVA",
    "number": "MVA-nummer",
    "pass": "Bestått",
    "fail": "Ikke bestått",
    "notSupported": "Ikke støttet",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
