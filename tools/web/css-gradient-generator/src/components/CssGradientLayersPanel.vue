<template>
  <n-card class="panel">
    <div class="panel__header">
      <div>
        <div class="panel__title">{{ t('layersTitle') }}</div>
        <div class="panel__subtitle">{{ t('layersSubtitle') }}</div>
      </div>
      <n-button size="small" data-testid="add-layer" @click="handleAddLayer">
        <template #icon>
          <n-icon :component="Add16Regular" />
        </template>
        {{ t('addLayer') }}
      </n-button>
    </div>
    <CssGradientLayerList
      :layers="layers"
      :active-layer-id="activeLayerId"
      @set-active="handleSetActive"
      @duplicate-layer="handleDuplicateLayer"
      @move-layer="handleMoveLayer"
      @remove-layer="handleRemoveLayer"
    />
    <n-alert
      v-if="showError"
      type="warning"
      :show-icon="false"
      class="panel__alert"
      data-testid="layer-error"
    >
      {{ t('minLayerHint') }}
    </n-alert>
  </n-card>
</template>

<script setup lang="ts">
import { NAlert, NButton, NCard, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import Add16Regular from '@vicons/fluent/Add16Regular'
import CssGradientLayerList from './CssGradientLayerList.vue'
import type { GradientLayer } from '../types'

defineProps<{
  layers: GradientLayer[]
  activeLayerId: string
  showError: boolean
}>()

const emit = defineEmits<{
  (event: 'set-active', id: string): void
  (event: 'add-layer'): void
  (event: 'duplicate-layer', id: string): void
  (event: 'move-layer', index: number, direction: number): void
  (event: 'remove-layer', id: string): void
}>()

const { t } = useI18n()

function handleSetActive(id: string) {
  emit('set-active', id)
}

function handleAddLayer() {
  emit('add-layer')
}

function handleDuplicateLayer(id: string) {
  emit('duplicate-layer', id)
}

function handleMoveLayer(index: number, direction: number) {
  emit('move-layer', index, direction)
}

function handleRemoveLayer(id: string) {
  emit('remove-layer', id)
}
</script>

<i18n lang="json">
{
  "en": {
    "layersTitle": "Layers",
    "layersSubtitle": "Stack multiple gradients for depth.",
    "addLayer": "Add layer",
    "minLayerHint": "You need at least one layer."
  },
  "zh": {
    "layersTitle": "图层",
    "layersSubtitle": "叠加多层渐变以增加层次。",
    "addLayer": "添加图层",
    "minLayerHint": "至少需要保留一个图层。"
  },
  "zh-CN": {
    "layersTitle": "图层",
    "layersSubtitle": "叠加多层渐变以增加层次。",
    "addLayer": "添加图层",
    "minLayerHint": "至少需要保留一个图层。"
  },
  "zh-TW": {
    "layersTitle": "圖層",
    "layersSubtitle": "疊加多層漸層以增加層次。",
    "addLayer": "新增圖層",
    "minLayerHint": "至少需要保留一個圖層。"
  },
  "zh-HK": {
    "layersTitle": "圖層",
    "layersSubtitle": "疊加多層漸層以增加層次。",
    "addLayer": "新增圖層",
    "minLayerHint": "至少需要保留一個圖層。"
  },
  "es": {
    "layersTitle": "Capas",
    "layersSubtitle": "Apila varios gradientes para dar profundidad.",
    "addLayer": "Añadir capa",
    "minLayerHint": "Necesitas al menos una capa."
  },
  "fr": {
    "layersTitle": "Calques",
    "layersSubtitle": "Empilez plusieurs dégradés pour plus de profondeur.",
    "addLayer": "Ajouter un calque",
    "minLayerHint": "Au moins un calque est requis."
  },
  "de": {
    "layersTitle": "Ebenen",
    "layersSubtitle": "Stapeln Sie mehrere Verläufe für mehr Tiefe.",
    "addLayer": "Ebene hinzufügen",
    "minLayerHint": "Mindestens eine Ebene ist erforderlich."
  },
  "it": {
    "layersTitle": "Livelli",
    "layersSubtitle": "Sovrapponi gradienti per profondità.",
    "addLayer": "Aggiungi livello",
    "minLayerHint": "Serve almeno un livello."
  },
  "ja": {
    "layersTitle": "レイヤー",
    "layersSubtitle": "複数のグラデーションを重ねて奥行きを追加。",
    "addLayer": "レイヤーを追加",
    "minLayerHint": "少なくとも 1 つのレイヤーが必要です。"
  },
  "ko": {
    "layersTitle": "레이어",
    "layersSubtitle": "여러 그라디언트를 쌓아 깊이를 만듭니다.",
    "addLayer": "레이어 추가",
    "minLayerHint": "최소 한 개의 레이어가 필요합니다."
  },
  "ru": {
    "layersTitle": "Слои",
    "layersSubtitle": "Накладывайте градиенты для глубины.",
    "addLayer": "Добавить слой",
    "minLayerHint": "Нужен хотя бы один слой."
  },
  "pt": {
    "layersTitle": "Camadas",
    "layersSubtitle": "Empilhe gradientes para dar profundidade.",
    "addLayer": "Adicionar camada",
    "minLayerHint": "É necessária pelo menos uma camada."
  },
  "ar": {
    "layersTitle": "الطبقات",
    "layersSubtitle": "كدّس تدرجات متعددة لإضفاء عمق.",
    "addLayer": "إضافة طبقة",
    "minLayerHint": "تحتاج طبقة واحدة على الأقل."
  },
  "hi": {
    "layersTitle": "परतें",
    "layersSubtitle": "गहराई के लिए कई ग्रेडिएंट स्टैक करें।",
    "addLayer": "परत जोड़ें",
    "minLayerHint": "कम से कम एक परत आवश्यक है।"
  },
  "tr": {
    "layersTitle": "Katmanlar",
    "layersSubtitle": "Derinlik için gradyanları üst üste koyun.",
    "addLayer": "Katman ekle",
    "minLayerHint": "En az bir katman gerekli."
  },
  "nl": {
    "layersTitle": "Lagen",
    "layersSubtitle": "Stapel meerdere gradients voor diepte.",
    "addLayer": "Laag toevoegen",
    "minLayerHint": "Er is minimaal één laag nodig."
  },
  "sv": {
    "layersTitle": "Lager",
    "layersSubtitle": "Stapla flera gradienter för djup.",
    "addLayer": "Lägg till lager",
    "minLayerHint": "Minst ett lager krävs."
  },
  "pl": {
    "layersTitle": "Warstwy",
    "layersSubtitle": "Nakładaj gradienty dla głębi.",
    "addLayer": "Dodaj warstwę",
    "minLayerHint": "Wymagana jest co najmniej jedna warstwa."
  },
  "vi": {
    "layersTitle": "Lớp",
    "layersSubtitle": "Xếp nhiều gradient để tạo chiều sâu.",
    "addLayer": "Thêm lớp",
    "minLayerHint": "Cần ít nhất một lớp."
  },
  "th": {
    "layersTitle": "เลเยอร์",
    "layersSubtitle": "ซ้อนหลายไล่สีเพื่อเพิ่มมิติ",
    "addLayer": "เพิ่มเลเยอร์",
    "minLayerHint": "ต้องมีอย่างน้อยหนึ่งเลเยอร์"
  },
  "id": {
    "layersTitle": "Lapisan",
    "layersSubtitle": "Tumpuk gradien untuk kedalaman.",
    "addLayer": "Tambah lapisan",
    "minLayerHint": "Minimal satu lapisan diperlukan."
  },
  "he": {
    "layersTitle": "שכבות",
    "layersSubtitle": "ערמו גרדיאנטים להעמקת המראה.",
    "addLayer": "הוסף שכבה",
    "minLayerHint": "נדרשת לפחות שכבה אחת."
  },
  "ms": {
    "layersTitle": "Lapisan",
    "layersSubtitle": "Susun beberapa gradien untuk kedalaman.",
    "addLayer": "Tambah lapisan",
    "minLayerHint": "Sekurang-kurangnya satu lapisan diperlukan."
  },
  "no": {
    "layersTitle": "Lag",
    "layersSubtitle": "Stable gradienter for mer dybde.",
    "addLayer": "Legg til lag",
    "minLayerHint": "Minst ett lag er nødvendig."
  }
}
</i18n>
