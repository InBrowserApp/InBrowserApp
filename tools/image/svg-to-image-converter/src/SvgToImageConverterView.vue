<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <SvgUploadSection
      :original-file="originalFile"
      :original-preview-url="originalPreviewUrl"
      :original-size-label="originalSizeLabel"
      :original-dimensions-label="originalDimensionsLabel"
      :on-before-upload="handleBeforeUpload"
      :on-clear-file="handleClearFile"
    />

    <SvgOptionsSection
      v-show="svgText"
      :format="format"
      :width="width"
      :height="height"
      :keep-aspect="keepAspect"
      :use-background="useBackground"
      :background-color="backgroundColor"
      :show-quality="showQuality"
      :quality="quality"
      :is-converting="isConverting"
      :on-format-update="handleFormatUpdate"
      :on-width-update="handleWidthUpdate"
      :on-height-update="handleHeightUpdate"
      :on-keep-aspect-toggle="handleKeepAspectToggle"
      :on-background-change="handleBackgroundChange"
      :on-background-toggle="handleBackgroundToggle"
      :on-quality-update="handleQualityUpdate"
      :on-reset="resetToOriginal"
      :on-convert="convertSvg"
    />

    <SvgResultsSection
      v-show="outputBlob"
      :original-dimensions-label="originalDimensionsLabel"
      :original-size-label="originalSizeLabel"
      :output-dimensions-label="outputDimensionsLabel"
      :output-size-label="outputSizeLabel"
      :output-file-name="outputFileName"
      :output-preview-url="outputPreviewUrl"
      :download-href="downloadHref"
    />

    <ToolSection v-show="error">
      <n-alert type="error">{{ error }}</n-alert>
    </ToolSection>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert, useMessage } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import SvgOptionsSection from './components/SvgOptionsSection.vue'
import SvgResultsSection from './components/SvgResultsSection.vue'
import SvgUploadSection from './components/SvgUploadSection.vue'
import { useSvgConverter } from './composables/useSvgConverter'
import * as toolInfo from './info'

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()

const messages = {
  onlyOneFile: t('onlyOneFile'),
  invalidFileType: t('invalidFileType'),
  readError: t('readError'),
  invalidSvg: t('invalidSvg'),
  convertSuccess: t('convertSuccess'),
  convertFailed: t('convertFailed'),
  imageLoadFailed: t('imageLoadFailed'),
  noCanvas: t('noCanvas'),
}

const {
  backgroundColor,
  convertSvg,
  downloadHref,
  error,
  format,
  handleBackgroundChange,
  handleBackgroundToggle,
  handleBeforeUpload,
  handleClearFile,
  handleFormatUpdate,
  handleHeightUpdate,
  handleKeepAspectToggle,
  handleQualityUpdate,
  handleWidthUpdate,
  height,
  isConverting,
  keepAspect,
  originalDimensionsLabel,
  originalFile,
  originalPreviewUrl,
  originalSizeLabel,
  outputBlob,
  outputDimensionsLabel,
  outputFileName,
  outputPreviewUrl,
  outputSizeLabel,
  quality,
  resetToOriginal,
  showQuality,
  svgText,
  useBackground,
  width,
} = useSvgConverter(messages, message)
</script>

<i18n lang="json">
{
  "en": {
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid SVG file",
    "readError": "Failed to read SVG file",
    "invalidSvg": "Invalid SVG content",
    "convertSuccess": "Conversion completed!",
    "convertFailed": "Failed to convert SVG",
    "imageLoadFailed": "Failed to load SVG image",
    "noCanvas": "Canvas is not supported in this browser"
  },
  "zh": {
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的 SVG 文件",
    "readError": "读取 SVG 文件失败",
    "invalidSvg": "无效的 SVG 内容",
    "convertSuccess": "转换完成！",
    "convertFailed": "转换 SVG 失败",
    "imageLoadFailed": "加载 SVG 图像失败",
    "noCanvas": "当前浏览器不支持 Canvas"
  },
  "zh-CN": {
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的 SVG 文件",
    "readError": "读取 SVG 文件失败",
    "invalidSvg": "无效的 SVG 内容",
    "convertSuccess": "转换完成！",
    "convertFailed": "转换 SVG 失败",
    "imageLoadFailed": "加载 SVG 图像失败",
    "noCanvas": "当前浏览器不支持 Canvas"
  },
  "zh-TW": {
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的 SVG 檔案",
    "readError": "讀取 SVG 檔案失敗",
    "invalidSvg": "無效的 SVG 內容",
    "convertSuccess": "轉換完成！",
    "convertFailed": "SVG 轉換失敗",
    "imageLoadFailed": "載入 SVG 圖像失敗",
    "noCanvas": "目前瀏覽器不支援 Canvas"
  },
  "zh-HK": {
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的 SVG 檔案",
    "readError": "讀取 SVG 檔案失敗",
    "invalidSvg": "無效的 SVG 內容",
    "convertSuccess": "轉換完成！",
    "convertFailed": "SVG 轉換失敗",
    "imageLoadFailed": "載入 SVG 圖像失敗",
    "noCanvas": "目前瀏覽器不支援 Canvas"
  },
  "es": {
    "onlyOneFile": "Solo se puede subir un archivo",
    "invalidFileType": "Por favor selecciona un archivo SVG válido",
    "readError": "Error al leer el archivo SVG",
    "invalidSvg": "Contenido SVG inválido",
    "convertSuccess": "¡Conversión completada!",
    "convertFailed": "Error al convertir SVG",
    "imageLoadFailed": "Error al cargar la imagen SVG",
    "noCanvas": "Este navegador no admite Canvas"
  },
  "fr": {
    "onlyOneFile": "Un seul fichier peut être téléversé",
    "invalidFileType": "Veuillez sélectionner un fichier SVG valide",
    "readError": "Échec de la lecture du fichier SVG",
    "invalidSvg": "Contenu SVG invalide",
    "convertSuccess": "Conversion terminée !",
    "convertFailed": "Échec de la conversion SVG",
    "imageLoadFailed": "Échec du chargement de l'image SVG",
    "noCanvas": "Ce navigateur ne prend pas en charge Canvas"
  },
  "de": {
    "onlyOneFile": "Es kann nur eine Datei hochgeladen werden",
    "invalidFileType": "Bitte wählen Sie eine gültige SVG-Datei",
    "readError": "SVG-Datei konnte nicht gelesen werden",
    "invalidSvg": "Ungültiger SVG-Inhalt",
    "convertSuccess": "Konvertierung abgeschlossen!",
    "convertFailed": "SVG-Konvertierung fehlgeschlagen",
    "imageLoadFailed": "SVG-Bild konnte nicht geladen werden",
    "noCanvas": "Dieser Browser unterstützt Canvas nicht"
  },
  "it": {
    "onlyOneFile": "È possibile caricare un solo file",
    "invalidFileType": "Seleziona un file SVG valido",
    "readError": "Impossibile leggere il file SVG",
    "invalidSvg": "Contenuto SVG non valido",
    "convertSuccess": "Conversione completata!",
    "convertFailed": "Conversione SVG non riuscita",
    "imageLoadFailed": "Caricamento immagine SVG non riuscito",
    "noCanvas": "Questo browser non supporta Canvas"
  },
  "ja": {
    "onlyOneFile": "アップロードできるファイルは 1 つだけです",
    "invalidFileType": "有効な SVG ファイルを選択してください",
    "readError": "SVG ファイルの読み込みに失敗しました",
    "invalidSvg": "無効な SVG コンテンツ",
    "convertSuccess": "変換が完了しました！",
    "convertFailed": "SVG の変換に失敗しました",
    "imageLoadFailed": "SVG 画像の読み込みに失敗しました",
    "noCanvas": "このブラウザは Canvas をサポートしていません"
  },
  "ko": {
    "onlyOneFile": "하나의 파일만 업로드할 수 있습니다",
    "invalidFileType": "유효한 SVG 파일을 선택하세요",
    "readError": "SVG 파일을 읽지 못했습니다",
    "invalidSvg": "잘못된 SVG 콘텐츠",
    "convertSuccess": "변환 완료!",
    "convertFailed": "SVG 변환 실패",
    "imageLoadFailed": "SVG 이미지 로드 실패",
    "noCanvas": "이 브라우저는 Canvas를 지원하지 않습니다"
  },
  "ru": {
    "onlyOneFile": "Можно загрузить только один файл",
    "invalidFileType": "Пожалуйста, выберите действительный SVG файл",
    "readError": "Не удалось прочитать SVG файл",
    "invalidSvg": "Недопустимое содержимое SVG",
    "convertSuccess": "Конвертация завершена!",
    "convertFailed": "Не удалось конвертировать SVG",
    "imageLoadFailed": "Не удалось загрузить SVG изображение",
    "noCanvas": "Этот браузер не поддерживает Canvas"
  },
  "pt": {
    "onlyOneFile": "Apenas um arquivo pode ser enviado",
    "invalidFileType": "Por favor selecione um arquivo SVG válido",
    "readError": "Falha ao ler o arquivo SVG",
    "invalidSvg": "Conteúdo SVG inválido",
    "convertSuccess": "Conversão concluída!",
    "convertFailed": "Falha ao converter SVG",
    "imageLoadFailed": "Falha ao carregar a imagem SVG",
    "noCanvas": "Este navegador não suporta Canvas"
  },
  "ar": {
    "onlyOneFile": "يمكن رفع ملف واحد فقط",
    "invalidFileType": "يرجى اختيار ملف SVG صالح",
    "readError": "فشل في قراءة ملف SVG",
    "invalidSvg": "محتوى SVG غير صالح",
    "convertSuccess": "اكتمل التحويل!",
    "convertFailed": "فشل في تحويل SVG",
    "imageLoadFailed": "فشل في تحميل صورة SVG",
    "noCanvas": "هذا المتصفح لا يدعم Canvas"
  },
  "hi": {
    "onlyOneFile": "केवल एक फ़ाइल अपलोड की जा सकती है",
    "invalidFileType": "कृपया एक मान्य SVG फ़ाइल चुनें",
    "readError": "SVG फ़ाइल पढ़ने में विफल",
    "invalidSvg": "अमान्य SVG सामग्री",
    "convertSuccess": "रूपांतरण पूरा हुआ!",
    "convertFailed": "SVG रूपांतरण विफल",
    "imageLoadFailed": "SVG छवि लोड करने में विफल",
    "noCanvas": "यह ब्राउज़र Canvas को सपोर्ट नहीं करता"
  },
  "tr": {
    "onlyOneFile": "Sadece bir dosya yüklenebilir",
    "invalidFileType": "Lütfen geçerli bir SVG dosyası seçin",
    "readError": "SVG dosyası okunamadı",
    "invalidSvg": "Geçersiz SVG içeriği",
    "convertSuccess": "Dönüştürme tamamlandı!",
    "convertFailed": "SVG dönüştürülemedi",
    "imageLoadFailed": "SVG resmi yüklenemedi",
    "noCanvas": "Bu tarayıcı Canvas'ı desteklemiyor"
  },
  "nl": {
    "onlyOneFile": "Er kan slechts één bestand worden geüpload",
    "invalidFileType": "Selecteer een geldig SVG-bestand",
    "readError": "Kan SVG-bestand niet lezen",
    "invalidSvg": "Ongeldige SVG-inhoud",
    "convertSuccess": "Conversie voltooid!",
    "convertFailed": "SVG-conversie mislukt",
    "imageLoadFailed": "SVG-afbeelding laden mislukt",
    "noCanvas": "Deze browser ondersteunt Canvas niet"
  },
  "sv": {
    "onlyOneFile": "Endast en fil kan laddas upp",
    "invalidFileType": "Välj en giltig SVG-fil",
    "readError": "Kunde inte läsa SVG-fil",
    "invalidSvg": "Ogiltigt SVG-innehåll",
    "convertSuccess": "Konvertering klar!",
    "convertFailed": "Misslyckades med att konvertera SVG",
    "imageLoadFailed": "Misslyckades med att ladda SVG-bilden",
    "noCanvas": "Denna webbläsare stöder inte Canvas"
  },
  "pl": {
    "onlyOneFile": "Można przesłać tylko jeden plik",
    "invalidFileType": "Wybierz prawidłowy plik SVG",
    "readError": "Nie udało się odczytać pliku SVG",
    "invalidSvg": "Nieprawidłowa zawartość SVG",
    "convertSuccess": "Konwersja zakończona!",
    "convertFailed": "Nie udało się przekonwertować SVG",
    "imageLoadFailed": "Nie udało się wczytać obrazu SVG",
    "noCanvas": "Ta przeglądarka nie obsługuje Canvas"
  },
  "vi": {
    "onlyOneFile": "Chỉ có thể tải lên một tệp",
    "invalidFileType": "Vui lòng chọn tệp SVG hợp lệ",
    "readError": "Không thể đọc tệp SVG",
    "invalidSvg": "Nội dung SVG không hợp lệ",
    "convertSuccess": "Chuyển đổi hoàn tất!",
    "convertFailed": "Không thể chuyển đổi SVG",
    "imageLoadFailed": "Không thể tải ảnh SVG",
    "noCanvas": "Trình duyệt này không hỗ trợ Canvas"
  },
  "th": {
    "onlyOneFile": "สามารถอัปโหลดได้เพียงหนึ่งไฟล์",
    "invalidFileType": "กรุณาเลือกไฟล์ SVG ที่ถูกต้อง",
    "readError": "ไม่สามารถอ่านไฟล์ SVG ได้",
    "invalidSvg": "เนื้อหา SVG ไม่ถูกต้อง",
    "convertSuccess": "แปลงเสร็จสิ้น!",
    "convertFailed": "แปลง SVG ไม่สำเร็จ",
    "imageLoadFailed": "ไม่สามารถโหลดรูป SVG ได้",
    "noCanvas": "เบราว์เซอร์นี้ไม่รองรับ Canvas"
  },
  "id": {
    "onlyOneFile": "Hanya satu file yang dapat diunggah",
    "invalidFileType": "Silakan pilih file SVG yang valid",
    "readError": "Gagal membaca file SVG",
    "invalidSvg": "Konten SVG tidak valid",
    "convertSuccess": "Konversi selesai!",
    "convertFailed": "Gagal mengonversi SVG",
    "imageLoadFailed": "Gagal memuat gambar SVG",
    "noCanvas": "Browser ini tidak mendukung Canvas"
  },
  "he": {
    "onlyOneFile": "ניתן להעלות קובץ אחד בלבד",
    "invalidFileType": "אנא בחר קובץ SVG תקין",
    "readError": "נכשל בקריאת קובץ SVG",
    "invalidSvg": "תוכן SVG לא חוקי",
    "convertSuccess": "ההמרה הושלמה!",
    "convertFailed": "המרת SVG נכשלה",
    "imageLoadFailed": "טעינת תמונת SVG נכשלה",
    "noCanvas": "דפדפן זה אינו תומך ב-Canvas"
  },
  "ms": {
    "onlyOneFile": "Hanya satu fail boleh dimuat naik",
    "invalidFileType": "Sila pilih fail SVG yang sah",
    "readError": "Gagal membaca fail SVG",
    "invalidSvg": "Kandungan SVG tidak sah",
    "convertSuccess": "Penukaran selesai!",
    "convertFailed": "Gagal menukar SVG",
    "imageLoadFailed": "Gagal memuat imej SVG",
    "noCanvas": "Pelayar ini tidak menyokong Canvas"
  },
  "no": {
    "onlyOneFile": "Kun én fil kan lastes opp",
    "invalidFileType": "Vennligst velg en gyldig SVG-fil",
    "readError": "Kunne ikke lese SVG-fil",
    "invalidSvg": "Ugyldig SVG-innhold",
    "convertSuccess": "Konvertering fullført!",
    "convertFailed": "Kunne ikke konvertere SVG",
    "imageLoadFailed": "Kunne ikke laste SVG-bildet",
    "noCanvas": "Denne nettleseren støtter ikke Canvas"
  }
}
</i18n>
