<template>
  <CspParserSection
    :input="parserInput"
    :input-status="parserStatus"
    :input-error="parserError"
    :directives="parsedDirectives"
    :labels="labels"
    :can-apply-parsed="canApplyParsed"
    @update:input="parserInput = $event"
    @apply-parsed="applyParsedDirectives"
  />

  <CspBuilderSection
    :directives="safeBuilderDirectives"
    :generated-policy="generatedPolicy"
    :has-output="hasOutput"
    :labels="labels"
    @add="addDirective"
    @remove="removeDirective"
    @update-name="updateDirectiveName"
    @update-values="updateDirectiveValues"
  />
</template>

<script setup lang="ts">
import type { FormValidationStatus } from 'naive-ui'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { parseCsp, stringifyCsp, textToValues, valuesToText } from '../utils/csp'
import CspBuilderSection from './CspBuilderSection.vue'
import type { BuilderDirective } from './CspBuilderSection.vue'
import CspParserSection from './CspParserSection.vue'

const { t } = useI18n()

const createDirective = (name = '', valuesText = ''): BuilderDirective => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name,
  valuesText,
})

const parserInput = useStorage('tools:csp-generator-parser:parser', '')
const builderDirectives = useStorage<BuilderDirective[]>('tools:csp-generator-parser:builder', [
  createDirective('default-src', "'self'"),
])

const parsedDirectives = computed(() => parseCsp(parserInput.value))
const canApplyParsed = computed(() => parsedDirectives.value.length > 0)

const parserError = computed(() => parserInput.value.trim().length === 0)
const parserStatus = computed<FormValidationStatus | undefined>(() =>
  parserError.value ? 'error' : undefined,
)

const safeBuilderDirectives = computed<BuilderDirective[]>(() =>
  Array.isArray(builderDirectives.value) ? builderDirectives.value : [],
)

const normalizedBuilder = computed(() =>
  safeBuilderDirectives.value
    .map((directive) => ({
      name: directive.name.trim(),
      values: textToValues(directive.valuesText),
    }))
    .filter((directive) => directive.name.length > 0),
)

const generatedPolicy = computed(() => stringifyCsp(normalizedBuilder.value))
const hasOutput = computed(() => generatedPolicy.value.trim().length > 0)

const labels = computed(() => ({
  parserTitle: t('parser-title'),
  parserLabel: t('parser-label'),
  parserPlaceholder: t('parser-placeholder'),
  parserError: t('parser-error'),
  parsedTitle: t('parsed-title'),
  parsedEmpty: t('parsed-empty'),
  noValues: t('no-values'),
  applyParsed: t('apply-parsed'),
  builderTitle: t('builder-title'),
  directiveName: t('directive-name'),
  directiveValues: t('directive-values'),
  namePlaceholder: t('name-placeholder'),
  valuesPlaceholder: t('values-placeholder'),
  addDirective: t('add-directive'),
  removeDirective: t('remove-directive'),
  outputTitle: t('output-title'),
  outputLabel: t('output-label'),
  outputEmpty: t('output-empty'),
}))

const addDirective = () => {
  builderDirectives.value = [...safeBuilderDirectives.value, createDirective()]
}

const removeDirective = (id: string) => {
  const next = safeBuilderDirectives.value.filter((directive) => directive.id !== id)
  builderDirectives.value = next.length === 0 ? [createDirective()] : next
}

const updateDirectiveName = (id: string, value: string) => {
  const index = safeBuilderDirectives.value.findIndex((directive) => directive.id === id)
  if (index === -1) return

  const current = safeBuilderDirectives.value[index]!
  const next = [...safeBuilderDirectives.value]
  next[index] = { ...current, name: value }
  builderDirectives.value = next
}

const updateDirectiveValues = (id: string, value: string) => {
  const index = safeBuilderDirectives.value.findIndex((directive) => directive.id === id)
  if (index === -1) return

  const current = safeBuilderDirectives.value[index]!
  const next = [...safeBuilderDirectives.value]
  next[index] = { ...current, valuesText: value }
  builderDirectives.value = next
}

const applyParsedDirectives = () => {
  if (!canApplyParsed.value) return

  builderDirectives.value = parsedDirectives.value.map((directive) =>
    createDirective(directive.name, valuesToText(directive.values)),
  )
}
</script>

<i18n lang="json">
{
  "en": {
    "parser-title": "CSP Parser",
    "parser-label": "CSP Header",
    "parser-placeholder": "Paste a Content-Security-Policy header value...",
    "parser-error": "Enter a CSP header to parse.",
    "parsed-title": "Parsed Directives",
    "parsed-empty": "Enter a CSP header to see parsed directives.",
    "no-values": "No values",
    "apply-parsed": "Use parsed directives",
    "builder-title": "CSP Generator",
    "directive-name": "Directive",
    "directive-values": "Values",
    "name-placeholder": "e.g. default-src",
    "values-placeholder": "e.g. 'self' https://cdn.example.com",
    "add-directive": "Add directive",
    "remove-directive": "Remove",
    "output-title": "Generated Policy",
    "output-label": "CSP Output",
    "output-empty": "Add directives to generate a CSP header."
  },
  "zh": {
    "parser-title": "CSP 解析",
    "parser-label": "CSP 头部",
    "parser-placeholder": "粘贴 Content-Security-Policy 头部内容...",
    "parser-error": "请输入要解析的 CSP 头部。",
    "parsed-title": "解析结果",
    "parsed-empty": "输入 CSP 头部以查看解析结果。",
    "no-values": "无值",
    "apply-parsed": "使用解析结果",
    "builder-title": "CSP 生成",
    "directive-name": "指令",
    "directive-values": "值",
    "name-placeholder": "例如 default-src",
    "values-placeholder": "例如 'self' https://cdn.example.com",
    "add-directive": "添加指令",
    "remove-directive": "移除",
    "output-title": "生成结果",
    "output-label": "CSP 输出",
    "output-empty": "添加指令以生成 CSP 头部。"
  },
  "zh-CN": {
    "parser-title": "CSP 解析",
    "parser-label": "CSP 头部",
    "parser-placeholder": "粘贴 Content-Security-Policy 头部内容...",
    "parser-error": "请输入要解析的 CSP 头部。",
    "parsed-title": "解析结果",
    "parsed-empty": "输入 CSP 头部以查看解析结果。",
    "no-values": "无值",
    "apply-parsed": "使用解析结果",
    "builder-title": "CSP 生成",
    "directive-name": "指令",
    "directive-values": "值",
    "name-placeholder": "例如 default-src",
    "values-placeholder": "例如 'self' https://cdn.example.com",
    "add-directive": "添加指令",
    "remove-directive": "移除",
    "output-title": "生成结果",
    "output-label": "CSP 输出",
    "output-empty": "添加指令以生成 CSP 头部。"
  },
  "zh-TW": {
    "parser-title": "CSP 解析",
    "parser-label": "CSP 標頭",
    "parser-placeholder": "貼上 Content-Security-Policy 標頭內容...",
    "parser-error": "請輸入要解析的 CSP 標頭。",
    "parsed-title": "解析結果",
    "parsed-empty": "輸入 CSP 標頭以查看解析結果。",
    "no-values": "無值",
    "apply-parsed": "使用解析結果",
    "builder-title": "CSP 產生",
    "directive-name": "指令",
    "directive-values": "值",
    "name-placeholder": "例如 default-src",
    "values-placeholder": "例如 'self' https://cdn.example.com",
    "add-directive": "新增指令",
    "remove-directive": "移除",
    "output-title": "產生結果",
    "output-label": "CSP 輸出",
    "output-empty": "新增指令以產生 CSP 標頭。"
  },
  "zh-HK": {
    "parser-title": "CSP 解析",
    "parser-label": "CSP 標頭",
    "parser-placeholder": "貼上 Content-Security-Policy 標頭內容...",
    "parser-error": "請輸入要解析的 CSP 標頭。",
    "parsed-title": "解析結果",
    "parsed-empty": "輸入 CSP 標頭以查看解析結果。",
    "no-values": "無值",
    "apply-parsed": "使用解析結果",
    "builder-title": "CSP 產生",
    "directive-name": "指令",
    "directive-values": "值",
    "name-placeholder": "例如 default-src",
    "values-placeholder": "例如 'self' https://cdn.example.com",
    "add-directive": "新增指令",
    "remove-directive": "移除",
    "output-title": "產生結果",
    "output-label": "CSP 輸出",
    "output-empty": "新增指令以產生 CSP 標頭。"
  },
  "es": {
    "parser-title": "Analizador CSP",
    "parser-label": "Encabezado CSP",
    "parser-placeholder": "Pega el valor del encabezado Content-Security-Policy...",
    "parser-error": "Introduce un encabezado CSP para analizar.",
    "parsed-title": "Directivas analizadas",
    "parsed-empty": "Introduce un encabezado CSP para ver las directivas analizadas.",
    "no-values": "Sin valores",
    "apply-parsed": "Usar directivas analizadas",
    "builder-title": "Generador CSP",
    "directive-name": "Directiva",
    "directive-values": "Valores",
    "name-placeholder": "p. ej. default-src",
    "values-placeholder": "p. ej. 'self' https://cdn.example.com",
    "add-directive": "Añadir directiva",
    "remove-directive": "Eliminar",
    "output-title": "Política generada",
    "output-label": "Salida CSP",
    "output-empty": "Añade directivas para generar un encabezado CSP."
  },
  "fr": {
    "parser-title": "Analyseur CSP",
    "parser-label": "En-tête CSP",
    "parser-placeholder": "Collez la valeur de l'en-tête Content-Security-Policy...",
    "parser-error": "Saisissez un en-tête CSP à analyser.",
    "parsed-title": "Directives analysées",
    "parsed-empty": "Saisissez un en-tête CSP pour voir les directives analysées.",
    "no-values": "Aucune valeur",
    "apply-parsed": "Utiliser les directives analysées",
    "builder-title": "Générateur CSP",
    "directive-name": "Directive",
    "directive-values": "Valeurs",
    "name-placeholder": "ex. default-src",
    "values-placeholder": "ex. 'self' https://cdn.example.com",
    "add-directive": "Ajouter une directive",
    "remove-directive": "Supprimer",
    "output-title": "Politique générée",
    "output-label": "Sortie CSP",
    "output-empty": "Ajoutez des directives pour générer un en-tête CSP."
  },
  "de": {
    "parser-title": "CSP-Parser",
    "parser-label": "CSP-Header",
    "parser-placeholder": "Füge den Content-Security-Policy-Header ein...",
    "parser-error": "Gib einen CSP-Header zum Parsen ein.",
    "parsed-title": "Geparste Direktiven",
    "parsed-empty": "Gib einen CSP-Header ein, um Direktiven zu sehen.",
    "no-values": "Keine Werte",
    "apply-parsed": "Geparste Direktiven übernehmen",
    "builder-title": "CSP-Generator",
    "directive-name": "Direktive",
    "directive-values": "Werte",
    "name-placeholder": "z. B. default-src",
    "values-placeholder": "z. B. 'self' https://cdn.example.com",
    "add-directive": "Direktive hinzufügen",
    "remove-directive": "Entfernen",
    "output-title": "Generierte Richtlinie",
    "output-label": "CSP-Ausgabe",
    "output-empty": "Füge Direktiven hinzu, um einen CSP-Header zu erzeugen."
  },
  "it": {
    "parser-title": "Parser CSP",
    "parser-label": "Header CSP",
    "parser-placeholder": "Incolla il valore dell'header Content-Security-Policy...",
    "parser-error": "Inserisci un header CSP da analizzare.",
    "parsed-title": "Direttive analizzate",
    "parsed-empty": "Inserisci un header CSP per vedere le direttive.",
    "no-values": "Nessun valore",
    "apply-parsed": "Usa direttive analizzate",
    "builder-title": "Generatore CSP",
    "directive-name": "Direttiva",
    "directive-values": "Valori",
    "name-placeholder": "es. default-src",
    "values-placeholder": "es. 'self' https://cdn.example.com",
    "add-directive": "Aggiungi direttiva",
    "remove-directive": "Rimuovi",
    "output-title": "Politica generata",
    "output-label": "Output CSP",
    "output-empty": "Aggiungi direttive per generare un header CSP."
  },
  "ja": {
    "parser-title": "CSP 解析",
    "parser-label": "CSP ヘッダー",
    "parser-placeholder": "Content-Security-Policy ヘッダーの値を貼り付けてください...",
    "parser-error": "解析する CSP ヘッダーを入力してください。",
    "parsed-title": "解析済みディレクティブ",
    "parsed-empty": "CSP ヘッダーを入力すると結果が表示されます。",
    "no-values": "値なし",
    "apply-parsed": "解析結果を使用",
    "builder-title": "CSP 生成",
    "directive-name": "ディレクティブ",
    "directive-values": "値",
    "name-placeholder": "例: default-src",
    "values-placeholder": "例: 'self' https://cdn.example.com",
    "add-directive": "ディレクティブを追加",
    "remove-directive": "削除",
    "output-title": "生成結果",
    "output-label": "CSP 出力",
    "output-empty": "ディレクティブを追加して CSP を生成してください。"
  },
  "ko": {
    "parser-title": "CSP 파서",
    "parser-label": "CSP 헤더",
    "parser-placeholder": "Content-Security-Policy 헤더 값을 붙여넣으세요...",
    "parser-error": "파싱할 CSP 헤더를 입력하세요.",
    "parsed-title": "파싱된 지시문",
    "parsed-empty": "CSP 헤더를 입력하면 파싱 결과가 표시됩니다.",
    "no-values": "값 없음",
    "apply-parsed": "파싱된 지시문 사용",
    "builder-title": "CSP 생성기",
    "directive-name": "지시문",
    "directive-values": "값",
    "name-placeholder": "예: default-src",
    "values-placeholder": "예: 'self' https://cdn.example.com",
    "add-directive": "지시문 추가",
    "remove-directive": "삭제",
    "output-title": "생성된 정책",
    "output-label": "CSP 출력",
    "output-empty": "지시문을 추가해 CSP 헤더를 생성하세요."
  },
  "ru": {
    "parser-title": "Парсер CSP",
    "parser-label": "CSP заголовок",
    "parser-placeholder": "Вставьте значение заголовка Content-Security-Policy...",
    "parser-error": "Введите CSP заголовок для разбора.",
    "parsed-title": "Разобранные директивы",
    "parsed-empty": "Введите CSP заголовок, чтобы увидеть директивы.",
    "no-values": "Без значений",
    "apply-parsed": "Использовать разобранные директивы",
    "builder-title": "Генератор CSP",
    "directive-name": "Директива",
    "directive-values": "Значения",
    "name-placeholder": "например default-src",
    "values-placeholder": "например 'self' https://cdn.example.com",
    "add-directive": "Добавить директиву",
    "remove-directive": "Удалить",
    "output-title": "Сгенерированная политика",
    "output-label": "CSP вывод",
    "output-empty": "Добавьте директивы для создания CSP заголовка."
  },
  "pt": {
    "parser-title": "Parser CSP",
    "parser-label": "Cabeçalho CSP",
    "parser-placeholder": "Cole o valor do cabeçalho Content-Security-Policy...",
    "parser-error": "Digite um cabeçalho CSP para analisar.",
    "parsed-title": "Diretivas analisadas",
    "parsed-empty": "Digite um cabeçalho CSP para ver as diretivas.",
    "no-values": "Sem valores",
    "apply-parsed": "Usar diretivas analisadas",
    "builder-title": "Gerador CSP",
    "directive-name": "Diretiva",
    "directive-values": "Valores",
    "name-placeholder": "ex.: default-src",
    "values-placeholder": "ex.: 'self' https://cdn.example.com",
    "add-directive": "Adicionar diretiva",
    "remove-directive": "Remover",
    "output-title": "Política gerada",
    "output-label": "Saída CSP",
    "output-empty": "Adicione diretivas para gerar um cabeçalho CSP."
  },
  "ar": {
    "parser-title": "محلل CSP",
    "parser-label": "ترويسة CSP",
    "parser-placeholder": "الصق قيمة ترويسة Content-Security-Policy...",
    "parser-error": "أدخل ترويسة CSP لتحليلها.",
    "parsed-title": "التوجيهات المُحللة",
    "parsed-empty": "أدخل ترويسة CSP لعرض التوجيهات.",
    "no-values": "لا توجد قيم",
    "apply-parsed": "استخدم التوجيهات المُحللة",
    "builder-title": "مولّد CSP",
    "directive-name": "توجيه",
    "directive-values": "القيم",
    "name-placeholder": "مثال: default-src",
    "values-placeholder": "مثال: 'self' https://cdn.example.com",
    "add-directive": "إضافة توجيه",
    "remove-directive": "إزالة",
    "output-title": "السياسة المُولدة",
    "output-label": "مخرجات CSP",
    "output-empty": "أضف توجيهات لإنشاء ترويسة CSP."
  },
  "hi": {
    "parser-title": "CSP पार्सर",
    "parser-label": "CSP हेडर",
    "parser-placeholder": "Content-Security-Policy हेडर का मान पेस्ट करें...",
    "parser-error": "पार्स करने के लिए CSP हेडर दर्ज करें।",
    "parsed-title": "पार्स की गई निर्देशिकाएँ",
    "parsed-empty": "निर्देश देखने के लिए CSP हेडर दर्ज करें।",
    "no-values": "कोई मान नहीं",
    "apply-parsed": "पार्स निर्देशों का उपयोग करें",
    "builder-title": "CSP जनरेटर",
    "directive-name": "निर्देश",
    "directive-values": "मान",
    "name-placeholder": "जैसे default-src",
    "values-placeholder": "जैसे 'self' https://cdn.example.com",
    "add-directive": "निर्देश जोड़ें",
    "remove-directive": "हटाएँ",
    "output-title": "जनित नीति",
    "output-label": "CSP आउटपुट",
    "output-empty": "CSP हेडर बनाने के लिए निर्देश जोड़ें।"
  },
  "tr": {
    "parser-title": "CSP Ayrıştırıcı",
    "parser-label": "CSP Başlığı",
    "parser-placeholder": "Content-Security-Policy başlık değerini yapıştırın...",
    "parser-error": "Ayrıştırmak için bir CSP başlığı girin.",
    "parsed-title": "Ayrıştırılan Yönergeler",
    "parsed-empty": "Yönergeleri görmek için CSP başlığı girin.",
    "no-values": "Değer yok",
    "apply-parsed": "Ayrıştırılan yönergeleri kullan",
    "builder-title": "CSP Oluşturucu",
    "directive-name": "Yönerge",
    "directive-values": "Değerler",
    "name-placeholder": "ör. default-src",
    "values-placeholder": "ör. 'self' https://cdn.example.com",
    "add-directive": "Yönerge ekle",
    "remove-directive": "Kaldır",
    "output-title": "Oluşturulan Politika",
    "output-label": "CSP Çıktısı",
    "output-empty": "CSP başlığı oluşturmak için yönergeler ekleyin."
  },
  "nl": {
    "parser-title": "CSP-parser",
    "parser-label": "CSP-header",
    "parser-placeholder": "Plak de Content-Security-Policy-headerwaarde...",
    "parser-error": "Voer een CSP-header in om te parseren.",
    "parsed-title": "Geparseerde directives",
    "parsed-empty": "Voer een CSP-header in om directives te zien.",
    "no-values": "Geen waarden",
    "apply-parsed": "Geparseerde directives gebruiken",
    "builder-title": "CSP-generator",
    "directive-name": "Directive",
    "directive-values": "Waarden",
    "name-placeholder": "bijv. default-src",
    "values-placeholder": "bijv. 'self' https://cdn.example.com",
    "add-directive": "Directive toevoegen",
    "remove-directive": "Verwijderen",
    "output-title": "Gegenereerd beleid",
    "output-label": "CSP-uitvoer",
    "output-empty": "Voeg directives toe om een CSP-header te genereren."
  },
  "sv": {
    "parser-title": "CSP-parser",
    "parser-label": "CSP-rubrik",
    "parser-placeholder": "Klistra in Content-Security-Policy-rubrikens värde...",
    "parser-error": "Ange en CSP-rubrik att tolka.",
    "parsed-title": "Tolkade direktiv",
    "parsed-empty": "Ange en CSP-rubrik för att se direktiven.",
    "no-values": "Inga värden",
    "apply-parsed": "Använd tolkade direktiv",
    "builder-title": "CSP-generator",
    "directive-name": "Direktiv",
    "directive-values": "Värden",
    "name-placeholder": "t.ex. default-src",
    "values-placeholder": "t.ex. 'self' https://cdn.example.com",
    "add-directive": "Lägg till direktiv",
    "remove-directive": "Ta bort",
    "output-title": "Genererad policy",
    "output-label": "CSP-utdata",
    "output-empty": "Lägg till direktiv för att skapa en CSP-rubrik."
  },
  "pl": {
    "parser-title": "Parser CSP",
    "parser-label": "Nagłówek CSP",
    "parser-placeholder": "Wklej wartość nagłówka Content-Security-Policy...",
    "parser-error": "Wpisz nagłówek CSP do analizy.",
    "parsed-title": "Przeanalizowane dyrektywy",
    "parsed-empty": "Wpisz nagłówek CSP, aby zobaczyć dyrektywy.",
    "no-values": "Brak wartości",
    "apply-parsed": "Użyj przeanalizowanych dyrektyw",
    "builder-title": "Generator CSP",
    "directive-name": "Dyrektywa",
    "directive-values": "Wartości",
    "name-placeholder": "np. default-src",
    "values-placeholder": "np. 'self' https://cdn.example.com",
    "add-directive": "Dodaj dyrektywę",
    "remove-directive": "Usuń",
    "output-title": "Wygenerowana polityka",
    "output-label": "Wyjście CSP",
    "output-empty": "Dodaj dyrektywy, aby wygenerować nagłówek CSP."
  },
  "vi": {
    "parser-title": "Trình phân tích CSP",
    "parser-label": "Header CSP",
    "parser-placeholder": "Dán giá trị header Content-Security-Policy...",
    "parser-error": "Nhập header CSP để phân tích.",
    "parsed-title": "Chỉ thị đã phân tích",
    "parsed-empty": "Nhập header CSP để xem chỉ thị.",
    "no-values": "Không có giá trị",
    "apply-parsed": "Dùng chỉ thị đã phân tích",
    "builder-title": "Trình tạo CSP",
    "directive-name": "Chỉ thị",
    "directive-values": "Giá trị",
    "name-placeholder": "ví dụ: default-src",
    "values-placeholder": "ví dụ: 'self' https://cdn.example.com",
    "add-directive": "Thêm chỉ thị",
    "remove-directive": "Xóa",
    "output-title": "Chính sách đã tạo",
    "output-label": "Đầu ra CSP",
    "output-empty": "Thêm chỉ thị để tạo header CSP."
  },
  "th": {
    "parser-title": "ตัวแยก CSP",
    "parser-label": "ส่วนหัว CSP",
    "parser-placeholder": "วางค่า Content-Security-Policy...",
    "parser-error": "กรอกส่วนหัว CSP เพื่อแยก",
    "parsed-title": "ผลลัพธ์ที่แยกแล้ว",
    "parsed-empty": "กรอกส่วนหัว CSP เพื่อดูผลลัพธ์",
    "no-values": "ไม่มีค่า",
    "apply-parsed": "ใช้ผลลัพธ์ที่แยกแล้ว",
    "builder-title": "ตัวสร้าง CSP",
    "directive-name": "Directive",
    "directive-values": "ค่า",
    "name-placeholder": "เช่น default-src",
    "values-placeholder": "เช่น 'self' https://cdn.example.com",
    "add-directive": "เพิ่ม directive",
    "remove-directive": "ลบ",
    "output-title": "นโยบายที่สร้าง",
    "output-label": "เอาต์พุต CSP",
    "output-empty": "เพิ่ม directive เพื่อสร้างส่วนหัว CSP"
  },
  "id": {
    "parser-title": "Parser CSP",
    "parser-label": "Header CSP",
    "parser-placeholder": "Tempel nilai header Content-Security-Policy...",
    "parser-error": "Masukkan header CSP untuk diurai.",
    "parsed-title": "Direktif terurai",
    "parsed-empty": "Masukkan header CSP untuk melihat direktif.",
    "no-values": "Tidak ada nilai",
    "apply-parsed": "Gunakan direktif terurai",
    "builder-title": "Generator CSP",
    "directive-name": "Direktif",
    "directive-values": "Nilai",
    "name-placeholder": "mis. default-src",
    "values-placeholder": "mis. 'self' https://cdn.example.com",
    "add-directive": "Tambah direktif",
    "remove-directive": "Hapus",
    "output-title": "Kebijakan yang dihasilkan",
    "output-label": "Output CSP",
    "output-empty": "Tambahkan direktif untuk membuat header CSP."
  },
  "he": {
    "parser-title": "מנתח CSP",
    "parser-label": "כותרת CSP",
    "parser-placeholder": "הדבק את ערך כותרת Content-Security-Policy...",
    "parser-error": "הזן כותרת CSP לניתוח.",
    "parsed-title": "הנחיות שנותחו",
    "parsed-empty": "הזן כותרת CSP כדי לראות את ההנחיות.",
    "no-values": "אין ערכים",
    "apply-parsed": "השתמש בהנחיות שנותחו",
    "builder-title": "מחולל CSP",
    "directive-name": "הנחיה",
    "directive-values": "ערכים",
    "name-placeholder": "לדוגמה default-src",
    "values-placeholder": "לדוגמה 'self' https://cdn.example.com",
    "add-directive": "הוסף הנחיה",
    "remove-directive": "הסר",
    "output-title": "מדיניות שנוצרה",
    "output-label": "פלט CSP",
    "output-empty": "הוסף הנחיות כדי ליצור כותרת CSP."
  },
  "ms": {
    "parser-title": "Penghurai CSP",
    "parser-label": "Pengepala CSP",
    "parser-placeholder": "Tampal nilai pengepala Content-Security-Policy...",
    "parser-error": "Masukkan pengepala CSP untuk dihuraikan.",
    "parsed-title": "Arahan yang dihuraikan",
    "parsed-empty": "Masukkan pengepala CSP untuk melihat arahan.",
    "no-values": "Tiada nilai",
    "apply-parsed": "Gunakan arahan yang dihuraikan",
    "builder-title": "Penjana CSP",
    "directive-name": "Arahan",
    "directive-values": "Nilai",
    "name-placeholder": "cth. default-src",
    "values-placeholder": "cth. 'self' https://cdn.example.com",
    "add-directive": "Tambah arahan",
    "remove-directive": "Buang",
    "output-title": "Polisi yang dijana",
    "output-label": "Output CSP",
    "output-empty": "Tambah arahan untuk menjana pengepala CSP."
  },
  "no": {
    "parser-title": "CSP-parser",
    "parser-label": "CSP-header",
    "parser-placeholder": "Lim inn Content-Security-Policy-headerverdien...",
    "parser-error": "Skriv inn en CSP-header for å analysere.",
    "parsed-title": "Tolkede direktiver",
    "parsed-empty": "Skriv inn en CSP-header for å se direktiver.",
    "no-values": "Ingen verdier",
    "apply-parsed": "Bruk tolkede direktiver",
    "builder-title": "CSP-generator",
    "directive-name": "Direktiv",
    "directive-values": "Verdier",
    "name-placeholder": "f.eks. default-src",
    "values-placeholder": "f.eks. 'self' https://cdn.example.com",
    "add-directive": "Legg til direktiv",
    "remove-directive": "Fjern",
    "output-title": "Generert policy",
    "output-label": "CSP-utdata",
    "output-empty": "Legg til direktiver for å lage en CSP-header."
  }
}
</i18n>
