<template>
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
          <n-flex align="center" :size="8">
            <CopyToClipboardButton :content="formattedResult" />
            <n-button
              v-if="downloadUrl"
              tag="a"
              text
              :href="downloadUrl"
              :download="downloadFilename"
              icon-placement="left"
            >
              <template #icon>
                <n-icon :component="ArrowDownload20Regular" />
              </template>
              {{ t('download-json') }}
            </n-button>
          </n-flex>
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
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { NAlert, NButton, NCard, NCode, NEmpty, NFlex, NIcon, NText } from 'naive-ui'
import ArrowDownload20Regular from '@vicons/fluent/ArrowDownload20Regular'
import hljs from 'highlight.js/lib/core'
import jsonLang from 'highlight.js/lib/languages/json'
import type { QueryState } from './types'

defineProps<{
  queryState: QueryState
  resultCount: number
  formattedResult: string
  downloadUrl?: string
  downloadFilename: string
}>()

hljs.registerLanguage('json', jsonLang)

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "resultsTitle": "Results",
    "result-count": "Results: {count}",
    "emptyState": "Enter JSON and a JMESPath expression to see results",
    "download-json": "Download JSON",
    "no-results": "No results found"
  },
  "zh": {
    "resultsTitle": "结果",
    "result-count": "结果数：{count}",
    "emptyState": "输入 JSON 和 JMESPath 表达式以查看结果",
    "download-json": "下载 JSON",
    "no-results": "未找到结果"
  },
  "zh-CN": {
    "resultsTitle": "结果",
    "result-count": "结果数：{count}",
    "emptyState": "输入 JSON 和 JMESPath 表达式以查看结果",
    "download-json": "下载 JSON",
    "no-results": "未找到结果"
  },
  "zh-TW": {
    "resultsTitle": "結果",
    "result-count": "結果數：{count}",
    "emptyState": "輸入 JSON 和 JMESPath 表達式以查看結果",
    "download-json": "下載 JSON",
    "no-results": "未找到結果"
  },
  "zh-HK": {
    "resultsTitle": "結果",
    "result-count": "結果數：{count}",
    "emptyState": "輸入 JSON 和 JMESPath 表達式以查看結果",
    "download-json": "下載 JSON",
    "no-results": "未找到結果"
  },
  "es": {
    "resultsTitle": "Resultados",
    "result-count": "Resultados: {count}",
    "emptyState": "Introduce JSON y una expresión JMESPath para ver resultados",
    "download-json": "Descargar JSON",
    "no-results": "No se encontraron resultados"
  },
  "fr": {
    "resultsTitle": "Résultats",
    "result-count": "Résultats : {count}",
    "emptyState": "Saisissez du JSON et une expression JMESPath pour voir les résultats",
    "download-json": "Télécharger le JSON",
    "no-results": "Aucun résultat trouvé"
  },
  "de": {
    "resultsTitle": "Ergebnisse",
    "result-count": "Ergebnisse: {count}",
    "emptyState": "JSON und einen JMESPath-Ausdruck eingeben, um Ergebnisse zu sehen",
    "download-json": "JSON herunterladen",
    "no-results": "Keine Ergebnisse gefunden"
  },
  "it": {
    "resultsTitle": "Risultati",
    "result-count": "Risultati: {count}",
    "emptyState": "Inserisci JSON e un'espressione JMESPath per vedere i risultati",
    "download-json": "Scarica JSON",
    "no-results": "Nessun risultato trovato"
  },
  "ja": {
    "resultsTitle": "結果",
    "result-count": "結果: {count}",
    "emptyState": "JSON と JMESPath 式を入力すると結果が表示されます",
    "download-json": "JSON をダウンロード",
    "no-results": "結果が見つかりません"
  },
  "ko": {
    "resultsTitle": "결과",
    "result-count": "결과: {count}",
    "emptyState": "JSON과 JMESPath 표현식을 입력하면 결과가 표시됩니다",
    "download-json": "JSON 다운로드",
    "no-results": "결과를 찾을 수 없습니다"
  },
  "ru": {
    "resultsTitle": "Результаты",
    "result-count": "Результаты: {count}",
    "emptyState": "Введите JSON и выражение JMESPath, чтобы увидеть результаты",
    "download-json": "Скачать JSON",
    "no-results": "Результаты не найдены"
  },
  "pt": {
    "resultsTitle": "Resultados",
    "result-count": "Resultados: {count}",
    "emptyState": "Insira JSON e uma expressão JMESPath para ver resultados",
    "download-json": "Baixar JSON",
    "no-results": "Nenhum resultado encontrado"
  },
  "ar": {
    "resultsTitle": "النتائج",
    "result-count": "النتائج: {count}",
    "emptyState": "أدخل JSON وتعبير JMESPath لعرض النتائج",
    "download-json": "تنزيل JSON",
    "no-results": "لم يتم العثور على نتائج"
  },
  "hi": {
    "resultsTitle": "परिणाम",
    "result-count": "परिणाम: {count}",
    "emptyState": "परिणाम देखने के लिए JSON और JMESPath अभिव्यक्ति दर्ज करें",
    "download-json": "JSON डाउनलोड करें",
    "no-results": "कोई परिणाम नहीं मिला"
  },
  "tr": {
    "resultsTitle": "Sonuçlar",
    "result-count": "Sonuçlar: {count}",
    "emptyState": "Sonuçları görmek için JSON ve JMESPath ifadesi girin",
    "download-json": "JSON indir",
    "no-results": "Sonuç bulunamadı"
  },
  "nl": {
    "resultsTitle": "Resultaten",
    "result-count": "Resultaten: {count}",
    "emptyState": "Voer JSON en een JMESPath-expressie in om resultaten te zien",
    "download-json": "JSON downloaden",
    "no-results": "Geen resultaten gevonden"
  },
  "sv": {
    "resultsTitle": "Resultat",
    "result-count": "Resultat: {count}",
    "emptyState": "Ange JSON och ett JMESPath-uttryck för att se resultat",
    "download-json": "Ladda ner JSON",
    "no-results": "Inga resultat hittades"
  },
  "pl": {
    "resultsTitle": "Wyniki",
    "result-count": "Wyniki: {count}",
    "emptyState": "Wpisz JSON i wyrażenie JMESPath, aby zobaczyć wyniki",
    "download-json": "Pobierz JSON",
    "no-results": "Nie znaleziono wyników"
  },
  "vi": {
    "resultsTitle": "Kết quả",
    "result-count": "Kết quả: {count}",
    "emptyState": "Nhập JSON và biểu thức JMESPath để xem kết quả",
    "download-json": "Tải JSON",
    "no-results": "Không tìm thấy kết quả"
  },
  "th": {
    "resultsTitle": "ผลลัพธ์",
    "result-count": "ผลลัพธ์: {count}",
    "emptyState": "ป้อน JSON และนิพจน์ JMESPath เพื่อดูผลลัพธ์",
    "download-json": "ดาวน์โหลด JSON",
    "no-results": "ไม่พบผลลัพธ์"
  },
  "id": {
    "resultsTitle": "Hasil",
    "result-count": "Hasil: {count}",
    "emptyState": "Masukkan JSON dan ekspresi JMESPath untuk melihat hasil",
    "download-json": "Unduh JSON",
    "no-results": "Tidak ditemukan hasil"
  },
  "he": {
    "resultsTitle": "תוצאות",
    "result-count": "תוצאות: {count}",
    "emptyState": "הזן JSON וביטוי JMESPath כדי לראות תוצאות",
    "download-json": "הורד JSON",
    "no-results": "לא נמצאו תוצאות"
  },
  "ms": {
    "resultsTitle": "Hasil",
    "result-count": "Hasil: {count}",
    "emptyState": "Masukkan JSON dan ungkapan JMESPath untuk melihat hasil",
    "download-json": "Muat turun JSON",
    "no-results": "Tiada hasil ditemui"
  },
  "no": {
    "resultsTitle": "Resultater",
    "result-count": "Resultater: {count}",
    "emptyState": "Skriv inn JSON og et JMESPath-uttrykk for å se resultater",
    "download-json": "Last ned JSON",
    "no-results": "Ingen resultater funnet"
  }
}
</i18n>
