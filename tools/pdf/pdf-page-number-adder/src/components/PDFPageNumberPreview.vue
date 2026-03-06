<template>
  <section data-test="preview-section">
    <n-flex vertical :size="8">
      <n-text strong>{{ t('previewTitle') }}</n-text>
      <n-text depth="3" class="preview-hint">{{ t('previewHint') }}</n-text>

      <n-flex class="preview-toolbar" align="center" justify="space-between" :wrap="false">
        <n-button-group>
          <n-button
            quaternary
            size="small"
            data-test="preview-prev-page"
            :disabled="isRenderingPage || !canGoPrevious"
            @click="goToPreviousPage"
          >
            {{ t('previousPage') }}
          </n-button>
          <n-button
            quaternary
            size="small"
            data-test="preview-next-page"
            :disabled="isRenderingPage || !canGoNext"
            @click="goToNextPage"
          >
            {{ t('nextPage') }}
          </n-button>
        </n-button-group>

        <n-text depth="3" data-test="preview-page-indicator">
          {{ t('pageIndicator', { current: previewPage, total: totalPreviewPages }) }}
        </n-text>
      </n-flex>

      <n-text v-if="pageSizeLabel" depth="3" class="preview-size" data-test="preview-page-size">
        {{ pageSizeLabel }}
      </n-text>

      <div class="preview-canvas" data-test="preview-canvas">
        <div v-show="!hasPreviewError" class="preview-paper" data-test="preview-paper">
          <canvas
            ref="previewCanvasRef"
            class="preview-page-canvas"
            data-test="preview-page-canvas"
          />
        </div>

        <n-spin v-if="isRenderingPage" class="preview-spin" size="small" />

        <n-text v-if="hasPreviewError" depth="3" class="preview-error" data-test="preview-error">
          {{ t('previewLoadFailed') }}
        </n-text>
      </div>
    </n-flex>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NButtonGroup, NFlex, NSpin, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { PageNumberFontFamily, PageNumberFormat, PageNumberPosition } from '../types'
import { usePdfPageNumberPreview } from './usePdfPageNumberPreview'

const props = defineProps<{
  file: File | null
  startNumber: number
  format: PageNumberFormat
  fontFamily: PageNumberFontFamily
  position: PageNumberPosition
  fontSize: number
  marginX: number
  marginY: number
  pageCount: number
}>()

const { t } = useI18n({ useScope: 'local' })
const {
  previewCanvasRef,
  previewPage,
  pageWidthPt,
  pageHeightPt,
  totalPreviewPages,
  canGoPrevious,
  canGoNext,
  isRenderingPage,
  hasPreviewError,
  goToPreviousPage,
  goToNextPage,
} = usePdfPageNumberPreview(props)

const pageSizeLabel = computed(() => {
  if (pageWidthPt.value < 1 || pageHeightPt.value < 1) {
    return ''
  }

  return t('pageSize', {
    width: pageWidthPt.value,
    height: pageHeightPt.value,
  })
})
</script>

<style scoped>
.preview-hint {
  line-height: 1.4;
}

.preview-toolbar {
  max-width: 460px;
}

.preview-size {
  max-width: 460px;
}

.preview-canvas {
  position: relative;
  width: 100%;
  max-width: 460px;
  min-height: 220px;
  border-radius: 12px;
  border: 1px solid rgba(17, 113, 194, 0.2);
  background: linear-gradient(160deg, rgba(17, 113, 194, 0.08), rgba(17, 113, 194, 0.02));
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-paper {
  width: 100%;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.18);
  box-shadow:
    0 16px 30px rgba(15, 23, 42, 0.18),
    0 4px 12px rgba(15, 23, 42, 0.12);
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
  background-color: rgba(255, 255, 255, 0.64);
}

.preview-error {
  text-align: center;
  line-height: 1.4;
  padding: 16px;
}
</style>

<!-- prettier-ignore -->
<i18n lang="json">
{
  "en": {"previewTitle":"Live Preview","previewHint":"Rendered from your uploaded PDF with current numbering settings.","previewLoadFailed":"Preview unavailable for this PDF.","previousPage":"Previous","nextPage":"Next","pageIndicator":"Page {current} / {total}","pageSize":"Paper {width} × {height} pt"},
  "zh": {"previewTitle":"实时预览","previewHint":"基于你上传的 PDF 实时渲染，并叠加当前页码设置。","previewLoadFailed":"该 PDF 暂时无法预览。","previousPage":"上一页","nextPage":"下一页","pageIndicator":"第 {current} / {total} 页","pageSize":"纸张 {width} × {height} pt"},
  "zh-CN": {"previewTitle":"实时预览","previewHint":"基于你上传的 PDF 实时渲染，并叠加当前页码设置。","previewLoadFailed":"该 PDF 暂时无法预览。","previousPage":"上一页","nextPage":"下一页","pageIndicator":"第 {current} / {total} 页","pageSize":"纸张 {width} × {height} pt"},
  "zh-TW": {"previewTitle":"即時預覽","previewHint":"根據你上傳的 PDF 即時渲染，並套用目前頁碼設定。","previewLoadFailed":"此 PDF 目前無法預覽。","previousPage":"上一頁","nextPage":"下一頁","pageIndicator":"第 {current} / {total} 頁","pageSize":"紙張 {width} × {height} pt"},
  "zh-HK": {"previewTitle":"即時預覽","previewHint":"根據你上傳的 PDF 即時渲染，並套用目前頁碼設定。","previewLoadFailed":"此 PDF 目前無法預覽。","previousPage":"上一頁","nextPage":"下一頁","pageIndicator":"第 {current} / {total} 頁","pageSize":"紙張 {width} × {height} pt"},
  "es": {"previewTitle":"Vista previa en tiempo real","previewHint":"Renderizada desde el PDF cargado con la numeración actual.","previewLoadFailed":"Vista previa no disponible para este PDF.","previousPage":"Anterior","nextPage":"Siguiente","pageIndicator":"Página {current} / {total}","pageSize":"Papel {width} × {height} pt"},
  "fr": {"previewTitle":"Aperçu en direct","previewHint":"Rendu depuis votre PDF avec les réglages actuels.","previewLoadFailed":"Aperçu indisponible pour ce PDF.","previousPage":"Précédente","nextPage":"Suivante","pageIndicator":"Page {current} / {total}","pageSize":"Papier {width} × {height} pt"},
  "de": {"previewTitle":"Live-Vorschau","previewHint":"Aus Ihrer hochgeladenen PDF mit aktuellen Einstellungen gerendert.","previewLoadFailed":"Vorschau für diese PDF nicht verfügbar.","previousPage":"Zurück","nextPage":"Weiter","pageIndicator":"Seite {current} / {total}","pageSize":"Papier {width} × {height} pt"},
  "it": {"previewTitle":"Anteprima live","previewHint":"Renderizzata dal PDF caricato con le impostazioni correnti.","previewLoadFailed":"Anteprima non disponibile per questo PDF.","previousPage":"Precedente","nextPage":"Successiva","pageIndicator":"Pagina {current} / {total}","pageSize":"Foglio {width} × {height} pt"},
  "ja": {"previewTitle":"ライブプレビュー","previewHint":"アップロードした PDF を現在の設定で描画します。","previewLoadFailed":"この PDF はプレビューできません。","previousPage":"前へ","nextPage":"次へ","pageIndicator":"{current} / {total} ページ","pageSize":"用紙 {width} × {height} pt"},
  "ko": {"previewTitle":"실시간 미리보기","previewHint":"업로드한 PDF를 현재 번호 설정으로 렌더링합니다.","previewLoadFailed":"이 PDF는 미리보기를 표시할 수 없습니다.","previousPage":"이전","nextPage":"다음","pageIndicator":"{current} / {total}페이지","pageSize":"용지 {width} × {height} pt"},
  "ru": {"previewTitle":"Предпросмотр в реальном времени","previewHint":"Рендер из загруженного PDF с текущими настройками.","previewLoadFailed":"Предпросмотр для этого PDF недоступен.","previousPage":"Назад","nextPage":"Вперёд","pageIndicator":"Страница {current} / {total}","pageSize":"Лист {width} × {height} pt"},
  "pt": {"previewTitle":"Pré-visualização ao vivo","previewHint":"Renderizada do PDF enviado com as configurações atuais.","previewLoadFailed":"Pré-visualização indisponível para este PDF.","previousPage":"Anterior","nextPage":"Próxima","pageIndicator":"Página {current} / {total}","pageSize":"Papel {width} × {height} pt"},
  "ar": {"previewTitle":"معاينة فورية","previewHint":"تُعرض من ملف PDF المرفوع مع إعدادات الترقيم الحالية.","previewLoadFailed":"المعاينة غير متاحة لهذا الملف.","previousPage":"السابق","nextPage":"التالي","pageIndicator":"الصفحة {current} / {total}","pageSize":"الورقة {width} × {height} pt"},
  "hi": {"previewTitle":"लाइव प्रीव्यू","previewHint":"अपलोड किए गए PDF को वर्तमान सेटिंग के साथ रेंडर किया जाता है।","previewLoadFailed":"इस PDF के लिए प्रीव्यू उपलब्ध नहीं है।","previousPage":"पिछला","nextPage":"अगला","pageIndicator":"पेज {current} / {total}","pageSize":"कागज़ {width} × {height} pt"},
  "tr": {"previewTitle":"Canlı önizleme","previewHint":"Yüklenen PDF, mevcut numaralandırma ayarlarıyla oluşturulur.","previewLoadFailed":"Bu PDF için önizleme kullanılamıyor.","previousPage":"Önceki","nextPage":"Sonraki","pageIndicator":"Sayfa {current} / {total}","pageSize":"Kağıt {width} × {height} pt"},
  "nl": {"previewTitle":"Livevoorbeeld","previewHint":"Gerenderd vanuit je PDF met de huidige instellingen.","previewLoadFailed":"Voorbeeld niet beschikbaar voor deze PDF.","previousPage":"Vorige","nextPage":"Volgende","pageIndicator":"Pagina {current} / {total}","pageSize":"Papier {width} × {height} pt"},
  "sv": {"previewTitle":"Liveförhandsvisning","previewHint":"Renderas från din PDF med aktuella inställningar.","previewLoadFailed":"Förhandsvisning är inte tillgänglig för denna PDF.","previousPage":"Föregående","nextPage":"Nästa","pageIndicator":"Sida {current} / {total}","pageSize":"Papper {width} × {height} pt"},
  "pl": {"previewTitle":"Podgląd na żywo","previewHint":"Renderowany z przesłanego PDF z bieżącymi ustawieniami.","previewLoadFailed":"Podgląd dla tego PDF jest niedostępny.","previousPage":"Poprzednia","nextPage":"Następna","pageIndicator":"Strona {current} / {total}","pageSize":"Arkusz {width} × {height} pt"},
  "vi": {"previewTitle":"Xem trước trực tiếp","previewHint":"Được render từ PDF tải lên với cài đặt hiện tại.","previewLoadFailed":"Không thể xem trước PDF này.","previousPage":"Trước","nextPage":"Sau","pageIndicator":"Trang {current} / {total}","pageSize":"Giấy {width} × {height} pt"},
  "th": {"previewTitle":"ตัวอย่างแบบเรียลไทม์","previewHint":"เรนเดอร์จาก PDF ที่อัปโหลดด้วยการตั้งค่าปัจจุบัน","previewLoadFailed":"ไม่สามารถแสดงตัวอย่าง PDF นี้ได้","previousPage":"ก่อนหน้า","nextPage":"ถัดไป","pageIndicator":"หน้า {current} / {total}","pageSize":"กระดาษ {width} × {height} pt"},
  "id": {"previewTitle":"Pratinjau langsung","previewHint":"Dirender dari PDF yang diunggah dengan pengaturan saat ini.","previewLoadFailed":"Pratinjau tidak tersedia untuk PDF ini.","previousPage":"Sebelumnya","nextPage":"Berikutnya","pageIndicator":"Halaman {current} / {total}","pageSize":"Kertas {width} × {height} pt"},
  "he": {"previewTitle":"תצוגה מקדימה חיה","previewHint":"מוצג מקובץ ה-PDF שהעלית עם ההגדרות הנוכחיות.","previewLoadFailed":"תצוגה מקדימה אינה זמינה עבור PDF זה.","previousPage":"הקודם","nextPage":"הבא","pageIndicator":"עמוד {current} / {total}","pageSize":"דף {width} × {height} pt"},
  "ms": {"previewTitle":"Pratonton langsung","previewHint":"Dirender daripada PDF dimuat naik dengan tetapan semasa.","previewLoadFailed":"Pratonton tidak tersedia untuk PDF ini.","previousPage":"Sebelumnya","nextPage":"Seterusnya","pageIndicator":"Halaman {current} / {total}","pageSize":"Kertas {width} × {height} pt"},
  "no": {"previewTitle":"Direkte forhåndsvisning","previewHint":"Rendret fra opplastet PDF med gjeldende innstillinger.","previewLoadFailed":"Forhåndsvisning er ikke tilgjengelig for denne PDF-filen.","previousPage":"Forrige","nextPage":"Neste","pageIndicator":"Side {current} / {total}","pageSize":"Papir {width} × {height} pt"}
}
</i18n>
