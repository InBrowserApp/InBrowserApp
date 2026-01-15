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
          <n-text>{{ t('result-count', { count: resultCount }) }}</n-text>
          <CopyToClipboardButton :content="formattedResult" />
        </n-flex>
        <n-card size="small">
          <n-code :code="formattedResult" language="json" :hljs="hljs" word-wrap />
        </n-card>
        <n-text v-if="resultCount === 0" depth="3">{{ t('no-results') }}</n-text>
      </template>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { search } from 'jmespath'
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
  | { state: 'ready'; result: unknown }

const { t } = useI18n()

const defaultJson = `{
  "people": [
    {
      "first": "James",
      "last": "Smith",
      "age": 32
    },
    {
      "first": "Sarah",
      "last": "Jones",
      "age": 27
    },
    {
      "first": "Harry",
      "last": "Wilson",
      "age": 42
    }
  ],
  "orders": [
    {
      "id": "A1",
      "total": 29.99
    },
    {
      "id": "B2",
      "total": 17.5
    }
  ],
  "active": true
}`

const defaultQuery = 'people[*].last'

const jsonText = useStorage('tools:jmespath-tester:json', defaultJson)
const queryText = useStorage('tools:jmespath-tester:query', defaultQuery)
const selectedExample = ref<string | null>(null)

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
    const result = search(parsed.value, query)
    return { state: 'ready', result }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { state: 'query-error', message: `${t('invalid-query')}: ${message}` }
  }
})

const queryStatus = computed(() => (queryState.value.state === 'query-error' ? 'error' : undefined))

const queryErrorMessage = computed(() =>
  queryState.value.state === 'query-error' ? queryState.value.message : '',
)

const resultCount = computed(() => {
  if (queryState.value.state !== 'ready') return 0
  const result = queryState.value.result
  if (Array.isArray(result)) return result.length
  if (result === null || result === undefined) return 0
  return 1
})

const formattedResult = computed(() =>
  queryState.value.state === 'ready'
    ? JSON.stringify(queryState.value.result ?? null, null, 2)
    : '',
)

const exampleOptions = computed(() => [
  { label: t('example-last-names'), value: 'people[*].last' },
  { label: t('example-adults'), value: 'people[?age >= `30`].first' },
  { label: t('example-orders'), value: 'orders[?total > `20`].id' },
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
    "queryLabel": "JMESPath Expression",
    "query-placeholder": "Enter JMESPath expression, e.g. people[*].last",
    "examples-placeholder": "Load an example expression",
    "format-json": "Format JSON",
    "import-from-file": "Import from file",
    "invalid-json": "Invalid JSON",
    "invalid-query": "Invalid JMESPath",
    "resultsTitle": "Results",
    "result-count": "Results: {count}",
    "emptyState": "Enter JSON and a JMESPath expression to see results",
    "no-results": "No results found",
    "example-last-names": "All last names",
    "example-adults": "People age 30+",
    "example-orders": "Orders over 20"
  },
  "zh": {
    "inputsTitle": "输入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "queryLabel": "JMESPath 表达式",
    "query-placeholder": "输入 JMESPath 表达式，例如 people[*].last",
    "examples-placeholder": "加载示例表达式",
    "format-json": "格式化 JSON",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON",
    "invalid-query": "无效的 JMESPath",
    "resultsTitle": "结果",
    "result-count": "结果数：{count}",
    "emptyState": "输入 JSON 和 JMESPath 表达式以查看结果",
    "no-results": "未找到结果",
    "example-last-names": "所有姓氏",
    "example-adults": "30 岁以上的人",
    "example-orders": "超过 20 的订单"
  },
  "zh-CN": {
    "inputsTitle": "输入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "queryLabel": "JMESPath 表达式",
    "query-placeholder": "输入 JMESPath 表达式，例如 people[*].last",
    "examples-placeholder": "加载示例表达式",
    "format-json": "格式化 JSON",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON",
    "invalid-query": "无效的 JMESPath",
    "resultsTitle": "结果",
    "result-count": "结果数：{count}",
    "emptyState": "输入 JSON 和 JMESPath 表达式以查看结果",
    "no-results": "未找到结果",
    "example-last-names": "所有姓氏",
    "example-adults": "30 岁以上的人",
    "example-orders": "超过 20 的订单"
  },
  "zh-TW": {
    "inputsTitle": "輸入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "queryLabel": "JMESPath 表達式",
    "query-placeholder": "輸入 JMESPath 表達式，例如 people[*].last",
    "examples-placeholder": "載入範例表達式",
    "format-json": "格式化 JSON",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON",
    "invalid-query": "無效的 JMESPath",
    "resultsTitle": "結果",
    "result-count": "結果數：{count}",
    "emptyState": "輸入 JSON 和 JMESPath 表達式以查看結果",
    "no-results": "未找到結果",
    "example-last-names": "所有姓氏",
    "example-adults": "30 歲以上的人",
    "example-orders": "超過 20 的訂單"
  },
  "zh-HK": {
    "inputsTitle": "輸入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "queryLabel": "JMESPath 表達式",
    "query-placeholder": "輸入 JMESPath 表達式，例如 people[*].last",
    "examples-placeholder": "載入範例表達式",
    "format-json": "格式化 JSON",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON",
    "invalid-query": "無效的 JMESPath",
    "resultsTitle": "結果",
    "result-count": "結果數：{count}",
    "emptyState": "輸入 JSON 和 JMESPath 表達式以查看結果",
    "no-results": "未找到結果",
    "example-last-names": "所有姓氏",
    "example-adults": "30 歲以上的人",
    "example-orders": "超過 20 的訂單"
  },
  "es": {
    "inputsTitle": "Entradas",
    "jsonLabel": "JSON",
    "json-placeholder": "Pega JSON aquí...",
    "queryLabel": "Expresión JMESPath",
    "query-placeholder": "Introduce una expresión JMESPath, p. ej. people[*].last",
    "examples-placeholder": "Cargar una expresión de ejemplo",
    "format-json": "Formatear JSON",
    "import-from-file": "Importar desde archivo",
    "invalid-json": "JSON inválido",
    "invalid-query": "JMESPath inválido",
    "resultsTitle": "Resultados",
    "result-count": "Resultados: {count}",
    "emptyState": "Introduce JSON y una expresión JMESPath para ver resultados",
    "no-results": "No se encontraron resultados",
    "example-last-names": "Todos los apellidos",
    "example-adults": "Personas de 30+ años",
    "example-orders": "Pedidos mayores de 20"
  },
  "fr": {
    "inputsTitle": "Entrées",
    "jsonLabel": "JSON",
    "json-placeholder": "Collez du JSON ici...",
    "queryLabel": "Expression JMESPath",
    "query-placeholder": "Saisissez une expression JMESPath, par ex. people[*].last",
    "examples-placeholder": "Charger une expression d'exemple",
    "format-json": "Formatter le JSON",
    "import-from-file": "Importer depuis un fichier",
    "invalid-json": "JSON invalide",
    "invalid-query": "JMESPath invalide",
    "resultsTitle": "Résultats",
    "result-count": "Résultats : {count}",
    "emptyState": "Saisissez du JSON et une expression JMESPath pour voir les résultats",
    "no-results": "Aucun résultat trouvé",
    "example-last-names": "Tous les noms de famille",
    "example-adults": "Personnes de 30 ans et plus",
    "example-orders": "Commandes au-dessus de 20"
  },
  "de": {
    "inputsTitle": "Eingaben",
    "jsonLabel": "JSON",
    "json-placeholder": "JSON hier einfügen...",
    "queryLabel": "JMESPath-Ausdruck",
    "query-placeholder": "JMESPath-Ausdruck eingeben, z. B. people[*].last",
    "examples-placeholder": "Beispielausdruck laden",
    "format-json": "JSON formatieren",
    "import-from-file": "Aus Datei importieren",
    "invalid-json": "Ungültiges JSON",
    "invalid-query": "Ungültiges JMESPath",
    "resultsTitle": "Ergebnisse",
    "result-count": "Ergebnisse: {count}",
    "emptyState": "JSON und einen JMESPath-Ausdruck eingeben, um Ergebnisse zu sehen",
    "no-results": "Keine Ergebnisse gefunden",
    "example-last-names": "Alle Nachnamen",
    "example-adults": "Personen ab 30",
    "example-orders": "Bestellungen über 20"
  },
  "it": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Incolla JSON qui...",
    "queryLabel": "Espressione JMESPath",
    "query-placeholder": "Inserisci un'espressione JMESPath, ad es. people[*].last",
    "examples-placeholder": "Carica un'espressione di esempio",
    "format-json": "Formatta JSON",
    "import-from-file": "Importa da file",
    "invalid-json": "JSON non valido",
    "invalid-query": "JMESPath non valido",
    "resultsTitle": "Risultati",
    "result-count": "Risultati: {count}",
    "emptyState": "Inserisci JSON e un'espressione JMESPath per vedere i risultati",
    "no-results": "Nessun risultato trovato",
    "example-last-names": "Tutti i cognomi",
    "example-adults": "Persone di 30+ anni",
    "example-orders": "Ordini oltre 20"
  },
  "ja": {
    "inputsTitle": "入力",
    "jsonLabel": "JSON",
    "json-placeholder": "ここにJSONを貼り付け...",
    "queryLabel": "JMESPath 式",
    "query-placeholder": "JMESPath 式を入力（例: people[*].last）",
    "examples-placeholder": "例の式を読み込む",
    "format-json": "JSON を整形",
    "import-from-file": "ファイルからインポート",
    "invalid-json": "無効な JSON",
    "invalid-query": "無効な JMESPath",
    "resultsTitle": "結果",
    "result-count": "結果: {count}",
    "emptyState": "JSON と JMESPath 式を入力すると結果が表示されます",
    "no-results": "結果が見つかりません",
    "example-last-names": "すべての姓",
    "example-adults": "30歳以上の人",
    "example-orders": "20超の注文"
  },
  "ko": {
    "inputsTitle": "입력",
    "jsonLabel": "JSON",
    "json-placeholder": "여기에 JSON 붙여넣기...",
    "queryLabel": "JMESPath 표현식",
    "query-placeholder": "JMESPath 표현식을 입력하세요(예: people[*].last)",
    "examples-placeholder": "예제 표현식 불러오기",
    "format-json": "JSON 서식 지정",
    "import-from-file": "파일에서 가져오기",
    "invalid-json": "유효하지 않은 JSON",
    "invalid-query": "유효하지 않은 JMESPath",
    "resultsTitle": "결과",
    "result-count": "결과: {count}",
    "emptyState": "JSON과 JMESPath 표현식을 입력하면 결과가 표시됩니다",
    "no-results": "결과를 찾을 수 없습니다",
    "example-last-names": "모든 성",
    "example-adults": "30세 이상",
    "example-orders": "20 초과 주문"
  },
  "ru": {
    "inputsTitle": "Ввод",
    "jsonLabel": "JSON",
    "json-placeholder": "Вставьте JSON здесь...",
    "queryLabel": "Выражение JMESPath",
    "query-placeholder": "Введите выражение JMESPath, например people[*].last",
    "examples-placeholder": "Загрузить пример выражения",
    "format-json": "Форматировать JSON",
    "import-from-file": "Импорт из файла",
    "invalid-json": "Недопустимый JSON",
    "invalid-query": "Недопустимый JMESPath",
    "resultsTitle": "Результаты",
    "result-count": "Результаты: {count}",
    "emptyState": "Введите JSON и выражение JMESPath, чтобы увидеть результаты",
    "no-results": "Результаты не найдены",
    "example-last-names": "Все фамилии",
    "example-adults": "Люди старше 30",
    "example-orders": "Заказы больше 20"
  },
  "pt": {
    "inputsTitle": "Entradas",
    "jsonLabel": "JSON",
    "json-placeholder": "Cole JSON aqui...",
    "queryLabel": "Expressão JMESPath",
    "query-placeholder": "Digite uma expressão JMESPath, ex.: people[*].last",
    "examples-placeholder": "Carregar uma expressão de exemplo",
    "format-json": "Formatar JSON",
    "import-from-file": "Importar de arquivo",
    "invalid-json": "JSON inválido",
    "invalid-query": "JMESPath inválido",
    "resultsTitle": "Resultados",
    "result-count": "Resultados: {count}",
    "emptyState": "Insira JSON e uma expressão JMESPath para ver resultados",
    "no-results": "Nenhum resultado encontrado",
    "example-last-names": "Todos os sobrenomes",
    "example-adults": "Pessoas com 30+",
    "example-orders": "Pedidos acima de 20"
  },
  "ar": {
    "inputsTitle": "المدخلات",
    "jsonLabel": "JSON",
    "json-placeholder": "الصق JSON هنا...",
    "queryLabel": "تعبير JMESPath",
    "query-placeholder": "أدخل تعبير JMESPath، مثل people[*].last",
    "examples-placeholder": "تحميل تعبير مثال",
    "format-json": "تنسيق JSON",
    "import-from-file": "استيراد من ملف",
    "invalid-json": "JSON غير صالح",
    "invalid-query": "JMESPath غير صالح",
    "resultsTitle": "النتائج",
    "result-count": "النتائج: {count}",
    "emptyState": "أدخل JSON وتعبير JMESPath لعرض النتائج",
    "no-results": "لم يتم العثور على نتائج",
    "example-last-names": "جميع أسماء العائلة",
    "example-adults": "الأشخاص بعمر 30+",
    "example-orders": "طلبات أكثر من 20"
  },
  "hi": {
    "inputsTitle": "इनपुट",
    "jsonLabel": "JSON",
    "json-placeholder": "यहाँ JSON चिपकाएँ...",
    "queryLabel": "JMESPath अभिव्यक्ति",
    "query-placeholder": "JMESPath अभिव्यक्ति दर्ज करें, जैसे people[*].last",
    "examples-placeholder": "उदाहरण अभिव्यक्ति लोड करें",
    "format-json": "JSON प्रारूपित करें",
    "import-from-file": "फ़ाइल से आयात करें",
    "invalid-json": "अमान्य JSON",
    "invalid-query": "अमान्य JMESPath",
    "resultsTitle": "परिणाम",
    "result-count": "परिणाम: {count}",
    "emptyState": "परिणाम देखने के लिए JSON और JMESPath अभिव्यक्ति दर्ज करें",
    "no-results": "कोई परिणाम नहीं मिला",
    "example-last-names": "सभी उपनाम",
    "example-adults": "30+ वर्ष के लोग",
    "example-orders": "20 से ऊपर के ऑर्डर"
  },
  "tr": {
    "inputsTitle": "Girdiler",
    "jsonLabel": "JSON",
    "json-placeholder": "JSON'u buraya yapıştırın...",
    "queryLabel": "JMESPath İfadesi",
    "query-placeholder": "JMESPath ifadesi girin, ör. people[*].last",
    "examples-placeholder": "Örnek ifade yükle",
    "format-json": "JSON'u biçimlendir",
    "import-from-file": "Dosyadan içe aktar",
    "invalid-json": "Geçersiz JSON",
    "invalid-query": "Geçersiz JMESPath",
    "resultsTitle": "Sonuçlar",
    "result-count": "Sonuçlar: {count}",
    "emptyState": "Sonuçları görmek için JSON ve JMESPath ifadesi girin",
    "no-results": "Sonuç bulunamadı",
    "example-last-names": "Tüm soyadları",
    "example-adults": "30+ yaş",
    "example-orders": "20'nin üzerindeki siparişler"
  },
  "nl": {
    "inputsTitle": "Invoer",
    "jsonLabel": "JSON",
    "json-placeholder": "Plak hier JSON...",
    "queryLabel": "JMESPath-expressie",
    "query-placeholder": "Voer een JMESPath-expressie in, bijv. people[*].last",
    "examples-placeholder": "Voorbeeldexpressie laden",
    "format-json": "JSON opmaken",
    "import-from-file": "Importeren uit bestand",
    "invalid-json": "Ongeldige JSON",
    "invalid-query": "Ongeldige JMESPath",
    "resultsTitle": "Resultaten",
    "result-count": "Resultaten: {count}",
    "emptyState": "Voer JSON en een JMESPath-expressie in om resultaten te zien",
    "no-results": "Geen resultaten gevonden",
    "example-last-names": "Alle achternamen",
    "example-adults": "Mensen van 30+",
    "example-orders": "Bestellingen boven 20"
  },
  "sv": {
    "inputsTitle": "Indata",
    "jsonLabel": "JSON",
    "json-placeholder": "Klistra in JSON här...",
    "queryLabel": "JMESPath-uttryck",
    "query-placeholder": "Ange ett JMESPath-uttryck, t.ex. people[*].last",
    "examples-placeholder": "Ladda ett exempeluttryck",
    "format-json": "Formatera JSON",
    "import-from-file": "Importera från fil",
    "invalid-json": "Ogiltig JSON",
    "invalid-query": "Ogiltig JMESPath",
    "resultsTitle": "Resultat",
    "result-count": "Resultat: {count}",
    "emptyState": "Ange JSON och ett JMESPath-uttryck för att se resultat",
    "no-results": "Inga resultat hittades",
    "example-last-names": "Alla efternamn",
    "example-adults": "Personer 30+",
    "example-orders": "Beställningar över 20"
  },
  "pl": {
    "inputsTitle": "Dane wejściowe",
    "jsonLabel": "JSON",
    "json-placeholder": "Wklej tutaj JSON...",
    "queryLabel": "Wyrażenie JMESPath",
    "query-placeholder": "Wpisz wyrażenie JMESPath, np. people[*].last",
    "examples-placeholder": "Wczytaj przykładowe wyrażenie",
    "format-json": "Formatuj JSON",
    "import-from-file": "Importuj z pliku",
    "invalid-json": "Nieprawidłowy JSON",
    "invalid-query": "Nieprawidłowy JMESPath",
    "resultsTitle": "Wyniki",
    "result-count": "Wyniki: {count}",
    "emptyState": "Wpisz JSON i wyrażenie JMESPath, aby zobaczyć wyniki",
    "no-results": "Nie znaleziono wyników",
    "example-last-names": "Wszystkie nazwiska",
    "example-adults": "Osoby 30+",
    "example-orders": "Zamówienia powyżej 20"
  },
  "vi": {
    "inputsTitle": "Đầu vào",
    "jsonLabel": "JSON",
    "json-placeholder": "Dán JSON vào đây...",
    "queryLabel": "Biểu thức JMESPath",
    "query-placeholder": "Nhập biểu thức JMESPath, ví dụ people[*].last",
    "examples-placeholder": "Tải biểu thức mẫu",
    "format-json": "Định dạng JSON",
    "import-from-file": "Nhập từ tệp",
    "invalid-json": "JSON không hợp lệ",
    "invalid-query": "JMESPath không hợp lệ",
    "resultsTitle": "Kết quả",
    "result-count": "Kết quả: {count}",
    "emptyState": "Nhập JSON và biểu thức JMESPath để xem kết quả",
    "no-results": "Không tìm thấy kết quả",
    "example-last-names": "Tất cả họ",
    "example-adults": "Người từ 30+",
    "example-orders": "Đơn hàng trên 20"
  },
  "th": {
    "inputsTitle": "ข้อมูลนำเข้า",
    "jsonLabel": "JSON",
    "json-placeholder": "วาง JSON ที่นี่...",
    "queryLabel": "นิพจน์ JMESPath",
    "query-placeholder": "ป้อนนิพจน์ JMESPath เช่น people[*].last",
    "examples-placeholder": "โหลดนิพจน์ตัวอย่าง",
    "format-json": "จัดรูปแบบ JSON",
    "import-from-file": "นำเข้าจากไฟล์",
    "invalid-json": "JSON ไม่ถูกต้อง",
    "invalid-query": "JMESPath ไม่ถูกต้อง",
    "resultsTitle": "ผลลัพธ์",
    "result-count": "ผลลัพธ์: {count}",
    "emptyState": "ป้อน JSON และนิพจน์ JMESPath เพื่อดูผลลัพธ์",
    "no-results": "ไม่พบผลลัพธ์",
    "example-last-names": "นามสกุลทั้งหมด",
    "example-adults": "คนอายุ 30+",
    "example-orders": "คำสั่งซื้อมากกว่า 20"
  },
  "id": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Tempel JSON di sini...",
    "queryLabel": "Ekspresi JMESPath",
    "query-placeholder": "Masukkan ekspresi JMESPath, mis. people[*].last",
    "examples-placeholder": "Muat ekspresi contoh",
    "format-json": "Format JSON",
    "import-from-file": "Impor dari file",
    "invalid-json": "JSON tidak valid",
    "invalid-query": "JMESPath tidak valid",
    "resultsTitle": "Hasil",
    "result-count": "Hasil: {count}",
    "emptyState": "Masukkan JSON dan ekspresi JMESPath untuk melihat hasil",
    "no-results": "Tidak ditemukan hasil",
    "example-last-names": "Semua nama belakang",
    "example-adults": "Orang usia 30+",
    "example-orders": "Pesanan di atas 20"
  },
  "he": {
    "inputsTitle": "קלט",
    "jsonLabel": "JSON",
    "json-placeholder": "הדבק JSON כאן...",
    "queryLabel": "ביטוי JMESPath",
    "query-placeholder": "הזן ביטוי JMESPath, למשל people[*].last",
    "examples-placeholder": "טען ביטוי לדוגמה",
    "format-json": "פרמט JSON",
    "import-from-file": "ייבוא מקובץ",
    "invalid-json": "JSON לא תקין",
    "invalid-query": "JMESPath לא תקין",
    "resultsTitle": "תוצאות",
    "result-count": "תוצאות: {count}",
    "emptyState": "הזן JSON וביטוי JMESPath כדי לראות תוצאות",
    "no-results": "לא נמצאו תוצאות",
    "example-last-names": "כל שמות המשפחה",
    "example-adults": "אנשים בני 30+",
    "example-orders": "הזמנות מעל 20"
  },
  "ms": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Tampal JSON di sini...",
    "queryLabel": "Ungkapan JMESPath",
    "query-placeholder": "Masukkan ungkapan JMESPath, cth. people[*].last",
    "examples-placeholder": "Muat ungkapan contoh",
    "format-json": "Format JSON",
    "import-from-file": "Import dari fail",
    "invalid-json": "JSON tidak sah",
    "invalid-query": "JMESPath tidak sah",
    "resultsTitle": "Hasil",
    "result-count": "Hasil: {count}",
    "emptyState": "Masukkan JSON dan ungkapan JMESPath untuk melihat hasil",
    "no-results": "Tiada hasil ditemui",
    "example-last-names": "Semua nama keluarga",
    "example-adults": "Orang berumur 30+",
    "example-orders": "Pesanan melebihi 20"
  },
  "no": {
    "inputsTitle": "Inndata",
    "jsonLabel": "JSON",
    "json-placeholder": "Lim inn JSON her...",
    "queryLabel": "JMESPath-uttrykk",
    "query-placeholder": "Skriv inn et JMESPath-uttrykk, f.eks. people[*].last",
    "examples-placeholder": "Last inn eksempeluttrykk",
    "format-json": "Formater JSON",
    "import-from-file": "Importer fra fil",
    "invalid-json": "Ugyldig JSON",
    "invalid-query": "Ugyldig JMESPath",
    "resultsTitle": "Resultater",
    "result-count": "Resultater: {count}",
    "emptyState": "Skriv inn JSON og et JMESPath-uttrykk for å se resultater",
    "no-results": "Ingen resultater funnet",
    "example-last-names": "Alle etternavn",
    "example-adults": "Personer 30+",
    "example-orders": "Bestillinger over 20"
  }
}
</i18n>
