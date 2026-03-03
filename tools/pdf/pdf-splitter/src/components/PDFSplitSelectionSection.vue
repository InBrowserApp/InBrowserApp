<template>
  <section ref="headingAnchorRef" class="selection-heading-anchor">
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="12">
        <n-flex vertical :size="6">
          <n-text strong>{{ t('rangeLabel') }}</n-text>
          <n-input
            :value="rangeInput"
            :placeholder="t('rangePlaceholder')"
            clearable
            @update:value="emit('update:range-input', $event)"
          />
        </n-flex>

        <n-flex :size="8" wrap>
          <n-button tertiary @click="emit('select-all')">{{ t('selectAll') }}</n-button>
          <n-button tertiary @click="emit('select-odd')">{{ t('selectOdd') }}</n-button>
          <n-button tertiary @click="emit('select-even')">{{ t('selectEven') }}</n-button>
          <n-button tertiary @click="emit('clear-selection')">{{ t('clear') }}</n-button>
        </n-flex>

        <n-flex vertical :size="6">
          <n-text strong>{{ t('outputMode') }}</n-text>
          <n-radio-group :value="outputMode" @update:value="emit('update:output-mode', $event)">
            <n-space vertical>
              <n-radio value="single">{{ t('modeSingle') }}</n-radio>
              <n-radio value="multiple">{{ t('modeMultiple') }}</n-radio>
            </n-space>
          </n-radio-group>
        </n-flex>

        <n-flex v-if="outputMode === 'multiple'" vertical :size="6">
          <n-text strong>{{ t('splitStrategy') }}</n-text>
          <n-radio-group :value="multipleMode" @update:value="emit('update:multiple-mode', $event)">
            <n-space vertical>
              <n-radio value="ranges">{{ t('strategyRanges') }}</n-radio>
              <n-radio value="pages">{{ t('strategyPages') }}</n-radio>
            </n-space>
          </n-radio-group>
        </n-flex>

        <n-alert type="info" :bordered="false">
          {{ t('selectedSummary', { selectedCount, pageCount }) }}
        </n-alert>

        <n-button
          type="primary"
          :loading="isGenerating"
          :disabled="!canGenerate"
          @click="emit('generate')"
        >
          {{ isGenerating ? t('generating') : t('generate') }}
        </n-button>

        <n-alert v-if="rangeErrorMessage" type="error" :title="rangeErrorMessage" />
        <n-alert v-if="generateErrorMessage" type="error" :title="generateErrorMessage" />

        <n-flex
          v-if="hasResult && downloadUrl"
          align="center"
          justify="space-between"
          :wrap="false"
        >
          <n-text>
            {{ t('resultReady') }} {{ resultFileCount }}
            {{ resultFileCount === 1 ? t('file') : t('files') }}.
          </n-text>
          <n-button tag="a" type="primary" :href="downloadUrl" :download="resultFilename">
            <template #icon>
              <n-icon :component="ArrowDownload16Regular" />
            </template>
            {{ t('download') }}
          </n-button>
        </n-flex>
      </n-flex>
    </ToolSection>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NFlex, NIcon, NInput, NRadio, NRadioGroup, NSpace, NText } from 'naive-ui'
import type { SplitMultipleMode, SplitOutputMode } from '../split-pdf.worker'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'

defineProps<{
  pageCount: number
  selectedCount: number
  rangeInput: string
  outputMode: SplitOutputMode
  multipleMode: SplitMultipleMode
  isGenerating: boolean
  canGenerate: boolean
  rangeErrorMessage: string
  generateErrorMessage: string
  hasResult: boolean
  downloadUrl: string | null
  resultFilename: string
  resultFileCount: number
}>()

const emit = defineEmits<{
  (event: 'update:range-input', value: string): void
  (event: 'update:output-mode', value: SplitOutputMode): void
  (event: 'update:multiple-mode', value: SplitMultipleMode): void
  (event: 'select-all'): void
  (event: 'select-odd'): void
  (event: 'select-even'): void
  (event: 'clear-selection'): void
  (event: 'generate'): void
}>()

const { t } = useI18n({ useScope: 'local' })
const headingAnchorRef = ref<HTMLElement | null>(null)

const scrollToHeading = (): void => {
  const headingAnchor = headingAnchorRef.value
  if (!headingAnchor || typeof headingAnchor.scrollIntoView !== 'function') {
    return
  }

  headingAnchor.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

defineExpose({
  scrollToHeading,
})
</script>

<style scoped>
.selection-heading-anchor {
  scroll-margin-top: calc(var(--navbar-height) + 12px);
}
</style>

<!-- prettier-ignore -->
<!-- prettier-ignore -->
<i18n lang="json">
{"en":{"title":"Select Pages","rangeLabel":"Page ranges","rangePlaceholder":"Examples: 1-3,5,8-10","selectAll":"All","selectOdd":"Odd","selectEven":"Even","clear":"Clear","outputMode":"Output mode","modeSingle":"Extract to one PDF","modeMultiple":"Split to multiple PDFs","splitStrategy":"Split strategy","strategyRanges":"Split by range segments","strategyPages":"Split by single page","selectedSummary":"Selected {selectedCount} / {pageCount} pages.","generating":"Generating...","generate":"Generate Result","resultReady":"Result ready:","file":"file","files":"files","download":"Download"},"zh":{"title":"选择页面","rangeLabel":"页面范围","rangePlaceholder":"示例：1-3,5,8-10","selectAll":"全部","selectOdd":"奇数页","selectEven":"偶数页","clear":"清空","outputMode":"输出模式","modeSingle":"提取为一个 PDF","modeMultiple":"拆分为多个 PDF","splitStrategy":"拆分策略","strategyRanges":"按范围段拆分","strategyPages":"按单页拆分","selectedSummary":"已选择 {selectedCount} / {pageCount} 页。","generating":"生成中...","generate":"生成结果","resultReady":"结果已生成：","file":"个文件","files":"个文件","download":"下载"},"zh-CN":{"title":"选择页面","rangeLabel":"页面范围","rangePlaceholder":"示例：1-3,5,8-10","selectAll":"全部","selectOdd":"奇数页","selectEven":"偶数页","clear":"清空","outputMode":"输出模式","modeSingle":"提取为一个 PDF","modeMultiple":"拆分为多个 PDF","splitStrategy":"拆分策略","strategyRanges":"按范围段拆分","strategyPages":"按单页拆分","selectedSummary":"已选择 {selectedCount} / {pageCount} 页。","generating":"生成中...","generate":"生成结果","resultReady":"结果已生成：","file":"个文件","files":"个文件","download":"下载"},"zh-TW":{"title":"選擇頁面","rangeLabel":"頁面範圍","rangePlaceholder":"範例：1-3,5,8-10","selectAll":"全部","selectOdd":"奇數頁","selectEven":"偶數頁","clear":"清除","outputMode":"輸出模式","modeSingle":"擷取為單一 PDF","modeMultiple":"拆分為多個 PDF","splitStrategy":"拆分策略","strategyRanges":"依範圍段拆分","strategyPages":"依單頁拆分","selectedSummary":"已選擇 {selectedCount} / {pageCount} 頁。","generating":"產生中...","generate":"產生結果","resultReady":"結果已產生：","file":"個檔案","files":"個檔案","download":"下載"},"zh-HK":{"title":"選擇頁面","rangeLabel":"頁面範圍","rangePlaceholder":"範例：1-3,5,8-10","selectAll":"全部","selectOdd":"奇數頁","selectEven":"偶數頁","clear":"清除","outputMode":"輸出模式","modeSingle":"擷取為單一 PDF","modeMultiple":"拆分為多個 PDF","splitStrategy":"拆分策略","strategyRanges":"依範圍段拆分","strategyPages":"依單頁拆分","selectedSummary":"已選擇 {selectedCount} / {pageCount} 頁。","generating":"產生中...","generate":"產生結果","resultReady":"結果已產生：","file":"個檔案","files":"個檔案","download":"下載"},"es":{"title":"Seleccionar páginas","rangeLabel":"Rangos de páginas","rangePlaceholder":"Ejemplos: 1-3,5,8-10","selectAll":"Todo","selectOdd":"Impares","selectEven":"Pares","clear":"Limpiar","outputMode":"Modo de salida","modeSingle":"Extraer a un PDF","modeMultiple":"Dividir en varios PDF","splitStrategy":"Estrategia de división","strategyRanges":"Dividir por segmentos de rango","strategyPages":"Dividir por página individual","selectedSummary":"Seleccionadas {selectedCount} / {pageCount} páginas.","generating":"Generando...","generate":"Generar resultado","resultReady":"Resultado listo:","file":"archivo","files":"archivos","download":"Descargar"},"fr":{"title":"Sélectionner des pages","rangeLabel":"Plages de pages","rangePlaceholder":"Exemples : 1-3,5,8-10","selectAll":"Tout","selectOdd":"Impaires","selectEven":"Paires","clear":"Effacer","outputMode":"Mode de sortie","modeSingle":"Extraire en un seul PDF","modeMultiple":"Diviser en plusieurs PDF","splitStrategy":"Stratégie de division","strategyRanges":"Diviser par segments de plage","strategyPages":"Diviser par page","selectedSummary":"{selectedCount} / {pageCount} pages sélectionnées.","generating":"Génération...","generate":"Générer le résultat","resultReady":"Résultat prêt :","file":"fichier","files":"fichiers","download":"Télécharger"},"de":{"title":"Seiten auswählen","rangeLabel":"Seitenbereiche","rangePlaceholder":"Beispiele: 1-3,5,8-10","selectAll":"Alle","selectOdd":"Ungerade","selectEven":"Gerade","clear":"Löschen","outputMode":"Ausgabemodus","modeSingle":"In eine PDF extrahieren","modeMultiple":"In mehrere PDFs aufteilen","splitStrategy":"Aufteilungsstrategie","strategyRanges":"Nach Bereichssegmenten aufteilen","strategyPages":"Nach einzelnen Seiten aufteilen","selectedSummary":"{selectedCount} / {pageCount} Seiten ausgewählt.","generating":"Wird erzeugt...","generate":"Ergebnis erzeugen","resultReady":"Ergebnis bereit:","file":"Datei","files":"Dateien","download":"Herunterladen"},"it":{"title":"Seleziona pagine","rangeLabel":"Intervalli di pagine","rangePlaceholder":"Esempi: 1-3,5,8-10","selectAll":"Tutte","selectOdd":"Dispari","selectEven":"Pari","clear":"Cancella","outputMode":"Modalità di output","modeSingle":"Estrai in un PDF","modeMultiple":"Dividi in più PDF","splitStrategy":"Strategia di divisione","strategyRanges":"Dividi per segmenti di intervallo","strategyPages":"Dividi per singola pagina","selectedSummary":"{selectedCount} / {pageCount} pagine selezionate.","generating":"Generazione...","generate":"Genera risultato","resultReady":"Risultato pronto:","file":"file","files":"file","download":"Scarica"},"ja":{"title":"ページを選択","rangeLabel":"ページ範囲","rangePlaceholder":"例: 1-3,5,8-10","selectAll":"すべて","selectOdd":"奇数","selectEven":"偶数","clear":"クリア","outputMode":"出力モード","modeSingle":"1 つの PDF に抽出","modeMultiple":"複数の PDF に分割","splitStrategy":"分割方式","strategyRanges":"範囲セグメントで分割","strategyPages":"ページ単位で分割","selectedSummary":"{selectedCount} / {pageCount} ページを選択中。","generating":"生成中...","generate":"結果を生成","resultReady":"結果の準備完了:","file":"ファイル","files":"ファイル","download":"ダウンロード"},"ko":{"title":"페이지 선택","rangeLabel":"페이지 범위","rangePlaceholder":"예: 1-3,5,8-10","selectAll":"전체","selectOdd":"홀수","selectEven":"짝수","clear":"지우기","outputMode":"출력 모드","modeSingle":"하나의 PDF로 추출","modeMultiple":"여러 PDF로 분할","splitStrategy":"분할 방식","strategyRanges":"범위 구간으로 분할","strategyPages":"단일 페이지로 분할","selectedSummary":"{selectedCount} / {pageCount}페이지 선택됨.","generating":"생성 중...","generate":"결과 생성","resultReady":"결과 준비 완료:","file":"파일","files":"파일","download":"다운로드"},"ru":{"title":"Выбор страниц","rangeLabel":"Диапазоны страниц","rangePlaceholder":"Примеры: 1-3,5,8-10","selectAll":"Все","selectOdd":"Нечетные","selectEven":"Четные","clear":"Очистить","outputMode":"Режим вывода","modeSingle":"Извлечь в один PDF","modeMultiple":"Разделить на несколько PDF","splitStrategy":"Стратегия разделения","strategyRanges":"Делить по сегментам диапазонов","strategyPages":"Делить по отдельным страницам","selectedSummary":"Выбрано страниц: {selectedCount} / {pageCount}.","generating":"Генерация...","generate":"Сгенерировать результат","resultReady":"Результат готов:","file":"файл","files":"файлов","download":"Скачать"},"pt":{"title":"Selecionar páginas","rangeLabel":"Intervalos de páginas","rangePlaceholder":"Exemplos: 1-3,5,8-10","selectAll":"Todas","selectOdd":"Ímpares","selectEven":"Pares","clear":"Limpar","outputMode":"Modo de saída","modeSingle":"Extrair para um PDF","modeMultiple":"Dividir em vários PDFs","splitStrategy":"Estratégia de divisão","strategyRanges":"Dividir por segmentos de intervalo","strategyPages":"Dividir por página única","selectedSummary":"Selecionadas {selectedCount} / {pageCount} páginas.","generating":"Gerando...","generate":"Gerar resultado","resultReady":"Resultado pronto:","file":"arquivo","files":"arquivos","download":"Baixar"},"ar":{"title":"اختيار الصفحات","rangeLabel":"نطاق الصفحات","rangePlaceholder":"أمثلة: 1-3,5,8-10","selectAll":"الكل","selectOdd":"فردي","selectEven":"زوجي","clear":"مسح","outputMode":"وضع الإخراج","modeSingle":"استخراج إلى PDF واحد","modeMultiple":"تقسيم إلى عدة ملفات PDF","splitStrategy":"استراتيجية التقسيم","strategyRanges":"تقسيم حسب مقاطع النطاق","strategyPages":"تقسيم حسب كل صفحة","selectedSummary":"تم تحديد {selectedCount} / {pageCount} صفحة.","generating":"جارٍ الإنشاء...","generate":"إنشاء النتيجة","resultReady":"النتيجة جاهزة:","file":"ملف","files":"ملفات","download":"تنزيل"},"hi":{"title":"पेज चुनें","rangeLabel":"पेज रेंज","rangePlaceholder":"उदाहरण: 1-3,5,8-10","selectAll":"सभी","selectOdd":"विषम","selectEven":"सम","clear":"साफ़ करें","outputMode":"आउटपुट मोड","modeSingle":"एक PDF में निकालें","modeMultiple":"कई PDF में विभाजित करें","splitStrategy":"विभाजन रणनीति","strategyRanges":"रेंज सेगमेंट के अनुसार विभाजित करें","strategyPages":"एक-एक पेज के अनुसार विभाजित करें","selectedSummary":"{selectedCount} / {pageCount} पेज चुने गए।","generating":"जनरेट हो रहा है...","generate":"परिणाम जनरेट करें","resultReady":"परिणाम तैयार:","file":"फाइल","files":"फाइलें","download":"डाउनलोड"},"tr":{"title":"Sayfaları Seç","rangeLabel":"Sayfa aralıkları","rangePlaceholder":"Örnekler: 1-3,5,8-10","selectAll":"Tümü","selectOdd":"Tek","selectEven":"Çift","clear":"Temizle","outputMode":"Çıktı modu","modeSingle":"Tek PDF olarak çıkar","modeMultiple":"Birden çok PDF'e böl","splitStrategy":"Bölme stratejisi","strategyRanges":"Aralık segmentlerine göre böl","strategyPages":"Tek tek sayfaya göre böl","selectedSummary":"{selectedCount} / {pageCount} sayfa seçildi.","generating":"Oluşturuluyor...","generate":"Sonucu oluştur","resultReady":"Sonuç hazır:","file":"dosya","files":"dosya","download":"İndir"},"nl":{"title":"Pagina's selecteren","rangeLabel":"Paginabereiken","rangePlaceholder":"Voorbeelden: 1-3,5,8-10","selectAll":"Alles","selectOdd":"Oneven","selectEven":"Even","clear":"Wissen","outputMode":"Uitvoermodus","modeSingle":"Naar één PDF extraheren","modeMultiple":"Splitsen naar meerdere PDF's","splitStrategy":"Splitsstrategie","strategyRanges":"Splitsen op bereiksegmenten","strategyPages":"Splitsen per losse pagina","selectedSummary":"{selectedCount} / {pageCount} pagina's geselecteerd.","generating":"Genereren...","generate":"Resultaat genereren","resultReady":"Resultaat gereed:","file":"bestand","files":"bestanden","download":"Downloaden"},"sv":{"title":"Välj sidor","rangeLabel":"Sidintervall","rangePlaceholder":"Exempel: 1-3,5,8-10","selectAll":"Alla","selectOdd":"Udda","selectEven":"Jämna","clear":"Rensa","outputMode":"Utdatamodus","modeSingle":"Extrahera till en PDF","modeMultiple":"Dela till flera PDF:er","splitStrategy":"Delningsstrategi","strategyRanges":"Dela efter intervallsegment","strategyPages":"Dela per enskild sida","selectedSummary":"{selectedCount} / {pageCount} sidor valda.","generating":"Genererar...","generate":"Generera resultat","resultReady":"Resultat klart:","file":"fil","files":"filer","download":"Ladda ner"},"pl":{"title":"Wybierz strony","rangeLabel":"Zakresy stron","rangePlaceholder":"Przykłady: 1-3,5,8-10","selectAll":"Wszystkie","selectOdd":"Nieparzyste","selectEven":"Parzyste","clear":"Wyczyść","outputMode":"Tryb wyjścia","modeSingle":"Wyodrębnij do jednego PDF","modeMultiple":"Podziel na wiele PDF","splitStrategy":"Strategia podziału","strategyRanges":"Dziel według segmentów zakresu","strategyPages":"Dziel według pojedynczych stron","selectedSummary":"Wybrano {selectedCount} / {pageCount} stron.","generating":"Generowanie...","generate":"Generuj wynik","resultReady":"Wynik gotowy:","file":"plik","files":"pliki","download":"Pobierz"},"vi":{"title":"Chọn trang","rangeLabel":"Dải trang","rangePlaceholder":"Ví dụ: 1-3,5,8-10","selectAll":"Tất cả","selectOdd":"Lẻ","selectEven":"Chẵn","clear":"Xóa","outputMode":"Chế độ đầu ra","modeSingle":"Trích xuất thành một PDF","modeMultiple":"Tách thành nhiều PDF","splitStrategy":"Chiến lược tách","strategyRanges":"Tách theo từng đoạn dải","strategyPages":"Tách theo từng trang","selectedSummary":"Đã chọn {selectedCount} / {pageCount} trang.","generating":"Đang tạo...","generate":"Tạo kết quả","resultReady":"Kết quả sẵn sàng:","file":"tệp","files":"tệp","download":"Tải xuống"},"th":{"title":"เลือกหน้า","rangeLabel":"ช่วงหน้า","rangePlaceholder":"ตัวอย่าง: 1-3,5,8-10","selectAll":"ทั้งหมด","selectOdd":"เลขคี่","selectEven":"เลขคู่","clear":"ล้าง","outputMode":"โหมดผลลัพธ์","modeSingle":"แยกเป็น PDF เดียว","modeMultiple":"แยกเป็นหลาย PDF","splitStrategy":"กลยุทธ์การแยก","strategyRanges":"แยกตามช่วงที่ระบุ","strategyPages":"แยกตามหน้าเดี่ยว","selectedSummary":"เลือกแล้ว {selectedCount} / {pageCount} หน้า","generating":"กำลังสร้าง...","generate":"สร้างผลลัพธ์","resultReady":"ผลลัพธ์พร้อมแล้ว:","file":"ไฟล์","files":"ไฟล์","download":"ดาวน์โหลด"},"id":{"title":"Pilih Halaman","rangeLabel":"Rentang halaman","rangePlaceholder":"Contoh: 1-3,5,8-10","selectAll":"Semua","selectOdd":"Ganjil","selectEven":"Genap","clear":"Hapus","outputMode":"Mode keluaran","modeSingle":"Ekstrak ke satu PDF","modeMultiple":"Bagi ke beberapa PDF","splitStrategy":"Strategi pemisahan","strategyRanges":"Pisah berdasarkan segmen rentang","strategyPages":"Pisah per halaman tunggal","selectedSummary":"Dipilih {selectedCount} / {pageCount} halaman.","generating":"Sedang membuat...","generate":"Buat hasil","resultReady":"Hasil siap:","file":"file","files":"file","download":"Unduh"},"he":{"title":"בחירת עמודים","rangeLabel":"טווחי עמודים","rangePlaceholder":"דוגמאות: 1-3,5,8-10","selectAll":"הכול","selectOdd":"אי-זוגיים","selectEven":"זוגיים","clear":"נקה","outputMode":"מצב פלט","modeSingle":"חלץ ל-PDF אחד","modeMultiple":"פצל למספר קובצי PDF","splitStrategy":"אסטרטגיית פיצול","strategyRanges":"פיצול לפי מקטעי טווח","strategyPages":"פיצול לפי עמוד בודד","selectedSummary":"נבחרו {selectedCount} / {pageCount} עמודים.","generating":"יוצר...","generate":"צור תוצאה","resultReady":"התוצאה מוכנה:","file":"קובץ","files":"קבצים","download":"הורדה"},"ms":{"title":"Pilih Halaman","rangeLabel":"Julat halaman","rangePlaceholder":"Contoh: 1-3,5,8-10","selectAll":"Semua","selectOdd":"Ganjil","selectEven":"Genap","clear":"Kosongkan","outputMode":"Mod output","modeSingle":"Ekstrak ke satu PDF","modeMultiple":"Pisah kepada beberapa PDF","splitStrategy":"Strategi pemisahan","strategyRanges":"Pisah mengikut segmen julat","strategyPages":"Pisah mengikut halaman tunggal","selectedSummary":"{selectedCount} / {pageCount} halaman dipilih.","generating":"Sedang menjana...","generate":"Jana hasil","resultReady":"Hasil sedia:","file":"fail","files":"fail","download":"Muat turun"},"no":{"title":"Velg sider","rangeLabel":"Sideintervaller","rangePlaceholder":"Eksempler: 1-3,5,8-10","selectAll":"Alle","selectOdd":"Oddetall","selectEven":"Partall","clear":"Tøm","outputMode":"Utdatamodus","modeSingle":"Trekk ut til én PDF","modeMultiple":"Del opp i flere PDF-er","splitStrategy":"Delingsstrategi","strategyRanges":"Del etter intervallsegmenter","strategyPages":"Del etter enkeltsider","selectedSummary":"Valgt {selectedCount} / {pageCount} sider.","generating":"Genererer...","generate":"Generer resultat","resultReady":"Resultat klart:","file":"fil","files":"filer","download":"Last ned"}}
</i18n>
