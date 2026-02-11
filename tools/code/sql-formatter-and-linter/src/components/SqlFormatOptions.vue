<template>
  <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="12" :y-gap="12">
    <n-form-item-gi :label="t('dialect')" :show-feedback="false">
      <n-select v-model:value="dialect" :options="dialectOptions" size="small" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('tab-width')" :show-feedback="false">
      <n-input-number v-model:value="tabWidth" :min="1" :max="8" size="small" style="width: 100%" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('use-tabs')" :show-feedback="false">
      <n-switch v-model:value="useTabs" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('lines-between-queries')" :show-feedback="false">
      <n-input-number
        v-model:value="linesBetweenQueries"
        :min="1"
        :max="5"
        size="small"
        style="width: 100%"
      />
    </n-form-item-gi>

    <n-form-item-gi :label="t('expression-width')" :show-feedback="false">
      <n-input-number
        v-model:value="expressionWidth"
        :min="20"
        :max="200"
        size="small"
        style="width: 100%"
      />
    </n-form-item-gi>

    <n-form-item-gi :label="t('keyword-case')" :show-feedback="false">
      <n-select v-model:value="keywordCase" :options="caseOptions" size="small" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('data-type-case')" :show-feedback="false">
      <n-select v-model:value="dataTypeCase" :options="caseOptions" size="small" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('function-case')" :show-feedback="false">
      <n-select v-model:value="functionCase" :options="caseOptions" size="small" />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInputNumber, NSelect, NSwitch } from 'naive-ui'
import { dialectLabels, sqlDialects } from '../sqlDialects'
import type { SqlDialect } from '../sqlDialects'
import type { SqlCaseStyle } from '../sqlLint'

const dialect = defineModel<SqlDialect>('dialect', { required: true })
const tabWidth = defineModel<number>('tabWidth', { required: true })
const useTabs = defineModel<boolean>('useTabs', { required: true })
const linesBetweenQueries = defineModel<number>('linesBetweenQueries', { required: true })
const expressionWidth = defineModel<number>('expressionWidth', { required: true })
const keywordCase = defineModel<SqlCaseStyle>('keywordCase', { required: true })
const dataTypeCase = defineModel<SqlCaseStyle>('dataTypeCase', { required: true })
const functionCase = defineModel<SqlCaseStyle>('functionCase', { required: true })

const { t } = useI18n({ useScope: 'local' })

const dialectOptions = computed(() =>
  sqlDialects.map((key) => ({
    label: dialectLabels[key],
    value: key,
  })),
)

const caseOptions = computed(() => [
  { label: t('preserve'), value: 'preserve' },
  { label: t('upper'), value: 'upper' },
  { label: t('lower'), value: 'lower' },
])
</script>

<i18n lang="json">
{
  "en": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "zh": {
    "dialect": "SQL 方言",
    "tab-width": "缩进宽度",
    "use-tabs": "使用 Tab 缩进",
    "lines-between-queries": "语句间空行",
    "expression-width": "表达式换行宽度",
    "keyword-case": "关键字大小写",
    "data-type-case": "数据类型大小写",
    "function-case": "函数名大小写",
    "preserve": "保持原样",
    "upper": "大写",
    "lower": "小写"
  },
  "zh-CN": {
    "dialect": "SQL 方言",
    "tab-width": "缩进宽度",
    "use-tabs": "使用 Tab 缩进",
    "lines-between-queries": "语句间空行",
    "expression-width": "表达式换行宽度",
    "keyword-case": "关键字大小写",
    "data-type-case": "数据类型大小写",
    "function-case": "函数名大小写",
    "preserve": "保持原样",
    "upper": "大写",
    "lower": "小写"
  },
  "zh-TW": {
    "dialect": "SQL 方言",
    "tab-width": "縮排寬度",
    "use-tabs": "使用 Tab 縮排",
    "lines-between-queries": "語句間空行",
    "expression-width": "表達式換行寬度",
    "keyword-case": "關鍵字大小寫",
    "data-type-case": "資料型別大小寫",
    "function-case": "函式名稱大小寫",
    "preserve": "保留原樣",
    "upper": "大寫",
    "lower": "小寫"
  },
  "zh-HK": {
    "dialect": "SQL 方言",
    "tab-width": "縮排寬度",
    "use-tabs": "使用 Tab 縮排",
    "lines-between-queries": "語句間空行",
    "expression-width": "表達式換行寬度",
    "keyword-case": "關鍵字大小寫",
    "data-type-case": "資料型別大小寫",
    "function-case": "函式名稱大小寫",
    "preserve": "保留原樣",
    "upper": "大寫",
    "lower": "小寫"
  },
  "es": {
    "dialect": "Dialecto SQL",
    "tab-width": "Ancho de tabulación",
    "use-tabs": "Usar tabulaciones",
    "lines-between-queries": "Líneas entre consultas",
    "expression-width": "Ancho de expresión",
    "keyword-case": "Mayúsculas de palabras clave",
    "data-type-case": "Mayúsculas de tipos de datos",
    "function-case": "Mayúsculas de funciones",
    "preserve": "Conservar",
    "upper": "MAYÚSCULAS",
    "lower": "minúsculas"
  },
  "fr": {
    "dialect": "Dialecte SQL",
    "tab-width": "Largeur de tabulation",
    "use-tabs": "Utiliser des tabulations",
    "lines-between-queries": "Lignes entre les requêtes",
    "expression-width": "Largeur des expressions",
    "keyword-case": "Casse des mots-clés",
    "data-type-case": "Casse des types de données",
    "function-case": "Casse des fonctions",
    "preserve": "Conserver",
    "upper": "MAJUSCULES",
    "lower": "minuscules"
  },
  "de": {
    "dialect": "SQL-Dialekt",
    "tab-width": "Tabulatorbreite",
    "use-tabs": "Tabs verwenden",
    "lines-between-queries": "Leerzeilen zwischen Abfragen",
    "expression-width": "Ausdrucksbreite",
    "keyword-case": "Schlüsselwort-Groß-/Kleinschreibung",
    "data-type-case": "Datentyp-Groß-/Kleinschreibung",
    "function-case": "Funktions-Groß-/Kleinschreibung",
    "preserve": "Beibehalten",
    "upper": "GROSS",
    "lower": "klein"
  },
  "it": {
    "dialect": "Dialetto SQL",
    "tab-width": "Larghezza tab",
    "use-tabs": "Usa tabulazioni",
    "lines-between-queries": "Righe tra query",
    "expression-width": "Larghezza espressione",
    "keyword-case": "Maiuscole/minuscole parole chiave",
    "data-type-case": "Maiuscole/minuscole tipi di dato",
    "function-case": "Maiuscole/minuscole funzioni",
    "preserve": "Mantieni",
    "upper": "MAIUSCOLO",
    "lower": "minuscolo"
  },
  "ja": {
    "dialect": "SQL 方言",
    "tab-width": "インデント幅",
    "use-tabs": "タブを使用",
    "lines-between-queries": "クエリ間の空行",
    "expression-width": "式の折り返し幅",
    "keyword-case": "キーワードの大文字/小文字",
    "data-type-case": "データ型の大文字/小文字",
    "function-case": "関数名の大文字/小文字",
    "preserve": "保持",
    "upper": "大文字",
    "lower": "小文字"
  },
  "ko": {
    "dialect": "SQL 방언",
    "tab-width": "탭 너비",
    "use-tabs": "탭 사용",
    "lines-between-queries": "쿼리 사이 줄 수",
    "expression-width": "표현식 너비",
    "keyword-case": "키워드 대소문자",
    "data-type-case": "데이터 타입 대소문자",
    "function-case": "함수명 대소문자",
    "preserve": "유지",
    "upper": "대문자",
    "lower": "소문자"
  },
  "ru": {
    "dialect": "Диалект SQL",
    "tab-width": "Ширина табуляции",
    "use-tabs": "Использовать табы",
    "lines-between-queries": "Пустые строки между запросами",
    "expression-width": "Ширина выражения",
    "keyword-case": "Регистр ключевых слов",
    "data-type-case": "Регистр типов данных",
    "function-case": "Регистр функций",
    "preserve": "Сохранить",
    "upper": "ВЕРХНИЙ",
    "lower": "нижний"
  },
  "pt": {
    "dialect": "Dialeto SQL",
    "tab-width": "Largura da tabulação",
    "use-tabs": "Usar tabulações",
    "lines-between-queries": "Linhas entre consultas",
    "expression-width": "Largura da expressão",
    "keyword-case": "Caixa das palavras-chave",
    "data-type-case": "Caixa dos tipos de dados",
    "function-case": "Caixa das funções",
    "preserve": "Preservar",
    "upper": "MAIÚSCULAS",
    "lower": "minúsculas"
  },
  "ar": {
    "dialect": "لهجة SQL",
    "tab-width": "عرض علامة الجدولة",
    "use-tabs": "استخدام علامات الجدولة",
    "lines-between-queries": "الأسطر بين الاستعلامات",
    "expression-width": "عرض التعبير",
    "keyword-case": "حالة أحرف الكلمات المفتاحية",
    "data-type-case": "حالة أحرف أنواع البيانات",
    "function-case": "حالة أحرف الدوال",
    "preserve": "الحفاظ",
    "upper": "أحرف كبيرة",
    "lower": "أحرف صغيرة"
  },
  "hi": {
    "dialect": "SQL डाइलेक्ट",
    "tab-width": "टैब चौड़ाई",
    "use-tabs": "टैब का उपयोग करें",
    "lines-between-queries": "क्वेरी के बीच पंक्तियाँ",
    "expression-width": "अभिव्यक्ति चौड़ाई",
    "keyword-case": "कीवर्ड अक्षर रूप",
    "data-type-case": "डेटा प्रकार अक्षर रूप",
    "function-case": "फ़ंक्शन अक्षर रूप",
    "preserve": "यथावत रखें",
    "upper": "बड़े अक्षर",
    "lower": "छोटे अक्षर"
  },
  "tr": {
    "dialect": "SQL lehçesi",
    "tab-width": "Sekme genişliği",
    "use-tabs": "Sekme kullan",
    "lines-between-queries": "Sorgular arası satır",
    "expression-width": "İfade genişliği",
    "keyword-case": "Anahtar kelime harf durumu",
    "data-type-case": "Veri tipi harf durumu",
    "function-case": "Fonksiyon harf durumu",
    "preserve": "Koru",
    "upper": "BÜYÜK",
    "lower": "küçük"
  },
  "nl": {
    "dialect": "SQL-dialect",
    "tab-width": "Tabbreedte",
    "use-tabs": "Tabs gebruiken",
    "lines-between-queries": "Regels tussen query’s",
    "expression-width": "Expressiebreedte",
    "keyword-case": "Hoofdlettergebruik trefwoorden",
    "data-type-case": "Hoofdlettergebruik gegevenstypen",
    "function-case": "Hoofdlettergebruik functies",
    "preserve": "Behouden",
    "upper": "HOOFDLETTERS",
    "lower": "kleine letters"
  },
  "sv": {
    "dialect": "SQL-dialekt",
    "tab-width": "Tabbredd",
    "use-tabs": "Använd tabbar",
    "lines-between-queries": "Rader mellan frågor",
    "expression-width": "Uttrycksbredd",
    "keyword-case": "Versaler/gemener för nyckelord",
    "data-type-case": "Versaler/gemener för datatyper",
    "function-case": "Versaler/gemener för funktioner",
    "preserve": "Bevara",
    "upper": "VERSALER",
    "lower": "gemener"
  },
  "pl": {
    "dialect": "Dialekt SQL",
    "tab-width": "Szerokość tabulatora",
    "use-tabs": "Użyj tabulatorów",
    "lines-between-queries": "Linie między zapytaniami",
    "expression-width": "Szerokość wyrażenia",
    "keyword-case": "Wielkość liter słów kluczowych",
    "data-type-case": "Wielkość liter typów danych",
    "function-case": "Wielkość liter funkcji",
    "preserve": "Zachowaj",
    "upper": "WIELKIE",
    "lower": "małe"
  },
  "vi": {
    "dialect": "Phương ngữ SQL",
    "tab-width": "Độ rộng tab",
    "use-tabs": "Dùng tab",
    "lines-between-queries": "Số dòng giữa các truy vấn",
    "expression-width": "Độ rộng biểu thức",
    "keyword-case": "Kiểu chữ khóa",
    "data-type-case": "Kiểu chữ kiểu dữ liệu",
    "function-case": "Kiểu chữ hàm",
    "preserve": "Giữ nguyên",
    "upper": "CHỮ HOA",
    "lower": "chữ thường"
  },
  "th": {
    "dialect": "ไวยากรณ์ SQL",
    "tab-width": "ความกว้างแท็บ",
    "use-tabs": "ใช้แท็บ",
    "lines-between-queries": "จำนวนบรรทัดระหว่างคิวรี",
    "expression-width": "ความกว้างนิพจน์",
    "keyword-case": "ตัวพิมพ์ของคีย์เวิร์ด",
    "data-type-case": "ตัวพิมพ์ของชนิดข้อมูล",
    "function-case": "ตัวพิมพ์ของฟังก์ชัน",
    "preserve": "คงเดิม",
    "upper": "ตัวพิมพ์ใหญ่",
    "lower": "ตัวพิมพ์เล็ก"
  },
  "id": {
    "dialect": "Dialek SQL",
    "tab-width": "Lebar tab",
    "use-tabs": "Gunakan tab",
    "lines-between-queries": "Baris antar kueri",
    "expression-width": "Lebar ekspresi",
    "keyword-case": "Huruf besar/kecil kata kunci",
    "data-type-case": "Huruf besar/kecil tipe data",
    "function-case": "Huruf besar/kecil fungsi",
    "preserve": "Pertahankan",
    "upper": "HURUF BESAR",
    "lower": "huruf kecil"
  },
  "he": {
    "dialect": "ניב SQL",
    "tab-width": "רוחב טאב",
    "use-tabs": "שימוש בטאבים",
    "lines-between-queries": "שורות בין שאילתות",
    "expression-width": "רוחב ביטוי",
    "keyword-case": "אותיות גדולות/קטנות של מילות מפתח",
    "data-type-case": "אותיות גדולות/קטנות של סוגי נתונים",
    "function-case": "אותיות גדולות/קטנות של פונקציות",
    "preserve": "שמור",
    "upper": "אותיות גדולות",
    "lower": "אותיות קטנות"
  },
  "ms": {
    "dialect": "Dialek SQL",
    "tab-width": "Lebar tab",
    "use-tabs": "Guna tab",
    "lines-between-queries": "Baris antara kueri",
    "expression-width": "Lebar ungkapan",
    "keyword-case": "Huruf besar/kecil kata kunci",
    "data-type-case": "Huruf besar/kecil jenis data",
    "function-case": "Huruf besar/kecil fungsi",
    "preserve": "Kekalkan",
    "upper": "HURUF BESAR",
    "lower": "huruf kecil"
  },
  "no": {
    "dialect": "SQL-dialekt",
    "tab-width": "Tab-bredde",
    "use-tabs": "Bruk tabulatorer",
    "lines-between-queries": "Linjer mellom spørringer",
    "expression-width": "Uttrykksbredde",
    "keyword-case": "Store/små bokstaver for nøkkelord",
    "data-type-case": "Store/små bokstaver for datatyper",
    "function-case": "Store/små bokstaver for funksjoner",
    "preserve": "Bevar",
    "upper": "STORE",
    "lower": "små"
  }
}
</i18n>
