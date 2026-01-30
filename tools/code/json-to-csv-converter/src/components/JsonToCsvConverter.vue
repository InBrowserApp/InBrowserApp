<template>
  <ToolSection>
    <n-flex align="center" justify="space-between">
      <n-flex align="center">
        <n-button text @click="importFromFile">
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('import-from-file') }}
        </n-button>
        <n-button text @click="showSettings = !showSettings">
          <template #icon>
            <n-icon :component="Settings16Regular" />
          </template>
          {{ t('opt-settings') }}
        </n-button>
      </n-flex>
      <n-flex>
        <CopyToClipboardButton :content="csvText" />
        <n-button tag="a" text :href="downloadUrl ?? undefined" download="converted.csv">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-csv') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>

  <n-collapse-transition :show="showSettings">
    <n-form label-placement="left" :show-feedback="false">
      <n-grid cols="1 s:2 m:3 l:4" responsive="screen" :x-gap="20" :y-gap="16">
        <n-form-item-gi :label="t('opt-delimiter')">
          <n-input v-model:value="delimiter" size="small" placeholder="," />
        </n-form-item-gi>
        <n-form-item-gi :label="t('opt-quote')">
          <n-input v-model:value="quote" size="small" placeholder='"' />
        </n-form-item-gi>
        <n-form-item-gi :label="t('opt-header')">
          <n-switch v-model:value="header" size="small" />
        </n-form-item-gi>
        <n-form-item-gi :label="t('opt-escapeFormulae')">
          <n-switch v-model:value="escapeFormulae" size="small" />
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </n-collapse-transition>

  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('json')" :show-feedback="false">
        <n-input
          v-model:value="jsonText"
          type="textarea"
          autosize
          :placeholder="t('json-placeholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('csv')" :show-feedback="false">
        <n-card size="small">
          <n-code :code="csvText" word-wrap></n-code>
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import Papa from 'papaparse'
import {
  NButton,
  NIcon,
  NCard,
  NFormItemGi,
  NGrid,
  NInput,
  NCode,
  NFlex,
  NSwitch,
  NForm,
  NCollapseTransition,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import Settings16Regular from '@vicons/fluent/Settings16Regular'
import { fileOpen } from 'browser-fs-access'

const { t } = useI18n()

const jsonText = ref<string>('[\n  {"a":1,"b":2},\n  {"a":3,"b":4}\n]')
const csvText = ref<string>('')
const delimiter = ref<string>(',')
const quote = ref<string>('"')
const header = ref<boolean>(true)
const escapeFormulae = ref<boolean>(true)
const showSettings = ref<boolean>(false)

function convertNow(): void {
  try {
    const data = JSON.parse(jsonText.value)
    const result = Papa.unparse(data, {
      delimiter: delimiter.value,
      quotes: quote.value !== '' ? true : false,
      quoteChar: quote.value || '"',
      header: header.value,
      escapeFormulae: escapeFormulae.value,
    })
    csvText.value = result
  } catch {
    csvText.value = '// ' + t('invalid-json')
  }
}

watch([jsonText, delimiter, quote, header, escapeFormulae], () => convertNow(), { immediate: true })

const downloadBlob = computed(() => new Blob([csvText.value], { type: 'text/csv;charset=utf-8' }))
const downloadUrl = useObjectUrl(downloadBlob)

async function importFromFile(): Promise<void> {
  const file = await fileOpen({
    extensions: ['.json', '.txt'],
  })
  jsonText.value = await file.text()
}
</script>

<i18n lang="json">
{
  "en": {
    "json": "JSON",
    "json-placeholder": "Paste JSON array of objects here...",
    "csv": "CSV",
    "download-csv": "Download CSV",
    "import-from-file": "Import from file",
    "invalid-json": "Invalid JSON",
    "opt-settings": "Settings",
    "opt-delimiter": "Delimiter",
    "opt-quote": "Quote",
    "opt-header": "Include header row",
    "opt-escapeFormulae": "Escape Excel formulae"
  },
  "zh": {
    "json": "JSON",
    "json-placeholder": "在此粘贴 JSON 对象数组...",
    "csv": "CSV",
    "download-csv": "下载 CSV",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON",
    "opt-settings": "设置",
    "opt-delimiter": "分隔符",
    "opt-quote": "引号",
    "opt-header": "包含表头",
    "opt-escapeFormulae": "转义 Excel 公式"
  },
  "zh-CN": {
    "json": "JSON",
    "json-placeholder": "在此粘贴 JSON 对象数组...",
    "csv": "CSV",
    "download-csv": "下载 CSV",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON",
    "opt-settings": "设置",
    "opt-delimiter": "分隔符",
    "opt-quote": "引号",
    "opt-header": "包含表头",
    "opt-escapeFormulae": "转义 Excel 公式"
  },
  "zh-TW": {
    "json": "JSON",
    "json-placeholder": "在此貼上 JSON 物件陣列...",
    "csv": "CSV",
    "download-csv": "下載 CSV",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON",
    "opt-settings": "設定",
    "opt-delimiter": "分隔符號",
    "opt-quote": "引號",
    "opt-header": "包含表頭",
    "opt-escapeFormulae": "跳脫 Excel 公式"
  },
  "zh-HK": {
    "json": "JSON",
    "json-placeholder": "在此貼上 JSON 物件陣列...",
    "csv": "CSV",
    "download-csv": "下載 CSV",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON",
    "opt-settings": "設定",
    "opt-delimiter": "分隔符號",
    "opt-quote": "引號",
    "opt-header": "包含表頭",
    "opt-escapeFormulae": "跳脫 Excel 公式"
  },
  "es": {
    "json": "JSON",
    "json-placeholder": "Pega aquí un array de objetos JSON...",
    "csv": "CSV",
    "download-csv": "Descargar CSV",
    "import-from-file": "Importar desde archivo",
    "invalid-json": "JSON no válido",
    "opt-settings": "Configuración",
    "opt-delimiter": "Delimitador",
    "opt-quote": "Comillas",
    "opt-header": "Incluir fila de encabezados",
    "opt-escapeFormulae": "Escapar fórmulas de Excel"
  },
  "fr": {
    "json": "JSON",
    "json-placeholder": "Collez ici un tableau d'objets JSON...",
    "csv": "CSV",
    "download-csv": "Télécharger le CSV",
    "import-from-file": "Importer depuis un fichier",
    "invalid-json": "JSON invalide",
    "opt-settings": "Paramètres",
    "opt-delimiter": "Délimiteur",
    "opt-quote": "Guillemet",
    "opt-header": "Inclure la ligne d’en-tête",
    "opt-escapeFormulae": "Échapper les formules Excel"
  },
  "de": {
    "json": "JSON",
    "json-placeholder": "JSON-Objekt-Array hier einfügen...",
    "csv": "CSV",
    "download-csv": "CSV herunterladen",
    "import-from-file": "Aus Datei importieren",
    "invalid-json": "Ungültiges JSON",
    "opt-settings": "Einstellungen",
    "opt-delimiter": "Trennzeichen",
    "opt-quote": "Anführungszeichen",
    "opt-header": "Kopfzeile einschließen",
    "opt-escapeFormulae": "Excel-Formeln maskieren"
  },
  "it": {
    "json": "JSON",
    "json-placeholder": "Incolla qui un array di oggetti JSON...",
    "csv": "CSV",
    "download-csv": "Scarica CSV",
    "import-from-file": "Importa da file",
    "invalid-json": "JSON non valido",
    "opt-settings": "Impostazioni",
    "opt-delimiter": "Delimitatore",
    "opt-quote": "Virgolette",
    "opt-header": "Includi riga di intestazione",
    "opt-escapeFormulae": "Evadi le formule Excel"
  },
  "ja": {
    "json": "JSON",
    "json-placeholder": "ここにJSONのオブジェクト配列を貼り付け...",
    "csv": "CSV",
    "download-csv": "CSVをダウンロード",
    "import-from-file": "ファイルからインポート",
    "invalid-json": "無効なJSON",
    "opt-settings": "設定",
    "opt-delimiter": "区切り",
    "opt-quote": "引用符",
    "opt-header": "ヘッダー行を含める",
    "opt-escapeFormulae": "Excel の数式をエスケープ"
  },
  "ko": {
    "json": "JSON",
    "json-placeholder": "여기에 JSON 객체 배열을 붙여넣기...",
    "csv": "CSV",
    "download-csv": "CSV 다운로드",
    "import-from-file": "파일에서 가져오기",
    "invalid-json": "유효하지 않은 JSON",
    "opt-settings": "설정",
    "opt-delimiter": "구분자",
    "opt-quote": "인용부호",
    "opt-header": "헤더 행 포함",
    "opt-escapeFormulae": "Excel 수식 이스케이프"
  },
  "ru": {
    "json": "JSON",
    "json-placeholder": "Вставьте здесь массив объектов JSON...",
    "csv": "CSV",
    "download-csv": "Скачать CSV",
    "import-from-file": "Импорт из файла",
    "invalid-json": "Недопустимый JSON",
    "opt-settings": "Настройки",
    "opt-delimiter": "Разделитель",
    "opt-quote": "Кавычка",
    "opt-header": "Включить строку заголовков",
    "opt-escapeFormulae": "Экранировать формулы Excel"
  },
  "pt": {
    "json": "JSON",
    "json-placeholder": "Cole aqui um array de objetos JSON...",
    "csv": "CSV",
    "download-csv": "Baixar CSV",
    "import-from-file": "Importar de arquivo",
    "invalid-json": "JSON inválido",
    "opt-settings": "Configurações",
    "opt-delimiter": "Delimitador",
    "opt-quote": "Aspas",
    "opt-header": "Incluir linha de cabeçalho",
    "opt-escapeFormulae": "Escapar fórmulas do Excel"
  },
  "ar": {
    "json": "JSON",
    "json-placeholder": "الصق هنا مصفوفة كائنات JSON...",
    "csv": "CSV",
    "download-csv": "تنزيل CSV",
    "import-from-file": "استيراد من ملف",
    "invalid-json": "JSON غير صالح",
    "opt-settings": "الإعدادات",
    "opt-delimiter": "الفاصل",
    "opt-quote": "علامة الاقتباس",
    "opt-header": "تضمين صف الرأس",
    "opt-escapeFormulae": "تضمين محارف هروب لصيغ Excel"
  },
  "hi": {
    "json": "JSON",
    "json-placeholder": "यहाँ JSON ऑब्जेक्ट्स की array पेस्ट करें...",
    "csv": "CSV",
    "download-csv": "CSV डाउनलोड करें",
    "import-from-file": "फ़ाइल से आयात करें",
    "invalid-json": "अमान्य JSON",
    "opt-settings": "सेटिंग्स",
    "opt-delimiter": "विभाजक",
    "opt-quote": "उद्धरण",
    "opt-header": "हेडर पंक्ति शामिल करें",
    "opt-escapeFormulae": "Excel सूत्रों को एस्केप करें"
  },
  "tr": {
    "json": "JSON",
    "json-placeholder": "Buraya JSON nesne dizisini yapıştırın...",
    "csv": "CSV",
    "download-csv": "CSV İndir",
    "import-from-file": "Dosyadan içe aktar",
    "invalid-json": "Geçersiz JSON",
    "opt-settings": "Ayarlar",
    "opt-delimiter": "Ayırıcı",
    "opt-quote": "Tırnak",
    "opt-header": "Başlık satırını dahil et",
    "opt-escapeFormulae": "Excel formüllerini kaçışla"
  },
  "nl": {
    "json": "JSON",
    "json-placeholder": "Plak hier een array met JSON-objecten...",
    "csv": "CSV",
    "download-csv": "CSV downloaden",
    "import-from-file": "Importeren uit bestand",
    "invalid-json": "Ongeldige JSON",
    "opt-settings": "Instellingen",
    "opt-delimiter": "Scheidingsteken",
    "opt-quote": "Aanhalingsteken",
    "opt-header": "Koprij opnemen",
    "opt-escapeFormulae": "Excel-formules escapen"
  },
  "sv": {
    "json": "JSON",
    "json-placeholder": "Klistra in en array med JSON-objekt här...",
    "csv": "CSV",
    "download-csv": "Ladda ner CSV",
    "import-from-file": "Importera från fil",
    "invalid-json": "Ogiltig JSON",
    "opt-settings": "Inställningar",
    "opt-delimiter": "Avgränsare",
    "opt-quote": "Citattecken",
    "opt-header": "Inkludera rubrikrad",
    "opt-escapeFormulae": "Eskapa Excel-formler"
  },
  "pl": {
    "json": "JSON",
    "json-placeholder": "Wklej tutaj tablicę obiektów JSON...",
    "csv": "CSV",
    "download-csv": "Pobierz CSV",
    "import-from-file": "Importuj z pliku",
    "invalid-json": "Nieprawidłowy JSON",
    "opt-settings": "Ustawienia",
    "opt-delimiter": "Separator",
    "opt-quote": "Cudzysłów",
    "opt-header": "Dołącz wiersz nagłówków",
    "opt-escapeFormulae": "Escapuj formuły Excela"
  },
  "vi": {
    "json": "JSON",
    "json-placeholder": "Dán mảng đối tượng JSON vào đây...",
    "csv": "CSV",
    "download-csv": "Tải CSV",
    "import-from-file": "Nhập từ tệp",
    "invalid-json": "JSON không hợp lệ",
    "opt-settings": "Cài đặt",
    "opt-delimiter": "Dấu phân cách",
    "opt-quote": "Dấu ngoặc kép",
    "opt-header": "Bao gồm hàng tiêu đề",
    "opt-escapeFormulae": "Escape công thức Excel"
  },
  "th": {
    "json": "JSON",
    "json-placeholder": "วางอาร์เรย์ของอ็อบเจกต์ JSON ที่นี่...",
    "csv": "CSV",
    "download-csv": "ดาวน์โหลด CSV",
    "import-from-file": "นำเข้าจากไฟล์",
    "invalid-json": "JSON ไม่ถูกต้อง",
    "opt-settings": "การตั้งค่า",
    "opt-delimiter": "ตัวคั่น",
    "opt-quote": "อัญประกาศ",
    "opt-header": "รวมแถวส่วนหัว",
    "opt-escapeFormulae": "Escape สูตร Excel"
  },
  "id": {
    "json": "JSON",
    "json-placeholder": "Tempel array objek JSON di sini...",
    "csv": "CSV",
    "download-csv": "Unduh CSV",
    "import-from-file": "Impor dari file",
    "invalid-json": "JSON tidak valid",
    "opt-settings": "Pengaturan",
    "opt-delimiter": "Pemisah",
    "opt-quote": "Tanda kutip",
    "opt-header": "Sertakan baris header",
    "opt-escapeFormulae": "Escape rumus Excel"
  },
  "he": {
    "json": "JSON",
    "json-placeholder": "הדביקו כאן מערך של אובייקטי JSON...",
    "csv": "CSV",
    "download-csv": "הורד CSV",
    "import-from-file": "יבוא מקובץ",
    "invalid-json": "JSON לא תקין",
    "opt-settings": "הגדרות",
    "opt-delimiter": "מפריד",
    "opt-quote": "גרשיים",
    "opt-header": "כלול שורת כותרת",
    "opt-escapeFormulae": "בריחת נוסחאות Excel"
  },
  "ms": {
    "json": "JSON",
    "json-placeholder": "Tampal tatasusunan objek JSON di sini...",
    "csv": "CSV",
    "download-csv": "Muat turun CSV",
    "import-from-file": "Import dari fail",
    "invalid-json": "JSON tidak sah",
    "opt-settings": "Tetapan",
    "opt-delimiter": "Pemisah",
    "opt-quote": "Petikan",
    "opt-header": "Sertakan baris pengepala",
    "opt-escapeFormulae": "Escape formula Excel"
  },
  "no": {
    "json": "JSON",
    "json-placeholder": "Lim inn en matrise med JSON-objekter her...",
    "csv": "CSV",
    "download-csv": "Last ned CSV",
    "import-from-file": "Importer fra fil",
    "invalid-json": "Ugyldig JSON",
    "opt-settings": "Innstillinger",
    "opt-delimiter": "Skilletegn",
    "opt-quote": "Anførselstegn",
    "opt-header": "Inkluder overskriftsrad",
    "opt-escapeFormulae": "Escape Excel-formler"
  }
}
</i18n>
