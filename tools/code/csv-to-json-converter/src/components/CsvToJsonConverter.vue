<template>
  <ToolSection>
    <n-flex align="center" justify="space-between">
      <n-flex align="center">
        <n-button @click="importFromFile" text>
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('import-from-file') }}
        </n-button>

        <n-button @click="showSettings = !showSettings" text>
          <template #icon>
            <n-icon :component="Settings16Regular" />
          </template>
          {{ t('opt-settings') }}
        </n-button>
      </n-flex>
      <n-flex>
        <CopyToClipboardButton :content="renderedJson" />
        <n-button tag="a" text :href="downloadUrl ?? undefined" download="converted.json">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-json') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>

  <n-collapse-transition :show="showSettings">
    <n-form label-placement="left" :show-feedback="false">
      <n-grid cols="1 s:2 m:3 l:4" responsive="screen" :x-gap="20" :y-gap="16">
        <n-form-item-gi :label="t('opt-noheader')">
          <n-switch v-model:value="noheader" size="small" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-headers')">
          <n-input v-model:value="headersText" size="small" :placeholder="t('opt-headers-ph')" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-delimiter')">
          <n-input v-model:value="delimiter" size="small" placeholder="," />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-quote')">
          <n-input v-model:value="quote" size="small" placeholder='"' />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-trim')">
          <n-switch v-model:value="trim" size="small" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-checkType')">
          <n-switch v-model:value="checkType" size="small" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-skipEmptyLines')">
          <n-select
            v-model:value="skipEmpty"
            size="small"
            :options="[
              { label: t('opt-skipEmptyLines-none'), value: 'none' },
              { label: t('opt-skipEmptyLines-true'), value: 'true' },
              { label: t('opt-skipEmptyLines-greedy'), value: 'greedy' },
            ]"
          />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-escapeChar')">
          <n-input v-model:value="escapeChar" size="small" placeholder='"' />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-newline')">
          <n-input v-model:value="newline" size="small" placeholder="auto" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-preview')">
          <n-input-number
            v-model:value="preview"
            :min="0"
            :max="1000000"
            size="small"
            style="width: 100%"
          />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-comments')">
          <n-input v-model:value="comments" size="small" :placeholder="t('opt-comments-ph')" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-fastMode')">
          <n-switch v-model:value="fastMode" size="small" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-skipFirstNLines')">
          <n-input-number
            v-model:value="skipFirstNLines"
            :min="0"
            :max="1000000"
            size="small"
            style="width: 100%"
          />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-delimitersToGuess')">
          <n-input
            v-model:value="delimitersToGuessText"
            size="small"
            :placeholder="t('opt-delimitersToGuess-ph')"
          />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-includeColumns')">
          <n-input v-model:value="includeColumns" size="small" :placeholder="t('opt-regex-ph')" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-ignoreColumns')">
          <n-input v-model:value="ignoreColumns" size="small" :placeholder="t('opt-regex-ph')" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('opt-spaces')">
          <n-input-number
            v-model:value="spaces"
            :min="0"
            :max="8"
            size="small"
            style="width: 100%"
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </n-collapse-transition>

  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('csv')" :show-feedback="false">
        <n-input
          v-model:value="csvText"
          type="textarea"
          autosize
          :placeholder="t('csv-placeholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('json')" :show-feedback="false">
        <n-card size="small">
          <n-code :code="renderedJson" language="json" :hljs="hljs" word-wrap></n-code>
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import Papa from 'papaparse'
import type { ParseResult } from 'papaparse'
import { useObjectUrl, useStorage } from '@vueuse/core'
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
  NInputNumber,
  NForm,
  NCollapseTransition,
  NSelect,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import Settings16Regular from '@vicons/fluent/Settings16Regular'
import hljs from 'highlight.js/lib/core'
import jsonLang from 'highlight.js/lib/languages/json'
import { fileOpen } from 'browser-fs-access'

hljs.registerLanguage('json', jsonLang)

const { t } = useI18n()

const csvText = useStorage<string>('csv2json:csvText', 'a,b,c\n1,2,3\n4,5,6')
const spaces = useStorage<number>('csv2json:spaces', 2)
const showSettings = useStorage<boolean>('csv2json:showSettings', false)

const noheader = useStorage<boolean>('csv2json:noheader', false)
const trim = useStorage<boolean>('csv2json:trim', true)
const checkType = useStorage<boolean>('csv2json:checkType', false)

const headersText = useStorage<string>('csv2json:headersText', '')
const delimiter = useStorage<string>('csv2json:delimiter', ',')
const quote = useStorage<string>('csv2json:quote', '"')
const includeColumns = useStorage<string>('csv2json:includeColumns', '')
const ignoreColumns = useStorage<string>('csv2json:ignoreColumns', '')
const skipEmpty = useStorage<'none' | 'true' | 'greedy'>('csv2json:skipEmpty', 'none')
const escapeChar = useStorage<string>('csv2json:escapeChar', '"')
type NewlineOption = '\n' | '\r' | '\r\n'
const newline = useStorage<NewlineOption | ''>('csv2json:newline', '')
const preview = useStorage<number>('csv2json:preview', 0)
const comments = useStorage<string>('csv2json:comments', '')
const fastMode = useStorage<boolean>('csv2json:fastMode', false)
const skipFirstNLines = useStorage<number>('csv2json:skipFirstNLines', 0)
const delimitersToGuessText = useStorage<string>('csv2json:delimitersToGuess', '')

const renderedJson = computed(() => {
  try {
    const hasCustomHeaders = noheader.value && headersText.value.trim().length > 0
    const effectiveHeader = !noheader.value || hasCustomHeaders
    const effectiveDelimiter = delimiter.value === 'auto' ? undefined : delimiter.value

    let input = csvText.value
    if (hasCustomHeaders) {
      const hdrs = headersText.value
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean)
        .join(effectiveDelimiter ?? ',')
      input = hdrs + '\n' + csvText.value
    }

    const result = Papa.parse(input, {
      delimiter: effectiveDelimiter,
      newline: (newline.value || undefined) as NewlineOption | undefined,
      quoteChar: quote.value,
      escapeChar: escapeChar.value || '"',
      header: effectiveHeader,
      dynamicTyping: checkType.value,
      fastMode: fastMode.value || undefined,
      skipEmptyLines:
        skipEmpty.value === 'none' ? false : skipEmpty.value === 'true' ? true : 'greedy',
      preview: preview.value > 0 ? preview.value : 0,
      comments: comments.value.trim() === '' ? false : comments.value,
      delimitersToGuess: delimitersToGuessText.value.trim()
        ? delimitersToGuessText.value
            .split(',')
            .map((s) => s.replace(/\\t/g, '\t').replace(/\\r/g, '\r').replace(/\\n/g, '\n'))
        : undefined,
      skipFirstNLines: skipFirstNLines.value > 0 ? skipFirstNLines.value : 0,
      transformHeader: trim.value ? (h) => (typeof h === 'string' ? h.trim() : h) : undefined,
      transform: trim.value ? (v) => (typeof v === 'string' ? v.trim() : v) : undefined,
    }) as ParseResult<unknown>

    let data = result.data as unknown[]

    // Filter columns if needed (only when parsed as objects)
    if (effectiveHeader && (includeColumns.value || ignoreColumns.value)) {
      const includeRe = includeColumns.value ? new RegExp(includeColumns.value) : undefined
      const ignoreRe = ignoreColumns.value ? new RegExp(ignoreColumns.value) : undefined
      data = (data as Record<string, unknown>[]).map((row) => {
        const out: Record<string, unknown> = {}
        for (const key in row) {
          if (includeRe && !includeRe.test(key)) continue
          if (ignoreRe && ignoreRe.test(key)) continue
          out[key] = row[key]
        }
        return out
      })
    }

    return JSON.stringify(data, null, spaces.value)
  } catch {
    return '// ' + t('invalid-csv')
  }
})

const downloadBlob = computed(
  () => new Blob([renderedJson.value], { type: 'application/json;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

async function importFromFile(): Promise<void> {
  const file = await fileOpen({
    extensions: ['.csv', '.txt'],
  })
  csvText.value = await file.text()
}
</script>

<i18n lang="json">
{
  "en": {
    "csv": "CSV",
    "csv-placeholder": "Paste CSV here...",
    "json": "JSON",
    "download-json": "Download JSON",
    "import-from-file": "Import from file",
    "invalid-csv": "Invalid CSV",
    "opt-settings": "Settings",
    "opt-noheader": "No header row",
    "opt-headers": "Headers",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Delimiter",
    "opt-quote": "Quote",
    "opt-trim": "Trim",
    "opt-checkType": "Check types",
    "opt-skipEmptyLines": "Skip empty lines",
    "opt-skipEmptyLines-none": "Don't skip",
    "opt-skipEmptyLines-true": "Skip empty",
    "opt-skipEmptyLines-greedy": "Skip greedy",
    "opt-escapeChar": "Escape char",
    "opt-newline": "Newline",
    "opt-preview": "Preview rows",
    "opt-comments": "Comments",
    "opt-comments-ph": "# or // or true",
    "opt-fastMode": "Fast mode",
    "opt-skipFirstNLines": "Skip first N lines",
    "opt-delimitersToGuess": "Delimiters to guess",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Include columns (regex)",
    "opt-ignoreColumns": "Ignore columns (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Spaces"
  },
  "zh": {
    "csv": "CSV",
    "csv-placeholder": "在此粘贴 CSV...",
    "json": "JSON",
    "download-json": "下载 JSON",
    "import-from-file": "从文件导入",
    "invalid-csv": "无效的 CSV",
    "opt-settings": "设置",
    "opt-noheader": "无表头",
    "opt-headers": "表头",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "分隔符",
    "opt-quote": "引号",
    "opt-trim": "裁剪",
    "opt-checkType": "检查类型",
    "opt-skipEmptyLines": "跳过空行",
    "opt-skipEmptyLines-none": "不跳过",
    "opt-skipEmptyLines-true": "跳过空行",
    "opt-skipEmptyLines-greedy": "贪婪跳过",
    "opt-escapeChar": "转义字符",
    "opt-newline": "换行符",
    "opt-preview": "预览行数",
    "opt-comments": "注释",
    "opt-comments-ph": "# 或 // 或 true",
    "opt-fastMode": "快速模式",
    "opt-skipFirstNLines": "跳过前 N 行",
    "opt-delimitersToGuess": "猜测分隔符",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "包含列(正则)",
    "opt-ignoreColumns": "忽略列(正则)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "缩进空格"
  },
  "zh-CN": {
    "csv": "CSV",
    "csv-placeholder": "在此粘贴 CSV...",
    "json": "JSON",
    "download-json": "下载 JSON",
    "import-from-file": "从文件导入",
    "invalid-csv": "无效的 CSV",
    "opt-settings": "设置",
    "opt-noheader": "无表头",
    "opt-headers": "表头",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "分隔符",
    "opt-quote": "引号",
    "opt-trim": "裁剪",
    "opt-checkType": "检查类型",
    "opt-skipEmptyLines": "跳过空行",
    "opt-skipEmptyLines-none": "不跳过",
    "opt-skipEmptyLines-true": "跳过空行",
    "opt-skipEmptyLines-greedy": "贪婪跳过",
    "opt-escapeChar": "转义字符",
    "opt-newline": "换行符",
    "opt-preview": "预览行数",
    "opt-comments": "注释",
    "opt-comments-ph": "# 或 // 或 true",
    "opt-fastMode": "快速模式",
    "opt-skipFirstNLines": "跳过前 N 行",
    "opt-delimitersToGuess": "猜测分隔符",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "包含列(正则)",
    "opt-ignoreColumns": "忽略列(正则)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "缩进空格"
  },
  "zh-TW": {
    "csv": "CSV",
    "csv-placeholder": "在此貼上 CSV...",
    "json": "JSON",
    "download-json": "下載 JSON",
    "import-from-file": "從檔案匯入",
    "invalid-csv": "無效的 CSV",
    "opt-settings": "設定",
    "opt-noheader": "無表頭",
    "opt-headers": "表頭",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "分隔符號",
    "opt-quote": "引號",
    "opt-trim": "裁剪",
    "opt-checkType": "檢查型別",
    "opt-skipEmptyLines": "跳過空行",
    "opt-skipEmptyLines-none": "不跳過",
    "opt-skipEmptyLines-true": "跳過空行",
    "opt-skipEmptyLines-greedy": "貪婪跳過",
    "opt-escapeChar": "轉義字元",
    "opt-newline": "換行符號",
    "opt-preview": "預覽行數",
    "opt-comments": "註解",
    "opt-comments-ph": "# 或 // 或 true",
    "opt-fastMode": "快速模式",
    "opt-skipFirstNLines": "跳過前 N 行",
    "opt-delimitersToGuess": "猜測分隔符號",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "包含欄(正則)",
    "opt-ignoreColumns": "忽略欄(正則)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "縮排空格"
  },
  "zh-HK": {
    "csv": "CSV",
    "csv-placeholder": "在此貼上 CSV...",
    "json": "JSON",
    "download-json": "下載 JSON",
    "import-from-file": "從檔案匯入",
    "invalid-csv": "無效的 CSV",
    "opt-settings": "設定",
    "opt-noheader": "無表頭",
    "opt-headers": "表頭",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "分隔符號",
    "opt-quote": "引號",
    "opt-trim": "裁剪",
    "opt-checkType": "檢查類型",
    "opt-skipEmptyLines": "跳過空行",
    "opt-skipEmptyLines-none": "不跳過",
    "opt-skipEmptyLines-true": "跳過空行",
    "opt-skipEmptyLines-greedy": "貪婪跳過",
    "opt-escapeChar": "轉義字元",
    "opt-newline": "換行符號",
    "opt-preview": "預覽行數",
    "opt-comments": "註解",
    "opt-comments-ph": "# 或 // 或 true",
    "opt-fastMode": "快速模式",
    "opt-skipFirstNLines": "跳過前 N 行",
    "opt-delimitersToGuess": "猜測分隔符號",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "包含欄(正則)",
    "opt-ignoreColumns": "忽略欄(正則)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "縮排空格"
  },
  "es": {
    "csv": "CSV",
    "csv-placeholder": "Pega CSV aquí...",
    "json": "JSON",
    "download-json": "Descargar JSON",
    "import-from-file": "Importar desde archivo",
    "invalid-csv": "CSV no válido",
    "opt-settings": "Configuración",
    "opt-noheader": "Sin encabezado",
    "opt-headers": "Encabezados",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Delimitador",
    "opt-quote": "Comillas",
    "opt-trim": "Recortar",
    "opt-checkType": "Verificar tipos",
    "opt-skipEmptyLines": "Omitir líneas vacías",
    "opt-skipEmptyLines-none": "No omitir",
    "opt-skipEmptyLines-true": "Omitir vacías",
    "opt-skipEmptyLines-greedy": "Omitir codiciosas",
    "opt-escapeChar": "Carácter de escape",
    "opt-newline": "Nueva línea",
    "opt-preview": "Filas de vista previa",
    "opt-comments": "Comentarios",
    "opt-comments-ph": "# o // o true",
    "opt-fastMode": "Modo rápido",
    "opt-skipFirstNLines": "Omitir primeras N líneas",
    "opt-delimitersToGuess": "Delimitadores a adivinar",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Incluir columnas (regex)",
    "opt-ignoreColumns": "Ignorar columnas (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Espacios"
  },
  "fr": {
    "csv": "CSV",
    "csv-placeholder": "Collez du CSV ici...",
    "json": "JSON",
    "download-json": "Télécharger le JSON",
    "import-from-file": "Importer depuis un fichier",
    "invalid-csv": "CSV invalide",
    "opt-settings": "Paramètres",
    "opt-noheader": "Sans en-tête",
    "opt-headers": "En-têtes",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Délimiteur",
    "opt-quote": "Guillemet",
    "opt-trim": "Rogner",
    "opt-checkType": "Vérifier les types",
    "opt-skipEmptyLines": "Ignorer lignes vides",
    "opt-skipEmptyLines-none": "Ne pas ignorer",
    "opt-skipEmptyLines-true": "Ignorer vides",
    "opt-skipEmptyLines-greedy": "Ignorer glouton",
    "opt-escapeChar": "Caractère d'échappement",
    "opt-newline": "Nouvelle ligne",
    "opt-preview": "Lignes d'aperçu",
    "opt-comments": "Commentaires",
    "opt-comments-ph": "# ou // ou true",
    "opt-fastMode": "Mode rapide",
    "opt-skipFirstNLines": "Ignorer les N premières lignes",
    "opt-delimitersToGuess": "Délimiteurs à deviner",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Inclure colonnes (regex)",
    "opt-ignoreColumns": "Ignorer colonnes (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Espaces"
  },
  "de": {
    "csv": "CSV",
    "csv-placeholder": "CSV hier einfügen...",
    "json": "JSON",
    "download-json": "JSON herunterladen",
    "import-from-file": "Aus Datei importieren",
    "invalid-csv": "Ungültiges CSV",
    "opt-settings": "Einstellungen",
    "opt-noheader": "Keine Kopfzeile",
    "opt-headers": "Kopfzeilen",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Trennzeichen",
    "opt-quote": "Anführungszeichen",
    "opt-trim": "Trimmen",
    "opt-checkType": "Typen prüfen",
    "opt-skipEmptyLines": "Leere Zeilen überspringen",
    "opt-skipEmptyLines-none": "Nicht überspringen",
    "opt-skipEmptyLines-true": "Leere überspringen",
    "opt-skipEmptyLines-greedy": "Gierig überspringen",
    "opt-escapeChar": "Escape-Zeichen",
    "opt-newline": "Zeilenumbruch",
    "opt-preview": "Vorschauzeilen",
    "opt-comments": "Kommentare",
    "opt-comments-ph": "# oder // oder true",
    "opt-fastMode": "Schnellmodus",
    "opt-skipFirstNLines": "Erste N Zeilen überspringen",
    "opt-delimitersToGuess": "Trennzeichen erraten",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Spalten einschl. (Regex)",
    "opt-ignoreColumns": "Spalten ausschl. (Regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Leerzeichen"
  },
  "it": {
    "csv": "CSV",
    "csv-placeholder": "Incolla CSV qui...",
    "json": "JSON",
    "download-json": "Scarica JSON",
    "import-from-file": "Importa da file",
    "invalid-csv": "CSV non valido",
    "opt-settings": "Impostazioni",
    "opt-noheader": "Senza intestazione",
    "opt-headers": "Intestazioni",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Delimitatore",
    "opt-quote": "Virgolette",
    "opt-trim": "Taglia",
    "opt-checkType": "Controlla tipi",
    "opt-skipEmptyLines": "Salta righe vuote",
    "opt-skipEmptyLines-none": "Non saltare",
    "opt-skipEmptyLines-true": "Salta vuote",
    "opt-skipEmptyLines-greedy": "Salta avido",
    "opt-escapeChar": "Carattere di escape",
    "opt-newline": "Nuova riga",
    "opt-preview": "Righe di anteprima",
    "opt-comments": "Commenti",
    "opt-comments-ph": "# o // o true",
    "opt-fastMode": "Modalità veloce",
    "opt-skipFirstNLines": "Salta prime N righe",
    "opt-delimitersToGuess": "Delimitatori da indovinare",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Includi colonne (regex)",
    "opt-ignoreColumns": "Ignora colonne (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Spazi"
  },
  "ja": {
    "csv": "CSV",
    "csv-placeholder": "ここにCSVを貼り付け...",
    "json": "JSON",
    "download-json": "JSONをダウンロード",
    "import-from-file": "ファイルからインポート",
    "invalid-csv": "無効なCSV",
    "opt-settings": "設定",
    "opt-noheader": "ヘッダーなし",
    "opt-headers": "ヘッダー",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "区切り",
    "opt-quote": "引用符",
    "opt-trim": "トリム",
    "opt-checkType": "型をチェック",
    "opt-skipEmptyLines": "空行をスキップ",
    "opt-skipEmptyLines-none": "スキップしない",
    "opt-skipEmptyLines-true": "空行をスキップ",
    "opt-skipEmptyLines-greedy": "貪欲にスキップ",
    "opt-escapeChar": "エスケープ文字",
    "opt-newline": "改行",
    "opt-preview": "プレビュー行数",
    "opt-comments": "コメント",
    "opt-comments-ph": "# または // または true",
    "opt-fastMode": "高速モード",
    "opt-skipFirstNLines": "最初のN行をスキップ",
    "opt-delimitersToGuess": "推測する区切り文字",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "含める列 (正規表現)",
    "opt-ignoreColumns": "無視する列 (正規表現)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "スペース"
  },
  "ko": {
    "csv": "CSV",
    "csv-placeholder": "여기에 CSV 붙여넣기...",
    "json": "JSON",
    "download-json": "JSON 다운로드",
    "import-from-file": "파일에서 가져오기",
    "invalid-csv": "유효하지 않은 CSV",
    "opt-settings": "설정",
    "opt-noheader": "헤더 없음",
    "opt-headers": "헤더",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "구분자",
    "opt-quote": "인용부호",
    "opt-trim": "트림",
    "opt-checkType": "타입 확인",
    "opt-skipEmptyLines": "빈 줄 건너뛰기",
    "opt-skipEmptyLines-none": "건너뛰지 않음",
    "opt-skipEmptyLines-true": "빈 줄 건너뛰기",
    "opt-skipEmptyLines-greedy": "탐욕적 건너뛰기",
    "opt-escapeChar": "이스케이프 문자",
    "opt-newline": "개행",
    "opt-preview": "미리보기 행수",
    "opt-comments": "주석",
    "opt-comments-ph": "# 또는 // 또는 true",
    "opt-fastMode": "고속 모드",
    "opt-skipFirstNLines": "처음 N줄 건너뛰기",
    "opt-delimitersToGuess": "추측할 구분자",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "포함 열 (정규식)",
    "opt-ignoreColumns": "무시 열 (정규식)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "공백"
  },
  "ru": {
    "csv": "CSV",
    "csv-placeholder": "Вставьте CSV здесь...",
    "json": "JSON",
    "download-json": "Скачать JSON",
    "import-from-file": "Импорт из файла",
    "invalid-csv": "Недопустимый CSV",
    "opt-settings": "Настройки",
    "opt-noheader": "Без заголовка",
    "opt-headers": "Заголовки",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Разделитель",
    "opt-quote": "Кавычка",
    "opt-trim": "Обрезать",
    "opt-checkType": "Проверка типов",
    "opt-skipEmptyLines": "Пропускать пустые строки",
    "opt-skipEmptyLines-none": "Не пропускать",
    "opt-skipEmptyLines-true": "Пропускать пустые",
    "opt-skipEmptyLines-greedy": "Жадно пропускать",
    "opt-escapeChar": "Символ экранирования",
    "opt-newline": "Новая строка",
    "opt-preview": "Строки предпросмотра",
    "opt-comments": "Комментарии",
    "opt-comments-ph": "# или // или true",
    "opt-fastMode": "Быстрый режим",
    "opt-skipFirstNLines": "Пропустить первые N строк",
    "opt-delimitersToGuess": "Разделители для угадывания",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Включать столбцы (regex)",
    "opt-ignoreColumns": "Игнорировать столбцы (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Пробелы"
  },
  "pt": {
    "csv": "CSV",
    "csv-placeholder": "Cole CSV aqui...",
    "json": "JSON",
    "download-json": "Baixar JSON",
    "import-from-file": "Importar de arquivo",
    "invalid-csv": "CSV inválido",
    "opt-settings": "Configurações",
    "opt-noheader": "Sem cabeçalho",
    "opt-headers": "Cabeçalhos",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Delimitador",
    "opt-quote": "Aspas",
    "opt-trim": "Aparar",
    "opt-checkType": "Verificar tipos",
    "opt-skipEmptyLines": "Pular linhas vazias",
    "opt-skipEmptyLines-none": "Não pular",
    "opt-skipEmptyLines-true": "Pular vazias",
    "opt-skipEmptyLines-greedy": "Pular ganancioso",
    "opt-escapeChar": "Caractere de escape",
    "opt-newline": "Nova linha",
    "opt-preview": "Linhas de visualização",
    "opt-comments": "Comentários",
    "opt-comments-ph": "# ou // ou true",
    "opt-fastMode": "Modo rápido",
    "opt-skipFirstNLines": "Pular primeiras N linhas",
    "opt-delimitersToGuess": "Delimitadores para adivinhar",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Incluir colunas (regex)",
    "opt-ignoreColumns": "Ignorar colunas (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Espaços"
  },
  "ar": {
    "csv": "CSV",
    "csv-placeholder": "الصق CSV هنا...",
    "json": "JSON",
    "download-json": "تنزيل JSON",
    "import-from-file": "استيراد من ملف",
    "invalid-csv": "CSV غير صالح",
    "opt-settings": "الإعدادات",
    "opt-noheader": "بدون ترويسة",
    "opt-headers": "الترويسات",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "الفاصل",
    "opt-quote": "علامة الاقتباس",
    "opt-trim": "تشذيب",
    "opt-checkType": "تحقق من الأنواع",
    "opt-skipEmptyLines": "تخطي الأسطر الفارغة",
    "opt-skipEmptyLines-none": "عدم التخطي",
    "opt-skipEmptyLines-true": "تخطي الفارغة",
    "opt-skipEmptyLines-greedy": "تخطي جشع",
    "opt-escapeChar": "رمز الهروب",
    "opt-newline": "سطر جديد",
    "opt-preview": "أسطر المعاينة",
    "opt-comments": "التعليقات",
    "opt-comments-ph": "# أو // أو true",
    "opt-fastMode": "الوضع السريع",
    "opt-skipFirstNLines": "تخطي أول N أسطر",
    "opt-delimitersToGuess": "الفواصل للتخمين",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "تضمين الأعمدة (regex)",
    "opt-ignoreColumns": "تجاهل الأعمدة (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "مسافات"
  },
  "hi": {
    "csv": "CSV",
    "csv-placeholder": "यहाँ CSV पेस्ट करें...",
    "json": "JSON",
    "download-json": "JSON डाउनलोड करें",
    "import-from-file": "फ़ाइल से आयात करें",
    "invalid-csv": "अमान्य CSV",
    "opt-settings": "सेटिंग्स",
    "opt-noheader": "हेडर नहीं",
    "opt-headers": "हेडर",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "विभाजक",
    "opt-quote": "उद्धरण",
    "opt-trim": "ट्रिम",
    "opt-checkType": "टाइप जाँचें",
    "opt-skipEmptyLines": "खाली पंक्तियाँ छोड़ें",
    "opt-skipEmptyLines-none": "न छोड़ें",
    "opt-skipEmptyLines-true": "खाली छोड़ें",
    "opt-skipEmptyLines-greedy": "लालची छोड़ें",
    "opt-escapeChar": "एस्केप चरित्र",
    "opt-newline": "नई पंक्ति",
    "opt-preview": "पूर्वावलोकन पंक्तियाँ",
    "opt-comments": "टिप्पणियाँ",
    "opt-comments-ph": "# या // या true",
    "opt-fastMode": "तेज़ मोड",
    "opt-skipFirstNLines": "पहली N पंक्तियाँ छोड़ें",
    "opt-delimitersToGuess": "अनुमान लगाने के लिए विभाजक",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "कॉलम शामिल (regex)",
    "opt-ignoreColumns": "कॉलम अनदेखा (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "स्पेसेज़"
  },
  "tr": {
    "csv": "CSV",
    "csv-placeholder": "Buraya CSV yapıştırın...",
    "json": "JSON",
    "download-json": "JSON İndir",
    "import-from-file": "Dosyadan içe aktar",
    "invalid-csv": "Geçersiz CSV",
    "opt-settings": "Ayarlar",
    "opt-noheader": "Başlıksız",
    "opt-headers": "Başlıklar",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Ayırıcı",
    "opt-quote": "Tırnak",
    "opt-trim": "Kırp",
    "opt-checkType": "Türleri kontrol et",
    "opt-skipEmptyLines": "Boş satırları atla",
    "opt-skipEmptyLines-none": "Atlama",
    "opt-skipEmptyLines-true": "Boşları atla",
    "opt-skipEmptyLines-greedy": "Açgözlü atla",
    "opt-escapeChar": "Kaçış karakteri",
    "opt-newline": "Yeni satır",
    "opt-preview": "Önizleme satırları",
    "opt-comments": "Yorumlar",
    "opt-comments-ph": "# veya // veya true",
    "opt-fastMode": "Hızlı mod",
    "opt-skipFirstNLines": "İlk N satırı atla",
    "opt-delimitersToGuess": "Tahmin edilecek ayırıcılar",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Dahil sütunlar (regex)",
    "opt-ignoreColumns": "Yoksay sütunlar (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Boşluk"
  },
  "nl": {
    "csv": "CSV",
    "csv-placeholder": "Plak hier CSV...",
    "json": "JSON",
    "download-json": "JSON downloaden",
    "import-from-file": "Importeren uit bestand",
    "invalid-csv": "Ongeldige CSV",
    "opt-settings": "Instellingen",
    "opt-noheader": "Geen kop",
    "opt-headers": "Koppen",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Scheidingsteken",
    "opt-quote": "Aanhalingsteken",
    "opt-trim": "Trimmen",
    "opt-checkType": "Typen controleren",
    "opt-skipEmptyLines": "Lege regels overslaan",
    "opt-skipEmptyLines-none": "Niet overslaan",
    "opt-skipEmptyLines-true": "Lege overslaan",
    "opt-skipEmptyLines-greedy": "Gulzig overslaan",
    "opt-escapeChar": "Escape-teken",
    "opt-newline": "Nieuwe regel",
    "opt-preview": "Voorbeeldregels",
    "opt-comments": "Opmerkingen",
    "opt-comments-ph": "# of // of true",
    "opt-fastMode": "Snelle modus",
    "opt-skipFirstNLines": "Eerste N regels overslaan",
    "opt-delimitersToGuess": "Te raden scheidingstekens",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Kolommen opnemen (regex)",
    "opt-ignoreColumns": "Kolommen negeren (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Spaties"
  },
  "sv": {
    "csv": "CSV",
    "csv-placeholder": "Klistra in CSV här...",
    "json": "JSON",
    "download-json": "Ladda ner JSON",
    "import-from-file": "Importera från fil",
    "invalid-csv": "Ogiltig CSV",
    "opt-settings": "Inställningar",
    "opt-noheader": "Ingen rubrik",
    "opt-headers": "Rubriker",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Avgränsare",
    "opt-quote": "Citattecken",
    "opt-trim": "Trimma",
    "opt-checkType": "Kontrollera typer",
    "opt-skipEmptyLines": "Hoppa över tomma rader",
    "opt-skipEmptyLines-none": "Hoppa inte över",
    "opt-skipEmptyLines-true": "Hoppa över tomma",
    "opt-skipEmptyLines-greedy": "Girigt hoppa över",
    "opt-escapeChar": "Escape-tecken",
    "opt-newline": "Ny rad",
    "opt-preview": "Förhandsvisningsrader",
    "opt-comments": "Kommentarer",
    "opt-comments-ph": "# eller // eller true",
    "opt-fastMode": "Snabbläge",
    "opt-skipFirstNLines": "Hoppa över första N rader",
    "opt-delimitersToGuess": "Avgränsare att gissa",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Inkludera kolumner (regex)",
    "opt-ignoreColumns": "Ignorera kolumner (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Blanksteg"
  },
  "pl": {
    "csv": "CSV",
    "csv-placeholder": "Wklej tutaj CSV...",
    "json": "JSON",
    "download-json": "Pobierz JSON",
    "import-from-file": "Importuj z pliku",
    "invalid-csv": "Nieprawidłowy CSV",
    "opt-settings": "Ustawienia",
    "opt-noheader": "Brak nagłówka",
    "opt-headers": "Nagłówki",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Separator",
    "opt-quote": "Cudzysłów",
    "opt-trim": "Przytnij",
    "opt-checkType": "Sprawdzaj typy",
    "opt-skipEmptyLines": "Pomiń puste wiersze",
    "opt-skipEmptyLines-none": "Nie pomijaj",
    "opt-skipEmptyLines-true": "Pomiń puste",
    "opt-skipEmptyLines-greedy": "Chciwie pomiń",
    "opt-escapeChar": "Znak ucieczki",
    "opt-newline": "Nowa linia",
    "opt-preview": "Wiersze podglądu",
    "opt-comments": "Komentarze",
    "opt-comments-ph": "# lub // lub true",
    "opt-fastMode": "Tryb szybki",
    "opt-skipFirstNLines": "Pomiń pierwsze N wierszy",
    "opt-delimitersToGuess": "Separatory do odgadnięcia",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Uwzględnij kolumny (regex)",
    "opt-ignoreColumns": "Ignoruj kolumny (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Spacje"
  },
  "vi": {
    "csv": "CSV",
    "csv-placeholder": "Dán CSV vào đây...",
    "json": "JSON",
    "download-json": "Tải JSON",
    "import-from-file": "Nhập từ tệp",
    "invalid-csv": "CSV không hợp lệ",
    "opt-settings": "Cài đặt",
    "opt-noheader": "Không có tiêu đề",
    "opt-headers": "Tiêu đề",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Dấu phân cách",
    "opt-quote": "Dấu ngoặc kép",
    "opt-trim": "Cắt gọn",
    "opt-checkType": "Kiểm tra kiểu",
    "opt-skipEmptyLines": "Bỏ qua dòng trống",
    "opt-skipEmptyLines-none": "Không bỏ qua",
    "opt-skipEmptyLines-true": "Bỏ qua trống",
    "opt-skipEmptyLines-greedy": "Bỏ qua tham lam",
    "opt-escapeChar": "Ký tự thoát",
    "opt-newline": "Dòng mới",
    "opt-preview": "Dòng xem trước",
    "opt-comments": "Bình luận",
    "opt-comments-ph": "# hoặc // hoặc true",
    "opt-fastMode": "Chế độ nhanh",
    "opt-skipFirstNLines": "Bỏ qua N dòng đầu",
    "opt-delimitersToGuess": "Dấu phân cách để đoán",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Bao gồm cột (regex)",
    "opt-ignoreColumns": "Bỏ qua cột (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Khoảng trắng"
  },
  "th": {
    "csv": "CSV",
    "csv-placeholder": "วาง CSV ที่นี่...",
    "json": "JSON",
    "download-json": "ดาวน์โหลด JSON",
    "import-from-file": "นำเข้าจากไฟล์",
    "invalid-csv": "CSV ไม่ถูกต้อง",
    "opt-settings": "การตั้งค่า",
    "opt-noheader": "ไม่มีส่วนหัว",
    "opt-headers": "ส่วนหัว",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "ตัวคั่น",
    "opt-quote": "อัญประกาศ",
    "opt-trim": "ตัดแต่ง",
    "opt-checkType": "ตรวจสอบชนิด",
    "opt-skipEmptyLines": "ข้ามบรรทัดว่าง",
    "opt-skipEmptyLines-none": "ไม่ข้าม",
    "opt-skipEmptyLines-true": "ข้ามว่าง",
    "opt-skipEmptyLines-greedy": "ข้ามโลภ",
    "opt-escapeChar": "ตัวอักษรหลบหนี",
    "opt-newline": "บรรทัดใหม่",
    "opt-preview": "บรรทัดแสดงตัวอย่าง",
    "opt-comments": "ความเห็น",
    "opt-comments-ph": "# หรือ // หรือ true",
    "opt-fastMode": "โหมดเร็ว",
    "opt-skipFirstNLines": "ข้าม N บรรทัดแรก",
    "opt-delimitersToGuess": "ตัวคั่นที่จะเดา",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "รวมคอลัมน์ (regex)",
    "opt-ignoreColumns": "ละเว้นคอลัมน์ (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "ช่องว่าง"
  },
  "id": {
    "csv": "CSV",
    "csv-placeholder": "Tempel CSV di sini...",
    "json": "JSON",
    "download-json": "Unduh JSON",
    "import-from-file": "Impor dari file",
    "invalid-csv": "CSV tidak valid",
    "opt-settings": "Pengaturan",
    "opt-noheader": "Tanpa header",
    "opt-headers": "Header",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Pemisah",
    "opt-quote": "Tanda kutip",
    "opt-trim": "Pangkas",
    "opt-checkType": "Periksa tipe",
    "opt-skipEmptyLines": "Lewati baris kosong",
    "opt-skipEmptyLines-none": "Jangan lewati",
    "opt-skipEmptyLines-true": "Lewati kosong",
    "opt-skipEmptyLines-greedy": "Lewati rakus",
    "opt-escapeChar": "Karakter escape",
    "opt-newline": "Baris baru",
    "opt-preview": "Baris pratinjau",
    "opt-comments": "Komentar",
    "opt-comments-ph": "# atau // atau true",
    "opt-fastMode": "Mode cepat",
    "opt-skipFirstNLines": "Lewati N baris pertama",
    "opt-delimitersToGuess": "Pemisah untuk ditebak",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Sertakan kolom (regex)",
    "opt-ignoreColumns": "Abaikan kolom (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Spasi"
  },
  "he": {
    "csv": "CSV",
    "csv-placeholder": "הדביקו CSV כאן...",
    "json": "JSON",
    "download-json": "הורד JSON",
    "import-from-file": "יבוא מקובץ",
    "invalid-csv": "CSV לא תקין",
    "opt-settings": "הגדרות",
    "opt-noheader": "ללא כותרת",
    "opt-headers": "כותרות",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "מפריד",
    "opt-quote": "גרשיים",
    "opt-trim": "חיתוך",
    "opt-checkType": "בדיקת סוגים",
    "opt-skipEmptyLines": "דלג על שורות ריקות",
    "opt-skipEmptyLines-none": "אל תדלג",
    "opt-skipEmptyLines-true": "דלג על ריקות",
    "opt-skipEmptyLines-greedy": "דלג חמדני",
    "opt-escapeChar": "תו בריחה",
    "opt-newline": "שורה חדשה",
    "opt-preview": "שורות תצוגה מקדימה",
    "opt-comments": "הערות",
    "opt-comments-ph": "# או // או true",
    "opt-fastMode": "מצב מהיר",
    "opt-skipFirstNLines": "דלג על N שורות ראשונות",
    "opt-delimitersToGuess": "מפרידים לניחוש",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "כלול עמודות (regex)",
    "opt-ignoreColumns": "התעלם מעמודות (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "רווחים"
  },
  "ms": {
    "csv": "CSV",
    "csv-placeholder": "Tampal CSV di sini...",
    "json": "JSON",
    "download-json": "Muat turun JSON",
    "import-from-file": "Import dari fail",
    "invalid-csv": "CSV tidak sah",
    "opt-settings": "Tetapan",
    "opt-noheader": "Tiada pengepala",
    "opt-headers": "Pengepala",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Pemisah",
    "opt-quote": "Petikan",
    "opt-trim": "Potong",
    "opt-checkType": "Periksa jenis",
    "opt-skipEmptyLines": "Langkau baris kosong",
    "opt-skipEmptyLines-none": "Jangan langkau",
    "opt-skipEmptyLines-true": "Langkau kosong",
    "opt-skipEmptyLines-greedy": "Langkau tamak",
    "opt-escapeChar": "Aksara pelarian",
    "opt-newline": "Baris baru",
    "opt-preview": "Baris pratonton",
    "opt-comments": "Komen",
    "opt-comments-ph": "# atau // atau true",
    "opt-fastMode": "Mod pantas",
    "opt-skipFirstNLines": "Langkau N baris pertama",
    "opt-delimitersToGuess": "Pemisah untuk diteka",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Sertakan lajur (regex)",
    "opt-ignoreColumns": "Abaikan lajur (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Ruang"
  },
  "no": {
    "csv": "CSV",
    "csv-placeholder": "Lim inn CSV her...",
    "json": "JSON",
    "download-json": "Last ned JSON",
    "import-from-file": "Importer fra fil",
    "invalid-csv": "Ugyldig CSV",
    "opt-settings": "Innstillinger",
    "opt-noheader": "Ingen overskrift",
    "opt-headers": "Overskrifter",
    "opt-headers-ph": "name,age,email",
    "opt-delimiter": "Skilletegn",
    "opt-quote": "Anførselstegn",
    "opt-trim": "Trim",
    "opt-checkType": "Sjekk typer",
    "opt-skipEmptyLines": "Hopp over tomme linjer",
    "opt-skipEmptyLines-none": "Ikke hopp over",
    "opt-skipEmptyLines-true": "Hopp over tomme",
    "opt-skipEmptyLines-greedy": "Grådig hopp over",
    "opt-escapeChar": "Escape-tegn",
    "opt-newline": "Ny linje",
    "opt-preview": "Forhåndsvisningslinjer",
    "opt-comments": "Kommentarer",
    "opt-comments-ph": "# eller // eller true",
    "opt-fastMode": "Rask modus",
    "opt-skipFirstNLines": "Hopp over første N linjer",
    "opt-delimitersToGuess": "Skilletegn å gjette",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Inkluder kolonner (regex)",
    "opt-ignoreColumns": "Ignorer kolonner (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Mellomrom"
  }
}
</i18n>
