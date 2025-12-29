<template>
  <ToolSection>
    <n-flex justify="space-between" align="center" :wrap="false">
      <n-flex align="center" :size="8">
        <n-button @click="importOriginal" text>
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('import-original') }}
        </n-button>
        <n-button @click="importModified" text>
          <template #icon>
            <n-icon :component="DocumentAdd16Regular" />
          </template>
          {{ t('import-modified') }}
        </n-button>
        <n-button @click="swapTexts" text>
          <template #icon>
            <n-icon :component="ArrowSwap20Regular" />
          </template>
          {{ t('swap') }}
        </n-button>
      </n-flex>

      <n-flex align="center" :size="8">
        <n-select
          v-model:value="language"
          :options="languageOptions"
          size="small"
          style="width: 140px"
        />
        <n-switch v-model:value="inlineView" size="small">
          <template #checked>{{ t('inline') }}</template>
          <template #unchecked>{{ t('side-by-side') }}</template>
        </n-switch>
      </n-flex>
    </n-flex>
  </ToolSection>

  <ToolSection>
    <div class="diff-editor-container">
      <VueMonacoDiffEditor
        v-model="modifiedText"
        :original="originalText"
        :language="language"
        :theme="isDark ? 'vs-dark' : 'vs'"
        :options="editorOptions"
        @mount="handleEditorMount"
      />
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOsTheme, NButton, NIcon, NFlex, NSelect, NSwitch } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { Document16Regular, DocumentAdd16Regular, ArrowSwap20Regular } from '@shared/icons/fluent'
import { fileOpen } from 'browser-fs-access'
import { loader, VueMonacoDiffEditor } from '@guolao/vue-monaco-editor'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// Configure Monaco workers
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') return new jsonWorker()
    if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker()
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker()
    if (label === 'typescript' || label === 'javascript') return new tsWorker()
    return new editorWorker()
  },
}
loader.config({ monaco })

const { t } = useI18n()
const osTheme = useOsTheme()
const isDark = computed(() => osTheme.value === 'dark')

const originalText = ref(`// Original text
function hello() {
  console.log("Hello, World!");
}
`)

const modifiedText = ref(`// Modified text
function hello() {
  console.log("Hello, Monaco!");
}

function goodbye() {
  console.log("Goodbye!");
}
`)

const language = ref('javascript')
const inlineView = ref(false)

const diffEditorRef = shallowRef<monaco.editor.IStandaloneDiffEditor | null>(null)

const editorOptions = computed(() => ({
  automaticLayout: true,
  readOnly: false,
  renderSideBySide: !inlineView.value,
  originalEditable: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on' as const,
  fontSize: 14,
  lineNumbers: 'on' as const,
  folding: true,
  renderWhitespace: 'selection' as const,
}))

const languageOptions = [
  { label: 'Plain Text', value: 'plaintext' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JSON', value: 'json' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C/C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'SQL', value: 'sql' },
  { label: 'XML', value: 'xml' },
  { label: 'YAML', value: 'yaml' },
  { label: 'Shell', value: 'shell' },
]

function handleEditorMount(editor: monaco.editor.IStandaloneDiffEditor) {
  diffEditorRef.value = editor
}

async function importOriginal(): Promise<void> {
  try {
    const file = await fileOpen({
      description: 'Text files',
      extensions: ['.txt', '.md', '.json', '.js', '.ts', '.html', '.css', '.xml', '.yaml', '.yml'],
    })
    originalText.value = await file.text()
    detectLanguage(file.name)
  } catch {
    // User cancelled
  }
}

async function importModified(): Promise<void> {
  try {
    const file = await fileOpen({
      description: 'Text files',
      extensions: ['.txt', '.md', '.json', '.js', '.ts', '.html', '.css', '.xml', '.yaml', '.yml'],
    })
    modifiedText.value = await file.text()
    detectLanguage(file.name)
  } catch {
    // User cancelled
  }
}

function detectLanguage(filename: string): void {
  const ext = filename.split('.').pop()?.toLowerCase()
  const langMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    json: 'json',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    md: 'markdown',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'cpp',
    h: 'cpp',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    sql: 'sql',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    sh: 'shell',
    bash: 'shell',
  }
  if (ext && langMap[ext]) {
    language.value = langMap[ext]
  }
}

function swapTexts(): void {
  const temp = originalText.value
  originalText.value = modifiedText.value
  modifiedText.value = temp
}

onBeforeUnmount(() => {
  diffEditorRef.value?.dispose()
})
</script>

<style scoped>
.diff-editor-container {
  height: 500px;
  border: 1px solid var(--n-border-color);
  border-radius: 4px;
  overflow: hidden;
}
</style>

<i18n lang="json">
{
  "en": {
    "import-original": "Import Original",
    "import-modified": "Import Modified",
    "swap": "Swap",
    "inline": "Inline",
    "side-by-side": "Side by Side"
  },
  "zh": {
    "import-original": "导入原文件",
    "import-modified": "导入新文件",
    "swap": "交换",
    "inline": "内联",
    "side-by-side": "并排"
  },
  "zh-CN": {
    "import-original": "导入原文件",
    "import-modified": "导入新文件",
    "swap": "交换",
    "inline": "内联",
    "side-by-side": "并排"
  },
  "zh-TW": {
    "import-original": "匯入原始檔案",
    "import-modified": "匯入修改檔案",
    "swap": "交換",
    "inline": "內嵌",
    "side-by-side": "並排"
  },
  "zh-HK": {
    "import-original": "匯入原始檔案",
    "import-modified": "匯入修改檔案",
    "swap": "交換",
    "inline": "內嵌",
    "side-by-side": "並排"
  },
  "es": {
    "import-original": "Importar Original",
    "import-modified": "Importar Modificado",
    "swap": "Intercambiar",
    "inline": "En línea",
    "side-by-side": "Lado a lado"
  },
  "fr": {
    "import-original": "Importer l'Original",
    "import-modified": "Importer le Modifié",
    "swap": "Échanger",
    "inline": "En ligne",
    "side-by-side": "Côte à côte"
  },
  "de": {
    "import-original": "Original importieren",
    "import-modified": "Geändert importieren",
    "swap": "Tauschen",
    "inline": "Inline",
    "side-by-side": "Nebeneinander"
  },
  "it": {
    "import-original": "Importa Originale",
    "import-modified": "Importa Modificato",
    "swap": "Scambia",
    "inline": "In linea",
    "side-by-side": "Affiancato"
  },
  "ja": {
    "import-original": "元ファイルを読み込み",
    "import-modified": "変更ファイルを読み込み",
    "swap": "入れ替え",
    "inline": "インライン",
    "side-by-side": "並列表示"
  },
  "ko": {
    "import-original": "원본 가져오기",
    "import-modified": "수정본 가져오기",
    "swap": "교환",
    "inline": "인라인",
    "side-by-side": "나란히"
  },
  "ru": {
    "import-original": "Импорт оригинала",
    "import-modified": "Импорт изменённого",
    "swap": "Поменять",
    "inline": "Встроенный",
    "side-by-side": "Рядом"
  },
  "pt": {
    "import-original": "Importar Original",
    "import-modified": "Importar Modificado",
    "swap": "Trocar",
    "inline": "Em linha",
    "side-by-side": "Lado a lado"
  },
  "ar": {
    "import-original": "استيراد الأصلي",
    "import-modified": "استيراد المعدل",
    "swap": "تبديل",
    "inline": "مضمن",
    "side-by-side": "جنبًا إلى جنب"
  },
  "hi": {
    "import-original": "मूल आयात करें",
    "import-modified": "संशोधित आयात करें",
    "swap": "अदला-बदली",
    "inline": "इनलाइन",
    "side-by-side": "साथ-साथ"
  },
  "tr": {
    "import-original": "Orijinali İçe Aktar",
    "import-modified": "Değiştirilmişi İçe Aktar",
    "swap": "Değiştir",
    "inline": "Satır İçi",
    "side-by-side": "Yan Yana"
  },
  "nl": {
    "import-original": "Origineel Importeren",
    "import-modified": "Gewijzigd Importeren",
    "swap": "Wisselen",
    "inline": "Inline",
    "side-by-side": "Naast elkaar"
  },
  "sv": {
    "import-original": "Importera Original",
    "import-modified": "Importera Ändrad",
    "swap": "Byt",
    "inline": "Inline",
    "side-by-side": "Sida vid sida"
  },
  "pl": {
    "import-original": "Importuj Oryginał",
    "import-modified": "Importuj Zmodyfikowany",
    "swap": "Zamień",
    "inline": "W linii",
    "side-by-side": "Obok siebie"
  },
  "vi": {
    "import-original": "Nhập Bản Gốc",
    "import-modified": "Nhập Bản Sửa",
    "swap": "Hoán đổi",
    "inline": "Nội tuyến",
    "side-by-side": "Song song"
  },
  "th": {
    "import-original": "นำเข้าต้นฉบับ",
    "import-modified": "นำเข้าที่แก้ไข",
    "swap": "สลับ",
    "inline": "แบบแถว",
    "side-by-side": "เคียงข้าง"
  },
  "id": {
    "import-original": "Impor Asli",
    "import-modified": "Impor Diubah",
    "swap": "Tukar",
    "inline": "Sebaris",
    "side-by-side": "Berdampingan"
  },
  "he": {
    "import-original": "ייבא מקורי",
    "import-modified": "ייבא מעודכן",
    "swap": "החלף",
    "inline": "בשורה",
    "side-by-side": "זה לצד זה"
  },
  "ms": {
    "import-original": "Import Asal",
    "import-modified": "Import Diubah",
    "swap": "Tukar",
    "inline": "Sebaris",
    "side-by-side": "Bersebelahan"
  },
  "no": {
    "import-original": "Importer Original",
    "import-modified": "Importer Endret",
    "swap": "Bytt",
    "inline": "Inline",
    "side-by-side": "Side om side"
  }
}
</i18n>
