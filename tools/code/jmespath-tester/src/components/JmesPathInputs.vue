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
    "queryLabel": "JMESPath Expression",
    "query-placeholder": "Enter JMESPath expression, e.g. people[*].last",
    "examples-placeholder": "Load an example expression",
    "format-json": "Format JSON",
    "import-from-file": "Import from file"
  },
  "zh": {
    "inputsTitle": "输入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "queryLabel": "JMESPath 表达式",
    "query-placeholder": "输入 JMESPath 表达式，例如 people[*].last",
    "examples-placeholder": "加载示例表达式",
    "format-json": "格式化 JSON",
    "import-from-file": "从文件导入"
  },
  "zh-CN": {
    "inputsTitle": "输入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "queryLabel": "JMESPath 表达式",
    "query-placeholder": "输入 JMESPath 表达式，例如 people[*].last",
    "examples-placeholder": "加载示例表达式",
    "format-json": "格式化 JSON",
    "import-from-file": "从文件导入"
  },
  "zh-TW": {
    "inputsTitle": "輸入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "queryLabel": "JMESPath 表達式",
    "query-placeholder": "輸入 JMESPath 表達式，例如 people[*].last",
    "examples-placeholder": "載入範例表達式",
    "format-json": "格式化 JSON",
    "import-from-file": "從檔案匯入"
  },
  "zh-HK": {
    "inputsTitle": "輸入",
    "jsonLabel": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "queryLabel": "JMESPath 表達式",
    "query-placeholder": "輸入 JMESPath 表達式，例如 people[*].last",
    "examples-placeholder": "載入範例表達式",
    "format-json": "格式化 JSON",
    "import-from-file": "從檔案匯入"
  },
  "es": {
    "inputsTitle": "Entradas",
    "jsonLabel": "JSON",
    "json-placeholder": "Pega JSON aquí...",
    "queryLabel": "Expresión JMESPath",
    "query-placeholder": "Introduce una expresión JMESPath, p. ej. people[*].last",
    "examples-placeholder": "Cargar una expresión de ejemplo",
    "format-json": "Formatear JSON",
    "import-from-file": "Importar desde archivo"
  },
  "fr": {
    "inputsTitle": "Entrées",
    "jsonLabel": "JSON",
    "json-placeholder": "Collez du JSON ici...",
    "queryLabel": "Expression JMESPath",
    "query-placeholder": "Saisissez une expression JMESPath, par ex. people[*].last",
    "examples-placeholder": "Charger une expression d'exemple",
    "format-json": "Formatter le JSON",
    "import-from-file": "Importer depuis un fichier"
  },
  "de": {
    "inputsTitle": "Eingaben",
    "jsonLabel": "JSON",
    "json-placeholder": "JSON hier einfügen...",
    "queryLabel": "JMESPath-Ausdruck",
    "query-placeholder": "JMESPath-Ausdruck eingeben, z. B. people[*].last",
    "examples-placeholder": "Beispielausdruck laden",
    "format-json": "JSON formatieren",
    "import-from-file": "Aus Datei importieren"
  },
  "it": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Incolla JSON qui...",
    "queryLabel": "Espressione JMESPath",
    "query-placeholder": "Inserisci un'espressione JMESPath, ad es. people[*].last",
    "examples-placeholder": "Carica un'espressione di esempio",
    "format-json": "Formatta JSON",
    "import-from-file": "Importa da file"
  },
  "ja": {
    "inputsTitle": "入力",
    "jsonLabel": "JSON",
    "json-placeholder": "ここにJSONを貼り付け...",
    "queryLabel": "JMESPath 式",
    "query-placeholder": "JMESPath 式を入力（例: people[*].last）",
    "examples-placeholder": "例の式を読み込む",
    "format-json": "JSON を整形",
    "import-from-file": "ファイルからインポート"
  },
  "ko": {
    "inputsTitle": "입력",
    "jsonLabel": "JSON",
    "json-placeholder": "여기에 JSON 붙여넣기...",
    "queryLabel": "JMESPath 표현식",
    "query-placeholder": "JMESPath 표현식을 입력하세요(예: people[*].last)",
    "examples-placeholder": "예제 표현식 불러오기",
    "format-json": "JSON 서식 지정",
    "import-from-file": "파일에서 가져오기"
  },
  "ru": {
    "inputsTitle": "Ввод",
    "jsonLabel": "JSON",
    "json-placeholder": "Вставьте JSON здесь...",
    "queryLabel": "Выражение JMESPath",
    "query-placeholder": "Введите выражение JMESPath, например people[*].last",
    "examples-placeholder": "Загрузить пример выражения",
    "format-json": "Форматировать JSON",
    "import-from-file": "Импорт из файла"
  },
  "pt": {
    "inputsTitle": "Entradas",
    "jsonLabel": "JSON",
    "json-placeholder": "Cole JSON aqui...",
    "queryLabel": "Expressão JMESPath",
    "query-placeholder": "Digite uma expressão JMESPath, ex.: people[*].last",
    "examples-placeholder": "Carregar uma expressão de exemplo",
    "format-json": "Formatar JSON",
    "import-from-file": "Importar de arquivo"
  },
  "ar": {
    "inputsTitle": "المدخلات",
    "jsonLabel": "JSON",
    "json-placeholder": "الصق JSON هنا...",
    "queryLabel": "تعبير JMESPath",
    "query-placeholder": "أدخل تعبير JMESPath، مثل people[*].last",
    "examples-placeholder": "تحميل تعبير مثال",
    "format-json": "تنسيق JSON",
    "import-from-file": "استيراد من ملف"
  },
  "hi": {
    "inputsTitle": "इनपुट",
    "jsonLabel": "JSON",
    "json-placeholder": "यहाँ JSON चिपकाएँ...",
    "queryLabel": "JMESPath अभिव्यक्ति",
    "query-placeholder": "JMESPath अभिव्यक्ति दर्ज करें, जैसे people[*].last",
    "examples-placeholder": "उदाहरण अभिव्यक्ति लोड करें",
    "format-json": "JSON प्रारूपित करें",
    "import-from-file": "फ़ाइल से आयात करें"
  },
  "tr": {
    "inputsTitle": "Girdiler",
    "jsonLabel": "JSON",
    "json-placeholder": "JSON'u buraya yapıştırın...",
    "queryLabel": "JMESPath İfadesi",
    "query-placeholder": "JMESPath ifadesi girin, ör. people[*].last",
    "examples-placeholder": "Örnek ifade yükle",
    "format-json": "JSON'u biçimlendir",
    "import-from-file": "Dosyadan içe aktar"
  },
  "nl": {
    "inputsTitle": "Invoer",
    "jsonLabel": "JSON",
    "json-placeholder": "Plak hier JSON...",
    "queryLabel": "JMESPath-expressie",
    "query-placeholder": "Voer een JMESPath-expressie in, bijv. people[*].last",
    "examples-placeholder": "Voorbeeldexpressie laden",
    "format-json": "JSON opmaken",
    "import-from-file": "Importeren uit bestand"
  },
  "sv": {
    "inputsTitle": "Indata",
    "jsonLabel": "JSON",
    "json-placeholder": "Klistra in JSON här...",
    "queryLabel": "JMESPath-uttryck",
    "query-placeholder": "Ange ett JMESPath-uttryck, t.ex. people[*].last",
    "examples-placeholder": "Ladda ett exempeluttryck",
    "format-json": "Formatera JSON",
    "import-from-file": "Importera från fil"
  },
  "pl": {
    "inputsTitle": "Dane wejściowe",
    "jsonLabel": "JSON",
    "json-placeholder": "Wklej tutaj JSON...",
    "queryLabel": "Wyrażenie JMESPath",
    "query-placeholder": "Wpisz wyrażenie JMESPath, np. people[*].last",
    "examples-placeholder": "Wczytaj przykładowe wyrażenie",
    "format-json": "Formatuj JSON",
    "import-from-file": "Importuj z pliku"
  },
  "vi": {
    "inputsTitle": "Đầu vào",
    "jsonLabel": "JSON",
    "json-placeholder": "Dán JSON vào đây...",
    "queryLabel": "Biểu thức JMESPath",
    "query-placeholder": "Nhập biểu thức JMESPath, ví dụ people[*].last",
    "examples-placeholder": "Tải biểu thức mẫu",
    "format-json": "Định dạng JSON",
    "import-from-file": "Nhập từ tệp"
  },
  "th": {
    "inputsTitle": "ข้อมูลนำเข้า",
    "jsonLabel": "JSON",
    "json-placeholder": "วาง JSON ที่นี่...",
    "queryLabel": "นิพจน์ JMESPath",
    "query-placeholder": "ป้อนนิพจน์ JMESPath เช่น people[*].last",
    "examples-placeholder": "โหลดนิพจน์ตัวอย่าง",
    "format-json": "จัดรูปแบบ JSON",
    "import-from-file": "นำเข้าจากไฟล์"
  },
  "id": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Tempel JSON di sini...",
    "queryLabel": "Ekspresi JMESPath",
    "query-placeholder": "Masukkan ekspresi JMESPath, mis. people[*].last",
    "examples-placeholder": "Muat ekspresi contoh",
    "format-json": "Format JSON",
    "import-from-file": "Impor dari file"
  },
  "he": {
    "inputsTitle": "קלט",
    "jsonLabel": "JSON",
    "json-placeholder": "הדבק JSON כאן...",
    "queryLabel": "ביטוי JMESPath",
    "query-placeholder": "הזן ביטוי JMESPath, למשל people[*].last",
    "examples-placeholder": "טען ביטוי לדוגמה",
    "format-json": "פרמט JSON",
    "import-from-file": "ייבוא מקובץ"
  },
  "ms": {
    "inputsTitle": "Input",
    "jsonLabel": "JSON",
    "json-placeholder": "Tampal JSON di sini...",
    "queryLabel": "Ungkapan JMESPath",
    "query-placeholder": "Masukkan ungkapan JMESPath, cth. people[*].last",
    "examples-placeholder": "Muat ungkapan contoh",
    "format-json": "Format JSON",
    "import-from-file": "Import dari fail"
  },
  "no": {
    "inputsTitle": "Inndata",
    "jsonLabel": "JSON",
    "json-placeholder": "Lim inn JSON her...",
    "queryLabel": "JMESPath-uttrykk",
    "query-placeholder": "Skriv inn et JMESPath-uttrykk, f.eks. people[*].last",
    "examples-placeholder": "Last inn eksempeluttrykk",
    "format-json": "Formater JSON",
    "import-from-file": "Importer fra fil"
  }
}
</i18n>
