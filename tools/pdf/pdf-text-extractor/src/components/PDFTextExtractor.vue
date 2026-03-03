<template>
  <ToolSection>
    <PDFUpload @upload-file="handlePDFUpload" />
  </ToolSection>

  <ToolSection>
    <n-alert type="info" :show-icon="false">{{ t('ocr_notice') }}</n-alert>
  </ToolSection>

  <ToolSection v-if="isExtracting">
    <n-spin size="small">
      <n-text>{{ t('extracting') }}</n-text>
    </n-spin>
  </ToolSection>

  <ToolSection v-else-if="errorMessage">
    <n-alert type="error">{{ errorMessage }}</n-alert>
  </ToolSection>

  <ToolSection v-if="result">
    <div ref="resultAnchorRef" class="result-anchor">
      <ToolSectionHeader>
        <n-flex align="center" justify="space-between">
          <span>{{ t('result') }}</span>
          <n-flex align="center" :size="8">
            <CopyToClipboardButton v-if="hasText" :content="result.text" size="small" />
            <n-button
              v-if="hasText"
              tag="a"
              size="small"
              text
              :href="downloadUrl ?? undefined"
              :download="downloadFilename"
            >
              <template #icon>
                <n-icon :component="ArrowDownload16Regular" />
              </template>
              {{ t('download_txt') }}
            </n-button>
          </n-flex>
        </n-flex>
      </ToolSectionHeader>
    </div>

    <n-grid :cols="3" :x-gap="12">
      <n-gi>
        <n-statistic :label="t('pages')" :value="result.pageCount" />
      </n-gi>
      <n-gi>
        <n-statistic :label="t('empty_pages')" :value="result.emptyTextPages" />
      </n-gi>
      <n-gi>
        <n-statistic :label="t('scanned_pages')" :value="result.likelyScannedPages" />
      </n-gi>
    </n-grid>

    <n-alert v-if="result.likelyScannedPages > 0" type="warning" style="margin-top: 12px">
      {{ t('scanned_warning') }}
    </n-alert>

    <n-input
      v-if="hasText"
      readonly
      type="textarea"
      style="margin-top: 12px"
      :value="result.text"
      :autosize="{ minRows: 10, maxRows: 24 }"
    />
    <n-text v-else depth="3" style="margin-top: 12px; display: block">
      {{ t('no_text') }}
    </n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NButton,
  NFlex,
  NGi,
  NGrid,
  NIcon,
  NInput,
  NSpin,
  NStatistic,
  NText,
  useMessage,
} from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { PDFUpload } from '@shared/ui/domain/pdf'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { extractPdfText } from '../utils/extract-pdf-text'
import type { PdfTextExtractionResult } from '../utils/extract-pdf-text'

const { t } = useI18n()
const message = useMessage()

const isExtracting = ref(false)
const errorMessage = ref('')
const uploadedFilename = ref('')
const result = ref<PdfTextExtractionResult | null>(null)
const resultAnchorRef = ref<HTMLElement | null>(null)

const hasText = computed(() => Boolean(result.value?.text.trim()))
const textBlob = computed(() => {
  if (!hasText.value || !result.value) return null
  return new Blob([result.value.text], { type: 'text/plain;charset=utf-8' })
})
const downloadUrl = useObjectUrl(textBlob)
const downloadFilename = computed(() => {
  const baseName = uploadedFilename.value.replace(/\.pdf$/i, '').trim()
  return `${baseName || 'extracted-text'}.txt`
})

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.name === 'PasswordException') {
    return t('password_error')
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return t('extract_error')
}

const scrollToResult = () => {
  const resultAnchor = resultAnchorRef.value
  if (!resultAnchor || typeof resultAnchor.scrollIntoView !== 'function') {
    return
  }

  resultAnchor.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

const handlePDFUpload = async (file: File) => {
  isExtracting.value = true
  errorMessage.value = ''
  result.value = null
  uploadedFilename.value = file.name

  try {
    result.value = await extractPdfText(file)
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
    message.error(errorMessage.value)
  } finally {
    isExtracting.value = false

    if (result.value) {
      await nextTick()
      scrollToResult()
    }
  }
}
</script>

<style scoped>
.result-anchor {
  scroll-margin-top: calc(var(--navbar-height) + 12px);
}
</style>

<i18n lang="json">
{
  "en": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor.",
    "extract_error": "Failed to extract text from PDF."
  },
  "zh": {
    "ocr_notice": "此工具仅提取可选中文本。扫描版 PDF 或纯图片页面需要 OCR。",
    "extracting": "正在提取文本...",
    "result": "提取结果",
    "download_txt": "下载 TXT",
    "pages": "总页数",
    "empty_pages": "空文本页",
    "scanned_pages": "疑似扫描页",
    "scanned_warning": "部分页面看起来是扫描/图片页面，可能需要 OCR 才能提取文本。",
    "no_text": "未找到可提取文本。",
    "password_error": "此提取器暂不支持受密码保护的 PDF。",
    "extract_error": "PDF 文本提取失败。"
  },
  "zh-CN": {
    "ocr_notice": "此工具仅提取可选中文本。扫描版 PDF 或纯图片页面需要 OCR。",
    "extracting": "正在提取文本...",
    "result": "提取结果",
    "download_txt": "下载 TXT",
    "pages": "总页数",
    "empty_pages": "空文本页",
    "scanned_pages": "疑似扫描页",
    "scanned_warning": "部分页面看起来是扫描/图片页面，可能需要 OCR 才能提取文本。",
    "no_text": "未找到可提取文本。",
    "password_error": "此提取器暂不支持受密码保护的 PDF。",
    "extract_error": "PDF 文本提取失败。"
  },
  "zh-TW": {
    "ocr_notice": "此工具僅提取可選取文字。掃描版 PDF 或純圖片頁面需要 OCR。",
    "extracting": "正在提取文字...",
    "result": "提取結果",
    "download_txt": "下載 TXT",
    "pages": "總頁數",
    "empty_pages": "空文字頁",
    "scanned_pages": "疑似掃描頁",
    "scanned_warning": "部分頁面看起來是掃描/圖片頁面，可能需要 OCR 才能提取文字。",
    "no_text": "未找到可提取文字。",
    "password_error": "此提取器暫不支援受密碼保護的 PDF。",
    "extract_error": "PDF 文字提取失敗。"
  },
  "zh-HK": {
    "ocr_notice": "此工具僅提取可選取文字。掃描版 PDF 或純圖片頁面需要 OCR。",
    "extracting": "正在提取文字...",
    "result": "提取結果",
    "download_txt": "下載 TXT",
    "pages": "總頁數",
    "empty_pages": "空文字頁",
    "scanned_pages": "疑似掃描頁",
    "scanned_warning": "部分頁面看起來是掃描/圖片頁面，可能需要 OCR 才能提取文字。",
    "no_text": "未找到可提取文字。",
    "password_error": "此提取器暫不支援受密碼保護的 PDF。",
    "extract_error": "PDF 文字提取失敗。"
  },
  "es": {
    "ocr_notice": "Esta herramienta solo extrae texto seleccionable. Los PDF escaneados o páginas solo con imágenes requieren OCR.",
    "extracting": "Extrayendo texto...",
    "result": "Texto extraído",
    "download_txt": "Descargar TXT",
    "pages": "Páginas",
    "empty_pages": "Páginas sin texto",
    "scanned_pages": "Páginas probablemente escaneadas",
    "scanned_warning": "Algunas páginas parecen escaneadas o de imagen y pueden requerir OCR para obtener texto.",
    "no_text": "No se encontró texto extraíble.",
    "password_error": "Este extractor no admite PDF protegidos con contraseña.",
    "extract_error": "No se pudo extraer texto del PDF."
  },
  "fr": {
    "ocr_notice": "Cet outil extrait uniquement le texte sélectionnable. Les PDF numérisés ou les pages composées d'images nécessitent un OCR.",
    "extracting": "Extraction du texte...",
    "result": "Texte extrait",
    "download_txt": "Télécharger TXT",
    "pages": "Pages",
    "empty_pages": "Pages sans texte",
    "scanned_pages": "Pages probablement numérisées",
    "scanned_warning": "Certaines pages semblent numérisées ou basées sur des images et peuvent nécessiter un OCR pour obtenir du texte.",
    "no_text": "Aucun texte extractible n'a été trouvé.",
    "password_error": "Les PDF protégés par mot de passe ne sont pas pris en charge par cet extracteur.",
    "extract_error": "Échec de l'extraction du texte du PDF."
  },
  "de": {
    "ocr_notice": "Dieses Tool extrahiert nur auswählbaren Text. Gescannte PDFs oder reine Bildseiten benötigen OCR.",
    "extracting": "Text wird extrahiert...",
    "result": "Extrahierter Text",
    "download_txt": "TXT herunterladen",
    "pages": "Seiten",
    "empty_pages": "Seiten ohne Text",
    "scanned_pages": "Wahrscheinlich gescannte Seiten",
    "scanned_warning": "Einige Seiten wirken gescannt/bildbasiert und benötigen möglicherweise OCR, um Text zu erhalten.",
    "no_text": "Kein extrahierbarer Text gefunden.",
    "password_error": "Passwortgeschützte PDFs werden von diesem Extraktor nicht unterstützt.",
    "extract_error": "Text konnte nicht aus der PDF extrahiert werden."
  },
  "it": {
    "ocr_notice": "Questo strumento estrae solo testo selezionabile. I PDF scansionati o le pagine solo immagine richiedono OCR.",
    "extracting": "Estrazione del testo...",
    "result": "Testo estratto",
    "download_txt": "Scarica TXT",
    "pages": "Pagine",
    "empty_pages": "Pagine senza testo",
    "scanned_pages": "Pagine probabilmente scansionate",
    "scanned_warning": "Alcune pagine sembrano scansionate/immagine e potrebbero richiedere OCR per ottenere il testo.",
    "no_text": "Non è stato trovato testo estraibile.",
    "password_error": "I PDF protetti da password non sono supportati da questo estrattore.",
    "extract_error": "Impossibile estrarre il testo dal PDF."
  },
  "ja": {
    "ocr_notice": "このツールは選択可能なテキストのみを抽出します。スキャンPDFや画像のみのページにはOCRが必要です。",
    "extracting": "テキストを抽出中...",
    "result": "抽出されたテキスト",
    "download_txt": "TXTをダウンロード",
    "pages": "ページ数",
    "empty_pages": "テキストなしページ",
    "scanned_pages": "スキャンの可能性が高いページ",
    "scanned_warning": "一部のページはスキャン/画像ページの可能性があり、テキスト抽出にOCRが必要な場合があります。",
    "no_text": "抽出可能なテキストが見つかりませんでした。",
    "password_error": "この抽出ツールはパスワード保護されたPDFをサポートしていません。",
    "extract_error": "PDFからテキストを抽出できませんでした。"
  },
  "ko": {
    "ocr_notice": "이 도구는 선택 가능한 텍스트만 추출합니다. 스캔된 PDF 또는 이미지 전용 페이지에는 OCR이 필요합니다.",
    "extracting": "텍스트 추출 중...",
    "result": "추출된 텍스트",
    "download_txt": "TXT 다운로드",
    "pages": "페이지",
    "empty_pages": "텍스트 없는 페이지",
    "scanned_pages": "스캔된 것으로 보이는 페이지",
    "scanned_warning": "일부 페이지는 스캔/이미지 페이지로 보이며 텍스트 추출에 OCR이 필요할 수 있습니다.",
    "no_text": "추출 가능한 텍스트를 찾지 못했습니다.",
    "password_error": "암호로 보호된 PDF는 이 추출기에서 지원되지 않습니다.",
    "extract_error": "PDF에서 텍스트를 추출하지 못했습니다."
  },
  "ru": {
    "ocr_notice": "Этот инструмент извлекает только выделяемый текст. Для сканированных PDF или страниц только с изображениями нужен OCR.",
    "extracting": "Извлечение текста...",
    "result": "Извлеченный текст",
    "download_txt": "Скачать TXT",
    "pages": "Страницы",
    "empty_pages": "Страницы без текста",
    "scanned_pages": "Вероятно сканированные страницы",
    "scanned_warning": "Некоторые страницы выглядят как скан/изображение и могут требовать OCR для получения текста.",
    "no_text": "Извлекаемый текст не найден.",
    "password_error": "PDF, защищенные паролем, не поддерживаются этим инструментом.",
    "extract_error": "Не удалось извлечь текст из PDF."
  },
  "pt": {
    "ocr_notice": "Esta ferramenta extrai apenas texto selecionável. PDFs digitalizados ou páginas só com imagem exigem OCR.",
    "extracting": "Extraindo texto...",
    "result": "Texto extraído",
    "download_txt": "Baixar TXT",
    "pages": "Páginas",
    "empty_pages": "Páginas sem texto",
    "scanned_pages": "Páginas provavelmente digitalizadas",
    "scanned_warning": "Algumas páginas parecem digitalizadas/de imagem e podem exigir OCR para obter texto.",
    "no_text": "Nenhum texto extraível foi encontrado.",
    "password_error": "PDF protegido por senha não é compatível com este extrator.",
    "extract_error": "Falha ao extrair texto do PDF."
  },
  "ar": {
    "ocr_notice": "تستخرج هذه الأداة النص القابل للتحديد فقط. ملفات PDF الممسوحة ضوئياً أو الصفحات التي تحتوي على صور فقط تتطلب OCR.",
    "extracting": "جارٍ استخراج النص...",
    "result": "النص المستخرج",
    "download_txt": "تنزيل TXT",
    "pages": "الصفحات",
    "empty_pages": "صفحات بلا نص",
    "scanned_pages": "صفحات يُحتمل أنها ممسوحة ضوئياً",
    "scanned_warning": "تبدو بعض الصفحات ممسوحة ضوئياً أو كصور وقد تحتاج إلى OCR لاستخراج النص.",
    "no_text": "لم يتم العثور على نص قابل للاستخراج.",
    "password_error": "ملفات PDF المحمية بكلمة مرور غير مدعومة في هذا المستخرج.",
    "extract_error": "فشل استخراج النص من ملف PDF."
  },
  "hi": {
    "ocr_notice": "यह टूल केवल चयन योग्य टेक्स्ट निकालता है। स्कैन किए गए PDF या केवल इमेज वाले पेज के लिए OCR आवश्यक है।",
    "extracting": "टेक्स्ट निकाला जा रहा है...",
    "result": "निकाला गया टेक्स्ट",
    "download_txt": "TXT डाउनलोड करें",
    "pages": "पेज",
    "empty_pages": "बिना टेक्स्ट वाले पेज",
    "scanned_pages": "संभावित स्कैन किए गए पेज",
    "scanned_warning": "कुछ पेज स्कैन/इमेज जैसे लगते हैं और टेक्स्ट पाने के लिए OCR की आवश्यकता हो सकती है।",
    "no_text": "कोई निकालने योग्य टेक्स्ट नहीं मिला।",
    "password_error": "पासवर्ड-संरक्षित PDF इस एक्सट्रैक्टर में समर्थित नहीं है।",
    "extract_error": "PDF से टेक्स्ट निकालने में विफल।"
  },
  "tr": {
    "ocr_notice": "Bu araç yalnızca seçilebilir metni çıkarır. Taranmış PDF'ler veya yalnızca görüntü içeren sayfalar OCR gerektirir.",
    "extracting": "Metin çıkarılıyor...",
    "result": "Çıkarılan Metin",
    "download_txt": "TXT İndir",
    "pages": "Sayfalar",
    "empty_pages": "Boş metin sayfaları",
    "scanned_pages": "Muhtemelen taranmış sayfalar",
    "scanned_warning": "Bazı sayfalar taranmış/görüntü sayfası gibi görünüyor ve metin almak için OCR gerekebilir.",
    "no_text": "Çıkarılabilir metin bulunamadı.",
    "password_error": "Parola korumalı PDF bu çıkarıcıda desteklenmiyor.",
    "extract_error": "PDF'den metin çıkarılamadı."
  },
  "nl": {
    "ocr_notice": "Deze tool extraheert alleen selecteerbare tekst. Gescande PDF's of pagina's met alleen afbeeldingen vereisen OCR.",
    "extracting": "Tekst wordt geëxtraheerd...",
    "result": "Geëxtraheerde tekst",
    "download_txt": "TXT downloaden",
    "pages": "Pagina's",
    "empty_pages": "Pagina's zonder tekst",
    "scanned_pages": "Waarschijnlijk gescande pagina's",
    "scanned_warning": "Sommige pagina's lijken gescand/afbeelding en hebben mogelijk OCR nodig om tekst te krijgen.",
    "no_text": "Geen extraheerbare tekst gevonden.",
    "password_error": "Met wachtwoord beveiligde PDF wordt niet ondersteund door deze extractor.",
    "extract_error": "Tekst uit PDF extraheren is mislukt."
  },
  "sv": {
    "ocr_notice": "Det här verktyget extraherar endast markerbar text. Skannade PDF:er eller sidor med enbart bilder kräver OCR.",
    "extracting": "Extraherar text...",
    "result": "Extraherad text",
    "download_txt": "Ladda ner TXT",
    "pages": "Sidor",
    "empty_pages": "Sidor utan text",
    "scanned_pages": "Troligen skannade sidor",
    "scanned_warning": "Vissa sidor verkar vara skannade/bildsidor och kan behöva OCR för att få text.",
    "no_text": "Ingen extraherbar text hittades.",
    "password_error": "Lösenordsskyddad PDF stöds inte i detta extraheringsverktyg.",
    "extract_error": "Det gick inte att extrahera text från PDF."
  },
  "pl": {
    "ocr_notice": "To narzędzie wyodrębnia tylko zaznaczalny tekst. Zeskanowane PDF-y lub strony zawierające tylko obraz wymagają OCR.",
    "extracting": "Wyodrębnianie tekstu...",
    "result": "Wyodrębniony tekst",
    "download_txt": "Pobierz TXT",
    "pages": "Strony",
    "empty_pages": "Strony bez tekstu",
    "scanned_pages": "Prawdopodobnie zeskanowane strony",
    "scanned_warning": "Niektóre strony wyglądają na skan/obraz i mogą wymagać OCR, aby uzyskać tekst.",
    "no_text": "Nie znaleziono tekstu możliwego do wyodrębnienia.",
    "password_error": "Pliki PDF chronione hasłem nie są obsługiwane przez to narzędzie.",
    "extract_error": "Nie udało się wyodrębnić tekstu z PDF."
  },
  "vi": {
    "ocr_notice": "Công cụ này chỉ trích xuất văn bản có thể chọn. PDF quét hoặc trang chỉ có hình ảnh cần OCR.",
    "extracting": "Đang trích xuất văn bản...",
    "result": "Văn bản đã trích xuất",
    "download_txt": "Tải TXT",
    "pages": "Số trang",
    "empty_pages": "Trang không có văn bản",
    "scanned_pages": "Các trang có khả năng là bản quét",
    "scanned_warning": "Một số trang có vẻ là trang quét/hình ảnh và có thể cần OCR để lấy văn bản.",
    "no_text": "Không tìm thấy văn bản có thể trích xuất.",
    "password_error": "Trình trích xuất này không hỗ trợ PDF được bảo vệ bằng mật khẩu.",
    "extract_error": "Không thể trích xuất văn bản từ PDF."
  },
  "th": {
    "ocr_notice": "เครื่องมือนี้ดึงได้เฉพาะข้อความที่เลือกได้เท่านั้น PDF ที่สแกนหรือหน้าที่มีแต่รูปภาพต้องใช้ OCR",
    "extracting": "กำลังดึงข้อความ...",
    "result": "ข้อความที่ดึงได้",
    "download_txt": "ดาวน์โหลด TXT",
    "pages": "หน้า",
    "empty_pages": "หน้าที่ไม่มีข้อความ",
    "scanned_pages": "หน้าที่น่าจะเป็นหน้าสแกน",
    "scanned_warning": "บางหน้าดูเหมือนเป็นหน้าสแกน/รูปภาพ และอาจต้องใช้ OCR เพื่อดึงข้อความ",
    "no_text": "ไม่พบข้อความที่ดึงได้",
    "password_error": "ตัวแยกนี้ยังไม่รองรับ PDF ที่ป้องกันด้วยรหัสผ่าน",
    "extract_error": "ไม่สามารถดึงข้อความจาก PDF ได้"
  },
  "id": {
    "ocr_notice": "Alat ini hanya mengekstrak teks yang dapat dipilih. PDF hasil pindai atau halaman berisi gambar saja memerlukan OCR.",
    "extracting": "Mengekstrak teks...",
    "result": "Teks yang diekstrak",
    "download_txt": "Unduh TXT",
    "pages": "Halaman",
    "empty_pages": "Halaman tanpa teks",
    "scanned_pages": "Halaman yang kemungkinan dipindai",
    "scanned_warning": "Beberapa halaman tampak seperti hasil pindai/gambar dan mungkin memerlukan OCR untuk mendapatkan teks.",
    "no_text": "Tidak ada teks yang dapat diekstrak.",
    "password_error": "PDF yang dilindungi kata sandi tidak didukung oleh ekstraktor ini.",
    "extract_error": "Gagal mengekstrak teks dari PDF."
  },
  "he": {
    "ocr_notice": "הכלי הזה מחלץ רק טקסט שניתן לסמן. קובצי PDF סרוקים או עמודים שמכילים רק תמונות דורשים OCR.",
    "extracting": "מחלץ טקסט...",
    "result": "טקסט שחולץ",
    "download_txt": "הורדת TXT",
    "pages": "עמודים",
    "empty_pages": "עמודים ללא טקסט",
    "scanned_pages": "עמודים שנראים כסרוקים",
    "scanned_warning": "חלק מהעמודים נראים כסרוקים/תמונתיים ועשויים לדרוש OCR כדי לחלץ טקסט.",
    "no_text": "לא נמצא טקסט שניתן לחלץ.",
    "password_error": "קובץ PDF מוגן בסיסמה אינו נתמך במחלץ זה.",
    "extract_error": "חילוץ הטקסט מה-PDF נכשל."
  },
  "ms": {
    "ocr_notice": "Alat ini hanya mengekstrak teks yang boleh dipilih. PDF yang diimbas atau halaman imej sahaja memerlukan OCR.",
    "extracting": "Mengekstrak teks...",
    "result": "Teks yang diekstrak",
    "download_txt": "Muat turun TXT",
    "pages": "Halaman",
    "empty_pages": "Halaman tanpa teks",
    "scanned_pages": "Halaman yang berkemungkinan diimbas",
    "scanned_warning": "Sesetengah halaman kelihatan seperti halaman imbasan/imej dan mungkin memerlukan OCR untuk mendapatkan teks.",
    "no_text": "Tiada teks yang boleh diekstrak ditemui.",
    "password_error": "PDF yang dilindungi kata laluan tidak disokong oleh pengekstrak ini.",
    "extract_error": "Gagal mengekstrak teks daripada PDF."
  },
  "no": {
    "ocr_notice": "Dette verktøyet henter bare ut markerbar tekst. Skannede PDF-er eller sider med bare bilder krever OCR.",
    "extracting": "Henter ut tekst...",
    "result": "Uthentet tekst",
    "download_txt": "Last ned TXT",
    "pages": "Sider",
    "empty_pages": "Sider uten tekst",
    "scanned_pages": "Sannsynligvis skannede sider",
    "scanned_warning": "Noen sider ser ut som skannede/bildesider og kan kreve OCR for å hente tekst.",
    "no_text": "Ingen uthentbar tekst ble funnet.",
    "password_error": "Passordbeskyttet PDF støttes ikke av denne ekstraktoren.",
    "extract_error": "Kunne ikke hente ut tekst fra PDF."
  }
}
</i18n>
