<template>
  <n-flex vertical :size="12">
    <n-card
      v-for="(layer, index) in layers"
      :key="layer.id"
      size="small"
      :class="['layer-card', { 'layer-card-active': layer.id === activeLayerId }]"
      data-testid="layer-card"
      @click="handleSetActive(layer.id)"
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
            quaternary
            circle
            size="small"
            :disabled="index === 0"
            :aria-label="t('move-up')"
            :data-testid="`layer-up-${index}`"
            @click="handleMoveLayer(layer.id, -1)"
          >
            <template #icon>
              <n-icon :component="ArrowUp16Regular" />
            </template>
          </n-button>
          <n-button
            quaternary
            circle
            size="small"
            :disabled="index === layers.length - 1"
            :aria-label="t('move-down')"
            :data-testid="`layer-down-${index}`"
            @click="handleMoveLayer(layer.id, 1)"
          >
            <template #icon>
              <n-icon :component="ArrowDown16Regular" />
            </template>
          </n-button>
          <n-button
            quaternary
            circle
            size="small"
            :disabled="layers.length === 1"
            :aria-label="t('remove-layer')"
            :data-testid="`layer-remove-${index}`"
            @click="handleRemoveLayer(layer.id)"
          >
            <template #icon>
              <n-icon :component="Delete16Regular" />
            </template>
          </n-button>
        </n-flex>
      </n-flex>
    </n-card>
    <n-button dashed type="primary" data-testid="add-layer" @click="handleAddLayer">
      <template #icon>
        <n-icon :component="Add16Regular" />
      </template>
      {{ t('add-layer') }}
    </n-button>
  </n-flex>
</template>

<script setup lang="ts">
import { NButton, NCard, NFlex, NIcon, NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import Add16Regular from '@vicons/fluent/Add16Regular'
import ArrowDown16Regular from '@vicons/fluent/ArrowDown16Regular'
import ArrowUp16Regular from '@vicons/fluent/ArrowUp16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import type { ShadowLayer } from '../utils/shadow'

const { t } = useI18n()

defineProps<{
  layers: ShadowLayer[]
  activeLayerId: string
}>()

const emit = defineEmits<{
  (event: 'set-active', value: string): void
  (event: 'add-layer'): void
  (event: 'remove-layer', value: string): void
  (event: 'move-layer', value: { id: string; direction: number }): void
}>()

function handleSetActive(value: string) {
  emit('set-active', value)
}

function handleAddLayer() {
  emit('add-layer')
}

function handleRemoveLayer(value: string) {
  emit('remove-layer', value)
}

function handleMoveLayer(id: string, direction: number) {
  emit('move-layer', { id, direction })
}
</script>

<style scoped>
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
</style>

<i18n lang="json">
{
  "en": {
    "layer-title": "Layer {index}",
    "add-layer": "Add layer",
    "remove-layer": "Remove",
    "move-up": "Move up",
    "move-down": "Move down",
    "inset": "Inset"
  },
  "zh": {
    "layer-title": "图层 {index}",
    "add-layer": "添加图层",
    "remove-layer": "移除",
    "move-up": "上移",
    "move-down": "下移",
    "inset": "内阴影"
  },
  "zh-CN": {
    "layer-title": "图层 {index}",
    "add-layer": "添加图层",
    "remove-layer": "移除",
    "move-up": "上移",
    "move-down": "下移",
    "inset": "内阴影"
  },
  "zh-TW": {
    "layer-title": "圖層 {index}",
    "add-layer": "新增圖層",
    "remove-layer": "移除",
    "move-up": "上移",
    "move-down": "下移",
    "inset": "內陰影"
  },
  "zh-HK": {
    "layer-title": "圖層 {index}",
    "add-layer": "新增圖層",
    "remove-layer": "移除",
    "move-up": "上移",
    "move-down": "下移",
    "inset": "內陰影"
  },
  "es": {
    "layer-title": "Capa {index}",
    "add-layer": "Añadir capa",
    "remove-layer": "Eliminar",
    "move-up": "Subir",
    "move-down": "Bajar",
    "inset": "Interior"
  },
  "fr": {
    "layer-title": "Calque {index}",
    "add-layer": "Ajouter un calque",
    "remove-layer": "Supprimer",
    "move-up": "Monter",
    "move-down": "Descendre",
    "inset": "Interne"
  },
  "de": {
    "layer-title": "Ebene {index}",
    "add-layer": "Ebene hinzufügen",
    "remove-layer": "Entfernen",
    "move-up": "Nach oben",
    "move-down": "Nach unten",
    "inset": "Innen"
  },
  "it": {
    "layer-title": "Livello {index}",
    "add-layer": "Aggiungi livello",
    "remove-layer": "Rimuovi",
    "move-up": "Sposta su",
    "move-down": "Sposta giù",
    "inset": "Interno"
  },
  "ja": {
    "layer-title": "レイヤー {index}",
    "add-layer": "レイヤーを追加",
    "remove-layer": "削除",
    "move-up": "上へ",
    "move-down": "下へ",
    "inset": "内側"
  },
  "ko": {
    "layer-title": "레이어 {index}",
    "add-layer": "레이어 추가",
    "remove-layer": "제거",
    "move-up": "위로 이동",
    "move-down": "아래로 이동",
    "inset": "내부"
  },
  "ru": {
    "layer-title": "Слой {index}",
    "add-layer": "Добавить слой",
    "remove-layer": "Удалить",
    "move-up": "Вверх",
    "move-down": "Вниз",
    "inset": "Внутренний"
  },
  "pt": {
    "layer-title": "Camada {index}",
    "add-layer": "Adicionar camada",
    "remove-layer": "Remover",
    "move-up": "Mover para cima",
    "move-down": "Mover para baixo",
    "inset": "Interno"
  },
  "ar": {
    "layer-title": "الطبقة {index}",
    "add-layer": "إضافة طبقة",
    "remove-layer": "إزالة",
    "move-up": "تحريك للأعلى",
    "move-down": "تحريك للأسفل",
    "inset": "داخلي"
  },
  "hi": {
    "layer-title": "परत {index}",
    "add-layer": "परत जोड़ें",
    "remove-layer": "हटाएँ",
    "move-up": "ऊपर ले जाएँ",
    "move-down": "नीचे ले जाएँ",
    "inset": "भीतरी"
  },
  "tr": {
    "layer-title": "Katman {index}",
    "add-layer": "Katman ekle",
    "remove-layer": "Kaldır",
    "move-up": "Yukarı taşı",
    "move-down": "Aşağı taşı",
    "inset": "İç"
  },
  "nl": {
    "layer-title": "Laag {index}",
    "add-layer": "Laag toevoegen",
    "remove-layer": "Verwijderen",
    "move-up": "Omhoog",
    "move-down": "Omlaag",
    "inset": "Binnen"
  },
  "sv": {
    "layer-title": "Lager {index}",
    "add-layer": "Lägg till lager",
    "remove-layer": "Ta bort",
    "move-up": "Flytta upp",
    "move-down": "Flytta ner",
    "inset": "Inre"
  },
  "pl": {
    "layer-title": "Warstwa {index}",
    "add-layer": "Dodaj warstwę",
    "remove-layer": "Usuń",
    "move-up": "Przesuń w górę",
    "move-down": "Przesuń w dół",
    "inset": "Wewnętrzny"
  },
  "vi": {
    "layer-title": "Lớp {index}",
    "add-layer": "Thêm lớp",
    "remove-layer": "Xóa",
    "move-up": "Di chuyển lên",
    "move-down": "Di chuyển xuống",
    "inset": "Bên trong"
  },
  "th": {
    "layer-title": "เลเยอร์ {index}",
    "add-layer": "เพิ่มเลเยอร์",
    "remove-layer": "ลบ",
    "move-up": "ย้ายขึ้น",
    "move-down": "ย้ายลง",
    "inset": "ด้านใน"
  },
  "id": {
    "layer-title": "Lapisan {index}",
    "add-layer": "Tambah lapisan",
    "remove-layer": "Hapus",
    "move-up": "Pindahkan ke atas",
    "move-down": "Pindahkan ke bawah",
    "inset": "Inset"
  },
  "he": {
    "layer-title": "שכבה {index}",
    "add-layer": "הוסף שכבה",
    "remove-layer": "הסר",
    "move-up": "הזז למעלה",
    "move-down": "הזז למטה",
    "inset": "פנימי"
  },
  "ms": {
    "layer-title": "Lapisan {index}",
    "add-layer": "Tambah lapisan",
    "remove-layer": "Buang",
    "move-up": "Alih ke atas",
    "move-down": "Alih ke bawah",
    "inset": "Dalam"
  },
  "no": {
    "layer-title": "Lag {index}",
    "add-layer": "Legg til lag",
    "remove-layer": "Fjern",
    "move-up": "Flytt opp",
    "move-down": "Flytt ned",
    "inset": "Innvendig"
  }
}
</i18n>
