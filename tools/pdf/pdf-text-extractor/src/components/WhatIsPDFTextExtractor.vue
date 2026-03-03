<template>
  <ToolSection>
    <n-h3>{{ t('title') }}</n-h3>
    <n-p>{{ t('desc_1') }}</n-p>
    <n-p>{{ t('desc_2') }}</n-p>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NH3, NP } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "zh": {
    "title": "PDF 文本提取说明",
    "desc_1": "此工具会在浏览器中直接提取 PDF 内容流里已有的可选中文本。",
    "desc_2": "如果页面是扫描图片，则需要 OCR。本工具暂未内置 OCR。"
  },
  "zh-CN": {
    "title": "PDF 文本提取说明",
    "desc_1": "此工具会在浏览器中直接提取 PDF 内容流里已有的可选中文本。",
    "desc_2": "如果页面是扫描图片，则需要 OCR。本工具暂未内置 OCR。"
  },
  "zh-TW": {
    "title": "PDF 文字提取說明",
    "desc_1": "此工具會在瀏覽器中直接提取 PDF 內容流裡已有的可選取文字。",
    "desc_2": "如果頁面是掃描圖片，則需要 OCR。本工具暫未內建 OCR。"
  },
  "zh-HK": {
    "title": "PDF 文字提取說明",
    "desc_1": "此工具會在瀏覽器中直接提取 PDF 內容流裡已有的可選取文字。",
    "desc_2": "如果頁面是掃描圖片，則需要 OCR。本工具暫未內建 OCR。"
  },
  "es": {
    "title": "Cómo Funciona la Extracción de Texto PDF",
    "desc_1": "Esta herramienta extrae directamente en tu navegador el texto seleccionable existente en los flujos de contenido PDF.",
    "desc_2": "Si una página está escaneada como imagen, se requiere OCR. Esta herramienta todavía no incluye OCR."
  },
  "fr": {
    "title": "Fonctionnement de l'Extraction de Texte PDF",
    "desc_1": "Cet outil extrait directement dans votre navigateur le texte sélectionnable déjà présent dans les flux de contenu PDF.",
    "desc_2": "Si une page est scannée sous forme d'image, l'OCR est nécessaire. Cet outil n'intègre pas encore l'OCR."
  },
  "de": {
    "title": "So Funktioniert die PDF-Textextraktion",
    "desc_1": "Dieses Tool extrahiert direkt im Browser den bereits vorhandenen auswählbaren Text aus PDF-Inhaltsströmen.",
    "desc_2": "Wenn eine Seite als Bild gescannt ist, wird OCR benötigt. OCR ist in diesem Tool noch nicht integriert."
  },
  "it": {
    "title": "Come Funziona l'Estrazione del Testo PDF",
    "desc_1": "Questo strumento estrae direttamente nel browser il testo selezionabile già presente nei flussi di contenuto PDF.",
    "desc_2": "Se una pagina è scansionata come immagine, è necessario l'OCR. L'OCR non è ancora integrato in questo strumento."
  },
  "ja": {
    "title": "PDFテキスト抽出の仕組み",
    "desc_1": "このツールは、PDF のコンテンツストリームに既に含まれる選択可能なテキストをブラウザ上で直接抽出します。",
    "desc_2": "ページが画像としてスキャンされている場合は OCR が必要です。このツールにはまだ OCR は組み込まれていません。"
  },
  "ko": {
    "title": "PDF 텍스트 추출 방식",
    "desc_1": "이 도구는 PDF 콘텐츠 스트림에 이미 포함된 선택 가능한 텍스트를 브라우저에서 직접 추출합니다.",
    "desc_2": "페이지가 이미지로 스캔된 경우 OCR이 필요합니다. 이 도구에는 아직 OCR이 내장되어 있지 않습니다."
  },
  "ru": {
    "title": "Как Работает Извлечение Текста из PDF",
    "desc_1": "Этот инструмент напрямую в браузере извлекает уже существующий выделяемый текст из потоков содержимого PDF.",
    "desc_2": "Если страница отсканирована как изображение, требуется OCR. OCR пока не встроен в этот инструмент."
  },
  "pt": {
    "title": "Como Funciona a Extração de Texto PDF",
    "desc_1": "Esta ferramenta extrai diretamente no navegador o texto selecionável já existente nos fluxos de conteúdo PDF.",
    "desc_2": "Se uma página estiver digitalizada como imagem, é necessário OCR. O OCR ainda não está integrado nesta ferramenta."
  },
  "ar": {
    "title": "كيفية عمل استخراج نص PDF",
    "desc_1": "تستخرج هذه الأداة مباشرة في المتصفح النص القابل للتحديد الموجود مسبقاً في تدفقات محتوى PDF.",
    "desc_2": "إذا كانت الصفحة ممسوحة ضوئياً كصورة فستحتاج إلى OCR. لا يتوفر OCR مدمج في هذه الأداة حالياً."
  },
  "hi": {
    "title": "PDF टेक्स्ट एक्सट्रैक्शन कैसे काम करता है",
    "desc_1": "यह टूल ब्राउज़र में सीधे PDF कंटेंट स्ट्रीम से पहले से मौजूद चयन योग्य टेक्स्ट निकालता है।",
    "desc_2": "यदि पेज इमेज के रूप में स्कैन है, तो OCR आवश्यक है। इस टूल में अभी OCR शामिल नहीं है।"
  },
  "tr": {
    "title": "PDF Metin Çıkarma Nasıl Çalışır",
    "desc_1": "Bu araç, PDF içerik akışlarında mevcut olan seçilebilir metni doğrudan tarayıcıda çıkarır.",
    "desc_2": "Bir sayfa görüntü olarak taranmışsa OCR gerekir. Bu araçta henüz OCR yerleşik değildir."
  },
  "nl": {
    "title": "Hoe PDF-Tekstextractie Werkt",
    "desc_1": "Deze tool haalt direct in je browser de al aanwezige selecteerbare tekst uit PDF-inhoudsstromen.",
    "desc_2": "Als een pagina als afbeelding is gescand, is OCR nodig. OCR is nog niet ingebouwd in deze tool."
  },
  "sv": {
    "title": "Så Fungerar PDF-Textextraktion",
    "desc_1": "Det här verktyget extraherar direkt i webbläsaren den markerbara text som redan finns i PDF-innehållsströmmar.",
    "desc_2": "Om en sida är skannad som en bild krävs OCR. OCR är ännu inte inbyggt i det här verktyget."
  },
  "pl": {
    "title": "Jak Działa Ekstrakcja Tekstu PDF",
    "desc_1": "To narzędzie bezpośrednio w przeglądarce wyodrębnia istniejący zaznaczalny tekst ze strumieni treści PDF.",
    "desc_2": "Jeśli strona jest zeskanowana jako obraz, wymagany jest OCR. To narzędzie nie ma jeszcze wbudowanego OCR."
  },
  "vi": {
    "title": "Cách Hoạt Động Của Trích Xuất Văn Bản PDF",
    "desc_1": "Công cụ này trích xuất trực tiếp trong trình duyệt phần văn bản có thể chọn đã có sẵn trong luồng nội dung PDF.",
    "desc_2": "Nếu trang được quét dưới dạng ảnh, cần OCR. Công cụ này hiện chưa tích hợp OCR."
  },
  "th": {
    "title": "การดึงข้อความ PDF ทำงานอย่างไร",
    "desc_1": "เครื่องมือนี้ดึงข้อความที่เลือกได้ซึ่งมีอยู่แล้วในสตรีมเนื้อหา PDF โดยตรงในเบราว์เซอร์",
    "desc_2": "หากหน้าเอกสารเป็นภาพสแกน จะต้องใช้ OCR เครื่องมือนี้ยังไม่รวม OCR"
  },
  "id": {
    "title": "Cara Kerja Ekstraksi Teks PDF",
    "desc_1": "Alat ini mengekstrak langsung di browser teks yang dapat dipilih dan sudah ada di aliran konten PDF.",
    "desc_2": "Jika halaman dipindai sebagai gambar, OCR diperlukan. OCR belum terintegrasi di alat ini."
  },
  "he": {
    "title": "איך חילוץ טקסט מ-PDF עובד",
    "desc_1": "הכלי הזה מחלץ ישירות בדפדפן טקסט ניתן לסימון שכבר קיים בזרמי התוכן של PDF.",
    "desc_2": "אם עמוד נסרק כתמונה, נדרש OCR. OCR עדיין לא מובנה בכלי הזה."
  },
  "ms": {
    "title": "Cara Pengekstrakan Teks PDF Berfungsi",
    "desc_1": "Alat ini mengekstrak terus dalam pelayar teks boleh pilih yang sedia ada dalam aliran kandungan PDF.",
    "desc_2": "Jika halaman diimbas sebagai imej, OCR diperlukan. OCR masih belum terbina dalam alat ini."
  },
  "no": {
    "title": "Hvordan PDF-Tekstekstraksjon Fungerer",
    "desc_1": "Dette verktøyet henter direkte i nettleseren ut markerbar tekst som allerede finnes i PDF-innholdsstrømmer.",
    "desc_2": "Hvis en side er skannet som bilde, kreves OCR. OCR er ikke innebygd i dette verktøyet ennå."
  }
}
</i18n>
