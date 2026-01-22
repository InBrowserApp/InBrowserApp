<template>
  <ToolSectionHeader>{{ t('layers-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 l:2" responsive="screen" :x-gap="16" :y-gap="16">
      <n-gi>
        <n-flex vertical :size="12">
          <n-card
            v-for="(layer, index) in layers"
            :key="layer.id"
            size="small"
            :class="['layer-card', { 'layer-card-active': layer.id === activeLayerId }]"
            data-testid="layer-card"
            @click="setActiveLayer(layer.id)"
          >
            <n-flex align="center" justify="space-between" :size="8" wrap>
              <n-flex align="center" :size="8">
                <span
                  class="layer-indicator"
                  :class="{ 'layer-indicator-active': layer.id === activeLayerId }"
                  aria-hidden="true"
                />
                <n-button text :data-testid="`layer-${index}`">
                  {{ t('layer-title', { index: index + 1 }) }}
                </n-button>
              </n-flex>
              <n-flex align="center" :size="8" wrap>
                <n-tag v-show="layer.inset" size="small" type="warning">{{ t('inset') }}</n-tag>
                <n-button
                  text
                  size="small"
                  :disabled="index === 0"
                  @click="moveLayer(layer.id, -1)"
                  :data-testid="`layer-up-${index}`"
                >
                  {{ t('move-up') }}
                </n-button>
                <n-button
                  text
                  size="small"
                  :disabled="index === layers.length - 1"
                  @click="moveLayer(layer.id, 1)"
                  :data-testid="`layer-down-${index}`"
                >
                  {{ t('move-down') }}
                </n-button>
                <n-button
                  text
                  size="small"
                  :disabled="layers.length === 1"
                  @click="removeLayer(layer.id)"
                  :data-testid="`layer-remove-${index}`"
                >
                  <template #icon>
                    <n-icon :component="Delete16Regular" />
                  </template>
                  {{ t('remove-layer') }}
                </n-button>
              </n-flex>
            </n-flex>
          </n-card>
          <n-button dashed type="primary" @click="addLayer" data-testid="add-layer">
            <template #icon>
              <n-icon :component="Add16Regular" />
            </template>
            {{ t('add-layer') }}
          </n-button>
        </n-flex>
      </n-gi>
      <n-gi>
        <n-flex vertical :size="12">
          <n-text strong>{{ t('layer-settings-title') }}</n-text>
          <n-form-item :label="t('offset-x')">
            <n-flex align="center" :size="12" class="control-row">
              <n-slider
                v-model:value="activeLayer.offsetX"
                :min="offsetRange.min"
                :max="offsetRange.max"
                :step="1"
                data-testid="offset-x-slider"
              />
              <n-input-number
                v-model:value="activeLayer.offsetX"
                :min="offsetRange.min"
                :max="offsetRange.max"
                :step="1"
                size="small"
                data-testid="offset-x-input"
              />
              <n-text depth="3">{{ t('unit-px') }}</n-text>
            </n-flex>
          </n-form-item>
          <n-form-item :label="t('offset-y')">
            <n-flex align="center" :size="12" class="control-row">
              <n-slider
                v-model:value="activeLayer.offsetY"
                :min="offsetRange.min"
                :max="offsetRange.max"
                :step="1"
                data-testid="offset-y-slider"
              />
              <n-input-number
                v-model:value="activeLayer.offsetY"
                :min="offsetRange.min"
                :max="offsetRange.max"
                :step="1"
                size="small"
                data-testid="offset-y-input"
              />
              <n-text depth="3">{{ t('unit-px') }}</n-text>
            </n-flex>
          </n-form-item>
          <n-form-item :label="t('blur')">
            <n-flex align="center" :size="12" class="control-row">
              <n-slider
                v-model:value="activeLayer.blur"
                :min="blurRange.min"
                :max="blurRange.max"
                :step="1"
                data-testid="blur-slider"
              />
              <n-input-number
                v-model:value="activeLayer.blur"
                :min="blurRange.min"
                :max="blurRange.max"
                :step="1"
                size="small"
                data-testid="blur-input"
              />
              <n-text depth="3">{{ t('unit-px') }}</n-text>
            </n-flex>
          </n-form-item>
          <n-form-item :label="t('spread')">
            <n-flex align="center" :size="12" class="control-row">
              <n-slider
                v-model:value="activeLayer.spread"
                :min="spreadRange.min"
                :max="spreadRange.max"
                :step="1"
                data-testid="spread-slider"
              />
              <n-input-number
                v-model:value="activeLayer.spread"
                :min="spreadRange.min"
                :max="spreadRange.max"
                :step="1"
                size="small"
                data-testid="spread-input"
              />
              <n-text depth="3">{{ t('unit-px') }}</n-text>
            </n-flex>
          </n-form-item>
          <n-form-item :label="t('color')">
            <n-color-picker
              v-model:value="activeLayer.color"
              :modes="['hex']"
              :show-alpha="true"
              :swatches="swatches"
              data-testid="color-picker"
            />
          </n-form-item>
          <n-form-item :label="t('inset')">
            <n-switch v-model:value="activeLayer.inset" data-testid="inset-switch" />
          </n-form-item>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>

  <ToolSectionHeader>{{ t('preview-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="space-between" :size="12" wrap>
        <n-text strong>{{ t('output-title') }}</n-text>
        <n-flex align="center" :size="12" wrap>
          <n-flex align="center" :size="8">
            <n-text depth="3">{{ t('dark-background') }}</n-text>
            <n-switch v-model:value="darkBackground" size="small" data-testid="background-switch" />
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

  <ToolSectionHeader>{{ t('what-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-text>{{ t('what-p1') }}</n-text>
    <n-text style="margin-top: 8px; display: block">{{ t('what-p2') }}</n-text>
    <n-text style="margin-top: 8px; display: block">{{ t('what-p3') }}</n-text>
    <n-ul style="margin-top: 12px">
      <n-li>{{ t('what-b1') }}</n-li>
      <n-li>{{ t('what-b2') }}</n-li>
      <n-li>{{ t('what-b3') }}</n-li>
      <n-li>{{ t('what-b4') }}</n-li>
    </n-ul>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  NButton,
  NCard,
  NCode,
  NColorPicker,
  NFlex,
  NFormItem,
  NGi,
  NGrid,
  NIcon,
  NInputNumber,
  NLi,
  NSlider,
  NSwitch,
  NTag,
  NText,
  NUl,
} from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import Add16Regular from '@vicons/fluent/Add16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import { buildBoxShadow, createShadowLayer, type ShadowLayer } from '../utils/shadow'

const { t } = useI18n()

const offsetRange = { min: -120, max: 120 }
const blurRange = { min: 0, max: 200 }
const spreadRange = { min: -60, max: 60 }

const swatches = [
  '#00000033',
  '#00000066',
  '#00000099',
  '#FFFFFF33',
  '#FFFFFF66',
  '#FFB02066',
  '#22C55E66',
  '#3B82F666',
  '#A855F766',
  '#EF444466',
]

const layers = useStorage<ShadowLayer[]>('tools:css-box-shadow-generator:layers', [
  createShadowLayer(),
])
const activeLayerId = useStorage(
  'tools:css-box-shadow-generator:active-layer',
  layers.value[0]?.id ?? '',
)
const darkBackground = useStorage('tools:css-box-shadow-generator:dark-preview', false)

const activeLayer = computed<ShadowLayer>(() => {
  const found = layers.value.find((layer) => layer.id === activeLayerId.value)
  return found ?? layers.value[0]!
})

const shadowValue = computed(() => buildBoxShadow(layers.value))
const cssOutput = computed(() => `box-shadow: ${shadowValue.value};`)
const previewStyle = computed(() => ({
  boxShadow: shadowValue.value,
}))

watch(
  layers,
  () => {
    if (layers.value.length === 0) {
      const nextLayer = createShadowLayer()
      layers.value = [nextLayer]
      activeLayerId.value = nextLayer.id
      return
    }

    const hasActive = layers.value.some((layer) => layer.id === activeLayerId.value)
    if (!hasActive) {
      activeLayerId.value = layers.value[0]?.id ?? ''
    }
  },
  { deep: true, immediate: true },
)

function setActiveLayer(id: string) {
  activeLayerId.value = id
}

function addLayer() {
  const nextLayer = createShadowLayer()
  layers.value = [...layers.value, nextLayer]
  activeLayerId.value = nextLayer.id
}

function removeLayer(id: string) {
  if (layers.value.length <= 1) return
  layers.value = layers.value.filter((layer) => layer.id !== id)
}

function moveLayer(id: string, direction: number) {
  const index = layers.value.findIndex((layer) => layer.id === id)
  if (index === -1) return

  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= layers.value.length) return

  const nextLayers = [...layers.value]
  const temp = nextLayers[index]!
  nextLayers[index] = nextLayers[nextIndex]!
  nextLayers[nextIndex] = temp
  layers.value = nextLayers
}
</script>

<style scoped>
.control-row {
  width: 100%;
}

.control-row :deep(.n-slider) {
  flex: 1;
  min-width: 120px;
}

.layer-card {
  cursor: pointer;
  position: relative;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.layer-card:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.layer-card-active {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.12), transparent 55%);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.6);
}

.layer-indicator {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.7);
  box-shadow: inset 0 0 0 2px rgba(148, 163, 184, 0.6);
}

.layer-indicator-active {
  background: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.25);
}

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
    "layers-title": "Layers",
    "layer-title": "Layer {index}",
    "add-layer": "Add layer",
    "remove-layer": "Remove",
    "move-up": "Move up",
    "move-down": "Move down",
    "layer-settings-title": "Layer settings",
    "offset-x": "Offset X",
    "offset-y": "Offset Y",
    "blur": "Blur",
    "spread": "Spread",
    "color": "Color",
    "inset": "Inset",
    "unit-px": "px",
    "preview-title": "Preview",
    "output-title": "CSS output",
    "output-hint": "Copy the box-shadow value into your CSS.",
    "dark-background": "Dark background",
    "what-title": "What is box-shadow?",
    "what-p1": "box-shadow is a CSS property that draws one or more shadows behind (or inside) an element.",
    "what-p2": "Each shadow uses horizontal and vertical offsets, a blur radius, optional spread, and a color with alpha; add inset to turn it into an inner shadow.",
    "what-p3": "Multiple layers are comma-separated, letting you stack subtle shadows to build depth, glow, or crisp edges.",
    "what-b1": "Use small offsets with larger blur for soft elevation.",
    "what-b2": "Use higher opacity with small blur for sharper edges.",
    "what-b3": "Combine an outer shadow with an inset shadow to add depth.",
    "what-b4": "Limit the number of layers for better performance."
  },
  "zh": {
    "layers-title": "图层",
    "layer-title": "图层 {index}",
    "add-layer": "添加图层",
    "remove-layer": "移除",
    "move-up": "上移",
    "move-down": "下移",
    "layer-settings-title": "图层设置",
    "offset-x": "水平偏移",
    "offset-y": "垂直偏移",
    "blur": "模糊",
    "spread": "扩展",
    "color": "颜色",
    "inset": "内阴影",
    "unit-px": "px",
    "preview-title": "预览",
    "output-title": "CSS 输出",
    "output-hint": "将 box-shadow 值复制到你的 CSS 中。",
    "dark-background": "深色背景",
    "what-title": "什么是 box-shadow？",
    "what-p1": "box-shadow 是一个 CSS 属性，用于在元素外部（或内部）绘制一个或多个阴影。",
    "what-p2": "每个阴影由水平/垂直偏移、模糊半径、可选的扩展值以及带透明度的颜色组成；加上 inset 就会变成内阴影。",
    "what-p3": "多个图层用逗号分隔，可以叠加出层次感、发光或清晰的边缘效果。",
    "what-b1": "小偏移 + 大模糊可形成柔和的浮起感。",
    "what-b2": "更高不透明度 + 小模糊能得到更锐利的边缘。",
    "what-b3": "外阴影配合内阴影可增强立体感。",
    "what-b4": "图层数量尽量少，以获得更好的性能。"
  },
  "zh-CN": {
    "layers-title": "图层",
    "layer-title": "图层 {index}",
    "add-layer": "添加图层",
    "remove-layer": "移除",
    "move-up": "上移",
    "move-down": "下移",
    "layer-settings-title": "图层设置",
    "offset-x": "水平偏移",
    "offset-y": "垂直偏移",
    "blur": "模糊",
    "spread": "扩展",
    "color": "颜色",
    "inset": "内阴影",
    "unit-px": "px",
    "preview-title": "预览",
    "output-title": "CSS 输出",
    "output-hint": "将 box-shadow 值复制到你的 CSS 中。",
    "dark-background": "深色背景",
    "what-title": "什么是 box-shadow？",
    "what-p1": "box-shadow 是一个 CSS 属性，用于在元素外部（或内部）绘制一个或多个阴影。",
    "what-p2": "每个阴影由水平/垂直偏移、模糊半径、可选的扩展值以及带透明度的颜色组成；加上 inset 就会变成内阴影。",
    "what-p3": "多个图层用逗号分隔，可以叠加出层次感、发光或清晰的边缘效果。",
    "what-b1": "小偏移 + 大模糊可形成柔和的浮起感。",
    "what-b2": "更高不透明度 + 小模糊能得到更锐利的边缘。",
    "what-b3": "外阴影配合内阴影可增强立体感。",
    "what-b4": "图层数量尽量少，以获得更好的性能。"
  },
  "zh-TW": {
    "layers-title": "圖層",
    "layer-title": "圖層 {index}",
    "add-layer": "新增圖層",
    "remove-layer": "移除",
    "move-up": "上移",
    "move-down": "下移",
    "layer-settings-title": "圖層設定",
    "offset-x": "水平位移",
    "offset-y": "垂直位移",
    "blur": "模糊",
    "spread": "擴展",
    "color": "顏色",
    "inset": "內陰影",
    "unit-px": "px",
    "preview-title": "預覽",
    "output-title": "CSS 輸出",
    "output-hint": "將 box-shadow 值複製到你的 CSS。",
    "dark-background": "深色背景",
    "what-title": "什麼是 box-shadow？",
    "what-p1": "box-shadow 是一個 CSS 屬性，用於在元素外部（或內部）繪製一或多個陰影。",
    "what-p2": "每個陰影由水平/垂直位移、模糊半徑、可選的擴展值以及帶透明度的顏色組成；加上 inset 就會變成內陰影。",
    "what-p3": "多個圖層用逗號分隔，可以疊加出層次感、發光或清晰的邊緣效果。",
    "what-b1": "小位移 + 大模糊可形成柔和的浮起感。",
    "what-b2": "更高不透明度 + 小模糊能得到更銳利的邊緣。",
    "what-b3": "外陰影配合內陰影可增強立體感。",
    "what-b4": "圖層數量盡量少，以獲得更好的效能。"
  },
  "zh-HK": {
    "layers-title": "圖層",
    "layer-title": "圖層 {index}",
    "add-layer": "新增圖層",
    "remove-layer": "移除",
    "move-up": "上移",
    "move-down": "下移",
    "layer-settings-title": "圖層設定",
    "offset-x": "水平位移",
    "offset-y": "垂直位移",
    "blur": "模糊",
    "spread": "擴展",
    "color": "顏色",
    "inset": "內陰影",
    "unit-px": "px",
    "preview-title": "預覽",
    "output-title": "CSS 輸出",
    "output-hint": "將 box-shadow 值複製到你的 CSS。",
    "dark-background": "深色背景",
    "what-title": "什麼是 box-shadow？",
    "what-p1": "box-shadow 是一個 CSS 屬性，用於在元素外部（或內部）繪製一或多個陰影。",
    "what-p2": "每個陰影由水平/垂直位移、模糊半徑、可選的擴展值以及帶透明度的顏色組成；加上 inset 就會變成內陰影。",
    "what-p3": "多個圖層用逗號分隔，可以疊加出層次感、發光或清晰的邊緣效果。",
    "what-b1": "小位移 + 大模糊可形成柔和的浮起感。",
    "what-b2": "更高不透明度 + 小模糊能得到更銳利的邊緣。",
    "what-b3": "外陰影配合內陰影可增強立體感。",
    "what-b4": "圖層數量盡量少，以獲得更好的效能。"
  },
  "es": {
    "layers-title": "Capas",
    "layer-title": "Capa {index}",
    "add-layer": "Añadir capa",
    "remove-layer": "Eliminar",
    "move-up": "Subir",
    "move-down": "Bajar",
    "layer-settings-title": "Ajustes de capa",
    "offset-x": "Desplazamiento X",
    "offset-y": "Desplazamiento Y",
    "blur": "Desenfoque",
    "spread": "Expansión",
    "color": "Color",
    "inset": "Interior",
    "unit-px": "px",
    "preview-title": "Vista previa",
    "output-title": "Salida CSS",
    "output-hint": "Copia el valor de box-shadow en tu CSS.",
    "dark-background": "Fondo oscuro",
    "what-title": "¿Qué es box-shadow?",
    "what-p1": "box-shadow es una propiedad CSS que dibuja una o más sombras detrás (o dentro) de un elemento.",
    "what-p2": "Cada sombra usa desplazamientos horizontal y vertical, un radio de desenfoque, una expansión opcional y un color con alfa; añade inset para convertirla en una sombra interior.",
    "what-p3": "Las capas múltiples se separan por comas, lo que permite apilar sombras sutiles para crear profundidad, brillo o bordes nítidos.",
    "what-b1": "Usa desplazamientos pequeños con un desenfoque mayor para una elevación suave.",
    "what-b2": "Usa mayor opacidad con poco desenfoque para bordes más definidos.",
    "what-b3": "Combina una sombra exterior con una interior para dar profundidad.",
    "what-b4": "Limita el número de capas para un mejor rendimiento."
  },
  "fr": {
    "layers-title": "Calques",
    "layer-title": "Calque {index}",
    "add-layer": "Ajouter un calque",
    "remove-layer": "Supprimer",
    "move-up": "Monter",
    "move-down": "Descendre",
    "layer-settings-title": "Paramètres du calque",
    "offset-x": "Décalage X",
    "offset-y": "Décalage Y",
    "blur": "Flou",
    "spread": "Diffusion",
    "color": "Couleur",
    "inset": "Interne",
    "unit-px": "px",
    "preview-title": "Aperçu",
    "output-title": "Sortie CSS",
    "output-hint": "Copiez la valeur box-shadow dans votre CSS.",
    "dark-background": "Fond sombre",
    "what-title": "Qu'est-ce que box-shadow ?",
    "what-p1": "box-shadow est une propriété CSS qui dessine une ou plusieurs ombres derrière (ou à l'intérieur d'un élément).",
    "what-p2": "Chaque ombre utilise des décalages horizontal et vertical, un rayon de flou, une diffusion optionnelle et une couleur avec alpha ; ajoutez inset pour en faire une ombre interne.",
    "what-p3": "Les couches multiples sont séparées par des virgules, ce qui permet d'empiler des ombres subtiles pour créer de la profondeur, de la lueur ou des bords nets.",
    "what-b1": "Utilisez de petits décalages avec plus de flou pour une élévation douce.",
    "what-b2": "Utilisez une opacité plus élevée avec peu de flou pour des bords plus nets.",
    "what-b3": "Combinez une ombre externe avec une ombre interne pour ajouter de la profondeur.",
    "what-b4": "Limitez le nombre de couches pour de meilleures performances."
  },
  "de": {
    "layers-title": "Ebenen",
    "layer-title": "Ebene {index}",
    "add-layer": "Ebene hinzufügen",
    "remove-layer": "Entfernen",
    "move-up": "Nach oben",
    "move-down": "Nach unten",
    "layer-settings-title": "Einstellungen der Ebene",
    "offset-x": "Versatz X",
    "offset-y": "Versatz Y",
    "blur": "Weichzeichnung",
    "spread": "Ausbreitung",
    "color": "Farbe",
    "inset": "Innen",
    "unit-px": "px",
    "preview-title": "Vorschau",
    "output-title": "CSS-Ausgabe",
    "output-hint": "Kopiere den box-shadow-Wert in dein CSS.",
    "dark-background": "Dunkler Hintergrund",
    "what-title": "Was ist box-shadow?",
    "what-p1": "box-shadow ist eine CSS-Eigenschaft, die einen oder mehrere Schatten hinter (oder innerhalb) eines Elements zeichnet.",
    "what-p2": "Jeder Schatten nutzt horizontale und vertikale Versätze, einen Unschärferadius, eine optionale Ausbreitung und eine Farbe mit Alpha; fügen Sie inset hinzu, um einen Innenschatten zu erzeugen.",
    "what-p3": "Mehrere Ebenen werden durch Kommas getrennt und lassen sich stapeln, um Tiefe, Glühen oder scharfe Kanten zu erzeugen.",
    "what-b1": "Kleine Versätze mit größerer Unschärfe wirken wie sanfte Höhe.",
    "what-b2": "Höhere Deckkraft mit wenig Unschärfe ergibt schärfere Kanten.",
    "what-b3": "Kombinieren Sie Außen- und Innenschatten für mehr Tiefe.",
    "what-b4": "Begrenzen Sie die Anzahl der Ebenen für bessere Performance."
  },
  "it": {
    "layers-title": "Livelli",
    "layer-title": "Livello {index}",
    "add-layer": "Aggiungi livello",
    "remove-layer": "Rimuovi",
    "move-up": "Sposta su",
    "move-down": "Sposta giù",
    "layer-settings-title": "Impostazioni livello",
    "offset-x": "Offset X",
    "offset-y": "Offset Y",
    "blur": "Sfocatura",
    "spread": "Espansione",
    "color": "Colore",
    "inset": "Interno",
    "unit-px": "px",
    "preview-title": "Anteprima",
    "output-title": "Output CSS",
    "output-hint": "Copia il valore box-shadow nel tuo CSS.",
    "dark-background": "Sfondo scuro",
    "what-title": "Che cos'è box-shadow?",
    "what-p1": "box-shadow è una proprietà CSS che disegna una o più ombre dietro (o all'interno) di un elemento.",
    "what-p2": "Ogni ombra usa offset orizzontale e verticale, raggio di sfocatura, espansione opzionale e un colore con alfa; aggiungi inset per renderla un'ombra interna.",
    "what-p3": "Le modalità a più livelli sono separate da virgole e permettono di sovrapporre ombre leggere per creare profondità, bagliore o bordi netti.",
    "what-b1": "Usa piccoli offset con più sfocatura per una morbida elevazione.",
    "what-b2": "Usa maggiore opacità con poca sfocatura per bordi più definiti.",
    "what-b3": "Combina un'ombra esterna con una interna per aggiungere profondità.",
    "what-b4": "Limita il numero di livelli per prestazioni migliori."
  },
  "ja": {
    "layers-title": "レイヤー",
    "layer-title": "レイヤー {index}",
    "add-layer": "レイヤーを追加",
    "remove-layer": "削除",
    "move-up": "上へ",
    "move-down": "下へ",
    "layer-settings-title": "レイヤー設定",
    "offset-x": "Xオフセット",
    "offset-y": "Yオフセット",
    "blur": "ぼかし",
    "spread": "拡がり",
    "color": "色",
    "inset": "内側",
    "unit-px": "px",
    "preview-title": "プレビュー",
    "output-title": "CSS 出力",
    "output-hint": "box-shadow の値を CSS にコピーします。",
    "dark-background": "暗い背景",
    "what-title": "box-shadow とは？",
    "what-p1": "box-shadow は、要素の外側（または内側）に 1 つ以上の影を描く CSS プロパティです。",
    "what-p2": "各影は水平/垂直オフセット、ぼかし半径、任意の拡がり、アルファ付きの色で構成され、inset を付けると内側の影になります。",
    "what-p3": "複数レイヤーはカンマ区切りで、影を重ねて奥行き、発光、くっきりした縁などを作れます。",
    "what-b1": "小さなオフセットと大きめのぼかしで柔らかな浮遊感。",
    "what-b2": "高い不透明度と小さめのぼかしでシャープな縁。",
    "what-b3": "外側と内側の影を組み合わせて奥行きを追加。",
    "what-b4": "パフォーマンスのためレイヤー数は控えめに。"
  },
  "ko": {
    "layers-title": "레이어",
    "layer-title": "레이어 {index}",
    "add-layer": "레이어 추가",
    "remove-layer": "제거",
    "move-up": "위로 이동",
    "move-down": "아래로 이동",
    "layer-settings-title": "레이어 설정",
    "offset-x": "X 오프셋",
    "offset-y": "Y 오프셋",
    "blur": "흐림",
    "spread": "퍼짐",
    "color": "색상",
    "inset": "내부",
    "unit-px": "px",
    "preview-title": "미리보기",
    "output-title": "CSS 출력",
    "output-hint": "box-shadow 값을 CSS에 복사하세요.",
    "dark-background": "어두운 배경",
    "what-title": "box-shadow란?",
    "what-p1": "box-shadow는 요소 뒤(또는 안쪽)에 하나 이상의 그림자를 그리는 CSS 속성입니다.",
    "what-p2": "각 그림자는 가로/세로 오프셋, 블러 반경, 선택적 확산, 알파가 있는 색상으로 구성되며, inset을 추가하면 내부 그림자가 됩니다.",
    "what-p3": "여러 레이어는 쉼표로 구분되며, 섬세한 그림자를 겹쳐 깊이감, 글로우, 또렷한 가장자리를 만들 수 있습니다.",
    "what-b1": "작은 오프셋과 큰 블러로 부드러운 떠 있음 효과.",
    "what-b2": "높은 불투명도와 작은 블러로 더 선명한 가장자리.",
    "what-b3": "외부 그림자와 내부 그림자를 함께 사용해 깊이감 추가.",
    "what-b4": "성능을 위해 레이어 수를 제한하세요."
  },
  "ru": {
    "layers-title": "Слои",
    "layer-title": "Слой {index}",
    "add-layer": "Добавить слой",
    "remove-layer": "Удалить",
    "move-up": "Вверх",
    "move-down": "Вниз",
    "layer-settings-title": "Настройки слоя",
    "offset-x": "Смещение X",
    "offset-y": "Смещение Y",
    "blur": "Размытие",
    "spread": "Рассеивание",
    "color": "Цвет",
    "inset": "Внутренний",
    "unit-px": "px",
    "preview-title": "Предпросмотр",
    "output-title": "Вывод CSS",
    "output-hint": "Скопируйте значение box-shadow в ваш CSS.",
    "dark-background": "Темный фон",
    "what-title": "Что такое box-shadow?",
    "what-p1": "box-shadow — это свойство CSS, которое рисует одну или несколько теней позади (или внутри) элемента.",
    "what-p2": "Каждая тень задаётся горизонтальным и вертикальным смещением, радиусом размытия, необязательным расширением и цветом с альфа-каналом; добавьте inset, чтобы получить внутреннюю тень.",
    "what-p3": "Несколько слоёв разделяются запятыми, что позволяет наслаивать тени для глубины, свечения или чётких краёв.",
    "what-b1": "Небольшие смещения с большим размытием дают мягкую высоту.",
    "what-b2": "Большая непрозрачность и малое размытие дают более резкие края.",
    "what-b3": "Сочетайте внешнюю и внутреннюю тень для глубины.",
    "what-b4": "Ограничьте число слоёв ради производительности."
  },
  "pt": {
    "layers-title": "Camadas",
    "layer-title": "Camada {index}",
    "add-layer": "Adicionar camada",
    "remove-layer": "Remover",
    "move-up": "Mover para cima",
    "move-down": "Mover para baixo",
    "layer-settings-title": "Configurações da camada",
    "offset-x": "Deslocamento X",
    "offset-y": "Deslocamento Y",
    "blur": "Desfoque",
    "spread": "Espalhamento",
    "color": "Cor",
    "inset": "Interno",
    "unit-px": "px",
    "preview-title": "Prévia",
    "output-title": "Saída CSS",
    "output-hint": "Copie o valor de box-shadow para o seu CSS.",
    "dark-background": "Fundo escuro",
    "what-title": "O que é box-shadow?",
    "what-p1": "box-shadow é uma propriedade CSS que desenha uma ou mais sombras atrás (ou dentro) de um elemento.",
    "what-p2": "Cada sombra usa deslocamentos horizontal e vertical, raio de desfoque, espalhamento opcional e uma cor com alfa; adicione inset para virar uma sombra interna.",
    "what-p3": "Múltiplas camadas são separadas por vírgulas, permitindo empilhar sombras sutis para criar profundidade, brilho ou bordas nítidas.",
    "what-b1": "Use deslocamentos pequenos com mais desfoque para uma elevação suave.",
    "what-b2": "Use maior opacidade com pouco desfoque para bordas mais definidas.",
    "what-b3": "Combine uma sombra externa com uma interna para adicionar profundidade.",
    "what-b4": "Limite o número de camadas para melhor desempenho."
  },
  "ar": {
    "layers-title": "الطبقات",
    "layer-title": "الطبقة {index}",
    "add-layer": "إضافة طبقة",
    "remove-layer": "إزالة",
    "move-up": "تحريك للأعلى",
    "move-down": "تحريك للأسفل",
    "layer-settings-title": "إعدادات الطبقة",
    "offset-x": "إزاحة X",
    "offset-y": "إزاحة Y",
    "blur": "تمويه",
    "spread": "انتشار",
    "color": "اللون",
    "inset": "داخلي",
    "unit-px": "px",
    "preview-title": "معاينة",
    "output-title": "مخرجات CSS",
    "output-hint": "انسخ قيمة box-shadow إلى CSS.",
    "dark-background": "خلفية داكنة",
    "what-title": "ما هي box-shadow؟",
    "what-p1": "box-shadow هي خاصية CSS ترسم ظلًا واحدًا أو أكثر خلف العنصر (أو بداخله).",
    "what-p2": "كل ظل يستخدم إزاحة أفقية وعمودية ونصف قطر تمويه وانتشارًا اختياريًا ولونًا مع ألفا؛ أضف inset لتحويله إلى ظل داخلي.",
    "what-p3": "تُفصل الطبقات المتعددة بفواصل، مما يسمح بتكديس ظلال دقيقة لبناء العمق أو التوهج أو الحواف الحادة.",
    "what-b1": "استخدم إزاحات صغيرة مع تمويه أكبر لارتفاع ناعم.",
    "what-b2": "استخدم عتامة أعلى مع تمويه صغير لحواف أكثر حدة.",
    "what-b3": "اجمع بين ظل خارجي وظل داخلي لإضافة عمق.",
    "what-b4": "قلّل عدد الطبقات لتحسين الأداء."
  },
  "hi": {
    "layers-title": "परतें",
    "layer-title": "परत {index}",
    "add-layer": "परत जोड़ें",
    "remove-layer": "हटाएँ",
    "move-up": "ऊपर ले जाएँ",
    "move-down": "नीचे ले जाएँ",
    "layer-settings-title": "परत सेटिंग्स",
    "offset-x": "X ऑफ़सेट",
    "offset-y": "Y ऑफ़सेट",
    "blur": "धुंधलापन",
    "spread": "फैलाव",
    "color": "रंग",
    "inset": "भीतरी",
    "unit-px": "px",
    "preview-title": "पूर्वावलोकन",
    "output-title": "CSS आउटपुट",
    "output-hint": "box-shadow मान को अपने CSS में कॉपी करें।",
    "dark-background": "गहरा बैकग्राउंड",
    "what-title": "box-shadow क्या है?",
    "what-p1": "box-shadow एक CSS प्रॉपर्टी है जो किसी एलिमेंट के पीछे (या भीतर) एक या अधिक शैडो बनाती है।",
    "what-p2": "हर शैडो में क्षैतिज/ऊर्ध्वाधर ऑफसेट, ब्लर रेडियस, वैकल्पिक स्प्रेड और अल्फा वाला रंग होता है; inset जोड़ने पर यह इनर शैडो बन जाता है।",
    "what-p3": "कई लेयर कॉमा से अलग होती हैं, जिससे सूक्ष्म शैडो स्टैक करके गहराई, ग्लो या साफ किनारे बनाए जा सकते हैं।",
    "what-b1": "छोटे ऑफसेट और बड़े ब्लर से सॉफ्ट उभार मिलता है।",
    "what-b2": "ज़्यादा अपारदर्शिता और कम ब्लर से धारदार किनारे मिलते हैं।",
    "what-b3": "बाहरी और अंदरूनी शैडो को मिलाकर गहराई जोड़ें।",
    "what-b4": "बेहतर परफ़ॉर्मेंस के लिए लेयर की संख्या कम रखें।"
  },
  "tr": {
    "layers-title": "Katmanlar",
    "layer-title": "Katman {index}",
    "add-layer": "Katman ekle",
    "remove-layer": "Kaldır",
    "move-up": "Yukarı taşı",
    "move-down": "Aşağı taşı",
    "layer-settings-title": "Katman ayarları",
    "offset-x": "X kaydırma",
    "offset-y": "Y kaydırma",
    "blur": "Bulanıklık",
    "spread": "Yayılma",
    "color": "Renk",
    "inset": "İç",
    "unit-px": "px",
    "preview-title": "Önizleme",
    "output-title": "CSS çıktısı",
    "output-hint": "box-shadow değerini CSS'inize kopyalayın.",
    "dark-background": "Koyu arka plan",
    "what-title": "box-shadow nedir?",
    "what-p1": "box-shadow, bir öğenin arkasına (veya içine) bir ya da daha fazla gölge çizen bir CSS özelliğidir.",
    "what-p2": "Her gölge yatay ve dikey kaydırma, bulanıklık yarıçapı, isteğe bağlı yayılma ve alfa içeren bir renkten oluşur; inset eklemek iç gölge yapar.",
    "what-p3": "Birden çok katman virgülle ayrılır; bu sayede derinlik, parlama veya keskin kenarlar için gölgeler üst üste konur.",
    "what-b1": "Yumuşak yükselti için küçük kaydırma ve daha fazla bulanıklık kullanın.",
    "what-b2": "Daha keskin kenarlar için yüksek opaklık ve düşük bulanıklık kullanın.",
    "what-b3": "Derinlik için dış gölgeyi iç gölgeyle birleştirin.",
    "what-b4": "Performans için katman sayısını sınırlayın."
  },
  "nl": {
    "layers-title": "Lagen",
    "layer-title": "Laag {index}",
    "add-layer": "Laag toevoegen",
    "remove-layer": "Verwijderen",
    "move-up": "Omhoog",
    "move-down": "Omlaag",
    "layer-settings-title": "Laaginstellingen",
    "offset-x": "Offset X",
    "offset-y": "Offset Y",
    "blur": "Vervaging",
    "spread": "Spreiding",
    "color": "Kleur",
    "inset": "Binnen",
    "unit-px": "px",
    "preview-title": "Voorbeeld",
    "output-title": "CSS-uitvoer",
    "output-hint": "Kopieer de box-shadow-waarde naar je CSS.",
    "dark-background": "Donkere achtergrond",
    "what-title": "Wat is box-shadow?",
    "what-p1": "box-shadow is een CSS-eigenschap die een of meer schaduwen achter (of binnen) een element tekent.",
    "what-p2": "Elke schaduw gebruikt horizontale en verticale offsets, een vervagingsradius, optionele spreiding en een kleur met alfa; voeg inset toe voor een binnenste schaduw.",
    "what-p3": "Meerdere lagen worden met komma's gescheiden en laten je subtiele schaduwen stapelen voor diepte, gloed of scherpe randen.",
    "what-b1": "Gebruik kleine offsets met meer vervaging voor zachte elevatie.",
    "what-b2": "Gebruik hogere opaciteit met weinig vervaging voor scherpere randen.",
    "what-b3": "Combineer een buiten- en binnenschaduw voor extra diepte.",
    "what-b4": "Beperk het aantal lagen voor betere prestaties."
  },
  "sv": {
    "layers-title": "Lager",
    "layer-title": "Lager {index}",
    "add-layer": "Lägg till lager",
    "remove-layer": "Ta bort",
    "move-up": "Flytta upp",
    "move-down": "Flytta ner",
    "layer-settings-title": "Lagerinställningar",
    "offset-x": "Offset X",
    "offset-y": "Offset Y",
    "blur": "Oskärpa",
    "spread": "Spridning",
    "color": "Färg",
    "inset": "Inre",
    "unit-px": "px",
    "preview-title": "Förhandsvisning",
    "output-title": "CSS-utdata",
    "output-hint": "Kopiera box-shadow-värdet till din CSS.",
    "dark-background": "Mörk bakgrund",
    "what-title": "Vad är box-shadow?",
    "what-p1": "box-shadow är en CSS-egenskap som ritar en eller flera skuggor bakom (eller inuti) ett element.",
    "what-p2": "Varje skugga använder horisontell och vertikal förskjutning, oskärperadie, valfri spridning och en färg med alfa; lägg till inset för en inre skugga.",
    "what-p3": "Flera lager separeras med kommatecken, så du kan stapla subtila skuggor för djup, glöd eller skarpa kanter.",
    "what-b1": "Små förskjutningar med mer oskärpa ger mjuk höjd.",
    "what-b2": "Högre opacitet med lite oskärpa ger skarpare kanter.",
    "what-b3": "Kombinera en yttre och en inre skugga för mer djup.",
    "what-b4": "Begränsa antalet lager för bättre prestanda."
  },
  "pl": {
    "layers-title": "Warstwy",
    "layer-title": "Warstwa {index}",
    "add-layer": "Dodaj warstwę",
    "remove-layer": "Usuń",
    "move-up": "Przesuń w górę",
    "move-down": "Przesuń w dół",
    "layer-settings-title": "Ustawienia warstwy",
    "offset-x": "Przesunięcie X",
    "offset-y": "Przesunięcie Y",
    "blur": "Rozmycie",
    "spread": "Rozszerzenie",
    "color": "Kolor",
    "inset": "Wewnętrzny",
    "unit-px": "px",
    "preview-title": "Podgląd",
    "output-title": "Wynik CSS",
    "output-hint": "Skopiuj wartość box-shadow do swojego CSS.",
    "dark-background": "Ciemne tło",
    "what-title": "Czym jest box-shadow?",
    "what-p1": "box-shadow to właściwość CSS rysująca jeden lub więcej cieni za (lub wewnątrz) elementu.",
    "what-p2": "Każdy cień ma poziome i pionowe przesunięcie, promień rozmycia, opcjonalne rozprzestrzenienie oraz kolor z alfą; dodanie inset tworzy cień wewnętrzny.",
    "what-p3": "Wiele warstw oddziela się przecinkami, co pozwala nakładać subtelne cienie dla głębi, poświaty lub ostrych krawędzi.",
    "what-b1": "Małe przesunięcia z większym rozmyciem dają miękką wysokość.",
    "what-b2": "Większa nieprzezroczystość i małe rozmycie dają ostrzejsze krawędzie.",
    "what-b3": "Łącz cień zewnętrzny i wewnętrzny dla głębi.",
    "what-b4": "Ogranicz liczbę warstw dla lepszej wydajności."
  },
  "vi": {
    "layers-title": "Lớp",
    "layer-title": "Lớp {index}",
    "add-layer": "Thêm lớp",
    "remove-layer": "Xóa",
    "move-up": "Di chuyển lên",
    "move-down": "Di chuyển xuống",
    "layer-settings-title": "Cài đặt lớp",
    "offset-x": "Độ lệch X",
    "offset-y": "Độ lệch Y",
    "blur": "Làm mờ",
    "spread": "Lan rộng",
    "color": "Màu",
    "inset": "Bên trong",
    "unit-px": "px",
    "preview-title": "Xem trước",
    "output-title": "Đầu ra CSS",
    "output-hint": "Sao chép giá trị box-shadow vào CSS của bạn.",
    "dark-background": "Nền tối",
    "what-title": "box-shadow là gì?",
    "what-p1": "box-shadow là thuộc tính CSS tạo một hoặc nhiều bóng đổ phía sau (hoặc bên trong) phần tử.",
    "what-p2": "Mỗi bóng đổ gồm độ lệch ngang/dọc, bán kính làm mờ, độ lan tùy chọn và màu có kênh alpha; thêm inset để biến thành bóng trong.",
    "what-p3": "Nhiều lớp được phân tách bằng dấu phẩy, cho phép chồng các bóng nhẹ để tạo chiều sâu, hiệu ứng phát sáng hoặc viền sắc nét.",
    "what-b1": "Dùng độ lệch nhỏ với blur lớn để tạo cảm giác nổi mềm.",
    "what-b2": "Dùng độ mờ thấp (opacity cao) và blur nhỏ để viền sắc hơn.",
    "what-b3": "Kết hợp bóng ngoài và bóng trong để tăng chiều sâu.",
    "what-b4": "Giới hạn số lớp để có hiệu năng tốt hơn."
  },
  "th": {
    "layers-title": "เลเยอร์",
    "layer-title": "เลเยอร์ {index}",
    "add-layer": "เพิ่มเลเยอร์",
    "remove-layer": "ลบ",
    "move-up": "ย้ายขึ้น",
    "move-down": "ย้ายลง",
    "layer-settings-title": "การตั้งค่าเลเยอร์",
    "offset-x": "ระยะเลื่อน X",
    "offset-y": "ระยะเลื่อน Y",
    "blur": "ความเบลอ",
    "spread": "การกระจาย",
    "color": "สี",
    "inset": "ด้านใน",
    "unit-px": "px",
    "preview-title": "พรีวิว",
    "output-title": "เอาต์พุต CSS",
    "output-hint": "คัดลอกค่า box-shadow ไปยัง CSS ของคุณ",
    "dark-background": "พื้นหลังเข้ม",
    "what-title": "box-shadow คืออะไร?",
    "what-p1": "box-shadow เป็นคุณสมบัติ CSS ที่วาดเงาหนึ่งหรือหลายชั้นด้านหลัง (หรือด้านใน) ขององค์ประกอบ",
    "what-p2": "แต่ละเงามีระยะเลื่อนแนวนอน/แนวตั้ง รัศมีเบลอ การขยาย (ถ้ามี) และสีพร้อมค่าอัลฟา; เพิ่ม inset เพื่อเป็นเงาด้านใน",
    "what-p3": "หลายเลเยอร์คั่นด้วยเครื่องหมายจุลภาค ช่วยซ้อนเงาเล็ก ๆ เพื่อสร้างมิติ แสงเรือง หรือขอบคม",
    "what-b1": "ระยะเลื่อนเล็กกับเบลอมาก ให้เอฟเฟกต์ยกตัวนุ่ม ๆ",
    "what-b2": "ความทึบสูงกับเบลอน้อย ทำให้ขอบคมขึ้น",
    "what-b3": "ผสานเงานอกกับเงาในเพื่อเพิ่มมิติ",
    "what-b4": "จำกัดจำนวนเลเยอร์เพื่อประสิทธิภาพที่ดีขึ้น"
  },
  "id": {
    "layers-title": "Lapisan",
    "layer-title": "Lapisan {index}",
    "add-layer": "Tambah lapisan",
    "remove-layer": "Hapus",
    "move-up": "Pindahkan ke atas",
    "move-down": "Pindahkan ke bawah",
    "layer-settings-title": "Pengaturan lapisan",
    "offset-x": "Offset X",
    "offset-y": "Offset Y",
    "blur": "Blur",
    "spread": "Sebaran",
    "color": "Warna",
    "inset": "Inset",
    "unit-px": "px",
    "preview-title": "Pratinjau",
    "output-title": "Output CSS",
    "output-hint": "Salin nilai box-shadow ke CSS Anda.",
    "dark-background": "Latar gelap",
    "what-title": "Apa itu box-shadow?",
    "what-p1": "box-shadow adalah properti CSS yang menggambar satu atau lebih bayangan di belakang (atau di dalam) elemen.",
    "what-p2": "Setiap bayangan menggunakan offset horizontal dan vertikal, radius blur, sebaran opsional, serta warna dengan alfa; tambahkan inset untuk menjadi bayangan dalam.",
    "what-p3": "Beberapa lapisan dipisahkan dengan koma, sehingga bayangan halus bisa ditumpuk untuk membentuk kedalaman, glow, atau tepi tajam.",
    "what-b1": "Gunakan offset kecil dengan blur lebih besar untuk elevasi lembut.",
    "what-b2": "Gunakan opasitas lebih tinggi dengan blur kecil untuk tepi lebih tajam.",
    "what-b3": "Gabungkan bayangan luar dan dalam untuk menambah kedalaman.",
    "what-b4": "Batasi jumlah lapisan demi performa."
  },
  "he": {
    "layers-title": "שכבות",
    "layer-title": "שכבה {index}",
    "add-layer": "הוסף שכבה",
    "remove-layer": "הסר",
    "move-up": "הזז למעלה",
    "move-down": "הזז למטה",
    "layer-settings-title": "הגדרות שכבה",
    "offset-x": "היסט X",
    "offset-y": "היסט Y",
    "blur": "טשטוש",
    "spread": "פריסה",
    "color": "צבע",
    "inset": "פנימי",
    "unit-px": "px",
    "preview-title": "תצוגה מקדימה",
    "output-title": "פלט CSS",
    "output-hint": "העתק את ערך box-shadow ל-CSS שלך.",
    "dark-background": "רקע כהה",
    "what-title": "מה זה box-shadow?",
    "what-p1": "box-shadow הוא מאפיין CSS שמצייר צל אחד או יותר מאחורי (או בתוך) רכיב.",
    "what-p2": "כל צל משתמש בהסטה אופקית ואנכית, רדיוס טשטוש, התפשטות אופציונלית וצבע עם אלפא; הוספת inset יוצרת צל פנימי.",
    "what-p3": "שכבות מרובות מופרדות בפסיקים ומאפשרות לערום צללים עדינים ליצירת עומק, זוהר או קצוות חדים.",
    "what-b1": "הסטות קטנות עם טשטוש גדול יוצרות תחושת גובה רכה.",
    "what-b2": "אטימות גבוהה עם מעט טשטוש נותנת קצוות חדים יותר.",
    "what-b3": "שלבו צל חיצוני עם צל פנימי להעמקת המראה.",
    "what-b4": "הגבילו את מספר השכבות לשיפור ביצועים."
  },
  "ms": {
    "layers-title": "Lapisan",
    "layer-title": "Lapisan {index}",
    "add-layer": "Tambah lapisan",
    "remove-layer": "Buang",
    "move-up": "Alih ke atas",
    "move-down": "Alih ke bawah",
    "layer-settings-title": "Tetapan lapisan",
    "offset-x": "Ofset X",
    "offset-y": "Ofset Y",
    "blur": "Kabur",
    "spread": "Sebaran",
    "color": "Warna",
    "inset": "Dalam",
    "unit-px": "px",
    "preview-title": "Pratonton",
    "output-title": "Output CSS",
    "output-hint": "Salin nilai box-shadow ke CSS anda.",
    "dark-background": "Latar gelap",
    "what-title": "Apakah box-shadow?",
    "what-p1": "box-shadow ialah sifat CSS yang melukis satu atau lebih bayang di belakang (atau di dalam) elemen.",
    "what-p2": "Setiap bayang menggunakan ofset mendatar dan menegak, jejari kabur, sebaran pilihan dan warna dengan alfa; tambah inset untuk menjadi bayang dalaman.",
    "what-p3": "Berbilang lapisan dipisahkan dengan koma, membolehkan bayang halus ditindan untuk menghasilkan kedalaman, cahaya, atau tepi yang tajam.",
    "what-b1": "Gunakan ofset kecil dengan kabur lebih besar untuk elevasi lembut.",
    "what-b2": "Gunakan kelegapan lebih tinggi dengan kabur kecil untuk tepi lebih tajam.",
    "what-b3": "Gabungkan bayang luar dan bayang dalam untuk menambah kedalaman.",
    "what-b4": "Hadkan bilangan lapisan untuk prestasi lebih baik."
  },
  "no": {
    "layers-title": "Lag",
    "layer-title": "Lag {index}",
    "add-layer": "Legg til lag",
    "remove-layer": "Fjern",
    "move-up": "Flytt opp",
    "move-down": "Flytt ned",
    "layer-settings-title": "Laginnstillinger",
    "offset-x": "Forskyvning X",
    "offset-y": "Forskyvning Y",
    "blur": "Uskarphet",
    "spread": "Spredning",
    "color": "Farge",
    "inset": "Innvendig",
    "unit-px": "px",
    "preview-title": "Forhåndsvisning",
    "output-title": "CSS-utdata",
    "output-hint": "Kopier box-shadow-verdien inn i CSS-en din.",
    "dark-background": "Mørk bakgrunn",
    "what-title": "Hva er box-shadow?",
    "what-p1": "box-shadow er en CSS-egenskap som tegner én eller flere skygger bak (eller inne i) et element.",
    "what-p2": "Hver skygge bruker horisontal og vertikal forskyvning, uskarphetsradius, valgfri spredning og en farge med alfa; legg til inset for å få en indre skygge.",
    "what-p3": "Flere lag skilles med komma, slik at du kan stable subtile skygger for dybde, glød eller skarpe kanter.",
    "what-b1": "Små forskyvninger med mer uskarphet gir myk elevasjon.",
    "what-b2": "Høyere opasitet med lite uskarphet gir skarpere kanter.",
    "what-b3": "Kombiner ytre og indre skygge for mer dybde.",
    "what-b4": "Begrens antall lag for bedre ytelse."
  }
}
</i18n>
