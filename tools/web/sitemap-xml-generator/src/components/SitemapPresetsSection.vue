<template>
  <ToolSectionHeader>{{ t('presets') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex :wrap="true" :size="8">
      <n-button size="small" @click="emit('apply', 'basic')" data-testid="preset-basic">
        {{ t('presetBasic') }}
      </n-button>
      <n-button size="small" @click="emit('apply', 'image')" data-testid="preset-image">
        {{ t('presetImage') }}
      </n-button>
      <n-button size="small" @click="emit('apply', 'video')" data-testid="preset-video">
        {{ t('presetVideo') }}
      </n-button>
      <n-button size="small" @click="emit('apply', 'news')" data-testid="preset-news">
        {{ t('presetNews') }}
      </n-button>
      <n-button size="small" @click="emit('apply', 'index')" data-testid="preset-index">
        {{ t('presetIndex') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

type PresetKey = 'basic' | 'image' | 'video' | 'news' | 'index'

const emit = defineEmits<{
  (event: 'apply', preset: PresetKey): void
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "presets": "Presets",
    "presetBasic": "Basic example",
    "presetImage": "Image example",
    "presetVideo": "Video example",
    "presetNews": "News example",
    "presetIndex": "Sitemap index example"
  },
  "zh": {
    "presets": "预设",
    "presetBasic": "基础示例",
    "presetImage": "图片示例",
    "presetVideo": "视频示例",
    "presetNews": "新闻示例",
    "presetIndex": "Sitemap 索引示例"
  },
  "zh-CN": {
    "presets": "预设",
    "presetBasic": "基础示例",
    "presetImage": "图片示例",
    "presetVideo": "视频示例",
    "presetNews": "新闻示例",
    "presetIndex": "Sitemap 索引示例"
  },
  "zh-TW": {
    "presets": "預設",
    "presetBasic": "基礎範例",
    "presetImage": "圖片範例",
    "presetVideo": "影片範例",
    "presetNews": "新聞範例",
    "presetIndex": "Sitemap 索引範例"
  },
  "zh-HK": {
    "presets": "預設",
    "presetBasic": "基礎範例",
    "presetImage": "圖片範例",
    "presetVideo": "影片範例",
    "presetNews": "新聞範例",
    "presetIndex": "Sitemap 索引範例"
  },
  "es": {
    "presets": "Preajustes",
    "presetBasic": "Ejemplo básico",
    "presetImage": "Ejemplo de imágenes",
    "presetVideo": "Ejemplo de vídeo",
    "presetNews": "Ejemplo de noticias",
    "presetIndex": "Ejemplo de índice de sitemaps"
  },
  "fr": {
    "presets": "Préréglages",
    "presetBasic": "Exemple de base",
    "presetImage": "Exemple d'images",
    "presetVideo": "Exemple de vidéo",
    "presetNews": "Exemple d'actualités",
    "presetIndex": "Exemple d'index de sitemaps"
  },
  "de": {
    "presets": "Voreinstellungen",
    "presetBasic": "Basisbeispiel",
    "presetImage": "Bildbeispiel",
    "presetVideo": "Videobeispiel",
    "presetNews": "News-Beispiel",
    "presetIndex": "Sitemap-Index-Beispiel"
  },
  "it": {
    "presets": "Preimpostazioni",
    "presetBasic": "Esempio base",
    "presetImage": "Esempio immagini",
    "presetVideo": "Esempio video",
    "presetNews": "Esempio notizie",
    "presetIndex": "Esempio indice sitemap"
  },
  "ja": {
    "presets": "プリセット",
    "presetBasic": "基本例",
    "presetImage": "画像の例",
    "presetVideo": "動画の例",
    "presetNews": "ニュースの例",
    "presetIndex": "サイトマップインデックスの例"
  },
  "ko": {
    "presets": "프리셋",
    "presetBasic": "기본 예시",
    "presetImage": "이미지 예시",
    "presetVideo": "동영상 예시",
    "presetNews": "뉴스 예시",
    "presetIndex": "사이트맵 인덱스 예시"
  },
  "ru": {
    "presets": "Предустановки",
    "presetBasic": "Базовый пример",
    "presetImage": "Пример с изображениями",
    "presetVideo": "Пример с видео",
    "presetNews": "Пример с новостями",
    "presetIndex": "Пример индекса sitemap"
  },
  "pt": {
    "presets": "Predefinições",
    "presetBasic": "Exemplo básico",
    "presetImage": "Exemplo de imagem",
    "presetVideo": "Exemplo de vídeo",
    "presetNews": "Exemplo de notícias",
    "presetIndex": "Exemplo de índice de sitemaps"
  },
  "ar": {
    "presets": "الإعدادات المسبقة",
    "presetBasic": "مثال أساسي",
    "presetImage": "مثال صور",
    "presetVideo": "مثال فيديو",
    "presetNews": "مثال أخبار",
    "presetIndex": "مثال فهرس sitemap"
  },
  "hi": {
    "presets": "प्रीसेट",
    "presetBasic": "बेसिक उदाहरण",
    "presetImage": "इमेज उदाहरण",
    "presetVideo": "वीडियो उदाहरण",
    "presetNews": "न्यूज उदाहरण",
    "presetIndex": "Sitemap इंडेक्स उदाहरण"
  },
  "tr": {
    "presets": "Ön ayarlar",
    "presetBasic": "Temel örnek",
    "presetImage": "Görsel örneği",
    "presetVideo": "Video örneği",
    "presetNews": "Haber örneği",
    "presetIndex": "Sitemap dizini örneği"
  },
  "nl": {
    "presets": "Voorinstellingen",
    "presetBasic": "Basisvoorbeeld",
    "presetImage": "Afbeeldingsvoorbeeld",
    "presetVideo": "Videovoorbeeld",
    "presetNews": "Nieuwsvoorbeeld",
    "presetIndex": "Sitemapindex-voorbeeld"
  },
  "sv": {
    "presets": "Förinställningar",
    "presetBasic": "Grundexempel",
    "presetImage": "Bildexempel",
    "presetVideo": "Videoexempel",
    "presetNews": "Nyhetsexempel",
    "presetIndex": "Sitemapindex-exempel"
  },
  "pl": {
    "presets": "Presety",
    "presetBasic": "Podstawowy przykład",
    "presetImage": "Przykład z obrazami",
    "presetVideo": "Przykład wideo",
    "presetNews": "Przykład newsów",
    "presetIndex": "Przykład indeksu sitemap"
  },
  "vi": {
    "presets": "Mẫu",
    "presetBasic": "Ví dụ cơ bản",
    "presetImage": "Ví dụ hình ảnh",
    "presetVideo": "Ví dụ video",
    "presetNews": "Ví dụ tin tức",
    "presetIndex": "Ví dụ chỉ mục sitemap"
  },
  "th": {
    "presets": "พรีเซ็ต",
    "presetBasic": "ตัวอย่างพื้นฐาน",
    "presetImage": "ตัวอย่างรูปภาพ",
    "presetVideo": "ตัวอย่างวิดีโอ",
    "presetNews": "ตัวอย่างข่าว",
    "presetIndex": "ตัวอย่างดัชนี sitemap"
  },
  "id": {
    "presets": "Preset",
    "presetBasic": "Contoh dasar",
    "presetImage": "Contoh gambar",
    "presetVideo": "Contoh video",
    "presetNews": "Contoh berita",
    "presetIndex": "Contoh indeks sitemap"
  },
  "he": {
    "presets": "הגדרות מראש",
    "presetBasic": "דוגמה בסיסית",
    "presetImage": "דוגמת תמונה",
    "presetVideo": "דוגמת וידאו",
    "presetNews": "דוגמת חדשות",
    "presetIndex": "דוגמת אינדקס sitemap"
  },
  "ms": {
    "presets": "Praset",
    "presetBasic": "Contoh asas",
    "presetImage": "Contoh imej",
    "presetVideo": "Contoh video",
    "presetNews": "Contoh berita",
    "presetIndex": "Contoh indeks sitemap"
  },
  "no": {
    "presets": "Forhåndsinnstillinger",
    "presetBasic": "Grunnleggende eksempel",
    "presetImage": "Bildeeksempel",
    "presetVideo": "Videoeksempel",
    "presetNews": "Nyhetseksempel",
    "presetIndex": "Sitemapindeks-eksempel"
  }
}
</i18n>
