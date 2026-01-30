<template>
  <ToolSectionHeader>{{ t('preview-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="space-between" :size="12" wrap>
        <n-text strong>{{ t('output-title') }}</n-text>
        <n-flex align="center" :size="12" wrap>
          <n-flex align="center" :size="8">
            <n-text depth="3">{{ t('dark-background') }}</n-text>
            <n-switch
              size="small"
              :value="darkBackground"
              data-testid="background-switch"
              @update:value="handleBackgroundChange"
            />
          </n-flex>
          <CopyToClipboardButton :content="cssOutput" />
        </n-flex>
      </n-flex>
      <n-text depth="3">{{ t('output-hint') }}</n-text>
      <n-code :code="cssOutput" word-wrap data-testid="shadow-output" />
      <div class="preview-surface" :class="{ 'is-dark': darkBackground }">
        <div class="preview-card" :style="previewStyle" data-testid="shadow-preview" />
      </div>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { NCode, NFlex, NSwitch, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  cssOutput: string
  previewStyle: CSSProperties
  darkBackground: boolean
}>()

const emit = defineEmits<{
  (event: 'update:darkBackground', value: boolean): void
}>()

const { t } = useI18n()

function handleBackgroundChange(value: boolean) {
  emit('update:darkBackground', value)
}
</script>

<style scoped>
.preview-surface {
  border-radius: 12px;
  padding: 24px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-surface.is-dark {
  background: linear-gradient(135deg, #111827, #1f2937);
}

.preview-card {
  width: 200px;
  height: 120px;
  border-radius: 16px;
  background: #ffffff;
}

.preview-surface.is-dark .preview-card {
  background: #0f172a;
}
</style>

<i18n lang="json">
{
  "en": {
    "preview-title": "Preview",
    "output-title": "CSS output",
    "output-hint": "Copy the box-shadow value into your CSS.",
    "dark-background": "Dark background"
  },
  "zh": {
    "preview-title": "预览",
    "output-title": "CSS 输出",
    "output-hint": "将 box-shadow 值复制到你的 CSS 中。",
    "dark-background": "深色背景"
  },
  "zh-CN": {
    "preview-title": "预览",
    "output-title": "CSS 输出",
    "output-hint": "将 box-shadow 值复制到你的 CSS 中。",
    "dark-background": "深色背景"
  },
  "zh-TW": {
    "preview-title": "預覽",
    "output-title": "CSS 輸出",
    "output-hint": "將 box-shadow 值複製到你的 CSS。",
    "dark-background": "深色背景"
  },
  "zh-HK": {
    "preview-title": "預覽",
    "output-title": "CSS 輸出",
    "output-hint": "將 box-shadow 值複製到你的 CSS。",
    "dark-background": "深色背景"
  },
  "es": {
    "preview-title": "Vista previa",
    "output-title": "Salida CSS",
    "output-hint": "Copia el valor de box-shadow en tu CSS.",
    "dark-background": "Fondo oscuro"
  },
  "fr": {
    "preview-title": "Aperçu",
    "output-title": "Sortie CSS",
    "output-hint": "Copiez la valeur box-shadow dans votre CSS.",
    "dark-background": "Fond sombre"
  },
  "de": {
    "preview-title": "Vorschau",
    "output-title": "CSS-Ausgabe",
    "output-hint": "Kopiere den box-shadow-Wert in dein CSS.",
    "dark-background": "Dunkler Hintergrund"
  },
  "it": {
    "preview-title": "Anteprima",
    "output-title": "Output CSS",
    "output-hint": "Copia il valore box-shadow nel tuo CSS.",
    "dark-background": "Sfondo scuro"
  },
  "ja": {
    "preview-title": "プレビュー",
    "output-title": "CSS 出力",
    "output-hint": "box-shadow の値を CSS にコピーします。",
    "dark-background": "暗い背景"
  },
  "ko": {
    "preview-title": "미리보기",
    "output-title": "CSS 출력",
    "output-hint": "box-shadow 값을 CSS에 복사하세요.",
    "dark-background": "어두운 배경"
  },
  "ru": {
    "preview-title": "Предпросмотр",
    "output-title": "Вывод CSS",
    "output-hint": "Скопируйте значение box-shadow в ваш CSS.",
    "dark-background": "Темный фон"
  },
  "pt": {
    "preview-title": "Prévia",
    "output-title": "Saída CSS",
    "output-hint": "Copie o valor de box-shadow para o seu CSS.",
    "dark-background": "Fundo escuro"
  },
  "ar": {
    "preview-title": "معاينة",
    "output-title": "مخرجات CSS",
    "output-hint": "انسخ قيمة box-shadow إلى CSS.",
    "dark-background": "خلفية داكنة"
  },
  "hi": {
    "preview-title": "पूर्वावलोकन",
    "output-title": "CSS आउटपुट",
    "output-hint": "box-shadow मान को अपने CSS में कॉपी करें।",
    "dark-background": "गहरा बैकग्राउंड"
  },
  "tr": {
    "preview-title": "Önizleme",
    "output-title": "CSS çıktısı",
    "output-hint": "box-shadow değerini CSS'inize kopyalayın.",
    "dark-background": "Koyu arka plan"
  },
  "nl": {
    "preview-title": "Voorbeeld",
    "output-title": "CSS-uitvoer",
    "output-hint": "Kopieer de box-shadow-waarde naar je CSS.",
    "dark-background": "Donkere achtergrond"
  },
  "sv": {
    "preview-title": "Förhandsvisning",
    "output-title": "CSS-utdata",
    "output-hint": "Kopiera box-shadow-värdet till din CSS.",
    "dark-background": "Mörk bakgrund"
  },
  "pl": {
    "preview-title": "Podgląd",
    "output-title": "Wynik CSS",
    "output-hint": "Skopiuj wartość box-shadow do swojego CSS.",
    "dark-background": "Ciemne tło"
  },
  "vi": {
    "preview-title": "Xem trước",
    "output-title": "Đầu ra CSS",
    "output-hint": "Sao chép giá trị box-shadow vào CSS của bạn.",
    "dark-background": "Nền tối"
  },
  "th": {
    "preview-title": "พรีวิว",
    "output-title": "เอาต์พุต CSS",
    "output-hint": "คัดลอกค่า box-shadow ไปยัง CSS ของคุณ",
    "dark-background": "พื้นหลังเข้ม"
  },
  "id": {
    "preview-title": "Pratinjau",
    "output-title": "Output CSS",
    "output-hint": "Salin nilai box-shadow ke CSS Anda.",
    "dark-background": "Latar gelap"
  },
  "he": {
    "preview-title": "תצוגה מקדימה",
    "output-title": "פלט CSS",
    "output-hint": "העתק את ערך box-shadow ל-CSS שלך.",
    "dark-background": "רקע כהה"
  },
  "ms": {
    "preview-title": "Pratonton",
    "output-title": "Output CSS",
    "output-hint": "Salin nilai box-shadow ke CSS anda.",
    "dark-background": "Latar gelap"
  },
  "no": {
    "preview-title": "Forhåndsvisning",
    "output-title": "CSS-utdata",
    "output-hint": "Kopier box-shadow-verdien inn i CSS-en din.",
    "dark-background": "Mørk bakgrunn"
  }
}
</i18n>
