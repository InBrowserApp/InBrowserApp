<template>
  <div>
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex :size="16">
        <n-form-item :label="t('format')" label-placement="left">
          <n-select v-model:value="format" :options="formatOptions" style="width: 180px" />
        </n-form-item>
        <n-form-item :label="t('range')" label-placement="left">
          <n-select v-model:value="range" :options="rangeOptions" style="width: 220px" />
        </n-form-item>
      </n-flex>
    </ToolSection>

    <n-grid cols="1 s:2" :x-gap="24" :y-gap="16" responsive="screen">
      <n-gi>
        <ToolSectionHeader>{{ t('plain-text') }}</ToolSectionHeader>
        <ToolSection>
          <n-input
            v-model:value="plainText"
            type="textarea"
            :placeholder="t('plain-text-placeholder')"
            :autosize="{ minRows: 6, maxRows: 16 }"
            style="font-family: monospace"
          />
        </ToolSection>
        <ToolSection>
          <CopyToClipboardButton :content="plainText" />
        </ToolSection>
      </n-gi>
      <n-gi>
        <ToolSectionHeader>{{ t('encoded-text') }}</ToolSectionHeader>
        <ToolSection>
          <n-input
            v-model:value="encodedText"
            type="textarea"
            :placeholder="t('encoded-text-placeholder')"
            :autosize="{ minRows: 6, maxRows: 16 }"
            style="font-family: monospace"
          />
        </ToolSection>
        <ToolSection>
          <CopyToClipboardButton :content="encodedText" />
        </ToolSection>
      </n-gi>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { NInput, NSelect, NGrid, NGi, NFlex, NFormItem } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useStorage } from '@vueuse/core'
import {
  encodeHtmlEntities,
  decodeHtmlEntities,
  type EntityFormat,
  type EncodeRange,
} from '../utils'

const { t } = useI18n()

const formatOptions = computed(() => [
  { label: t('format-named'), value: 'named' as EntityFormat },
  { label: t('format-decimal'), value: 'decimal' as EntityFormat },
  { label: t('format-hex'), value: 'hex' as EntityFormat },
])

const rangeOptions = computed(() => [
  { label: t('range-minimal'), value: 'minimal' as EncodeRange },
  { label: t('range-non-ascii'), value: 'non-ascii' as EncodeRange },
  { label: t('range-all-special'), value: 'all-special' as EncodeRange },
])

const format = useStorage<EntityFormat>('tools:html-entity:format', 'named')
const range = useStorage<EncodeRange>('tools:html-entity:range', 'minimal')
const plainText = useStorage<string>(
  'tools:html-entity:plain',
  '<div class="hello">Hello & World</div>',
)
const encodedText = useStorage<string>('tools:html-entity:encoded', '')

let isUpdatingFromPlain = false
let isUpdatingFromEncoded = false

// Update encoded when plain text, format, or range changes
watch(
  [plainText, format, range],
  ([newPlain, newFormat, newRange]) => {
    if (isUpdatingFromEncoded) return
    isUpdatingFromPlain = true
    encodedText.value = encodeHtmlEntities(newPlain, newFormat, newRange)
    isUpdatingFromPlain = false
  },
  { immediate: true },
)

// Update plain when encoded text changes
watch(encodedText, (newEncoded) => {
  if (isUpdatingFromPlain) return
  isUpdatingFromEncoded = true
  plainText.value = decodeHtmlEntities(newEncoded)
  isUpdatingFromEncoded = false
})
</script>

<i18n lang="json">
{
  "en": {
    "options": "Encoding Options",
    "format": "Format",
    "range": "Range",
    "format-named": "Named (&lt;)",
    "format-decimal": "Decimal (&#60;)",
    "format-hex": "Hexadecimal (&#x3C;)",
    "range-minimal": "Minimal (HTML required)",
    "range-non-ascii": "All Non-ASCII",
    "range-all-special": "All Special Characters",
    "plain-text": "Plain Text",
    "plain-text-placeholder": "Enter text to encode...",
    "encoded-text": "Encoded Text",
    "encoded-text-placeholder": "Enter HTML entities to decode..."
  },
  "zh": {
    "options": "编码选项",
    "format": "格式",
    "range": "范围",
    "format-named": "命名实体 (&lt;)",
    "format-decimal": "十进制 (&#60;)",
    "format-hex": "十六进制 (&#x3C;)",
    "range-minimal": "最小 (HTML 必需)",
    "range-non-ascii": "所有非 ASCII",
    "range-all-special": "所有特殊字符",
    "plain-text": "纯文本",
    "plain-text-placeholder": "输入要编码的文本...",
    "encoded-text": "编码文本",
    "encoded-text-placeholder": "输入要解码的 HTML 实体..."
  },
  "zh-CN": {
    "options": "编码选项",
    "format": "格式",
    "range": "范围",
    "format-named": "命名实体 (&lt;)",
    "format-decimal": "十进制 (&#60;)",
    "format-hex": "十六进制 (&#x3C;)",
    "range-minimal": "最小 (HTML 必需)",
    "range-non-ascii": "所有非 ASCII",
    "range-all-special": "所有特殊字符",
    "plain-text": "纯文本",
    "plain-text-placeholder": "输入要编码的文本...",
    "encoded-text": "编码文本",
    "encoded-text-placeholder": "输入要解码的 HTML 实体..."
  },
  "zh-TW": {
    "options": "編碼選項",
    "format": "格式",
    "range": "範圍",
    "format-named": "命名實體 (&lt;)",
    "format-decimal": "十進位 (&#60;)",
    "format-hex": "十六進位 (&#x3C;)",
    "range-minimal": "最小 (HTML 必需)",
    "range-non-ascii": "所有非 ASCII",
    "range-all-special": "所有特殊字元",
    "plain-text": "純文字",
    "plain-text-placeholder": "輸入要編碼的文字...",
    "encoded-text": "編碼文字",
    "encoded-text-placeholder": "輸入要解碼的 HTML 實體..."
  },
  "zh-HK": {
    "options": "編碼選項",
    "format": "格式",
    "range": "範圍",
    "format-named": "命名實體 (&lt;)",
    "format-decimal": "十進位 (&#60;)",
    "format-hex": "十六進位 (&#x3C;)",
    "range-minimal": "最小 (HTML 必需)",
    "range-non-ascii": "所有非 ASCII",
    "range-all-special": "所有特殊字元",
    "plain-text": "純文字",
    "plain-text-placeholder": "輸入要編碼的文字...",
    "encoded-text": "編碼文字",
    "encoded-text-placeholder": "輸入要解碼的 HTML 實體..."
  },
  "es": {
    "options": "Opciones de codificación",
    "format": "Formato",
    "range": "Rango",
    "format-named": "Nombrada (&lt;)",
    "format-decimal": "Decimal (&#60;)",
    "format-hex": "Hexadecimal (&#x3C;)",
    "range-minimal": "Mínimo (requerido por HTML)",
    "range-non-ascii": "Todo no ASCII",
    "range-all-special": "Todos los caracteres especiales",
    "plain-text": "Texto plano",
    "plain-text-placeholder": "Ingrese texto para codificar...",
    "encoded-text": "Texto codificado",
    "encoded-text-placeholder": "Ingrese entidades HTML para decodificar..."
  },
  "fr": {
    "options": "Options d'encodage",
    "format": "Format",
    "range": "Plage",
    "format-named": "Nommée (&lt;)",
    "format-decimal": "Décimale (&#60;)",
    "format-hex": "Hexadécimale (&#x3C;)",
    "range-minimal": "Minimal (requis par HTML)",
    "range-non-ascii": "Tout non-ASCII",
    "range-all-special": "Tous les caractères spéciaux",
    "plain-text": "Texte brut",
    "plain-text-placeholder": "Entrez le texte à encoder...",
    "encoded-text": "Texte encodé",
    "encoded-text-placeholder": "Entrez les entités HTML à décoder..."
  },
  "de": {
    "options": "Kodierungsoptionen",
    "format": "Format",
    "range": "Bereich",
    "format-named": "Benannt (&lt;)",
    "format-decimal": "Dezimal (&#60;)",
    "format-hex": "Hexadezimal (&#x3C;)",
    "range-minimal": "Minimal (HTML-erforderlich)",
    "range-non-ascii": "Alle Nicht-ASCII",
    "range-all-special": "Alle Sonderzeichen",
    "plain-text": "Klartext",
    "plain-text-placeholder": "Text zum Kodieren eingeben...",
    "encoded-text": "Kodierter Text",
    "encoded-text-placeholder": "HTML-Entitäten zum Dekodieren eingeben..."
  },
  "it": {
    "options": "Opzioni di codifica",
    "format": "Formato",
    "range": "Intervallo",
    "format-named": "Nominata (&lt;)",
    "format-decimal": "Decimale (&#60;)",
    "format-hex": "Esadecimale (&#x3C;)",
    "range-minimal": "Minimo (richiesto da HTML)",
    "range-non-ascii": "Tutto non-ASCII",
    "range-all-special": "Tutti i caratteri speciali",
    "plain-text": "Testo normale",
    "plain-text-placeholder": "Inserisci il testo da codificare...",
    "encoded-text": "Testo codificato",
    "encoded-text-placeholder": "Inserisci entità HTML da decodificare..."
  },
  "ja": {
    "options": "エンコードオプション",
    "format": "形式",
    "range": "範囲",
    "format-named": "名前付き (&lt;)",
    "format-decimal": "10進数 (&#60;)",
    "format-hex": "16進数 (&#x3C;)",
    "range-minimal": "最小 (HTML 必須)",
    "range-non-ascii": "すべての非 ASCII",
    "range-all-special": "すべての特殊文字",
    "plain-text": "プレーンテキスト",
    "plain-text-placeholder": "エンコードするテキストを入力...",
    "encoded-text": "エンコード済みテキスト",
    "encoded-text-placeholder": "デコードする HTML エンティティを入力..."
  },
  "ko": {
    "options": "인코딩 옵션",
    "format": "형식",
    "range": "범위",
    "format-named": "명명됨 (&lt;)",
    "format-decimal": "10진수 (&#60;)",
    "format-hex": "16진수 (&#x3C;)",
    "range-minimal": "최소 (HTML 필수)",
    "range-non-ascii": "모든 비 ASCII",
    "range-all-special": "모든 특수 문자",
    "plain-text": "일반 텍스트",
    "plain-text-placeholder": "인코딩할 텍스트 입력...",
    "encoded-text": "인코딩된 텍스트",
    "encoded-text-placeholder": "디코딩할 HTML 엔티티 입력..."
  },
  "ru": {
    "options": "Параметры кодирования",
    "format": "Формат",
    "range": "Диапазон",
    "format-named": "Именованная (&lt;)",
    "format-decimal": "Десятичная (&#60;)",
    "format-hex": "Шестнадцатеричная (&#x3C;)",
    "range-minimal": "Минимум (требуется HTML)",
    "range-non-ascii": "Все не-ASCII",
    "range-all-special": "Все специальные символы",
    "plain-text": "Обычный текст",
    "plain-text-placeholder": "Введите текст для кодирования...",
    "encoded-text": "Закодированный текст",
    "encoded-text-placeholder": "Введите HTML-сущности для декодирования..."
  },
  "pt": {
    "options": "Opções de codificação",
    "format": "Formato",
    "range": "Intervalo",
    "format-named": "Nomeada (&lt;)",
    "format-decimal": "Decimal (&#60;)",
    "format-hex": "Hexadecimal (&#x3C;)",
    "range-minimal": "Mínimo (requerido por HTML)",
    "range-non-ascii": "Todos não-ASCII",
    "range-all-special": "Todos os caracteres especiais",
    "plain-text": "Texto simples",
    "plain-text-placeholder": "Digite o texto para codificar...",
    "encoded-text": "Texto codificado",
    "encoded-text-placeholder": "Digite entidades HTML para decodificar..."
  },
  "ar": {
    "options": "خيارات الترميز",
    "format": "التنسيق",
    "range": "النطاق",
    "format-named": "مسمى (&lt;)",
    "format-decimal": "عشري (&#60;)",
    "format-hex": "سداسي عشري (&#x3C;)",
    "range-minimal": "الحد الأدنى (مطلوب لـ HTML)",
    "range-non-ascii": "كل غير ASCII",
    "range-all-special": "جميع الأحرف الخاصة",
    "plain-text": "نص عادي",
    "plain-text-placeholder": "أدخل النص للترميز...",
    "encoded-text": "نص مرمز",
    "encoded-text-placeholder": "أدخل كيانات HTML لفك الترميز..."
  },
  "hi": {
    "options": "एन्कोडिंग विकल्प",
    "format": "प्रारूप",
    "range": "सीमा",
    "format-named": "नामित (&lt;)",
    "format-decimal": "दशमलव (&#60;)",
    "format-hex": "हेक्साडेसिमल (&#x3C;)",
    "range-minimal": "न्यूनतम (HTML आवश्यक)",
    "range-non-ascii": "सभी गैर-ASCII",
    "range-all-special": "सभी विशेष वर्ण",
    "plain-text": "सादा पाठ",
    "plain-text-placeholder": "एन्कोड करने के लिए टेक्स्ट दर्ज करें...",
    "encoded-text": "एन्कोडेड टेक्स्ट",
    "encoded-text-placeholder": "डिकोड करने के लिए HTML एंटिटीज़ दर्ज करें..."
  },
  "tr": {
    "options": "Kodlama Seçenekleri",
    "format": "Format",
    "range": "Aralık",
    "format-named": "Adlandırılmış (&lt;)",
    "format-decimal": "Ondalık (&#60;)",
    "format-hex": "Onaltılık (&#x3C;)",
    "range-minimal": "Minimum (HTML gerekli)",
    "range-non-ascii": "Tüm ASCII olmayan",
    "range-all-special": "Tüm özel karakterler",
    "plain-text": "Düz Metin",
    "plain-text-placeholder": "Kodlanacak metni girin...",
    "encoded-text": "Kodlanmış Metin",
    "encoded-text-placeholder": "Çözülecek HTML varlıklarını girin..."
  },
  "nl": {
    "options": "Coderingsopties",
    "format": "Formaat",
    "range": "Bereik",
    "format-named": "Benoemd (&lt;)",
    "format-decimal": "Decimaal (&#60;)",
    "format-hex": "Hexadecimaal (&#x3C;)",
    "range-minimal": "Minimaal (HTML vereist)",
    "range-non-ascii": "Alle niet-ASCII",
    "range-all-special": "Alle speciale tekens",
    "plain-text": "Platte tekst",
    "plain-text-placeholder": "Voer tekst in om te coderen...",
    "encoded-text": "Gecodeerde tekst",
    "encoded-text-placeholder": "Voer HTML-entiteiten in om te decoderen..."
  },
  "sv": {
    "options": "Kodningsalternativ",
    "format": "Format",
    "range": "Intervall",
    "format-named": "Namngiven (&lt;)",
    "format-decimal": "Decimal (&#60;)",
    "format-hex": "Hexadecimal (&#x3C;)",
    "range-minimal": "Minimal (HTML krävs)",
    "range-non-ascii": "Alla icke-ASCII",
    "range-all-special": "Alla specialtecken",
    "plain-text": "Klartext",
    "plain-text-placeholder": "Ange text att koda...",
    "encoded-text": "Kodad text",
    "encoded-text-placeholder": "Ange HTML-entiteter att avkoda..."
  },
  "pl": {
    "options": "Opcje kodowania",
    "format": "Format",
    "range": "Zakres",
    "format-named": "Nazwana (&lt;)",
    "format-decimal": "Dziesiętna (&#60;)",
    "format-hex": "Szesnastkowa (&#x3C;)",
    "range-minimal": "Minimalna (wymagana przez HTML)",
    "range-non-ascii": "Wszystkie nie-ASCII",
    "range-all-special": "Wszystkie znaki specjalne",
    "plain-text": "Zwykły tekst",
    "plain-text-placeholder": "Wprowadź tekst do zakodowania...",
    "encoded-text": "Zakodowany tekst",
    "encoded-text-placeholder": "Wprowadź encje HTML do zdekodowania..."
  },
  "vi": {
    "options": "Tùy chọn mã hóa",
    "format": "Định dạng",
    "range": "Phạm vi",
    "format-named": "Đặt tên (&lt;)",
    "format-decimal": "Thập phân (&#60;)",
    "format-hex": "Thập lục phân (&#x3C;)",
    "range-minimal": "Tối thiểu (HTML bắt buộc)",
    "range-non-ascii": "Tất cả không phải ASCII",
    "range-all-special": "Tất cả ký tự đặc biệt",
    "plain-text": "Văn bản thuần",
    "plain-text-placeholder": "Nhập văn bản để mã hóa...",
    "encoded-text": "Văn bản đã mã hóa",
    "encoded-text-placeholder": "Nhập thực thể HTML để giải mã..."
  },
  "th": {
    "options": "ตัวเลือกการเข้ารหัส",
    "format": "รูปแบบ",
    "range": "ช่วง",
    "format-named": "ตั้งชื่อ (&lt;)",
    "format-decimal": "ทศนิยม (&#60;)",
    "format-hex": "เลขฐานสิบหก (&#x3C;)",
    "range-minimal": "น้อยที่สุด (HTML จำเป็น)",
    "range-non-ascii": "ทั้งหมดที่ไม่ใช่ ASCII",
    "range-all-special": "อักขระพิเศษทั้งหมด",
    "plain-text": "ข้อความธรรมดา",
    "plain-text-placeholder": "ป้อนข้อความเพื่อเข้ารหัส...",
    "encoded-text": "ข้อความที่เข้ารหัส",
    "encoded-text-placeholder": "ป้อนเอนทิตี HTML เพื่อถอดรหัส..."
  },
  "id": {
    "options": "Opsi Pengkodean",
    "format": "Format",
    "range": "Rentang",
    "format-named": "Bernama (&lt;)",
    "format-decimal": "Desimal (&#60;)",
    "format-hex": "Heksadesimal (&#x3C;)",
    "range-minimal": "Minimal (diperlukan HTML)",
    "range-non-ascii": "Semua non-ASCII",
    "range-all-special": "Semua karakter khusus",
    "plain-text": "Teks Biasa",
    "plain-text-placeholder": "Masukkan teks untuk dikodekan...",
    "encoded-text": "Teks Terkode",
    "encoded-text-placeholder": "Masukkan entitas HTML untuk didekodekan..."
  },
  "he": {
    "options": "אפשרויות קידוד",
    "format": "פורמט",
    "range": "טווח",
    "format-named": "בעלת שם (&lt;)",
    "format-decimal": "עשרונית (&#60;)",
    "format-hex": "הקסדצימלית (&#x3C;)",
    "range-minimal": "מינימלי (נדרש ל-HTML)",
    "range-non-ascii": "כל הלא-ASCII",
    "range-all-special": "כל התווים המיוחדים",
    "plain-text": "טקסט רגיל",
    "plain-text-placeholder": "הזן טקסט לקידוד...",
    "encoded-text": "טקסט מקודד",
    "encoded-text-placeholder": "הזן ישויות HTML לפענוח..."
  },
  "ms": {
    "options": "Pilihan Pengekodan",
    "format": "Format",
    "range": "Julat",
    "format-named": "Dinamakan (&lt;)",
    "format-decimal": "Perpuluhan (&#60;)",
    "format-hex": "Heksadesimal (&#x3C;)",
    "range-minimal": "Minimum (HTML diperlukan)",
    "range-non-ascii": "Semua bukan ASCII",
    "range-all-special": "Semua aksara khas",
    "plain-text": "Teks Biasa",
    "plain-text-placeholder": "Masukkan teks untuk dikodkan...",
    "encoded-text": "Teks Dikodkan",
    "encoded-text-placeholder": "Masukkan entiti HTML untuk dinyahkod..."
  },
  "no": {
    "options": "Kodingsalternativer",
    "format": "Format",
    "range": "Område",
    "format-named": "Navngitt (&lt;)",
    "format-decimal": "Desimal (&#60;)",
    "format-hex": "Heksadesimal (&#x3C;)",
    "range-minimal": "Minimal (HTML påkrevd)",
    "range-non-ascii": "Alle ikke-ASCII",
    "range-all-special": "Alle spesialtegn",
    "plain-text": "Ren tekst",
    "plain-text-placeholder": "Skriv inn tekst for koding...",
    "encoded-text": "Kodet tekst",
    "encoded-text-placeholder": "Skriv inn HTML-entiteter for dekoding..."
  }
}
</i18n>
