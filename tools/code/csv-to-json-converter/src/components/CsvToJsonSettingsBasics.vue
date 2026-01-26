<template>
  <n-grid cols="1 s:2 m:3 l:4" responsive="screen" :x-gap="20" :y-gap="16">
    <n-form-item-gi :label="t('opt-noheader')">
      <n-switch v-model:value="noheader" size="small" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-headers')">
      <n-input v-model:value="headersText" size="small" :placeholder="t('opt-headers-ph')" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-delimiter')">
      <n-input v-model:value="delimiter" size="small" placeholder="," />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-quote')">
      <n-input v-model:value="quote" size="small" :placeholder="quotePlaceholder" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-trim')">
      <n-switch v-model:value="trim" size="small" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-checkType')">
      <n-switch v-model:value="checkType" size="small" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-skipEmptyLines')">
      <n-select
        v-model:value="skipEmpty"
        size="small"
        :options="[
          { label: t('opt-skipEmptyLines-none'), value: 'none' },
          { label: t('opt-skipEmptyLines-true'), value: 'true' },
          { label: t('opt-skipEmptyLines-greedy'), value: 'greedy' },
        ]"
      />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-escapeChar')">
      <n-input v-model:value="escapeChar" size="small" :placeholder="quotePlaceholder" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-newline')">
      <n-input v-model:value="newline" size="small" placeholder="auto" />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInput, NSelect, NSwitch } from 'naive-ui'

type SkipEmptyMode = 'none' | 'true' | 'greedy'

type NewlineOption = '\n' | '\r' | '\r\n'

const noheader = defineModel<boolean>('noheader', { required: true })
const headersText = defineModel<string>('headersText', { required: true })
const delimiter = defineModel<string>('delimiter', { required: true })
const quote = defineModel<string>('quote', { required: true })
const trim = defineModel<boolean>('trim', { required: true })
const checkType = defineModel<boolean>('checkType', { required: true })
const skipEmpty = defineModel<SkipEmptyMode>('skipEmpty', { required: true })
const escapeChar = defineModel<string>('escapeChar', { required: true })
const newline = defineModel<NewlineOption | ''>('newline', { required: true })

const quotePlaceholder = '"'

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "opt-noheader": "No header row",
    "opt-headers": "Headers",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Delimiter",
    "opt-quote": "Quote",
    "opt-trim": "Trim",
    "opt-checkType": "Check types",
    "opt-skipEmptyLines": "Skip empty lines",
    "opt-skipEmptyLines-none": "Don't skip",
    "opt-skipEmptyLines-true": "Skip empty",
    "opt-skipEmptyLines-greedy": "Skip greedy",
    "opt-escapeChar": "Escape char",
    "opt-newline": "Newline"
  },
  "zh": {
    "opt-noheader": "无表头",
    "opt-headers": "表头",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "分隔符",
    "opt-quote": "引号",
    "opt-trim": "裁剪",
    "opt-checkType": "检查类型",
    "opt-skipEmptyLines": "跳过空行",
    "opt-skipEmptyLines-none": "不跳过",
    "opt-skipEmptyLines-true": "跳过空行",
    "opt-skipEmptyLines-greedy": "贪婪跳过",
    "opt-escapeChar": "转义字符",
    "opt-newline": "换行符"
  },
  "zh-CN": {
    "opt-noheader": "无表头",
    "opt-headers": "表头",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "分隔符",
    "opt-quote": "引号",
    "opt-trim": "裁剪",
    "opt-checkType": "检查类型",
    "opt-skipEmptyLines": "跳过空行",
    "opt-skipEmptyLines-none": "不跳过",
    "opt-skipEmptyLines-true": "跳过空行",
    "opt-skipEmptyLines-greedy": "贪婪跳过",
    "opt-escapeChar": "转义字符",
    "opt-newline": "换行符"
  },
  "zh-TW": {
    "opt-noheader": "無表頭",
    "opt-headers": "表頭",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "分隔符號",
    "opt-quote": "引號",
    "opt-trim": "裁剪",
    "opt-checkType": "檢查型別",
    "opt-skipEmptyLines": "跳過空行",
    "opt-skipEmptyLines-none": "不跳過",
    "opt-skipEmptyLines-true": "跳過空行",
    "opt-skipEmptyLines-greedy": "貪婪跳過",
    "opt-escapeChar": "轉義字元",
    "opt-newline": "換行符號"
  },
  "zh-HK": {
    "opt-noheader": "無表頭",
    "opt-headers": "表頭",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "分隔符號",
    "opt-quote": "引號",
    "opt-trim": "裁剪",
    "opt-checkType": "檢查類型",
    "opt-skipEmptyLines": "跳過空行",
    "opt-skipEmptyLines-none": "不跳過",
    "opt-skipEmptyLines-true": "跳過空行",
    "opt-skipEmptyLines-greedy": "貪婪跳過",
    "opt-escapeChar": "轉義字元",
    "opt-newline": "換行符號"
  },
  "es": {
    "opt-noheader": "Sin encabezado",
    "opt-headers": "Encabezados",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Delimitador",
    "opt-quote": "Comillas",
    "opt-trim": "Recortar",
    "opt-checkType": "Verificar tipos",
    "opt-skipEmptyLines": "Omitir líneas vacías",
    "opt-skipEmptyLines-none": "No omitir",
    "opt-skipEmptyLines-true": "Omitir vacías",
    "opt-skipEmptyLines-greedy": "Omitir codiciosas",
    "opt-escapeChar": "Carácter de escape",
    "opt-newline": "Nueva línea"
  },
  "fr": {
    "opt-noheader": "Sans en-tête",
    "opt-headers": "En-têtes",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Délimiteur",
    "opt-quote": "Guillemet",
    "opt-trim": "Rogner",
    "opt-checkType": "Vérifier les types",
    "opt-skipEmptyLines": "Ignorer lignes vides",
    "opt-skipEmptyLines-none": "Ne pas ignorer",
    "opt-skipEmptyLines-true": "Ignorer vides",
    "opt-skipEmptyLines-greedy": "Ignorer glouton",
    "opt-escapeChar": "Caractère d'échappement",
    "opt-newline": "Nouvelle ligne"
  },
  "de": {
    "opt-noheader": "Keine Kopfzeile",
    "opt-headers": "Kopfzeilen",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Trennzeichen",
    "opt-quote": "Anführungszeichen",
    "opt-trim": "Trimmen",
    "opt-checkType": "Typen prüfen",
    "opt-skipEmptyLines": "Leere Zeilen überspringen",
    "opt-skipEmptyLines-none": "Nicht überspringen",
    "opt-skipEmptyLines-true": "Leere überspringen",
    "opt-skipEmptyLines-greedy": "Gierig überspringen",
    "opt-escapeChar": "Escape-Zeichen",
    "opt-newline": "Zeilenumbruch"
  },
  "it": {
    "opt-noheader": "Senza intestazione",
    "opt-headers": "Intestazioni",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Delimitatore",
    "opt-quote": "Virgolette",
    "opt-trim": "Taglia",
    "opt-checkType": "Controlla tipi",
    "opt-skipEmptyLines": "Salta righe vuote",
    "opt-skipEmptyLines-none": "Non saltare",
    "opt-skipEmptyLines-true": "Salta vuote",
    "opt-skipEmptyLines-greedy": "Salta avido",
    "opt-escapeChar": "Carattere di escape",
    "opt-newline": "Nuova riga"
  },
  "ja": {
    "opt-noheader": "ヘッダーなし",
    "opt-headers": "ヘッダー",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "区切り",
    "opt-quote": "引用符",
    "opt-trim": "トリム",
    "opt-checkType": "型をチェック",
    "opt-skipEmptyLines": "空行をスキップ",
    "opt-skipEmptyLines-none": "スキップしない",
    "opt-skipEmptyLines-true": "空行をスキップ",
    "opt-skipEmptyLines-greedy": "貪欲にスキップ",
    "opt-escapeChar": "エスケープ文字",
    "opt-newline": "改行"
  },
  "ko": {
    "opt-noheader": "헤더 없음",
    "opt-headers": "헤더",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "구분자",
    "opt-quote": "인용부호",
    "opt-trim": "트림",
    "opt-checkType": "타입 확인",
    "opt-skipEmptyLines": "빈 줄 건너뛰기",
    "opt-skipEmptyLines-none": "건너뛰지 않음",
    "opt-skipEmptyLines-true": "빈 줄 건너뛰기",
    "opt-skipEmptyLines-greedy": "탐욕적 건너뛰기",
    "opt-escapeChar": "이스케이프 문자",
    "opt-newline": "개행"
  },
  "ru": {
    "opt-noheader": "Без заголовка",
    "opt-headers": "Заголовки",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Разделитель",
    "opt-quote": "Кавычка",
    "opt-trim": "Обрезать",
    "opt-checkType": "Проверка типов",
    "opt-skipEmptyLines": "Пропускать пустые строки",
    "opt-skipEmptyLines-none": "Не пропускать",
    "opt-skipEmptyLines-true": "Пропускать пустые",
    "opt-skipEmptyLines-greedy": "Жадно пропускать",
    "opt-escapeChar": "Символ экранирования",
    "opt-newline": "Новая строка"
  },
  "pt": {
    "opt-noheader": "Sem cabeçalho",
    "opt-headers": "Cabeçalhos",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Delimitador",
    "opt-quote": "Aspas",
    "opt-trim": "Aparar",
    "opt-checkType": "Verificar tipos",
    "opt-skipEmptyLines": "Pular linhas vazias",
    "opt-skipEmptyLines-none": "Não pular",
    "opt-skipEmptyLines-true": "Pular vazias",
    "opt-skipEmptyLines-greedy": "Pular ganancioso",
    "opt-escapeChar": "Caractere de escape",
    "opt-newline": "Nova linha"
  },
  "ar": {
    "opt-noheader": "بدون ترويسة",
    "opt-headers": "الترويسات",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "الفاصل",
    "opt-quote": "علامة الاقتباس",
    "opt-trim": "تشذيب",
    "opt-checkType": "تحقق من الأنواع",
    "opt-skipEmptyLines": "تخطي الأسطر الفارغة",
    "opt-skipEmptyLines-none": "عدم التخطي",
    "opt-skipEmptyLines-true": "تخطي الفارغة",
    "opt-skipEmptyLines-greedy": "تخطي جشع",
    "opt-escapeChar": "رمز الهروب",
    "opt-newline": "سطر جديد"
  },
  "hi": {
    "opt-noheader": "हेडर नहीं",
    "opt-headers": "हेडर",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "विभाजक",
    "opt-quote": "उद्धरण",
    "opt-trim": "ट्रिम",
    "opt-checkType": "टाइप जाँचें",
    "opt-skipEmptyLines": "खाली पंक्तियाँ छोड़ें",
    "opt-skipEmptyLines-none": "न छोड़ें",
    "opt-skipEmptyLines-true": "खाली छोड़ें",
    "opt-skipEmptyLines-greedy": "लालची छोड़ें",
    "opt-escapeChar": "एस्केप चरित्र",
    "opt-newline": "नई पंक्ति"
  },
  "tr": {
    "opt-noheader": "Başlıksız",
    "opt-headers": "Başlıklar",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Ayırıcı",
    "opt-quote": "Tırnak",
    "opt-trim": "Kırp",
    "opt-checkType": "Türleri kontrol et",
    "opt-skipEmptyLines": "Boş satırları atla",
    "opt-skipEmptyLines-none": "Atlama",
    "opt-skipEmptyLines-true": "Boşları atla",
    "opt-skipEmptyLines-greedy": "Açgözlü atla",
    "opt-escapeChar": "Kaçış karakteri",
    "opt-newline": "Yeni satır"
  },
  "nl": {
    "opt-noheader": "Geen kop",
    "opt-headers": "Koppen",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Scheidingsteken",
    "opt-quote": "Aanhalingsteken",
    "opt-trim": "Trimmen",
    "opt-checkType": "Typen controleren",
    "opt-skipEmptyLines": "Lege regels overslaan",
    "opt-skipEmptyLines-none": "Niet overslaan",
    "opt-skipEmptyLines-true": "Lege overslaan",
    "opt-skipEmptyLines-greedy": "Gulzig overslaan",
    "opt-escapeChar": "Escape-teken",
    "opt-newline": "Nieuwe regel"
  },
  "sv": {
    "opt-noheader": "Ingen rubrik",
    "opt-headers": "Rubriker",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Avgränsare",
    "opt-quote": "Citattecken",
    "opt-trim": "Trimma",
    "opt-checkType": "Kontrollera typer",
    "opt-skipEmptyLines": "Hoppa över tomma rader",
    "opt-skipEmptyLines-none": "Hoppa inte över",
    "opt-skipEmptyLines-true": "Hoppa över tomma",
    "opt-skipEmptyLines-greedy": "Girigt hoppa över",
    "opt-escapeChar": "Escape-tecken",
    "opt-newline": "Ny rad"
  },
  "pl": {
    "opt-noheader": "Brak nagłówka",
    "opt-headers": "Nagłówki",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Separator",
    "opt-quote": "Cudzysłów",
    "opt-trim": "Przytnij",
    "opt-checkType": "Sprawdzaj typy",
    "opt-skipEmptyLines": "Pomiń puste wiersze",
    "opt-skipEmptyLines-none": "Nie pomijaj",
    "opt-skipEmptyLines-true": "Pomiń puste",
    "opt-skipEmptyLines-greedy": "Chciwie pomiń",
    "opt-escapeChar": "Znak ucieczki",
    "opt-newline": "Nowa linia"
  },
  "vi": {
    "opt-noheader": "Không có tiêu đề",
    "opt-headers": "Tiêu đề",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Dấu phân cách",
    "opt-quote": "Dấu ngoặc kép",
    "opt-trim": "Cắt gọn",
    "opt-checkType": "Kiểm tra kiểu",
    "opt-skipEmptyLines": "Bỏ qua dòng trống",
    "opt-skipEmptyLines-none": "Không bỏ qua",
    "opt-skipEmptyLines-true": "Bỏ qua trống",
    "opt-skipEmptyLines-greedy": "Bỏ qua tham lam",
    "opt-escapeChar": "Ký tự thoát",
    "opt-newline": "Dòng mới"
  },
  "th": {
    "opt-noheader": "ไม่มีส่วนหัว",
    "opt-headers": "ส่วนหัว",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "ตัวคั่น",
    "opt-quote": "อัญประกาศ",
    "opt-trim": "ตัดแต่ง",
    "opt-checkType": "ตรวจสอบชนิด",
    "opt-skipEmptyLines": "ข้ามบรรทัดว่าง",
    "opt-skipEmptyLines-none": "ไม่ข้าม",
    "opt-skipEmptyLines-true": "ข้ามว่าง",
    "opt-skipEmptyLines-greedy": "ข้ามโลภ",
    "opt-escapeChar": "ตัวอักษรหลบหนี",
    "opt-newline": "บรรทัดใหม่"
  },
  "id": {
    "opt-noheader": "Tanpa header",
    "opt-headers": "Header",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Pemisah",
    "opt-quote": "Tanda kutip",
    "opt-trim": "Pangkas",
    "opt-checkType": "Periksa tipe",
    "opt-skipEmptyLines": "Lewati baris kosong",
    "opt-skipEmptyLines-none": "Jangan lewati",
    "opt-skipEmptyLines-true": "Lewati kosong",
    "opt-skipEmptyLines-greedy": "Lewati rakus",
    "opt-escapeChar": "Karakter escape",
    "opt-newline": "Baris baru"
  },
  "he": {
    "opt-noheader": "ללא כותרת",
    "opt-headers": "כותרות",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "מפריד",
    "opt-quote": "גרשיים",
    "opt-trim": "חיתוך",
    "opt-checkType": "בדיקת סוגים",
    "opt-skipEmptyLines": "דלג על שורות ריקות",
    "opt-skipEmptyLines-none": "אל תדלג",
    "opt-skipEmptyLines-true": "דלג על ריקות",
    "opt-skipEmptyLines-greedy": "דלג חמדני",
    "opt-escapeChar": "תו בריחה",
    "opt-newline": "שורה חדשה"
  },
  "ms": {
    "opt-noheader": "Tiada pengepala",
    "opt-headers": "Pengepala",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Pemisah",
    "opt-quote": "Petikan",
    "opt-trim": "Potong",
    "opt-checkType": "Periksa jenis",
    "opt-skipEmptyLines": "Langkau baris kosong",
    "opt-skipEmptyLines-none": "Jangan langkau",
    "opt-skipEmptyLines-true": "Langkau kosong",
    "opt-skipEmptyLines-greedy": "Langkau tamak",
    "opt-escapeChar": "Aksara pelarian",
    "opt-newline": "Baris baru"
  },
  "no": {
    "opt-noheader": "Ingen overskrift",
    "opt-headers": "Overskrifter",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Skilletegn",
    "opt-quote": "Anførselstegn",
    "opt-trim": "Trim",
    "opt-checkType": "Sjekk typer",
    "opt-skipEmptyLines": "Hopp over tomme linjer",
    "opt-skipEmptyLines-none": "Ikke hopp over",
    "opt-skipEmptyLines-true": "Hopp over tomme",
    "opt-skipEmptyLines-greedy": "Grådig hopp over",
    "opt-escapeChar": "Escape-tegn",
    "opt-newline": "Ny linje"
  }
}
</i18n>
