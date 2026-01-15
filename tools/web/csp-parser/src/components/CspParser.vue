<template>
  <CspParserSection
    :input="parserInput"
    :input-status="parserStatus"
    :input-error="parserError"
    :directives="parsedDirectives"
    :labels="labels"
    @update:input="parserInput = $event"
  />
</template>

<script setup lang="ts">
import type { FormValidationStatus } from 'naive-ui'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { parseCsp } from '../utils/csp'
import CspParserSection from './CspParserSection.vue'

const { t } = useI18n()

const parserInput = useStorage('tools:csp-parser:input', '')

const parsedDirectives = computed(() => parseCsp(parserInput.value))
const parserError = computed(() => parserInput.value.trim().length === 0)
const parserStatus = computed<FormValidationStatus | undefined>(() =>
  parserError.value ? 'error' : undefined,
)

const labels = computed(() => ({
  parserTitle: t('parser-title'),
  parserLabel: t('parser-label'),
  parserPlaceholder: t('parser-placeholder'),
  parserError: t('parser-error'),
  parsedTitle: t('parsed-title'),
  parsedEmpty: t('parsed-empty'),
  noValues: t('no-values'),
}))
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
    "no-values": "No values"
  },
  "zh": {
    "parser-title": "CSP 解析",
    "parser-label": "CSP 头部",
    "parser-placeholder": "粘贴 Content-Security-Policy 头部内容...",
    "parser-error": "请输入要解析的 CSP 头部。",
    "parsed-title": "解析结果",
    "parsed-empty": "输入 CSP 头部以查看解析结果。",
    "no-values": "无值"
  },
  "zh-CN": {
    "parser-title": "CSP 解析",
    "parser-label": "CSP 头部",
    "parser-placeholder": "粘贴 Content-Security-Policy 头部内容...",
    "parser-error": "请输入要解析的 CSP 头部。",
    "parsed-title": "解析结果",
    "parsed-empty": "输入 CSP 头部以查看解析结果。",
    "no-values": "无值"
  },
  "zh-TW": {
    "parser-title": "CSP 解析",
    "parser-label": "CSP 標頭",
    "parser-placeholder": "貼上 Content-Security-Policy 標頭內容...",
    "parser-error": "請輸入要解析的 CSP 標頭。",
    "parsed-title": "解析結果",
    "parsed-empty": "輸入 CSP 標頭以查看解析結果。",
    "no-values": "無值"
  },
  "zh-HK": {
    "parser-title": "CSP 解析",
    "parser-label": "CSP 標頭",
    "parser-placeholder": "貼上 Content-Security-Policy 標頭內容...",
    "parser-error": "請輸入要解析的 CSP 標頭。",
    "parsed-title": "解析結果",
    "parsed-empty": "輸入 CSP 標頭以查看解析結果。",
    "no-values": "無值"
  },
  "es": {
    "parser-title": "Analizador CSP",
    "parser-label": "Encabezado CSP",
    "parser-placeholder": "Pega el valor del encabezado Content-Security-Policy...",
    "parser-error": "Introduce un encabezado CSP para analizar.",
    "parsed-title": "Directivas analizadas",
    "parsed-empty": "Introduce un encabezado CSP para ver las directivas analizadas.",
    "no-values": "Sin valores"
  },
  "fr": {
    "parser-title": "Analyseur CSP",
    "parser-label": "En-tête CSP",
    "parser-placeholder": "Collez la valeur de l'en-tête Content-Security-Policy...",
    "parser-error": "Saisissez un en-tête CSP à analyser.",
    "parsed-title": "Directives analysées",
    "parsed-empty": "Saisissez un en-tête CSP pour voir les directives analysées.",
    "no-values": "Aucune valeur"
  },
  "de": {
    "parser-title": "CSP-Parser",
    "parser-label": "CSP-Header",
    "parser-placeholder": "Füge den Content-Security-Policy-Header ein...",
    "parser-error": "Gib einen CSP-Header zum Parsen ein.",
    "parsed-title": "Geparste Direktiven",
    "parsed-empty": "Gib einen CSP-Header ein, um Direktiven zu sehen.",
    "no-values": "Keine Werte"
  },
  "it": {
    "parser-title": "Parser CSP",
    "parser-label": "Header CSP",
    "parser-placeholder": "Incolla il valore dell'header Content-Security-Policy...",
    "parser-error": "Inserisci un header CSP da analizzare.",
    "parsed-title": "Direttive analizzate",
    "parsed-empty": "Inserisci un header CSP per vedere le direttive.",
    "no-values": "Nessun valore"
  },
  "ja": {
    "parser-title": "CSP 解析",
    "parser-label": "CSP ヘッダー",
    "parser-placeholder": "Content-Security-Policy ヘッダーの値を貼り付けてください...",
    "parser-error": "解析する CSP ヘッダーを入力してください。",
    "parsed-title": "解析済みディレクティブ",
    "parsed-empty": "CSP ヘッダーを入力すると結果が表示されます。",
    "no-values": "値なし"
  },
  "ko": {
    "parser-title": "CSP 파서",
    "parser-label": "CSP 헤더",
    "parser-placeholder": "Content-Security-Policy 헤더 값을 붙여넣으세요...",
    "parser-error": "파싱할 CSP 헤더를 입력하세요.",
    "parsed-title": "파싱된 지시문",
    "parsed-empty": "CSP 헤더를 입력하면 파싱 결과가 표시됩니다.",
    "no-values": "값 없음"
  },
  "ru": {
    "parser-title": "Парсер CSP",
    "parser-label": "CSP заголовок",
    "parser-placeholder": "Вставьте значение заголовка Content-Security-Policy...",
    "parser-error": "Введите CSP заголовок для разбора.",
    "parsed-title": "Разобранные директивы",
    "parsed-empty": "Введите CSP заголовок, чтобы увидеть директивы.",
    "no-values": "Без значений"
  },
  "pt": {
    "parser-title": "Parser CSP",
    "parser-label": "Cabeçalho CSP",
    "parser-placeholder": "Cole o valor do cabeçalho Content-Security-Policy...",
    "parser-error": "Digite um cabeçalho CSP para analisar.",
    "parsed-title": "Diretivas analisadas",
    "parsed-empty": "Digite um cabeçalho CSP para ver as diretivas.",
    "no-values": "Sem valores"
  },
  "ar": {
    "parser-title": "محلل CSP",
    "parser-label": "ترويسة CSP",
    "parser-placeholder": "الصق قيمة ترويسة Content-Security-Policy...",
    "parser-error": "أدخل ترويسة CSP لتحليلها.",
    "parsed-title": "التوجيهات المُحللة",
    "parsed-empty": "أدخل ترويسة CSP لعرض التوجيهات.",
    "no-values": "لا توجد قيم"
  },
  "hi": {
    "parser-title": "CSP पार्सर",
    "parser-label": "CSP हेडर",
    "parser-placeholder": "Content-Security-Policy हेडर का मान पेस्ट करें...",
    "parser-error": "पार्स करने के लिए CSP हेडर दर्ज करें।",
    "parsed-title": "पार्स की गई निर्देशिकाएँ",
    "parsed-empty": "निर्देश देखने के लिए CSP हेडर दर्ज करें।",
    "no-values": "कोई मान नहीं"
  },
  "tr": {
    "parser-title": "CSP Ayrıştırıcı",
    "parser-label": "CSP Başlığı",
    "parser-placeholder": "Content-Security-Policy başlık değerini yapıştırın...",
    "parser-error": "Ayrıştırmak için bir CSP başlığı girin.",
    "parsed-title": "Ayrıştırılan Yönergeler",
    "parsed-empty": "Yönergeleri görmek için CSP başlığı girin.",
    "no-values": "Değer yok"
  },
  "nl": {
    "parser-title": "CSP-parser",
    "parser-label": "CSP-header",
    "parser-placeholder": "Plak de Content-Security-Policy-headerwaarde...",
    "parser-error": "Voer een CSP-header in om te parseren.",
    "parsed-title": "Geparseerde directives",
    "parsed-empty": "Voer een CSP-header in om directives te zien.",
    "no-values": "Geen waarden"
  },
  "sv": {
    "parser-title": "CSP-parser",
    "parser-label": "CSP-rubrik",
    "parser-placeholder": "Klistra in Content-Security-Policy-rubrikens värde...",
    "parser-error": "Ange en CSP-rubrik att tolka.",
    "parsed-title": "Tolkade direktiv",
    "parsed-empty": "Ange en CSP-rubrik för att se direktiven.",
    "no-values": "Inga värden"
  },
  "pl": {
    "parser-title": "Parser CSP",
    "parser-label": "Nagłówek CSP",
    "parser-placeholder": "Wklej wartość nagłówka Content-Security-Policy...",
    "parser-error": "Wpisz nagłówek CSP do analizy.",
    "parsed-title": "Przeanalizowane dyrektywy",
    "parsed-empty": "Wpisz nagłówek CSP, aby zobaczyć dyrektywy.",
    "no-values": "Brak wartości"
  },
  "vi": {
    "parser-title": "Trình phân tích CSP",
    "parser-label": "Header CSP",
    "parser-placeholder": "Dán giá trị header Content-Security-Policy...",
    "parser-error": "Nhập header CSP để phân tích.",
    "parsed-title": "Chỉ thị đã phân tích",
    "parsed-empty": "Nhập header CSP để xem chỉ thị.",
    "no-values": "Không có giá trị"
  },
  "th": {
    "parser-title": "ตัวแยก CSP",
    "parser-label": "ส่วนหัว CSP",
    "parser-placeholder": "วางค่า Content-Security-Policy...",
    "parser-error": "กรอกส่วนหัว CSP เพื่อแยก",
    "parsed-title": "ผลลัพธ์ที่แยกแล้ว",
    "parsed-empty": "กรอกส่วนหัว CSP เพื่อดูผลลัพธ์",
    "no-values": "ไม่มีค่า"
  },
  "id": {
    "parser-title": "Parser CSP",
    "parser-label": "Header CSP",
    "parser-placeholder": "Tempel nilai header Content-Security-Policy...",
    "parser-error": "Masukkan header CSP untuk diurai.",
    "parsed-title": "Direktif terurai",
    "parsed-empty": "Masukkan header CSP untuk melihat direktif.",
    "no-values": "Tidak ada nilai"
  },
  "he": {
    "parser-title": "מנתח CSP",
    "parser-label": "כותרת CSP",
    "parser-placeholder": "הדבק את ערך כותרת Content-Security-Policy...",
    "parser-error": "הזן כותרת CSP לניתוח.",
    "parsed-title": "הנחיות שנותחו",
    "parsed-empty": "הזן כותרת CSP כדי לראות את ההנחיות.",
    "no-values": "אין ערכים"
  },
  "ms": {
    "parser-title": "Penghurai CSP",
    "parser-label": "Pengepala CSP",
    "parser-placeholder": "Tampal nilai pengepala Content-Security-Policy...",
    "parser-error": "Masukkan pengepala CSP untuk dihuraikan.",
    "parsed-title": "Arahan yang dihuraikan",
    "parsed-empty": "Masukkan pengepala CSP untuk melihat arahan.",
    "no-values": "Tiada nilai"
  },
  "no": {
    "parser-title": "CSP-parser",
    "parser-label": "CSP-header",
    "parser-placeholder": "Lim inn Content-Security-Policy-headerverdien...",
    "parser-error": "Skriv inn en CSP-header for å analysere.",
    "parsed-title": "Tolkede direktiver",
    "parsed-empty": "Skriv inn en CSP-header for å se direktiver.",
    "no-values": "Ingen verdier"
  }
}
</i18n>
