<template>
  <section ref="headingAnchorRef" class="selection-heading-anchor">
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="12">
        <PDFSplitSelectionFilters
          :page-count="pageCount"
          :selected-count="selectedCount"
          :range-input="rangeInput"
          :range-error-message="rangeErrorMessage"
          @update:range-input="emit('update:range-input', $event)"
          @select-all="emit('select-all')"
          @select-odd="emit('select-odd')"
          @select-even="emit('select-even')"
          @clear-selection="emit('clear-selection')"
        />

        <PDFSplitSelectionMode
          :output-mode="outputMode"
          :multiple-mode="multipleMode"
          @update:output-mode="emit('update:output-mode', $event)"
          @update:multiple-mode="emit('update:multiple-mode', $event)"
        />

        <PDFSplitSelectionGenerate
          :is-generating="isGenerating"
          :can-generate="canGenerate"
          :generate-error-message="generateErrorMessage"
          :has-result="hasResult"
          :download-url="downloadUrl"
          :result-filename="resultFilename"
          :result-file-count="resultFileCount"
          @generate="emit('generate')"
        />
      </n-flex>
    </ToolSection>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFlex } from 'naive-ui'
import type { SplitMultipleMode, SplitOutputMode } from '../split-pdf.worker'
import { PAGE_RANGE_ERROR } from '../utils/parse-page-ranges'
import { PDF_ERROR } from '../pdf-errors'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import PDFSplitSelectionFilters from './PDFSplitSelectionFilters.vue'
import PDFSplitSelectionMode from './PDFSplitSelectionMode.vue'
import PDFSplitSelectionGenerate from './PDFSplitSelectionGenerate.vue'

const props = defineProps<{
  pageCount: number
  selectedCount: number
  rangeInput: string
  outputMode: SplitOutputMode
  multipleMode: SplitMultipleMode
  isGenerating: boolean
  canGenerate: boolean
  rangeErrorCode: string
  generateErrorCode: string
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

const rangeErrorMessage = computed(() => {
  if (!props.rangeErrorCode) {
    return ''
  }

  if (props.rangeErrorCode === PAGE_RANGE_ERROR.Empty) {
    return t('rangeEmpty')
  }

  if (props.rangeErrorCode === PAGE_RANGE_ERROR.OutOfBounds) {
    return t('rangeOutOfBounds')
  }

  if (props.rangeErrorCode === PAGE_RANGE_ERROR.DescendingRange) {
    return t('rangeDescending')
  }

  if (props.rangeErrorCode === PAGE_RANGE_ERROR.DuplicatePage) {
    return t('rangeDuplicate')
  }

  return t('rangeInvalid')
})

const generateErrorMessage = computed(() => {
  if (!props.generateErrorCode) {
    return ''
  }

  if (props.generateErrorCode === PDF_ERROR.WorkerUnsupported) {
    return t('workerUnsupported')
  }

  return t('generateFailed')
})

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

<i18n lang="json">
{
  "en": {
    "title": "Select Pages",
    "rangeEmpty": "Please enter page ranges first.",
    "rangeOutOfBounds": "Range contains pages outside the current PDF page count.",
    "rangeDescending": "Range start cannot be greater than range end.",
    "rangeDuplicate": "Each page can only appear once in the range expression.",
    "rangeInvalid": "Page range expression is invalid.",
    "workerUnsupported": "Your browser does not support Web Worker.",
    "generateFailed": "Failed to generate result file(s)."
  },
  "zh": {
    "title": "选择页面",
    "rangeEmpty": "请先输入页面范围。",
    "rangeOutOfBounds": "范围包含超出当前 PDF 页数的页面。",
    "rangeDescending": "范围起始页不能大于结束页。",
    "rangeDuplicate": "范围表达式中的页面不能重复。",
    "rangeInvalid": "页面范围表达式无效。",
    "workerUnsupported": "当前浏览器不支持 Web Worker。",
    "generateFailed": "生成结果文件失败。"
  },
  "zh-CN": {
    "title": "选择页面",
    "rangeEmpty": "请先输入页面范围。",
    "rangeOutOfBounds": "范围包含超出当前 PDF 页数的页面。",
    "rangeDescending": "范围起始页不能大于结束页。",
    "rangeDuplicate": "范围表达式中的页面不能重复。",
    "rangeInvalid": "页面范围表达式无效。",
    "workerUnsupported": "当前浏览器不支持 Web Worker。",
    "generateFailed": "生成结果文件失败。"
  },
  "zh-TW": {
    "title": "選擇頁面",
    "rangeEmpty": "請先輸入頁面範圍。",
    "rangeOutOfBounds": "範圍包含超出目前 PDF 頁數的頁面。",
    "rangeDescending": "範圍起始頁不能大於結束頁。",
    "rangeDuplicate": "範圍表達式中的頁面不能重複。",
    "rangeInvalid": "頁面範圍表達式無效。",
    "workerUnsupported": "目前瀏覽器不支援 Web Worker。",
    "generateFailed": "產生結果檔案失敗。"
  },
  "zh-HK": {
    "title": "選擇頁面",
    "rangeEmpty": "請先輸入頁面範圍。",
    "rangeOutOfBounds": "範圍包含超出目前 PDF 頁數的頁面。",
    "rangeDescending": "範圍起始頁不能大於結束頁。",
    "rangeDuplicate": "範圍表達式中的頁面不能重複。",
    "rangeInvalid": "頁面範圍表達式無效。",
    "workerUnsupported": "目前瀏覽器不支援 Web Worker。",
    "generateFailed": "產生結果檔案失敗。"
  },
  "es": {
    "title": "Seleccionar páginas",
    "rangeEmpty": "Primero ingresa los rangos de páginas.",
    "rangeOutOfBounds": "El rango contiene páginas fuera del total del PDF actual.",
    "rangeDescending": "El inicio del rango no puede ser mayor que el final.",
    "rangeDuplicate": "Cada página solo puede aparecer una vez en la expresión de rango.",
    "rangeInvalid": "La expresión de rango de páginas no es válida.",
    "workerUnsupported": "Tu navegador no admite Web Worker.",
    "generateFailed": "No se pudo generar el/los archivo(s) de resultado."
  },
  "fr": {
    "title": "Sélectionner des pages",
    "rangeEmpty": "Veuillez d'abord saisir des plages de pages.",
    "rangeOutOfBounds": "La plage contient des pages hors du nombre de pages du PDF actuel.",
    "rangeDescending": "Le début de la plage ne peut pas être supérieur à la fin.",
    "rangeDuplicate": "Chaque page ne peut apparaître qu'une seule fois dans l'expression.",
    "rangeInvalid": "L'expression de plage de pages est invalide.",
    "workerUnsupported": "Votre navigateur ne prend pas en charge Web Worker.",
    "generateFailed": "Échec de la génération du ou des fichiers de résultat."
  },
  "de": {
    "title": "Seiten auswählen",
    "rangeEmpty": "Bitte geben Sie zuerst Seitenbereiche ein.",
    "rangeOutOfBounds": "Der Bereich enthält Seiten außerhalb der aktuellen PDF-Seitenzahl.",
    "rangeDescending": "Der Start eines Bereichs darf nicht größer als das Ende sein.",
    "rangeDuplicate": "Jede Seite darf in der Bereichsangabe nur einmal vorkommen.",
    "rangeInvalid": "Die Seitenbereichsangabe ist ungültig.",
    "workerUnsupported": "Ihr Browser unterstützt keinen Web Worker.",
    "generateFailed": "Ergebnisdatei(en) konnten nicht erzeugt werden."
  },
  "it": {
    "title": "Seleziona pagine",
    "rangeEmpty": "Inserisci prima gli intervalli di pagine.",
    "rangeOutOfBounds": "L'intervallo contiene pagine oltre il numero di pagine del PDF corrente.",
    "rangeDescending": "L'inizio dell'intervallo non può essere maggiore della fine.",
    "rangeDuplicate": "Ogni pagina può comparire una sola volta nell'espressione.",
    "rangeInvalid": "L'espressione dell'intervallo pagine non è valida.",
    "workerUnsupported": "Il browser non supporta Web Worker.",
    "generateFailed": "Impossibile generare i file di risultato."
  },
  "ja": {
    "title": "ページを選択",
    "rangeEmpty": "先にページ範囲を入力してください。",
    "rangeOutOfBounds": "範囲に現在の PDF ページ数を超えるページが含まれています。",
    "rangeDescending": "範囲の開始ページは終了ページより大きくできません。",
    "rangeDuplicate": "範囲指定では同じページを重複して指定できません。",
    "rangeInvalid": "ページ範囲の指定が無効です。",
    "workerUnsupported": "お使いのブラウザは Web Worker をサポートしていません。",
    "generateFailed": "結果ファイルの生成に失敗しました。"
  },
  "ko": {
    "title": "페이지 선택",
    "rangeEmpty": "먼저 페이지 범위를 입력하세요.",
    "rangeOutOfBounds": "범위에 현재 PDF 페이지 수를 벗어나는 페이지가 포함되어 있습니다.",
    "rangeDescending": "범위 시작 페이지는 종료 페이지보다 클 수 없습니다.",
    "rangeDuplicate": "범위 식에는 같은 페이지를 한 번만 포함할 수 있습니다.",
    "rangeInvalid": "페이지 범위 식이 올바르지 않습니다.",
    "workerUnsupported": "현재 브라우저는 Web Worker를 지원하지 않습니다.",
    "generateFailed": "결과 파일 생성에 실패했습니다."
  },
  "ru": {
    "title": "Выбор страниц",
    "rangeEmpty": "Сначала введите диапазоны страниц.",
    "rangeOutOfBounds": "Диапазон содержит страницы вне количества страниц текущего PDF.",
    "rangeDescending": "Начало диапазона не может быть больше конца.",
    "rangeDuplicate": "Каждая страница может встречаться в выражении диапазона только один раз.",
    "rangeInvalid": "Некорректное выражение диапазона страниц.",
    "workerUnsupported": "Ваш браузер не поддерживает Web Worker.",
    "generateFailed": "Не удалось создать файл(ы) результата."
  },
  "pt": {
    "title": "Selecionar páginas",
    "rangeEmpty": "Primeiro, informe os intervalos de páginas.",
    "rangeOutOfBounds": "O intervalo contém páginas fora da contagem de páginas do PDF atual.",
    "rangeDescending": "O início do intervalo não pode ser maior que o fim.",
    "rangeDuplicate": "Cada página só pode aparecer uma vez na expressão de intervalo.",
    "rangeInvalid": "A expressão de intervalo de páginas é inválida.",
    "workerUnsupported": "Seu navegador não suporta Web Worker.",
    "generateFailed": "Falha ao gerar arquivo(s) de resultado."
  },
  "ar": {
    "title": "اختيار الصفحات",
    "rangeEmpty": "الرجاء إدخال نطاق الصفحات أولاً.",
    "rangeOutOfBounds": "النطاق يحتوي صفحات خارج عدد صفحات ملف PDF الحالي.",
    "rangeDescending": "لا يمكن أن تكون بداية النطاق أكبر من نهايته.",
    "rangeDuplicate": "يمكن لكل صفحة أن تظهر مرة واحدة فقط في تعبير النطاق.",
    "rangeInvalid": "تعبير نطاق الصفحات غير صالح.",
    "workerUnsupported": "متصفحك لا يدعم Web Worker.",
    "generateFailed": "تعذر إنشاء ملف/ملفات النتيجة."
  },
  "hi": {
    "title": "पेज चुनें",
    "rangeEmpty": "कृपया पहले पेज रेंज दर्ज करें।",
    "rangeOutOfBounds": "रेंज में वर्तमान PDF पेज संख्या से बाहर के पेज शामिल हैं।",
    "rangeDescending": "रेंज का प्रारंभ अंत से बड़ा नहीं हो सकता।",
    "rangeDuplicate": "रेंज अभिव्यक्ति में प्रत्येक पेज केवल एक बार आ सकता है।",
    "rangeInvalid": "पेज रेंज अभिव्यक्ति अमान्य है।",
    "workerUnsupported": "आपका ब्राउज़र Web Worker सपोर्ट नहीं करता।",
    "generateFailed": "परिणाम फ़ाइल(ें) बनाने में विफल।"
  },
  "tr": {
    "title": "Sayfaları Seç",
    "rangeEmpty": "Lütfen önce sayfa aralıklarını girin.",
    "rangeOutOfBounds": "Aralık, mevcut PDF sayfa sayısının dışındaki sayfaları içeriyor.",
    "rangeDescending": "Aralık başlangıcı bitişten büyük olamaz.",
    "rangeDuplicate": "Her sayfa aralık ifadesinde yalnızca bir kez yer alabilir.",
    "rangeInvalid": "Sayfa aralığı ifadesi geçersiz.",
    "workerUnsupported": "Tarayıcınız Web Worker desteklemiyor.",
    "generateFailed": "Sonuç dosyası/dosyaları oluşturulamadı."
  },
  "nl": {
    "title": "Pagina's selecteren",
    "rangeEmpty": "Voer eerst paginabereiken in.",
    "rangeOutOfBounds": "Het bereik bevat pagina's buiten het huidige aantal PDF-pagina's.",
    "rangeDescending": "Het begin van het bereik mag niet groter zijn dan het einde.",
    "rangeDuplicate": "Elke pagina mag maar één keer voorkomen in de bereikexpressie.",
    "rangeInvalid": "De paginabereikexpressie is ongeldig.",
    "workerUnsupported": "Je browser ondersteunt geen Web Worker.",
    "generateFailed": "Kon resultaatbestand(en) niet genereren."
  },
  "sv": {
    "title": "Välj sidor",
    "rangeEmpty": "Ange sidintervall först.",
    "rangeOutOfBounds": "Intervallet innehåller sidor utanför aktuellt antal PDF-sidor.",
    "rangeDescending": "Intervallstart kan inte vara större än intervallslut.",
    "rangeDuplicate": "Varje sida får bara förekomma en gång i intervalluttrycket.",
    "rangeInvalid": "Sidintervalluttrycket är ogiltigt.",
    "workerUnsupported": "Din webbläsare stöder inte Web Worker.",
    "generateFailed": "Kunde inte generera resultatfil(er)."
  },
  "pl": {
    "title": "Wybierz strony",
    "rangeEmpty": "Najpierw wpisz zakresy stron.",
    "rangeOutOfBounds": "Zakres zawiera strony poza liczbą stron bieżącego PDF.",
    "rangeDescending": "Początek zakresu nie może być większy niż koniec.",
    "rangeDuplicate": "Każda strona może wystąpić w wyrażeniu tylko raz.",
    "rangeInvalid": "Wyrażenie zakresu stron jest nieprawidłowe.",
    "workerUnsupported": "Twoja przeglądarka nie obsługuje Web Worker.",
    "generateFailed": "Nie udało się wygenerować pliku(ów) wynikowych."
  },
  "vi": {
    "title": "Chọn trang",
    "rangeEmpty": "Vui lòng nhập dải trang trước.",
    "rangeOutOfBounds": "Dải chứa các trang vượt ngoài số trang của PDF hiện tại.",
    "rangeDescending": "Trang bắt đầu của dải không thể lớn hơn trang kết thúc.",
    "rangeDuplicate": "Mỗi trang chỉ được xuất hiện một lần trong biểu thức dải.",
    "rangeInvalid": "Biểu thức dải trang không hợp lệ.",
    "workerUnsupported": "Trình duyệt của bạn không hỗ trợ Web Worker.",
    "generateFailed": "Không thể tạo tệp kết quả."
  },
  "th": {
    "title": "เลือกหน้า",
    "rangeEmpty": "กรุณากรอกช่วงหน้าก่อน",
    "rangeOutOfBounds": "ช่วงมีหน้าที่เกินจำนวนหน้าของ PDF ปัจจุบัน",
    "rangeDescending": "หน้าเริ่มต้นของช่วงต้องไม่มากกว่าหน้าที่สิ้นสุด",
    "rangeDuplicate": "แต่ละหน้าสามารถอยู่ในนิพจน์ช่วงได้เพียงครั้งเดียว",
    "rangeInvalid": "นิพจน์ช่วงหน้าไม่ถูกต้อง",
    "workerUnsupported": "เบราว์เซอร์ของคุณไม่รองรับ Web Worker",
    "generateFailed": "ไม่สามารถสร้างไฟล์ผลลัพธ์ได้"
  },
  "id": {
    "title": "Pilih Halaman",
    "rangeEmpty": "Masukkan rentang halaman terlebih dahulu.",
    "rangeOutOfBounds": "Rentang berisi halaman di luar jumlah halaman PDF saat ini.",
    "rangeDescending": "Awal rentang tidak boleh lebih besar dari akhir rentang.",
    "rangeDuplicate": "Setiap halaman hanya boleh muncul satu kali dalam ekspresi rentang.",
    "rangeInvalid": "Ekspresi rentang halaman tidak valid.",
    "workerUnsupported": "Browser Anda tidak mendukung Web Worker.",
    "generateFailed": "Gagal membuat file hasil."
  },
  "he": {
    "title": "בחירת עמודים",
    "rangeEmpty": "נא להזין קודם טווחי עמודים.",
    "rangeOutOfBounds": "הטווח מכיל עמודים מעבר למספר העמודים בקובץ ה-PDF הנוכחי.",
    "rangeDescending": "תחילת הטווח לא יכולה להיות גדולה מסוף הטווח.",
    "rangeDuplicate": "כל עמוד יכול להופיע פעם אחת בלבד בביטוי הטווח.",
    "rangeInvalid": "ביטוי טווח העמודים אינו תקין.",
    "workerUnsupported": "הדפדפן שלך לא תומך ב-Web Worker.",
    "generateFailed": "יצירת קובץ/קבצי התוצאה נכשלה."
  },
  "ms": {
    "title": "Pilih Halaman",
    "rangeEmpty": "Sila masukkan julat halaman dahulu.",
    "rangeOutOfBounds": "Julat mengandungi halaman di luar jumlah halaman PDF semasa.",
    "rangeDescending": "Permulaan julat tidak boleh lebih besar daripada penghujung julat.",
    "rangeDuplicate": "Setiap halaman hanya boleh muncul sekali dalam ungkapan julat.",
    "rangeInvalid": "Ungkapan julat halaman tidak sah.",
    "workerUnsupported": "Pelayar anda tidak menyokong Web Worker.",
    "generateFailed": "Gagal menjana fail hasil."
  },
  "no": {
    "title": "Velg sider",
    "rangeEmpty": "Angi sideintervaller først.",
    "rangeOutOfBounds": "Intervallet inneholder sider utenfor sidetallet i gjeldende PDF.",
    "rangeDescending": "Intervallstart kan ikke være større enn intervallslutt.",
    "rangeDuplicate": "Hver side kan bare forekomme én gang i intervalluttrykket.",
    "rangeInvalid": "Ugyldig sideintervalluttrykk.",
    "workerUnsupported": "Nettleseren din støtter ikke Web Worker.",
    "generateFailed": "Klarte ikke å generere resultatfil(er)."
  }
}
</i18n>
