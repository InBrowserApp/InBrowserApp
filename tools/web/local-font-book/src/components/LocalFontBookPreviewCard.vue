<template>
  <ToolSectionHeader>
    <span class="preview-header">
      <span>{{ t('preview-title') }}</span>
      <span class="preview-header__action">
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
      </span>
    </span>
  </ToolSectionHeader>

  <ToolSection>
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
  </ToolSection>

  <ToolSection>
    <div class="preview-surface" :class="{ 'is-dark': darkBackground }">
      <div v-if="activeFont" class="preview-text" :style="previewStyle" data-testid="preview-text">
        {{ sampleText || t('preview-fallback') }}
      </div>
      <n-text
        v-else
        depth="3"
        class="preview-empty"
        :style="emptyTextStyle"
        data-testid="preview-empty"
      >
        {{ t('preview-empty') }}
      </n-text>
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { NButton, NFormItem, NIcon, NInput, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import MoonOutline from '@vicons/ionicons5/MoonOutline'
import SunnyOutline from '@vicons/ionicons5/SunnyOutline'
import { useI18n } from 'vue-i18n'
import type { DisplayFont } from './types'

const props = defineProps<{
  sampleText: string
  darkBackground: boolean
  activeFont?: DisplayFont
  previewStyle: CSSProperties
}>()

const emit = defineEmits<{
  'update:sampleText': [string]
  'update:darkBackground': [boolean]
}>()

const { t } = useI18n()

const backgroundIcon = computed(() => (props.darkBackground ? MoonOutline : SunnyOutline))

const emptyTextStyle = computed(() => ({
  color: props.darkBackground ? '#f8fafc' : '#0f172a',
}))

const toggleBackground = () => {
  emit('update:darkBackground', !props.darkBackground)
}
</script>

<style scoped>
.preview-header {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.preview-header__action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

.preview-textarea {
  margin-top: 4px;
}
</style>

<i18n lang="json">
{
  "en": {
    "preview-title": "Preview",
    "preview-placeholder": "Type your sample text…",
    "preview-fallback": "Sample text",
    "preview-background": "Dark background",
    "preview-empty": "Select a font to preview."
  },
  "zh": {
    "preview-title": "预览",
    "preview-placeholder": "输入示例文字…",
    "preview-fallback": "示例文字",
    "preview-background": "深色背景",
    "preview-empty": "请选择一个字体进行预览。"
  },
  "zh-CN": {
    "preview-title": "预览",
    "preview-placeholder": "输入示例文字…",
    "preview-fallback": "示例文字",
    "preview-background": "深色背景",
    "preview-empty": "请选择一个字体进行预览。"
  },
  "zh-TW": {
    "preview-title": "預覽",
    "preview-placeholder": "輸入示例文字…",
    "preview-fallback": "示例文字",
    "preview-background": "深色背景",
    "preview-empty": "請選擇字型以預覽。"
  },
  "zh-HK": {
    "preview-title": "預覽",
    "preview-placeholder": "輸入示例文字…",
    "preview-fallback": "示例文字",
    "preview-background": "深色背景",
    "preview-empty": "請選擇字體以預覽。"
  },
  "es": {
    "preview-title": "Vista previa",
    "preview-placeholder": "Escribe tu texto de muestra…",
    "preview-fallback": "Texto de muestra",
    "preview-background": "Fondo oscuro",
    "preview-empty": "Selecciona una fuente para previsualizar."
  },
  "fr": {
    "preview-title": "Aperçu",
    "preview-placeholder": "Saisissez votre texte d'exemple…",
    "preview-fallback": "Texte d'exemple",
    "preview-background": "Fond sombre",
    "preview-empty": "Sélectionnez une police pour l'aperçu."
  },
  "de": {
    "preview-title": "Vorschau",
    "preview-placeholder": "Beispieltext eingeben…",
    "preview-fallback": "Beispieltext",
    "preview-background": "Dunkler Hintergrund",
    "preview-empty": "Wähle eine Schrift für die Vorschau."
  },
  "it": {
    "preview-title": "Anteprima",
    "preview-placeholder": "Scrivi il testo di esempio…",
    "preview-fallback": "Testo di esempio",
    "preview-background": "Sfondo scuro",
    "preview-empty": "Seleziona un font per l'anteprima."
  },
  "ja": {
    "preview-title": "プレビュー",
    "preview-placeholder": "サンプル文字を入力…",
    "preview-fallback": "サンプル文字",
    "preview-background": "ダーク背景",
    "preview-empty": "プレビューするフォントを選択してください。"
  },
  "ko": {
    "preview-title": "미리보기",
    "preview-placeholder": "샘플 텍스트 입력…",
    "preview-fallback": "샘플 텍스트",
    "preview-background": "어두운 배경",
    "preview-empty": "미리볼 폰트를 선택하세요."
  },
  "ru": {
    "preview-title": "Предпросмотр",
    "preview-placeholder": "Введите образец текста…",
    "preview-fallback": "Образец текста",
    "preview-background": "Тёмный фон",
    "preview-empty": "Выберите шрифт для предпросмотра."
  },
  "pt": {
    "preview-title": "Prévia",
    "preview-placeholder": "Digite o texto de amostra…",
    "preview-fallback": "Texto de amostra",
    "preview-background": "Fundo escuro",
    "preview-empty": "Selecione uma fonte para pré-visualizar."
  },
  "ar": {
    "preview-title": "معاينة",
    "preview-placeholder": "اكتب نص العينة…",
    "preview-fallback": "نص العينة",
    "preview-background": "خلفية داكنة",
    "preview-empty": "اختر خطًا للمعاينة."
  },
  "hi": {
    "preview-title": "पूर्वावलोकन",
    "preview-placeholder": "सैंपल टेक्स्ट लिखें…",
    "preview-fallback": "सैंपल टेक्स्ट",
    "preview-background": "डार्क बैकग्राउंड",
    "preview-empty": "पूर्वावलोकन के लिए कोई फ़ॉन्ट चुनें।"
  },
  "tr": {
    "preview-title": "Önizleme",
    "preview-placeholder": "Örnek metin yazın…",
    "preview-fallback": "Örnek metin",
    "preview-background": "Koyu arka plan",
    "preview-empty": "Önizleme için bir yazı tipi seçin."
  },
  "nl": {
    "preview-title": "Voorbeeld",
    "preview-placeholder": "Typ je voorbeeldtekst…",
    "preview-fallback": "Voorbeeldtekst",
    "preview-background": "Donkere achtergrond",
    "preview-empty": "Selecteer een lettertype om te bekijken."
  },
  "sv": {
    "preview-title": "Förhandsvisning",
    "preview-placeholder": "Skriv exempeltext…",
    "preview-fallback": "Exempeltext",
    "preview-background": "Mörk bakgrund",
    "preview-empty": "Välj ett typsnitt för förhandsvisning."
  },
  "pl": {
    "preview-title": "Podgląd",
    "preview-placeholder": "Wpisz tekst próbki…",
    "preview-fallback": "Tekst próbki",
    "preview-background": "Ciemne tło",
    "preview-empty": "Wybierz font do podglądu."
  },
  "vi": {
    "preview-title": "Xem trước",
    "preview-placeholder": "Nhập văn bản mẫu…",
    "preview-fallback": "Văn bản mẫu",
    "preview-background": "Nền tối",
    "preview-empty": "Chọn phông chữ để xem trước."
  },
  "th": {
    "preview-title": "พรีวิว",
    "preview-placeholder": "พิมพ์ข้อความตัวอย่าง…",
    "preview-fallback": "ข้อความตัวอย่าง",
    "preview-background": "พื้นหลังเข้ม",
    "preview-empty": "เลือกฟอนต์เพื่อพรีวิว"
  },
  "id": {
    "preview-title": "Pratinjau",
    "preview-placeholder": "Ketik teks contoh…",
    "preview-fallback": "Teks contoh",
    "preview-background": "Latar gelap",
    "preview-empty": "Pilih font untuk pratinjau."
  },
  "he": {
    "preview-title": "תצוגה מקדימה",
    "preview-placeholder": "הקלד טקסט לדוגמה…",
    "preview-fallback": "טקסט לדוגמה",
    "preview-background": "רקע כהה",
    "preview-empty": "בחר גופן לתצוגה מקדימה."
  },
  "ms": {
    "preview-title": "Pratonton",
    "preview-placeholder": "Taip teks sampel…",
    "preview-fallback": "Teks sampel",
    "preview-background": "Latar gelap",
    "preview-empty": "Pilih fon untuk pratonton."
  },
  "no": {
    "preview-title": "Forhåndsvisning",
    "preview-placeholder": "Skriv eksempeltekst…",
    "preview-fallback": "Eksempeltekst",
    "preview-background": "Mørk bakgrunn",
    "preview-empty": "Velg en font for forhåndsvisning."
  }
}
</i18n>
