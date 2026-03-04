<template>
  <ToolSectionHeader>{{ t('resultsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-alert v-if="originalErrorMessage" type="error">{{ originalErrorMessage }}</n-alert>
      <n-alert v-if="modifiedErrorMessage" type="error">{{ modifiedErrorMessage }}</n-alert>
      <n-alert v-if="pendingLargeCompare" type="info">{{ t('largeComparePending') }}</n-alert>
      <n-empty
        v-if="!isReady && !originalErrorMessage && !modifiedErrorMessage && !pendingLargeCompare"
        :description="t('emptyState')"
      />
      <template v-else-if="isReady">
        <n-flex justify="space-between" align="center" :wrap="true">
          <n-text>{{ t('changesCount', { count: filteredCount, allCount: totalCount }) }}</n-text>
          <n-flex :size="8">
            <CopyToClipboardButton :content="activeOutput" :disabled="!canExport" />
            <n-button
              tag="a"
              text
              :disabled="!canExport"
              :href="canExport ? (pathsDownloadUrl ?? undefined) : undefined"
              download="json-diff-paths.json"
            >
              {{ t('downloadPaths') }}
            </n-button>
            <n-button
              tag="a"
              text
              :disabled="!canExport"
              :href="canExport ? (patchDownloadUrl ?? undefined) : undefined"
              download="json-diff-patch.json"
            >
              {{ t('downloadPatch') }}
            </n-button>
          </n-flex>
        </n-flex>

        <n-tabs v-model:value="activeTab" type="segment" animated>
          <n-tab-pane name="paths" :tab="t('pathTab')">
            <n-code :code="formattedPaths" language="json" :hljs="hljs" word-wrap />
            <n-text v-if="filteredCount === 0" depth="3">{{ t('noChanges') }}</n-text>
          </n-tab-pane>
          <n-tab-pane name="patch" :tab="t('patchTab')">
            <n-code :code="formattedPatch" language="json" :hljs="hljs" word-wrap />
            <n-text v-if="filteredCount === 0" depth="3">{{ t('noChanges') }}</n-text>
          </n-tab-pane>
        </n-tabs>
      </template>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NCode, NEmpty, NFlex, NTabPane, NTabs, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import hljs from 'highlight.js/lib/core'
import jsonLang from 'highlight.js/lib/languages/json'
import type { JsonParseError } from '../utils/jsonDiff'

const props = defineProps<{
  isReady: boolean
  originalError?: JsonParseError
  modifiedError?: JsonParseError
  filteredCount: number
  totalCount: number
  formattedPaths: string
  formattedPatch: string
  pathsDownloadUrl?: string | null
  patchDownloadUrl?: string | null
  pendingLargeCompare?: boolean
}>()

const activeTab = defineModel<'paths' | 'patch'>('activeTab', { required: true })

hljs.registerLanguage('json', jsonLang)

const { t } = useI18n()

const originalErrorMessage = computed(() => {
  if (!props.originalError) {
    return ''
  }

  return t('originalParseErrorPrefix', {
    error: formatParseError(props.originalError),
  })
})

const modifiedErrorMessage = computed(() => {
  if (!props.modifiedError) {
    return ''
  }

  return t('modifiedParseErrorPrefix', {
    error: formatParseError(props.modifiedError),
  })
})

const activeOutput = computed(() =>
  activeTab.value === 'paths' ? props.formattedPaths : props.formattedPatch,
)
const canExport = computed(() => props.isReady && !props.pendingLargeCompare)

function formatParseError(error: JsonParseError): string {
  if (error.line && error.column) {
    return t('parseErrorWithLocation', {
      message: error.message,
      line: error.line,
      column: error.column,
    })
  }

  return t('parseErrorWithoutLocation', { message: error.message })
}
</script>

<i18n lang="json">
{
  "en": {
    "resultsTitle": "Diff Result",
    "emptyState": "Enter valid JSON in both editors to see differences",
    "largeComparePending": "Large JSON changes are pending. Click Compare Now in the input section to refresh results.",
    "parseErrorWithLocation": "JSON parse error (line {line}, column {column}): {message}",
    "parseErrorWithoutLocation": "JSON parse error: {message}",
    "originalParseErrorPrefix": "Original: {error}",
    "modifiedParseErrorPrefix": "Modified: {error}",
    "changesCount": "Changes: {count} (total {allCount})",
    "downloadPaths": "Download Paths",
    "downloadPatch": "Download Patch",
    "pathTab": "Path List",
    "patchTab": "JSON Patch",
    "noChanges": "No changes for current filters"
  },
  "zh": {
    "resultsTitle": "对比结果",
    "emptyState": "请在两个输入框中输入有效 JSON 以查看差异",
    "largeComparePending": "大 JSON 变更尚未重新比较。请在输入区点击“立即比较”更新结果。",
    "parseErrorWithLocation": "JSON 解析错误（第 {line} 行，第 {column} 列）：{message}",
    "parseErrorWithoutLocation": "JSON 解析错误：{message}",
    "originalParseErrorPrefix": "原始：{error}",
    "modifiedParseErrorPrefix": "修改后：{error}",
    "changesCount": "变更：{count}（总计 {allCount}）",
    "downloadPaths": "下载路径",
    "downloadPatch": "下载 Patch",
    "pathTab": "路径列表",
    "patchTab": "JSON Patch",
    "noChanges": "当前筛选条件下没有变化"
  },
  "zh-CN": {
    "resultsTitle": "对比结果",
    "emptyState": "请在两个输入框中输入有效 JSON 以查看差异",
    "largeComparePending": "大 JSON 变更尚未重新比较。请在输入区点击“立即比较”更新结果。",
    "parseErrorWithLocation": "JSON 解析错误（第 {line} 行，第 {column} 列）：{message}",
    "parseErrorWithoutLocation": "JSON 解析错误：{message}",
    "originalParseErrorPrefix": "原始：{error}",
    "modifiedParseErrorPrefix": "修改后：{error}",
    "changesCount": "变更：{count}（总计 {allCount}）",
    "downloadPaths": "下载路径",
    "downloadPatch": "下载 Patch",
    "pathTab": "路径列表",
    "patchTab": "JSON Patch",
    "noChanges": "当前筛选条件下没有变化"
  },
  "zh-TW": {
    "resultsTitle": "比對結果",
    "emptyState": "請在兩個輸入框中輸入有效 JSON 以查看差異",
    "largeComparePending": "大型 JSON 變更尚未重新比對。請在輸入區點擊「立即比較」更新結果。",
    "parseErrorWithLocation": "JSON 解析錯誤（第 {line} 行，第 {column} 列）：{message}",
    "parseErrorWithoutLocation": "JSON 解析錯誤：{message}",
    "originalParseErrorPrefix": "原始：{error}",
    "modifiedParseErrorPrefix": "修改後：{error}",
    "changesCount": "變更：{count}（總計 {allCount}）",
    "downloadPaths": "下載路徑",
    "downloadPatch": "下載 Patch",
    "pathTab": "路徑列表",
    "patchTab": "JSON Patch",
    "noChanges": "目前篩選條件下沒有變更"
  },
  "zh-HK": {
    "resultsTitle": "比對結果",
    "emptyState": "請在兩個輸入框中輸入有效 JSON 以查看差異",
    "largeComparePending": "大型 JSON 變更尚未重新比對。請在輸入區點擊「立即比較」更新結果。",
    "parseErrorWithLocation": "JSON 解析錯誤（第 {line} 行，第 {column} 列）：{message}",
    "parseErrorWithoutLocation": "JSON 解析錯誤：{message}",
    "originalParseErrorPrefix": "原始：{error}",
    "modifiedParseErrorPrefix": "修改後：{error}",
    "changesCount": "變更：{count}（總計 {allCount}）",
    "downloadPaths": "下載路徑",
    "downloadPatch": "下載 Patch",
    "pathTab": "路徑列表",
    "patchTab": "JSON Patch",
    "noChanges": "目前篩選條件下沒有變更"
  },
  "es": {
    "resultsTitle": "Resultado de diferencias",
    "emptyState": "Introduce JSON válido en ambos editores para ver las diferencias",
    "largeComparePending": "Hay cambios pendientes en JSON grande. Haz clic en \"Comparar ahora\" en la sección de entrada para actualizar los resultados.",
    "parseErrorWithLocation": "Error de análisis JSON (línea {line}, columna {column}): {message}",
    "parseErrorWithoutLocation": "Error de análisis JSON: {message}",
    "originalParseErrorPrefix": "Original: {error}",
    "modifiedParseErrorPrefix": "Modificado: {error}",
    "changesCount": "Cambios: {count} (total {allCount})",
    "downloadPaths": "Descargar rutas",
    "downloadPatch": "Descargar patch",
    "pathTab": "Lista de rutas",
    "patchTab": "JSON Patch",
    "noChanges": "No hay cambios para los filtros actuales"
  },
  "fr": {
    "resultsTitle": "Résultat du diff",
    "emptyState": "Saisissez un JSON valide dans les deux éditeurs pour voir les différences",
    "largeComparePending": "Des changements volumineux JSON sont en attente. Cliquez sur \"Comparer maintenant\" dans la section de saisie pour actualiser les résultats.",
    "parseErrorWithLocation": "Erreur d'analyse JSON (ligne {line}, colonne {column}) : {message}",
    "parseErrorWithoutLocation": "Erreur d'analyse JSON : {message}",
    "originalParseErrorPrefix": "Original : {error}",
    "modifiedParseErrorPrefix": "Modifié : {error}",
    "changesCount": "Modifications : {count} (total {allCount})",
    "downloadPaths": "Télécharger les chemins",
    "downloadPatch": "Télécharger le patch",
    "pathTab": "Liste des chemins",
    "patchTab": "JSON Patch",
    "noChanges": "Aucun changement pour les filtres actuels"
  },
  "de": {
    "resultsTitle": "Diff-Ergebnis",
    "emptyState": "Geben Sie in beiden Editoren gültiges JSON ein, um Unterschiede zu sehen",
    "largeComparePending": "Änderungen an großem JSON stehen aus. Klicken Sie im Eingabebereich auf \"Jetzt vergleichen\", um die Ergebnisse zu aktualisieren.",
    "parseErrorWithLocation": "JSON-Parse-Fehler (Zeile {line}, Spalte {column}): {message}",
    "parseErrorWithoutLocation": "JSON-Parse-Fehler: {message}",
    "originalParseErrorPrefix": "Original: {error}",
    "modifiedParseErrorPrefix": "Geändert: {error}",
    "changesCount": "Änderungen: {count} (gesamt {allCount})",
    "downloadPaths": "Pfade herunterladen",
    "downloadPatch": "Patch herunterladen",
    "pathTab": "Pfadliste",
    "patchTab": "JSON Patch",
    "noChanges": "Keine Änderungen für die aktuellen Filter"
  },
  "it": {
    "resultsTitle": "Risultato diff",
    "emptyState": "Inserisci JSON valido in entrambi gli editor per vedere le differenze",
    "largeComparePending": "Sono presenti modifiche in JSON grande non ancora confrontate. Fai clic su \"Confronta ora\" nella sezione di input per aggiornare i risultati.",
    "parseErrorWithLocation": "Errore di parsing JSON (riga {line}, colonna {column}): {message}",
    "parseErrorWithoutLocation": "Errore di parsing JSON: {message}",
    "originalParseErrorPrefix": "Originale: {error}",
    "modifiedParseErrorPrefix": "Modificato: {error}",
    "changesCount": "Modifiche: {count} (totale {allCount})",
    "downloadPaths": "Scarica percorsi",
    "downloadPatch": "Scarica patch",
    "pathTab": "Elenco percorsi",
    "patchTab": "JSON Patch",
    "noChanges": "Nessuna modifica per i filtri correnti"
  },
  "ja": {
    "resultsTitle": "差分結果",
    "emptyState": "差分を表示するには、両方のエディタに有効な JSON を入力してください",
    "largeComparePending": "大きな JSON の変更が未反映です。入力セクションの「今すぐ比較」をクリックして結果を更新してください。",
    "parseErrorWithLocation": "JSON 解析エラー（{line} 行 {column} 列）: {message}",
    "parseErrorWithoutLocation": "JSON 解析エラー: {message}",
    "originalParseErrorPrefix": "元データ: {error}",
    "modifiedParseErrorPrefix": "変更後: {error}",
    "changesCount": "変更: {count}（合計 {allCount}）",
    "downloadPaths": "パスをダウンロード",
    "downloadPatch": "Patch をダウンロード",
    "pathTab": "パス一覧",
    "patchTab": "JSON Patch",
    "noChanges": "現在のフィルターでは変更がありません"
  },
  "ko": {
    "resultsTitle": "차이 결과",
    "emptyState": "차이를 보려면 두 편집기에 모두 유효한 JSON을 입력하세요",
    "largeComparePending": "큰 JSON 변경 사항이 아직 비교되지 않았습니다. 입력 섹션에서 \"지금 비교\"를 눌러 결과를 갱신하세요.",
    "parseErrorWithLocation": "JSON 파싱 오류 (줄 {line}, 열 {column}): {message}",
    "parseErrorWithoutLocation": "JSON 파싱 오류: {message}",
    "originalParseErrorPrefix": "원본: {error}",
    "modifiedParseErrorPrefix": "수정본: {error}",
    "changesCount": "변경: {count} (전체 {allCount})",
    "downloadPaths": "경로 다운로드",
    "downloadPatch": "Patch 다운로드",
    "pathTab": "경로 목록",
    "patchTab": "JSON Patch",
    "noChanges": "현재 필터에서 변경 사항이 없습니다"
  },
  "ru": {
    "resultsTitle": "Результат сравнения",
    "emptyState": "Введите корректный JSON в оба редактора, чтобы увидеть различия",
    "largeComparePending": "Изменения большого JSON ожидают сравнения. Нажмите \"Сравнить сейчас\" в секции ввода, чтобы обновить результат.",
    "parseErrorWithLocation": "Ошибка разбора JSON (строка {line}, столбец {column}): {message}",
    "parseErrorWithoutLocation": "Ошибка разбора JSON: {message}",
    "originalParseErrorPrefix": "Исходный: {error}",
    "modifiedParseErrorPrefix": "Изменённый: {error}",
    "changesCount": "Изменения: {count} (всего {allCount})",
    "downloadPaths": "Скачать пути",
    "downloadPatch": "Скачать patch",
    "pathTab": "Список путей",
    "patchTab": "JSON Patch",
    "noChanges": "Нет изменений для текущих фильтров"
  },
  "pt": {
    "resultsTitle": "Resultado do diff",
    "emptyState": "Insira JSON válido em ambos os editores para ver as diferenças",
    "largeComparePending": "Há alterações pendentes em JSON grande. Clique em \"Comparar agora\" na seção de entrada para atualizar os resultados.",
    "parseErrorWithLocation": "Erro de análise JSON (linha {line}, coluna {column}): {message}",
    "parseErrorWithoutLocation": "Erro de análise JSON: {message}",
    "originalParseErrorPrefix": "Original: {error}",
    "modifiedParseErrorPrefix": "Modificado: {error}",
    "changesCount": "Alterações: {count} (total {allCount})",
    "downloadPaths": "Baixar caminhos",
    "downloadPatch": "Baixar patch",
    "pathTab": "Lista de caminhos",
    "patchTab": "JSON Patch",
    "noChanges": "Sem alterações para os filtros atuais"
  },
  "ar": {
    "resultsTitle": "نتيجة الفروقات",
    "emptyState": "أدخل JSON صالحًا في المحررين لعرض الفروقات",
    "largeComparePending": "توجد تغييرات JSON كبيرة قيد الانتظار. انقر \"قارن الآن\" في قسم الإدخال لتحديث النتائج.",
    "parseErrorWithLocation": "خطأ تحليل JSON (السطر {line}، العمود {column}): {message}",
    "parseErrorWithoutLocation": "خطأ تحليل JSON: {message}",
    "originalParseErrorPrefix": "الأصلي: {error}",
    "modifiedParseErrorPrefix": "المعدل: {error}",
    "changesCount": "التغييرات: {count} (الإجمالي {allCount})",
    "downloadPaths": "تنزيل المسارات",
    "downloadPatch": "تنزيل التصحيح",
    "pathTab": "قائمة المسارات",
    "patchTab": "JSON Patch",
    "noChanges": "لا توجد تغييرات وفق المرشحات الحالية"
  },
  "hi": {
    "resultsTitle": "डिफ परिणाम",
    "emptyState": "अंतर देखने के लिए दोनों एडिटर में मान्य JSON दर्ज करें",
    "largeComparePending": "बड़े JSON में बदलाव लंबित हैं। परिणाम अपडेट करने के लिए इनपुट सेक्शन में \"अभी तुलना करें\" पर क्लिक करें।",
    "parseErrorWithLocation": "JSON पार्स त्रुटि (पंक्ति {line}, कॉलम {column}): {message}",
    "parseErrorWithoutLocation": "JSON पार्स त्रुटि: {message}",
    "originalParseErrorPrefix": "मूल: {error}",
    "modifiedParseErrorPrefix": "संशोधित: {error}",
    "changesCount": "परिवर्तन: {count} (कुल {allCount})",
    "downloadPaths": "पाथ डाउनलोड करें",
    "downloadPatch": "Patch डाउनलोड करें",
    "pathTab": "पाथ सूची",
    "patchTab": "JSON Patch",
    "noChanges": "वर्तमान फ़िल्टर के लिए कोई परिवर्तन नहीं"
  },
  "tr": {
    "resultsTitle": "Fark sonucu",
    "emptyState": "Farkları görmek için her iki düzenleyiciye de geçerli JSON girin",
    "largeComparePending": "Büyük JSON değişiklikleri beklemede. Sonuçları yenilemek için giriş bölümünde \"Şimdi karşılaştır\"a tıklayın.",
    "parseErrorWithLocation": "JSON ayrıştırma hatası (satır {line}, sütun {column}): {message}",
    "parseErrorWithoutLocation": "JSON ayrıştırma hatası: {message}",
    "originalParseErrorPrefix": "Orijinal: {error}",
    "modifiedParseErrorPrefix": "Değiştirilen: {error}",
    "changesCount": "Değişiklikler: {count} (toplam {allCount})",
    "downloadPaths": "Yolları indir",
    "downloadPatch": "Patch indir",
    "pathTab": "Yol listesi",
    "patchTab": "JSON Patch",
    "noChanges": "Mevcut filtreler için değişiklik yok"
  },
  "nl": {
    "resultsTitle": "Verschilresultaat",
    "emptyState": "Voer geldige JSON in beide editors in om verschillen te zien",
    "largeComparePending": "Grote JSON-wijzigingen wachten nog. Klik op \"Nu vergelijken\" in de invoersectie om resultaten te verversen.",
    "parseErrorWithLocation": "JSON-parsefout (regel {line}, kolom {column}): {message}",
    "parseErrorWithoutLocation": "JSON-parsefout: {message}",
    "originalParseErrorPrefix": "Origineel: {error}",
    "modifiedParseErrorPrefix": "Gewijzigd: {error}",
    "changesCount": "Wijzigingen: {count} (totaal {allCount})",
    "downloadPaths": "Paden downloaden",
    "downloadPatch": "Patch downloaden",
    "pathTab": "Padlijst",
    "patchTab": "JSON Patch",
    "noChanges": "Geen wijzigingen voor de huidige filters"
  },
  "sv": {
    "resultsTitle": "Diff-resultat",
    "emptyState": "Ange giltig JSON i båda redigerarna för att se skillnader",
    "largeComparePending": "Stora JSON-ändringar väntar på jämförelse. Klicka på \"Jämför nu\" i inmatningssektionen för att uppdatera resultaten.",
    "parseErrorWithLocation": "JSON-tolkningsfel (rad {line}, kolumn {column}): {message}",
    "parseErrorWithoutLocation": "JSON-tolkningsfel: {message}",
    "originalParseErrorPrefix": "Original: {error}",
    "modifiedParseErrorPrefix": "Ändrad: {error}",
    "changesCount": "Ändringar: {count} (totalt {allCount})",
    "downloadPaths": "Ladda ner sökvägar",
    "downloadPatch": "Ladda ner patch",
    "pathTab": "Sökvägslista",
    "patchTab": "JSON Patch",
    "noChanges": "Inga ändringar för aktuella filter"
  },
  "pl": {
    "resultsTitle": "Wynik porównania",
    "emptyState": "Wprowadź poprawny JSON w obu edytorach, aby zobaczyć różnice",
    "largeComparePending": "Zmiany w dużym JSON oczekują na porównanie. Kliknij „Porównaj teraz” w sekcji wejściowej, aby odświeżyć wynik.",
    "parseErrorWithLocation": "Błąd parsowania JSON (wiersz {line}, kolumna {column}): {message}",
    "parseErrorWithoutLocation": "Błąd parsowania JSON: {message}",
    "originalParseErrorPrefix": "Oryginał: {error}",
    "modifiedParseErrorPrefix": "Zmodyfikowany: {error}",
    "changesCount": "Zmiany: {count} (łącznie {allCount})",
    "downloadPaths": "Pobierz ścieżki",
    "downloadPatch": "Pobierz patch",
    "pathTab": "Lista ścieżek",
    "patchTab": "JSON Patch",
    "noChanges": "Brak zmian dla bieżących filtrów"
  },
  "vi": {
    "resultsTitle": "Kết quả khác biệt",
    "emptyState": "Nhập JSON hợp lệ vào cả hai trình soạn thảo để xem khác biệt",
    "largeComparePending": "Các thay đổi JSON lớn đang chờ so sánh. Hãy nhấn \"So sánh ngay\" ở phần nhập để cập nhật kết quả.",
    "parseErrorWithLocation": "Lỗi phân tích JSON (dòng {line}, cột {column}): {message}",
    "parseErrorWithoutLocation": "Lỗi phân tích JSON: {message}",
    "originalParseErrorPrefix": "Gốc: {error}",
    "modifiedParseErrorPrefix": "Đã sửa: {error}",
    "changesCount": "Thay đổi: {count} (tổng {allCount})",
    "downloadPaths": "Tải đường dẫn",
    "downloadPatch": "Tải patch",
    "pathTab": "Danh sách đường dẫn",
    "patchTab": "JSON Patch",
    "noChanges": "Không có thay đổi với bộ lọc hiện tại"
  },
  "th": {
    "resultsTitle": "ผลลัพธ์ความต่าง",
    "emptyState": "กรอก JSON ที่ถูกต้องในทั้งสองช่องเพื่อดูความแตกต่าง",
    "largeComparePending": "มีการเปลี่ยนแปลง JSON ขนาดใหญ่ที่ยังไม่ได้เปรียบเทียบ คลิก \"เปรียบเทียบทันที\" ในส่วนอินพุตเพื่ออัปเดตผลลัพธ์",
    "parseErrorWithLocation": "ข้อผิดพลาดในการแยกวิเคราะห์ JSON (บรรทัด {line}, คอลัมน์ {column}): {message}",
    "parseErrorWithoutLocation": "ข้อผิดพลาดในการแยกวิเคราะห์ JSON: {message}",
    "originalParseErrorPrefix": "ต้นฉบับ: {error}",
    "modifiedParseErrorPrefix": "ที่แก้ไข: {error}",
    "changesCount": "การเปลี่ยนแปลง: {count} (รวม {allCount})",
    "downloadPaths": "ดาวน์โหลดเส้นทาง",
    "downloadPatch": "ดาวน์โหลด Patch",
    "pathTab": "รายการเส้นทาง",
    "patchTab": "JSON Patch",
    "noChanges": "ไม่มีการเปลี่ยนแปลงตามตัวกรองปัจจุบัน"
  },
  "id": {
    "resultsTitle": "Hasil perbedaan",
    "emptyState": "Masukkan JSON yang valid di kedua editor untuk melihat perbedaan",
    "largeComparePending": "Perubahan JSON besar masih menunggu perbandingan. Klik \"Bandingkan sekarang\" di bagian input untuk memperbarui hasil.",
    "parseErrorWithLocation": "Kesalahan parse JSON (baris {line}, kolom {column}): {message}",
    "parseErrorWithoutLocation": "Kesalahan parse JSON: {message}",
    "originalParseErrorPrefix": "Asli: {error}",
    "modifiedParseErrorPrefix": "Diubah: {error}",
    "changesCount": "Perubahan: {count} (total {allCount})",
    "downloadPaths": "Unduh jalur",
    "downloadPatch": "Unduh patch",
    "pathTab": "Daftar jalur",
    "patchTab": "JSON Patch",
    "noChanges": "Tidak ada perubahan untuk filter saat ini"
  },
  "he": {
    "resultsTitle": "תוצאת השוואה",
    "emptyState": "הזן JSON תקין בשני העורכים כדי לראות הבדלים",
    "largeComparePending": "שינויים ב-JSON גדול ממתינים להשוואה. לחץ על \"השווה עכשיו\" באזור הקלט כדי לרענן את התוצאות.",
    "parseErrorWithLocation": "שגיאת ניתוח JSON (שורה {line}, עמודה {column}): {message}",
    "parseErrorWithoutLocation": "שגיאת ניתוח JSON: {message}",
    "originalParseErrorPrefix": "מקורי: {error}",
    "modifiedParseErrorPrefix": "מעודכן: {error}",
    "changesCount": "שינויים: {count} (סה\"כ {allCount})",
    "downloadPaths": "הורדת נתיבים",
    "downloadPatch": "הורדת Patch",
    "pathTab": "רשימת נתיבים",
    "patchTab": "JSON Patch",
    "noChanges": "אין שינויים עבור המסננים הנוכחיים"
  },
  "ms": {
    "resultsTitle": "Hasil perbezaan",
    "emptyState": "Masukkan JSON yang sah dalam kedua-dua editor untuk melihat perbezaan",
    "largeComparePending": "Perubahan JSON besar masih menunggu perbandingan. Klik \"Bandingkan sekarang\" di bahagian input untuk mengemas kini hasil.",
    "parseErrorWithLocation": "Ralat penghuraian JSON (baris {line}, lajur {column}): {message}",
    "parseErrorWithoutLocation": "Ralat penghuraian JSON: {message}",
    "originalParseErrorPrefix": "Asal: {error}",
    "modifiedParseErrorPrefix": "Diubah: {error}",
    "changesCount": "Perubahan: {count} (jumlah {allCount})",
    "downloadPaths": "Muat turun laluan",
    "downloadPatch": "Muat turun patch",
    "pathTab": "Senarai laluan",
    "patchTab": "JSON Patch",
    "noChanges": "Tiada perubahan untuk penapis semasa"
  },
  "no": {
    "resultsTitle": "Diff-resultat",
    "emptyState": "Skriv inn gyldig JSON i begge editorene for å se forskjeller",
    "largeComparePending": "Store JSON-endringer venter på sammenligning. Klikk \"Sammenlign nå\" i inndataseksjonen for å oppdatere resultatene.",
    "parseErrorWithLocation": "JSON-parsingsfeil (linje {line}, kolonne {column}): {message}",
    "parseErrorWithoutLocation": "JSON-parsingsfeil: {message}",
    "originalParseErrorPrefix": "Original: {error}",
    "modifiedParseErrorPrefix": "Endret: {error}",
    "changesCount": "Endringer: {count} (totalt {allCount})",
    "downloadPaths": "Last ned stier",
    "downloadPatch": "Last ned patch",
    "pathTab": "Stiliste",
    "patchTab": "JSON Patch",
    "noChanges": "Ingen endringer for gjeldende filtre"
  }
}
</i18n>
