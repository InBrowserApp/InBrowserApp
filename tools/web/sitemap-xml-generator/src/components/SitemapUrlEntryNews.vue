<template>
  <n-text depth="3">{{ t('news') }}</n-text>
  <n-dynamic-input v-model:value="news" :on-create="createNewsEntry">
    <template #create-button-default>{{ t('addNews') }}</template>
    <template #default="{ index: newsIndex }">
      <n-space vertical :size="8">
        <n-input
          v-model:value="news[newsIndex]!.publicationName"
          :placeholder="t('publicationName')"
        />
        <n-text depth="3">{{ t('publicationLanguage') }}</n-text>
        <n-input v-model:value="news[newsIndex]!.publicationLanguage" placeholder="en" />
        <n-input v-model:value="news[newsIndex]!.title" :placeholder="t('title')" />
        <n-input
          v-model:value="news[newsIndex]!.publicationDate"
          :placeholder="t('publicationDate')"
        />
        <n-input v-model:value="news[newsIndex]!.keywords" :placeholder="t('keywords')" />
      </n-space>
    </template>
  </n-dynamic-input>
</template>

<script setup lang="ts">
import { NDynamicInput, NInput, NSpace, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { NewsEntry } from '../sitemapState'
import { createNewsEntry } from '../sitemapState'

const news = defineModel<NewsEntry[]>('news', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "news": "News",
    "addNews": "Add news",
    "publicationName": "Publication name",
    "publicationLanguage": "Publication language",
    "title": "Title",
    "publicationDate": "Publication date",
    "keywords": "Keywords"
  },
  "zh": {
    "news": "新闻",
    "addNews": "添加新闻",
    "publicationName": "出版物名称",
    "publicationLanguage": "出版物语言",
    "title": "标题",
    "publicationDate": "发布日期",
    "keywords": "关键词"
  },
  "zh-CN": {
    "news": "新闻",
    "addNews": "添加新闻",
    "publicationName": "出版物名称",
    "publicationLanguage": "出版物语言",
    "title": "标题",
    "publicationDate": "发布日期",
    "keywords": "关键词"
  },
  "zh-TW": {
    "news": "新聞",
    "addNews": "新增新聞",
    "publicationName": "出版物名稱",
    "publicationLanguage": "出版物語言",
    "title": "標題",
    "publicationDate": "發布日期",
    "keywords": "關鍵字"
  },
  "zh-HK": {
    "news": "新聞",
    "addNews": "新增新聞",
    "publicationName": "出版物名稱",
    "publicationLanguage": "出版物語言",
    "title": "標題",
    "publicationDate": "發布日期",
    "keywords": "關鍵字"
  },
  "es": {
    "news": "Noticias",
    "addNews": "Agregar noticia",
    "publicationName": "Nombre de la publicación",
    "publicationLanguage": "Idioma de la publicación",
    "title": "Título",
    "publicationDate": "Fecha de publicación",
    "keywords": "Palabras clave"
  },
  "fr": {
    "news": "Actualités",
    "addNews": "Ajouter une actualité",
    "publicationName": "Nom de la publication",
    "publicationLanguage": "Langue de la publication",
    "title": "Titre",
    "publicationDate": "Date de publication",
    "keywords": "Mots-clés"
  },
  "de": {
    "news": "News",
    "addNews": "News hinzufügen",
    "publicationName": "Publikationsname",
    "publicationLanguage": "Publikationssprache",
    "title": "Titel",
    "publicationDate": "Veröffentlichungsdatum",
    "keywords": "Schlüsselwörter"
  },
  "it": {
    "news": "Notizie",
    "addNews": "Aggiungi notizia",
    "publicationName": "Nome della pubblicazione",
    "publicationLanguage": "Lingua della pubblicazione",
    "title": "Titolo",
    "publicationDate": "Data di pubblicazione",
    "keywords": "Parole chiave"
  },
  "ja": {
    "news": "ニュース",
    "addNews": "ニュースを追加",
    "publicationName": "媒体名",
    "publicationLanguage": "媒体言語",
    "title": "タイトル",
    "publicationDate": "公開日",
    "keywords": "キーワード"
  },
  "ko": {
    "news": "뉴스",
    "addNews": "뉴스 추가",
    "publicationName": "발행물 이름",
    "publicationLanguage": "발행물 언어",
    "title": "제목",
    "publicationDate": "게시일",
    "keywords": "키워드"
  },
  "ru": {
    "news": "Новости",
    "addNews": "Добавить новость",
    "publicationName": "Название издания",
    "publicationLanguage": "Язык издания",
    "title": "Заголовок",
    "publicationDate": "Дата публикации",
    "keywords": "Ключевые слова"
  },
  "pt": {
    "news": "Notícias",
    "addNews": "Adicionar notícia",
    "publicationName": "Nome da publicação",
    "publicationLanguage": "Idioma da publicação",
    "title": "Título",
    "publicationDate": "Data de publicação",
    "keywords": "Palavras-chave"
  },
  "ar": {
    "news": "الأخبار",
    "addNews": "إضافة خبر",
    "publicationName": "اسم النشر",
    "publicationLanguage": "لغة النشر",
    "title": "العنوان",
    "publicationDate": "تاريخ النشر",
    "keywords": "الكلمات المفتاحية"
  },
  "hi": {
    "news": "न्यूज",
    "addNews": "न्यूज जोड़ें",
    "publicationName": "प्रकाशन नाम",
    "publicationLanguage": "प्रकाशन भाषा",
    "title": "शीर्षक",
    "publicationDate": "प्रकाशन तिथि",
    "keywords": "कीवर्ड"
  },
  "tr": {
    "news": "Haberler",
    "addNews": "Haber ekle",
    "publicationName": "Yayın adı",
    "publicationLanguage": "Yayın dili",
    "title": "Başlık",
    "publicationDate": "Yayın tarihi",
    "keywords": "Anahtar kelimeler"
  },
  "nl": {
    "news": "Nieuws",
    "addNews": "Nieuws toevoegen",
    "publicationName": "Publicatienaam",
    "publicationLanguage": "Publicatietaal",
    "title": "Titel",
    "publicationDate": "Publicatiedatum",
    "keywords": "Trefwoorden"
  },
  "sv": {
    "news": "Nyheter",
    "addNews": "Lägg till nyhet",
    "publicationName": "Publikationsnamn",
    "publicationLanguage": "Publikationsspråk",
    "title": "Titel",
    "publicationDate": "Publiceringsdatum",
    "keywords": "Nyckelord"
  },
  "pl": {
    "news": "Wiadomości",
    "addNews": "Dodaj wiadomość",
    "publicationName": "Nazwa publikacji",
    "publicationLanguage": "Język publikacji",
    "title": "Tytuł",
    "publicationDate": "Data publikacji",
    "keywords": "Słowa kluczowe"
  },
  "vi": {
    "news": "Tin tức",
    "addNews": "Thêm tin",
    "publicationName": "Tên ấn phẩm",
    "publicationLanguage": "Ngôn ngữ ấn phẩm",
    "title": "Tiêu đề",
    "publicationDate": "Ngày xuất bản",
    "keywords": "Từ khóa"
  },
  "th": {
    "news": "ข่าว",
    "addNews": "เพิ่มข่าว",
    "publicationName": "ชื่อสิ่งพิมพ์",
    "publicationLanguage": "ภาษาสิ่งพิมพ์",
    "title": "ชื่อเรื่อง",
    "publicationDate": "วันที่เผยแพร่",
    "keywords": "คีย์เวิร์ด"
  },
  "id": {
    "news": "Berita",
    "addNews": "Tambah berita",
    "publicationName": "Nama publikasi",
    "publicationLanguage": "Bahasa publikasi",
    "title": "Judul",
    "publicationDate": "Tanggal publikasi",
    "keywords": "Kata kunci"
  },
  "he": {
    "news": "חדשות",
    "addNews": "הוסף חדשות",
    "publicationName": "שם הפרסום",
    "publicationLanguage": "שפת הפרסום",
    "title": "כותרת",
    "publicationDate": "תאריך פרסום",
    "keywords": "מילות מפתח"
  },
  "ms": {
    "news": "Berita",
    "addNews": "Tambah berita",
    "publicationName": "Nama penerbitan",
    "publicationLanguage": "Bahasa penerbitan",
    "title": "Tajuk",
    "publicationDate": "Tarikh penerbitan",
    "keywords": "Kata kunci"
  },
  "no": {
    "news": "Nyheter",
    "addNews": "Legg til nyhet",
    "publicationName": "Publikasjonsnavn",
    "publicationLanguage": "Publikasjonsspråk",
    "title": "Tittel",
    "publicationDate": "Publiseringsdato",
    "keywords": "Nøkkelord"
  }
}
</i18n>
