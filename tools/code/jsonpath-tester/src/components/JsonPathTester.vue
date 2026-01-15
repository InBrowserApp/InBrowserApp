<template>
  <ToolSectionHeader>{{ t('inputsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <div class="field-label">
            <span>{{ t('jsonLabel') }}</span>
            <span class="field-action">
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
            </span>
          </div>
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
          <div class="field-label">
            <span>{{ t('queryLabel') }}</span>
            <span class="field-action">
              <CopyToClipboardButton :content="queryText" size="small" />
            </span>
          </div>
        </template>
        <n-flex vertical :size="8">
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

  <ToolSectionHeader>{{ t('resultsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-alert
        v-if="queryState.state === 'json-error' || queryState.state === 'query-error'"
        type="error"
        :show-icon="true"
      >
        {{ queryState.message }}
      </n-alert>
      <n-empty v-else-if="queryState.state === 'empty'" :description="t('emptyState')" />
      <template v-else>
        <n-flex align="center" justify="space-between">
          <n-text>{{ t('matches-count', { count: matchesCount }) }}</n-text>
          <CopyToClipboardButton
            :content="activeTab === 'values' ? formattedValues : formattedPaths"
          />
        </n-flex>
        <n-tabs v-model:value="activeTab" type="segment" animated>
          <n-tab-pane name="values" :tab="t('values-tab')">
            <n-card size="small">
              <n-code :code="formattedValues" language="json" :hljs="hljs" word-wrap />
            </n-card>
            <n-text v-if="matchesCount === 0" depth="3">{{ t('no-matches') }}</n-text>
          </n-tab-pane>
          <n-tab-pane name="paths" :tab="t('paths-tab')">
            <n-card size="small">
              <n-code :code="formattedPaths" language="json" :hljs="hljs" word-wrap />
            </n-card>
            <n-text v-if="matchesCount === 0" depth="3">{{ t('no-matches') }}</n-text>
          </n-tab-pane>
        </n-tabs>
      </template>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { JSONPath, type JSONPathOptions } from 'jsonpath-plus'
import { fileOpen } from 'browser-fs-access'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import {
  NAlert,
  NButton,
  NCard,
  NCode,
  NEmpty,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInput,
  NSelect,
  NTabPane,
  NTabs,
  NText,
} from 'naive-ui'
import { Document16Regular, TextNumberFormat20Regular } from '@shared/icons/fluent'
import hljs from 'highlight.js/lib/core'
import jsonLang from 'highlight.js/lib/languages/json'

hljs.registerLanguage('json', jsonLang)

type QueryState =
  | { state: 'empty' }
  | { state: 'json-error'; message: string }
  | { state: 'query-error'; message: string }
  | { state: 'ready'; values: unknown[]; paths: string[] }

const { t } = useI18n()

const defaultJson = `{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      {
        "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}`

const defaultQuery = '$.store.book[*].author'

const jsonText = useStorage('tools:jsonpath-tester:json', defaultJson)
const queryText = useStorage('tools:jsonpath-tester:query', defaultQuery)
const selectedExample = ref<string | null>(null)
const activeTab = ref<'values' | 'paths'>('values')

const jsonErrorMessage = computed(() => {
  const parsed = parseJson(jsonText.value)
  return parsed.error ? `${t('invalid-json')}: ${parsed.error}` : ''
})

const jsonStatus = computed(() => {
  if (!jsonText.value.trim()) return undefined
  return jsonErrorMessage.value ? 'error' : 'success'
})

const queryState = computed<QueryState>(() => {
  if (!jsonText.value.trim() || !queryText.value.trim()) {
    return { state: 'empty' }
  }

  const parsed = parseJson(jsonText.value)
  if (parsed.error) {
    return { state: 'json-error', message: `${t('invalid-json')}: ${parsed.error}` }
  }

  const query = queryText.value.trim()
  if (!query) {
    return { state: 'empty' }
  }

  try {
    const jsonValue = parsed.value as JSONPathOptions['json']
    const values = JSONPath<unknown[]>({ path: query, json: jsonValue, resultType: 'value' })
    const paths = JSONPath<string[]>({ path: query, json: jsonValue, resultType: 'path' })
    return { state: 'ready', values, paths }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { state: 'query-error', message: `${t('invalid-query')}: ${message}` }
  }
})

const queryStatus = computed(() => (queryState.value.state === 'query-error' ? 'error' : undefined))

const queryErrorMessage = computed(() =>
  queryState.value.state === 'query-error' ? queryState.value.message : '',
)

const matchesCount = computed(() =>
  queryState.value.state === 'ready' ? queryState.value.values.length : 0,
)

const formattedValues = computed(() =>
  queryState.value.state === 'ready' ? JSON.stringify(queryState.value.values, null, 2) : '',
)

const formattedPaths = computed(() =>
  queryState.value.state === 'ready' ? JSON.stringify(queryState.value.paths, null, 2) : '',
)

const exampleOptions = computed(() => [
  { label: t('example-authors'), value: '$.store.book[*].author' },
  { label: t('example-cheap-books'), value: '$.store.book[?(@.price < 10)].title' },
  { label: t('example-bicycle-color'), value: '$.store.bicycle.color' },
])

function applyExample(value: string | null): void {
  if (!value) return
  queryText.value = value
}

async function importFromFile(): Promise<void> {
  try {
    const file = await fileOpen({
      extensions: ['.json', '.txt'],
    })
    jsonText.value = await file.text()
  } catch {
    // User cancelled file selection - this is normal
  }
}

function formatJson(): void {
  const parsed = parseJson(jsonText.value)
  if (!parsed.error && parsed.value !== undefined) {
    jsonText.value = JSON.stringify(parsed.value, null, 2)
  }
}

function parseJson(input: string): { value?: unknown; error?: string } {
  if (!input.trim()) return {}
  try {
    return { value: JSON.parse(input) }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { error: message }
  }
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
    "import-from-file": "Import from file",
    "invalid-json": "Invalid JSON",
    "invalid-query": "Invalid JSONPath",
    "resultsTitle": "Results",
    "values-tab": "Values",
    "paths-tab": "Paths",
    "matches-count": "Matches: {count}",
    "emptyState": "Enter JSON and a JSONPath query to see results",
    "no-matches": "No matches found",
    "example-authors": "All authors",
    "example-cheap-books": "Books under $10",
    "example-bicycle-color": "Bicycle color"
  },
  "zh": {
    "inputsTitle": "输入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "queryLabel": "JSONPath 查询",
    "query-placeholder": "输入 JSONPath 查询，例如 $.store.book[*].author",
    "examples-placeholder": "加载示例查询",
    "format-json": "格式化 JSON",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON",
    "invalid-query": "无效的 JSONPath",
    "resultsTitle": "结果",
    "values-tab": "值",
    "paths-tab": "路径",
    "matches-count": "匹配数：{count}",
    "emptyState": "输入 JSON 和 JSONPath 查询以查看结果",
    "no-matches": "未找到匹配项",
    "example-authors": "所有作者",
    "example-cheap-books": "低于 $10 的图书",
    "example-bicycle-color": "自行车颜色"
  },
  "zh-CN": {
    "inputsTitle": "输入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "queryLabel": "JSONPath 查询",
    "query-placeholder": "输入 JSONPath 查询，例如 $.store.book[*].author",
    "examples-placeholder": "加载示例查询",
    "format-json": "格式化 JSON",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON",
    "invalid-query": "无效的 JSONPath",
    "resultsTitle": "结果",
    "values-tab": "值",
    "paths-tab": "路径",
    "matches-count": "匹配数：{count}",
    "emptyState": "输入 JSON 和 JSONPath 查询以查看结果",
    "no-matches": "未找到匹配项",
    "example-authors": "所有作者",
    "example-cheap-books": "低于 $10 的图书",
    "example-bicycle-color": "自行车颜色"
  },
  "zh-TW": {
    "inputsTitle": "輸入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "queryLabel": "JSONPath 查詢",
    "query-placeholder": "輸入 JSONPath 查詢，例如 $.store.book[*].author",
    "examples-placeholder": "載入範例查詢",
    "format-json": "格式化 JSON",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON",
    "invalid-query": "無效的 JSONPath",
    "resultsTitle": "結果",
    "values-tab": "值",
    "paths-tab": "路徑",
    "matches-count": "匹配數：{count}",
    "emptyState": "輸入 JSON 和 JSONPath 查詢以查看結果",
    "no-matches": "未找到匹配項",
    "example-authors": "所有作者",
    "example-cheap-books": "低於 $10 的書籍",
    "example-bicycle-color": "自行車顏色"
  },
  "zh-HK": {
    "inputsTitle": "輸入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "queryLabel": "JSONPath 查詢",
    "query-placeholder": "輸入 JSONPath 查詢，例如 $.store.book[*].author",
    "examples-placeholder": "載入範例查詢",
    "format-json": "格式化 JSON",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON",
    "invalid-query": "無效的 JSONPath",
    "resultsTitle": "結果",
    "values-tab": "值",
    "paths-tab": "路徑",
    "matches-count": "匹配數：{count}",
    "emptyState": "輸入 JSON 和 JSONPath 查詢以查看結果",
    "no-matches": "未找到匹配項",
    "example-authors": "所有作者",
    "example-cheap-books": "低於 $10 的書籍",
    "example-bicycle-color": "單車顏色"
  },
  "es": {
    "inputsTitle": "Entradas",
    "jsonLabel": "JSON",
    "json-placeholder": "Pega JSON aquí...",
    "queryLabel": "Consulta JSONPath",
    "query-placeholder": "Introduce una consulta JSONPath, p. ej. $.store.book[*].author",
    "examples-placeholder": "Cargar una consulta de ejemplo",
    "format-json": "Formatear JSON",
    "import-from-file": "Importar desde archivo",
    "invalid-json": "JSON inválido",
    "invalid-query": "JSONPath inválido",
    "resultsTitle": "Resultados",
    "values-tab": "Valores",
    "paths-tab": "Rutas",
    "matches-count": "Coincidencias: {count}",
    "emptyState": "Introduce JSON y una consulta JSONPath para ver resultados",
    "no-matches": "No se encontraron coincidencias",
    "example-authors": "Todos los autores",
    "example-cheap-books": "Libros por debajo de $10",
    "example-bicycle-color": "Color de la bicicleta"
  },
  "fr": {
    "inputsTitle": "Entrées",
    "jsonLabel": "JSON",
    "json-placeholder": "Collez du JSON ici...",
    "queryLabel": "Requête JSONPath",
    "query-placeholder": "Saisissez une requête JSONPath, par ex. $.store.book[*].author",
    "examples-placeholder": "Charger une requête d'exemple",
    "format-json": "Formatter le JSON",
    "import-from-file": "Importer depuis un fichier",
    "invalid-json": "JSON invalide",
    "invalid-query": "JSONPath invalide",
    "resultsTitle": "Résultats",
    "values-tab": "Valeurs",
    "paths-tab": "Chemins",
    "matches-count": "Correspondances : {count}",
    "emptyState": "Saisissez du JSON et une requête JSONPath pour voir les résultats",
    "no-matches": "Aucune correspondance trouvée",
    "example-authors": "Tous les auteurs",
    "example-cheap-books": "Livres à moins de 10 $",
    "example-bicycle-color": "Couleur du vélo"
  },
  "de": {
    "inputsTitle": "Eingaben",
    "jsonLabel": "JSON",
    "json-placeholder": "JSON hier einfügen...",
    "queryLabel": "JSONPath-Abfrage",
    "query-placeholder": "JSONPath-Abfrage eingeben, z. B. $.store.book[*].author",
    "examples-placeholder": "Beispielabfrage laden",
    "format-json": "JSON formatieren",
    "import-from-file": "Aus Datei importieren",
    "invalid-json": "Ungültiges JSON",
    "invalid-query": "Ungültiges JSONPath",
    "resultsTitle": "Ergebnisse",
    "values-tab": "Werte",
    "paths-tab": "Pfade",
    "matches-count": "Treffer: {count}",
    "emptyState": "JSON und JSONPath-Abfrage eingeben, um Ergebnisse zu sehen",
    "no-matches": "Keine Treffer gefunden",
    "example-authors": "Alle Autoren",
    "example-cheap-books": "Bücher unter $10",
    "example-bicycle-color": "Fahrradfarbe"
  },
  "it": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Incolla JSON qui...",
    "queryLabel": "Query JSONPath",
    "query-placeholder": "Inserisci una query JSONPath, ad es. $.store.book[*].author",
    "examples-placeholder": "Carica un esempio di query",
    "format-json": "Formatta JSON",
    "import-from-file": "Importa da file",
    "invalid-json": "JSON non valido",
    "invalid-query": "JSONPath non valido",
    "resultsTitle": "Risultati",
    "values-tab": "Valori",
    "paths-tab": "Percorsi",
    "matches-count": "Corrispondenze: {count}",
    "emptyState": "Inserisci JSON e una query JSONPath per vedere i risultati",
    "no-matches": "Nessuna corrispondenza trovata",
    "example-authors": "Tutti gli autori",
    "example-cheap-books": "Libri sotto i 10 $",
    "example-bicycle-color": "Colore della bici"
  },
  "ja": {
    "inputsTitle": "入力",
    "jsonLabel": "JSON",
    "json-placeholder": "ここにJSONを貼り付け...",
    "queryLabel": "JSONPath クエリ",
    "query-placeholder": "JSONPath クエリを入力（例: $.store.book[*].author）",
    "examples-placeholder": "例のクエリを読み込む",
    "format-json": "JSON を整形",
    "import-from-file": "ファイルからインポート",
    "invalid-json": "無効な JSON",
    "invalid-query": "無効な JSONPath",
    "resultsTitle": "結果",
    "values-tab": "値",
    "paths-tab": "パス",
    "matches-count": "一致: {count}",
    "emptyState": "JSON と JSONPath クエリを入力すると結果が表示されます",
    "no-matches": "一致が見つかりません",
    "example-authors": "すべての著者",
    "example-cheap-books": "10ドル未満の書籍",
    "example-bicycle-color": "自転車の色"
  },
  "ko": {
    "inputsTitle": "입력",
    "jsonLabel": "JSON",
    "json-placeholder": "여기에 JSON 붙여넣기...",
    "queryLabel": "JSONPath 쿼리",
    "query-placeholder": "JSONPath 쿼리를 입력하세요(예: $.store.book[*].author)",
    "examples-placeholder": "예제 쿼리 불러오기",
    "format-json": "JSON 서식 지정",
    "import-from-file": "파일에서 가져오기",
    "invalid-json": "유효하지 않은 JSON",
    "invalid-query": "유효하지 않은 JSONPath",
    "resultsTitle": "결과",
    "values-tab": "값",
    "paths-tab": "경로",
    "matches-count": "일치: {count}",
    "emptyState": "JSON과 JSONPath 쿼리를 입력하면 결과가 표시됩니다",
    "no-matches": "일치하는 항목이 없습니다",
    "example-authors": "모든 저자",
    "example-cheap-books": "$10 미만 도서",
    "example-bicycle-color": "자전거 색상"
  },
  "ru": {
    "inputsTitle": "Ввод",
    "jsonLabel": "JSON",
    "json-placeholder": "Вставьте JSON здесь...",
    "queryLabel": "Запрос JSONPath",
    "query-placeholder": "Введите запрос JSONPath, например $.store.book[*].author",
    "examples-placeholder": "Загрузить пример запроса",
    "format-json": "Форматировать JSON",
    "import-from-file": "Импорт из файла",
    "invalid-json": "Недопустимый JSON",
    "invalid-query": "Недопустимый JSONPath",
    "resultsTitle": "Результаты",
    "values-tab": "Значения",
    "paths-tab": "Пути",
    "matches-count": "Совпадений: {count}",
    "emptyState": "Введите JSON и запрос JSONPath, чтобы увидеть результаты",
    "no-matches": "Совпадений не найдено",
    "example-authors": "Все авторы",
    "example-cheap-books": "Книги дешевле $10",
    "example-bicycle-color": "Цвет велосипеда"
  },
  "pt": {
    "inputsTitle": "Entradas",
    "jsonLabel": "JSON",
    "json-placeholder": "Cole JSON aqui...",
    "queryLabel": "Consulta JSONPath",
    "query-placeholder": "Digite uma consulta JSONPath, ex.: $.store.book[*].author",
    "examples-placeholder": "Carregar uma consulta de exemplo",
    "format-json": "Formatar JSON",
    "import-from-file": "Importar de arquivo",
    "invalid-json": "JSON inválido",
    "invalid-query": "JSONPath inválido",
    "resultsTitle": "Resultados",
    "values-tab": "Valores",
    "paths-tab": "Caminhos",
    "matches-count": "Correspondências: {count}",
    "emptyState": "Insira JSON e uma consulta JSONPath para ver resultados",
    "no-matches": "Nenhuma correspondência encontrada",
    "example-authors": "Todos os autores",
    "example-cheap-books": "Livros abaixo de $10",
    "example-bicycle-color": "Cor da bicicleta"
  },
  "ar": {
    "inputsTitle": "المدخلات",
    "jsonLabel": "JSON",
    "json-placeholder": "الصق JSON هنا...",
    "queryLabel": "استعلام JSONPath",
    "query-placeholder": "أدخل استعلام JSONPath، مثل $.store.book[*].author",
    "examples-placeholder": "تحميل استعلام مثال",
    "format-json": "تنسيق JSON",
    "import-from-file": "استيراد من ملف",
    "invalid-json": "JSON غير صالح",
    "invalid-query": "JSONPath غير صالح",
    "resultsTitle": "النتائج",
    "values-tab": "القيم",
    "paths-tab": "المسارات",
    "matches-count": "التطابقات: {count}",
    "emptyState": "أدخل JSON واستعلام JSONPath لعرض النتائج",
    "no-matches": "لم يتم العثور على تطابقات",
    "example-authors": "جميع المؤلفين",
    "example-cheap-books": "كتب أقل من 10 دولارات",
    "example-bicycle-color": "لون الدراجة"
  },
  "hi": {
    "inputsTitle": "इनपुट",
    "jsonLabel": "JSON",
    "json-placeholder": "यहाँ JSON चिपकाएँ...",
    "queryLabel": "JSONPath क्वेरी",
    "query-placeholder": "JSONPath क्वेरी दर्ज करें, जैसे $.store.book[*].author",
    "examples-placeholder": "उदाहरण क्वेरी लोड करें",
    "format-json": "JSON प्रारूपित करें",
    "import-from-file": "फ़ाइल से आयात करें",
    "invalid-json": "अमान्य JSON",
    "invalid-query": "अमान्य JSONPath",
    "resultsTitle": "परिणाम",
    "values-tab": "मान",
    "paths-tab": "पथ",
    "matches-count": "मिलान: {count}",
    "emptyState": "परिणाम देखने के लिए JSON और JSONPath क्वेरी दर्ज करें",
    "no-matches": "कोई मिलान नहीं मिला",
    "example-authors": "सभी लेखक",
    "example-cheap-books": "$10 से कम की किताबें",
    "example-bicycle-color": "साइकिल का रंग"
  },
  "tr": {
    "inputsTitle": "Girdiler",
    "jsonLabel": "JSON",
    "json-placeholder": "JSON'u buraya yapıştırın...",
    "queryLabel": "JSONPath Sorgusu",
    "query-placeholder": "JSONPath sorgusu girin, ör. $.store.book[*].author",
    "examples-placeholder": "Örnek sorgu yükle",
    "format-json": "JSON'u biçimlendir",
    "import-from-file": "Dosyadan içe aktar",
    "invalid-json": "Geçersiz JSON",
    "invalid-query": "Geçersiz JSONPath",
    "resultsTitle": "Sonuçlar",
    "values-tab": "Değerler",
    "paths-tab": "Yollar",
    "matches-count": "Eşleşmeler: {count}",
    "emptyState": "Sonuçları görmek için JSON ve JSONPath sorgusu girin",
    "no-matches": "Eşleşme bulunamadı",
    "example-authors": "Tüm yazarlar",
    "example-cheap-books": "10 $ altındaki kitaplar",
    "example-bicycle-color": "Bisiklet rengi"
  },
  "nl": {
    "inputsTitle": "Invoer",
    "jsonLabel": "JSON",
    "json-placeholder": "Plak hier JSON...",
    "queryLabel": "JSONPath-query",
    "query-placeholder": "Voer een JSONPath-query in, bijv. $.store.book[*].author",
    "examples-placeholder": "Voorbeeldquery laden",
    "format-json": "JSON opmaken",
    "import-from-file": "Importeren uit bestand",
    "invalid-json": "Ongeldige JSON",
    "invalid-query": "Ongeldige JSONPath",
    "resultsTitle": "Resultaten",
    "values-tab": "Waarden",
    "paths-tab": "Paden",
    "matches-count": "Overeenkomsten: {count}",
    "emptyState": "Voer JSON en een JSONPath-query in om resultaten te zien",
    "no-matches": "Geen overeenkomsten gevonden",
    "example-authors": "Alle auteurs",
    "example-cheap-books": "Boeken onder $10",
    "example-bicycle-color": "Fietskleur"
  },
  "sv": {
    "inputsTitle": "Indata",
    "jsonLabel": "JSON",
    "json-placeholder": "Klistra in JSON här...",
    "queryLabel": "JSONPath-fråga",
    "query-placeholder": "Ange en JSONPath-fråga, t.ex. $.store.book[*].author",
    "examples-placeholder": "Ladda ett exempelfråga",
    "format-json": "Formatera JSON",
    "import-from-file": "Importera från fil",
    "invalid-json": "Ogiltig JSON",
    "invalid-query": "Ogiltig JSONPath",
    "resultsTitle": "Resultat",
    "values-tab": "Värden",
    "paths-tab": "Sökvägar",
    "matches-count": "Träffar: {count}",
    "emptyState": "Ange JSON och en JSONPath-fråga för att se resultat",
    "no-matches": "Inga träffar hittades",
    "example-authors": "Alla författare",
    "example-cheap-books": "Böcker under $10",
    "example-bicycle-color": "Cykelfärg"
  },
  "pl": {
    "inputsTitle": "Dane wejściowe",
    "jsonLabel": "JSON",
    "json-placeholder": "Wklej tutaj JSON...",
    "queryLabel": "Zapytanie JSONPath",
    "query-placeholder": "Wpisz zapytanie JSONPath, np. $.store.book[*].author",
    "examples-placeholder": "Wczytaj przykładowe zapytanie",
    "format-json": "Formatuj JSON",
    "import-from-file": "Importuj z pliku",
    "invalid-json": "Nieprawidłowy JSON",
    "invalid-query": "Nieprawidłowy JSONPath",
    "resultsTitle": "Wyniki",
    "values-tab": "Wartości",
    "paths-tab": "Ścieżki",
    "matches-count": "Dopasowania: {count}",
    "emptyState": "Wpisz JSON i zapytanie JSONPath, aby zobaczyć wyniki",
    "no-matches": "Brak dopasowań",
    "example-authors": "Wszyscy autorzy",
    "example-cheap-books": "Książki poniżej 10 $",
    "example-bicycle-color": "Kolor roweru"
  },
  "vi": {
    "inputsTitle": "Đầu vào",
    "jsonLabel": "JSON",
    "json-placeholder": "Dán JSON vào đây...",
    "queryLabel": "Truy vấn JSONPath",
    "query-placeholder": "Nhập truy vấn JSONPath, ví dụ $.store.book[*].author",
    "examples-placeholder": "Tải truy vấn mẫu",
    "format-json": "Định dạng JSON",
    "import-from-file": "Nhập từ tệp",
    "invalid-json": "JSON không hợp lệ",
    "invalid-query": "JSONPath không hợp lệ",
    "resultsTitle": "Kết quả",
    "values-tab": "Giá trị",
    "paths-tab": "Đường dẫn",
    "matches-count": "Khớp: {count}",
    "emptyState": "Nhập JSON và truy vấn JSONPath để xem kết quả",
    "no-matches": "Không tìm thấy kết quả",
    "example-authors": "Tất cả tác giả",
    "example-cheap-books": "Sách dưới $10",
    "example-bicycle-color": "Màu xe đạp"
  },
  "th": {
    "inputsTitle": "ข้อมูลนำเข้า",
    "jsonLabel": "JSON",
    "json-placeholder": "วาง JSON ที่นี่...",
    "queryLabel": "คิวรี JSONPath",
    "query-placeholder": "ป้อนคิวรี JSONPath เช่น $.store.book[*].author",
    "examples-placeholder": "โหลดคิวรีตัวอย่าง",
    "format-json": "จัดรูปแบบ JSON",
    "import-from-file": "นำเข้าจากไฟล์",
    "invalid-json": "JSON ไม่ถูกต้อง",
    "invalid-query": "JSONPath ไม่ถูกต้อง",
    "resultsTitle": "ผลลัพธ์",
    "values-tab": "ค่า",
    "paths-tab": "เส้นทาง",
    "matches-count": "จำนวนที่ตรงกัน: {count}",
    "emptyState": "ป้อน JSON และคิวรี JSONPath เพื่อดูผลลัพธ์",
    "no-matches": "ไม่พบรายการที่ตรงกัน",
    "example-authors": "ผู้เขียนทั้งหมด",
    "example-cheap-books": "หนังสือราคาต่ำกว่า $10",
    "example-bicycle-color": "สีจักรยาน"
  },
  "id": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Tempel JSON di sini...",
    "queryLabel": "Kueri JSONPath",
    "query-placeholder": "Masukkan kueri JSONPath, mis. $.store.book[*].author",
    "examples-placeholder": "Muat kueri contoh",
    "format-json": "Format JSON",
    "import-from-file": "Impor dari file",
    "invalid-json": "JSON tidak valid",
    "invalid-query": "JSONPath tidak valid",
    "resultsTitle": "Hasil",
    "values-tab": "Nilai",
    "paths-tab": "Jalur",
    "matches-count": "Kecocokan: {count}",
    "emptyState": "Masukkan JSON dan kueri JSONPath untuk melihat hasil",
    "no-matches": "Tidak ada kecocokan",
    "example-authors": "Semua penulis",
    "example-cheap-books": "Buku di bawah $10",
    "example-bicycle-color": "Warna sepeda"
  },
  "he": {
    "inputsTitle": "קלט",
    "jsonLabel": "JSON",
    "json-placeholder": "הדבק JSON כאן...",
    "queryLabel": "שאילתת JSONPath",
    "query-placeholder": "הזן שאילתת JSONPath, למשל $.store.book[*].author",
    "examples-placeholder": "טען שאילתה לדוגמה",
    "format-json": "פרמט JSON",
    "import-from-file": "ייבוא מקובץ",
    "invalid-json": "JSON לא תקין",
    "invalid-query": "JSONPath לא תקין",
    "resultsTitle": "תוצאות",
    "values-tab": "ערכים",
    "paths-tab": "נתיבים",
    "matches-count": "התאמות: {count}",
    "emptyState": "הזן JSON ושאילתת JSONPath כדי לראות תוצאות",
    "no-matches": "לא נמצאו התאמות",
    "example-authors": "כל המחברים",
    "example-cheap-books": "ספרים מתחת ל-$10",
    "example-bicycle-color": "צבע האופניים"
  },
  "ms": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Tampal JSON di sini...",
    "queryLabel": "Pertanyaan JSONPath",
    "query-placeholder": "Masukkan pertanyaan JSONPath, cth. $.store.book[*].author",
    "examples-placeholder": "Muat pertanyaan contoh",
    "format-json": "Format JSON",
    "import-from-file": "Import dari fail",
    "invalid-json": "JSON tidak sah",
    "invalid-query": "JSONPath tidak sah",
    "resultsTitle": "Hasil",
    "values-tab": "Nilai",
    "paths-tab": "Laluan",
    "matches-count": "Padanan: {count}",
    "emptyState": "Masukkan JSON dan pertanyaan JSONPath untuk melihat hasil",
    "no-matches": "Tiada padanan ditemui",
    "example-authors": "Semua penulis",
    "example-cheap-books": "Buku di bawah $10",
    "example-bicycle-color": "Warna basikal"
  },
  "no": {
    "inputsTitle": "Inndata",
    "jsonLabel": "JSON",
    "json-placeholder": "Lim inn JSON her...",
    "queryLabel": "JSONPath-spørring",
    "query-placeholder": "Skriv inn en JSONPath-spørring, f.eks. $.store.book[*].author",
    "examples-placeholder": "Last inn eksempelspørring",
    "format-json": "Formater JSON",
    "import-from-file": "Importer fra fil",
    "invalid-json": "Ugyldig JSON",
    "invalid-query": "Ugyldig JSONPath",
    "resultsTitle": "Resultater",
    "values-tab": "Verdier",
    "paths-tab": "Stier",
    "matches-count": "Treff: {count}",
    "emptyState": "Skriv inn JSON og en JSONPath-spørring for å se resultater",
    "no-matches": "Ingen treff funnet",
    "example-authors": "Alle forfattere",
    "example-cheap-books": "Bøker under $10",
    "example-bicycle-color": "Sykkelfarge"
  }
}
</i18n>
