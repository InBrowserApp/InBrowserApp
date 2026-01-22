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
          >
            <n-flex align="center" justify="space-between" :size="8" wrap>
              <n-button text @click="setActiveLayer(layer.id)" :data-testid="`layer-${index}`">
                {{ t('layer-title', { index: index + 1 }) }}
              </n-button>
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
  NSlider,
  NSwitch,
  NTag,
  NText,
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
  const temp = nextLayers[index]
  nextLayers[index] = nextLayers[nextIndex]
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
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.layer-card-active {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35);
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
    "dark-background": "Dark background"
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
    "dark-background": "深色背景"
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
    "dark-background": "深色背景"
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
    "dark-background": "深色背景"
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
    "dark-background": "深色背景"
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
    "dark-background": "Fondo oscuro"
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
    "dark-background": "Fond sombre"
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
    "dark-background": "Dunkler Hintergrund"
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
    "dark-background": "Sfondo scuro"
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
    "dark-background": "暗い背景"
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
    "dark-background": "어두운 배경"
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
    "dark-background": "Темный фон"
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
    "dark-background": "Fundo escuro"
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
    "dark-background": "خلفية داكنة"
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
    "dark-background": "गहरा बैकग्राउंड"
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
    "dark-background": "Koyu arka plan"
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
    "dark-background": "Donkere achtergrond"
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
    "dark-background": "Mörk bakgrund"
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
    "dark-background": "Ciemne tło"
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
    "dark-background": "Nền tối"
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
    "dark-background": "พื้นหลังเข้ม"
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
    "dark-background": "Latar gelap"
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
    "dark-background": "רקע כהה"
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
    "dark-background": "Latar gelap"
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
    "dark-background": "Mørk bakgrunn"
  }
}
</i18n>
