<template>
  <div v-show="matchCount" class="results-table">
    <n-text depth="3">{{ t('table-title') }}</n-text>
    <n-data-table :columns="columns" :data="matches" :bordered="false" size="small" />
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDataTable, NText } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { type InvisibleCategory, type InvisibleMatch } from '../utils'

const props = defineProps<{
  matches: InvisibleMatch[]
}>()

const { t } = useI18n()

const matchCount = computed(() => props.matches.length)
const categoryLabels = computed<Record<InvisibleCategory, string>>(() => ({
  'zero-width': t('category.zero-width'),
  'bidi-control': t('category.bidi-control'),
  'space-like': t('category.space-like'),
  format: t('category.format'),
}))

const columns = computed<DataTableColumns<InvisibleMatch>>(() => [
  { title: t('column-index'), key: 'index' },
  { title: t('column-line'), key: 'line' },
  { title: t('column-column'), key: 'column' },
  {
    title: t('column-code'),
    key: 'code',
    render: (row) => h(NText, { code: true }, () => row.code),
  },
  {
    title: t('column-name'),
    key: 'name',
    render: (row) => h(NText, { code: true }, () => row.name),
  },
  {
    title: t('column-category'),
    key: 'category',
    render: (row) => categoryLabels.value[row.category],
  },
  {
    title: t('column-preview'),
    key: 'token',
    render: (row) => h(NText, { code: true }, () => row.token),
  },
])
</script>

<style scoped>
.results-table {
  margin-top: 16px;
  display: grid;
  gap: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "table-title": "Findings",
    "column-index": "Index",
    "column-line": "Line",
    "column-column": "Column",
    "column-code": "Code",
    "column-name": "Name",
    "column-category": "Category",
    "column-preview": "Preview",
    "category.zero-width": "Zero-width",
    "category.bidi-control": "Bidi control",
    "category.space-like": "Special spaces",
    "category.format": "Format controls"
  },
  "zh": {
    "table-title": "发现项",
    "column-index": "索引",
    "column-line": "行",
    "column-column": "列",
    "column-code": "代码",
    "column-name": "名称",
    "column-category": "类别",
    "column-preview": "预览",
    "category.zero-width": "零宽",
    "category.bidi-control": "双向控制",
    "category.space-like": "特殊空格",
    "category.format": "格式控制"
  },
  "zh-CN": {
    "table-title": "发现项",
    "column-index": "索引",
    "column-line": "行",
    "column-column": "列",
    "column-code": "代码",
    "column-name": "名称",
    "column-category": "类别",
    "column-preview": "预览",
    "category.zero-width": "零宽",
    "category.bidi-control": "双向控制",
    "category.space-like": "特殊空格",
    "category.format": "格式控制"
  },
  "zh-TW": {
    "table-title": "發現項目",
    "column-index": "索引",
    "column-line": "行",
    "column-column": "欄",
    "column-code": "碼位",
    "column-name": "名稱",
    "column-category": "類別",
    "column-preview": "預覽",
    "category.zero-width": "零寬",
    "category.bidi-control": "雙向控制",
    "category.space-like": "特殊空白",
    "category.format": "格式控制"
  },
  "zh-HK": {
    "table-title": "發現項目",
    "column-index": "索引",
    "column-line": "行",
    "column-column": "欄",
    "column-code": "碼位",
    "column-name": "名稱",
    "column-category": "類別",
    "column-preview": "預覽",
    "category.zero-width": "零寬",
    "category.bidi-control": "雙向控制",
    "category.space-like": "特殊空白",
    "category.format": "格式控制"
  },
  "es": {
    "table-title": "Hallazgos",
    "column-index": "Índice",
    "column-line": "Línea",
    "column-column": "Columna",
    "column-code": "Código",
    "column-name": "Nombre",
    "column-category": "Categoría",
    "column-preview": "Vista previa",
    "category.zero-width": "Cero ancho",
    "category.bidi-control": "Control bidi",
    "category.space-like": "Espacios especiales",
    "category.format": "Controles de formato"
  },
  "fr": {
    "table-title": "Résultats",
    "column-index": "Index",
    "column-line": "Ligne",
    "column-column": "Colonne",
    "column-code": "Code",
    "column-name": "Nom",
    "column-category": "Catégorie",
    "column-preview": "Aperçu",
    "category.zero-width": "Zéro largeur",
    "category.bidi-control": "Contrôle bidi",
    "category.space-like": "Espaces spéciaux",
    "category.format": "Contrôles de format"
  },
  "de": {
    "table-title": "Funde",
    "column-index": "Index",
    "column-line": "Zeile",
    "column-column": "Spalte",
    "column-code": "Code",
    "column-name": "Name",
    "column-category": "Kategorie",
    "column-preview": "Vorschau",
    "category.zero-width": "Nullbreite",
    "category.bidi-control": "Bidi-Steuerung",
    "category.space-like": "Sonderabstände",
    "category.format": "Formatsteuerzeichen"
  },
  "it": {
    "table-title": "Risultati",
    "column-index": "Indice",
    "column-line": "Riga",
    "column-column": "Colonna",
    "column-code": "Codice",
    "column-name": "Nome",
    "column-category": "Categoria",
    "column-preview": "Anteprima",
    "category.zero-width": "Zero-width",
    "category.bidi-control": "Controllo bidi",
    "category.space-like": "Spazi speciali",
    "category.format": "Controlli di formato"
  },
  "ja": {
    "table-title": "検出結果",
    "column-index": "インデックス",
    "column-line": "行",
    "column-column": "列",
    "column-code": "コード",
    "column-name": "名前",
    "column-category": "カテゴリ",
    "column-preview": "プレビュー",
    "category.zero-width": "ゼロ幅",
    "category.bidi-control": "双方向制御",
    "category.space-like": "特殊スペース",
    "category.format": "書式制御"
  },
  "ko": {
    "table-title": "감지 결과",
    "column-index": "인덱스",
    "column-line": "줄",
    "column-column": "열",
    "column-code": "코드",
    "column-name": "이름",
    "column-category": "카테고리",
    "column-preview": "미리보기",
    "category.zero-width": "제로 폭",
    "category.bidi-control": "양방향 제어",
    "category.space-like": "특수 공백",
    "category.format": "서식 제어"
  },
  "ru": {
    "table-title": "Найдено",
    "column-index": "Индекс",
    "column-line": "Строка",
    "column-column": "Столбец",
    "column-code": "Код",
    "column-name": "Имя",
    "column-category": "Категория",
    "column-preview": "Превью",
    "category.zero-width": "Нулевой ширины",
    "category.bidi-control": "Bidi-контроль",
    "category.space-like": "Специальные пробелы",
    "category.format": "Форматирующие"
  },
  "pt": {
    "table-title": "Achados",
    "column-index": "Índice",
    "column-line": "Linha",
    "column-column": "Coluna",
    "column-code": "Código",
    "column-name": "Nome",
    "column-category": "Categoria",
    "column-preview": "Prévia",
    "category.zero-width": "Largura zero",
    "category.bidi-control": "Controle bidi",
    "category.space-like": "Espaços especiais",
    "category.format": "Controles de formato"
  },
  "ar": {
    "table-title": "الاكتشافات",
    "column-index": "الفهرس",
    "column-line": "السطر",
    "column-column": "العمود",
    "column-code": "الكود",
    "column-name": "الاسم",
    "column-category": "الفئة",
    "column-preview": "معاينة",
    "category.zero-width": "عديم العرض",
    "category.bidi-control": "تحكم ثنائي الاتجاه",
    "category.space-like": "مسافات خاصة",
    "category.format": "عناصر تحكم التنسيق"
  },
  "hi": {
    "table-title": "मिले हुए",
    "column-index": "सूचकांक",
    "column-line": "पंक्ति",
    "column-column": "स्तंभ",
    "column-code": "कोड",
    "column-name": "नाम",
    "column-category": "श्रेणी",
    "column-preview": "पूर्वावलोकन",
    "category.zero-width": "शून्य-चौड़ाई",
    "category.bidi-control": "बिडी नियंत्रण",
    "category.space-like": "विशेष स्पेस",
    "category.format": "फ़ॉर्मैट नियंत्रण"
  },
  "tr": {
    "table-title": "Bulunanlar",
    "column-index": "Dizin",
    "column-line": "Satır",
    "column-column": "Sütun",
    "column-code": "Kod",
    "column-name": "Ad",
    "column-category": "Kategori",
    "column-preview": "Önizleme",
    "category.zero-width": "Sıfır genişlik",
    "category.bidi-control": "Bidi kontrol",
    "category.space-like": "Özel boşluklar",
    "category.format": "Biçim denetimleri"
  },
  "nl": {
    "table-title": "Vondsten",
    "column-index": "Index",
    "column-line": "Regel",
    "column-column": "Kolom",
    "column-code": "Code",
    "column-name": "Naam",
    "column-category": "Categorie",
    "column-preview": "Voorbeeld",
    "category.zero-width": "Nulbreedte",
    "category.bidi-control": "Bidi-besturing",
    "category.space-like": "Speciale spaties",
    "category.format": "Opmaakbesturing"
  },
  "sv": {
    "table-title": "Fynd",
    "column-index": "Index",
    "column-line": "Rad",
    "column-column": "Kolumn",
    "column-code": "Kod",
    "column-name": "Namn",
    "column-category": "Kategori",
    "column-preview": "Förhandsvisning",
    "category.zero-width": "Nollbredd",
    "category.bidi-control": "Bidi-kontroll",
    "category.space-like": "Speciella blanksteg",
    "category.format": "Formatkontroller"
  },
  "pl": {
    "table-title": "Znalezione",
    "column-index": "Indeks",
    "column-line": "Wiersz",
    "column-column": "Kolumna",
    "column-code": "Kod",
    "column-name": "Nazwa",
    "column-category": "Kategoria",
    "column-preview": "Podgląd",
    "category.zero-width": "Zerowa szerokość",
    "category.bidi-control": "Kontrola bidi",
    "category.space-like": "Specjalne spacje",
    "category.format": "Kontrole formatu"
  },
  "vi": {
    "table-title": "Phát hiện",
    "column-index": "Chỉ mục",
    "column-line": "Dòng",
    "column-column": "Cột",
    "column-code": "Mã",
    "column-name": "Tên",
    "column-category": "Danh mục",
    "column-preview": "Xem trước",
    "category.zero-width": "Không độ rộng",
    "category.bidi-control": "Điều khiển bidi",
    "category.space-like": "Khoảng trắng đặc biệt",
    "category.format": "Điều khiển định dạng"
  },
  "th": {
    "table-title": "รายการที่พบ",
    "column-index": "ดัชนี",
    "column-line": "บรรทัด",
    "column-column": "คอลัมน์",
    "column-code": "รหัส",
    "column-name": "ชื่อ",
    "column-category": "หมวดหมู่",
    "column-preview": "ตัวอย่าง",
    "category.zero-width": "กว้างศูนย์",
    "category.bidi-control": "การควบคุมไบดิ",
    "category.space-like": "ช่องว่างพิเศษ",
    "category.format": "การควบคุมรูปแบบ"
  },
  "id": {
    "table-title": "Temuan",
    "column-index": "Indeks",
    "column-line": "Baris",
    "column-column": "Kolom",
    "column-code": "Kode",
    "column-name": "Nama",
    "column-category": "Kategori",
    "column-preview": "Pratinjau",
    "category.zero-width": "Lebar nol",
    "category.bidi-control": "Kontrol bidi",
    "category.space-like": "Spasi khusus",
    "category.format": "Kontrol format"
  },
  "he": {
    "table-title": "ממצאים",
    "column-index": "אינדקס",
    "column-line": "שורה",
    "column-column": "עמודה",
    "column-code": "קוד",
    "column-name": "שם",
    "column-category": "קטגוריה",
    "column-preview": "תצוגה",
    "category.zero-width": "רוחב אפס",
    "category.bidi-control": "בקרת bidi",
    "category.space-like": "רווחים מיוחדים",
    "category.format": "בקרות עיצוב"
  },
  "ms": {
    "table-title": "Dapatan",
    "column-index": "Indeks",
    "column-line": "Baris",
    "column-column": "Lajur",
    "column-code": "Kod",
    "column-name": "Nama",
    "column-category": "Kategori",
    "column-preview": "Pratonton",
    "category.zero-width": "Lebar sifar",
    "category.bidi-control": "Kawalan bidi",
    "category.space-like": "Ruang khas",
    "category.format": "Kawalan format"
  },
  "no": {
    "table-title": "Funn",
    "column-index": "Indeks",
    "column-line": "Linje",
    "column-column": "Kolonne",
    "column-code": "Kode",
    "column-name": "Navn",
    "column-category": "Kategori",
    "column-preview": "Forhåndsvisning",
    "category.zero-width": "Nullbredde",
    "category.bidi-control": "Bidi-kontroll",
    "category.space-like": "Spesielle mellomrom",
    "category.format": "Formateringskontroller"
  }
}
</i18n>
