<template>
  <ToolSection v-if="numPages > 0">
    <ToolSectionHeader>{{ t('previewTitle') }}</ToolSectionHeader>

    <n-flex vertical :size="12">
      <div class="preview-stage">
        <div v-if="isRendering" class="preview-image-frame preview-skeleton-frame">
          <n-skeleton class="preview-skeleton" :style="previewSkeletonStyle" />
        </div>
        <n-alert
          v-else-if="errorMessage"
          class="preview-alert"
          type="error"
          :title="t('renderErrorTitle')"
        >
          {{ errorMessage }}
        </n-alert>
        <div v-else-if="previewUrl" class="preview-image-frame">
          <img :src="previewUrl" :alt="t('previewTitle')" class="preview-image" />
        </div>
        <n-empty v-else :description="t('emptyPreview')" />
      </div>

      <n-flex align="center" justify="space-between" :size="8" wrap>
        <n-text depth="3">{{ t('pageInfo', { page, total: numPages }) }}</n-text>
        <n-text v-if="pageImage" depth="3">{{ detailsText }}</n-text>
      </n-flex>

      <n-flex v-if="numPages > 1" justify="center">
        <n-pagination
          v-model:page="pageModel"
          :page-count="numPages"
          :page-slot="7"
          size="small"
          :disabled="isRendering"
        />
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { filesize } from 'filesize'
import { useObjectUrl } from '@vueuse/core'
import { NAlert, NEmpty, NFlex, NPagination, NSkeleton, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { PdfPageImage } from '../types'

const props = defineProps<{
  page: number
  numPages: number
  pageImage: PdfPageImage | null
  isRendering: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  (event: 'update:page', value: number): void
}>()

const { t } = useI18n({ useScope: 'local' })

const pageModel = computed({
  get: () => props.page,
  set: (value: number) => emit('update:page', value),
})

const imageRef = toRef(props, 'pageImage')
const previewUrl = useObjectUrl(computed(() => imageRef.value?.blob ?? null))
const lastRenderedWidth = ref<number | null>(null)
const lastRenderedHeight = ref<number | null>(null)

watch(
  () => props.pageImage,
  (image) => {
    if (!image || image.width <= 0 || image.height <= 0) return
    lastRenderedWidth.value = image.width
    lastRenderedHeight.value = image.height
  },
  { immediate: true },
)

const previewSkeletonStyle = computed(() => {
  const fallbackWidth = 360
  const fallbackAspectRatio = 1 / Math.SQRT2

  const width = lastRenderedWidth.value
  const height = lastRenderedHeight.value

  return {
    width: width ? `${width}px` : `${fallbackWidth}px`,
    maxWidth: '100%',
    aspectRatio: width && height ? `${width} / ${height}` : `${fallbackAspectRatio}`,
  }
})

const detailsText = computed(() => {
  if (!props.pageImage) return ''

  return t('details', {
    width: props.pageImage.width,
    height: props.pageImage.height,
    dpi: props.pageImage.dpi,
    size: filesize(props.pageImage.blob.size) as string,
  })
})
</script>

<style scoped>
.preview-stage {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.preview-alert {
  max-width: min(100%, 680px);
}

.preview-image-frame {
  width: fit-content;
  max-width: 100%;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  padding: 8px;
}

.preview-skeleton-frame {
  width: fit-content;
  max-width: 100%;
}

.preview-skeleton {
  display: block;
  border-radius: 6px;
}

.preview-image {
  max-width: 100%;
  max-height: min(65vh, 720px);
  object-fit: contain;
  display: block;
}
</style>

<i18n lang="json">
{
  "en": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Error",
    "emptyPreview": "Upload a PDF and pick export settings to preview pages.",
    "pageInfo": "Page {page} / {total}",
    "details": "Details: {width} × {height} · {dpi} DPI · {size}"
  },
  "zh": {
    "previewTitle": "预览",
    "renderErrorTitle": "渲染错误",
    "emptyPreview": "上传 PDF 并选择导出设置后即可预览页面。",
    "pageInfo": "第 {page} / {total} 页",
    "details": "详情: {width} × {height} · {dpi} DPI · {size}"
  },
  "zh-CN": {
    "previewTitle": "预览",
    "renderErrorTitle": "渲染错误",
    "emptyPreview": "上传 PDF 并选择导出设置后即可预览页面。",
    "pageInfo": "第 {page} / {total} 页",
    "details": "详情: {width} × {height} · {dpi} DPI · {size}"
  },
  "zh-TW": {
    "previewTitle": "預覽",
    "renderErrorTitle": "渲染錯誤",
    "emptyPreview": "上傳 PDF 並選擇匯出設定後即可預覽頁面。",
    "pageInfo": "第 {page} / {total} 頁",
    "details": "詳情: {width} × {height} · {dpi} DPI · {size}"
  },
  "zh-HK": {
    "previewTitle": "預覽",
    "renderErrorTitle": "渲染錯誤",
    "emptyPreview": "上傳 PDF 並選擇匯出設定後即可預覽頁面。",
    "pageInfo": "第 {page} / {total} 頁",
    "details": "詳情: {width} × {height} · {dpi} DPI · {size}"
  },
  "es": {
    "previewTitle": "Vista previa",
    "renderErrorTitle": "Error de renderizado",
    "emptyPreview": "Sube un PDF y elige la configuración de exportación para previsualizar páginas.",
    "pageInfo": "Página {page} / {total}",
    "details": "Detalles: {width} × {height} · {dpi} DPI · {size}"
  },
  "fr": {
    "previewTitle": "Aperçu",
    "renderErrorTitle": "Erreur de rendu",
    "emptyPreview": "Importez un PDF et choisissez les options d'export pour prévisualiser les pages.",
    "pageInfo": "Page {page} sur {total}",
    "details": "Détails: {width} × {height} · {dpi} DPI · {size}"
  },
  "de": {
    "previewTitle": "Vorschau",
    "renderErrorTitle": "Rendering-Fehler",
    "emptyPreview": "Laden Sie eine PDF hoch und wählen Sie Exporteinstellungen, um Seiten vorzuschauen.",
    "pageInfo": "Seite {page} / {total}",
    "details": "Einzelheiten: {width} × {height} · {dpi} DPI · {size}"
  },
  "it": {
    "previewTitle": "Anteprima",
    "renderErrorTitle": "Errore di rendering",
    "emptyPreview": "Carica un PDF e scegli le impostazioni di esportazione per vedere l'anteprima delle pagine.",
    "pageInfo": "Pagina {page} / {total}",
    "details": "Dettagli: {width} × {height} · {dpi} DPI · {size}"
  },
  "ja": {
    "previewTitle": "プレビュー",
    "renderErrorTitle": "レンダリングエラー",
    "emptyPreview": "PDF をアップロードし、エクスポート設定を選ぶとページをプレビューできます。",
    "pageInfo": "ページ {page} / {total}",
    "details": "詳細: {width} × {height} · {dpi} DPI · {size}"
  },
  "ko": {
    "previewTitle": "미리보기",
    "renderErrorTitle": "렌더링 오류",
    "emptyPreview": "PDF를 업로드하고 내보내기 설정을 선택하면 페이지를 미리 볼 수 있습니다.",
    "pageInfo": "페이지 {page} / {total}",
    "details": "세부 정보: {width} × {height} · {dpi} DPI · {size}"
  },
  "ru": {
    "previewTitle": "Предпросмотр",
    "renderErrorTitle": "Ошибка рендеринга",
    "emptyPreview": "Загрузите PDF и выберите параметры экспорта, чтобы просмотреть страницы.",
    "pageInfo": "Страница {page} / {total}",
    "details": "Детали: {width} × {height} · {dpi} DPI · {size}"
  },
  "pt": {
    "previewTitle": "Pré-visualização",
    "renderErrorTitle": "Erro de renderização",
    "emptyPreview": "Envie um PDF e escolha as opções de exportação para visualizar as páginas.",
    "pageInfo": "Página {page} / {total}",
    "details": "Detalhes: {width} × {height} · {dpi} DPI · {size}"
  },
  "ar": {
    "previewTitle": "المعاينة",
    "renderErrorTitle": "خطأ في العرض",
    "emptyPreview": "ارفع ملف PDF واختر إعدادات التصدير لمعاينة الصفحات.",
    "pageInfo": "الصفحة {page} / {total}",
    "details": "التفاصيل: {width} × {height} · {dpi} DPI · {size}"
  },
  "hi": {
    "previewTitle": "पूर्वावलोकन",
    "renderErrorTitle": "रेंडर त्रुटि",
    "emptyPreview": "PDF अपलोड करें और पेज प्रीव्यू के लिए एक्सपोर्ट सेटिंग चुनें।",
    "pageInfo": "पेज {page} / {total}",
    "details": "विवरण: {width} × {height} · {dpi} DPI · {size}"
  },
  "tr": {
    "previewTitle": "Önizleme",
    "renderErrorTitle": "İşleme hatası",
    "emptyPreview": "Sayfaları önizlemek için bir PDF yükleyin ve dışa aktarma ayarlarını seçin.",
    "pageInfo": "Sayfa {page} / {total}",
    "details": "Detaylar: {width} × {height} · {dpi} DPI · {size}"
  },
  "nl": {
    "previewTitle": "Voorbeeld",
    "renderErrorTitle": "Renderfout",
    "emptyPreview": "Upload een PDF en kies exportinstellingen om pagina's te bekijken.",
    "pageInfo": "Pagina {page} / {total}",
    "details": "Nadere info: {width} × {height} · {dpi} DPI · {size}"
  },
  "sv": {
    "previewTitle": "Förhandsvisning",
    "renderErrorTitle": "Renderingsfel",
    "emptyPreview": "Ladda upp en PDF och välj exportinställningar för att förhandsgranska sidor.",
    "pageInfo": "Sida {page} / {total}",
    "details": "Detaljer: {width} × {height} · {dpi} DPI · {size}"
  },
  "pl": {
    "previewTitle": "Podgląd",
    "renderErrorTitle": "Błąd renderowania",
    "emptyPreview": "Prześlij PDF i wybierz ustawienia eksportu, aby podejrzeć strony.",
    "pageInfo": "Strona {page} / {total}",
    "details": "Szczegóły: {width} × {height} · {dpi} DPI · {size}"
  },
  "vi": {
    "previewTitle": "Xem trước",
    "renderErrorTitle": "Lỗi kết xuất",
    "emptyPreview": "Tải lên PDF và chọn thiết lập xuất để xem trước các trang.",
    "pageInfo": "Trang {page} / {total}",
    "details": "Chi tiết: {width} × {height} · {dpi} DPI · {size}"
  },
  "th": {
    "previewTitle": "ตัวอย่าง",
    "renderErrorTitle": "ข้อผิดพลาดการเรนเดอร์",
    "emptyPreview": "อัปโหลด PDF และเลือกการตั้งค่าส่งออกเพื่อดูตัวอย่างหน้า",
    "pageInfo": "หน้า {page} / {total}",
    "details": "รายละเอียด: {width} × {height} · {dpi} DPI · {size}"
  },
  "id": {
    "previewTitle": "Pratinjau",
    "renderErrorTitle": "Kesalahan render",
    "emptyPreview": "Unggah PDF dan pilih pengaturan ekspor untuk melihat pratinjau halaman.",
    "pageInfo": "Halaman {page} / {total}",
    "details": "Detail: {width} × {height} · {dpi} DPI · {size}"
  },
  "he": {
    "previewTitle": "תצוגה מקדימה",
    "renderErrorTitle": "שגיאת רינדור",
    "emptyPreview": "העלה PDF ובחר הגדרות ייצוא כדי להציג תצוגה מקדימה של העמודים.",
    "pageInfo": "עמוד {page} / {total}",
    "details": "פרטים: {width} × {height} · {dpi} DPI · {size}"
  },
  "ms": {
    "previewTitle": "Pratonton",
    "renderErrorTitle": "Ralat render",
    "emptyPreview": "Muat naik PDF dan pilih tetapan eksport untuk pratonton halaman.",
    "pageInfo": "Halaman {page} / {total}",
    "details": "Butiran: {width} × {height} · {dpi} DPI · {size}"
  },
  "no": {
    "previewTitle": "Forhåndsvisning",
    "renderErrorTitle": "Renderingsfeil",
    "emptyPreview": "Last opp en PDF og velg eksportinnstillinger for å forhåndsvise sider.",
    "pageInfo": "Side {page} / {total}",
    "details": "Detaljer: {width} × {height} · {dpi} DPI · {size}"
  }
}
</i18n>
