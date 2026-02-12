<template>
  <div class="converter-layout">
    <div class="converter-controls" :class="{ 'has-options': numPages > 0 }">
      <div class="converter-controls-item">
        <PdfToImageUploadSection
          :is-loading-document="isLoadingDocument"
          :uploaded-file-name="uploadedFileName"
          :uploaded-file-size="uploadedFileSize"
          :num-pages="numPages"
          @upload-file="handleUpload"
        />
      </div>

      <div v-if="numPages > 0" class="converter-controls-item">
        <PdfToImageOptionsSection
          :format="format"
          :dpi="dpi"
          :quality="quality"
          :num-pages="numPages"
          :has-current-image="Boolean(currentPageImage)"
          :is-rendering="isRendering"
          :is-exporting="isExporting"
          :export-progress="exportProgress"
          :current-download-url="currentImageURL"
          :current-download-name="currentDownloadName"
          :zip-download-url="zipDownloadURL"
          :zip-download-name="zipDownloadName"
          @update:format="setFormat"
          @update:dpi="setDpi"
          @update:quality="setQuality"
          @export-all="exportAllPages"
        />
      </div>
    </div>

    <PdfToImagePreviewSection
      :page="page"
      :num-pages="numPages"
      :page-image="currentPageImage"
      :is-rendering="isRendering"
      :error-message="errorMessage"
      @update:page="page = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePdfToImageConverter } from '../composables/usePdfToImageConverter'
import PdfToImageOptionsSection from './PdfToImageOptionsSection.vue'
import PdfToImagePreviewSection from './PdfToImagePreviewSection.vue'
import PdfToImageUploadSection from './PdfToImageUploadSection.vue'

const { t } = useI18n({ useScope: 'local' })

const {
  page,
  numPages,
  format,
  dpi,
  quality,
  currentPageImage,
  isLoadingDocument,
  isRendering,
  isExporting,
  exportProgress,
  errorMessage,
  uploadedFileName,
  uploadedFileSize,
  currentImageURL,
  currentDownloadName,
  zipDownloadURL,
  zipDownloadName,
  handleUpload,
  setFormat,
  setDpi,
  setQuality,
  exportAllPages,
} = usePdfToImageConverter({
  text: {
    loadFailed: () => t('loadFailed'),
    loadFailedInvalid: () => t('loadFailedInvalid'),
    renderFailed: () => t('renderFailed'),
    renderFailedCanvas: () => t('renderFailedCanvas'),
    exportFailed: () => t('exportFailed'),
    exportFailedCanvas: () => t('exportFailedCanvas'),
    zipReady: ({ count }) => t('zipReady', { count }),
  },
})
</script>

<style scoped>
.converter-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.converter-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

.converter-controls-item {
  min-width: 0;
}

@media (min-width: 960px) {
  .converter-controls.has-options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "zh": {
    "loadFailed": "加载 PDF 文件失败。",
    "loadFailedInvalid": "PDF 文件无效，请上传有效的 PDF。",
    "renderFailed": "渲染所选页面失败。",
    "renderFailedCanvas": "当前浏览器不支持 Canvas 渲染。",
    "exportFailed": "导出全部页面失败。",
    "exportFailedCanvas": "生成导出图像数据失败。",
    "zipReady": "已生成包含 {count} 页的 ZIP 文件。"
  },
  "zh-CN": {
    "loadFailed": "加载 PDF 文件失败。",
    "loadFailedInvalid": "PDF 文件无效，请上传有效的 PDF。",
    "renderFailed": "渲染所选页面失败。",
    "renderFailedCanvas": "当前浏览器不支持 Canvas 渲染。",
    "exportFailed": "导出全部页面失败。",
    "exportFailedCanvas": "生成导出图像数据失败。",
    "zipReady": "已生成包含 {count} 页的 ZIP 文件。"
  },
  "zh-TW": {
    "loadFailed": "載入 PDF 檔案失敗。",
    "loadFailedInvalid": "PDF 檔案無效，請上傳有效的 PDF。",
    "renderFailed": "渲染所選頁面失敗。",
    "renderFailedCanvas": "目前瀏覽器不支援 Canvas 渲染。",
    "exportFailed": "匯出全部頁面失敗。",
    "exportFailedCanvas": "產生匯出影像資料失敗。",
    "zipReady": "已產生包含 {count} 頁的 ZIP 檔案。"
  },
  "zh-HK": {
    "loadFailed": "載入 PDF 檔案失敗。",
    "loadFailedInvalid": "PDF 檔案無效，請上傳有效的 PDF。",
    "renderFailed": "渲染所選頁面失敗。",
    "renderFailedCanvas": "目前瀏覽器不支援 Canvas 渲染。",
    "exportFailed": "匯出全部頁面失敗。",
    "exportFailedCanvas": "產生匯出影像資料失敗。",
    "zipReady": "已產生包含 {count} 頁的 ZIP 檔案。"
  },
  "es": {
    "loadFailed": "No se pudo cargar el archivo PDF.",
    "loadFailedInvalid": "Archivo PDF no válido. Sube un PDF válido.",
    "renderFailed": "No se pudo renderizar la página seleccionada.",
    "renderFailedCanvas": "La renderización con Canvas no está disponible en este navegador.",
    "exportFailed": "No se pudieron exportar todas las páginas.",
    "exportFailedCanvas": "No se pudieron generar los datos de imagen de salida.",
    "zipReady": "El archivo ZIP está listo con {count} páginas."
  },
  "fr": {
    "loadFailed": "Échec du chargement du fichier PDF.",
    "loadFailedInvalid": "Fichier PDF invalide. Veuillez importer un PDF valide.",
    "renderFailed": "Impossible de rendre la page sélectionnée.",
    "renderFailedCanvas": "Le rendu Canvas n'est pas disponible dans ce navigateur.",
    "exportFailed": "Impossible d'exporter toutes les pages.",
    "exportFailedCanvas": "Impossible de générer les données d'image de sortie.",
    "zipReady": "Le fichier ZIP est prêt avec {count} pages."
  },
  "de": {
    "loadFailed": "PDF-Datei konnte nicht geladen werden.",
    "loadFailedInvalid": "Ungültige PDF-Datei. Bitte laden Sie eine gültige PDF hoch.",
    "renderFailed": "Die ausgewählte Seite konnte nicht gerendert werden.",
    "renderFailedCanvas": "Canvas-Rendering ist in diesem Browser nicht verfügbar.",
    "exportFailed": "Alle Seiten konnten nicht exportiert werden.",
    "exportFailedCanvas": "Ausgabebilddaten konnten nicht erzeugt werden.",
    "zipReady": "ZIP-Datei mit {count} Seiten ist bereit."
  },
  "it": {
    "loadFailed": "Impossibile caricare il file PDF.",
    "loadFailedInvalid": "File PDF non valido. Carica un PDF valido.",
    "renderFailed": "Impossibile renderizzare la pagina selezionata.",
    "renderFailedCanvas": "Il rendering Canvas non è disponibile in questo browser.",
    "exportFailed": "Impossibile esportare tutte le pagine.",
    "exportFailedCanvas": "Impossibile generare i dati immagine di output.",
    "zipReady": "Il file ZIP è pronto con {count} pagine."
  },
  "ja": {
    "loadFailed": "PDF ファイルの読み込みに失敗しました。",
    "loadFailedInvalid": "無効な PDF ファイルです。有効な PDF をアップロードしてください。",
    "renderFailed": "選択したページのレンダリングに失敗しました。",
    "renderFailedCanvas": "このブラウザでは Canvas レンダリングを利用できません。",
    "exportFailed": "すべてのページのエクスポートに失敗しました。",
    "exportFailedCanvas": "出力画像データの生成に失敗しました。",
    "zipReady": "{count} ページ分の ZIP ファイルを作成しました。"
  },
  "ko": {
    "loadFailed": "PDF 파일을 불러오지 못했습니다.",
    "loadFailedInvalid": "유효하지 않은 PDF 파일입니다. 올바른 PDF를 업로드해 주세요.",
    "renderFailed": "선택한 페이지를 렌더링하지 못했습니다.",
    "renderFailedCanvas": "이 브라우저에서는 Canvas 렌더링을 사용할 수 없습니다.",
    "exportFailed": "모든 페이지를 내보내지 못했습니다.",
    "exportFailedCanvas": "출력 이미지 데이터를 생성하지 못했습니다.",
    "zipReady": "{count}페이지가 포함된 ZIP 파일이 준비되었습니다."
  },
  "ru": {
    "loadFailed": "Не удалось загрузить PDF-файл.",
    "loadFailedInvalid": "Недопустимый PDF-файл. Загрузите корректный PDF.",
    "renderFailed": "Не удалось отрисовать выбранную страницу.",
    "renderFailedCanvas": "Рендеринг Canvas недоступен в этом браузере.",
    "exportFailed": "Не удалось экспортировать все страницы.",
    "exportFailedCanvas": "Не удалось создать данные выходного изображения.",
    "zipReady": "ZIP-файл готов и содержит {count} страниц."
  },
  "pt": {
    "loadFailed": "Falha ao carregar o arquivo PDF.",
    "loadFailedInvalid": "Arquivo PDF inválido. Envie um PDF válido.",
    "renderFailed": "Falha ao renderizar a página selecionada.",
    "renderFailedCanvas": "A renderização em Canvas não está disponível neste navegador.",
    "exportFailed": "Falha ao exportar todas as páginas.",
    "exportFailedCanvas": "Falha ao gerar os dados de imagem de saída.",
    "zipReady": "O arquivo ZIP está pronto com {count} páginas."
  },
  "ar": {
    "loadFailed": "فشل تحميل ملف PDF.",
    "loadFailedInvalid": "ملف PDF غير صالح. يرجى رفع ملف PDF صالح.",
    "renderFailed": "فشل في عرض الصفحة المحددة.",
    "renderFailedCanvas": "عرض Canvas غير متاح في هذا المتصفح.",
    "exportFailed": "فشل في تصدير جميع الصفحات.",
    "exportFailedCanvas": "فشل في إنشاء بيانات صورة الإخراج.",
    "zipReady": "ملف ZIP جاهز ويحتوي على {count} صفحة."
  },
  "hi": {
    "loadFailed": "PDF फ़ाइल लोड नहीं हो सकी।",
    "loadFailedInvalid": "अमान्य PDF फ़ाइल। कृपया मान्य PDF अपलोड करें।",
    "renderFailed": "चयनित पेज रेंडर नहीं हो सका।",
    "renderFailedCanvas": "इस ब्राउज़र में Canvas रेंडरिंग उपलब्ध नहीं है।",
    "exportFailed": "सभी पेज निर्यात नहीं किए जा सके।",
    "exportFailedCanvas": "आउटपुट इमेज डेटा बनाया नहीं जा सका।",
    "zipReady": "{count} पेज के साथ ZIP फ़ाइल तैयार है।"
  },
  "tr": {
    "loadFailed": "PDF dosyası yüklenemedi.",
    "loadFailedInvalid": "Geçersiz PDF dosyası. Lütfen geçerli bir PDF yükleyin.",
    "renderFailed": "Seçilen sayfa işlenemedi.",
    "renderFailedCanvas": "Bu tarayıcıda Canvas işleme kullanılamıyor.",
    "exportFailed": "Tüm sayfalar dışa aktarılamadı.",
    "exportFailedCanvas": "Çıktı görüntü verileri oluşturulamadı.",
    "zipReady": "{count} sayfalık ZIP dosyası hazır."
  },
  "nl": {
    "loadFailed": "PDF-bestand kon niet worden geladen.",
    "loadFailedInvalid": "Ongeldig PDF-bestand. Upload een geldige PDF.",
    "renderFailed": "De geselecteerde pagina kon niet worden gerenderd.",
    "renderFailedCanvas": "Canvas-rendering is niet beschikbaar in deze browser.",
    "exportFailed": "Niet alle pagina's konden worden geëxporteerd.",
    "exportFailedCanvas": "Uitvoerafbeeldingsgegevens konden niet worden gegenereerd.",
    "zipReady": "ZIP-bestand is klaar met {count} pagina's."
  },
  "sv": {
    "loadFailed": "Det gick inte att läsa in PDF-filen.",
    "loadFailedInvalid": "Ogiltig PDF-fil. Ladda upp en giltig PDF.",
    "renderFailed": "Det gick inte att rendera den valda sidan.",
    "renderFailedCanvas": "Canvas-rendering är inte tillgänglig i den här webbläsaren.",
    "exportFailed": "Det gick inte att exportera alla sidor.",
    "exportFailedCanvas": "Det gick inte att skapa bilddata för export.",
    "zipReady": "ZIP-filen är klar med {count} sidor."
  },
  "pl": {
    "loadFailed": "Nie udało się wczytać pliku PDF.",
    "loadFailedInvalid": "Nieprawidłowy plik PDF. Prześlij poprawny plik PDF.",
    "renderFailed": "Nie udało się wyrenderować wybranej strony.",
    "renderFailedCanvas": "Renderowanie Canvas nie jest dostępne w tej przeglądarce.",
    "exportFailed": "Nie udało się wyeksportować wszystkich stron.",
    "exportFailedCanvas": "Nie udało się wygenerować danych obrazu wyjściowego.",
    "zipReady": "Plik ZIP jest gotowy i zawiera {count} stron."
  },
  "vi": {
    "loadFailed": "Không thể tải tệp PDF.",
    "loadFailedInvalid": "Tệp PDF không hợp lệ. Vui lòng tải lên tệp PDF hợp lệ.",
    "renderFailed": "Không thể kết xuất trang đã chọn.",
    "renderFailedCanvas": "Trình duyệt này không hỗ trợ kết xuất Canvas.",
    "exportFailed": "Không thể xuất tất cả các trang.",
    "exportFailedCanvas": "Không thể tạo dữ liệu ảnh đầu ra.",
    "zipReady": "Tệp ZIP đã sẵn sàng với {count} trang."
  },
  "th": {
    "loadFailed": "ไม่สามารถโหลดไฟล์ PDF ได้",
    "loadFailedInvalid": "ไฟล์ PDF ไม่ถูกต้อง โปรดอัปโหลดไฟล์ PDF ที่ถูกต้อง",
    "renderFailed": "ไม่สามารถเรนเดอร์หน้าที่เลือกได้",
    "renderFailedCanvas": "เบราว์เซอร์นี้ไม่รองรับการเรนเดอร์ Canvas",
    "exportFailed": "ไม่สามารถส่งออกทุกหน้าได้",
    "exportFailedCanvas": "ไม่สามารถสร้างข้อมูลภาพเอาต์พุตได้",
    "zipReady": "ไฟล์ ZIP พร้อมแล้ว มีทั้งหมด {count} หน้า"
  },
  "id": {
    "loadFailed": "Gagal memuat file PDF.",
    "loadFailedInvalid": "File PDF tidak valid. Unggah file PDF yang valid.",
    "renderFailed": "Gagal merender halaman yang dipilih.",
    "renderFailedCanvas": "Perenderan Canvas tidak tersedia di browser ini.",
    "exportFailed": "Gagal mengekspor semua halaman.",
    "exportFailedCanvas": "Gagal membuat data gambar keluaran.",
    "zipReady": "File ZIP siap dengan {count} halaman."
  },
  "he": {
    "loadFailed": "טעינת קובץ ה-PDF נכשלה.",
    "loadFailedInvalid": "קובץ PDF לא תקין. נא להעלות קובץ PDF תקין.",
    "renderFailed": "נכשל ברינדור העמוד שנבחר.",
    "renderFailedCanvas": "רינדור Canvas אינו זמין בדפדפן זה.",
    "exportFailed": "נכשל בייצוא כל העמודים.",
    "exportFailedCanvas": "נכשל ביצירת נתוני תמונת הפלט.",
    "zipReady": "קובץ ZIP מוכן עם {count} עמודים."
  },
  "ms": {
    "loadFailed": "Gagal memuatkan fail PDF.",
    "loadFailedInvalid": "Fail PDF tidak sah. Sila muat naik fail PDF yang sah.",
    "renderFailed": "Gagal merender halaman yang dipilih.",
    "renderFailedCanvas": "Perenderan Canvas tidak tersedia dalam pelayar ini.",
    "exportFailed": "Gagal mengeksport semua halaman.",
    "exportFailedCanvas": "Gagal menjana data imej output.",
    "zipReady": "Fail ZIP sedia dengan {count} halaman."
  },
  "no": {
    "loadFailed": "Kunne ikke laste inn PDF-filen.",
    "loadFailedInvalid": "Ugyldig PDF-fil. Last opp en gyldig PDF.",
    "renderFailed": "Kunne ikke gjengi den valgte siden.",
    "renderFailedCanvas": "Canvas-rendering er ikke tilgjengelig i denne nettleseren.",
    "exportFailed": "Kunne ikke eksportere alle sider.",
    "exportFailedCanvas": "Kunne ikke generere utdata-bildedata.",
    "zipReady": "ZIP-filen er klar med {count} sider."
  }
}
</i18n>
