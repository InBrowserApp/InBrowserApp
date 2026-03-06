<template>
  <section data-test="preview-section">
    <ToolSectionHeader>{{ t('previewTitle') }}</ToolSectionHeader>
    <n-flex vertical :size="8">
      <n-text depth="3" class="preview-hint">{{ t('previewHint') }}</n-text>

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

      <n-pagination
        v-if="totalPreviewPages > 1"
        class="preview-pagination"
        data-test="preview-pagination"
        size="small"
        :page="previewPage"
        :page-count="totalPreviewPages"
        :simple="false"
        @update:page="setPreviewPage"
      />
    </n-flex>
  </section>
</template>

<script setup lang="ts">
import { NFlex, NPagination, NSpin, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader } from '@shared/ui/tool'
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
  totalPreviewPages,
  isRenderingPage,
  hasPreviewError,
  setPreviewPage,
} = usePdfPageNumberPreview(props)
</script>

<style scoped>
.preview-hint {
  line-height: 1.4;
}

.preview-pagination {
  max-width: 460px;
  margin: 0 auto;
}

.preview-canvas {
  position: relative;
  width: 100%;
  max-width: 460px;
  min-height: 220px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
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
  "en": {"previewTitle":"Live Preview","previewHint":"Rendered from your uploaded PDF with current numbering settings.","previewLoadFailed":"Preview unavailable for this PDF."},
  "zh": {"previewTitle":"实时预览","previewHint":"基于你上传的 PDF 实时渲染，并叠加当前页码设置。","previewLoadFailed":"该 PDF 暂时无法预览。"},
  "zh-CN": {"previewTitle":"实时预览","previewHint":"基于你上传的 PDF 实时渲染，并叠加当前页码设置。","previewLoadFailed":"该 PDF 暂时无法预览。"},
  "zh-TW": {"previewTitle":"即時預覽","previewHint":"根據你上傳的 PDF 即時渲染，並套用目前頁碼設定。","previewLoadFailed":"此 PDF 目前無法預覽。"},
  "zh-HK": {"previewTitle":"即時預覽","previewHint":"根據你上傳的 PDF 即時渲染，並套用目前頁碼設定。","previewLoadFailed":"此 PDF 目前無法預覽。"},
  "es": {"previewTitle":"Vista previa en tiempo real","previewHint":"Renderizada desde el PDF cargado con la numeración actual.","previewLoadFailed":"Vista previa no disponible para este PDF."},
  "fr": {"previewTitle":"Aperçu en direct","previewHint":"Rendu depuis votre PDF avec les réglages actuels.","previewLoadFailed":"Aperçu indisponible pour ce PDF."},
  "de": {"previewTitle":"Live-Vorschau","previewHint":"Aus Ihrer hochgeladenen PDF mit aktuellen Einstellungen gerendert.","previewLoadFailed":"Vorschau für diese PDF nicht verfügbar."},
  "it": {"previewTitle":"Anteprima live","previewHint":"Renderizzata dal PDF caricato con le impostazioni correnti.","previewLoadFailed":"Anteprima non disponibile per questo PDF."},
  "ja": {"previewTitle":"ライブプレビュー","previewHint":"アップロードした PDF を現在の設定で描画します。","previewLoadFailed":"この PDF はプレビューできません。"},
  "ko": {"previewTitle":"실시간 미리보기","previewHint":"업로드한 PDF를 현재 번호 설정으로 렌더링합니다.","previewLoadFailed":"이 PDF는 미리보기를 표시할 수 없습니다."},
  "ru": {"previewTitle":"Предпросмотр в реальном времени","previewHint":"Рендер из загруженного PDF с текущими настройками.","previewLoadFailed":"Предпросмотр для этого PDF недоступен."},
  "pt": {"previewTitle":"Pré-visualização ao vivo","previewHint":"Renderizada do PDF enviado com as configurações atuais.","previewLoadFailed":"Pré-visualização indisponível para este PDF."},
  "ar": {"previewTitle":"معاينة فورية","previewHint":"تُعرض من ملف PDF المرفوع مع إعدادات الترقيم الحالية.","previewLoadFailed":"المعاينة غير متاحة لهذا الملف."},
  "hi": {"previewTitle":"लाइव प्रीव्यू","previewHint":"अपलोड किए गए PDF को वर्तमान सेटिंग के साथ रेंडर किया जाता है।","previewLoadFailed":"इस PDF के लिए प्रीव्यू उपलब्ध नहीं है।"},
  "tr": {"previewTitle":"Canlı önizleme","previewHint":"Yüklenen PDF, mevcut numaralandırma ayarlarıyla oluşturulur.","previewLoadFailed":"Bu PDF için önizleme kullanılamıyor."},
  "nl": {"previewTitle":"Livevoorbeeld","previewHint":"Gerenderd vanuit je PDF met de huidige instellingen.","previewLoadFailed":"Voorbeeld niet beschikbaar voor deze PDF."},
  "sv": {"previewTitle":"Liveförhandsvisning","previewHint":"Renderas från din PDF med aktuella inställningar.","previewLoadFailed":"Förhandsvisning är inte tillgänglig för denna PDF."},
  "pl": {"previewTitle":"Podgląd na żywo","previewHint":"Renderowany z przesłanego PDF z bieżącymi ustawieniami.","previewLoadFailed":"Podgląd dla tego PDF jest niedostępny."},
  "vi": {"previewTitle":"Xem trước trực tiếp","previewHint":"Được render từ PDF tải lên với cài đặt hiện tại.","previewLoadFailed":"Không thể xem trước PDF này."},
  "th": {"previewTitle":"ตัวอย่างแบบเรียลไทม์","previewHint":"เรนเดอร์จาก PDF ที่อัปโหลดด้วยการตั้งค่าปัจจุบัน","previewLoadFailed":"ไม่สามารถแสดงตัวอย่าง PDF นี้ได้"},
  "id": {"previewTitle":"Pratinjau langsung","previewHint":"Dirender dari PDF yang diunggah dengan pengaturan saat ini.","previewLoadFailed":"Pratinjau tidak tersedia untuk PDF ini."},
  "he": {"previewTitle":"תצוגה מקדימה חיה","previewHint":"מוצג מקובץ ה-PDF שהעלית עם ההגדרות הנוכחיות.","previewLoadFailed":"תצוגה מקדימה אינה זמינה עבור PDF זה."},
  "ms": {"previewTitle":"Pratonton langsung","previewHint":"Dirender daripada PDF dimuat naik dengan tetapan semasa.","previewLoadFailed":"Pratonton tidak tersedia untuk PDF ini."},
  "no": {"previewTitle":"Direkte forhåndsvisning","previewHint":"Rendret fra opplastet PDF med gjeldende innstillinger.","previewLoadFailed":"Forhåndsvisning er ikke tilgjengelig for denne PDF-filen."}
}
</i18n>
