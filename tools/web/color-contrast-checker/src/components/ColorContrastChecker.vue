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

  <ToolSectionHeader>{{ t('what-is-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-text>{{ t('what-is-definition') }}</n-text>
      <n-text>{{ t('what-is-method') }}</n-text>
      <div class="what-is-thresholds">
        <div class="what-is-subtitle">{{ t('what-is-thresholds-title') }}</div>
        <ul class="what-is-list">
          <li>{{ t('what-is-thresholds-aa') }}</li>
          <li>{{ t('what-is-thresholds-aaa') }}</li>
          <li>{{ t('what-is-thresholds-large') }}</li>
          <li>{{ t('what-is-thresholds-ui') }}</li>
        </ul>
      </div>
      <n-text depth="3">{{ t('what-is-tip') }}</n-text>
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

.what-is-subtitle {
  font-size: 13px;
  font-weight: 600;
}

.what-is-list {
  margin: 6px 0 0;
  padding-left: 18px;
}

.what-is-list li {
  margin: 4px 0;
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
    "what-is-title": "What is color contrast?",
    "what-is-definition": "Contrast ratio measures the difference in luminance between text (foreground) and its background on a scale from 1:1 (no contrast) to 21:1 (black on white).",
    "what-is-method": "This tool converts colors to sRGB, blends transparency before comparing colors, and uses the WCAG relative luminance formula.",
    "what-is-thresholds-title": "WCAG thresholds",
    "what-is-thresholds-aa": "AA: 4.5:1 for normal text, 3:1 for large text.",
    "what-is-thresholds-aaa": "AAA: 7:1 for normal text, 4.5:1 for large text.",
    "what-is-thresholds-large": "Large text is 18pt+ regular or 14pt+ bold.",
    "what-is-thresholds-ui": "UI components, icons, and graphical objects should aim for at least 3:1.",
    "what-is-tip": "Higher ratios improve readability, especially for thin fonts or small sizes.",
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
    "what-is-title": "什么是颜色对比度？",
    "what-is-definition": "对比度比值衡量文本（前景）与背景之间的亮度差异，范围从 1:1（无对比）到 21:1（黑字白底）。",
    "what-is-method": "本工具会将颜色转换为 sRGB，先处理透明度混合，再按 WCAG 相对亮度公式计算。",
    "what-is-thresholds-title": "WCAG 阈值",
    "what-is-thresholds-aa": "AA：普通文本 4.5:1，大号文本 3:1。",
    "what-is-thresholds-aaa": "AAA：普通文本 7:1，大号文本 4.5:1。",
    "what-is-thresholds-large": "大号文本指 18pt+ 常规或 14pt+ 加粗。",
    "what-is-thresholds-ui": "UI 组件、图标和图形对象建议至少 3:1。",
    "what-is-tip": "更高的对比度更易读，尤其是细字重或小字号。",
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
    "what-is-title": "什么是颜色对比度？",
    "what-is-definition": "对比度比值衡量文本（前景）与背景之间的亮度差异，范围从 1:1（无对比）到 21:1（黑字白底）。",
    "what-is-method": "本工具会将颜色转换为 sRGB，先处理透明度混合，再按 WCAG 相对亮度公式计算。",
    "what-is-thresholds-title": "WCAG 阈值",
    "what-is-thresholds-aa": "AA：普通文本 4.5:1，大号文本 3:1。",
    "what-is-thresholds-aaa": "AAA：普通文本 7:1，大号文本 4.5:1。",
    "what-is-thresholds-large": "大号文本指 18pt+ 常规或 14pt+ 加粗。",
    "what-is-thresholds-ui": "UI 组件、图标和图形对象建议至少 3:1。",
    "what-is-tip": "更高的对比度更易读，尤其是细字重或小字号。",
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
    "what-is-title": "什麼是顏色對比度？",
    "what-is-definition": "對比度比值衡量文字（前景）與背景之間的亮度差異，範圍從 1:1（無對比）到 21:1（黑字白底）。",
    "what-is-method": "本工具會將顏色轉換為 sRGB，先處理透明度混合，再依 WCAG 相對亮度公式計算。",
    "what-is-thresholds-title": "WCAG 閾值",
    "what-is-thresholds-aa": "AA：一般文字 4.5:1，大字體 3:1。",
    "what-is-thresholds-aaa": "AAA：一般文字 7:1，大字體 4.5:1。",
    "what-is-thresholds-large": "大字體指 18pt+ 一般或 14pt+ 粗體。",
    "what-is-thresholds-ui": "UI 元件、圖示與圖形物件建議至少 3:1。",
    "what-is-tip": "較高的對比度更易讀，特別是細字重或小字體。",
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
    "what-is-title": "什麼是顏色對比度？",
    "what-is-definition": "對比度比值衡量文字（前景）與背景之間的亮度差異，範圍從 1:1（無對比）到 21:1（黑字白底）。",
    "what-is-method": "本工具會將顏色轉換為 sRGB，先處理透明度混合，再依 WCAG 相對亮度公式計算。",
    "what-is-thresholds-title": "WCAG 閾值",
    "what-is-thresholds-aa": "AA：一般文字 4.5:1，大字體 3:1。",
    "what-is-thresholds-aaa": "AAA：一般文字 7:1，大字體 4.5:1。",
    "what-is-thresholds-large": "大字體指 18pt+ 一般或 14pt+ 粗體。",
    "what-is-thresholds-ui": "UI 元件、圖示與圖形物件建議至少 3:1。",
    "what-is-tip": "較高的對比度更易讀，特別是細字重或小字體。",
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
    "what-is-title": "¿Qué es el contraste de color?",
    "what-is-definition": "La relación de contraste mide la diferencia de luminancia entre el texto (primer plano) y el fondo en una escala de 1:1 (sin contraste) a 21:1 (negro sobre blanco).",
    "what-is-method": "Esta herramienta convierte los colores a sRGB, mezcla la transparencia antes de comparar y usa la fórmula de luminancia relativa de la WCAG.",
    "what-is-thresholds-title": "Umbrales WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 para texto normal, 3:1 para texto grande.",
    "what-is-thresholds-aaa": "AAA: 7:1 para texto normal, 4.5:1 para texto grande.",
    "what-is-thresholds-large": "Texto grande es 18pt+ regular o 14pt+ en negrita.",
    "what-is-thresholds-ui": "Componentes de UI, iconos y gráficos deberían aspirar al menos a 3:1.",
    "what-is-tip": "Ratios más altos mejoran la legibilidad, especialmente con tipografías finas o tamaños pequeños.",
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
    "what-is-title": "Qu'est-ce que le contraste de couleur ?",
    "what-is-definition": "Le ratio de contraste mesure la différence de luminance entre le texte (premier plan) et le fond sur une échelle de 1:1 (aucun contraste) à 21:1 (noir sur blanc).",
    "what-is-method": "Cet outil convertit les couleurs en sRGB, compose la transparence avant la comparaison et utilise la formule de luminance relative WCAG.",
    "what-is-thresholds-title": "Seuils WCAG",
    "what-is-thresholds-aa": "AA : 4.5:1 pour le texte normal, 3:1 pour le texte large.",
    "what-is-thresholds-aaa": "AAA : 7:1 pour le texte normal, 4.5:1 pour le texte large.",
    "what-is-thresholds-large": "Le texte large correspond à 18pt+ normal ou 14pt+ gras.",
    "what-is-thresholds-ui": "Les composants d'UI, icônes et éléments graphiques devraient viser au moins 3:1.",
    "what-is-tip": "Des ratios plus élevés améliorent la lisibilité, surtout pour les polices fines ou les petites tailles.",
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
    "what-is-title": "Was ist Farbkontrast?",
    "what-is-definition": "Das Kontrastverhältnis misst den Luminanzunterschied zwischen Text (Vordergrund) und Hintergrund auf einer Skala von 1:1 (kein Kontrast) bis 21:1 (Schwarz auf Weiß).",
    "what-is-method": "Dieses Tool konvertiert Farben in sRGB, mischt Transparenz vor dem Vergleich und verwendet die WCAG-Formel für relative Luminanz.",
    "what-is-thresholds-title": "WCAG-Grenzwerte",
    "what-is-thresholds-aa": "AA: 4.5:1 für normalen Text, 3:1 für großen Text.",
    "what-is-thresholds-aaa": "AAA: 7:1 für normalen Text, 4.5:1 für großen Text.",
    "what-is-thresholds-large": "Großer Text bedeutet 18pt+ normal oder 14pt+ fett.",
    "what-is-thresholds-ui": "UI-Komponenten, Icons und grafische Elemente sollten mindestens 3:1 erreichen.",
    "what-is-tip": "Höhere Verhältnisse verbessern die Lesbarkeit, besonders bei dünnen Schriftarten oder kleinen Größen.",
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
    "what-is-title": "Che cos'è il contrasto di colore?",
    "what-is-definition": "Il rapporto di contrasto misura la differenza di luminanza tra il testo (primo piano) e lo sfondo su una scala da 1:1 (nessun contrasto) a 21:1 (nero su bianco).",
    "what-is-method": "Questo strumento converte i colori in sRGB, fonde la trasparenza prima del confronto e usa la formula di luminanza relativa WCAG.",
    "what-is-thresholds-title": "Soglie WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 per testo normale, 3:1 per testo grande.",
    "what-is-thresholds-aaa": "AAA: 7:1 per testo normale, 4.5:1 per testo grande.",
    "what-is-thresholds-large": "Testo grande: 18pt+ normale o 14pt+ in grassetto.",
    "what-is-thresholds-ui": "Componenti UI, icone e grafica dovrebbero puntare ad almeno 3:1.",
    "what-is-tip": "Rapporti più alti migliorano la leggibilità, soprattutto con font sottili o dimensioni piccole.",
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
    "what-is-title": "色のコントラストとは？",
    "what-is-definition": "コントラスト比は、文字（前景）と背景の輝度差を 1:1（差なし）〜 21:1（黒と白）で表します。",
    "what-is-method": "このツールは色を sRGB に変換し、透明度を合成してから WCAG の相対輝度式で計算します。",
    "what-is-thresholds-title": "WCAG の基準",
    "what-is-thresholds-aa": "AA：通常文字は 4.5:1、大きな文字は 3:1。",
    "what-is-thresholds-aaa": "AAA：通常文字は 7:1、大きな文字は 4.5:1。",
    "what-is-thresholds-large": "大きな文字は 18pt 以上、または 14pt 以上の太字。",
    "what-is-thresholds-ui": "UI コンポーネント、アイコン、図形は少なくとも 3:1 を推奨。",
    "what-is-tip": "高い比率ほど読みやすく、細いフォントや小さなサイズで特に有効です。",
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
    "what-is-title": "색상 대비란?",
    "what-is-definition": "대비 비율은 텍스트(전경)와 배경의 휘도 차이를 1:1(대비 없음)부터 21:1(흰 배경의 검정)까지로 표현합니다.",
    "what-is-method": "이 도구는 색상을 sRGB로 변환하고 투명도를 합성한 뒤 WCAG 상대 휘도 공식을 사용합니다.",
    "what-is-thresholds-title": "WCAG 기준",
    "what-is-thresholds-aa": "AA: 일반 텍스트 4.5:1, 큰 텍스트 3:1.",
    "what-is-thresholds-aaa": "AAA: 일반 텍스트 7:1, 큰 텍스트 4.5:1.",
    "what-is-thresholds-large": "큰 텍스트는 18pt 이상 또는 14pt 이상 굵게.",
    "what-is-thresholds-ui": "UI 구성요소, 아이콘, 그래픽은 최소 3:1을 권장합니다.",
    "what-is-tip": "비율이 높을수록 읽기 쉽고, 얇은 글꼴이나 작은 크기에서 특히 효과적입니다.",
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
    "what-is-title": "Что такое цветовой контраст?",
    "what-is-definition": "Контрастное соотношение измеряет разницу яркости между текстом (передний план) и фоном по шкале от 1:1 (нет контраста) до 21:1 (черный на белом).",
    "what-is-method": "Этот инструмент преобразует цвета в sRGB, смешивает прозрачность перед сравнением и использует формулу относительной яркости WCAG.",
    "what-is-thresholds-title": "Пороги WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 для обычного текста, 3:1 для крупного текста.",
    "what-is-thresholds-aaa": "AAA: 7:1 для обычного текста, 4.5:1 для крупного текста.",
    "what-is-thresholds-large": "Крупный текст - это 18pt+ обычный или 14pt+ жирный.",
    "what-is-thresholds-ui": "Элементы UI, иконки и графика должны стремиться минимум к 3:1.",
    "what-is-tip": "Более высокие значения улучшают читаемость, особенно при тонких шрифтах или малых размерах.",
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
    "what-is-title": "O que é contraste de cor?",
    "what-is-definition": "A razão de contraste mede a diferença de luminância entre o texto (primeiro plano) e o fundo numa escala de 1:1 (sem contraste) a 21:1 (preto no branco).",
    "what-is-method": "Esta ferramenta converte as cores para sRGB, mistura a transparência antes de comparar e usa a fórmula de luminância relativa da WCAG.",
    "what-is-thresholds-title": "Limiares WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 para texto normal, 3:1 para texto grande.",
    "what-is-thresholds-aaa": "AAA: 7:1 para texto normal, 4.5:1 para texto grande.",
    "what-is-thresholds-large": "Texto grande é 18pt+ normal ou 14pt+ em negrito.",
    "what-is-thresholds-ui": "Componentes de UI, ícones e gráficos devem visar pelo menos 3:1.",
    "what-is-tip": "Rácios mais altos melhoram a legibilidade, especialmente com fontes finas ou tamanhos pequenos.",
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
    "what-is-title": "ما هو تباين الألوان؟",
    "what-is-definition": "تقيس نسبة التباين الفرق في الإضاءة بين النص (المقدمة) والخلفية على مقياس من 1:1 (بدون تباين) إلى 21:1 (أسود على أبيض).",
    "what-is-method": "تحوّل هذه الأداة الألوان إلى sRGB وتمزج الشفافية قبل المقارنة وتستخدم معادلة اللمعان النسبي وفق WCAG.",
    "what-is-thresholds-title": "عتبات WCAG",
    "what-is-thresholds-aa": "AA:‏ 4.5:1 للنص العادي، و3:1 للنص الكبير.",
    "what-is-thresholds-aaa": "AAA:‏ 7:1 للنص العادي، و4.5:1 للنص الكبير.",
    "what-is-thresholds-large": "النص الكبير هو 18pt+ عادي أو 14pt+ عريض.",
    "what-is-thresholds-ui": "عناصر واجهة المستخدم والأيقونات والعناصر الرسومية يُفضّل ألا تقل عن 3:1.",
    "what-is-tip": "النِّسَب الأعلى تحسّن القراءة، خاصة مع الخطوط الرفيعة أو الأحجام الصغيرة.",
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
    "what-is-title": "रंग कंट्रास्ट क्या है?",
    "what-is-definition": "कंट्रास्ट अनुपात टेक्स्ट (फोरग्राउंड) और बैकग्राउंड के बीच चमक के अंतर को 1:1 (कोई कंट्रास्ट नहीं) से 21:1 (काला-सफेद) तक मापता है।",
    "what-is-method": "यह टूल रंगों को sRGB में बदलता है, तुलना से पहले पारदर्शिता मिलाता है और WCAG का रिलेटिव ल्यूमिनेंस फॉर्मूला उपयोग करता है।",
    "what-is-thresholds-title": "WCAG सीमाएँ",
    "what-is-thresholds-aa": "AA: सामान्य टेक्स्ट 4.5:1, बड़े टेक्स्ट 3:1.",
    "what-is-thresholds-aaa": "AAA: सामान्य टेक्स्ट 7:1, बड़े टेक्स्ट 4.5:1.",
    "what-is-thresholds-large": "बड़ा टेक्स्ट 18pt+ सामान्य या 14pt+ बोल्ड है।",
    "what-is-thresholds-ui": "UI घटक, आइकन और ग्राफिक्स को कम से कम 3:1 लक्ष्य रखना चाहिए।",
    "what-is-tip": "उच्च अनुपात पठनीयता बढ़ाते हैं, खासकर पतले फॉन्ट या छोटे आकार में।",
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
    "what-is-title": "Renk kontrastı nedir?",
    "what-is-definition": "Kontrast oranı, metin (ön plan) ile arka plan arasındaki parlaklık farkını 1:1 (kontrast yok) ile 21:1 (siyah üzerinde beyaz) arasında ölçer.",
    "what-is-method": "Bu araç renkleri sRGB'ye dönüştürür, karşılaştırmadan önce şeffaflığı harmanlar ve WCAG göreli parlaklık formülünü kullanır.",
    "what-is-thresholds-title": "WCAG eşikleri",
    "what-is-thresholds-aa": "AA: normal metin 4.5:1, büyük metin 3:1.",
    "what-is-thresholds-aaa": "AAA: normal metin 7:1, büyük metin 4.5:1.",
    "what-is-thresholds-large": "Büyük metin 18pt+ normal veya 14pt+ kalındır.",
    "what-is-thresholds-ui": "UI bileşenleri, simgeler ve grafikler en az 3:1 hedeflemelidir.",
    "what-is-tip": "Daha yüksek oranlar okunabilirliği artırır, özellikle ince yazı tiplerinde veya küçük boyutlarda.",
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
    "what-is-title": "Wat is kleurcontrast?",
    "what-is-definition": "De contrastverhouding meet het luminantieverschil tussen tekst (voorgrond) en achtergrond op een schaal van 1:1 (geen contrast) tot 21:1 (zwart op wit).",
    "what-is-method": "Deze tool zet kleuren om naar sRGB, mengt transparantie vóór de vergelijking en gebruikt de WCAG-formule voor relatieve luminantie.",
    "what-is-thresholds-title": "WCAG-drempels",
    "what-is-thresholds-aa": "AA: 4.5:1 voor normale tekst, 3:1 voor grote tekst.",
    "what-is-thresholds-aaa": "AAA: 7:1 voor normale tekst, 4.5:1 voor grote tekst.",
    "what-is-thresholds-large": "Grote tekst is 18pt+ normaal of 14pt+ vet.",
    "what-is-thresholds-ui": "UI-componenten, pictogrammen en grafische elementen moeten minimaal 3:1 nastreven.",
    "what-is-tip": "Hogere verhoudingen verbeteren de leesbaarheid, vooral bij dunne lettertypes of kleine formaten.",
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
    "what-is-title": "Vad är färgkontrast?",
    "what-is-definition": "Kontrastförhållandet mäter luminansskillnaden mellan text (förgrund) och bakgrund på en skala från 1:1 (ingen kontrast) till 21:1 (svart på vitt).",
    "what-is-method": "Det här verktyget konverterar färger till sRGB, blandar transparens innan jämförelse och använder WCAG:s relativa luminansformel.",
    "what-is-thresholds-title": "WCAG-gränser",
    "what-is-thresholds-aa": "AA: 4.5:1 för normal text, 3:1 för stor text.",
    "what-is-thresholds-aaa": "AAA: 7:1 för normal text, 4.5:1 för stor text.",
    "what-is-thresholds-large": "Stor text är 18pt+ normal eller 14pt+ fet.",
    "what-is-thresholds-ui": "UI-komponenter, ikoner och grafik bör sikta på minst 3:1.",
    "what-is-tip": "Högre värden förbättrar läsbarheten, särskilt med tunna typsnitt eller små storlekar.",
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
    "what-is-title": "Czym jest kontrast kolorów?",
    "what-is-definition": "Współczynnik kontrastu mierzy różnicę luminancji między tekstem (pierwszy plan) a tłem w skali od 1:1 (brak kontrastu) do 21:1 (czerń na bieli).",
    "what-is-method": "To narzędzie konwertuje kolory do sRGB, miesza przezroczystość przed porównaniem i używa wzoru względnej luminancji WCAG.",
    "what-is-thresholds-title": "Progi WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 dla zwykłego tekstu, 3:1 dla dużego tekstu.",
    "what-is-thresholds-aaa": "AAA: 7:1 dla zwykłego tekstu, 4.5:1 dla dużego tekstu.",
    "what-is-thresholds-large": "Duży tekst to 18pt+ zwykły lub 14pt+ pogrubiony.",
    "what-is-thresholds-ui": "Elementy UI, ikony i grafika powinny dążyć do co najmniej 3:1.",
    "what-is-tip": "Wyższe wartości poprawiają czytelność, szczególnie przy cienkich fontach lub małych rozmiarach.",
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
    "what-is-title": "Độ tương phản màu là gì?",
    "what-is-definition": "Tỷ lệ tương phản đo sự chênh lệch độ chói giữa chữ (tiền cảnh) và nền trên thang từ 1:1 (không tương phản) đến 21:1 (đen trên trắng).",
    "what-is-method": "Công cụ này chuyển màu sang sRGB, trộn độ trong suốt trước khi so sánh và dùng công thức độ chói tương đối theo WCAG.",
    "what-is-thresholds-title": "Ngưỡng WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 cho chữ thường, 3:1 cho chữ lớn.",
    "what-is-thresholds-aaa": "AAA: 7:1 cho chữ thường, 4.5:1 cho chữ lớn.",
    "what-is-thresholds-large": "Chữ lớn là 18pt+ thường hoặc 14pt+ đậm.",
    "what-is-thresholds-ui": "Thành phần UI, biểu tượng và đồ họa nên đạt ít nhất 3:1.",
    "what-is-tip": "Tỷ lệ cao hơn giúp dễ đọc hơn, nhất là với font mảnh hoặc cỡ nhỏ.",
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
    "what-is-title": "ความเปรียบต่างของสีคืออะไร?",
    "what-is-definition": "อัตราส่วนความเปรียบต่างวัดความแตกต่างของความสว่างระหว่างข้อความ (พื้นหน้า) กับพื้นหลัง ในช่วง 1:1 (ไม่มีความเปรียบต่าง) ถึง 21:1 (ดำบนขาว).",
    "what-is-method": "เครื่องมือนี้แปลงสีเป็น sRGB ผสมความโปร่งใสก่อนเปรียบเทียบ และใช้สูตรความสว่างสัมพัทธ์ของ WCAG.",
    "what-is-thresholds-title": "เกณฑ์ WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 สำหรับข้อความปกติ, 3:1 สำหรับข้อความขนาดใหญ่.",
    "what-is-thresholds-aaa": "AAA: 7:1 สำหรับข้อความปกติ, 4.5:1 สำหรับข้อความขนาดใหญ่.",
    "what-is-thresholds-large": "ข้อความขนาดใหญ่คือ 18pt+ ปกติ หรือ 14pt+ ตัวหนา.",
    "what-is-thresholds-ui": "องค์ประกอบ UI ไอคอน และกราฟิกควรมีอย่างน้อย 3:1.",
    "what-is-tip": "อัตราที่สูงขึ้นช่วยให้อ่านง่ายขึ้น โดยเฉพาะกับฟอนต์บางหรือขนาดเล็ก.",
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
    "what-is-title": "Apa itu kontras warna?",
    "what-is-definition": "Rasio kontras mengukur perbedaan luminansi antara teks (foreground) dan latar pada skala 1:1 (tanpa kontras) hingga 21:1 (hitam di atas putih).",
    "what-is-method": "Alat ini mengonversi warna ke sRGB, mencampur transparansi sebelum membandingkan, dan menggunakan rumus luminansi relatif WCAG.",
    "what-is-thresholds-title": "Ambang WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 untuk teks normal, 3:1 untuk teks besar.",
    "what-is-thresholds-aaa": "AAA: 7:1 untuk teks normal, 4.5:1 untuk teks besar.",
    "what-is-thresholds-large": "Teks besar adalah 18pt+ normal atau 14pt+ tebal.",
    "what-is-thresholds-ui": "Komponen UI, ikon, dan grafis sebaiknya minimal 3:1.",
    "what-is-tip": "Rasio yang lebih tinggi meningkatkan keterbacaan, terutama pada font tipis atau ukuran kecil.",
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
    "what-is-title": "מהו ניגוד צבעים?",
    "what-is-definition": "יחס הניגודיות מודד את ההבדל בלומיננס בין טקסט (קדמה) לרקע בסקאלה מ-1:1 (ללא ניגודיות) עד 21:1 (שחור על לבן).",
    "what-is-method": "הכלי ממיר צבעים ל-sRGB, מערבב שקיפות לפני ההשוואה ומשתמש בנוסחת הלומיננס היחסי של WCAG.",
    "what-is-thresholds-title": "ספי WCAG",
    "what-is-thresholds-aa": "AA: ‏4.5:1 לטקסט רגיל, 3:1 לטקסט גדול.",
    "what-is-thresholds-aaa": "AAA: ‏7:1 לטקסט רגיל, 4.5:1 לטקסט גדול.",
    "what-is-thresholds-large": "טקסט גדול הוא 18pt+ רגיל או 14pt+ מודגש.",
    "what-is-thresholds-ui": "רכיבי UI, אייקונים וגרפיקה צריכים לשאוף לפחות ל-3:1.",
    "what-is-tip": "יחסים גבוהים יותר משפרים קריאות, במיוחד עם גופנים דקים או גדלים קטנים.",
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
    "what-is-title": "Apakah kontras warna?",
    "what-is-definition": "Nisbah kontras mengukur perbezaan luminans antara teks (hadapan) dan latar pada skala 1:1 (tiada kontras) hingga 21:1 (hitam di atas putih).",
    "what-is-method": "Alat ini menukar warna kepada sRGB, mengadun ketelusan sebelum perbandingan dan menggunakan formula luminans relatif WCAG.",
    "what-is-thresholds-title": "Ambang WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 untuk teks biasa, 3:1 untuk teks besar.",
    "what-is-thresholds-aaa": "AAA: 7:1 untuk teks biasa, 4.5:1 untuk teks besar.",
    "what-is-thresholds-large": "Teks besar ialah 18pt+ biasa atau 14pt+ tebal.",
    "what-is-thresholds-ui": "Komponen UI, ikon dan grafik sepatutnya sekurang-kurangnya 3:1.",
    "what-is-tip": "Nisbah lebih tinggi meningkatkan kebolehbacaan, terutama untuk fon nipis atau saiz kecil.",
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
    "what-is-title": "Hva er fargekontrast?",
    "what-is-definition": "Kontrastforholdet måler luminansforskjellen mellom tekst (forgrunn) og bakgrunn på en skala fra 1:1 (ingen kontrast) til 21:1 (svart på hvitt).",
    "what-is-method": "Dette verktøyet konverterer farger til sRGB, blander transparens før sammenligning og bruker WCAG-formelen for relativ luminans.",
    "what-is-thresholds-title": "WCAG-terskler",
    "what-is-thresholds-aa": "AA: 4.5:1 for normal tekst, 3:1 for stor tekst.",
    "what-is-thresholds-aaa": "AAA: 7:1 for normal tekst, 4.5:1 for stor tekst.",
    "what-is-thresholds-large": "Stor tekst er 18pt+ normal eller 14pt+ fet.",
    "what-is-thresholds-ui": "UI-komponenter, ikoner og grafikk bør sikte på minst 3:1.",
    "what-is-tip": "Høyere forhold forbedrer lesbarheten, spesielt med tynne skrifter eller små størrelser.",
    "invalid-input": "Skriv inn gyldige farger for å se resultater.",
    "invalid-color": "Ugyldig fargeformat"
  }
}
</i18n>
