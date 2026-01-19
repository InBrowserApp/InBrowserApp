<template>
  <ToolSectionHeader>{{ t('input-title') }}</ToolSectionHeader>
  <ToolSection>
    <TextOrFileInput
      v-model:value="textOrFile"
      :placeholder="t('input-placeholder')"
      accept="text/*,.txt,.log,.md,.json,.csv,.yaml,.yml"
    />
  </ToolSection>

  <ToolSectionHeader>{{ t('categories-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-form-item :label="t('categories-label')" :show-feedback="false">
      <n-checkbox-group v-model:value="selectedCategories" class="category-group">
        <n-checkbox v-for="category in categories" :key="category.value" :value="category.value">
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys -->
          {{ t(category.labelKey) }}
        </n-checkbox>
      </n-checkbox-group>
    </n-form-item>
  </ToolSection>

  <ToolSectionHeader>{{ t('results-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex align="center" :size="8" wrap>
      <n-tag :type="matchCount ? 'warning' : 'success'" size="small">
        {{ t('summary-found', { count: matchCount }) }}
      </n-tag>
      <n-text depth="3">{{ t('summary-clean-length', { count: cleanedLength }) }}</n-text>
    </n-flex>
    <n-flex v-show="matchCount" align="center" :size="8" wrap class="category-tags">
      <n-tag v-for="category in tagCategories" :key="category.value" size="small">
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys -->
        {{ t(category.labelKey) }}: {{ counts[category.value] }}
      </n-tag>
    </n-flex>

    <n-text v-show="hasInput && !matchCount" depth="3" class="empty-state">
      {{ t('empty-state') }}
    </n-text>

    <n-grid cols="1 m:2" responsive="screen" :x-gap="12" :y-gap="12" class="output-grid">
      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <n-flex align="center" justify="space-between" class="output-label">
            <span>{{ t('cleaned-title') }}</span>
            <n-flex align="center" :size="8" class="output-actions">
              <CopyToClipboardButton :content="cleanedText" />
              <n-button
                tag="a"
                text
                :href="downloadUrl"
                download="cleaned.txt"
                :disabled="!cleanedText"
              >
                <template #icon>
                  <n-icon :component="ArrowDownload16Regular" />
                </template>
                {{ t('download-cleaned') }}
              </n-button>
            </n-flex>
          </n-flex>
        </template>
        <n-input
          :value="cleanedText"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 14 }"
          readonly
        />
      </n-form-item-gi>

      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <n-flex align="center" justify="space-between" class="output-label">
            <span>{{ t('annotated-title') }}</span>
            <n-flex align="center" :size="8" class="output-actions">
              <CopyToClipboardButton :content="annotatedText" />
              <n-button
                tag="a"
                text
                :href="annotatedDownloadUrl"
                download="annotated.txt"
                :disabled="!annotatedText"
              >
                <template #icon>
                  <n-icon :component="ArrowDownload16Regular" />
                </template>
                {{ t('download-annotated') }}
              </n-button>
            </n-flex>
          </n-flex>
        </template>
        <n-input
          :value="annotatedText"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 14 }"
          readonly
        />
      </n-form-item-gi>
    </n-grid>

    <div v-show="matchCount" class="results-table">
      <n-text depth="3">{{ t('table-title') }}</n-text>
      <n-data-table :columns="columns" :data="matches" :bordered="false" size="small" />
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { computedAsync, useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NDataTable,
  NFlex,
  NFormItem,
  NFormItemGi,
  NGrid,
  NIcon,
  NInput,
  NTag,
  NText,
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { ArrowDownload16Regular } from '@shared/icons/fluent'
import { CopyToClipboardButton, TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import {
  INVISIBLE_CATEGORIES,
  scanInvisibleCharacters,
  type InvisibleCategory,
  type InvisibleMatch,
} from '../utils'

const { t } = useI18n()

const defaultText = [
  'Hello\u200BWorld',
  'Price:\u00A0123\u202FUSD',
  'Order\u00ADID: 42',
  'Direction\u200E/LTR\u200FRTL',
].join('\n')

const storedText = useStorage('tools:unicode-invisible-character-checker:text', defaultText)
const textOrFile = ref<string | File>(storedText.value)
const selectedCategories = useStorage<InvisibleCategory[]>(
  'tools:unicode-invisible-character-checker:categories',
  INVISIBLE_CATEGORIES.map((entry) => entry.value),
)
const isReading = ref(false)

const sourceText = computedAsync(
  async () => {
    const input = textOrFile.value
    if (typeof input === 'string') return input
    return input.text()
  },
  '',
  isReading,
)

watch(textOrFile, (value) => {
  if (typeof value === 'string') {
    storedText.value = value
  }
})

watch(storedText, (value) => {
  if (typeof textOrFile.value === 'string') {
    textOrFile.value = value
  }
})

const categories = INVISIBLE_CATEGORIES
const tagCategories = computed(() =>
  categories.filter((category) => selectedCategories.value.includes(category.value)),
)
const enabledCategories = computed(() => new Set(selectedCategories.value))

const scanResult = computed(() =>
  scanInvisibleCharacters(sourceText.value, enabledCategories.value),
)
const matches = computed(() => scanResult.value.matches)
const counts = computed(() => scanResult.value.counts)
const matchCount = computed(() => matches.value.length)
const cleanedText = computed(() => scanResult.value.cleanedText)
const annotatedText = computed(() => scanResult.value.annotatedText)
const cleanedLength = computed(() => cleanedText.value.length)
const hasInput = computed(() => sourceText.value.length > 0)

const downloadBlob = computed(
  () => new Blob([cleanedText.value], { type: 'text/plain;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)
const annotatedBlob = computed(
  () => new Blob([annotatedText.value], { type: 'text/plain;charset=utf-8' }),
)
const annotatedDownloadUrl = useObjectUrl(annotatedBlob)

const categoryLabels = computed<Record<InvisibleCategory, string>>(() => ({
  'zero-width': t('category.zero-width'),
  'bidi-control': t('category.bidi-control'),
  'space-like': t('category.space-like'),
  format: t('category.format'),
}))

const columns = computed<DataTableColumns<InvisibleMatch>>(() => [
  { title: t('column-index'), key: 'index' },
  { title: t('column-line'), key: 'line' },
  { title: t('column-column'), key: 'column' },
  {
    title: t('column-code'),
    key: 'code',
    render: (row) => h(NText, { code: true }, () => row.code),
  },
  {
    title: t('column-name'),
    key: 'name',
    render: (row) => h(NText, { code: true }, () => row.name),
  },
  {
    title: t('column-category'),
    key: 'category',
    render: (row) => categoryLabels.value[row.category],
  },
  {
    title: t('column-preview'),
    key: 'token',
    render: (row) => h(NText, { code: true }, () => row.token),
  },
])
</script>

<style scoped>
.category-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-tags {
  margin-top: 8px;
}

.output-grid {
  margin-top: 12px;
}

.output-label {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  width: 100%;
}

.output-actions {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  gap: 8px;
}

:deep(.n-form-item-label__text) {
  display: block;
  width: 100%;
}

.results-table {
  margin-top: 16px;
  display: grid;
  gap: 8px;
}

.empty-state {
  display: block;
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "input-title": "Input",
    "input-placeholder": "Paste or type text to scan...",
    "categories-title": "Detection",
    "categories-label": "Include categories",
    "category.zero-width": "Zero-width",
    "category.bidi-control": "Bidi control",
    "category.space-like": "Special spaces",
    "category.format": "Format controls",
    "results-title": "Results",
    "summary-found": "Detected {count} characters",
    "summary-clean-length": "Cleaned length: {count}",
    "cleaned-title": "Cleaned text",
    "download-cleaned": "Download cleaned text",
    "download-annotated": "Download annotated preview",
    "annotated-title": "Annotated preview",
    "table-title": "Findings",
    "column-index": "Index",
    "column-line": "Line",
    "column-column": "Column",
    "column-code": "Code",
    "column-name": "Name",
    "column-category": "Category",
    "column-preview": "Preview",
    "empty-state": "No invisible or bidi characters detected"
  },
  "zh": {
    "input-title": "输入",
    "input-placeholder": "粘贴或输入要扫描的文本...",
    "categories-title": "检测",
    "categories-label": "包含类别",
    "category.zero-width": "零宽",
    "category.bidi-control": "双向控制",
    "category.space-like": "特殊空格",
    "category.format": "格式控制",
    "results-title": "结果",
    "summary-found": "检测到 {count} 个字符",
    "summary-clean-length": "清理后长度：{count}",
    "cleaned-title": "清理后的文本",
    "download-cleaned": "下载清理文本",
    "download-annotated": "下载标注预览",
    "annotated-title": "标注预览",
    "table-title": "发现项",
    "column-index": "索引",
    "column-line": "行",
    "column-column": "列",
    "column-code": "代码",
    "column-name": "名称",
    "column-category": "类别",
    "column-preview": "预览",
    "empty-state": "未检测到不可见或双向控制字符"
  },
  "zh-CN": {
    "input-title": "输入",
    "input-placeholder": "粘贴或输入要扫描的文本...",
    "categories-title": "检测",
    "categories-label": "包含类别",
    "category.zero-width": "零宽",
    "category.bidi-control": "双向控制",
    "category.space-like": "特殊空格",
    "category.format": "格式控制",
    "results-title": "结果",
    "summary-found": "检测到 {count} 个字符",
    "summary-clean-length": "清理后长度：{count}",
    "cleaned-title": "清理后的文本",
    "download-cleaned": "下载清理文本",
    "download-annotated": "下载标注预览",
    "annotated-title": "标注预览",
    "table-title": "发现项",
    "column-index": "索引",
    "column-line": "行",
    "column-column": "列",
    "column-code": "代码",
    "column-name": "名称",
    "column-category": "类别",
    "column-preview": "预览",
    "empty-state": "未检测到不可见或双向控制字符"
  },
  "zh-TW": {
    "input-title": "輸入",
    "input-placeholder": "貼上或輸入要掃描的文字...",
    "categories-title": "偵測",
    "categories-label": "包含類別",
    "category.zero-width": "零寬",
    "category.bidi-control": "雙向控制",
    "category.space-like": "特殊空白",
    "category.format": "格式控制",
    "results-title": "結果",
    "summary-found": "偵測到 {count} 個字元",
    "summary-clean-length": "清理後長度：{count}",
    "cleaned-title": "清理後的文字",
    "download-cleaned": "下載清理文字",
    "download-annotated": "下載標註預覽",
    "annotated-title": "標註預覽",
    "table-title": "發現項目",
    "column-index": "索引",
    "column-line": "行",
    "column-column": "欄",
    "column-code": "碼位",
    "column-name": "名稱",
    "column-category": "類別",
    "column-preview": "預覽",
    "empty-state": "未偵測到不可見或雙向控制字元"
  },
  "zh-HK": {
    "input-title": "輸入",
    "input-placeholder": "貼上或輸入要掃描的文字...",
    "categories-title": "偵測",
    "categories-label": "包含類別",
    "category.zero-width": "零寬",
    "category.bidi-control": "雙向控制",
    "category.space-like": "特殊空白",
    "category.format": "格式控制",
    "results-title": "結果",
    "summary-found": "偵測到 {count} 個字元",
    "summary-clean-length": "清理後長度：{count}",
    "cleaned-title": "清理後的文字",
    "download-cleaned": "下載清理文字",
    "download-annotated": "下載標註預覽",
    "annotated-title": "標註預覽",
    "table-title": "發現項目",
    "column-index": "索引",
    "column-line": "行",
    "column-column": "欄",
    "column-code": "碼位",
    "column-name": "名稱",
    "column-category": "類別",
    "column-preview": "預覽",
    "empty-state": "未偵測到不可見或雙向控制字元"
  },
  "es": {
    "input-title": "Entrada",
    "input-placeholder": "Pegue o escriba el texto para escanear...",
    "categories-title": "Detección",
    "categories-label": "Incluir categorías",
    "category.zero-width": "Cero ancho",
    "category.bidi-control": "Control bidi",
    "category.space-like": "Espacios especiales",
    "category.format": "Controles de formato",
    "results-title": "Resultados",
    "summary-found": "Detectados {count} caracteres",
    "summary-clean-length": "Longitud limpia: {count}",
    "cleaned-title": "Texto limpio",
    "download-cleaned": "Descargar texto limpio",
    "download-annotated": "Descargar vista anotada",
    "annotated-title": "Vista anotada",
    "table-title": "Hallazgos",
    "column-index": "Índice",
    "column-line": "Línea",
    "column-column": "Columna",
    "column-code": "Código",
    "column-name": "Nombre",
    "column-category": "Categoría",
    "column-preview": "Vista previa",
    "empty-state": "No se detectaron caracteres invisibles o bidi"
  },
  "fr": {
    "input-title": "Entrée",
    "input-placeholder": "Collez ou saisissez le texte à analyser...",
    "categories-title": "Détection",
    "categories-label": "Inclure des catégories",
    "category.zero-width": "Zéro largeur",
    "category.bidi-control": "Contrôle bidi",
    "category.space-like": "Espaces spéciaux",
    "category.format": "Contrôles de format",
    "results-title": "Résultats",
    "summary-found": "{count} caractères détectés",
    "summary-clean-length": "Longueur nettoyée : {count}",
    "cleaned-title": "Texte nettoyé",
    "download-cleaned": "Télécharger le texte nettoyé",
    "download-annotated": "Télécharger l'aperçu annoté",
    "annotated-title": "Aperçu annoté",
    "table-title": "Résultats",
    "column-index": "Index",
    "column-line": "Ligne",
    "column-column": "Colonne",
    "column-code": "Code",
    "column-name": "Nom",
    "column-category": "Catégorie",
    "column-preview": "Aperçu",
    "empty-state": "Aucun caractère invisible ou bidi détecté"
  },
  "de": {
    "input-title": "Eingabe",
    "input-placeholder": "Text zum Scannen einfügen oder eingeben...",
    "categories-title": "Erkennung",
    "categories-label": "Kategorien einschließen",
    "category.zero-width": "Nullbreite",
    "category.bidi-control": "Bidi-Steuerung",
    "category.space-like": "Sonderabstände",
    "category.format": "Formatsteuerzeichen",
    "results-title": "Ergebnisse",
    "summary-found": "{count} Zeichen erkannt",
    "summary-clean-length": "Bereinigte Länge: {count}",
    "cleaned-title": "Bereinigter Text",
    "download-cleaned": "Bereinigten Text herunterladen",
    "download-annotated": "Annotierte Vorschau herunterladen",
    "annotated-title": "Annotierte Vorschau",
    "table-title": "Funde",
    "column-index": "Index",
    "column-line": "Zeile",
    "column-column": "Spalte",
    "column-code": "Code",
    "column-name": "Name",
    "column-category": "Kategorie",
    "column-preview": "Vorschau",
    "empty-state": "Keine unsichtbaren oder bidi-Zeichen erkannt"
  },
  "it": {
    "input-title": "Input",
    "input-placeholder": "Incolla o digita il testo da analizzare...",
    "categories-title": "Rilevamento",
    "categories-label": "Includi categorie",
    "category.zero-width": "Zero-width",
    "category.bidi-control": "Controllo bidi",
    "category.space-like": "Spazi speciali",
    "category.format": "Controlli di formato",
    "results-title": "Risultati",
    "summary-found": "Rilevati {count} caratteri",
    "summary-clean-length": "Lunghezza pulita: {count}",
    "cleaned-title": "Testo pulito",
    "download-cleaned": "Scarica testo pulito",
    "download-annotated": "Scarica anteprima annotata",
    "annotated-title": "Anteprima annotata",
    "table-title": "Risultati",
    "column-index": "Indice",
    "column-line": "Riga",
    "column-column": "Colonna",
    "column-code": "Codice",
    "column-name": "Nome",
    "column-category": "Categoria",
    "column-preview": "Anteprima",
    "empty-state": "Nessun carattere invisibile o bidi rilevato"
  },
  "ja": {
    "input-title": "入力",
    "input-placeholder": "スキャンするテキストを貼り付けまたは入力...",
    "categories-title": "検出",
    "categories-label": "カテゴリを含める",
    "category.zero-width": "ゼロ幅",
    "category.bidi-control": "双方向制御",
    "category.space-like": "特殊スペース",
    "category.format": "書式制御",
    "results-title": "結果",
    "summary-found": "{count} 文字を検出",
    "summary-clean-length": "クリーン長さ: {count}",
    "cleaned-title": "クリーンなテキスト",
    "download-cleaned": "クリーンテキストをダウンロード",
    "download-annotated": "注釈付きプレビューをダウンロード",
    "annotated-title": "注釈付きプレビュー",
    "table-title": "検出結果",
    "column-index": "インデックス",
    "column-line": "行",
    "column-column": "列",
    "column-code": "コード",
    "column-name": "名前",
    "column-category": "カテゴリ",
    "column-preview": "プレビュー",
    "empty-state": "不可視または双方向制御文字は検出されませんでした"
  },
  "ko": {
    "input-title": "입력",
    "input-placeholder": "스캔할 텍스트를 붙여넣거나 입력하세요...",
    "categories-title": "감지",
    "categories-label": "카테고리 포함",
    "category.zero-width": "제로 폭",
    "category.bidi-control": "양방향 제어",
    "category.space-like": "특수 공백",
    "category.format": "서식 제어",
    "results-title": "결과",
    "summary-found": "{count}개 문자를 감지",
    "summary-clean-length": "정리된 길이: {count}",
    "cleaned-title": "정리된 텍스트",
    "download-cleaned": "정리된 텍스트 다운로드",
    "download-annotated": "주석 미리보기 다운로드",
    "annotated-title": "주석 미리보기",
    "table-title": "감지 결과",
    "column-index": "인덱스",
    "column-line": "줄",
    "column-column": "열",
    "column-code": "코드",
    "column-name": "이름",
    "column-category": "카테고리",
    "column-preview": "미리보기",
    "empty-state": "보이지 않거나 양방향 제어 문자가 없습니다"
  },
  "ru": {
    "input-title": "Ввод",
    "input-placeholder": "Вставьте или введите текст для проверки...",
    "categories-title": "Обнаружение",
    "categories-label": "Включить категории",
    "category.zero-width": "Нулевой ширины",
    "category.bidi-control": "Bidi-контроль",
    "category.space-like": "Специальные пробелы",
    "category.format": "Форматирующие",
    "results-title": "Результаты",
    "summary-found": "Обнаружено {count} символов",
    "summary-clean-length": "Очищенная длина: {count}",
    "cleaned-title": "Очищенный текст",
    "download-cleaned": "Скачать очищенный текст",
    "download-annotated": "Скачать аннотированный просмотр",
    "annotated-title": "Аннотированный просмотр",
    "table-title": "Найдено",
    "column-index": "Индекс",
    "column-line": "Строка",
    "column-column": "Столбец",
    "column-code": "Код",
    "column-name": "Имя",
    "column-category": "Категория",
    "column-preview": "Превью",
    "empty-state": "Невидимые или bidi-символы не обнаружены"
  },
  "pt": {
    "input-title": "Entrada",
    "input-placeholder": "Cole ou digite o texto para analisar...",
    "categories-title": "Detecção",
    "categories-label": "Incluir categorias",
    "category.zero-width": "Largura zero",
    "category.bidi-control": "Controle bidi",
    "category.space-like": "Espaços especiais",
    "category.format": "Controles de formato",
    "results-title": "Resultados",
    "summary-found": "Detectados {count} caracteres",
    "summary-clean-length": "Comprimento limpo: {count}",
    "cleaned-title": "Texto limpo",
    "download-cleaned": "Baixar texto limpo",
    "download-annotated": "Baixar pré-visualização anotada",
    "annotated-title": "Pré-visualização anotada",
    "table-title": "Achados",
    "column-index": "Índice",
    "column-line": "Linha",
    "column-column": "Coluna",
    "column-code": "Código",
    "column-name": "Nome",
    "column-category": "Categoria",
    "column-preview": "Prévia",
    "empty-state": "Nenhum caractere invisível ou bidi detectado"
  },
  "ar": {
    "input-title": "الإدخال",
    "input-placeholder": "الصق أو اكتب النص للفحص...",
    "categories-title": "الكشف",
    "categories-label": "تضمين الفئات",
    "category.zero-width": "عديم العرض",
    "category.bidi-control": "تحكم ثنائي الاتجاه",
    "category.space-like": "مسافات خاصة",
    "category.format": "عناصر تحكم التنسيق",
    "results-title": "النتائج",
    "summary-found": "تم اكتشاف {count} حرفًا",
    "summary-clean-length": "الطول بعد التنظيف: {count}",
    "cleaned-title": "نص نظيف",
    "download-cleaned": "تنزيل النص النظيف",
    "download-annotated": "تنزيل المعاينة مع تعليقات",
    "annotated-title": "معاينة مع تعليقات",
    "table-title": "الاكتشافات",
    "column-index": "الفهرس",
    "column-line": "السطر",
    "column-column": "العمود",
    "column-code": "الكود",
    "column-name": "الاسم",
    "column-category": "الفئة",
    "column-preview": "معاينة",
    "empty-state": "لم يتم اكتشاف أحرف غير مرئية أو ثنائية الاتجاه"
  },
  "hi": {
    "input-title": "इनपुट",
    "input-placeholder": "स्कैन करने के लिए टेक्स्ट पेस्ट या टाइप करें...",
    "categories-title": "पता लगाना",
    "categories-label": "श्रेणियां शामिल करें",
    "category.zero-width": "शून्य-चौड़ाई",
    "category.bidi-control": "बिडी नियंत्रण",
    "category.space-like": "विशेष स्पेस",
    "category.format": "फ़ॉर्मैट नियंत्रण",
    "results-title": "परिणाम",
    "summary-found": "{count} वर्ण पाए गए",
    "summary-clean-length": "साफ़ लंबाई: {count}",
    "cleaned-title": "साफ़ किया गया टेक्स्ट",
    "download-cleaned": "साफ़ टेक्स्ट डाउनलोड करें",
    "download-annotated": "एनोटेटेड पूर्वावलोकन डाउनलोड करें",
    "annotated-title": "एनोटेटेड पूर्वावलोकन",
    "table-title": "मिले हुए",
    "column-index": "सूचकांक",
    "column-line": "पंक्ति",
    "column-column": "स्तंभ",
    "column-code": "कोड",
    "column-name": "नाम",
    "column-category": "श्रेणी",
    "column-preview": "पूर्वावलोकन",
    "empty-state": "कोई अदृश्य या बिडी वर्ण नहीं मिले"
  },
  "tr": {
    "input-title": "Girdi",
    "input-placeholder": "Taranacak metni yapıştırın veya yazın...",
    "categories-title": "Algılama",
    "categories-label": "Kategorileri dahil et",
    "category.zero-width": "Sıfır genişlik",
    "category.bidi-control": "Bidi kontrol",
    "category.space-like": "Özel boşluklar",
    "category.format": "Biçim denetimleri",
    "results-title": "Sonuçlar",
    "summary-found": "{count} karakter tespit edildi",
    "summary-clean-length": "Temiz uzunluk: {count}",
    "cleaned-title": "Temizlenmiş metin",
    "download-cleaned": "Temizlenmiş metni indir",
    "download-annotated": "Açıklamalı önizlemeyi indir",
    "annotated-title": "Açıklamalı önizleme",
    "table-title": "Bulunanlar",
    "column-index": "Dizin",
    "column-line": "Satır",
    "column-column": "Sütun",
    "column-code": "Kod",
    "column-name": "Ad",
    "column-category": "Kategori",
    "column-preview": "Önizleme",
    "empty-state": "Görünmez veya bidi karakter bulunamadı"
  },
  "nl": {
    "input-title": "Invoer",
    "input-placeholder": "Plak of typ tekst om te scannen...",
    "categories-title": "Detectie",
    "categories-label": "Categorieën opnemen",
    "category.zero-width": "Nulbreedte",
    "category.bidi-control": "Bidi-besturing",
    "category.space-like": "Speciale spaties",
    "category.format": "Opmaakbesturing",
    "results-title": "Resultaten",
    "summary-found": "{count} tekens gedetecteerd",
    "summary-clean-length": "Schone lengte: {count}",
    "cleaned-title": "Schone tekst",
    "download-cleaned": "Schone tekst downloaden",
    "download-annotated": "Geannoteerd voorbeeld downloaden",
    "annotated-title": "Geannoteerd voorbeeld",
    "table-title": "Vondsten",
    "column-index": "Index",
    "column-line": "Regel",
    "column-column": "Kolom",
    "column-code": "Code",
    "column-name": "Naam",
    "column-category": "Categorie",
    "column-preview": "Voorbeeld",
    "empty-state": "Geen onzichtbare of bidi-tekens gedetecteerd"
  },
  "sv": {
    "input-title": "Indata",
    "input-placeholder": "Klistra in eller skriv text att skanna...",
    "categories-title": "Upptäckt",
    "categories-label": "Inkludera kategorier",
    "category.zero-width": "Nollbredd",
    "category.bidi-control": "Bidi-kontroll",
    "category.space-like": "Speciella blanksteg",
    "category.format": "Formatkontroller",
    "results-title": "Resultat",
    "summary-found": "{count} tecken upptäckta",
    "summary-clean-length": "Rensad längd: {count}",
    "cleaned-title": "Rensad text",
    "download-cleaned": "Ladda ner rensad text",
    "download-annotated": "Ladda ner annoterad förhandsvisning",
    "annotated-title": "Annoterad förhandsvisning",
    "table-title": "Fynd",
    "column-index": "Index",
    "column-line": "Rad",
    "column-column": "Kolumn",
    "column-code": "Kod",
    "column-name": "Namn",
    "column-category": "Kategori",
    "column-preview": "Förhandsvisning",
    "empty-state": "Inga osynliga eller bidi-tecken hittades"
  },
  "pl": {
    "input-title": "Wejście",
    "input-placeholder": "Wklej lub wpisz tekst do skanowania...",
    "categories-title": "Wykrywanie",
    "categories-label": "Uwzględnij kategorie",
    "category.zero-width": "Zerowa szerokość",
    "category.bidi-control": "Kontrola bidi",
    "category.space-like": "Specjalne spacje",
    "category.format": "Kontrole formatu",
    "results-title": "Wyniki",
    "summary-found": "Wykryto {count} znaków",
    "summary-clean-length": "Oczyszczona długość: {count}",
    "cleaned-title": "Oczyszczony tekst",
    "download-cleaned": "Pobierz oczyszczony tekst",
    "download-annotated": "Pobierz podgląd z adnotacjami",
    "annotated-title": "Podgląd z adnotacjami",
    "table-title": "Znalezione",
    "column-index": "Indeks",
    "column-line": "Wiersz",
    "column-column": "Kolumna",
    "column-code": "Kod",
    "column-name": "Nazwa",
    "column-category": "Kategoria",
    "column-preview": "Podgląd",
    "empty-state": "Nie wykryto niewidocznych ani bidi znaków"
  },
  "vi": {
    "input-title": "Đầu vào",
    "input-placeholder": "Dán hoặc nhập văn bản để quét...",
    "categories-title": "Phát hiện",
    "categories-label": "Bao gồm danh mục",
    "category.zero-width": "Không độ rộng",
    "category.bidi-control": "Điều khiển bidi",
    "category.space-like": "Khoảng trắng đặc biệt",
    "category.format": "Điều khiển định dạng",
    "results-title": "Kết quả",
    "summary-found": "Phát hiện {count} ký tự",
    "summary-clean-length": "Độ dài đã làm sạch: {count}",
    "cleaned-title": "Văn bản đã làm sạch",
    "download-cleaned": "Tải văn bản đã làm sạch",
    "download-annotated": "Tải bản xem trước có chú thích",
    "annotated-title": "Xem trước có chú thích",
    "table-title": "Phát hiện",
    "column-index": "Chỉ mục",
    "column-line": "Dòng",
    "column-column": "Cột",
    "column-code": "Mã",
    "column-name": "Tên",
    "column-category": "Danh mục",
    "column-preview": "Xem trước",
    "empty-state": "Không phát hiện ký tự ẩn hoặc bidi"
  },
  "th": {
    "input-title": "อินพุต",
    "input-placeholder": "วางหรือพิมพ์ข้อความเพื่อสแกน...",
    "categories-title": "การตรวจจับ",
    "categories-label": "รวมหมวดหมู่",
    "category.zero-width": "กว้างศูนย์",
    "category.bidi-control": "การควบคุมไบดิ",
    "category.space-like": "ช่องว่างพิเศษ",
    "category.format": "การควบคุมรูปแบบ",
    "results-title": "ผลลัพธ์",
    "summary-found": "ตรวจพบ {count} อักขระ",
    "summary-clean-length": "ความยาวที่ทำความสะอาดแล้ว: {count}",
    "cleaned-title": "ข้อความที่ทำความสะอาดแล้ว",
    "download-cleaned": "ดาวน์โหลดข้อความที่ทำความสะอาดแล้ว",
    "download-annotated": "ดาวน์โหลดตัวอย่างที่มีคำอธิบาย",
    "annotated-title": "ตัวอย่างที่มีคำอธิบาย",
    "table-title": "รายการที่พบ",
    "column-index": "ดัชนี",
    "column-line": "บรรทัด",
    "column-column": "คอลัมน์",
    "column-code": "รหัส",
    "column-name": "ชื่อ",
    "column-category": "หมวดหมู่",
    "column-preview": "ตัวอย่าง",
    "empty-state": "ไม่พบอักขระที่มองไม่เห็นหรือไบดิ"
  },
  "id": {
    "input-title": "Masukan",
    "input-placeholder": "Tempel atau ketik teks untuk dipindai...",
    "categories-title": "Deteksi",
    "categories-label": "Sertakan kategori",
    "category.zero-width": "Lebar nol",
    "category.bidi-control": "Kontrol bidi",
    "category.space-like": "Spasi khusus",
    "category.format": "Kontrol format",
    "results-title": "Hasil",
    "summary-found": "Terdeteksi {count} karakter",
    "summary-clean-length": "Panjang bersih: {count}",
    "cleaned-title": "Teks bersih",
    "download-cleaned": "Unduh teks bersih",
    "download-annotated": "Unduh pratinjau beranotasi",
    "annotated-title": "Pratinjau beranotasi",
    "table-title": "Temuan",
    "column-index": "Indeks",
    "column-line": "Baris",
    "column-column": "Kolom",
    "column-code": "Kode",
    "column-name": "Nama",
    "column-category": "Kategori",
    "column-preview": "Pratinjau",
    "empty-state": "Tidak ada karakter tak terlihat atau bidi terdeteksi"
  },
  "he": {
    "input-title": "קלט",
    "input-placeholder": "הדבק או הקלד טקסט לסריקה...",
    "categories-title": "זיהוי",
    "categories-label": "כלול קטגוריות",
    "category.zero-width": "רוחב אפס",
    "category.bidi-control": "בקרת bidi",
    "category.space-like": "רווחים מיוחדים",
    "category.format": "בקרות עיצוב",
    "results-title": "תוצאות",
    "summary-found": "זוהו {count} תווים",
    "summary-clean-length": "אורך נקי: {count}",
    "cleaned-title": "טקסט נקי",
    "download-cleaned": "הורד טקסט נקי",
    "download-annotated": "הורד תצוגה מוערת",
    "annotated-title": "תצוגה מוערת",
    "table-title": "ממצאים",
    "column-index": "אינדקס",
    "column-line": "שורה",
    "column-column": "עמודה",
    "column-code": "קוד",
    "column-name": "שם",
    "column-category": "קטגוריה",
    "column-preview": "תצוגה",
    "empty-state": "לא זוהו תווים בלתי נראים או bidi"
  },
  "ms": {
    "input-title": "Input",
    "input-placeholder": "Tampal atau taip teks untuk diimbas...",
    "categories-title": "Pengesanan",
    "categories-label": "Sertakan kategori",
    "category.zero-width": "Lebar sifar",
    "category.bidi-control": "Kawalan bidi",
    "category.space-like": "Ruang khas",
    "category.format": "Kawalan format",
    "results-title": "Keputusan",
    "summary-found": "{count} aksara dikesan",
    "summary-clean-length": "Panjang bersih: {count}",
    "cleaned-title": "Teks bersih",
    "download-cleaned": "Muat turun teks bersih",
    "download-annotated": "Muat turun pratonton beranotasi",
    "annotated-title": "Pratonton beranotasi",
    "table-title": "Dapatan",
    "column-index": "Indeks",
    "column-line": "Baris",
    "column-column": "Lajur",
    "column-code": "Kod",
    "column-name": "Nama",
    "column-category": "Kategori",
    "column-preview": "Pratonton",
    "empty-state": "Tiada aksara tidak kelihatan atau bidi dikesan"
  },
  "no": {
    "input-title": "Inndata",
    "input-placeholder": "Lim inn eller skriv tekst som skal skannes...",
    "categories-title": "Deteksjon",
    "categories-label": "Inkluder kategorier",
    "category.zero-width": "Nullbredde",
    "category.bidi-control": "Bidi-kontroll",
    "category.space-like": "Spesielle mellomrom",
    "category.format": "Formateringskontroller",
    "results-title": "Resultater",
    "summary-found": "Oppdaget {count} tegn",
    "summary-clean-length": "Renset lengde: {count}",
    "cleaned-title": "Renset tekst",
    "download-cleaned": "Last ned renset tekst",
    "download-annotated": "Last ned annotert forhåndsvisning",
    "annotated-title": "Annotert forhåndsvisning",
    "table-title": "Funn",
    "column-index": "Indeks",
    "column-line": "Linje",
    "column-column": "Kolonne",
    "column-code": "Kode",
    "column-name": "Navn",
    "column-category": "Kategori",
    "column-preview": "Forhåndsvisning",
    "empty-state": "Ingen usynlige eller bidi-tegn oppdaget"
  }
}
</i18n>
