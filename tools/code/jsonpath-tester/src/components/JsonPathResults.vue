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
          <n-text>{{ t('matches-count', { count: matchesCount }) }}</n-text>
          <n-flex align="center" :size="8">
            <CopyToClipboardButton :content="activeContent" />
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import {
  NAlert,
  NButton,
  NCard,
  NCode,
  NEmpty,
  NFlex,
  NIcon,
  NTabPane,
  NTabs,
  NText,
} from 'naive-ui'
import ArrowDownload20Regular from '@vicons/fluent/ArrowDownload20Regular'
import hljs from 'highlight.js/lib/core'
import jsonLang from 'highlight.js/lib/languages/json'
import type { QueryState } from './types'

const props = defineProps<{
  queryState: QueryState
  matchesCount: number
  formattedValues: string
  formattedPaths: string
  downloadUrl?: string
  downloadFilename: string
}>()

hljs.registerLanguage('json', jsonLang)

const activeTab = defineModel<'values' | 'paths'>('activeTab', { required: true })

const activeContent = computed(() =>
  activeTab.value === 'values' ? props.formattedValues : props.formattedPaths,
)

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "resultsTitle": "Results",
    "values-tab": "Values",
    "paths-tab": "Paths",
    "matches-count": "Matches: {count}",
    "emptyState": "Enter JSON and a JSONPath query to see results",
    "no-matches": "No matches found",
    "download-json": "Download JSON"
  },
  "zh": {
    "resultsTitle": "结果",
    "values-tab": "值",
    "paths-tab": "路径",
    "matches-count": "匹配数：{count}",
    "emptyState": "输入 JSON 和 JSONPath 查询以查看结果",
    "no-matches": "未找到匹配项",
    "download-json": "下载 JSON"
  },
  "zh-CN": {
    "resultsTitle": "结果",
    "values-tab": "值",
    "paths-tab": "路径",
    "matches-count": "匹配数：{count}",
    "emptyState": "输入 JSON 和 JSONPath 查询以查看结果",
    "no-matches": "未找到匹配项",
    "download-json": "下载 JSON"
  },
  "zh-TW": {
    "resultsTitle": "結果",
    "values-tab": "值",
    "paths-tab": "路徑",
    "matches-count": "匹配數：{count}",
    "emptyState": "輸入 JSON 和 JSONPath 查詢以查看結果",
    "no-matches": "未找到匹配項",
    "download-json": "下載 JSON"
  },
  "zh-HK": {
    "resultsTitle": "結果",
    "values-tab": "值",
    "paths-tab": "路徑",
    "matches-count": "匹配數：{count}",
    "emptyState": "輸入 JSON 和 JSONPath 查詢以查看結果",
    "no-matches": "未找到匹配項",
    "download-json": "下載 JSON"
  },
  "es": {
    "resultsTitle": "Resultados",
    "values-tab": "Valores",
    "paths-tab": "Rutas",
    "matches-count": "Coincidencias: {count}",
    "emptyState": "Introduce JSON y una consulta JSONPath para ver resultados",
    "no-matches": "No se encontraron coincidencias",
    "download-json": "Descargar JSON"
  },
  "fr": {
    "resultsTitle": "Résultats",
    "values-tab": "Valeurs",
    "paths-tab": "Chemins",
    "matches-count": "Correspondances : {count}",
    "emptyState": "Saisissez du JSON et une requête JSONPath pour voir les résultats",
    "no-matches": "Aucune correspondance trouvée",
    "download-json": "Télécharger le JSON"
  },
  "de": {
    "resultsTitle": "Ergebnisse",
    "values-tab": "Werte",
    "paths-tab": "Pfade",
    "matches-count": "Treffer: {count}",
    "emptyState": "JSON und JSONPath-Abfrage eingeben, um Ergebnisse zu sehen",
    "no-matches": "Keine Treffer gefunden",
    "download-json": "JSON herunterladen"
  },
  "it": {
    "resultsTitle": "Risultati",
    "values-tab": "Valori",
    "paths-tab": "Percorsi",
    "matches-count": "Corrispondenze: {count}",
    "emptyState": "Inserisci JSON e una query JSONPath per vedere i risultati",
    "no-matches": "Nessuna corrispondenza trovata",
    "download-json": "Scarica JSON"
  },
  "ja": {
    "resultsTitle": "結果",
    "values-tab": "値",
    "paths-tab": "パス",
    "matches-count": "一致: {count}",
    "emptyState": "JSON と JSONPath クエリを入力すると結果が表示されます",
    "no-matches": "一致が見つかりません",
    "download-json": "JSON をダウンロード"
  },
  "ko": {
    "resultsTitle": "결과",
    "values-tab": "값",
    "paths-tab": "경로",
    "matches-count": "일치: {count}",
    "emptyState": "JSON과 JSONPath 쿼리를 입력하면 결과가 표시됩니다",
    "no-matches": "일치하는 항목이 없습니다",
    "download-json": "JSON 다운로드"
  },
  "ru": {
    "resultsTitle": "Результаты",
    "values-tab": "Значения",
    "paths-tab": "Пути",
    "matches-count": "Совпадений: {count}",
    "emptyState": "Введите JSON и запрос JSONPath, чтобы увидеть результаты",
    "no-matches": "Совпадений не найдено",
    "download-json": "Скачать JSON"
  },
  "pt": {
    "resultsTitle": "Resultados",
    "values-tab": "Valores",
    "paths-tab": "Caminhos",
    "matches-count": "Correspondências: {count}",
    "emptyState": "Insira JSON e uma consulta JSONPath para ver resultados",
    "no-matches": "Nenhuma correspondência encontrada",
    "download-json": "Baixar JSON"
  },
  "ar": {
    "resultsTitle": "النتائج",
    "values-tab": "القيم",
    "paths-tab": "المسارات",
    "matches-count": "التطابقات: {count}",
    "emptyState": "أدخل JSON واستعلام JSONPath لعرض النتائج",
    "no-matches": "لم يتم العثور على تطابقات",
    "download-json": "تنزيل JSON"
  },
  "hi": {
    "resultsTitle": "परिणाम",
    "values-tab": "मान",
    "paths-tab": "पथ",
    "matches-count": "मिलान: {count}",
    "emptyState": "परिणाम देखने के लिए JSON और JSONPath क्वेरी दर्ज करें",
    "no-matches": "कोई मिलान नहीं मिला",
    "download-json": "JSON डाउनलोड करें"
  },
  "tr": {
    "resultsTitle": "Sonuçlar",
    "values-tab": "Değerler",
    "paths-tab": "Yollar",
    "matches-count": "Eşleşmeler: {count}",
    "emptyState": "Sonuçları görmek için JSON ve JSONPath sorgusu girin",
    "no-matches": "Eşleşme bulunamadı",
    "download-json": "JSON indir"
  },
  "nl": {
    "resultsTitle": "Resultaten",
    "values-tab": "Waarden",
    "paths-tab": "Paden",
    "matches-count": "Overeenkomsten: {count}",
    "emptyState": "Voer JSON en een JSONPath-query in om resultaten te zien",
    "no-matches": "Geen overeenkomsten gevonden",
    "download-json": "JSON downloaden"
  },
  "sv": {
    "resultsTitle": "Resultat",
    "values-tab": "Värden",
    "paths-tab": "Sökvägar",
    "matches-count": "Träffar: {count}",
    "emptyState": "Ange JSON och en JSONPath-fråga för att se resultat",
    "no-matches": "Inga träffar hittades",
    "download-json": "Ladda ner JSON"
  },
  "pl": {
    "resultsTitle": "Wyniki",
    "values-tab": "Wartości",
    "paths-tab": "Ścieżki",
    "matches-count": "Dopasowania: {count}",
    "emptyState": "Wpisz JSON i zapytanie JSONPath, aby zobaczyć wyniki",
    "no-matches": "Brak dopasowań",
    "download-json": "Pobierz JSON"
  },
  "vi": {
    "resultsTitle": "Kết quả",
    "values-tab": "Giá trị",
    "paths-tab": "Đường dẫn",
    "matches-count": "Khớp: {count}",
    "emptyState": "Nhập JSON và truy vấn JSONPath để xem kết quả",
    "no-matches": "Không tìm thấy kết quả",
    "download-json": "Tải JSON"
  },
  "th": {
    "resultsTitle": "ผลลัพธ์",
    "values-tab": "ค่า",
    "paths-tab": "เส้นทาง",
    "matches-count": "จำนวนที่ตรงกัน: {count}",
    "emptyState": "ป้อน JSON และคิวรี JSONPath เพื่อดูผลลัพธ์",
    "no-matches": "ไม่พบรายการที่ตรงกัน",
    "download-json": "ดาวน์โหลด JSON"
  },
  "id": {
    "resultsTitle": "Hasil",
    "values-tab": "Nilai",
    "paths-tab": "Jalur",
    "matches-count": "Kecocokan: {count}",
    "emptyState": "Masukkan JSON dan kueri JSONPath untuk melihat hasil",
    "no-matches": "Tidak ada kecocokan",
    "download-json": "Unduh JSON"
  },
  "he": {
    "resultsTitle": "תוצאות",
    "values-tab": "ערכים",
    "paths-tab": "נתיבים",
    "matches-count": "התאמות: {count}",
    "emptyState": "הזן JSON ושאילתת JSONPath כדי לראות תוצאות",
    "no-matches": "לא נמצאו התאמות",
    "download-json": "הורד JSON"
  },
  "ms": {
    "resultsTitle": "Hasil",
    "values-tab": "Nilai",
    "paths-tab": "Laluan",
    "matches-count": "Padanan: {count}",
    "emptyState": "Masukkan JSON dan pertanyaan JSONPath untuk melihat hasil",
    "no-matches": "Tiada padanan ditemui",
    "download-json": "Muat turun JSON"
  },
  "no": {
    "resultsTitle": "Resultater",
    "values-tab": "Verdier",
    "paths-tab": "Stier",
    "matches-count": "Treff: {count}",
    "emptyState": "Skriv inn JSON og en JSONPath-spørring for å se resultater",
    "no-matches": "Ingen treff funnet",
    "download-json": "Last ned JSON"
  }
}
</i18n>
