<template>
  <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="16">
      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('count')" :show-feedback="false">
          <n-input-number
            :value="count"
            :min="1"
            :max="maxCount"
            style="width: 100%"
            @update:value="(value) => emit('update:count', value)"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('length')" :show-feedback="false">
          <n-input-number
            :value="length"
            :min="1"
            :max="maxLength"
            style="width: 100%"
            @update:value="(value) => emit('update:length', value)"
          />
        </n-form-item-gi>
      </n-grid>

      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('alphabetPreset')" :show-feedback="false">
          <n-select
            :value="alphabetPreset"
            :options="presetOptions"
            style="width: 100%"
            @update:value="(value) => emit('update:alphabetPreset', value as NanoidAlphabetPreset)"
          />
        </n-form-item-gi>
        <n-form-item-gi
          v-if="alphabetPreset === 'custom'"
          :label="t('customAlphabet')"
          :show-feedback="false"
        >
          <n-input
            :value="customAlphabet"
            :placeholder="t('customAlphabetPlaceholder')"
            @update:value="(value) => emit('update:customAlphabet', value)"
          />
        </n-form-item-gi>
      </n-grid>

      <n-alert v-if="alphabetError" type="error">
        {{ alphabetError }}
      </n-alert>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NFlex, NFormItemGi, NGrid, NInput, NInputNumber, NSelect } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { NanoidAlphabetPreset } from '../utils/nanoid'

defineProps<{
  count: number | null
  length: number | null
  maxCount: number
  maxLength: number
  alphabetPreset: NanoidAlphabetPreset
  customAlphabet: string
  alphabetError: string
}>()

const emit = defineEmits<{
  (event: 'update:count', value: number | null): void
  (event: 'update:length', value: number | null): void
  (event: 'update:alphabetPreset', value: NanoidAlphabetPreset): void
  (event: 'update:customAlphabet', value: string): void
}>()

const { t } = useI18n()

const presetOptions = computed(() => [
  { label: t('presetUrlSafe'), value: 'url-safe' },
  { label: t('presetAlphanumeric'), value: 'alphanumeric' },
  { label: t('presetLowercase'), value: 'lowercase' },
  { label: t('presetUppercase'), value: 'uppercase' },
  { label: t('presetNumbers'), value: 'numbers' },
  { label: t('presetHexLowercase'), value: 'hex-lowercase' },
  { label: t('presetHexUppercase'), value: 'hex-uppercase' },
  { label: t('presetCustom'), value: 'custom' },
])
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom"
  },
  "zh": {
    "options": "选项",
    "count": "数量",
    "length": "长度",
    "alphabetPreset": "字符集预设",
    "customAlphabet": "自定义字符集",
    "customAlphabetPlaceholder": "输入自定义字符集...",
    "presetUrlSafe": "URL 安全（A-Z、a-z、0-9、-_）",
    "presetAlphanumeric": "字母数字（A-Z、a-z、0-9）",
    "presetLowercase": "小写（a-z）",
    "presetUppercase": "大写（A-Z）",
    "presetNumbers": "数字（0-9）",
    "presetHexLowercase": "十六进制（0-9、a-f）",
    "presetHexUppercase": "十六进制（0-9、A-F）",
    "presetCustom": "自定义"
  },
  "zh-CN": {
    "options": "选项",
    "count": "数量",
    "length": "长度",
    "alphabetPreset": "字符集预设",
    "customAlphabet": "自定义字符集",
    "customAlphabetPlaceholder": "输入自定义字符集...",
    "presetUrlSafe": "URL 安全（A-Z、a-z、0-9、-_）",
    "presetAlphanumeric": "字母数字（A-Z、a-z、0-9）",
    "presetLowercase": "小写（a-z）",
    "presetUppercase": "大写（A-Z）",
    "presetNumbers": "数字（0-9）",
    "presetHexLowercase": "十六进制（0-9、a-f）",
    "presetHexUppercase": "十六进制（0-9、A-F）",
    "presetCustom": "自定义"
  },
  "zh-TW": {
    "options": "選項",
    "count": "數量",
    "length": "長度",
    "alphabetPreset": "字元集預設",
    "customAlphabet": "自訂字元集",
    "customAlphabetPlaceholder": "輸入自訂字元集...",
    "presetUrlSafe": "URL 安全（A-Z、a-z、0-9、-_）",
    "presetAlphanumeric": "字母數字（A-Z、a-z、0-9）",
    "presetLowercase": "小寫（a-z）",
    "presetUppercase": "大寫（A-Z）",
    "presetNumbers": "數字（0-9）",
    "presetHexLowercase": "十六進位（0-9、a-f）",
    "presetHexUppercase": "十六進位（0-9、A-F）",
    "presetCustom": "自訂"
  },
  "zh-HK": {
    "options": "選項",
    "count": "數量",
    "length": "長度",
    "alphabetPreset": "字元集預設",
    "customAlphabet": "自訂字元集",
    "customAlphabetPlaceholder": "輸入自訂字元集...",
    "presetUrlSafe": "URL 安全（A-Z、a-z、0-9、-_）",
    "presetAlphanumeric": "字母數字（A-Z、a-z、0-9）",
    "presetLowercase": "小寫（a-z）",
    "presetUppercase": "大寫（A-Z）",
    "presetNumbers": "數字（0-9）",
    "presetHexLowercase": "十六進位（0-9、a-f）",
    "presetHexUppercase": "十六進位（0-9、A-F）",
    "presetCustom": "自訂"
  },
  "es": {
    "options": "Opciones",
    "count": "Cantidad",
    "length": "Longitud",
    "alphabetPreset": "Preset de alfabeto",
    "customAlphabet": "Alfabeto personalizado",
    "customAlphabetPlaceholder": "Ingrese un alfabeto personalizado...",
    "presetUrlSafe": "Seguro para URL (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alfanumérico (A-Z, a-z, 0-9)",
    "presetLowercase": "Minúsculas (a-z)",
    "presetUppercase": "Mayúsculas (A-Z)",
    "presetNumbers": "Números (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Personalizado"
  },
  "fr": {
    "options": "Options",
    "count": "Nombre",
    "length": "Longueur",
    "alphabetPreset": "Préréglage d'alphabet",
    "customAlphabet": "Alphabet personnalisé",
    "customAlphabetPlaceholder": "Saisissez un alphabet personnalisé...",
    "presetUrlSafe": "Compatible URL (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumérique (A-Z, a-z, 0-9)",
    "presetLowercase": "Minuscules (a-z)",
    "presetUppercase": "Majuscules (A-Z)",
    "presetNumbers": "Nombres (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Personnalisé"
  },
  "de": {
    "options": "Optionen",
    "count": "Anzahl",
    "length": "Länge",
    "alphabetPreset": "Alphabet-Voreinstellung",
    "customAlphabet": "Benutzerdefiniertes Alphabet",
    "customAlphabetPlaceholder": "Benutzerdefiniertes Alphabet eingeben...",
    "presetUrlSafe": "URL-sicher (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumerisch (A-Z, a-z, 0-9)",
    "presetLowercase": "Kleinbuchstaben (a-z)",
    "presetUppercase": "Großbuchstaben (A-Z)",
    "presetNumbers": "Zahlen (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Benutzerdefiniert"
  },
  "it": {
    "options": "Opzioni",
    "count": "Numero",
    "length": "Lunghezza",
    "alphabetPreset": "Preset alfabeto",
    "customAlphabet": "Alfabeto personalizzato",
    "customAlphabetPlaceholder": "Inserisci un alfabeto personalizzato...",
    "presetUrlSafe": "Sicuro per URL (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alfanumerico (A-Z, a-z, 0-9)",
    "presetLowercase": "Minuscolo (a-z)",
    "presetUppercase": "Maiuscolo (A-Z)",
    "presetNumbers": "Numeri (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Personalizzato"
  },
  "ja": {
    "options": "オプション",
    "count": "件数",
    "length": "長さ",
    "alphabetPreset": "文字セットプリセット",
    "customAlphabet": "カスタム文字セット",
    "customAlphabetPlaceholder": "カスタム文字セットを入力...",
    "presetUrlSafe": "URL セーフ (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "英数字 (A-Z, a-z, 0-9)",
    "presetLowercase": "小文字 (a-z)",
    "presetUppercase": "大文字 (A-Z)",
    "presetNumbers": "数字 (0-9)",
    "presetHexLowercase": "16進 (0-9, a-f)",
    "presetHexUppercase": "16進 (0-9, A-F)",
    "presetCustom": "カスタム"
  },
  "ko": {
    "options": "옵션",
    "count": "개수",
    "length": "길이",
    "alphabetPreset": "알파벳 프리셋",
    "customAlphabet": "사용자 지정 알파벳",
    "customAlphabetPlaceholder": "사용자 지정 알파벳 입력...",
    "presetUrlSafe": "URL 안전 (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "영숫자 (A-Z, a-z, 0-9)",
    "presetLowercase": "소문자 (a-z)",
    "presetUppercase": "대문자 (A-Z)",
    "presetNumbers": "숫자 (0-9)",
    "presetHexLowercase": "16진수 (0-9, a-f)",
    "presetHexUppercase": "16진수 (0-9, A-F)",
    "presetCustom": "사용자 지정"
  },
  "ru": {
    "options": "Параметры",
    "count": "Количество",
    "length": "Длина",
    "alphabetPreset": "Набор символов",
    "customAlphabet": "Пользовательский набор",
    "customAlphabetPlaceholder": "Введите пользовательский набор...",
    "presetUrlSafe": "URL-безопасный (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Буквы и цифры (A-Z, a-z, 0-9)",
    "presetLowercase": "Строчные (a-z)",
    "presetUppercase": "Прописные (A-Z)",
    "presetNumbers": "Цифры (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Пользовательский"
  },
  "pt": {
    "options": "Opções",
    "count": "Quantidade",
    "length": "Comprimento",
    "alphabetPreset": "Predefinição de alfabeto",
    "customAlphabet": "Alfabeto personalizado",
    "customAlphabetPlaceholder": "Digite um alfabeto personalizado...",
    "presetUrlSafe": "Seguro para URL (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alfanumérico (A-Z, a-z, 0-9)",
    "presetLowercase": "Minúsculas (a-z)",
    "presetUppercase": "Maiúsculas (A-Z)",
    "presetNumbers": "Números (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Personalizado"
  },
  "ar": {
    "options": "الخيارات",
    "count": "العدد",
    "length": "الطول",
    "alphabetPreset": "إعداد مجموعة الأحرف",
    "customAlphabet": "مجموعة أحرف مخصصة",
    "customAlphabetPlaceholder": "أدخل مجموعة أحرف مخصصة...",
    "presetUrlSafe": "آمن لعنوان URL (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "أبجدي رقمي (A-Z, a-z, 0-9)",
    "presetLowercase": "أحرف صغيرة (a-z)",
    "presetUppercase": "أحرف كبيرة (A-Z)",
    "presetNumbers": "أرقام (0-9)",
    "presetHexLowercase": "سداسي عشري (0-9, a-f)",
    "presetHexUppercase": "سداسي عشري (0-9, A-F)",
    "presetCustom": "مخصص"
  },
  "hi": {
    "options": "विकल्प",
    "count": "संख्या",
    "length": "लंबाई",
    "alphabetPreset": "अक्षर प्रीसेट",
    "customAlphabet": "कस्टम अक्षर",
    "customAlphabetPlaceholder": "कस्टम अक्षर दर्ज करें...",
    "presetUrlSafe": "URL सुरक्षित (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "अल्फ़ान्यूमेरिक (A-Z, a-z, 0-9)",
    "presetLowercase": "लोअरकेस (a-z)",
    "presetUppercase": "अपरकेस (A-Z)",
    "presetNumbers": "संख्याएं (0-9)",
    "presetHexLowercase": "हेक्स (0-9, a-f)",
    "presetHexUppercase": "हेक्स (0-9, A-F)",
    "presetCustom": "कस्टम"
  },
  "tr": {
    "options": "Seçenekler",
    "count": "Adet",
    "length": "Uzunluk",
    "alphabetPreset": "Alfabe ön ayarı",
    "customAlphabet": "Özel alfabe",
    "customAlphabetPlaceholder": "Özel alfabe girin...",
    "presetUrlSafe": "URL güvenli (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alfanümerik (A-Z, a-z, 0-9)",
    "presetLowercase": "Küçük harf (a-z)",
    "presetUppercase": "Büyük harf (A-Z)",
    "presetNumbers": "Sayılar (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Özel"
  },
  "nl": {
    "options": "Opties",
    "count": "Aantal",
    "length": "Lengte",
    "alphabetPreset": "Alfabetvoorinstelling",
    "customAlphabet": "Aangepast alfabet",
    "customAlphabetPlaceholder": "Voer een aangepast alfabet in...",
    "presetUrlSafe": "URL-veilig (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alfanumeriek (A-Z, a-z, 0-9)",
    "presetLowercase": "Kleine letters (a-z)",
    "presetUppercase": "Hoofdletters (A-Z)",
    "presetNumbers": "Cijfers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Aangepast"
  },
  "sv": {
    "options": "Alternativ",
    "count": "Antal",
    "length": "Längd",
    "alphabetPreset": "Alfabetförval",
    "customAlphabet": "Anpassat alfabet",
    "customAlphabetPlaceholder": "Ange anpassat alfabet...",
    "presetUrlSafe": "URL-säker (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alfanumerisk (A-Z, a-z, 0-9)",
    "presetLowercase": "Små bokstäver (a-z)",
    "presetUppercase": "Versaler (A-Z)",
    "presetNumbers": "Siffror (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Anpassad"
  },
  "pl": {
    "options": "Opcje",
    "count": "Liczba",
    "length": "Długość",
    "alphabetPreset": "Preset alfabetu",
    "customAlphabet": "Niestandardowy alfabet",
    "customAlphabetPlaceholder": "Wprowadź niestandardowy alfabet...",
    "presetUrlSafe": "Bezpieczny URL (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alfanumeryczny (A-Z, a-z, 0-9)",
    "presetLowercase": "Małe litery (a-z)",
    "presetUppercase": "Wielkie litery (A-Z)",
    "presetNumbers": "Cyfry (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Niestandardowy"
  },
  "vi": {
    "options": "Tùy chọn",
    "count": "Số lượng",
    "length": "Độ dài",
    "alphabetPreset": "Bộ ký tự đặt trước",
    "customAlphabet": "Bộ ký tự tùy chỉnh",
    "customAlphabetPlaceholder": "Nhập bộ ký tự tùy chỉnh...",
    "presetUrlSafe": "An toàn URL (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Chữ và số (A-Z, a-z, 0-9)",
    "presetLowercase": "Chữ thường (a-z)",
    "presetUppercase": "Chữ hoa (A-Z)",
    "presetNumbers": "Số (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Tùy chỉnh"
  },
  "th": {
    "options": "ตัวเลือก",
    "count": "จำนวน",
    "length": "ความยาว",
    "alphabetPreset": "ชุดอักขระที่ตั้งไว้",
    "customAlphabet": "ชุดอักขระกำหนดเอง",
    "customAlphabetPlaceholder": "ป้อนชุดอักขระกำหนดเอง...",
    "presetUrlSafe": "ปลอดภัยกับ URL (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "ตัวอักษรและตัวเลข (A-Z, a-z, 0-9)",
    "presetLowercase": "ตัวพิมพ์เล็ก (a-z)",
    "presetUppercase": "ตัวพิมพ์ใหญ่ (A-Z)",
    "presetNumbers": "ตัวเลข (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "กำหนดเอง"
  },
  "id": {
    "options": "Opsi",
    "count": "Jumlah",
    "length": "Panjang",
    "alphabetPreset": "Preset alfabet",
    "customAlphabet": "Alfabet khusus",
    "customAlphabetPlaceholder": "Masukkan alfabet khusus...",
    "presetUrlSafe": "Aman untuk URL (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alfanumerik (A-Z, a-z, 0-9)",
    "presetLowercase": "Huruf kecil (a-z)",
    "presetUppercase": "Huruf besar (A-Z)",
    "presetNumbers": "Angka (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Kustom"
  },
  "he": {
    "options": "אפשרויות",
    "count": "כמות",
    "length": "אורך",
    "alphabetPreset": "ערכת אותיות",
    "customAlphabet": "אלפבית מותאם אישית",
    "customAlphabetPlaceholder": "הזן אלפבית מותאם אישית...",
    "presetUrlSafe": "בטוח ל-URL (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "אלפאנומרי (A-Z, a-z, 0-9)",
    "presetLowercase": "אותיות קטנות (a-z)",
    "presetUppercase": "אותיות גדולות (A-Z)",
    "presetNumbers": "מספרים (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "מותאם אישית"
  },
  "ms": {
    "options": "Pilihan",
    "count": "Jumlah",
    "length": "Panjang",
    "alphabetPreset": "Pratetap abjad",
    "customAlphabet": "Abjad tersuai",
    "customAlphabetPlaceholder": "Masukkan abjad tersuai...",
    "presetUrlSafe": "Selamat untuk URL (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alfanumerik (A-Z, a-z, 0-9)",
    "presetLowercase": "Huruf kecil (a-z)",
    "presetUppercase": "Huruf besar (A-Z)",
    "presetNumbers": "Nombor (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Tersuai"
  },
  "no": {
    "options": "Alternativer",
    "count": "Antall",
    "length": "Lengde",
    "alphabetPreset": "Alfabetforvalg",
    "customAlphabet": "Tilpasset alfabet",
    "customAlphabetPlaceholder": "Skriv inn tilpasset alfabet...",
    "presetUrlSafe": "URL-sikker (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alfanumerisk (A-Z, a-z, 0-9)",
    "presetLowercase": "Små bokstaver (a-z)",
    "presetUppercase": "Store bokstaver (A-Z)",
    "presetNumbers": "Tall (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Tilpasset"
  }
}
</i18n>
