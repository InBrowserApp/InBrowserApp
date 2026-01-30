<template>
  <n-text depth="3">{{ t('images') }}</n-text>
  <n-dynamic-input v-model:value="images" :on-create="createImageEntry">
    <template #create-button-default>{{ t('addImage') }}</template>
    <template #default="{ index: imageIndex }">
      <n-space vertical :size="8">
        <n-text depth="3">{{ t('imageUrl') }}</n-text>
        <n-input
          v-model:value="images[imageIndex]!.loc"
          placeholder="https://example.com/image.jpg"
        />
        <n-input v-model:value="images[imageIndex]!.title" :placeholder="t('title')" />
        <n-input v-model:value="images[imageIndex]!.caption" :placeholder="t('caption')" />
        <n-text depth="3">{{ t('licenseUrl') }}</n-text>
        <n-input
          v-model:value="images[imageIndex]!.license"
          placeholder="https://example.com/license"
        />
      </n-space>
    </template>
  </n-dynamic-input>
</template>

<script setup lang="ts">
import { NDynamicInput, NInput, NSpace, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { ImageEntry } from '../sitemapState'
import { createImageEntry } from '../sitemapState'

const images = defineModel<ImageEntry[]>('images', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "images": "Images",
    "addImage": "Add image",
    "imageUrl": "Image URL",
    "title": "Title",
    "caption": "Caption",
    "licenseUrl": "License URL"
  },
  "zh": {
    "images": "图片",
    "addImage": "添加图片",
    "imageUrl": "图片 URL",
    "title": "标题",
    "caption": "说明",
    "licenseUrl": "许可 URL"
  },
  "zh-CN": {
    "images": "图片",
    "addImage": "添加图片",
    "imageUrl": "图片 URL",
    "title": "标题",
    "caption": "说明",
    "licenseUrl": "许可 URL"
  },
  "zh-TW": {
    "images": "圖片",
    "addImage": "新增圖片",
    "imageUrl": "圖片 URL",
    "title": "標題",
    "caption": "說明",
    "licenseUrl": "授權 URL"
  },
  "zh-HK": {
    "images": "圖片",
    "addImage": "新增圖片",
    "imageUrl": "圖片 URL",
    "title": "標題",
    "caption": "說明",
    "licenseUrl": "授權 URL"
  },
  "es": {
    "images": "Imágenes",
    "addImage": "Agregar imagen",
    "imageUrl": "URL de la imagen",
    "title": "Título",
    "caption": "Leyenda",
    "licenseUrl": "URL de licencia"
  },
  "fr": {
    "images": "Images",
    "addImage": "Ajouter une image",
    "imageUrl": "URL de l'image",
    "title": "Titre",
    "caption": "Légende",
    "licenseUrl": "URL de licence"
  },
  "de": {
    "images": "Bilder",
    "addImage": "Bild hinzufügen",
    "imageUrl": "Bild-URL",
    "title": "Titel",
    "caption": "Bildunterschrift",
    "licenseUrl": "Lizenz-URL"
  },
  "it": {
    "images": "Immagini",
    "addImage": "Aggiungi immagine",
    "imageUrl": "URL immagine",
    "title": "Titolo",
    "caption": "Didascalia",
    "licenseUrl": "URL licenza"
  },
  "ja": {
    "images": "画像",
    "addImage": "画像を追加",
    "imageUrl": "画像 URL",
    "title": "タイトル",
    "caption": "キャプション",
    "licenseUrl": "ライセンス URL"
  },
  "ko": {
    "images": "이미지",
    "addImage": "이미지 추가",
    "imageUrl": "이미지 URL",
    "title": "제목",
    "caption": "캡션",
    "licenseUrl": "라이선스 URL"
  },
  "ru": {
    "images": "Изображения",
    "addImage": "Добавить изображение",
    "imageUrl": "URL изображения",
    "title": "Заголовок",
    "caption": "Подпись",
    "licenseUrl": "URL лицензии"
  },
  "pt": {
    "images": "Imagens",
    "addImage": "Adicionar imagem",
    "imageUrl": "URL da imagem",
    "title": "Título",
    "caption": "Legenda",
    "licenseUrl": "URL da licença"
  },
  "ar": {
    "images": "الصور",
    "addImage": "إضافة صورة",
    "imageUrl": "URL الصورة",
    "title": "العنوان",
    "caption": "الوصف",
    "licenseUrl": "URL الترخيص"
  },
  "hi": {
    "images": "इमेज",
    "addImage": "इमेज जोड़ें",
    "imageUrl": "इमेज URL",
    "title": "शीर्षक",
    "caption": "कैप्शन",
    "licenseUrl": "लाइसेंस URL"
  },
  "tr": {
    "images": "Görseller",
    "addImage": "Görsel ekle",
    "imageUrl": "Görsel URL",
    "title": "Başlık",
    "caption": "Açıklama",
    "licenseUrl": "Lisans URL"
  },
  "nl": {
    "images": "Afbeeldingen",
    "addImage": "Afbeelding toevoegen",
    "imageUrl": "Afbeelding-URL",
    "title": "Titel",
    "caption": "Bijschrift",
    "licenseUrl": "Licentie-URL"
  },
  "sv": {
    "images": "Bilder",
    "addImage": "Lägg till bild",
    "imageUrl": "Bild-URL",
    "title": "Titel",
    "caption": "Bildtext",
    "licenseUrl": "Licens-URL"
  },
  "pl": {
    "images": "Obrazy",
    "addImage": "Dodaj obraz",
    "imageUrl": "URL obrazu",
    "title": "Tytuł",
    "caption": "Podpis",
    "licenseUrl": "URL licencji"
  },
  "vi": {
    "images": "Hình ảnh",
    "addImage": "Thêm hình ảnh",
    "imageUrl": "URL hình ảnh",
    "title": "Tiêu đề",
    "caption": "Chú thích",
    "licenseUrl": "URL giấy phép"
  },
  "th": {
    "images": "รูปภาพ",
    "addImage": "เพิ่มรูปภาพ",
    "imageUrl": "URL รูปภาพ",
    "title": "ชื่อเรื่อง",
    "caption": "คำบรรยาย",
    "licenseUrl": "URL ใบอนุญาต"
  },
  "id": {
    "images": "Gambar",
    "addImage": "Tambah gambar",
    "imageUrl": "URL gambar",
    "title": "Judul",
    "caption": "Keterangan",
    "licenseUrl": "URL lisensi"
  },
  "he": {
    "images": "תמונות",
    "addImage": "הוסף תמונה",
    "imageUrl": "URL תמונה",
    "title": "כותרת",
    "caption": "כיתוב",
    "licenseUrl": "URL רישיון"
  },
  "ms": {
    "images": "Imej",
    "addImage": "Tambah imej",
    "imageUrl": "URL imej",
    "title": "Tajuk",
    "caption": "Kapsyen",
    "licenseUrl": "URL lesen"
  },
  "no": {
    "images": "Bilder",
    "addImage": "Legg til bilde",
    "imageUrl": "Bilde-URL",
    "title": "Tittel",
    "caption": "Bildetekst",
    "licenseUrl": "Lisens-URL"
  }
}
</i18n>
