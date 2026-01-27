<template>
  <ToolSectionHeader>{{ t('inputsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <n-flex align="center" justify="space-between" class="field-label">
            <span>{{ t('jsonLabel') }}</span>
            <n-flex align="center" :size="8" class="field-action">
              <n-button @click="importFromFile" text>
                <template #icon>
                  <n-icon :component="Document16Regular" />
                </template>
                {{ t('import-from-file') }}
              </n-button>
              <n-button @click="formatJson" text>
                <template #icon>
                  <n-icon :component="TextNumberFormat20Regular" />
                </template>
                {{ t('format-json') }}
              </n-button>
            </n-flex>
          </n-flex>
        </template>
        <n-input
          v-model:value="jsonText"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 20 }"
          :placeholder="t('json-placeholder')"
          :status="jsonStatus"
        />
        <template #feedback>
          <n-text v-if="jsonErrorMessage" type="error">{{ jsonErrorMessage }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <n-flex align="center" justify="space-between" class="field-label">
            <span>{{ t('queryLabel') }}</span>
            <n-flex align="center" :size="8" class="field-action">
              <CopyToClipboardButton :content="queryText" size="small" />
            </n-flex>
          </n-flex>
        </template>
        <n-flex vertical :size="8" style="width: 100%">
          <n-input
            v-model:value="queryText"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            :placeholder="t('query-placeholder')"
            :status="queryStatus"
            style="width: 100%"
          />
          <n-select
            v-model:value="selectedExample"
            :options="exampleOptions"
            :placeholder="t('examples-placeholder')"
            @update:value="applyExample"
          />
        </n-flex>
        <template #feedback>
          <n-text v-if="queryErrorMessage" type="error">{{ queryErrorMessage }}</n-text>
        </template>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { NButton, NFlex, NFormItemGi, NGrid, NIcon, NInput, NSelect, NText } from 'naive-ui'
import Document16Regular from '@vicons/fluent/Document16Regular'
import TextNumberFormat20Regular from '@vicons/fluent/TextNumberFormat20Regular'

type ExampleOption = { label: string; value: string }

defineProps<{
  exampleOptions: ExampleOption[]
  jsonStatus?: 'error' | 'success'
  queryStatus?: 'error' | 'success'
  jsonErrorMessage: string
  queryErrorMessage: string
  importFromFile: () => Promise<void>
  formatJson: () => void
}>()

const jsonText = defineModel<string>('jsonText', { required: true })
const queryText = defineModel<string>('queryText', { required: true })

const selectedExample = ref<string | null>(null)

const { t } = useI18n({ useScope: 'local' })

function applyExample(value: string | null): void {
  if (!value) return
  queryText.value = value
}
</script>

<style scoped>
.field-label {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  width: 100%;
}

.field-action {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  gap: 8px;
}

:deep(.n-form-item-label__text) {
  display: block;
  width: 100%;
}
</style>

<i18n lang="json">
{
  "en": {
    "inputsTitle": "Inputs",
    "jsonLabel": "JSON",
    "json-placeholder": "Paste JSON here...",
    "queryLabel": "JSONPath Query",
    "query-placeholder": "Enter JSONPath query, e.g. $.store.book[*].author",
    "examples-placeholder": "Load an example query",
    "format-json": "Format JSON",
    "import-from-file": "Import from file"
  },
  "zh": {
    "inputsTitle": "输入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "queryLabel": "JSONPath 查询",
    "query-placeholder": "输入 JSONPath 查询，例如 $.store.book[*].author",
    "examples-placeholder": "加载示例查询",
    "format-json": "格式化 JSON",
    "import-from-file": "从文件导入"
  },
  "zh-CN": {
    "inputsTitle": "输入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "queryLabel": "JSONPath 查询",
    "query-placeholder": "输入 JSONPath 查询，例如 $.store.book[*].author",
    "examples-placeholder": "加载示例查询",
    "format-json": "格式化 JSON",
    "import-from-file": "从文件导入"
  },
  "zh-TW": {
    "inputsTitle": "輸入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "queryLabel": "JSONPath 查詢",
    "query-placeholder": "輸入 JSONPath 查詢，例如 $.store.book[*].author",
    "examples-placeholder": "載入範例查詢",
    "format-json": "格式化 JSON",
    "import-from-file": "從檔案匯入"
  },
  "zh-HK": {
    "inputsTitle": "輸入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "queryLabel": "JSONPath 查詢",
    "query-placeholder": "輸入 JSONPath 查詢，例如 $.store.book[*].author",
    "examples-placeholder": "載入範例查詢",
    "format-json": "格式化 JSON",
    "import-from-file": "從檔案匯入"
  },
  "es": {
    "inputsTitle": "Entradas",
    "jsonLabel": "JSON",
    "json-placeholder": "Pega JSON aquí...",
    "queryLabel": "Consulta JSONPath",
    "query-placeholder": "Introduce una consulta JSONPath, p. ej. $.store.book[*].author",
    "examples-placeholder": "Cargar una consulta de ejemplo",
    "format-json": "Formatear JSON",
    "import-from-file": "Importar desde archivo"
  },
  "fr": {
    "inputsTitle": "Entrées",
    "jsonLabel": "JSON",
    "json-placeholder": "Collez du JSON ici...",
    "queryLabel": "Requête JSONPath",
    "query-placeholder": "Saisissez une requête JSONPath, par ex. $.store.book[*].author",
    "examples-placeholder": "Charger une requête d'exemple",
    "format-json": "Formatter le JSON",
    "import-from-file": "Importer depuis un fichier"
  },
  "de": {
    "inputsTitle": "Eingaben",
    "jsonLabel": "JSON",
    "json-placeholder": "JSON hier einfügen...",
    "queryLabel": "JSONPath-Abfrage",
    "query-placeholder": "JSONPath-Abfrage eingeben, z. B. $.store.book[*].author",
    "examples-placeholder": "Beispielabfrage laden",
    "format-json": "JSON formatieren",
    "import-from-file": "Aus Datei importieren"
  },
  "it": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Incolla JSON qui...",
    "queryLabel": "Query JSONPath",
    "query-placeholder": "Inserisci una query JSONPath, ad es. $.store.book[*].author",
    "examples-placeholder": "Carica un esempio di query",
    "format-json": "Formatta JSON",
    "import-from-file": "Importa da file"
  },
  "ja": {
    "inputsTitle": "入力",
    "jsonLabel": "JSON",
    "json-placeholder": "ここにJSONを貼り付け...",
    "queryLabel": "JSONPath クエリ",
    "query-placeholder": "JSONPath クエリを入力（例: $.store.book[*].author）",
    "examples-placeholder": "例のクエリを読み込む",
    "format-json": "JSON を整形",
    "import-from-file": "ファイルからインポート"
  },
  "ko": {
    "inputsTitle": "입력",
    "jsonLabel": "JSON",
    "json-placeholder": "여기에 JSON 붙여넣기...",
    "queryLabel": "JSONPath 쿼리",
    "query-placeholder": "JSONPath 쿼리를 입력하세요(예: $.store.book[*].author)",
    "examples-placeholder": "예제 쿼리 불러오기",
    "format-json": "JSON 서식 지정",
    "import-from-file": "파일에서 가져오기"
  },
  "ru": {
    "inputsTitle": "Ввод",
    "jsonLabel": "JSON",
    "json-placeholder": "Вставьте JSON здесь...",
    "queryLabel": "Запрос JSONPath",
    "query-placeholder": "Введите запрос JSONPath, например $.store.book[*].author",
    "examples-placeholder": "Загрузить пример запроса",
    "format-json": "Форматировать JSON",
    "import-from-file": "Импорт из файла"
  },
  "pt": {
    "inputsTitle": "Entradas",
    "jsonLabel": "JSON",
    "json-placeholder": "Cole JSON aqui...",
    "queryLabel": "Consulta JSONPath",
    "query-placeholder": "Digite uma consulta JSONPath, ex.: $.store.book[*].author",
    "examples-placeholder": "Carregar uma consulta de exemplo",
    "format-json": "Formatar JSON",
    "import-from-file": "Importar de arquivo"
  },
  "ar": {
    "inputsTitle": "المدخلات",
    "jsonLabel": "JSON",
    "json-placeholder": "الصق JSON هنا...",
    "queryLabel": "استعلام JSONPath",
    "query-placeholder": "أدخل استعلام JSONPath، مثل $.store.book[*].author",
    "examples-placeholder": "تحميل استعلام مثال",
    "format-json": "تنسيق JSON",
    "import-from-file": "استيراد من ملف"
  },
  "hi": {
    "inputsTitle": "इनपुट",
    "jsonLabel": "JSON",
    "json-placeholder": "यहाँ JSON चिपकाएँ...",
    "queryLabel": "JSONPath क्वेरी",
    "query-placeholder": "JSONPath क्वेरी दर्ज करें, जैसे $.store.book[*].author",
    "examples-placeholder": "उदाहरण क्वेरी लोड करें",
    "format-json": "JSON प्रारूपित करें",
    "import-from-file": "फ़ाइल से आयात करें"
  },
  "tr": {
    "inputsTitle": "Girdiler",
    "jsonLabel": "JSON",
    "json-placeholder": "JSON'u buraya yapıştırın...",
    "queryLabel": "JSONPath Sorgusu",
    "query-placeholder": "JSONPath sorgusu girin, ör. $.store.book[*].author",
    "examples-placeholder": "Örnek sorgu yükle",
    "format-json": "JSON'u biçimlendir",
    "import-from-file": "Dosyadan içe aktar"
  },
  "nl": {
    "inputsTitle": "Invoer",
    "jsonLabel": "JSON",
    "json-placeholder": "Plak hier JSON...",
    "queryLabel": "JSONPath-query",
    "query-placeholder": "Voer een JSONPath-query in, bijv. $.store.book[*].author",
    "examples-placeholder": "Voorbeeldquery laden",
    "format-json": "JSON opmaken",
    "import-from-file": "Importeren uit bestand"
  },
  "sv": {
    "inputsTitle": "Indata",
    "jsonLabel": "JSON",
    "json-placeholder": "Klistra in JSON här...",
    "queryLabel": "JSONPath-fråga",
    "query-placeholder": "Ange en JSONPath-fråga, t.ex. $.store.book[*].author",
    "examples-placeholder": "Ladda ett exempelfråga",
    "format-json": "Formatera JSON",
    "import-from-file": "Importera från fil"
  },
  "pl": {
    "inputsTitle": "Dane wejściowe",
    "jsonLabel": "JSON",
    "json-placeholder": "Wklej tutaj JSON...",
    "queryLabel": "Zapytanie JSONPath",
    "query-placeholder": "Wpisz zapytanie JSONPath, np. $.store.book[*].author",
    "examples-placeholder": "Wczytaj przykładowe zapytanie",
    "format-json": "Formatuj JSON",
    "import-from-file": "Importuj z pliku"
  },
  "vi": {
    "inputsTitle": "Đầu vào",
    "jsonLabel": "JSON",
    "json-placeholder": "Dán JSON vào đây...",
    "queryLabel": "Truy vấn JSONPath",
    "query-placeholder": "Nhập truy vấn JSONPath, ví dụ $.store.book[*].author",
    "examples-placeholder": "Tải truy vấn mẫu",
    "format-json": "Định dạng JSON",
    "import-from-file": "Nhập từ tệp"
  },
  "th": {
    "inputsTitle": "ข้อมูลนำเข้า",
    "jsonLabel": "JSON",
    "json-placeholder": "วาง JSON ที่นี่...",
    "queryLabel": "คิวรี JSONPath",
    "query-placeholder": "ป้อนคิวรี JSONPath เช่น $.store.book[*].author",
    "examples-placeholder": "โหลดคิวรีตัวอย่าง",
    "format-json": "จัดรูปแบบ JSON",
    "import-from-file": "นำเข้าจากไฟล์"
  },
  "id": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Tempel JSON di sini...",
    "queryLabel": "Kueri JSONPath",
    "query-placeholder": "Masukkan kueri JSONPath, mis. $.store.book[*].author",
    "examples-placeholder": "Muat kueri contoh",
    "format-json": "Format JSON",
    "import-from-file": "Impor dari file"
  },
  "he": {
    "inputsTitle": "קלט",
    "jsonLabel": "JSON",
    "json-placeholder": "הדבק JSON כאן...",
    "queryLabel": "שאילתת JSONPath",
    "query-placeholder": "הזן שאילתת JSONPath, למשל $.store.book[*].author",
    "examples-placeholder": "טען שאילתה לדוגמה",
    "format-json": "פרמט JSON",
    "import-from-file": "ייבוא מקובץ"
  },
  "ms": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Tampal JSON di sini...",
    "queryLabel": "Pertanyaan JSONPath",
    "query-placeholder": "Masukkan pertanyaan JSONPath, cth. $.store.book[*].author",
    "examples-placeholder": "Muat pertanyaan contoh",
    "format-json": "Format JSON",
    "import-from-file": "Import dari fail"
  },
  "no": {
    "inputsTitle": "Inndata",
    "jsonLabel": "JSON",
    "json-placeholder": "Lim inn JSON her...",
    "queryLabel": "JSONPath-spørring",
    "query-placeholder": "Skriv inn en JSONPath-spørring, f.eks. $.store.book[*].author",
    "examples-placeholder": "Last inn eksempelspørring",
    "format-json": "Formater JSON",
    "import-from-file": "Importer fra fil"
  }
}
</i18n>
