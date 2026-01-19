<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  category: string
}>()

const { t } = useI18n()
</script>

<template>
  <!-- eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys -->
  <span>{{ t(category) }}</span>
</template>

<i18n lang="json">
{
  "en": {
    "application": "Application",
    "audio": "Audio",
    "font": "Font",
    "image": "Image",
    "message": "Message",
    "model": "Model",
    "multipart": "Multipart",
    "text": "Text",
    "video": "Video"
  },
  "zh": {
    "application": "应用程序",
    "audio": "音频",
    "font": "字体",
    "image": "图像",
    "message": "消息",
    "model": "模型",
    "multipart": "多部分",
    "text": "文本",
    "video": "视频"
  },
  "zh-CN": {
    "application": "应用程序",
    "audio": "音频",
    "font": "字体",
    "image": "图像",
    "message": "消息",
    "model": "模型",
    "multipart": "多部分",
    "text": "文本",
    "video": "视频"
  },
  "zh-TW": {
    "application": "應用程式",
    "audio": "音訊",
    "font": "字型",
    "image": "影像",
    "message": "訊息",
    "model": "模型",
    "multipart": "多部分",
    "text": "文字",
    "video": "視訊"
  },
  "zh-HK": {
    "application": "應用程式",
    "audio": "音訊",
    "font": "字型",
    "image": "影像",
    "message": "訊息",
    "model": "模型",
    "multipart": "多部分",
    "text": "文字",
    "video": "視訊"
  },
  "es": {
    "application": "Aplicacion",
    "audio": "Audio",
    "font": "Fuente",
    "image": "Imagen",
    "message": "Mensaje",
    "model": "Modelo",
    "multipart": "Multiparte",
    "text": "Texto",
    "video": "Video"
  },
  "fr": {
    "application": "Application",
    "audio": "Audio",
    "font": "Police",
    "image": "Image",
    "message": "Message",
    "model": "Modele",
    "multipart": "Multipartie",
    "text": "Texte",
    "video": "Video"
  },
  "de": {
    "application": "Anwendung",
    "audio": "Audio",
    "font": "Schriftart",
    "image": "Bild",
    "message": "Nachricht",
    "model": "Modell",
    "multipart": "Mehrteilig",
    "text": "Text",
    "video": "Video"
  },
  "it": {
    "application": "Applicazione",
    "audio": "Audio",
    "font": "Carattere",
    "image": "Immagine",
    "message": "Messaggio",
    "model": "Modello",
    "multipart": "Multipart",
    "text": "Testo",
    "video": "Video"
  },
  "ja": {
    "application": "アプリケーション",
    "audio": "オーディオ",
    "font": "フォント",
    "image": "画像",
    "message": "メッセージ",
    "model": "モデル",
    "multipart": "マルチパート",
    "text": "テキスト",
    "video": "ビデオ"
  },
  "ko": {
    "application": "애플리케이션",
    "audio": "오디오",
    "font": "글꼴",
    "image": "이미지",
    "message": "메시지",
    "model": "모델",
    "multipart": "멀티파트",
    "text": "텍스트",
    "video": "비디오"
  },
  "ru": {
    "application": "Приложение",
    "audio": "Аудио",
    "font": "Шрифт",
    "image": "Изображение",
    "message": "Сообщение",
    "model": "Модель",
    "multipart": "Многочастный",
    "text": "Текст",
    "video": "Видео"
  },
  "pt": {
    "application": "Aplicacao",
    "audio": "Audio",
    "font": "Fonte",
    "image": "Imagem",
    "message": "Mensagem",
    "model": "Modelo",
    "multipart": "Multiparte",
    "text": "Texto",
    "video": "Video"
  },
  "ar": {
    "application": "تطبيق",
    "audio": "صوتي",
    "font": "خط",
    "image": "صورة",
    "message": "رسالة",
    "model": "نموذج",
    "multipart": "متعدد الأجزاء",
    "text": "نص",
    "video": "فيديو"
  },
  "hi": {
    "application": "एप्लिकेशन",
    "audio": "ऑडियो",
    "font": "फ़ॉन्ट",
    "image": "छवि",
    "message": "संदेश",
    "model": "मॉडल",
    "multipart": "मल्टीपार्ट",
    "text": "टेक्स्ट",
    "video": "वीडियो"
  },
  "tr": {
    "application": "Uygulama",
    "audio": "Ses",
    "font": "Yazi Tipi",
    "image": "Gorsel",
    "message": "Mesaj",
    "model": "Model",
    "multipart": "Cok Parcali",
    "text": "Metin",
    "video": "Video"
  },
  "nl": {
    "application": "Applicatie",
    "audio": "Audio",
    "font": "Lettertype",
    "image": "Afbeelding",
    "message": "Bericht",
    "model": "Model",
    "multipart": "Multipart",
    "text": "Tekst",
    "video": "Video"
  },
  "sv": {
    "application": "Applikation",
    "audio": "Ljud",
    "font": "Typsnitt",
    "image": "Bild",
    "message": "Meddelande",
    "model": "Modell",
    "multipart": "Multipart",
    "text": "Text",
    "video": "Video"
  },
  "pl": {
    "application": "Aplikacja",
    "audio": "Audio",
    "font": "Czcionka",
    "image": "Obraz",
    "message": "Wiadomosc",
    "model": "Model",
    "multipart": "Wieloczesciowy",
    "text": "Tekst",
    "video": "Wideo"
  },
  "vi": {
    "application": "Ung dung",
    "audio": "Am thanh",
    "font": "Phong chu",
    "image": "Hinh anh",
    "message": "Tin nhan",
    "model": "Mo hinh",
    "multipart": "Nhieu phan",
    "text": "Van ban",
    "video": "Video"
  },
  "th": {
    "application": "แอปพลิเคชัน",
    "audio": "เสียง",
    "font": "แบบอักษร",
    "image": "รูปภาพ",
    "message": "ข้อความ",
    "model": "โมเดล",
    "multipart": "หลายส่วน",
    "text": "ข้อความ",
    "video": "วิดีโอ"
  },
  "id": {
    "application": "Aplikasi",
    "audio": "Audio",
    "font": "Font",
    "image": "Gambar",
    "message": "Pesan",
    "model": "Model",
    "multipart": "Multipart",
    "text": "Teks",
    "video": "Video"
  },
  "he": {
    "application": "אפליקציה",
    "audio": "שמע",
    "font": "גופן",
    "image": "תמונה",
    "message": "הודעה",
    "model": "מודל",
    "multipart": "רב-חלקי",
    "text": "טקסט",
    "video": "וידאו"
  },
  "ms": {
    "application": "Aplikasi",
    "audio": "Audio",
    "font": "Fon",
    "image": "Imej",
    "message": "Mesej",
    "model": "Model",
    "multipart": "Multipart",
    "text": "Teks",
    "video": "Video"
  },
  "no": {
    "application": "Applikasjon",
    "audio": "Lyd",
    "font": "Skrifttype",
    "image": "Bilde",
    "message": "Melding",
    "model": "Modell",
    "multipart": "Multipart",
    "text": "Tekst",
    "video": "Video"
  }
}
</i18n>
