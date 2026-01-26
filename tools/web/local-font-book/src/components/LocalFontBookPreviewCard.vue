<template>
  <n-card :title="t('preview-title')" class="preview-card">
    <template #header-extra>
      <n-button
        quaternary
        circle
        :aria-label="t('preview-background')"
        data-testid="background-toggle"
        @click="toggleBackground"
      >
        <template #icon>
          <n-icon :component="backgroundIcon" />
        </template>
      </n-button>
    </template>

    <n-form-item :label="t('preview-fallback')" class="preview-textarea">
      <n-input
        :value="sampleText"
        type="textarea"
        :placeholder="t('preview-placeholder')"
        :autosize="{ minRows: 3, maxRows: 5 }"
        data-testid="sample-text"
        @update:value="emit('update:sampleText', $event)"
      />
    </n-form-item>

    <div class="preview-surface" :class="{ 'is-dark': darkBackground }">
      <div v-if="activeFont" class="preview-text" :style="previewStyle" data-testid="preview-text">
        {{ sampleText || t('preview-fallback') }}
      </div>
      <n-text v-else depth="3" class="preview-empty" data-testid="preview-empty">
        {{ t('preview-empty') }}
      </n-text>
    </div>

    <div class="css-output">
      <n-text strong>{{ t('css-title') }}</n-text>
      <CopyToClipboardTooltip :content="cssSnippet" #="{ copy }">
        <span class="css-snippet-trigger" @click="cssSnippet ? copy() : undefined">
          <n-code :code="cssSnippet" word-wrap class="css-snippet" data-testid="css-snippet" />
        </span>
      </CopyToClipboardTooltip>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { NButton, NCard, NCode, NFormItem, NIcon, NInput, NText } from 'naive-ui'
import WeatherMoon16Regular from '@vicons/fluent/WeatherMoon16Regular'
import WeatherSunny16Regular from '@vicons/fluent/WeatherSunny16Regular'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'
import type { DisplayFont } from './types'

const props = defineProps<{
  sampleText: string
  darkBackground: boolean
  activeFont?: DisplayFont
  previewStyle: CSSProperties
  cssSnippet: string
}>()

const emit = defineEmits(['update:sampleText', 'update:darkBackground'])

const { t } = useI18n()

const backgroundIcon = computed(() =>
  props.darkBackground ? WeatherMoon16Regular : WeatherSunny16Regular,
)

const toggleBackground = () => {
  emit('update:darkBackground', !props.darkBackground)
}
</script>

<style scoped>
.preview-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-surface {
  border-radius: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #0f172a;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.preview-surface.is-dark {
  background: linear-gradient(135deg, #0f172a, #1f2937);
  color: #f8fafc;
}

.preview-text {
  width: 100%;
}

.preview-empty {
  color: #0f172a;
}

.preview-surface.is-dark .preview-empty {
  color: #f8fafc;
}

.preview-textarea {
  margin-top: 4px;
}

.css-output {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.css-snippet-trigger {
  display: inline-flex;
  max-width: 100%;
  cursor: pointer;
}

.css-snippet :deep(pre) {
  display: inline-block;
  max-width: 100%;
  white-space: pre-wrap;
}
</style>

<i18n lang="json">
{
  "en": {
    "preview-title": "Preview",
    "preview-placeholder": "Type your sample text…",
    "preview-fallback": "Sample text",
    "preview-background": "Dark background",
    "preview-empty": "Select a font to preview.",
    "css-title": "CSS snippet"
  },
  "zh": {
    "preview-title": "预览",
    "preview-placeholder": "输入示例文字…",
    "preview-fallback": "示例文字",
    "preview-background": "深色背景",
    "preview-empty": "请选择一个字体进行预览。",
    "css-title": "CSS 代码"
  },
  "zh-CN": {
    "preview-title": "预览",
    "preview-placeholder": "输入示例文字…",
    "preview-fallback": "示例文字",
    "preview-background": "深色背景",
    "preview-empty": "请选择一个字体进行预览。",
    "css-title": "CSS 代码"
  },
  "zh-TW": {
    "preview-title": "預覽",
    "preview-placeholder": "輸入示例文字…",
    "preview-fallback": "示例文字",
    "preview-background": "深色背景",
    "preview-empty": "請選擇字型以預覽。",
    "css-title": "CSS 片段"
  },
  "zh-HK": {
    "preview-title": "預覽",
    "preview-placeholder": "輸入示例文字…",
    "preview-fallback": "示例文字",
    "preview-background": "深色背景",
    "preview-empty": "請選擇字體以預覽。",
    "css-title": "CSS 片段"
  },
  "es": {
    "preview-title": "Vista previa",
    "preview-placeholder": "Escribe tu texto de muestra…",
    "preview-fallback": "Texto de muestra",
    "preview-background": "Fondo oscuro",
    "preview-empty": "Selecciona una fuente para previsualizar.",
    "css-title": "Fragmento CSS"
  },
  "fr": {
    "preview-title": "Aperçu",
    "preview-placeholder": "Saisissez votre texte d'exemple…",
    "preview-fallback": "Texte d'exemple",
    "preview-background": "Fond sombre",
    "preview-empty": "Sélectionnez une police pour l'aperçu.",
    "css-title": "Extrait CSS"
  },
  "de": {
    "preview-title": "Vorschau",
    "preview-placeholder": "Beispieltext eingeben…",
    "preview-fallback": "Beispieltext",
    "preview-background": "Dunkler Hintergrund",
    "preview-empty": "Wähle eine Schrift für die Vorschau.",
    "css-title": "CSS-Auszug"
  },
  "it": {
    "preview-title": "Anteprima",
    "preview-placeholder": "Scrivi il testo di esempio…",
    "preview-fallback": "Testo di esempio",
    "preview-background": "Sfondo scuro",
    "preview-empty": "Seleziona un font per l'anteprima.",
    "css-title": "Snippet CSS"
  },
  "ja": {
    "preview-title": "プレビュー",
    "preview-placeholder": "サンプル文字を入力…",
    "preview-fallback": "サンプル文字",
    "preview-background": "ダーク背景",
    "preview-empty": "プレビューするフォントを選択してください。",
    "css-title": "CSS スニペット"
  },
  "ko": {
    "preview-title": "미리보기",
    "preview-placeholder": "샘플 텍스트 입력…",
    "preview-fallback": "샘플 텍스트",
    "preview-background": "어두운 배경",
    "preview-empty": "미리볼 폰트를 선택하세요.",
    "css-title": "CSS 스니펫"
  },
  "ru": {
    "preview-title": "Предпросмотр",
    "preview-placeholder": "Введите образец текста…",
    "preview-fallback": "Образец текста",
    "preview-background": "Тёмный фон",
    "preview-empty": "Выберите шрифт для предпросмотра.",
    "css-title": "CSS-фрагмент"
  },
  "pt": {
    "preview-title": "Prévia",
    "preview-placeholder": "Digite o texto de amostra…",
    "preview-fallback": "Texto de amostra",
    "preview-background": "Fundo escuro",
    "preview-empty": "Selecione uma fonte para pré-visualizar.",
    "css-title": "Trecho CSS"
  },
  "ar": {
    "preview-title": "معاينة",
    "preview-placeholder": "اكتب نص العينة…",
    "preview-fallback": "نص العينة",
    "preview-background": "خلفية داكنة",
    "preview-empty": "اختر خطًا للمعاينة.",
    "css-title": "مقتطف CSS"
  },
  "hi": {
    "preview-title": "पूर्वावलोकन",
    "preview-placeholder": "सैंपल टेक्स्ट लिखें…",
    "preview-fallback": "सैंपल टेक्स्ट",
    "preview-background": "डार्क बैकग्राउंड",
    "preview-empty": "पूर्वावलोकन के लिए कोई फ़ॉन्ट चुनें।",
    "css-title": "CSS स्निपेट"
  },
  "tr": {
    "preview-title": "Önizleme",
    "preview-placeholder": "Örnek metin yazın…",
    "preview-fallback": "Örnek metin",
    "preview-background": "Koyu arka plan",
    "preview-empty": "Önizleme için bir yazı tipi seçin.",
    "css-title": "CSS parçası"
  },
  "nl": {
    "preview-title": "Voorbeeld",
    "preview-placeholder": "Typ je voorbeeldtekst…",
    "preview-fallback": "Voorbeeldtekst",
    "preview-background": "Donkere achtergrond",
    "preview-empty": "Selecteer een lettertype om te bekijken.",
    "css-title": "CSS-fragment"
  },
  "sv": {
    "preview-title": "Förhandsvisning",
    "preview-placeholder": "Skriv exempeltext…",
    "preview-fallback": "Exempeltext",
    "preview-background": "Mörk bakgrund",
    "preview-empty": "Välj ett typsnitt för förhandsvisning.",
    "css-title": "CSS-snutt"
  },
  "pl": {
    "preview-title": "Podgląd",
    "preview-placeholder": "Wpisz tekst próbki…",
    "preview-fallback": "Tekst próbki",
    "preview-background": "Ciemne tło",
    "preview-empty": "Wybierz font do podglądu.",
    "css-title": "Fragment CSS"
  },
  "vi": {
    "preview-title": "Xem trước",
    "preview-placeholder": "Nhập văn bản mẫu…",
    "preview-fallback": "Văn bản mẫu",
    "preview-background": "Nền tối",
    "preview-empty": "Chọn phông chữ để xem trước.",
    "css-title": "Đoạn CSS"
  },
  "th": {
    "preview-title": "พรีวิว",
    "preview-placeholder": "พิมพ์ข้อความตัวอย่าง…",
    "preview-fallback": "ข้อความตัวอย่าง",
    "preview-background": "พื้นหลังเข้ม",
    "preview-empty": "เลือกฟอนต์เพื่อพรีวิว",
    "css-title": "ตัวอย่าง CSS"
  },
  "id": {
    "preview-title": "Pratinjau",
    "preview-placeholder": "Ketik teks contoh…",
    "preview-fallback": "Teks contoh",
    "preview-background": "Latar gelap",
    "preview-empty": "Pilih font untuk pratinjau.",
    "css-title": "Cuplikan CSS"
  },
  "he": {
    "preview-title": "תצוגה מקדימה",
    "preview-placeholder": "הקלד טקסט לדוגמה…",
    "preview-fallback": "טקסט לדוגמה",
    "preview-background": "רקע כהה",
    "preview-empty": "בחר גופן לתצוגה מקדימה.",
    "css-title": "קטע CSS"
  },
  "ms": {
    "preview-title": "Pratonton",
    "preview-placeholder": "Taip teks sampel…",
    "preview-fallback": "Teks sampel",
    "preview-background": "Latar gelap",
    "preview-empty": "Pilih fon untuk pratonton.",
    "css-title": "Petikan CSS"
  },
  "no": {
    "preview-title": "Forhåndsvisning",
    "preview-placeholder": "Skriv eksempeltekst…",
    "preview-fallback": "Eksempeltekst",
    "preview-background": "Mørk bakgrunn",
    "preview-empty": "Velg en font for forhåndsvisning.",
    "css-title": "CSS-utdrag"
  }
}
</i18n>
