<template>
  <n-text depth="3">{{ t('videos') }}</n-text>
  <n-dynamic-input v-model:value="videos" :on-create="createVideoEntry">
    <template #create-button-default>{{ t('addVideo') }}</template>
    <template #default="{ index: videoIndex }">
      <n-space vertical :size="8">
        <n-text depth="3">{{ t('thumbnailUrl') }}</n-text>
        <n-input
          v-model:value="videos[videoIndex]!.thumbnailLoc"
          placeholder="https://example.com/thumb.jpg"
        />
        <n-input v-model:value="videos[videoIndex]!.title" :placeholder="t('title')" />
        <n-input v-model:value="videos[videoIndex]!.description" :placeholder="t('description')" />
        <n-text depth="3">{{ t('contentUrl') }}</n-text>
        <n-input
          v-model:value="videos[videoIndex]!.contentLoc"
          placeholder="https://example.com/video.mp4"
        />
        <n-text depth="3">{{ t('playerUrl') }}</n-text>
        <n-input
          v-model:value="videos[videoIndex]!.playerLoc"
          placeholder="https://example.com/player"
        />
        <n-input-number
          v-model:value="videos[videoIndex]!.duration"
          :min="0"
          :step="1"
          :precision="0"
          :placeholder="t('duration')"
        />
        <n-input
          v-model:value="videos[videoIndex]!.publicationDate"
          :placeholder="t('publicationDate')"
        />
      </n-space>
    </template>
  </n-dynamic-input>
</template>

<script setup lang="ts">
import { NDynamicInput, NInput, NInputNumber, NSpace, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { VideoEntry } from '../sitemapState'
import { createVideoEntry } from '../sitemapState'

const videos = defineModel<VideoEntry[]>('videos', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "videos": "Videos",
    "addVideo": "Add video",
    "thumbnailUrl": "Thumbnail URL",
    "title": "Title",
    "description": "Description",
    "contentUrl": "Content URL",
    "playerUrl": "Player URL",
    "duration": "Duration (seconds)",
    "publicationDate": "Publication date"
  },
  "zh": {
    "videos": "视频",
    "addVideo": "添加视频",
    "thumbnailUrl": "缩略图 URL",
    "title": "标题",
    "description": "描述",
    "contentUrl": "内容 URL",
    "playerUrl": "播放器 URL",
    "duration": "时长（秒）",
    "publicationDate": "发布日期"
  },
  "zh-CN": {
    "videos": "视频",
    "addVideo": "添加视频",
    "thumbnailUrl": "缩略图 URL",
    "title": "标题",
    "description": "描述",
    "contentUrl": "内容 URL",
    "playerUrl": "播放器 URL",
    "duration": "时长（秒）",
    "publicationDate": "发布日期"
  },
  "zh-TW": {
    "videos": "影片",
    "addVideo": "新增影片",
    "thumbnailUrl": "縮圖 URL",
    "title": "標題",
    "description": "描述",
    "contentUrl": "內容 URL",
    "playerUrl": "播放器 URL",
    "duration": "時長（秒）",
    "publicationDate": "發布日期"
  },
  "zh-HK": {
    "videos": "影片",
    "addVideo": "新增影片",
    "thumbnailUrl": "縮圖 URL",
    "title": "標題",
    "description": "描述",
    "contentUrl": "內容 URL",
    "playerUrl": "播放器 URL",
    "duration": "時長（秒）",
    "publicationDate": "發布日期"
  },
  "es": {
    "videos": "Vídeos",
    "addVideo": "Agregar vídeo",
    "thumbnailUrl": "URL de miniatura",
    "title": "Título",
    "description": "Descripción",
    "contentUrl": "URL de contenido",
    "playerUrl": "URL del reproductor",
    "duration": "Duración (segundos)",
    "publicationDate": "Fecha de publicación"
  },
  "fr": {
    "videos": "Vidéos",
    "addVideo": "Ajouter une vidéo",
    "thumbnailUrl": "URL de miniature",
    "title": "Titre",
    "description": "Description",
    "contentUrl": "URL du contenu",
    "playerUrl": "URL du lecteur",
    "duration": "Durée (secondes)",
    "publicationDate": "Date de publication"
  },
  "de": {
    "videos": "Videos",
    "addVideo": "Video hinzufügen",
    "thumbnailUrl": "Vorschaubild-URL",
    "title": "Titel",
    "description": "Beschreibung",
    "contentUrl": "Inhalt-URL",
    "playerUrl": "Player-URL",
    "duration": "Dauer (Sekunden)",
    "publicationDate": "Veröffentlichungsdatum"
  },
  "it": {
    "videos": "Video",
    "addVideo": "Aggiungi video",
    "thumbnailUrl": "URL miniatura",
    "title": "Titolo",
    "description": "Descrizione",
    "contentUrl": "URL contenuto",
    "playerUrl": "URL player",
    "duration": "Durata (secondi)",
    "publicationDate": "Data di pubblicazione"
  },
  "ja": {
    "videos": "動画",
    "addVideo": "動画を追加",
    "thumbnailUrl": "サムネイル URL",
    "title": "タイトル",
    "description": "説明",
    "contentUrl": "コンテンツ URL",
    "playerUrl": "プレーヤー URL",
    "duration": "再生時間（秒）",
    "publicationDate": "公開日"
  },
  "ko": {
    "videos": "동영상",
    "addVideo": "동영상 추가",
    "thumbnailUrl": "썸네일 URL",
    "title": "제목",
    "description": "설명",
    "contentUrl": "콘텐츠 URL",
    "playerUrl": "플레이어 URL",
    "duration": "재생 시간(초)",
    "publicationDate": "게시일"
  },
  "ru": {
    "videos": "Видео",
    "addVideo": "Добавить видео",
    "thumbnailUrl": "URL миниатюры",
    "title": "Заголовок",
    "description": "Описание",
    "contentUrl": "URL контента",
    "playerUrl": "URL плеера",
    "duration": "Длительность (секунды)",
    "publicationDate": "Дата публикации"
  },
  "pt": {
    "videos": "Vídeos",
    "addVideo": "Adicionar vídeo",
    "thumbnailUrl": "URL da miniatura",
    "title": "Título",
    "description": "Descrição",
    "contentUrl": "URL do conteúdo",
    "playerUrl": "URL do player",
    "duration": "Duração (segundos)",
    "publicationDate": "Data de publicação"
  },
  "ar": {
    "videos": "الفيديوهات",
    "addVideo": "إضافة فيديو",
    "thumbnailUrl": "URL الصورة المصغرة",
    "title": "العنوان",
    "description": "الوصف",
    "contentUrl": "URL المحتوى",
    "playerUrl": "URL المشغل",
    "duration": "المدة (ثوان)",
    "publicationDate": "تاريخ النشر"
  },
  "hi": {
    "videos": "वीडियो",
    "addVideo": "वीडियो जोड़ें",
    "thumbnailUrl": "थंबनेल URL",
    "title": "शीर्षक",
    "description": "विवरण",
    "contentUrl": "कंटेंट URL",
    "playerUrl": "प्लेयर URL",
    "duration": "अवधि (सेकंड)",
    "publicationDate": "प्रकाशन तिथि"
  },
  "tr": {
    "videos": "Videolar",
    "addVideo": "Video ekle",
    "thumbnailUrl": "Küçük resim URL",
    "title": "Başlık",
    "description": "Açıklama",
    "contentUrl": "İçerik URL",
    "playerUrl": "Oynatıcı URL",
    "duration": "Süre (saniye)",
    "publicationDate": "Yayın tarihi"
  },
  "nl": {
    "videos": "Video's",
    "addVideo": "Video toevoegen",
    "thumbnailUrl": "Thumbnail-URL",
    "title": "Titel",
    "description": "Beschrijving",
    "contentUrl": "Content-URL",
    "playerUrl": "Player-URL",
    "duration": "Duur (seconden)",
    "publicationDate": "Publicatiedatum"
  },
  "sv": {
    "videos": "Videor",
    "addVideo": "Lägg till video",
    "thumbnailUrl": "Miniatyr-URL",
    "title": "Titel",
    "description": "Beskrivning",
    "contentUrl": "Innehålls-URL",
    "playerUrl": "Spelar-URL",
    "duration": "Längd (sekunder)",
    "publicationDate": "Publiceringsdatum"
  },
  "pl": {
    "videos": "Wideo",
    "addVideo": "Dodaj wideo",
    "thumbnailUrl": "URL miniatury",
    "title": "Tytuł",
    "description": "Opis",
    "contentUrl": "URL treści",
    "playerUrl": "URL odtwarzacza",
    "duration": "Czas trwania (sekundy)",
    "publicationDate": "Data publikacji"
  },
  "vi": {
    "videos": "Video",
    "addVideo": "Thêm video",
    "thumbnailUrl": "URL ảnh thu nhỏ",
    "title": "Tiêu đề",
    "description": "Mô tả",
    "contentUrl": "URL nội dung",
    "playerUrl": "URL trình phát",
    "duration": "Thời lượng (giây)",
    "publicationDate": "Ngày xuất bản"
  },
  "th": {
    "videos": "วิดีโอ",
    "addVideo": "เพิ่มวิดีโอ",
    "thumbnailUrl": "URL ภาพย่อ",
    "title": "ชื่อเรื่อง",
    "description": "คำอธิบาย",
    "contentUrl": "URL เนื้อหา",
    "playerUrl": "URL ตัวเล่น",
    "duration": "ความยาว (วินาที)",
    "publicationDate": "วันที่เผยแพร่"
  },
  "id": {
    "videos": "Video",
    "addVideo": "Tambah video",
    "thumbnailUrl": "URL thumbnail",
    "title": "Judul",
    "description": "Deskripsi",
    "contentUrl": "URL konten",
    "playerUrl": "URL pemutar",
    "duration": "Durasi (detik)",
    "publicationDate": "Tanggal publikasi"
  },
  "he": {
    "videos": "וידאו",
    "addVideo": "הוסף וידאו",
    "thumbnailUrl": "URL תמונה ממוזערת",
    "title": "כותרת",
    "description": "תיאור",
    "contentUrl": "URL תוכן",
    "playerUrl": "URL נגן",
    "duration": "משך (שניות)",
    "publicationDate": "תאריך פרסום"
  },
  "ms": {
    "videos": "Video",
    "addVideo": "Tambah video",
    "thumbnailUrl": "URL imej kecil",
    "title": "Tajuk",
    "description": "Penerangan",
    "contentUrl": "URL kandungan",
    "playerUrl": "URL pemain",
    "duration": "Tempoh (saat)",
    "publicationDate": "Tarikh penerbitan"
  },
  "no": {
    "videos": "Videoer",
    "addVideo": "Legg til video",
    "thumbnailUrl": "Miniatyr-URL",
    "title": "Tittel",
    "description": "Beskrivelse",
    "contentUrl": "Innholds-URL",
    "playerUrl": "Spiller-URL",
    "duration": "Varighet (sekunder)",
    "publicationDate": "Publiseringsdato"
  }
}
</i18n>
