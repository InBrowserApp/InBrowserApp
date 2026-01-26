<template>
  <n-card :title="t('preview-title')" class="preview-card">
    <template #header-extra>
      <n-button
        quaternary
        circle
        class="preview-toggle"
        :class="{ 'preview-toggle--active': darkBackground }"
        :aria-label="t('preview-background')"
        data-testid="background-toggle"
        @click="toggleBackground"
      >
        <template #icon>
          <n-icon :component="ArrowSwap20Regular" />
        </template>
      </n-button>
    </template>

    <n-text depth="3" class="card-hint">{{ t('preview-hint') }}</n-text>

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

    <div class="control-grid">
      <n-form-item :label="t('preview-size')">
        <n-flex align="center" :size="12" class="control-row">
          <n-slider
            :value="fontSize"
            :min="12"
            :max="96"
            @update:value="emit('update:fontSize', $event)"
          />
          <n-input-number
            :value="fontSize"
            :min="12"
            :max="96"
            size="small"
            @update:value="emit('update:fontSize', $event)"
          />
        </n-flex>
      </n-form-item>
      <n-form-item :label="t('preview-line-height')">
        <n-flex align="center" :size="12" class="control-row">
          <n-slider
            :value="lineHeight"
            :min="1"
            :max="2.4"
            :step="0.05"
            @update:value="emit('update:lineHeight', $event)"
          />
          <n-input-number
            :value="lineHeight"
            :min="1"
            :max="2.4"
            :step="0.05"
            size="small"
            @update:value="emit('update:lineHeight', $event)"
          />
        </n-flex>
      </n-form-item>
    </div>

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
import type { CSSProperties } from 'vue'
import {
  NButton,
  NCard,
  NCode,
  NFlex,
  NFormItem,
  NIcon,
  NInput,
  NInputNumber,
  NSlider,
  NText,
} from 'naive-ui'
import ArrowSwap20Regular from '@vicons/fluent/ArrowSwap20Regular'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'
import type { DisplayFont } from './types'

const props = defineProps<{
  sampleText: string
  fontSize: number
  lineHeight: number
  darkBackground: boolean
  activeFont?: DisplayFont
  previewStyle: CSSProperties
  cssSnippet: string
}>()

const emit = defineEmits([
  'update:sampleText',
  'update:fontSize',
  'update:lineHeight',
  'update:darkBackground',
])

const { t } = useI18n()

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

.card-hint {
  color: rgba(100, 116, 139, 0.9);
  font-size: 13px;
  margin-top: -8px;
  margin-bottom: 8px;
}

.control-grid {
  display: grid;
  gap: 12px;
}

.control-row {
  width: 100%;
}

.control-row :deep(.n-slider) {
  flex: 1;
  min-width: 120px;
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

.preview-toggle {
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(248, 250, 252, 0.9);
}

.preview-toggle--active {
  border-color: rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.12);
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
    "preview-hint": "Tune the sample text and typography settings.",
    "preview-placeholder": "Type your sample text…",
    "preview-fallback": "Sample text",
    "preview-size": "Size",
    "preview-line-height": "Line height",
    "preview-background": "Dark background",
    "preview-empty": "Select a font to preview.",
    "css-title": "CSS snippet"
  },
  "zh": {
    "preview-title": "预览",
    "preview-hint": "调整示例文字和排版设置。",
    "preview-placeholder": "输入示例文字…",
    "preview-fallback": "示例文字",
    "preview-size": "字号",
    "preview-line-height": "行高",
    "preview-background": "深色背景",
    "preview-empty": "请选择一个字体进行预览。",
    "css-title": "CSS 代码"
  },
  "zh-CN": {
    "preview-title": "预览",
    "preview-hint": "调整示例文字和排版设置。",
    "preview-placeholder": "输入示例文字…",
    "preview-fallback": "示例文字",
    "preview-size": "字号",
    "preview-line-height": "行高",
    "preview-background": "深色背景",
    "preview-empty": "请选择一个字体进行预览。",
    "css-title": "CSS 代码"
  },
  "zh-TW": {
    "preview-title": "預覽",
    "preview-hint": "調整示例文字與排版設定。",
    "preview-placeholder": "輸入示例文字…",
    "preview-fallback": "示例文字",
    "preview-size": "字號",
    "preview-line-height": "行高",
    "preview-background": "深色背景",
    "preview-empty": "請選擇字型以預覽。",
    "css-title": "CSS 片段"
  },
  "zh-HK": {
    "preview-title": "預覽",
    "preview-hint": "調整示例文字與排版設定。",
    "preview-placeholder": "輸入示例文字…",
    "preview-fallback": "示例文字",
    "preview-size": "字號",
    "preview-line-height": "行高",
    "preview-background": "深色背景",
    "preview-empty": "請選擇字體以預覽。",
    "css-title": "CSS 片段"
  },
  "es": {
    "preview-title": "Vista previa",
    "preview-hint": "Ajusta el texto y la tipografía de muestra.",
    "preview-placeholder": "Escribe tu texto de muestra…",
    "preview-fallback": "Texto de muestra",
    "preview-size": "Tamaño",
    "preview-line-height": "Altura de línea",
    "preview-background": "Fondo oscuro",
    "preview-empty": "Selecciona una fuente para previsualizar.",
    "css-title": "Fragmento CSS"
  },
  "fr": {
    "preview-title": "Aperçu",
    "preview-hint": "Ajustez le texte d'exemple et les réglages typographiques.",
    "preview-placeholder": "Saisissez votre texte d'exemple…",
    "preview-fallback": "Texte d'exemple",
    "preview-size": "Taille",
    "preview-line-height": "Interligne",
    "preview-background": "Fond sombre",
    "preview-empty": "Sélectionnez une police pour l'aperçu.",
    "css-title": "Extrait CSS"
  },
  "de": {
    "preview-title": "Vorschau",
    "preview-hint": "Beispieltext und Typografie einstellen.",
    "preview-placeholder": "Beispieltext eingeben…",
    "preview-fallback": "Beispieltext",
    "preview-size": "Größe",
    "preview-line-height": "Zeilenhöhe",
    "preview-background": "Dunkler Hintergrund",
    "preview-empty": "Wähle eine Schrift für die Vorschau.",
    "css-title": "CSS-Auszug"
  },
  "it": {
    "preview-title": "Anteprima",
    "preview-hint": "Regola il testo di esempio e la tipografia.",
    "preview-placeholder": "Scrivi il testo di esempio…",
    "preview-fallback": "Testo di esempio",
    "preview-size": "Dimensione",
    "preview-line-height": "Interlinea",
    "preview-background": "Sfondo scuro",
    "preview-empty": "Seleziona un font per l'anteprima.",
    "css-title": "Snippet CSS"
  },
  "ja": {
    "preview-title": "プレビュー",
    "preview-hint": "サンプル文字とタイポグラフィを調整します。",
    "preview-placeholder": "サンプル文字を入力…",
    "preview-fallback": "サンプル文字",
    "preview-size": "サイズ",
    "preview-line-height": "行の高さ",
    "preview-background": "ダーク背景",
    "preview-empty": "プレビューするフォントを選択してください。",
    "css-title": "CSS スニペット"
  },
  "ko": {
    "preview-title": "미리보기",
    "preview-hint": "샘플 텍스트와 타이포 설정을 조정하세요.",
    "preview-placeholder": "샘플 텍스트 입력…",
    "preview-fallback": "샘플 텍스트",
    "preview-size": "크기",
    "preview-line-height": "줄 높이",
    "preview-background": "어두운 배경",
    "preview-empty": "미리볼 폰트를 선택하세요.",
    "css-title": "CSS 스니펫"
  },
  "ru": {
    "preview-title": "Предпросмотр",
    "preview-hint": "Настройте образец текста и типографику.",
    "preview-placeholder": "Введите образец текста…",
    "preview-fallback": "Образец текста",
    "preview-size": "Размер",
    "preview-line-height": "Межстрочный интервал",
    "preview-background": "Тёмный фон",
    "preview-empty": "Выберите шрифт для предпросмотра.",
    "css-title": "CSS-фрагмент"
  },
  "pt": {
    "preview-title": "Prévia",
    "preview-hint": "Ajuste o texto de amostra e a tipografia.",
    "preview-placeholder": "Digite o texto de amostra…",
    "preview-fallback": "Texto de amostra",
    "preview-size": "Tamanho",
    "preview-line-height": "Altura da linha",
    "preview-background": "Fundo escuro",
    "preview-empty": "Selecione uma fonte para pré-visualizar.",
    "css-title": "Trecho CSS"
  },
  "ar": {
    "preview-title": "معاينة",
    "preview-hint": "اضبط نص العينة وإعدادات الطباعة.",
    "preview-placeholder": "اكتب نص العينة…",
    "preview-fallback": "نص العينة",
    "preview-size": "الحجم",
    "preview-line-height": "ارتفاع السطر",
    "preview-background": "خلفية داكنة",
    "preview-empty": "اختر خطًا للمعاينة.",
    "css-title": "مقتطف CSS"
  },
  "hi": {
    "preview-title": "पूर्वावलोकन",
    "preview-hint": "सैंपल टेक्स्ट और टाइपोग्राफी सेटिंग्स समायोजित करें।",
    "preview-placeholder": "सैंपल टेक्स्ट लिखें…",
    "preview-fallback": "सैंपल टेक्स्ट",
    "preview-size": "आकार",
    "preview-line-height": "लाइन हाइट",
    "preview-background": "डार्क बैकग्राउंड",
    "preview-empty": "पूर्वावलोकन के लिए कोई फ़ॉन्ट चुनें।",
    "css-title": "CSS स्निपेट"
  },
  "tr": {
    "preview-title": "Önizleme",
    "preview-hint": "Örnek metni ve tipografi ayarlarını düzenleyin.",
    "preview-placeholder": "Örnek metin yazın…",
    "preview-fallback": "Örnek metin",
    "preview-size": "Boyut",
    "preview-line-height": "Satır yüksekliği",
    "preview-background": "Koyu arka plan",
    "preview-empty": "Önizleme için bir yazı tipi seçin.",
    "css-title": "CSS parçası"
  },
  "nl": {
    "preview-title": "Voorbeeld",
    "preview-hint": "Pas voorbeeldtekst en typografie aan.",
    "preview-placeholder": "Typ je voorbeeldtekst…",
    "preview-fallback": "Voorbeeldtekst",
    "preview-size": "Grootte",
    "preview-line-height": "Regelhoogte",
    "preview-background": "Donkere achtergrond",
    "preview-empty": "Selecteer een lettertype om te bekijken.",
    "css-title": "CSS-fragment"
  },
  "sv": {
    "preview-title": "Förhandsvisning",
    "preview-hint": "Justera exempeltext och typografiinställningar.",
    "preview-placeholder": "Skriv exempeltext…",
    "preview-fallback": "Exempeltext",
    "preview-size": "Storlek",
    "preview-line-height": "Radavstånd",
    "preview-background": "Mörk bakgrund",
    "preview-empty": "Välj ett typsnitt för förhandsvisning.",
    "css-title": "CSS-snutt"
  },
  "pl": {
    "preview-title": "Podgląd",
    "preview-hint": "Dostosuj tekst próbki i ustawienia typografii.",
    "preview-placeholder": "Wpisz tekst próbki…",
    "preview-fallback": "Tekst próbki",
    "preview-size": "Rozmiar",
    "preview-line-height": "Interlinia",
    "preview-background": "Ciemne tło",
    "preview-empty": "Wybierz font do podglądu.",
    "css-title": "Fragment CSS"
  },
  "vi": {
    "preview-title": "Xem trước",
    "preview-hint": "Điều chỉnh văn bản mẫu và thiết lập kiểu chữ.",
    "preview-placeholder": "Nhập văn bản mẫu…",
    "preview-fallback": "Văn bản mẫu",
    "preview-size": "Cỡ chữ",
    "preview-line-height": "Khoảng cách dòng",
    "preview-background": "Nền tối",
    "preview-empty": "Chọn phông chữ để xem trước.",
    "css-title": "Đoạn CSS"
  },
  "th": {
    "preview-title": "พรีวิว",
    "preview-hint": "ปรับข้อความตัวอย่างและการตั้งค่าตัวพิมพ์",
    "preview-placeholder": "พิมพ์ข้อความตัวอย่าง…",
    "preview-fallback": "ข้อความตัวอย่าง",
    "preview-size": "ขนาด",
    "preview-line-height": "ระยะบรรทัด",
    "preview-background": "พื้นหลังเข้ม",
    "preview-empty": "เลือกฟอนต์เพื่อพรีวิว",
    "css-title": "ตัวอย่าง CSS"
  },
  "id": {
    "preview-title": "Pratinjau",
    "preview-hint": "Sesuaikan teks contoh dan pengaturan tipografi.",
    "preview-placeholder": "Ketik teks contoh…",
    "preview-fallback": "Teks contoh",
    "preview-size": "Ukuran",
    "preview-line-height": "Tinggi baris",
    "preview-background": "Latar gelap",
    "preview-empty": "Pilih font untuk pratinjau.",
    "css-title": "Cuplikan CSS"
  },
  "he": {
    "preview-title": "תצוגה מקדימה",
    "preview-hint": "כוונן את טקסט הדוגמה והטיפוגרפיה.",
    "preview-placeholder": "הקלד טקסט לדוגמה…",
    "preview-fallback": "טקסט לדוגמה",
    "preview-size": "גודל",
    "preview-line-height": "גובה שורה",
    "preview-background": "רקע כהה",
    "preview-empty": "בחר גופן לתצוגה מקדימה.",
    "css-title": "קטע CSS"
  },
  "ms": {
    "preview-title": "Pratonton",
    "preview-hint": "Laraskan teks sampel dan tetapan tipografi.",
    "preview-placeholder": "Taip teks sampel…",
    "preview-fallback": "Teks sampel",
    "preview-size": "Saiz",
    "preview-line-height": "Ketinggian baris",
    "preview-background": "Latar gelap",
    "preview-empty": "Pilih fon untuk pratonton.",
    "css-title": "Petikan CSS"
  },
  "no": {
    "preview-title": "Forhåndsvisning",
    "preview-hint": "Juster eksempeltekst og typografiske innstillinger.",
    "preview-placeholder": "Skriv eksempeltekst…",
    "preview-fallback": "Eksempeltekst",
    "preview-size": "Størrelse",
    "preview-line-height": "Linjehøyde",
    "preview-background": "Mørk bakgrunn",
    "preview-empty": "Velg en font for forhåndsvisning.",
    "css-title": "CSS-utdrag"
  }
}
</i18n>
