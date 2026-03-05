<template>
  <section data-test="preview-section">
    <n-flex vertical :size="8">
      <n-text strong>{{ t('previewTitle') }}</n-text>
      <n-text depth="3" class="preview-hint">{{ t('previewHint') }}</n-text>

      <div class="preview-canvas" data-test="preview-canvas">
        <canvas
          v-show="!hasPreviewError"
          ref="previewCanvasRef"
          class="preview-page-canvas"
          data-test="preview-page-canvas"
        />

        <n-spin v-if="isRenderingPage" class="preview-spin" size="small" />

        <n-text v-if="hasPreviewError" depth="3" class="preview-error" data-test="preview-error">
          {{ t('previewLoadFailed') }}
        </n-text>
      </div>
    </n-flex>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { NFlex, NSpin, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { PageNumberFormat, PageNumberPosition } from '../types'
import { buildPageNumberLabel, resolvePageNumberCoordinates } from '../utils/page-number-layout'
import { loadPdfDocument } from '../utils/pdfjs'

const props = defineProps<{
  file: File | null
  startNumber: number
  format: PageNumberFormat
  position: PageNumberPosition
  fontSize: number
  marginX: number
  marginY: number
  pageCount: number
}>()

const { t } = useI18n({ useScope: 'local' })

const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
const isRenderingPage = ref(false)
const hasPreviewError = ref(false)

const renderedPageCanvas = document.createElement('canvas')
let renderSequence = 0

const previewLabel = computed(() =>
  buildPageNumberLabel(
    0,
    Math.max(1, props.pageCount),
    Math.max(1, Math.trunc(props.startNumber)),
    props.format,
  ),
)

const previewFontSize = computed(() => Math.max(1, Math.trunc(props.fontSize)))
const previewMarginX = computed(() => Math.max(0, Math.trunc(props.marginX)))
const previewMarginY = computed(() => Math.max(0, Math.trunc(props.marginY)))

const clearVisibleCanvas = (): void => {
  const canvas = previewCanvasRef.value
  if (!canvas) {
    return
  }

  canvas.width = 0
  canvas.height = 0
}

const drawPageNumberPreview = (): void => {
  const canvas = previewCanvasRef.value
  if (!canvas || renderedPageCanvas.width < 1 || renderedPageCanvas.height < 1) {
    return
  }

  canvas.width = renderedPageCanvas.width
  canvas.height = renderedPageCanvas.height

  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(renderedPageCanvas, 0, 0)

  const fontSize = previewFontSize.value
  const label = previewLabel.value

  context.font = `${fontSize}px sans-serif`
  context.textBaseline = 'top'

  const textWidth = context.measureText(label).width
  const coordinates = resolvePageNumberCoordinates({
    pageWidth: canvas.width,
    pageHeight: canvas.height,
    textWidth,
    fontSize,
    marginX: previewMarginX.value,
    marginY: previewMarginY.value,
    position: props.position,
  })

  const topY = canvas.height - coordinates.y - fontSize
  const x = Math.min(Math.max(0, coordinates.x), Math.max(0, canvas.width - textWidth))
  const y = Math.min(Math.max(0, topY), Math.max(0, canvas.height - fontSize))

  context.fillStyle = 'rgba(255, 255, 255, 0.84)'
  context.fillRect(x - 4, y - 2, textWidth + 8, fontSize + 4)
  context.fillStyle = 'rgba(0, 0, 0, 0.82)'
  context.fillText(label, x, y)
}

const renderPreviewPage = async (): Promise<void> => {
  const currentSequence = ++renderSequence

  if (!props.file) {
    hasPreviewError.value = false
    isRenderingPage.value = false
    clearVisibleCanvas()
    renderedPageCanvas.width = 0
    renderedPageCanvas.height = 0
    return
  }

  isRenderingPage.value = true
  hasPreviewError.value = false

  let loadingTask: ReturnType<typeof loadPdfDocument> | null = null
  let documentProxy: {
    destroy?: () => void
    getPage: (pageNumber: number) => Promise<unknown>
  } | null = null

  try {
    const data = new Uint8Array(await props.file.arrayBuffer())
    if (currentSequence !== renderSequence) {
      return
    }

    loadingTask = loadPdfDocument(data)
    documentProxy = (await loadingTask.promise) as {
      destroy?: () => void
      getPage: (pageNumber: number) => Promise<{
        getViewport: (params: { scale: number }) => { width: number; height: number }
        render: (params: {
          canvasContext: CanvasRenderingContext2D
          viewport: { width: number; height: number }
        }) => { promise: Promise<void> }
      }>
    }

    if (currentSequence !== renderSequence) {
      return
    }

    const page = await documentProxy.getPage(1)
    if (currentSequence !== renderSequence) {
      return
    }

    const viewportAtScaleOne = page.getViewport({ scale: 1 })
    const targetWidth = Math.min(1200, Math.max(600, viewportAtScaleOne.width))
    const scale = targetWidth / viewportAtScaleOne.width
    const viewport = page.getViewport({ scale })

    renderedPageCanvas.width = Math.max(1, Math.floor(viewport.width))
    renderedPageCanvas.height = Math.max(1, Math.floor(viewport.height))

    const canvasContext = renderedPageCanvas.getContext('2d')
    if (!canvasContext) {
      throw new Error('PREVIEW_CONTEXT_UNAVAILABLE')
    }

    await page.render({
      canvasContext,
      viewport,
    }).promise

    if (currentSequence !== renderSequence) {
      return
    }

    drawPageNumberPreview()
  } catch {
    if (currentSequence === renderSequence) {
      hasPreviewError.value = true
      clearVisibleCanvas()
      renderedPageCanvas.width = 0
      renderedPageCanvas.height = 0
    }
  } finally {
    try {
      loadingTask?.destroy()
    } catch {
      // no-op
    }

    try {
      documentProxy?.destroy?.()
    } catch {
      // no-op
    }

    if (currentSequence === renderSequence) {
      isRenderingPage.value = false
    }
  }
}

watch(
  () => props.file,
  () => {
    void renderPreviewPage()
  },
  { immediate: true },
)

watch(
  () => [
    props.startNumber,
    props.format,
    props.position,
    props.fontSize,
    props.marginX,
    props.marginY,
    props.pageCount,
  ],
  () => {
    if (!isRenderingPage.value && !hasPreviewError.value) {
      drawPageNumberPreview()
    }
  },
)

onBeforeUnmount(() => {
  renderSequence += 1
})
</script>

<style scoped>
.preview-hint {
  line-height: 1.4;
}

.preview-canvas {
  position: relative;
  width: 100%;
  max-width: 420px;
  min-height: 220px;
  border-radius: 12px;
  border: 1px dashed var(--n-border-color);
  background: linear-gradient(145deg, rgba(17, 113, 194, 0.1), rgba(17, 113, 194, 0.02));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-page-canvas {
  width: 100%;
  height: auto;
  display: block;
}

.preview-spin {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.6);
}

.preview-error {
  text-align: center;
  line-height: 1.4;
  padding: 16px;
}
</style>

<i18n lang="json">
{
  "en": {
    "previewTitle": "Live Preview",
    "previewHint": "Rendered from the first page of your uploaded PDF, with current numbering settings.",
    "previewLoadFailed": "Preview unavailable for this PDF."
  },
  "zh": {
    "previewTitle": "实时预览",
    "previewHint": "基于你上传 PDF 的第一页渲染，并叠加当前页码设置。",
    "previewLoadFailed": "该 PDF 暂时无法预览。"
  },
  "zh-CN": {
    "previewTitle": "实时预览",
    "previewHint": "基于你上传 PDF 的第一页渲染，并叠加当前页码设置。",
    "previewLoadFailed": "该 PDF 暂时无法预览。"
  },
  "zh-TW": {
    "previewTitle": "即時預覽",
    "previewHint": "以你上傳 PDF 的第一頁渲染，並套用目前頁碼設定。",
    "previewLoadFailed": "此 PDF 目前無法預覽。"
  },
  "zh-HK": {
    "previewTitle": "即時預覽",
    "previewHint": "以你上傳 PDF 的第一頁渲染，並套用目前頁碼設定。",
    "previewLoadFailed": "此 PDF 目前無法預覽。"
  },
  "es": {
    "previewTitle": "Vista previa en tiempo real",
    "previewHint": "Se renderiza desde la primera página del PDF subido con la numeración actual.",
    "previewLoadFailed": "Vista previa no disponible para este PDF."
  },
  "fr": {
    "previewTitle": "Aperçu en direct",
    "previewHint": "Rendu depuis la première page de votre PDF avec les réglages actuels.",
    "previewLoadFailed": "Aperçu indisponible pour ce PDF."
  },
  "de": {
    "previewTitle": "Live-Vorschau",
    "previewHint": "Aus der ersten Seite Ihrer PDF-Datei gerendert, mit den aktuellen Seitennummern-Einstellungen.",
    "previewLoadFailed": "Vorschau für diese PDF nicht verfügbar."
  },
  "it": {
    "previewTitle": "Anteprima live",
    "previewHint": "Renderizzata dalla prima pagina del PDF caricato con le impostazioni correnti.",
    "previewLoadFailed": "Anteprima non disponibile per questo PDF."
  },
  "ja": {
    "previewTitle": "ライブプレビュー",
    "previewHint": "アップロードした PDF の1ページ目を描画し、現在の設定で表示します。",
    "previewLoadFailed": "この PDF はプレビューできません。"
  },
  "ko": {
    "previewTitle": "실시간 미리보기",
    "previewHint": "업로드한 PDF 첫 페이지를 렌더링하고 현재 번호 설정을 반영합니다.",
    "previewLoadFailed": "이 PDF는 미리보기를 표시할 수 없습니다."
  },
  "ru": {
    "previewTitle": "Предпросмотр в реальном времени",
    "previewHint": "Рендерится из первой страницы загруженного PDF с текущими настройками нумерации.",
    "previewLoadFailed": "Предпросмотр для этого PDF недоступен."
  },
  "pt": {
    "previewTitle": "Pré-visualização ao vivo",
    "previewHint": "Renderizada a partir da primeira página do PDF enviado com as configurações atuais.",
    "previewLoadFailed": "Pré-visualização indisponível para este PDF."
  },
  "ar": {
    "previewTitle": "معاينة فورية",
    "previewHint": "يتم العرض من الصفحة الأولى لملف PDF المرفوع مع إعدادات الترقيم الحالية.",
    "previewLoadFailed": "المعاينة غير متاحة لهذا الملف."
  },
  "hi": {
    "previewTitle": "लाइव प्रीव्यू",
    "previewHint": "यह आपके अपलोड किए गए PDF के पहले पेज से वर्तमान नंबरिंग सेटिंग के साथ रेंडर होता है।",
    "previewLoadFailed": "इस PDF के लिए प्रीव्यू उपलब्ध नहीं है।"
  },
  "tr": {
    "previewTitle": "Canlı önizleme",
    "previewHint": "Yüklediğiniz PDF'nin ilk sayfasından mevcut numaralandırma ayarlarıyla oluşturulur.",
    "previewLoadFailed": "Bu PDF için önizleme kullanılamıyor."
  },
  "nl": {
    "previewTitle": "Livevoorbeeld",
    "previewHint": "Gerenderd vanaf de eerste pagina van je geüploade PDF met de huidige instellingen.",
    "previewLoadFailed": "Voorbeeld niet beschikbaar voor deze PDF."
  },
  "sv": {
    "previewTitle": "Liveförhandsvisning",
    "previewHint": "Renderas från första sidan i din uppladdade PDF med aktuella sidnumreringsinställningar.",
    "previewLoadFailed": "Förhandsvisning är inte tillgänglig för denna PDF."
  },
  "pl": {
    "previewTitle": "Podgląd na żywo",
    "previewHint": "Renderowany z pierwszej strony przesłanego PDF z bieżącymi ustawieniami numeracji.",
    "previewLoadFailed": "Podgląd dla tego PDF jest niedostępny."
  },
  "vi": {
    "previewTitle": "Xem trước trực tiếp",
    "previewHint": "Được render từ trang đầu của PDF đã tải lên với cài đặt đánh số hiện tại.",
    "previewLoadFailed": "Không thể xem trước PDF này."
  },
  "th": {
    "previewTitle": "ตัวอย่างแบบเรียลไทม์",
    "previewHint": "เรนเดอร์จากหน้าแรกของ PDF ที่อัปโหลด พร้อมการตั้งค่าหมายเลขหน้าปัจจุบัน",
    "previewLoadFailed": "ไม่สามารถแสดงตัวอย่าง PDF นี้ได้"
  },
  "id": {
    "previewTitle": "Pratinjau langsung",
    "previewHint": "Dirender dari halaman pertama PDF yang Anda unggah dengan pengaturan penomoran saat ini.",
    "previewLoadFailed": "Pratinjau tidak tersedia untuk PDF ini."
  },
  "he": {
    "previewTitle": "תצוגה מקדימה חיה",
    "previewHint": "מוצג מהעמוד הראשון בקובץ ה-PDF שהעלית עם הגדרות המספור הנוכחיות.",
    "previewLoadFailed": "תצוגה מקדימה אינה זמינה עבור PDF זה."
  },
  "ms": {
    "previewTitle": "Pratonton langsung",
    "previewHint": "Dirender daripada halaman pertama PDF yang dimuat naik dengan tetapan nombor semasa.",
    "previewLoadFailed": "Pratonton tidak tersedia untuk PDF ini."
  },
  "no": {
    "previewTitle": "Direkte forhåndsvisning",
    "previewHint": "Rendret fra den første siden i opplastet PDF med gjeldende nummereringsinnstillinger.",
    "previewLoadFailed": "Forhåndsvisning er ikke tilgjengelig for denne PDF-filen."
  }
}
</i18n>
