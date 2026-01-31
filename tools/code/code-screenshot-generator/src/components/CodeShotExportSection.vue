<template>
  <ToolSectionHeader>{{ t('exportTitle') }}</ToolSectionHeader>
  <ToolSection>
    <CodeShotExportPanel
      v-model:filename="fileNameProxy"
      :svg-markup="svgMarkup"
      :svg-width="svgWidth"
      :svg-height="svgHeight"
      :html-snippet="htmlSnippet"
      :html-document="htmlDocument"
      :jpg-background="jpgBackground"
      :labels="exportLabels"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import CodeShotExportPanel from './CodeShotExportPanel.vue'

defineProps<{
  svgMarkup: string
  svgWidth: number
  svgHeight: number
  htmlSnippet: string
  htmlDocument: string
  jpgBackground: string
}>()

const { t } = useI18n()

const fileNameProxy = defineModel<string>('filename', { required: true })

const exportLabels = computed(() => ({
  fileName: t('exportFileName'),
  scale: t('exportScale'),
  rendering: t('exportRendering'),
  png: t('exportPng'),
  jpg: t('exportJpg'),
  webp: t('exportWebp'),
  svg: t('exportSvg'),
  html: t('exportHtml'),
  copySvg: t('exportCopySvg'),
  copyHtml: t('exportCopyHtml'),
  exportError: t('exportError'),
}))
</script>

<i18n lang="json">
{
  "en": {
    "exportTitle": "Export",
    "exportFileName": "File name",
    "exportScale": "Scale",
    "exportRendering": "Rendering preview...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Copy HTML",
    "exportError": "Export failed"
  },
  "zh": {
    "exportTitle": "导出",
    "exportFileName": "文件名",
    "exportScale": "倍率",
    "exportRendering": "正在渲染预览...",
    "exportPng": "下载PNG",
    "exportJpg": "下载JPG",
    "exportWebp": "下载WebP",
    "exportSvg": "下载SVG",
    "exportHtml": "下载HTML",
    "exportCopySvg": "复制SVG",
    "exportCopyHtml": "复制 HTML",
    "exportError": "导出失败"
  },
  "zh-CN": {
    "exportTitle": "导出",
    "exportFileName": "文件名",
    "exportScale": "倍率",
    "exportRendering": "正在渲染预览...",
    "exportPng": "下载PNG",
    "exportJpg": "下载JPG",
    "exportWebp": "下载WebP",
    "exportSvg": "下载SVG",
    "exportHtml": "下载HTML",
    "exportCopySvg": "复制SVG",
    "exportCopyHtml": "复制 HTML",
    "exportError": "导出失败"
  },
  "zh-TW": {
    "exportTitle": "匯出",
    "exportFileName": "檔案名稱",
    "exportScale": "倍率",
    "exportRendering": "正在渲染預覽...",
    "exportPng": "下載PNG",
    "exportJpg": "下載JPG",
    "exportWebp": "下載WebP",
    "exportSvg": "下載SVG",
    "exportHtml": "下載HTML",
    "exportCopySvg": "複製SVG",
    "exportCopyHtml": "複製 HTML",
    "exportError": "匯出失敗"
  },
  "zh-HK": {
    "exportTitle": "匯出",
    "exportFileName": "檔案名稱",
    "exportScale": "倍率",
    "exportRendering": "正在渲染預覽...",
    "exportPng": "下載PNG",
    "exportJpg": "下載JPG",
    "exportWebp": "下載WebP",
    "exportSvg": "下載SVG",
    "exportHtml": "下載HTML",
    "exportCopySvg": "複製SVG",
    "exportCopyHtml": "複製 HTML",
    "exportError": "匯出失敗"
  },
  "es": {
    "exportTitle": "Exportar",
    "exportFileName": "Nombre de archivo",
    "exportScale": "Escala",
    "exportRendering": "Renderizando vista previa...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Copiar HTML",
    "exportError": "Error al exportar"
  },
  "fr": {
    "exportTitle": "Exporter",
    "exportFileName": "Nom du fichier",
    "exportScale": "Échelle",
    "exportRendering": "Rendu de l'aperçu...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Copier HTML",
    "exportError": "Échec de l'export"
  },
  "de": {
    "exportTitle": "Export",
    "exportFileName": "Dateiname",
    "exportScale": "Skalierung",
    "exportRendering": "Vorschau wird gerendert...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "HTML kopieren",
    "exportError": "Export fehlgeschlagen"
  },
  "it": {
    "exportTitle": "Esporta",
    "exportFileName": "Nome file",
    "exportScale": "Scala",
    "exportRendering": "Rendering anteprima...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Copia HTML",
    "exportError": "Esportazione non riuscita"
  },
  "ja": {
    "exportTitle": "書き出し",
    "exportFileName": "ファイル名",
    "exportScale": "倍率",
    "exportRendering": "プレビューを生成中...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "HTML をコピー",
    "exportError": "書き出しに失敗しました"
  },
  "ko": {
    "exportTitle": "내보내기",
    "exportFileName": "파일 이름",
    "exportScale": "배율",
    "exportRendering": "미리보기를 렌더링 중...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "HTML 복사",
    "exportError": "내보내기 실패"
  },
  "ru": {
    "exportTitle": "Экспорт",
    "exportFileName": "Имя файла",
    "exportScale": "Масштаб",
    "exportRendering": "Рендеринг предпросмотра...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Копировать HTML",
    "exportError": "Ошибка экспорта"
  },
  "pt": {
    "exportTitle": "Exportar",
    "exportFileName": "Nome do arquivo",
    "exportScale": "Escala",
    "exportRendering": "Renderizando prévia...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Copiar HTML",
    "exportError": "Falha ao exportar"
  },
  "ar": {
    "exportTitle": "تصدير",
    "exportFileName": "اسم الملف",
    "exportScale": "المقياس",
    "exportRendering": "جارٍ إنشاء المعاينة...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "نسخ HTML",
    "exportError": "فشل التصدير"
  },
  "hi": {
    "exportTitle": "निर्यात",
    "exportFileName": "फ़ाइल नाम",
    "exportScale": "स्केल",
    "exportRendering": "प्रीव्यू रेंडर हो रहा है...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "HTML कॉपी करें",
    "exportError": "निर्यात विफल"
  },
  "tr": {
    "exportTitle": "Dışa aktar",
    "exportFileName": "Dosya adı",
    "exportScale": "Ölçek",
    "exportRendering": "Önizleme oluşturuluyor...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "HTML kopyala",
    "exportError": "Dışa aktarma başarısız"
  },
  "nl": {
    "exportTitle": "Exporteren",
    "exportFileName": "Bestandsnaam",
    "exportScale": "Schaal",
    "exportRendering": "Voorbeeld wordt gerenderd...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "HTML kopiëren",
    "exportError": "Export mislukt"
  },
  "sv": {
    "exportTitle": "Exportera",
    "exportFileName": "Filnamn",
    "exportScale": "Skala",
    "exportRendering": "Renderar förhandsvisning...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Kopiera HTML",
    "exportError": "Export misslyckades"
  },
  "pl": {
    "exportTitle": "Eksport",
    "exportFileName": "Nazwa pliku",
    "exportScale": "Skala",
    "exportRendering": "Renderowanie podglądu...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Kopiuj HTML",
    "exportError": "Eksport nie powiódł się"
  },
  "vi": {
    "exportTitle": "Xuất",
    "exportFileName": "Tên tệp",
    "exportScale": "Tỉ lệ",
    "exportRendering": "Đang kết xuất xem trước...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Sao chép HTML",
    "exportError": "Xuất thất bại"
  },
  "th": {
    "exportTitle": "ส่งออก",
    "exportFileName": "ชื่อไฟล์",
    "exportScale": "สเกล",
    "exportRendering": "กำลังเรนเดอร์ตัวอย่าง...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "คัดลอก HTML",
    "exportError": "ส่งออกล้มเหลว"
  },
  "id": {
    "exportTitle": "Ekspor",
    "exportFileName": "Nama file",
    "exportScale": "Skala",
    "exportRendering": "Merender pratinjau...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Salin HTML",
    "exportError": "Ekspor gagal"
  },
  "he": {
    "exportTitle": "ייצוא",
    "exportFileName": "שם קובץ",
    "exportScale": "קנה מידה",
    "exportRendering": "מעבד תצוגה מקדימה...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "העתק HTML",
    "exportError": "הייצוא נכשל"
  },
  "ms": {
    "exportTitle": "Eksport",
    "exportFileName": "Nama fail",
    "exportScale": "Skala",
    "exportRendering": "Merender pratonton...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Salin HTML",
    "exportError": "Eksport gagal"
  },
  "no": {
    "exportTitle": "Eksport",
    "exportFileName": "Filnavn",
    "exportScale": "Skala",
    "exportRendering": "Rendrer forhåndsvisning...",
    "exportPng": "Download PNG",
    "exportJpg": "Download JPG",
    "exportWebp": "Download WebP",
    "exportSvg": "Download SVG",
    "exportHtml": "Download HTML",
    "exportCopySvg": "Copy SVG",
    "exportCopyHtml": "Kopier HTML",
    "exportError": "Eksport mislyktes"
  }
}
</i18n>
