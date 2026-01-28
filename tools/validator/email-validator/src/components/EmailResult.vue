<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <NDescriptionsItem :label="t('status')">
        <NTag :type="validationResult.isValid ? 'success' : 'error'" size="small">
          {{ validationResult.isValid ? t('valid') : t('invalid') }}
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
      <NDescriptionsItem :label="t('localPart')">
        <NFlex align="center" :size="8">
          <NText code>{{ localDisplay }}</NText>
          <CopyToClipboardButton
            v-if="validationResult.localPart"
            :content="validationResult.localPart"
            size="small"
          />
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('domain')">
        <NFlex align="center" :size="8">
          <NText code>{{ domainDisplay }}</NText>
          <CopyToClipboardButton
            v-if="validationResult.domain"
            :content="validationResult.domain"
            size="small"
          />
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('length')">
        <NText depth="3">{{ lengthDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('localLength')">
        <NText depth="3">{{ localLengthDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('domainLength')">
        <NText depth="3">{{ domainLengthDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('lengthCheck')">
        <NTag :type="lengthStatus.type" size="small">{{ lengthStatus.label }}</NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('localCheck')">
        <NTag :type="localStatus.type" size="small">{{ localStatus.label }}</NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('domainCheck')">
        <NTag :type="domainStatus.type" size="small">{{ domainStatus.label }}</NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('tldCheck')">
        <NTag :type="tldStatus.type" size="small">{{ tldStatus.label }}</NTag>
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
import type { EmailValidationResult } from '../data/email'

const { t } = useI18n()

type TagType = 'success' | 'error' | 'default' | 'warning' | 'primary' | 'info'

type TagStatus = {
  label: string
  type: TagType
}

const props = defineProps<{
  validationResult: EmailValidationResult
}>()

const normalizedDisplay = computed(() => props.validationResult.normalized || t('notAvailable'))

const localDisplay = computed(() => props.validationResult.localPart || t('notAvailable'))

const domainDisplay = computed(() => props.validationResult.domain || t('notAvailable'))

const lengthDisplay = computed(() =>
  props.validationResult.length > 0 ? `${props.validationResult.length}` : t('notAvailable'),
)

const localLengthDisplay = computed(() =>
  props.validationResult.localLength > 0
    ? `${props.validationResult.localLength}`
    : t('notAvailable'),
)

const domainLengthDisplay = computed(() =>
  props.validationResult.domainLength > 0
    ? `${props.validationResult.domainLength}`
    : t('notAvailable'),
)

const checkStatus = (value: boolean, available = true): TagStatus => {
  if (!available) {
    return { label: t('notAvailable'), type: 'default' }
  }

  return value ? { label: t('pass'), type: 'success' } : { label: t('fail'), type: 'error' }
}

const hasLocalPart = computed(() => props.validationResult.localLength > 0)
const hasDomain = computed(() => props.validationResult.domainLength > 0)

const lengthStatus = computed(() =>
  checkStatus(props.validationResult.isLengthValid, props.validationResult.length > 0),
)
const localStatus = computed(() =>
  checkStatus(
    props.validationResult.isLocalLengthValid &&
      props.validationResult.isLocalCharsValid &&
      props.validationResult.isLocalDotsValid,
    hasLocalPart.value,
  ),
)
const domainStatus = computed(() =>
  checkStatus(
    props.validationResult.isDomainLengthValid &&
      props.validationResult.isDomainCharsValid &&
      props.validationResult.isDomainDotsValid &&
      props.validationResult.isDomainLabelLengthValid &&
      props.validationResult.isDomainLabelCharsValid,
    hasDomain.value,
  ),
)
const tldStatus = computed(() => checkStatus(props.validationResult.isTldValid, hasDomain.value))
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "normalized": "Normalized Email",
    "localPart": "Local Part",
    "domain": "Domain",
    "length": "Total Length",
    "localLength": "Local Length",
    "domainLength": "Domain Length",
    "lengthCheck": "Length Check",
    "localCheck": "Local Part Check",
    "domainCheck": "Domain Check",
    "tldCheck": "TLD Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "zh": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "normalized": "标准化邮箱",
    "localPart": "本地部分",
    "domain": "域名",
    "length": "总长度",
    "localLength": "本地长度",
    "domainLength": "域名长度",
    "lengthCheck": "长度检查",
    "localCheck": "本地部分检查",
    "domainCheck": "域名检查",
    "tldCheck": "顶级域名检查",
    "pass": "通过",
    "fail": "失败",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "normalized": "标准化邮箱",
    "localPart": "本地部分",
    "domain": "域名",
    "length": "总长度",
    "localLength": "本地长度",
    "domainLength": "域名长度",
    "lengthCheck": "长度检查",
    "localCheck": "本地部分检查",
    "domainCheck": "域名检查",
    "tldCheck": "顶级域名检查",
    "pass": "通过",
    "fail": "失败",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "normalized": "標準化電子郵件",
    "localPart": "本地部分",
    "domain": "網域",
    "length": "總長度",
    "localLength": "本地長度",
    "domainLength": "網域長度",
    "lengthCheck": "長度檢查",
    "localCheck": "本地部分檢查",
    "domainCheck": "網域檢查",
    "tldCheck": "頂級網域檢查",
    "pass": "通過",
    "fail": "失敗",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "normalized": "標準化電郵",
    "localPart": "本地部分",
    "domain": "網域",
    "length": "總長度",
    "localLength": "本地長度",
    "domainLength": "網域長度",
    "lengthCheck": "長度檢查",
    "localCheck": "本地部分檢查",
    "domainCheck": "網域檢查",
    "tldCheck": "頂級網域檢查",
    "pass": "通過",
    "fail": "失敗",
    "notAvailable": "不可用"
  },
  "es": {
    "result": "Resultado de validación",
    "status": "Estado",
    "valid": "Válido",
    "invalid": "Inválido",
    "normalized": "Correo normalizado",
    "localPart": "Parte local",
    "domain": "Dominio",
    "length": "Longitud total",
    "localLength": "Longitud local",
    "domainLength": "Longitud del dominio",
    "lengthCheck": "Comprobación de longitud",
    "localCheck": "Comprobación de parte local",
    "domainCheck": "Comprobación de dominio",
    "tldCheck": "Comprobación de TLD",
    "pass": "Aprobado",
    "fail": "Fallido",
    "notAvailable": "No disponible"
  },
  "fr": {
    "result": "Résultat de validation",
    "status": "Statut",
    "valid": "Valide",
    "invalid": "Invalide",
    "normalized": "E-mail normalisé",
    "localPart": "Partie locale",
    "domain": "Domaine",
    "length": "Longueur totale",
    "localLength": "Longueur locale",
    "domainLength": "Longueur du domaine",
    "lengthCheck": "Contrôle de longueur",
    "localCheck": "Contrôle de la partie locale",
    "domainCheck": "Contrôle du domaine",
    "tldCheck": "Contrôle du TLD",
    "pass": "Réussi",
    "fail": "Échoué",
    "notAvailable": "Non disponible"
  },
  "de": {
    "result": "Validierungsergebnis",
    "status": "Status",
    "valid": "Gültig",
    "invalid": "Ungültig",
    "normalized": "Normalisierte E-Mail",
    "localPart": "Lokaler Teil",
    "domain": "Domain",
    "length": "Gesamtlänge",
    "localLength": "Lokale Länge",
    "domainLength": "Domainlänge",
    "lengthCheck": "Längenprüfung",
    "localCheck": "Prüfung des lokalen Teils",
    "domainCheck": "Domainprüfung",
    "tldCheck": "TLD-Prüfung",
    "pass": "Bestanden",
    "fail": "Fehlgeschlagen",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "result": "Risultato della validazione",
    "status": "Stato",
    "valid": "Valido",
    "invalid": "Non valido",
    "normalized": "Email normalizzata",
    "localPart": "Parte locale",
    "domain": "Dominio",
    "length": "Lunghezza totale",
    "localLength": "Lunghezza locale",
    "domainLength": "Lunghezza dominio",
    "lengthCheck": "Controllo lunghezza",
    "localCheck": "Controllo parte locale",
    "domainCheck": "Controllo dominio",
    "tldCheck": "Controllo TLD",
    "pass": "Superato",
    "fail": "Non superato",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "result": "検証結果",
    "status": "状態",
    "valid": "有効",
    "invalid": "無効",
    "normalized": "正規化メール",
    "localPart": "ローカル部",
    "domain": "ドメイン",
    "length": "合計長",
    "localLength": "ローカル長",
    "domainLength": "ドメイン長",
    "lengthCheck": "長さチェック",
    "localCheck": "ローカル部チェック",
    "domainCheck": "ドメインチェック",
    "tldCheck": "TLD チェック",
    "pass": "合格",
    "fail": "不合格",
    "notAvailable": "利用不可"
  },
  "ko": {
    "result": "검증 결과",
    "status": "상태",
    "valid": "유효",
    "invalid": "무효",
    "normalized": "정규화된 이메일",
    "localPart": "로컬 부분",
    "domain": "도메인",
    "length": "전체 길이",
    "localLength": "로컬 길이",
    "domainLength": "도메인 길이",
    "lengthCheck": "길이 검사",
    "localCheck": "로컬 부분 검사",
    "domainCheck": "도메인 검사",
    "tldCheck": "TLD 검사",
    "pass": "통과",
    "fail": "실패",
    "notAvailable": "사용 불가"
  },
  "ru": {
    "result": "Результат проверки",
    "status": "Статус",
    "valid": "Действителен",
    "invalid": "Недействителен",
    "normalized": "Нормализованный email",
    "localPart": "Локальная часть",
    "domain": "Домен",
    "length": "Общая длина",
    "localLength": "Длина локальной части",
    "domainLength": "Длина домена",
    "lengthCheck": "Проверка длины",
    "localCheck": "Проверка локальной части",
    "domainCheck": "Проверка домена",
    "tldCheck": "Проверка TLD",
    "pass": "Пройдено",
    "fail": "Не пройдено",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "result": "Resultado da validação",
    "status": "Status",
    "valid": "Válido",
    "invalid": "Inválido",
    "normalized": "E-mail normalizado",
    "localPart": "Parte local",
    "domain": "Domínio",
    "length": "Comprimento total",
    "localLength": "Comprimento local",
    "domainLength": "Comprimento do domínio",
    "lengthCheck": "Verificação de comprimento",
    "localCheck": "Verificação da parte local",
    "domainCheck": "Verificação do domínio",
    "tldCheck": "Verificação de TLD",
    "pass": "Aprovado",
    "fail": "Reprovado",
    "notAvailable": "Não disponível"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "status": "الحالة",
    "valid": "صالح",
    "invalid": "غير صالح",
    "normalized": "البريد الإلكتروني المعياري",
    "localPart": "الجزء المحلي",
    "domain": "النطاق",
    "length": "الطول الكلي",
    "localLength": "طول الجزء المحلي",
    "domainLength": "طول النطاق",
    "lengthCheck": "فحص الطول",
    "localCheck": "فحص الجزء المحلي",
    "domainCheck": "فحص النطاق",
    "tldCheck": "فحص TLD",
    "pass": "تم",
    "fail": "فشل",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "status": "स्थिति",
    "valid": "मान्य",
    "invalid": "अमान्य",
    "normalized": "सामान्यीकृत ईमेल",
    "localPart": "लोकल भाग",
    "domain": "डोमेन",
    "length": "कुल लंबाई",
    "localLength": "लोकल लंबाई",
    "domainLength": "डोमेन लंबाई",
    "lengthCheck": "लंबाई जांच",
    "localCheck": "लोकल भाग जांच",
    "domainCheck": "डोमेन जांच",
    "tldCheck": "TLD जांच",
    "pass": "सफल",
    "fail": "असफल",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "status": "Durum",
    "valid": "Geçerli",
    "invalid": "Geçersiz",
    "normalized": "Normalleştirilmiş e-posta",
    "localPart": "Yerel bölüm",
    "domain": "Alan adı",
    "length": "Toplam uzunluk",
    "localLength": "Yerel uzunluk",
    "domainLength": "Alan adı uzunluğu",
    "lengthCheck": "Uzunluk kontrolü",
    "localCheck": "Yerel bölüm kontrolü",
    "domainCheck": "Alan adı kontrolü",
    "tldCheck": "TLD kontrolü",
    "pass": "Geçti",
    "fail": "Kaldı",
    "notAvailable": "Mevcut değil"
  },
  "nl": {
    "result": "Validatieresultaat",
    "status": "Status",
    "valid": "Geldig",
    "invalid": "Ongeldig",
    "normalized": "Genormaliseerde e-mail",
    "localPart": "Lokaal deel",
    "domain": "Domein",
    "length": "Totale lengte",
    "localLength": "Lokale lengte",
    "domainLength": "Domeinlengte",
    "lengthCheck": "Lengtecontrole",
    "localCheck": "Controle lokaal deel",
    "domainCheck": "Domeincontrole",
    "tldCheck": "TLD-controle",
    "pass": "Geslaagd",
    "fail": "Mislukt",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "result": "Valideringsresultat",
    "status": "Status",
    "valid": "Giltig",
    "invalid": "Ogiltig",
    "normalized": "Normaliserad e-post",
    "localPart": "Lokal del",
    "domain": "Domän",
    "length": "Total längd",
    "localLength": "Lokal längd",
    "domainLength": "Domänlängd",
    "lengthCheck": "Längdkontroll",
    "localCheck": "Kontroll av lokal del",
    "domainCheck": "Domänkontroll",
    "tldCheck": "TLD-kontroll",
    "pass": "Godkänd",
    "fail": "Underkänd",
    "notAvailable": "Ej tillgänglig"
  },
  "pl": {
    "result": "Wynik walidacji",
    "status": "Status",
    "valid": "Poprawny",
    "invalid": "Niepoprawny",
    "normalized": "Znormalizowany e-mail",
    "localPart": "Część lokalna",
    "domain": "Domena",
    "length": "Łączna długość",
    "localLength": "Długość części lokalnej",
    "domainLength": "Długość domeny",
    "lengthCheck": "Kontrola długości",
    "localCheck": "Kontrola części lokalnej",
    "domainCheck": "Kontrola domeny",
    "tldCheck": "Kontrola TLD",
    "pass": "Zaliczone",
    "fail": "Nie zaliczone",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "result": "Kết quả xác thực",
    "status": "Trạng thái",
    "valid": "Hợp lệ",
    "invalid": "Không hợp lệ",
    "normalized": "Email chuẩn hóa",
    "localPart": "Phần cục bộ",
    "domain": "Tên miền",
    "length": "Tổng độ dài",
    "localLength": "Độ dài phần cục bộ",
    "domainLength": "Độ dài tên miền",
    "lengthCheck": "Kiểm tra độ dài",
    "localCheck": "Kiểm tra phần cục bộ",
    "domainCheck": "Kiểm tra tên miền",
    "tldCheck": "Kiểm tra TLD",
    "pass": "Đạt",
    "fail": "Không đạt",
    "notAvailable": "Không khả dụng"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "status": "สถานะ",
    "valid": "ถูกต้อง",
    "invalid": "ไม่ถูกต้อง",
    "normalized": "อีเมลที่ปรับรูปแบบ",
    "localPart": "ส่วนโลคัล",
    "domain": "โดเมน",
    "length": "ความยาวรวม",
    "localLength": "ความยาวส่วนโลคัล",
    "domainLength": "ความยาวโดเมน",
    "lengthCheck": "ตรวจความยาว",
    "localCheck": "ตรวจส่วนโลคัล",
    "domainCheck": "ตรวจโดเมน",
    "tldCheck": "ตรวจ TLD",
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน",
    "notAvailable": "ไม่พร้อมใช้"
  },
  "id": {
    "result": "Hasil validasi",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Tidak valid",
    "normalized": "Email ternormalisasi",
    "localPart": "Bagian lokal",
    "domain": "Domain",
    "length": "Panjang total",
    "localLength": "Panjang lokal",
    "domainLength": "Panjang domain",
    "lengthCheck": "Pemeriksaan panjang",
    "localCheck": "Pemeriksaan bagian lokal",
    "domainCheck": "Pemeriksaan domain",
    "tldCheck": "Pemeriksaan TLD",
    "pass": "Lulus",
    "fail": "Gagal",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "result": "תוצאת אימות",
    "status": "סטטוס",
    "valid": "תקין",
    "invalid": "לא תקין",
    "normalized": "דוא\"ל מנורמל",
    "localPart": "החלק המקומי",
    "domain": "דומיין",
    "length": "אורך כולל",
    "localLength": "אורך החלק המקומי",
    "domainLength": "אורך הדומיין",
    "lengthCheck": "בדיקת אורך",
    "localCheck": "בדיקת החלק המקומי",
    "domainCheck": "בדיקת הדומיין",
    "tldCheck": "בדיקת TLD",
    "pass": "עבר",
    "fail": "נכשל",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "result": "Hasil pengesahan",
    "status": "Status",
    "valid": "Sah",
    "invalid": "Tidak sah",
    "normalized": "E-mel dinormalkan",
    "localPart": "Bahagian lokal",
    "domain": "Domain",
    "length": "Panjang keseluruhan",
    "localLength": "Panjang lokal",
    "domainLength": "Panjang domain",
    "lengthCheck": "Semakan panjang",
    "localCheck": "Semakan bahagian lokal",
    "domainCheck": "Semakan domain",
    "tldCheck": "Semakan TLD",
    "pass": "Lulus",
    "fail": "Gagal",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "result": "Valideringsresultat",
    "status": "Status",
    "valid": "Gyldig",
    "invalid": "Ugyldig",
    "normalized": "Normalisert e-post",
    "localPart": "Lokal del",
    "domain": "Domene",
    "length": "Total lengde",
    "localLength": "Lokal lengde",
    "domainLength": "Domenelengde",
    "lengthCheck": "Lengdesjekk",
    "localCheck": "Sjekk av lokal del",
    "domainCheck": "Domenesjekk",
    "tldCheck": "TLD-sjekk",
    "pass": "Bestått",
    "fail": "Ikke bestått",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
