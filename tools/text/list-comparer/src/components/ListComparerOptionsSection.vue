<template>
  <ToolSectionHeader>{{ t('optionsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
      <n-form-item-gi :label="t('delimiterLabel')" :show-feedback="false">
        <n-flex vertical :size="8">
          <n-select v-model:value="delimiterMode" :options="delimiterOptions" />
          <n-input
            v-if="delimiterMode === 'custom'"
            v-model:value="customDelimiter"
            :placeholder="DEFAULT_CUSTOM_DELIMITER"
          />
        </n-flex>
      </n-form-item-gi>

      <n-form-item-gi :label="t('customDelimiterLabel')" :show-feedback="false">
        <n-flex vertical :size="8">
          <n-checkbox v-model:checked="trimItems">{{ t('trimItems') }}</n-checkbox>
          <n-checkbox v-model:checked="ignoreCase">{{ t('ignoreCase') }}</n-checkbox>
          <n-checkbox v-model:checked="omitEmptyItems">{{ t('omitEmptyItems') }}</n-checkbox>
          <n-checkbox v-model:checked="sortResults">{{ t('sortResults') }}</n-checkbox>
        </n-flex>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCheckbox, NFlex, NFormItemGi, NGrid, NInput, NSelect } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { DEFAULT_CUSTOM_DELIMITER, type DelimiterMode } from '../utils/listComparer'

const delimiterMode = defineModel<DelimiterMode>('delimiterMode', { required: true })
const customDelimiter = defineModel<string>('customDelimiter', { required: true })
const trimItems = defineModel<boolean>('trimItems', { required: true })
const ignoreCase = defineModel<boolean>('ignoreCase', { required: true })
const omitEmptyItems = defineModel<boolean>('omitEmptyItems', { required: true })
const sortResults = defineModel<boolean>('sortResults', { required: true })

const { t } = useI18n()

const delimiterOptions = computed(() => [
  { label: t('delimiterNewline'), value: 'newline' },
  { label: t('delimiterComma'), value: 'comma' },
  { label: t('delimiterTab'), value: 'tab' },
  { label: t('delimiterCustom'), value: 'custom' },
])
</script>

<i18n lang="json">
{
  "en": {
    "optionsTitle": "Comparison Options",
    "delimiterLabel": "Input delimiter",
    "delimiterNewline": "New line",
    "delimiterComma": "Comma",
    "delimiterTab": "Tab",
    "delimiterCustom": "Custom",
    "customDelimiterLabel": "Processing",
    "trimItems": "Trim each item",
    "ignoreCase": "Ignore case",
    "omitEmptyItems": "Omit empty items",
    "sortResults": "Sort result sets"
  },
  "zh": {
    "optionsTitle": "比较选项",
    "delimiterLabel": "输入分隔符",
    "delimiterNewline": "换行",
    "delimiterComma": "逗号",
    "delimiterTab": "Tab",
    "delimiterCustom": "自定义",
    "customDelimiterLabel": "处理方式",
    "trimItems": "去除每项首尾空白",
    "ignoreCase": "忽略大小写",
    "omitEmptyItems": "忽略空项",
    "sortResults": "排序结果集"
  },
  "zh-CN": {
    "optionsTitle": "比较选项",
    "delimiterLabel": "输入分隔符",
    "delimiterNewline": "换行",
    "delimiterComma": "逗号",
    "delimiterTab": "Tab",
    "delimiterCustom": "自定义",
    "customDelimiterLabel": "处理方式",
    "trimItems": "去除每项首尾空白",
    "ignoreCase": "忽略大小写",
    "omitEmptyItems": "忽略空项",
    "sortResults": "排序结果集"
  },
  "zh-TW": {
    "optionsTitle": "比較選項",
    "delimiterLabel": "輸入分隔符",
    "delimiterNewline": "換行",
    "delimiterComma": "逗號",
    "delimiterTab": "Tab",
    "delimiterCustom": "自訂",
    "customDelimiterLabel": "處理方式",
    "trimItems": "移除每項前後空白",
    "ignoreCase": "忽略大小寫",
    "omitEmptyItems": "忽略空項",
    "sortResults": "排序結果集"
  },
  "zh-HK": {
    "optionsTitle": "比較選項",
    "delimiterLabel": "輸入分隔符",
    "delimiterNewline": "換行",
    "delimiterComma": "逗號",
    "delimiterTab": "Tab",
    "delimiterCustom": "自訂",
    "customDelimiterLabel": "處理方式",
    "trimItems": "移除每項前後空白",
    "ignoreCase": "忽略大小寫",
    "omitEmptyItems": "忽略空項",
    "sortResults": "排序結果集"
  },
  "es": {
    "optionsTitle": "Opciones de comparacion",
    "delimiterLabel": "Delimitador de entrada",
    "delimiterNewline": "Nueva linea",
    "delimiterComma": "Coma",
    "delimiterTab": "Tabulacion",
    "delimiterCustom": "Personalizado",
    "customDelimiterLabel": "Procesamiento",
    "trimItems": "Recortar cada elemento",
    "ignoreCase": "Ignorar mayusculas",
    "omitEmptyItems": "Omitir elementos vacios",
    "sortResults": "Ordenar resultados"
  },
  "fr": {
    "optionsTitle": "Options de comparaison",
    "delimiterLabel": "Separateur d'entree",
    "delimiterNewline": "Nouvelle ligne",
    "delimiterComma": "Virgule",
    "delimiterTab": "Tabulation",
    "delimiterCustom": "Personnalise",
    "customDelimiterLabel": "Traitement",
    "trimItems": "Supprimer les espaces autour",
    "ignoreCase": "Ignorer la casse",
    "omitEmptyItems": "Ignorer les elements vides",
    "sortResults": "Trier les resultats"
  },
  "de": {
    "optionsTitle": "Vergleichsoptionen",
    "delimiterLabel": "Eingabetrenner",
    "delimiterNewline": "Neue Zeile",
    "delimiterComma": "Komma",
    "delimiterTab": "Tab",
    "delimiterCustom": "Benutzerdefiniert",
    "customDelimiterLabel": "Verarbeitung",
    "trimItems": "Jeden Eintrag trimmen",
    "ignoreCase": "Gross-/Kleinschreibung ignorieren",
    "omitEmptyItems": "Leere Eintrage auslassen",
    "sortResults": "Ergebnisse sortieren"
  },
  "it": {
    "optionsTitle": "Opzioni di confronto",
    "delimiterLabel": "Delimitatore di input",
    "delimiterNewline": "Nuova riga",
    "delimiterComma": "Virgola",
    "delimiterTab": "Tab",
    "delimiterCustom": "Personalizzato",
    "customDelimiterLabel": "Elaborazione",
    "trimItems": "Rifila ogni elemento",
    "ignoreCase": "Ignora maiuscole/minuscole",
    "omitEmptyItems": "Ometti elementi vuoti",
    "sortResults": "Ordina i risultati"
  },
  "ja": {
    "optionsTitle": "比較オプション",
    "delimiterLabel": "入力区切り文字",
    "delimiterNewline": "改行",
    "delimiterComma": "カンマ",
    "delimiterTab": "タブ",
    "delimiterCustom": "カスタム",
    "customDelimiterLabel": "処理",
    "trimItems": "各項目をトリム",
    "ignoreCase": "大文字と小文字を無視",
    "omitEmptyItems": "空の項目を除外",
    "sortResults": "結果を並び替え"
  },
  "ko": {
    "optionsTitle": "비교 옵션",
    "delimiterLabel": "입력 구분자",
    "delimiterNewline": "줄바꿈",
    "delimiterComma": "쉼표",
    "delimiterTab": "탭",
    "delimiterCustom": "사용자 지정",
    "customDelimiterLabel": "처리",
    "trimItems": "각 항목 공백 제거",
    "ignoreCase": "대소문자 무시",
    "omitEmptyItems": "빈 항목 제외",
    "sortResults": "결과 정렬"
  },
  "ru": {
    "optionsTitle": "Параметры сравнения",
    "delimiterLabel": "Разделитель ввода",
    "delimiterNewline": "Новая строка",
    "delimiterComma": "Запятая",
    "delimiterTab": "Табуляция",
    "delimiterCustom": "Свой",
    "customDelimiterLabel": "Обработка",
    "trimItems": "Обрезать пробелы у элементов",
    "ignoreCase": "Игнорировать регистр",
    "omitEmptyItems": "Пропускать пустые элементы",
    "sortResults": "Сортировать результаты"
  },
  "pt": {
    "optionsTitle": "Opcoes de comparacao",
    "delimiterLabel": "Delimitador de entrada",
    "delimiterNewline": "Nova linha",
    "delimiterComma": "Virgula",
    "delimiterTab": "Tab",
    "delimiterCustom": "Personalizado",
    "customDelimiterLabel": "Processamento",
    "trimItems": "Remover espacos de cada item",
    "ignoreCase": "Ignorar maiusculas",
    "omitEmptyItems": "Omitir itens vazios",
    "sortResults": "Ordenar resultados"
  },
  "ar": {
    "optionsTitle": "خيارات المقارنة",
    "delimiterLabel": "فاصل الإدخال",
    "delimiterNewline": "سطر جديد",
    "delimiterComma": "فاصلة",
    "delimiterTab": "تبويب",
    "delimiterCustom": "مخصص",
    "customDelimiterLabel": "المعالجة",
    "trimItems": "إزالة الفراغات حول كل عنصر",
    "ignoreCase": "تجاهل حالة الأحرف",
    "omitEmptyItems": "تجاهل العناصر الفارغة",
    "sortResults": "ترتيب النتائج"
  },
  "hi": {
    "optionsTitle": "तुलना विकल्प",
    "delimiterLabel": "इनपुट विभाजक",
    "delimiterNewline": "नई पंक्ति",
    "delimiterComma": "अल्पविराम",
    "delimiterTab": "टैब",
    "delimiterCustom": "कस्टम",
    "customDelimiterLabel": "प्रसंस्करण",
    "trimItems": "हर आइटम का खाली स्थान हटाएं",
    "ignoreCase": "अपर/लोअर केस अनदेखा करें",
    "omitEmptyItems": "खाली आइटम हटाएं",
    "sortResults": "परिणाम क्रमबद्ध करें"
  },
  "tr": {
    "optionsTitle": "Karsilastirma secenekleri",
    "delimiterLabel": "Girdi ayirici",
    "delimiterNewline": "Yeni satir",
    "delimiterComma": "Virgul",
    "delimiterTab": "Sekme",
    "delimiterCustom": "Ozel",
    "customDelimiterLabel": "Isleme",
    "trimItems": "Her ogeyi kirp",
    "ignoreCase": "Buyuk/kucuk harfi yok say",
    "omitEmptyItems": "Bos ogeleri atla",
    "sortResults": "Sonuclari sirala"
  },
  "nl": {
    "optionsTitle": "Vergelijkingsopties",
    "delimiterLabel": "Invoerscheiding",
    "delimiterNewline": "Nieuwe regel",
    "delimiterComma": "Komma",
    "delimiterTab": "Tab",
    "delimiterCustom": "Aangepast",
    "customDelimiterLabel": "Verwerking",
    "trimItems": "Spaties rond elk item verwijderen",
    "ignoreCase": "Hoofdletters negeren",
    "omitEmptyItems": "Lege items overslaan",
    "sortResults": "Resultaten sorteren"
  },
  "sv": {
    "optionsTitle": "Jamforelsealternativ",
    "delimiterLabel": "Indataavgransare",
    "delimiterNewline": "Ny rad",
    "delimiterComma": "Komma",
    "delimiterTab": "Tabb",
    "delimiterCustom": "Anpassad",
    "customDelimiterLabel": "Bearbetning",
    "trimItems": "Trimma varje post",
    "ignoreCase": "Ignorera skiftlage",
    "omitEmptyItems": "Utelam na tomma poster",
    "sortResults": "Sortera resultat"
  },
  "pl": {
    "optionsTitle": "Opcje porownania",
    "delimiterLabel": "Separator wejscia",
    "delimiterNewline": "Nowa linia",
    "delimiterComma": "Przecinek",
    "delimiterTab": "Tab",
    "delimiterCustom": "Wlasny",
    "customDelimiterLabel": "Przetwarzanie",
    "trimItems": "Przytnij kazdy element",
    "ignoreCase": "Ignoruj wielkosc liter",
    "omitEmptyItems": "Pomin puste elementy",
    "sortResults": "Sortuj wyniki"
  },
  "vi": {
    "optionsTitle": "Tuy chon so sanh",
    "delimiterLabel": "Ky tu tach dau vao",
    "delimiterNewline": "Dong moi",
    "delimiterComma": "Dau phay",
    "delimiterTab": "Tab",
    "delimiterCustom": "Tuy chinh",
    "customDelimiterLabel": "Xu ly",
    "trimItems": "Cat khoang trang moi muc",
    "ignoreCase": "Bo qua chu hoa chu thuong",
    "omitEmptyItems": "Bo muc rong",
    "sortResults": "Sap xep ket qua"
  },
  "th": {
    "optionsTitle": "ตัวเลือกการเปรียบเทียบ",
    "delimiterLabel": "ตัวคั่นอินพุต",
    "delimiterNewline": "ขึ้นบรรทัดใหม่",
    "delimiterComma": "จุลภาค",
    "delimiterTab": "แท็บ",
    "delimiterCustom": "กำหนดเอง",
    "customDelimiterLabel": "การประมวลผล",
    "trimItems": "ตัดช่องว่างของแต่ละรายการ",
    "ignoreCase": "ไม่สนตัวพิมพ์ใหญ่เล็ก",
    "omitEmptyItems": "ละเว้นรายการว่าง",
    "sortResults": "เรียงลำดับผลลัพธ์"
  },
  "id": {
    "optionsTitle": "Opsi perbandingan",
    "delimiterLabel": "Pemisah input",
    "delimiterNewline": "Baris baru",
    "delimiterComma": "Koma",
    "delimiterTab": "Tab",
    "delimiterCustom": "Kustom",
    "customDelimiterLabel": "Pemrosesan",
    "trimItems": "Rapikan setiap item",
    "ignoreCase": "Abaikan huruf besar kecil",
    "omitEmptyItems": "Lewati item kosong",
    "sortResults": "Urutkan hasil"
  },
  "he": {
    "optionsTitle": "אפשרויות השוואה",
    "delimiterLabel": "מפריד קלט",
    "delimiterNewline": "שורה חדשה",
    "delimiterComma": "פסיק",
    "delimiterTab": "טאב",
    "delimiterCustom": "מותאם אישית",
    "customDelimiterLabel": "עיבוד",
    "trimItems": "הסר רווחים מכל פריט",
    "ignoreCase": "התעלם מרישיות",
    "omitEmptyItems": "דלג על פריטים ריקים",
    "sortResults": "מיין תוצאות"
  },
  "ms": {
    "optionsTitle": "Pilihan perbandingan",
    "delimiterLabel": "Pemisah input",
    "delimiterNewline": "Baris baharu",
    "delimiterComma": "Koma",
    "delimiterTab": "Tab",
    "delimiterCustom": "Tersuai",
    "customDelimiterLabel": "Pemprosesan",
    "trimItems": "Potong ruang pada setiap item",
    "ignoreCase": "Abai huruf besar kecil",
    "omitEmptyItems": "Langkau item kosong",
    "sortResults": "Susun hasil"
  },
  "no": {
    "optionsTitle": "Sammenligningsvalg",
    "delimiterLabel": "Inndataskille",
    "delimiterNewline": "Ny linje",
    "delimiterComma": "Komma",
    "delimiterTab": "Tab",
    "delimiterCustom": "Tilpasset",
    "customDelimiterLabel": "Behandling",
    "trimItems": "Trim hvert element",
    "ignoreCase": "Ignorer store/sma bokstaver",
    "omitEmptyItems": "Utelat tomme elementer",
    "sortResults": "Sorter resultater"
  }
}
</i18n>
