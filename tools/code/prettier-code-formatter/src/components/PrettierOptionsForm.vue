<template>
  <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="12" :y-gap="12">
    <n-form-item-gi :label="t('language')" :show-feedback="false">
      <n-select v-model:value="language" :options="languageOptions" size="small" />
    </n-form-item-gi>
    <n-form-item-gi :label="t('print-width')" :show-feedback="false">
      <n-input-number
        v-model:value="printWidth"
        :min="40"
        :max="200"
        size="small"
        style="width: 100%"
      />
    </n-form-item-gi>
    <n-form-item-gi :label="t('tab-width')" :show-feedback="false">
      <n-input-number v-model:value="tabWidth" :min="1" :max="8" size="small" style="width: 100%" />
    </n-form-item-gi>
    <n-form-item-gi :label="t('use-tabs')" :show-feedback="false">
      <n-switch v-model:value="useTabs" />
    </n-form-item-gi>
    <n-form-item-gi v-if="supportsSemi" :label="t('semi')" :show-feedback="false">
      <n-switch v-model:value="semi" />
    </n-form-item-gi>
    <n-form-item-gi v-if="supportsSingleQuote" :label="t('single-quote')" :show-feedback="false">
      <n-switch v-model:value="singleQuote" />
    </n-form-item-gi>
    <n-form-item-gi
      v-if="supportsTrailingComma"
      :label="t('trailing-comma')"
      :show-feedback="false"
    >
      <n-select v-model:value="trailingComma" :options="trailingCommaOptions" size="small" />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInputNumber, NSelect, NSwitch } from 'naive-ui'
import { languageLabels } from '../languages'
import type { LanguageKey } from '../languages'

const props = defineProps<{
  languageKeys: readonly LanguageKey[]
  supportsSemi: boolean
  supportsSingleQuote: boolean
  supportsTrailingComma: boolean
}>()

const language = defineModel<LanguageKey>('language', { required: true })
const printWidth = defineModel<number>('printWidth', { required: true })
const tabWidth = defineModel<number>('tabWidth', { required: true })
const useTabs = defineModel<boolean>('useTabs', { required: true })
const semi = defineModel<boolean>('semi', { required: true })
const singleQuote = defineModel<boolean>('singleQuote', { required: true })
const trailingComma = defineModel<'none' | 'es5' | 'all'>('trailingComma', { required: true })

const { t } = useI18n({ useScope: 'local' })

const languageOptions = computed(() =>
  props.languageKeys.map((key) => ({
    label: languageLabels[key],
    value: key,
  })),
)

const trailingCommaOptions = computed(() => [
  { label: t('trailing-none'), value: 'none' },
  { label: t('trailing-es5'), value: 'es5' },
  { label: t('trailing-all'), value: 'all' },
])
</script>

<i18n lang="json">
{
  "en": {
    "language": "Language",
    "print-width": "Print width",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "semi": "Semicolons",
    "single-quote": "Single quotes",
    "trailing-comma": "Trailing commas",
    "trailing-none": "None",
    "trailing-es5": "ES5",
    "trailing-all": "All"
  },
  "zh": {
    "language": "语言",
    "print-width": "行宽",
    "tab-width": "Tab 宽度",
    "use-tabs": "使用 Tab",
    "semi": "分号",
    "single-quote": "单引号",
    "trailing-comma": "尾随逗号",
    "trailing-none": "无",
    "trailing-es5": "ES5",
    "trailing-all": "全部"
  },
  "zh-CN": {
    "language": "语言",
    "print-width": "行宽",
    "tab-width": "Tab 宽度",
    "use-tabs": "使用 Tab",
    "semi": "分号",
    "single-quote": "单引号",
    "trailing-comma": "尾随逗号",
    "trailing-none": "无",
    "trailing-es5": "ES5",
    "trailing-all": "全部"
  },
  "zh-TW": {
    "language": "語言",
    "print-width": "行寬",
    "tab-width": "Tab 寬度",
    "use-tabs": "使用 Tab",
    "semi": "分號",
    "single-quote": "單引號",
    "trailing-comma": "尾隨逗號",
    "trailing-none": "無",
    "trailing-es5": "ES5",
    "trailing-all": "全部"
  },
  "zh-HK": {
    "language": "語言",
    "print-width": "行寬",
    "tab-width": "Tab 寬度",
    "use-tabs": "使用 Tab",
    "semi": "分號",
    "single-quote": "單引號",
    "trailing-comma": "尾隨逗號",
    "trailing-none": "無",
    "trailing-es5": "ES5",
    "trailing-all": "全部"
  },
  "es": {
    "language": "Idioma",
    "print-width": "Ancho de línea",
    "tab-width": "Ancho de tabulación",
    "use-tabs": "Usar tabulaciones",
    "semi": "Puntos y coma",
    "single-quote": "Comillas simples",
    "trailing-comma": "Comas finales",
    "trailing-none": "Ninguno",
    "trailing-es5": "ES5",
    "trailing-all": "Todo"
  },
  "fr": {
    "language": "Langue",
    "print-width": "Largeur de ligne",
    "tab-width": "Largeur des tabulations",
    "use-tabs": "Utiliser des tabulations",
    "semi": "Points-virgules",
    "single-quote": "Guillemets simples",
    "trailing-comma": "Virgules finales",
    "trailing-none": "Aucune",
    "trailing-es5": "ES5",
    "trailing-all": "Tout"
  },
  "de": {
    "language": "Sprache",
    "print-width": "Zeilenbreite",
    "tab-width": "Tabulatorbreite",
    "use-tabs": "Tabs verwenden",
    "semi": "Semikolons",
    "single-quote": "Einfache Anführungszeichen",
    "trailing-comma": "Nachgestellte Kommas",
    "trailing-none": "Keine",
    "trailing-es5": "ES5",
    "trailing-all": "Alle"
  },
  "it": {
    "language": "Lingua",
    "print-width": "Larghezza riga",
    "tab-width": "Larghezza tab",
    "use-tabs": "Usa tab",
    "semi": "Punto e virgola",
    "single-quote": "Virgolette singole",
    "trailing-comma": "Virgole finali",
    "trailing-none": "Nessuna",
    "trailing-es5": "ES5",
    "trailing-all": "Tutte"
  },
  "ja": {
    "language": "言語",
    "print-width": "行幅",
    "tab-width": "タブ幅",
    "use-tabs": "タブを使用",
    "semi": "セミコロン",
    "single-quote": "シングルクォート",
    "trailing-comma": "末尾カンマ",
    "trailing-none": "なし",
    "trailing-es5": "ES5",
    "trailing-all": "すべて"
  },
  "ko": {
    "language": "언어",
    "print-width": "줄 너비",
    "tab-width": "탭 너비",
    "use-tabs": "탭 사용",
    "semi": "세미콜론",
    "single-quote": "작은따옴표",
    "trailing-comma": "후행 쉼표",
    "trailing-none": "없음",
    "trailing-es5": "ES5",
    "trailing-all": "전체"
  },
  "ru": {
    "language": "Язык",
    "print-width": "Ширина строки",
    "tab-width": "Ширина табуляции",
    "use-tabs": "Использовать табы",
    "semi": "Точки с запятой",
    "single-quote": "Одинарные кавычки",
    "trailing-comma": "Замыкающие запятые",
    "trailing-none": "Нет",
    "trailing-es5": "ES5",
    "trailing-all": "Все"
  },
  "pt": {
    "language": "Idioma",
    "print-width": "Largura da linha",
    "tab-width": "Largura da tabulação",
    "use-tabs": "Usar tabulações",
    "semi": "Ponto e vírgula",
    "single-quote": "Aspas simples",
    "trailing-comma": "Vírgulas finais",
    "trailing-none": "Nenhum",
    "trailing-es5": "ES5",
    "trailing-all": "Todos"
  },
  "ar": {
    "language": "اللغة",
    "print-width": "عرض السطر",
    "tab-width": "عرض علامة التبويب",
    "use-tabs": "استخدام علامات التبويب",
    "semi": "الفواصل المنقوطة",
    "single-quote": "علامات اقتباس مفردة",
    "trailing-comma": "فواصل لاحقة",
    "trailing-none": "بدون",
    "trailing-es5": "ES5",
    "trailing-all": "الكل"
  },
  "hi": {
    "language": "भाषा",
    "print-width": "लाइन चौड़ाई",
    "tab-width": "टैब चौड़ाई",
    "use-tabs": "टैब का उपयोग करें",
    "semi": "सेमिकोलोन",
    "single-quote": "सिंगल कोट्स",
    "trailing-comma": "अंतिम कॉमा",
    "trailing-none": "कोई नहीं",
    "trailing-es5": "ES5",
    "trailing-all": "सब"
  },
  "tr": {
    "language": "Dil",
    "print-width": "Satır genişliği",
    "tab-width": "Sekme genişliği",
    "use-tabs": "Sekme kullan",
    "semi": "Noktalı virgüller",
    "single-quote": "Tek tırnak",
    "trailing-comma": "Sona eklenen virgüller",
    "trailing-none": "Yok",
    "trailing-es5": "ES5",
    "trailing-all": "Tümü"
  },
  "nl": {
    "language": "Taal",
    "print-width": "Regelbreedte",
    "tab-width": "Tabbreedte",
    "use-tabs": "Tabs gebruiken",
    "semi": "Puntkomma's",
    "single-quote": "Enkele aanhalingstekens",
    "trailing-comma": "Afsluitende komma's",
    "trailing-none": "Geen",
    "trailing-es5": "ES5",
    "trailing-all": "Alles"
  },
  "sv": {
    "language": "Språk",
    "print-width": "Radbredd",
    "tab-width": "Tabbredd",
    "use-tabs": "Använd tabbar",
    "semi": "Semikolon",
    "single-quote": "Enkla citattecken",
    "trailing-comma": "Avslutande kommatecken",
    "trailing-none": "Ingen",
    "trailing-es5": "ES5",
    "trailing-all": "Alla"
  },
  "pl": {
    "language": "Język",
    "print-width": "Szerokość linii",
    "tab-width": "Szerokość tabulatora",
    "use-tabs": "Używaj tabów",
    "semi": "Średniki",
    "single-quote": "Cudzysłowy pojedyncze",
    "trailing-comma": "Końcowe przecinki",
    "trailing-none": "Brak",
    "trailing-es5": "ES5",
    "trailing-all": "Wszystkie"
  },
  "vi": {
    "language": "Ngôn ngữ",
    "print-width": "Độ rộng dòng",
    "tab-width": "Độ rộng tab",
    "use-tabs": "Dùng tab",
    "semi": "Dấu chấm phẩy",
    "single-quote": "Dấu nháy đơn",
    "trailing-comma": "Dấu phẩy cuối",
    "trailing-none": "Không",
    "trailing-es5": "ES5",
    "trailing-all": "Tất cả"
  },
  "th": {
    "language": "ภาษา",
    "print-width": "ความกว้างบรรทัด",
    "tab-width": "ความกว้างแท็บ",
    "use-tabs": "ใช้แท็บ",
    "semi": "เซมิโคลอน",
    "single-quote": "เครื่องหมายอัญประกาศเดี่ยว",
    "trailing-comma": "จุลภาคท้าย",
    "trailing-none": "ไม่มี",
    "trailing-es5": "ES5",
    "trailing-all": "ทั้งหมด"
  },
  "id": {
    "language": "Bahasa",
    "print-width": "Lebar baris",
    "tab-width": "Lebar tab",
    "use-tabs": "Gunakan tab",
    "semi": "Titik koma",
    "single-quote": "Tanda kutip tunggal",
    "trailing-comma": "Koma akhir",
    "trailing-none": "Tidak ada",
    "trailing-es5": "ES5",
    "trailing-all": "Semua"
  },
  "he": {
    "language": "שפה",
    "print-width": "רוחב שורה",
    "tab-width": "רוחב טאב",
    "use-tabs": "השתמש בטאבים",
    "semi": "נקודות פסיק",
    "single-quote": "גרשיים בודדים",
    "trailing-comma": "פסיקים סופיים",
    "trailing-none": "ללא",
    "trailing-es5": "ES5",
    "trailing-all": "הכל"
  },
  "ms": {
    "language": "Bahasa",
    "print-width": "Lebar baris",
    "tab-width": "Lebar tab",
    "use-tabs": "Guna tab",
    "semi": "Titik koma",
    "single-quote": "Petik tunggal",
    "trailing-comma": "Koma hujung",
    "trailing-none": "Tiada",
    "trailing-es5": "ES5",
    "trailing-all": "Semua"
  },
  "no": {
    "language": "Språk",
    "print-width": "Linjevidde",
    "tab-width": "Tabbredde",
    "use-tabs": "Bruk tabulatorer",
    "semi": "Semikolon",
    "single-quote": "Enkle anførselstegn",
    "trailing-comma": "Etterfølgende kommaer",
    "trailing-none": "Ingen",
    "trailing-es5": "ES5",
    "trailing-all": "Alle"
  }
}
</i18n>
