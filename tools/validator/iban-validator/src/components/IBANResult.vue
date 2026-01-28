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
      <NDescriptionsItem :label="t('registry')">
        <NTag :type="validationResult.isCountryValid ? 'success' : 'warning'" size="small">
          {{ validationResult.isCountryValid ? t('supported') : t('unknown') }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('length')">
        <NFlex align="center" :size="8">
          <NText depth="3">{{ t('expected') }}: {{ expectedLength }}</NText>
          <NText depth="3">{{ t('actual') }}: {{ validationResult.length }}</NText>
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('checksum')">
        <NTag :type="validationResult.isChecksumValid ? 'success' : 'error'" size="small">
          {{ validationResult.isChecksumValid ? t('pass') : t('fail') }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('checkDigits')">
        <NFlex align="center" :size="8">
          <NText depth="3">{{ t('expected') }}: {{ expectedCheckDigits }}</NText>
          <NText depth="3">{{ t('actual') }}: {{ actualCheckDigits }}</NText>
        </NFlex>
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
      <NDescriptionsItem :label="t('formatted')">
        <NFlex align="center" :size="8">
          <NText code>{{ formattedDisplay }}</NText>
          <CopyToClipboardButton
            v-if="validationResult.formatted"
            :content="validationResult.formatted"
            size="small"
          />
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('bban')">
        <NFlex align="center" :size="8">
          <NText code>{{ bbanDisplay }}</NText>
          <CopyToClipboardButton
            v-if="validationResult.bban"
            :content="validationResult.bban"
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
import type { IBANValidationResult } from '../data/iban'

const { t, locale } = useI18n()

const props = defineProps<{
  validationResult: IBANValidationResult
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

const expectedLength = computed(() =>
  props.validationResult.expectedLength ? `${props.validationResult.expectedLength}` : t('unknown'),
)

const expectedCheckDigits = computed(
  () => props.validationResult.expectedCheckDigits ?? t('notAvailable'),
)

const actualCheckDigits = computed(() => props.validationResult.checkDigits ?? t('notAvailable'))

const normalizedDisplay = computed(() => props.validationResult.normalized || t('notAvailable'))

const formattedDisplay = computed(() => props.validationResult.formatted || t('notAvailable'))

const bbanDisplay = computed(() => props.validationResult.bban || t('notAvailable'))
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "country": "Country",
    "registry": "Registry",
    "supported": "Supported",
    "length": "Length",
    "expected": "Expected",
    "actual": "Actual",
    "checksum": "Checksum",
    "checkDigits": "Check Digits",
    "normalized": "Normalized IBAN",
    "formatted": "Formatted IBAN",
    "bban": "BBAN",
    "pass": "Pass",
    "fail": "Fail",
    "unknown": "Unknown",
    "notAvailable": "Not available"
  },
  "zh": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "country": "国家",
    "registry": "注册表",
    "supported": "已支持",
    "length": "长度",
    "expected": "期望",
    "actual": "实际",
    "checksum": "校验和",
    "checkDigits": "校验位",
    "normalized": "标准化 IBAN",
    "formatted": "格式化 IBAN",
    "bban": "BBAN",
    "pass": "通过",
    "fail": "失败",
    "unknown": "未知",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "country": "国家",
    "registry": "注册表",
    "supported": "已支持",
    "length": "长度",
    "expected": "期望",
    "actual": "实际",
    "checksum": "校验和",
    "checkDigits": "校验位",
    "normalized": "标准化 IBAN",
    "formatted": "格式化 IBAN",
    "bban": "BBAN",
    "pass": "通过",
    "fail": "失败",
    "unknown": "未知",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "country": "國家",
    "registry": "登錄表",
    "supported": "已支援",
    "length": "長度",
    "expected": "期望",
    "actual": "實際",
    "checksum": "校驗和",
    "checkDigits": "校驗位",
    "normalized": "標準化 IBAN",
    "formatted": "格式化 IBAN",
    "bban": "BBAN",
    "pass": "通過",
    "fail": "失敗",
    "unknown": "未知",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "country": "國家",
    "registry": "登錄表",
    "supported": "已支援",
    "length": "長度",
    "expected": "期望",
    "actual": "實際",
    "checksum": "校驗和",
    "checkDigits": "校驗位",
    "normalized": "標準化 IBAN",
    "formatted": "格式化 IBAN",
    "bban": "BBAN",
    "pass": "通過",
    "fail": "失敗",
    "unknown": "未知",
    "notAvailable": "不可用"
  },
  "es": {
    "result": "Resultado de Validación",
    "status": "Estado",
    "valid": "Válido",
    "invalid": "Inválido",
    "country": "País",
    "registry": "Registro",
    "supported": "Compatible",
    "length": "Longitud",
    "expected": "Esperado",
    "actual": "Actual",
    "checksum": "Suma de verificación",
    "checkDigits": "Dígitos de control",
    "normalized": "IBAN normalizado",
    "formatted": "IBAN formateado",
    "bban": "BBAN",
    "pass": "Aprobado",
    "fail": "Fallido",
    "unknown": "Desconocido",
    "notAvailable": "No disponible"
  },
  "fr": {
    "result": "Résultat de Validation",
    "status": "Statut",
    "valid": "Valide",
    "invalid": "Invalide",
    "country": "Pays",
    "registry": "Registre",
    "supported": "Pris en charge",
    "length": "Longueur",
    "expected": "Attendu",
    "actual": "Actuel",
    "checksum": "Somme de contrôle",
    "checkDigits": "Chiffres de contrôle",
    "normalized": "IBAN normalisé",
    "formatted": "IBAN formaté",
    "bban": "BBAN",
    "pass": "Réussi",
    "fail": "Échoué",
    "unknown": "Inconnu",
    "notAvailable": "Non disponible"
  },
  "de": {
    "result": "Validierungsergebnis",
    "status": "Status",
    "valid": "Gültig",
    "invalid": "Ungültig",
    "country": "Land",
    "registry": "Register",
    "supported": "Unterstützt",
    "length": "Länge",
    "expected": "Erwartet",
    "actual": "Tatsächlich",
    "checksum": "Prüfsumme",
    "checkDigits": "Prüfziffern",
    "normalized": "Normalisierte IBAN",
    "formatted": "Formatierte IBAN",
    "bban": "BBAN",
    "pass": "Bestanden",
    "fail": "Fehlgeschlagen",
    "unknown": "Unbekannt",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "result": "Risultato di Validazione",
    "status": "Stato",
    "valid": "Valido",
    "invalid": "Non valido",
    "country": "Paese",
    "registry": "Registro",
    "supported": "Supportato",
    "length": "Lunghezza",
    "expected": "Atteso",
    "actual": "Attuale",
    "checksum": "Checksum",
    "checkDigits": "Cifre di controllo",
    "normalized": "IBAN normalizzato",
    "formatted": "IBAN formattato",
    "bban": "BBAN",
    "pass": "Superato",
    "fail": "Fallito",
    "unknown": "Sconosciuto",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "result": "検証結果",
    "status": "ステータス",
    "valid": "有効",
    "invalid": "無効",
    "country": "国",
    "registry": "レジストリ",
    "supported": "サポート済み",
    "length": "長さ",
    "expected": "期待値",
    "actual": "実際",
    "checksum": "チェックサム",
    "checkDigits": "チェックディジット",
    "normalized": "正規化 IBAN",
    "formatted": "整形 IBAN",
    "bban": "BBAN",
    "pass": "合格",
    "fail": "失敗",
    "unknown": "不明",
    "notAvailable": "利用不可"
  },
  "ko": {
    "result": "검증 결과",
    "status": "상태",
    "valid": "유효",
    "invalid": "유효하지 않음",
    "country": "국가",
    "registry": "등록부",
    "supported": "지원됨",
    "length": "길이",
    "expected": "예상",
    "actual": "실제",
    "checksum": "체크섬",
    "checkDigits": "체크 디지트",
    "normalized": "정규화된 IBAN",
    "formatted": "서식화된 IBAN",
    "bban": "BBAN",
    "pass": "통과",
    "fail": "실패",
    "unknown": "알 수 없음",
    "notAvailable": "사용 불가"
  },
  "ru": {
    "result": "Результат проверки",
    "status": "Статус",
    "valid": "Действителен",
    "invalid": "Недействителен",
    "country": "Страна",
    "registry": "Реестр",
    "supported": "Поддерживается",
    "length": "Длина",
    "expected": "Ожидаемая",
    "actual": "Фактическая",
    "checksum": "Контрольная сумма",
    "checkDigits": "Контрольные цифры",
    "normalized": "Нормализованный IBAN",
    "formatted": "Отформатированный IBAN",
    "bban": "BBAN",
    "pass": "Пройдено",
    "fail": "Не пройдено",
    "unknown": "Неизвестно",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "result": "Resultado da Validação",
    "status": "Status",
    "valid": "Válido",
    "invalid": "Inválido",
    "country": "País",
    "registry": "Registro",
    "supported": "Compatível",
    "length": "Comprimento",
    "expected": "Esperado",
    "actual": "Atual",
    "checksum": "Checksum",
    "checkDigits": "Dígitos de verificação",
    "normalized": "IBAN normalizado",
    "formatted": "IBAN formatado",
    "bban": "BBAN",
    "pass": "Aprovado",
    "fail": "Reprovado",
    "unknown": "Desconhecido",
    "notAvailable": "Não disponível"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "status": "الحالة",
    "valid": "صالح",
    "invalid": "غير صالح",
    "country": "الدولة",
    "registry": "السجل",
    "supported": "مدعوم",
    "length": "الطول",
    "expected": "متوقع",
    "actual": "فعلي",
    "checksum": "المجموع الاختباري",
    "checkDigits": "أرقام التحقق",
    "normalized": "IBAN القياسي",
    "formatted": "IBAN المنسق",
    "bban": "BBAN",
    "pass": "ناجح",
    "fail": "فشل",
    "unknown": "غير معروف",
    "notAvailable": "غير متوفر"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "status": "स्थिति",
    "valid": "मान्य",
    "invalid": "अमान्य",
    "country": "देश",
    "registry": "रजिस्ट्री",
    "supported": "समर्थित",
    "length": "लंबाई",
    "expected": "अपेक्षित",
    "actual": "वास्तविक",
    "checksum": "चेकसम",
    "checkDigits": "चेक अंकों",
    "normalized": "मानकीकृत IBAN",
    "formatted": "स्वरूपित IBAN",
    "bban": "BBAN",
    "pass": "उत्तीर्ण",
    "fail": "विफल",
    "unknown": "अज्ञात",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "status": "Durum",
    "valid": "Geçerli",
    "invalid": "Geçersiz",
    "country": "Ülke",
    "registry": "Kayıt",
    "supported": "Destekleniyor",
    "length": "Uzunluk",
    "expected": "Beklenen",
    "actual": "Gerçek",
    "checksum": "Sağlama toplamı",
    "checkDigits": "Kontrol haneleri",
    "normalized": "Normalize edilmiş IBAN",
    "formatted": "Biçimlendirilmiş IBAN",
    "bban": "BBAN",
    "pass": "Geçti",
    "fail": "Başarısız",
    "unknown": "Bilinmeyen",
    "notAvailable": "Kullanılamaz"
  },
  "nl": {
    "result": "Validatieresultaat",
    "status": "Status",
    "valid": "Geldig",
    "invalid": "Ongeldig",
    "country": "Land",
    "registry": "Register",
    "supported": "Ondersteund",
    "length": "Lengte",
    "expected": "Verwacht",
    "actual": "Werkelijk",
    "checksum": "Controlesom",
    "checkDigits": "Controlecijfers",
    "normalized": "Genormaliseerde IBAN",
    "formatted": "Geformatteerde IBAN",
    "bban": "BBAN",
    "pass": "Geslaagd",
    "fail": "Mislukt",
    "unknown": "Onbekend",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "result": "Valideringsresultat",
    "status": "Status",
    "valid": "Giltig",
    "invalid": "Ogiltig",
    "country": "Land",
    "registry": "Register",
    "supported": "Stöds",
    "length": "Längd",
    "expected": "Förväntad",
    "actual": "Faktisk",
    "checksum": "Kontrollsumma",
    "checkDigits": "Kontrollsiffror",
    "normalized": "Normaliserad IBAN",
    "formatted": "Formaterad IBAN",
    "bban": "BBAN",
    "pass": "Godkänd",
    "fail": "Underkänd",
    "unknown": "Okänd",
    "notAvailable": "Inte tillgänglig"
  },
  "pl": {
    "result": "Wynik walidacji",
    "status": "Status",
    "valid": "Poprawny",
    "invalid": "Niepoprawny",
    "country": "Kraj",
    "registry": "Rejestr",
    "supported": "Obsługiwany",
    "length": "Długość",
    "expected": "Oczekiwane",
    "actual": "Rzeczywiste",
    "checksum": "Suma kontrolna",
    "checkDigits": "Cyfry kontrolne",
    "normalized": "Znormalizowany IBAN",
    "formatted": "Sformatowany IBAN",
    "bban": "BBAN",
    "pass": "Zaliczony",
    "fail": "Nie zaliczony",
    "unknown": "Nieznany",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "result": "Kết quả kiểm tra",
    "status": "Trạng thái",
    "valid": "Hợp lệ",
    "invalid": "Không hợp lệ",
    "country": "Quốc gia",
    "registry": "Đăng ký",
    "supported": "Được hỗ trợ",
    "length": "Độ dài",
    "expected": "Kỳ vọng",
    "actual": "Thực tế",
    "checksum": "Checksum",
    "checkDigits": "Chữ số kiểm tra",
    "normalized": "IBAN chuẩn hóa",
    "formatted": "IBAN định dạng",
    "bban": "BBAN",
    "pass": "Đạt",
    "fail": "Không đạt",
    "unknown": "Không rõ",
    "notAvailable": "Không có"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "status": "สถานะ",
    "valid": "ถูกต้อง",
    "invalid": "ไม่ถูกต้อง",
    "country": "ประเทศ",
    "registry": "ทะเบียน",
    "supported": "รองรับ",
    "length": "ความยาว",
    "expected": "ที่คาดไว้",
    "actual": "จริง",
    "checksum": "ผลรวมตรวจสอบ",
    "checkDigits": "เลขตรวจสอบ",
    "normalized": "IBAN มาตรฐาน",
    "formatted": "IBAN จัดรูปแบบ",
    "bban": "BBAN",
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน",
    "unknown": "ไม่ทราบ",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "result": "Hasil Validasi",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Tidak valid",
    "country": "Negara",
    "registry": "Registri",
    "supported": "Didukung",
    "length": "Panjang",
    "expected": "Diharapkan",
    "actual": "Aktual",
    "checksum": "Checksum",
    "checkDigits": "Digit pemeriksa",
    "normalized": "IBAN ternormalisasi",
    "formatted": "IBAN terformat",
    "bban": "BBAN",
    "pass": "Lulus",
    "fail": "Gagal",
    "unknown": "Tidak diketahui",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "result": "תוצאת אימות",
    "status": "סטטוס",
    "valid": "תקין",
    "invalid": "לא תקין",
    "country": "מדינה",
    "registry": "רישום",
    "supported": "נתמך",
    "length": "אורך",
    "expected": "צפוי",
    "actual": "בפועל",
    "checksum": "סכום ביקורת",
    "checkDigits": "ספרות ביקורת",
    "normalized": "IBAN מנורמל",
    "formatted": "IBAN מעוצב",
    "bban": "BBAN",
    "pass": "עבר",
    "fail": "נכשל",
    "unknown": "לא ידוע",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "result": "Keputusan Pengesahan",
    "status": "Status",
    "valid": "Sah",
    "invalid": "Tidak sah",
    "country": "Negara",
    "registry": "Pendaftaran",
    "supported": "Disokong",
    "length": "Panjang",
    "expected": "Dijangka",
    "actual": "Sebenar",
    "checksum": "Checksum",
    "checkDigits": "Digit semakan",
    "normalized": "IBAN dinormalkan",
    "formatted": "IBAN diformat",
    "bban": "BBAN",
    "pass": "Lulus",
    "fail": "Gagal",
    "unknown": "Tidak diketahui",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "result": "Valideringsresultat",
    "status": "Status",
    "valid": "Gyldig",
    "invalid": "Ugyldig",
    "country": "Land",
    "registry": "Register",
    "supported": "Støttet",
    "length": "Lengde",
    "expected": "Forventet",
    "actual": "Faktisk",
    "checksum": "Kontrollsum",
    "checkDigits": "Kontrollsifre",
    "normalized": "Normalisert IBAN",
    "formatted": "Formatert IBAN",
    "bban": "BBAN",
    "pass": "Bestått",
    "fail": "Mislykket",
    "unknown": "Ukjent",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
