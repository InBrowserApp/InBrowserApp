<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-text>{{ t('description') }}</n-text>
    <n-ul style="margin-top: 12px">
      <n-li>{{ t('point1') }}</n-li>
      <n-li>{{ t('point2') }}</n-li>
      <n-li>{{ t('point3') }}</n-li>
    </n-ul>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText, NUl, NLi } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is PDF metadata?",
    "description": "PDF metadata stores document information such as title, author, and creation time.",
    "point1": "Title, author, and subject",
    "point2": "Page count and PDF version",
    "point3": "Creation and modification dates"
  },
  "zh": {
    "title": "什么是 PDF 元数据？",
    "description": "PDF 元数据用于存储文档信息，如标题、作者和创建时间。",
    "point1": "标题、作者和主题",
    "point2": "页数与 PDF 版本",
    "point3": "创建日期与修改日期"
  },
  "zh-CN": {
    "title": "什么是 PDF 元数据？",
    "description": "PDF 元数据用于存储文档信息，如标题、作者和创建时间。",
    "point1": "标题、作者和主题",
    "point2": "页数与 PDF 版本",
    "point3": "创建日期与修改日期"
  },
  "zh-TW": {
    "title": "什麼是 PDF 中繼資料？",
    "description": "PDF 中繼資料用於儲存文件資訊，例如標題、作者與建立時間。",
    "point1": "標題、作者與主題",
    "point2": "頁數與 PDF 版本",
    "point3": "建立日期與修改日期"
  },
  "zh-HK": {
    "title": "什麼是 PDF 中繼資料？",
    "description": "PDF 中繼資料用於儲存文件資訊，例如標題、作者與建立時間。",
    "point1": "標題、作者與主題",
    "point2": "頁數與 PDF 版本",
    "point3": "建立日期與修改日期"
  },
  "es": {
    "title": "¿Qué son los metadatos de PDF?",
    "description": "Los metadatos de PDF almacenan información del documento como título, autor y fecha de creación.",
    "point1": "Título, autor y asunto",
    "point2": "Número de páginas y versión de PDF",
    "point3": "Fechas de creación y modificación"
  },
  "fr": {
    "title": "Qu'est-ce que les métadonnées PDF ?",
    "description": "Les métadonnées PDF stockent des informations sur le document comme le titre, l'auteur et la date de création.",
    "point1": "Titre, auteur et sujet",
    "point2": "Nombre de pages et version PDF",
    "point3": "Dates de création et de modification"
  },
  "de": {
    "title": "Was sind PDF-Metadaten?",
    "description": "PDF-Metadaten speichern Dokumentinformationen wie Titel, Autor und Erstellungszeit.",
    "point1": "Titel, Autor und Betreff",
    "point2": "Seitenzahl und PDF-Version",
    "point3": "Erstellungs- und Änderungsdaten"
  },
  "it": {
    "title": "Cosa sono i metadati PDF?",
    "description": "I metadati PDF memorizzano informazioni del documento come titolo, autore e data di creazione.",
    "point1": "Titolo, autore e oggetto",
    "point2": "Numero di pagine e versione PDF",
    "point3": "Date di creazione e modifica"
  },
  "ja": {
    "title": "PDF メタデータとは？",
    "description": "PDF メタデータはタイトル、著者、作成日時などの文書情報を保存します。",
    "point1": "タイトル、著者、件名",
    "point2": "ページ数と PDF バージョン",
    "point3": "作成日と更新日"
  },
  "ko": {
    "title": "PDF 메타데이터란?",
    "description": "PDF 메타데이터는 제목, 작성자, 생성 시간 같은 문서 정보를 저장합니다.",
    "point1": "제목, 작성자, 주제",
    "point2": "페이지 수와 PDF 버전",
    "point3": "생성 및 수정 날짜"
  },
  "ru": {
    "title": "Что такое метаданные PDF?",
    "description": "Метаданные PDF хранят сведения о документе, такие как название, автор и дата создания.",
    "point1": "Название, автор и тема",
    "point2": "Количество страниц и версия PDF",
    "point3": "Даты создания и изменения"
  },
  "pt": {
    "title": "O que são metadados de PDF?",
    "description": "Os metadados de PDF armazenam informações do documento como título, autor e data de criação.",
    "point1": "Título, autor e assunto",
    "point2": "Número de páginas e versão do PDF",
    "point3": "Datas de criação e modificação"
  },
  "ar": {
    "title": "ما هي بيانات PDF الوصفية؟",
    "description": "تخزن بيانات PDF الوصفية معلومات المستند مثل العنوان والمؤلف وتاريخ الإنشاء.",
    "point1": "العنوان والمؤلف والموضوع",
    "point2": "عدد الصفحات وإصدار PDF",
    "point3": "تواريخ الإنشاء والتعديل"
  },
  "hi": {
    "title": "PDF मेटाडेटा क्या है?",
    "description": "PDF मेटाडेटा दस्तावेज़ की जानकारी जैसे शीर्षक, लेखक और निर्माण समय संग्रहीत करता है।",
    "point1": "शीर्षक, लेखक और विषय",
    "point2": "पृष्ठ संख्या और PDF संस्करण",
    "point3": "निर्माण और संशोधन तिथियाँ"
  },
  "tr": {
    "title": "PDF meta verisi nedir?",
    "description": "PDF meta verisi, başlık, yazar ve oluşturma zamanı gibi belge bilgilerini saklar.",
    "point1": "Başlık, yazar ve konu",
    "point2": "Sayfa sayısı ve PDF sürümü",
    "point3": "Oluşturma ve değiştirme tarihleri"
  },
  "nl": {
    "title": "Wat zijn PDF-metadata?",
    "description": "PDF-metadata slaan documentinformatie op zoals titel, auteur en aanmaakdatum.",
    "point1": "Titel, auteur en onderwerp",
    "point2": "Aantal pagina's en PDF-versie",
    "point3": "Aanmaak- en wijzigingsdatums"
  },
  "sv": {
    "title": "Vad är PDF-metadata?",
    "description": "PDF-metadata lagrar dokumentinformation som titel, författare och skapandedatum.",
    "point1": "Titel, författare och ämne",
    "point2": "Antal sidor och PDF-version",
    "point3": "Skapande- och ändringsdatum"
  },
  "pl": {
    "title": "Czym są metadane PDF?",
    "description": "Metadane PDF przechowują informacje o dokumencie, takie jak tytuł, autor i data utworzenia.",
    "point1": "Tytuł, autor i temat",
    "point2": "Liczba stron i wersja PDF",
    "point3": "Daty utworzenia i modyfikacji"
  },
  "vi": {
    "title": "Siêu dữ liệu PDF là gì?",
    "description": "Siêu dữ liệu PDF lưu trữ thông tin tài liệu như tiêu đề, tác giả và thời điểm tạo.",
    "point1": "Tiêu đề, tác giả và chủ đề",
    "point2": "Số trang và phiên bản PDF",
    "point3": "Ngày tạo và ngày sửa"
  },
  "th": {
    "title": "เมตาดาตา PDF คืออะไร?",
    "description": "เมตาดาตา PDF เก็บข้อมูลเอกสาร เช่น ชื่อเรื่อง ผู้เขียน และเวลาสร้าง",
    "point1": "ชื่อเรื่อง ผู้เขียน และหัวข้อ",
    "point2": "จำนวนหน้าและเวอร์ชัน PDF",
    "point3": "วันที่สร้างและวันที่แก้ไข"
  },
  "id": {
    "title": "Apa itu metadata PDF?",
    "description": "Metadata PDF menyimpan informasi dokumen seperti judul, penulis, dan waktu pembuatan.",
    "point1": "Judul, penulis, dan subjek",
    "point2": "Jumlah halaman dan versi PDF",
    "point3": "Tanggal pembuatan dan modifikasi"
  },
  "he": {
    "title": "מהם מטא-דטה של PDF?",
    "description": "מטא-דטה של PDF שומר מידע על המסמך כגון כותרת, מחבר ותאריך יצירה.",
    "point1": "כותרת, מחבר ונושא",
    "point2": "מספר עמודים וגרסת PDF",
    "point3": "תאריכי יצירה ושינוי"
  },
  "ms": {
    "title": "Apakah metadata PDF?",
    "description": "Metadata PDF menyimpan maklumat dokumen seperti tajuk, pengarang dan masa penciptaan.",
    "point1": "Tajuk, pengarang dan subjek",
    "point2": "Bilangan halaman dan versi PDF",
    "point3": "Tarikh penciptaan dan pengubahsuaian"
  },
  "no": {
    "title": "Hva er PDF-metadata?",
    "description": "PDF-metadata lagrer dokumentinformasjon som tittel, forfatter og opprettelsestidspunkt.",
    "point1": "Tittel, forfatter og emne",
    "point2": "Antall sider og PDF-versjon",
    "point3": "Opprettelses- og endringsdatoer"
  }
}
</i18n>
