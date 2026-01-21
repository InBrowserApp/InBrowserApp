<template>
  <ToolSectionHeader>{{ t('colors-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="16" :y-gap="16">
      <n-gi>
        <n-form-item
          :label="t('foreground-label')"
          :feedback="foregroundFeedback"
          :validation-status="foregroundStatus"
        >
          <n-input
            v-model:value="foregroundInput"
            :placeholder="t('color-placeholder')"
            data-testid="foreground-input"
          />
        </n-form-item>
        <n-color-picker
          :value="foregroundHex"
          :modes="['hex']"
          :show-alpha="true"
          :swatches="swatches"
          data-testid="foreground-picker"
          @update:value="updateForegroundFromPicker"
        />
      </n-gi>
      <n-gi>
        <n-form-item
          :label="t('background-label')"
          :feedback="backgroundFeedback"
          :validation-status="backgroundStatus"
        >
          <n-input
            v-model:value="backgroundInput"
            :placeholder="t('color-placeholder')"
            data-testid="background-input"
          />
        </n-form-item>
        <n-color-picker
          :value="backgroundHex"
          :modes="['hex']"
          :show-alpha="true"
          :swatches="swatches"
          data-testid="background-picker"
          @update:value="updateBackgroundFromPicker"
        />
      </n-gi>
    </n-grid>
    <n-flex class="controls" align="center" justify="space-between" :size="12" wrap>
      <n-text depth="3">{{ t('format-hint') }}</n-text>
      <n-button secondary @click="swapColors" data-testid="swap-button">
        <template #icon>
          <n-icon :component="ArrowSwap20Regular" />
        </template>
        {{ t('swap') }}
      </n-button>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('results-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-statistic :label="t('ratio-label')" :value="ratioLabel" data-testid="ratio-value" />
      <n-text v-if="!hasValidInputs" depth="3">{{ t('invalid-input') }}</n-text>
      <n-flex v-else wrap :size="8">
        <n-tag
          v-for="check in checks"
          :key="check.key"
          :type="check.pass ? 'success' : 'error'"
          :data-testid="`status-${check.key}`"
        >
          {{ check.label }}: {{ check.pass ? t('pass') : t('fail') }}
        </n-tag>
      </n-flex>
      <n-text depth="3">{{ t('alpha-note') }}</n-text>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('preview-title') }}</ToolSectionHeader>
  <ToolSection>
    <div class="preview" :style="previewStyle">
      <div class="preview-row">
        <div class="preview-label">{{ t('normal-text') }}</div>
        <div class="preview-text">{{ t('sample-text') }}</div>
      </div>
      <div class="preview-row">
        <div class="preview-label">{{ t('large-text') }}</div>
        <div class="preview-text preview-text-large">{{ t('sample-text') }}</div>
      </div>
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  NButton,
  NColorPicker,
  NFlex,
  NFormItem,
  NGi,
  NGrid,
  NIcon,
  NInput,
  NStatistic,
  NTag,
  NText,
} from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ArrowSwap20Regular from '@vicons/fluent/ArrowSwap20Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { contrastRatio, parseColor, rgbaToHex, toCssRgba, type RGBA } from '../utils/color'

const { t } = useI18n()

const swatches = [
  '#0F172AFF',
  '#111827FF',
  '#64748BFF',
  '#FFFFFFFF',
  '#EF4444FF',
  '#F97316FF',
  '#FACC15FF',
  '#22C55EFF',
  '#3B82F6FF',
  '#A855F7FF',
]

const defaultForeground: RGBA = { r: 17, g: 17, b: 17, a: 1 }
const defaultBackground: RGBA = { r: 255, g: 255, b: 255, a: 1 }

const foregroundInput = useStorage('tools:color-contrast-checker:foreground', '#111111')
const backgroundInput = useStorage('tools:color-contrast-checker:background', '#ffffff')

const foregroundParsed = computed(() => parseColor(foregroundInput.value))
const backgroundParsed = computed(() => parseColor(backgroundInput.value))

const lastForeground = ref<RGBA>(defaultForeground)
const lastBackground = ref<RGBA>(defaultBackground)

watch(
  foregroundParsed,
  (value) => {
    if (value) lastForeground.value = value
  },
  { immediate: true },
)

watch(
  backgroundParsed,
  (value) => {
    if (value) lastBackground.value = value
  },
  { immediate: true },
)

const foregroundHex = computed(() => rgbaToHex(lastForeground.value, lastForeground.value.a < 1))
const backgroundHex = computed(() => rgbaToHex(lastBackground.value, lastBackground.value.a < 1))

const foregroundFeedback = computed(() => {
  if (!foregroundInput.value.trim()) return undefined
  return foregroundParsed.value ? undefined : t('invalid-color')
})

const backgroundFeedback = computed(() => {
  if (!backgroundInput.value.trim()) return undefined
  return backgroundParsed.value ? undefined : t('invalid-color')
})

const foregroundStatus = computed(() => {
  if (!foregroundInput.value.trim()) return undefined
  return foregroundParsed.value ? 'success' : 'error'
})

const backgroundStatus = computed(() => {
  if (!backgroundInput.value.trim()) return undefined
  return backgroundParsed.value ? 'success' : 'error'
})

const hasValidInputs = computed(() => Boolean(foregroundParsed.value && backgroundParsed.value))

const ratio = computed(() => {
  if (!foregroundParsed.value || !backgroundParsed.value) return null
  return contrastRatio(foregroundParsed.value, backgroundParsed.value)
})

const ratioLabel = computed(() => (ratio.value === null ? '--' : `${ratio.value.toFixed(2)}:1`))

const checks = computed(() => {
  if (ratio.value === null) return []
  return [
    { key: 'aa-normal', label: t('aa-normal'), pass: ratio.value >= 4.5 },
    { key: 'aa-large', label: t('aa-large'), pass: ratio.value >= 3 },
    { key: 'aaa-normal', label: t('aaa-normal'), pass: ratio.value >= 7 },
    { key: 'aaa-large', label: t('aaa-large'), pass: ratio.value >= 4.5 },
  ]
})

const previewStyle = computed(() => ({
  backgroundColor: toCssRgba(lastBackground.value),
  color: toCssRgba(lastForeground.value),
}))

function updateForegroundFromPicker(value: string) {
  foregroundInput.value = value
}

function updateBackgroundFromPicker(value: string) {
  backgroundInput.value = value
}

function swapColors() {
  const nextForeground = backgroundInput.value
  backgroundInput.value = foregroundInput.value
  foregroundInput.value = nextForeground
}
</script>

<style scoped>
.controls {
  margin-top: 12px;
}

.preview {
  border: 1px solid var(--n-border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-label {
  font-size: 12px;
  opacity: 0.7;
}

.preview-text {
  font-size: 16px;
}

.preview-text-large {
  font-size: 24px;
  font-weight: 600;
}
</style>

<i18n lang="json">
{
  "en": {
    "colors-title": "Colors",
    "foreground-label": "Foreground",
    "background-label": "Background",
    "color-placeholder": "#112233 or rgb(17, 34, 51)",
    "format-hint": "Formats: HEX, RGB(A), HSL(A), CSS names",
    "swap": "Swap",
    "results-title": "Results",
    "ratio-label": "Contrast ratio",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (large)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (large)",
    "pass": "Pass",
    "fail": "Fail",
    "preview-title": "Preview",
    "normal-text": "Normal text",
    "large-text": "Large text",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Transparent colors are blended over white for contrast.",
    "invalid-input": "Enter valid colors to see results.",
    "invalid-color": "Invalid color format"
  },
  "zh": {
    "colors-title": "颜色",
    "foreground-label": "前景色",
    "background-label": "背景色",
    "color-placeholder": "#112233 或 rgb(17, 34, 51)",
    "format-hint": "支持格式：HEX、RGB(A)、HSL(A)、CSS 颜色名",
    "swap": "交换",
    "results-title": "结果",
    "ratio-label": "对比度",
    "aa-normal": "AA（普通）",
    "aa-large": "AA（大号）",
    "aaa-normal": "AAA（普通）",
    "aaa-large": "AAA（大号）",
    "pass": "通过",
    "fail": "未通过",
    "preview-title": "预览",
    "normal-text": "普通文本",
    "large-text": "大号文本",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "包含透明度的颜色会先与白色混合后计算对比度。",
    "invalid-input": "请输入有效颜色以查看结果。",
    "invalid-color": "颜色格式无效"
  },
  "zh-CN": {
    "colors-title": "颜色",
    "foreground-label": "前景色",
    "background-label": "背景色",
    "color-placeholder": "#112233 或 rgb(17, 34, 51)",
    "format-hint": "支持格式：HEX、RGB(A)、HSL(A)、CSS 颜色名",
    "swap": "交换",
    "results-title": "结果",
    "ratio-label": "对比度",
    "aa-normal": "AA（普通）",
    "aa-large": "AA（大号）",
    "aaa-normal": "AAA（普通）",
    "aaa-large": "AAA（大号）",
    "pass": "通过",
    "fail": "未通过",
    "preview-title": "预览",
    "normal-text": "普通文本",
    "large-text": "大号文本",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "包含透明度的颜色会先与白色混合后计算对比度。",
    "invalid-input": "请输入有效颜色以查看结果。",
    "invalid-color": "颜色格式无效"
  },
  "zh-TW": {
    "colors-title": "顏色",
    "foreground-label": "前景色",
    "background-label": "背景色",
    "color-placeholder": "#112233 或 rgb(17, 34, 51)",
    "format-hint": "支援格式：HEX、RGB(A)、HSL(A)、CSS 顏色名",
    "swap": "交換",
    "results-title": "結果",
    "ratio-label": "對比度",
    "aa-normal": "AA（一般）",
    "aa-large": "AA（大字體）",
    "aaa-normal": "AAA（一般）",
    "aaa-large": "AAA（大字體）",
    "pass": "通過",
    "fail": "未通過",
    "preview-title": "預覽",
    "normal-text": "一般文字",
    "large-text": "大字體文字",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "含透明度的顏色會先與白色混合後計算對比度。",
    "invalid-input": "請輸入有效顏色以查看結果。",
    "invalid-color": "顏色格式無效"
  },
  "zh-HK": {
    "colors-title": "顏色",
    "foreground-label": "前景色",
    "background-label": "背景色",
    "color-placeholder": "#112233 或 rgb(17, 34, 51)",
    "format-hint": "支援格式：HEX、RGB(A)、HSL(A)、CSS 顏色名",
    "swap": "交換",
    "results-title": "結果",
    "ratio-label": "對比度",
    "aa-normal": "AA（一般）",
    "aa-large": "AA（大字體）",
    "aaa-normal": "AAA（一般）",
    "aaa-large": "AAA（大字體）",
    "pass": "通過",
    "fail": "未通過",
    "preview-title": "預覽",
    "normal-text": "一般文字",
    "large-text": "大字體文字",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "含透明度的顏色會先與白色混合後計算對比度。",
    "invalid-input": "請輸入有效顏色以查看結果。",
    "invalid-color": "顏色格式無效"
  },
  "es": {
    "colors-title": "Colores",
    "foreground-label": "Primer plano",
    "background-label": "Fondo",
    "color-placeholder": "#112233 o rgb(17, 34, 51)",
    "format-hint": "Formatos: HEX, RGB(A), HSL(A), nombres CSS",
    "swap": "Intercambiar",
    "results-title": "Resultados",
    "ratio-label": "Relación de contraste",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (grande)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (grande)",
    "pass": "Aprobado",
    "fail": "No aprobado",
    "preview-title": "Vista previa",
    "normal-text": "Texto normal",
    "large-text": "Texto grande",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Los colores transparentes se mezclan con blanco para el contraste.",
    "invalid-input": "Introduce colores válidos para ver resultados.",
    "invalid-color": "Formato de color no válido"
  },
  "fr": {
    "colors-title": "Couleurs",
    "foreground-label": "Premier plan",
    "background-label": "Arrière-plan",
    "color-placeholder": "#112233 ou rgb(17, 34, 51)",
    "format-hint": "Formats : HEX, RGB(A), HSL(A), noms CSS",
    "swap": "Inverser",
    "results-title": "Résultats",
    "ratio-label": "Rapport de contraste",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (grand)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (grand)",
    "pass": "Réussi",
    "fail": "Échoué",
    "preview-title": "Aperçu",
    "normal-text": "Texte normal",
    "large-text": "Texte grand",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Les couleurs transparentes sont mélangées avec du blanc pour le contraste.",
    "invalid-input": "Saisissez des couleurs valides pour voir les résultats.",
    "invalid-color": "Format de couleur invalide"
  },
  "de": {
    "colors-title": "Farben",
    "foreground-label": "Vordergrund",
    "background-label": "Hintergrund",
    "color-placeholder": "#112233 oder rgb(17, 34, 51)",
    "format-hint": "Formate: HEX, RGB(A), HSL(A), CSS-Namen",
    "swap": "Tauschen",
    "results-title": "Ergebnisse",
    "ratio-label": "Kontrastverhältnis",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (groß)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (groß)",
    "pass": "Bestanden",
    "fail": "Nicht bestanden",
    "preview-title": "Vorschau",
    "normal-text": "Normaler Text",
    "large-text": "Großer Text",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Transparente Farben werden für den Kontrast über Weiß gemischt.",
    "invalid-input": "Gib gültige Farben ein, um Ergebnisse zu sehen.",
    "invalid-color": "Ungültiges Farbformat"
  },
  "it": {
    "colors-title": "Colori",
    "foreground-label": "Primo piano",
    "background-label": "Sfondo",
    "color-placeholder": "#112233 o rgb(17, 34, 51)",
    "format-hint": "Formati: HEX, RGB(A), HSL(A), nomi CSS",
    "swap": "Scambia",
    "results-title": "Risultati",
    "ratio-label": "Rapporto di contrasto",
    "aa-normal": "AA (normale)",
    "aa-large": "AA (grande)",
    "aaa-normal": "AAA (normale)",
    "aaa-large": "AAA (grande)",
    "pass": "Superato",
    "fail": "Non superato",
    "preview-title": "Anteprima",
    "normal-text": "Testo normale",
    "large-text": "Testo grande",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "I colori trasparenti vengono miscelati con il bianco per il contrasto.",
    "invalid-input": "Inserisci colori validi per vedere i risultati.",
    "invalid-color": "Formato colore non valido"
  },
  "ja": {
    "colors-title": "色",
    "foreground-label": "前景色",
    "background-label": "背景色",
    "color-placeholder": "#112233 または rgb(17, 34, 51)",
    "format-hint": "形式: HEX、RGB(A)、HSL(A)、CSS 名",
    "swap": "入れ替え",
    "results-title": "結果",
    "ratio-label": "コントラスト比",
    "aa-normal": "AA（通常）",
    "aa-large": "AA（大きい）",
    "aaa-normal": "AAA（通常）",
    "aaa-large": "AAA（大きい）",
    "pass": "合格",
    "fail": "不合格",
    "preview-title": "プレビュー",
    "normal-text": "通常テキスト",
    "large-text": "大きいテキスト",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "透明な色は白と合成してコントラストを計算します。",
    "invalid-input": "有効な色を入力すると結果が表示されます。",
    "invalid-color": "無効な色形式"
  },
  "ko": {
    "colors-title": "색상",
    "foreground-label": "전경",
    "background-label": "배경",
    "color-placeholder": "#112233 또는 rgb(17, 34, 51)",
    "format-hint": "형식: HEX, RGB(A), HSL(A), CSS 이름",
    "swap": "교체",
    "results-title": "결과",
    "ratio-label": "대비 비율",
    "aa-normal": "AA (일반)",
    "aa-large": "AA (큰 글자)",
    "aaa-normal": "AAA (일반)",
    "aaa-large": "AAA (큰 글자)",
    "pass": "통과",
    "fail": "실패",
    "preview-title": "미리보기",
    "normal-text": "일반 텍스트",
    "large-text": "큰 텍스트",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "투명 색상은 흰색과 합성해 대비를 계산합니다.",
    "invalid-input": "유효한 색상을 입력하면 결과가 표시됩니다.",
    "invalid-color": "유효하지 않은 색상 형식"
  },
  "ru": {
    "colors-title": "Цвета",
    "foreground-label": "Передний план",
    "background-label": "Фон",
    "color-placeholder": "#112233 или rgb(17, 34, 51)",
    "format-hint": "Форматы: HEX, RGB(A), HSL(A), имена CSS",
    "swap": "Поменять",
    "results-title": "Результаты",
    "ratio-label": "Контраст",
    "aa-normal": "AA (обычный)",
    "aa-large": "AA (крупный)",
    "aaa-normal": "AAA (обычный)",
    "aaa-large": "AAA (крупный)",
    "pass": "Пройдено",
    "fail": "Не пройдено",
    "preview-title": "Предпросмотр",
    "normal-text": "Обычный текст",
    "large-text": "Крупный текст",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Прозрачные цвета смешиваются с белым для контраста.",
    "invalid-input": "Введите корректные цвета, чтобы увидеть результаты.",
    "invalid-color": "Неверный формат цвета"
  },
  "pt": {
    "colors-title": "Cores",
    "foreground-label": "Primeiro plano",
    "background-label": "Fundo",
    "color-placeholder": "#112233 ou rgb(17, 34, 51)",
    "format-hint": "Formatos: HEX, RGB(A), HSL(A), nomes CSS",
    "swap": "Trocar",
    "results-title": "Resultados",
    "ratio-label": "Razão de contraste",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (grande)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (grande)",
    "pass": "Aprovado",
    "fail": "Reprovado",
    "preview-title": "Prévia",
    "normal-text": "Texto normal",
    "large-text": "Texto grande",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Cores transparentes são mescladas com branco para o contraste.",
    "invalid-input": "Digite cores válidas para ver os resultados.",
    "invalid-color": "Formato de cor inválido"
  },
  "ar": {
    "colors-title": "الألوان",
    "foreground-label": "المقدمة",
    "background-label": "الخلفية",
    "color-placeholder": "#112233 أو rgb(17, 34, 51)",
    "format-hint": "الصيغ: HEX و RGB(A) و HSL(A) وأسماء CSS",
    "swap": "تبديل",
    "results-title": "النتائج",
    "ratio-label": "نسبة التباين",
    "aa-normal": "AA (عادي)",
    "aa-large": "AA (كبير)",
    "aaa-normal": "AAA (عادي)",
    "aaa-large": "AAA (كبير)",
    "pass": "ناجح",
    "fail": "غير ناجح",
    "preview-title": "معاينة",
    "normal-text": "نص عادي",
    "large-text": "نص كبير",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "يتم مزج الألوان الشفافة مع الأبيض لحساب التباين.",
    "invalid-input": "أدخل ألوانًا صالحة لعرض النتائج.",
    "invalid-color": "تنسيق لون غير صالح"
  },
  "hi": {
    "colors-title": "रंग",
    "foreground-label": "फोरग्राउंड",
    "background-label": "बैकग्राउंड",
    "color-placeholder": "#112233 या rgb(17, 34, 51)",
    "format-hint": "फॉर्मेट: HEX, RGB(A), HSL(A), CSS नाम",
    "swap": "बदलें",
    "results-title": "परिणाम",
    "ratio-label": "कंट्रास्ट अनुपात",
    "aa-normal": "AA (सामान्य)",
    "aa-large": "AA (बड़ा)",
    "aaa-normal": "AAA (सामान्य)",
    "aaa-large": "AAA (बड़ा)",
    "pass": "पास",
    "fail": "फेल",
    "preview-title": "पूर्वावलोकन",
    "normal-text": "सामान्य टेक्स्ट",
    "large-text": "बड़ा टेक्स्ट",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "पारदर्शी रंगों को कंट्रास्ट के लिए सफेद पर मिलाया जाता है।",
    "invalid-input": "परिणाम देखने के लिए मान्य रंग दर्ज करें।",
    "invalid-color": "अमान्य रंग प्रारूप"
  },
  "tr": {
    "colors-title": "Renkler",
    "foreground-label": "Ön plan",
    "background-label": "Arka plan",
    "color-placeholder": "#112233 veya rgb(17, 34, 51)",
    "format-hint": "Biçimler: HEX, RGB(A), HSL(A), CSS adları",
    "swap": "Değiştir",
    "results-title": "Sonuçlar",
    "ratio-label": "Kontrast oranı",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (büyük)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (büyük)",
    "pass": "Geçti",
    "fail": "Geçmedi",
    "preview-title": "Önizleme",
    "normal-text": "Normal metin",
    "large-text": "Büyük metin",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Saydam renkler kontrast için beyazla karıştırılır.",
    "invalid-input": "Sonuçları görmek için geçerli renkler girin.",
    "invalid-color": "Geçersiz renk biçimi"
  },
  "nl": {
    "colors-title": "Kleuren",
    "foreground-label": "Voorgrond",
    "background-label": "Achtergrond",
    "color-placeholder": "#112233 of rgb(17, 34, 51)",
    "format-hint": "Indelingen: HEX, RGB(A), HSL(A), CSS-namen",
    "swap": "Wisselen",
    "results-title": "Resultaten",
    "ratio-label": "Contrastverhouding",
    "aa-normal": "AA (normaal)",
    "aa-large": "AA (groot)",
    "aaa-normal": "AAA (normaal)",
    "aaa-large": "AAA (groot)",
    "pass": "Geslaagd",
    "fail": "Niet geslaagd",
    "preview-title": "Voorbeeld",
    "normal-text": "Normale tekst",
    "large-text": "Grote tekst",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Transparante kleuren worden voor contrast met wit gemengd.",
    "invalid-input": "Voer geldige kleuren in om resultaten te zien.",
    "invalid-color": "Ongeldig kleurformaat"
  },
  "sv": {
    "colors-title": "Färger",
    "foreground-label": "Förgrund",
    "background-label": "Bakgrund",
    "color-placeholder": "#112233 eller rgb(17, 34, 51)",
    "format-hint": "Format: HEX, RGB(A), HSL(A), CSS-namn",
    "swap": "Byt",
    "results-title": "Resultat",
    "ratio-label": "Kontrastförhållande",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (stor)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (stor)",
    "pass": "Godkänd",
    "fail": "Underkänd",
    "preview-title": "Förhandsgranskning",
    "normal-text": "Normal text",
    "large-text": "Stor text",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Transparenta färger blandas med vitt för kontrast.",
    "invalid-input": "Ange giltiga färger för att se resultat.",
    "invalid-color": "Ogiltigt färgformat"
  },
  "pl": {
    "colors-title": "Kolory",
    "foreground-label": "Pierwszy plan",
    "background-label": "Tło",
    "color-placeholder": "#112233 lub rgb(17, 34, 51)",
    "format-hint": "Formaty: HEX, RGB(A), HSL(A), nazwy CSS",
    "swap": "Zamień",
    "results-title": "Wyniki",
    "ratio-label": "Współczynnik kontrastu",
    "aa-normal": "AA (normalny)",
    "aa-large": "AA (duży)",
    "aaa-normal": "AAA (normalny)",
    "aaa-large": "AAA (duży)",
    "pass": "Zaliczony",
    "fail": "Nie zaliczony",
    "preview-title": "Podgląd",
    "normal-text": "Tekst normalny",
    "large-text": "Tekst duży",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Przezroczyste kolory są mieszane z bielą dla kontrastu.",
    "invalid-input": "Wprowadź poprawne kolory, aby zobaczyć wyniki.",
    "invalid-color": "Nieprawidłowy format koloru"
  },
  "vi": {
    "colors-title": "Màu sắc",
    "foreground-label": "Tiền cảnh",
    "background-label": "Nền",
    "color-placeholder": "#112233 hoặc rgb(17, 34, 51)",
    "format-hint": "Định dạng: HEX, RGB(A), HSL(A), tên CSS",
    "swap": "Hoán đổi",
    "results-title": "Kết quả",
    "ratio-label": "Tỷ lệ tương phản",
    "aa-normal": "AA (thường)",
    "aa-large": "AA (lớn)",
    "aaa-normal": "AAA (thường)",
    "aaa-large": "AAA (lớn)",
    "pass": "Đạt",
    "fail": "Không đạt",
    "preview-title": "Xem trước",
    "normal-text": "Chữ thường",
    "large-text": "Chữ lớn",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Màu trong suốt được trộn với trắng để tính tương phản.",
    "invalid-input": "Nhập màu hợp lệ để xem kết quả.",
    "invalid-color": "Định dạng màu không hợp lệ"
  },
  "th": {
    "colors-title": "สี",
    "foreground-label": "ด้านหน้า",
    "background-label": "พื้นหลัง",
    "color-placeholder": "#112233 หรือ rgb(17, 34, 51)",
    "format-hint": "รูปแบบ: HEX, RGB(A), HSL(A), ชื่อสี CSS",
    "swap": "สลับ",
    "results-title": "ผลลัพธ์",
    "ratio-label": "อัตราส่วนความต่างสี",
    "aa-normal": "AA (ปกติ)",
    "aa-large": "AA (ใหญ่)",
    "aaa-normal": "AAA (ปกติ)",
    "aaa-large": "AAA (ใหญ่)",
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน",
    "preview-title": "ตัวอย่าง",
    "normal-text": "ข้อความปกติ",
    "large-text": "ข้อความขนาดใหญ่",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "สีที่โปร่งใสจะถูกผสมกับสีขาวเพื่อคำนวณความต่างสี",
    "invalid-input": "กรอกสีที่ถูกต้องเพื่อดูผลลัพธ์",
    "invalid-color": "รูปแบบสีไม่ถูกต้อง"
  },
  "id": {
    "colors-title": "Warna",
    "foreground-label": "Latar depan",
    "background-label": "Latar belakang",
    "color-placeholder": "#112233 atau rgb(17, 34, 51)",
    "format-hint": "Format: HEX, RGB(A), HSL(A), nama CSS",
    "swap": "Tukar",
    "results-title": "Hasil",
    "ratio-label": "Rasio kontras",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (besar)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (besar)",
    "pass": "Lulus",
    "fail": "Tidak lulus",
    "preview-title": "Pratinjau",
    "normal-text": "Teks normal",
    "large-text": "Teks besar",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Warna transparan dicampur dengan putih untuk kontras.",
    "invalid-input": "Masukkan warna valid untuk melihat hasil.",
    "invalid-color": "Format warna tidak valid"
  },
  "he": {
    "colors-title": "צבעים",
    "foreground-label": "קדמי",
    "background-label": "רקע",
    "color-placeholder": "#112233 או rgb(17, 34, 51)",
    "format-hint": "פורמטים: HEX, RGB(A), HSL(A), שמות CSS",
    "swap": "החלפה",
    "results-title": "תוצאות",
    "ratio-label": "יחס ניגודיות",
    "aa-normal": "AA (רגיל)",
    "aa-large": "AA (גדול)",
    "aaa-normal": "AAA (רגיל)",
    "aaa-large": "AAA (גדול)",
    "pass": "עבר",
    "fail": "נכשל",
    "preview-title": "תצוגה מקדימה",
    "normal-text": "טקסט רגיל",
    "large-text": "טקסט גדול",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "צבעים שקופים מתמזגים עם לבן לצורך הניגודיות.",
    "invalid-input": "הזן צבעים תקינים כדי לראות תוצאות.",
    "invalid-color": "פורמט צבע לא תקין"
  },
  "ms": {
    "colors-title": "Warna",
    "foreground-label": "Hadapan",
    "background-label": "Latar",
    "color-placeholder": "#112233 atau rgb(17, 34, 51)",
    "format-hint": "Format: HEX, RGB(A), HSL(A), nama CSS",
    "swap": "Tukar",
    "results-title": "Keputusan",
    "ratio-label": "Nisbah kontras",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (besar)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (besar)",
    "pass": "Lulus",
    "fail": "Gagal",
    "preview-title": "Pratonton",
    "normal-text": "Teks biasa",
    "large-text": "Teks besar",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Warna lutsinar dicampur dengan putih untuk kontras.",
    "invalid-input": "Masukkan warna yang sah untuk melihat keputusan.",
    "invalid-color": "Format warna tidak sah"
  },
  "no": {
    "colors-title": "Farger",
    "foreground-label": "Forgrunn",
    "background-label": "Bakgrunn",
    "color-placeholder": "#112233 eller rgb(17, 34, 51)",
    "format-hint": "Formater: HEX, RGB(A), HSL(A), CSS-navn",
    "swap": "Bytt",
    "results-title": "Resultater",
    "ratio-label": "Kontrastforhold",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (stor)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (stor)",
    "pass": "Bestått",
    "fail": "Ikke bestått",
    "preview-title": "Forhåndsvisning",
    "normal-text": "Normal tekst",
    "large-text": "Stor tekst",
    "sample-text": "Aa Bb Cc 123",
    "alpha-note": "Gjennomsiktige farger blandes med hvitt for kontrast.",
    "invalid-input": "Skriv inn gyldige farger for å se resultater.",
    "invalid-color": "Ugyldig fargeformat"
  }
}
</i18n>
