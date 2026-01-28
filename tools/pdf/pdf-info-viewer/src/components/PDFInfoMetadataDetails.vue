<template>
  <ToolSectionHeader>{{ t('metadataDetails') }}</ToolSectionHeader>
  <ToolSection>
    <n-spin :show="loading">
      <n-descriptions label-placement="left" bordered :column="1" content-style="width: 100%">
        <n-descriptions-item :label="t('title')">
          <n-text>{{ formatText(info.metadata.title) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('author')">
          <n-text>{{ formatText(info.metadata.author) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('subject')">
          <n-text>{{ formatText(info.metadata.subject) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('keywords')">
          <n-text>{{ formatKeywords(info.metadata.keywords) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('creator')">
          <n-text>{{ formatText(info.metadata.creator) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('producer')">
          <n-text>{{ formatText(info.metadata.producer) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('creationDate')">
          <n-text>{{ formatDate(info.metadata.creationDate) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('modificationDate')">
          <n-text>{{ formatDate(info.metadata.modificationDate) }}</n-text>
        </n-descriptions-item>
      </n-descriptions>
    </n-spin>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NDescriptions, NDescriptionsItem, NSpin, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { PdfInfo } from '../utils/extractPdfInfo'

const { info, loading } = defineProps<{
  info: PdfInfo
  loading: boolean
}>()

const { t } = useI18n()

const formatText = (value?: string) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : t('notAvailable')
}

const formatKeywords = (value?: string[]) =>
  value && value.length ? value.join(', ') : t('notAvailable')

const formatDate = (value?: Date) => {
  if (!value) return t('notAvailable')
  if (Number.isNaN(value.getTime())) return t('notAvailable')
  return value.toLocaleString()
}
</script>

<i18n lang="json">
{
  "en": {
    "metadataDetails": "Metadata",
    "title": "Title",
    "author": "Author",
    "subject": "Subject",
    "keywords": "Keywords",
    "creator": "Creator",
    "producer": "Producer",
    "creationDate": "Creation date",
    "modificationDate": "Modification date",
    "notAvailable": "Not available"
  },
  "zh": {
    "metadataDetails": "元数据",
    "title": "标题",
    "author": "作者",
    "subject": "主题",
    "keywords": "关键词",
    "creator": "创建者",
    "producer": "生成器",
    "creationDate": "创建日期",
    "modificationDate": "修改日期",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "metadataDetails": "元数据",
    "title": "标题",
    "author": "作者",
    "subject": "主题",
    "keywords": "关键词",
    "creator": "创建者",
    "producer": "生成器",
    "creationDate": "创建日期",
    "modificationDate": "修改日期",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "metadataDetails": "中繼資料",
    "title": "標題",
    "author": "作者",
    "subject": "主題",
    "keywords": "關鍵字",
    "creator": "建立者",
    "producer": "產生器",
    "creationDate": "建立日期",
    "modificationDate": "修改日期",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "metadataDetails": "中繼資料",
    "title": "標題",
    "author": "作者",
    "subject": "主題",
    "keywords": "關鍵字",
    "creator": "建立者",
    "producer": "產生器",
    "creationDate": "建立日期",
    "modificationDate": "修改日期",
    "notAvailable": "不可用"
  },
  "es": {
    "metadataDetails": "Metadatos",
    "title": "Título",
    "author": "Autor",
    "subject": "Asunto",
    "keywords": "Palabras clave",
    "creator": "Creador",
    "producer": "Productor",
    "creationDate": "Fecha de creación",
    "modificationDate": "Fecha de modificación",
    "notAvailable": "No disponible"
  },
  "fr": {
    "metadataDetails": "Métadonnées",
    "title": "Titre",
    "author": "Auteur",
    "subject": "Sujet",
    "keywords": "Mots-clés",
    "creator": "Créateur",
    "producer": "Producteur",
    "creationDate": "Date de création",
    "modificationDate": "Date de modification",
    "notAvailable": "Indisponible"
  },
  "de": {
    "metadataDetails": "Metadaten",
    "title": "Titel",
    "author": "Autor",
    "subject": "Betreff",
    "keywords": "Schlüsselwörter",
    "creator": "Ersteller",
    "producer": "Hersteller",
    "creationDate": "Erstellungsdatum",
    "modificationDate": "Änderungsdatum",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "metadataDetails": "Metadati",
    "title": "Titolo",
    "author": "Autore",
    "subject": "Oggetto",
    "keywords": "Parole chiave",
    "creator": "Creatore",
    "producer": "Produttore",
    "creationDate": "Data di creazione",
    "modificationDate": "Data di modifica",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "metadataDetails": "メタデータ",
    "title": "タイトル",
    "author": "作者",
    "subject": "件名",
    "keywords": "キーワード",
    "creator": "作成者",
    "producer": "生成者",
    "creationDate": "作成日",
    "modificationDate": "更新日",
    "notAvailable": "利用不可"
  },
  "ko": {
    "metadataDetails": "메타데이터",
    "title": "제목",
    "author": "작성자",
    "subject": "주제",
    "keywords": "키워드",
    "creator": "생성자",
    "producer": "제작자",
    "creationDate": "생성 날짜",
    "modificationDate": "수정 날짜",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "metadataDetails": "Метаданные",
    "title": "Название",
    "author": "Автор",
    "subject": "Тема",
    "keywords": "Ключевые слова",
    "creator": "Создатель",
    "producer": "Производитель",
    "creationDate": "Дата создания",
    "modificationDate": "Дата изменения",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "metadataDetails": "Metadados",
    "title": "Título",
    "author": "Autor",
    "subject": "Assunto",
    "keywords": "Palavras-chave",
    "creator": "Criador",
    "producer": "Produtor",
    "creationDate": "Data de criação",
    "modificationDate": "Data de modificação",
    "notAvailable": "Indisponível"
  },
  "ar": {
    "metadataDetails": "البيانات الوصفية",
    "title": "العنوان",
    "author": "المؤلف",
    "subject": "الموضوع",
    "keywords": "الكلمات المفتاحية",
    "creator": "المنشئ",
    "producer": "المنتج",
    "creationDate": "تاريخ الإنشاء",
    "modificationDate": "تاريخ التعديل",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "metadataDetails": "मेटाडेटा",
    "title": "शीर्षक",
    "author": "लेखक",
    "subject": "विषय",
    "keywords": "कीवर्ड",
    "creator": "निर्माता",
    "producer": "निर्माता (प्रोड्यूसर)",
    "creationDate": "निर्माण तिथि",
    "modificationDate": "संशोधन तिथि",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "metadataDetails": "Meta veriler",
    "title": "Başlık",
    "author": "Yazar",
    "subject": "Konu",
    "keywords": "Anahtar kelimeler",
    "creator": "Oluşturan",
    "producer": "Üretici",
    "creationDate": "Oluşturma tarihi",
    "modificationDate": "Değiştirme tarihi",
    "notAvailable": "Kullanılamıyor"
  },
  "nl": {
    "metadataDetails": "Metadata",
    "title": "Titel",
    "author": "Auteur",
    "subject": "Onderwerp",
    "keywords": "Trefwoorden",
    "creator": "Maker",
    "producer": "Producent",
    "creationDate": "Aanmaakdatum",
    "modificationDate": "Wijzigingsdatum",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "metadataDetails": "Metadata",
    "title": "Titel",
    "author": "Författare",
    "subject": "Ämne",
    "keywords": "Nyckelord",
    "creator": "Skapare",
    "producer": "Producent",
    "creationDate": "Skapad datum",
    "modificationDate": "Ändringsdatum",
    "notAvailable": "Inte tillgängligt"
  },
  "pl": {
    "metadataDetails": "Metadane",
    "title": "Tytuł",
    "author": "Autor",
    "subject": "Temat",
    "keywords": "Słowa kluczowe",
    "creator": "Twórca",
    "producer": "Producent",
    "creationDate": "Data utworzenia",
    "modificationDate": "Data modyfikacji",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "metadataDetails": "Siêu dữ liệu",
    "title": "Tiêu đề",
    "author": "Tác giả",
    "subject": "Chủ đề",
    "keywords": "Từ khóa",
    "creator": "Người tạo",
    "producer": "Nhà sản xuất",
    "creationDate": "Ngày tạo",
    "modificationDate": "Ngày sửa",
    "notAvailable": "Không có"
  },
  "th": {
    "metadataDetails": "เมตาดาตา",
    "title": "ชื่อเรื่อง",
    "author": "ผู้เขียน",
    "subject": "หัวข้อ",
    "keywords": "คีย์เวิร์ด",
    "creator": "ผู้สร้าง",
    "producer": "ผู้ผลิต",
    "creationDate": "วันที่สร้าง",
    "modificationDate": "วันที่แก้ไข",
    "notAvailable": "ไม่มีข้อมูล"
  },
  "id": {
    "metadataDetails": "Metadata",
    "title": "Judul",
    "author": "Penulis",
    "subject": "Subjek",
    "keywords": "Kata kunci",
    "creator": "Pembuat",
    "producer": "Produsen",
    "creationDate": "Tanggal pembuatan",
    "modificationDate": "Tanggal modifikasi",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "metadataDetails": "מטא-דטה",
    "title": "כותרת",
    "author": "מחבר",
    "subject": "נושא",
    "keywords": "מילות מפתח",
    "creator": "יוצר",
    "producer": "מפיק",
    "creationDate": "תאריך יצירה",
    "modificationDate": "תאריך שינוי",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "metadataDetails": "Metadata",
    "title": "Tajuk",
    "author": "Pengarang",
    "subject": "Subjek",
    "keywords": "Kata kunci",
    "creator": "Pencipta",
    "producer": "Pengeluar",
    "creationDate": "Tarikh penciptaan",
    "modificationDate": "Tarikh pengubahsuaian",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "metadataDetails": "Metadata",
    "title": "Tittel",
    "author": "Forfatter",
    "subject": "Emne",
    "keywords": "Nøkkelord",
    "creator": "Oppretter",
    "producer": "Produsent",
    "creationDate": "Opprettelsesdato",
    "modificationDate": "Endringsdato",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
