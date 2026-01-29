<template>
  <div class="layer-list">
    <button
      v-for="(layer, index) in layers"
      :key="layer.id"
      type="button"
      class="layer-card"
      :class="{ 'layer-card--active': layer.id === activeLayerId }"
      :data-testid="`layer-${layer.id}`"
      @click="handleSetActive(layer.id)"
    >
      <div class="layer-card__preview" :style="layerPreviewStyle(layer)" />
      <div class="layer-card__meta">
        <div class="layer-card__title">{{ t('layerLabel', { index: index + 1 }) }}</div>
        <div class="layer-card__subtitle">{{ typeLabelMap[layer.type] }}</div>
      </div>
      <div class="layer-card__actions">
        <n-button
          size="tiny"
          tertiary
          :data-testid="`layer-duplicate-${layer.id}`"
          @click.stop="handleDuplicateLayer(layer.id)"
        >
          {{ t('duplicateLayer') }}
        </n-button>
        <n-button
          size="tiny"
          tertiary
          :disabled="index === 0"
          :data-testid="`layer-up-${layer.id}`"
          @click.stop="handleMoveLayer(index, -1)"
        >
          {{ t('moveUp') }}
        </n-button>
        <n-button
          size="tiny"
          tertiary
          :disabled="index === layers.length - 1"
          :data-testid="`layer-down-${layer.id}`"
          @click.stop="handleMoveLayer(index, 1)"
        >
          {{ t('moveDown') }}
        </n-button>
        <n-button
          size="tiny"
          tertiary
          type="error"
          :disabled="layers.length === 1"
          :data-testid="`layer-delete-${layer.id}`"
          @click.stop="handleRemoveLayer(layer.id)"
        >
          {{ t('deleteLayer') }}
        </n-button>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { GradientLayer, GradientType } from '../types'
import { createGradientCss } from '../utils/gradient'

const { t } = useI18n()

defineProps<{
  layers: GradientLayer[]
  activeLayerId: string
}>()

const emit = defineEmits<{
  (event: 'set-active', id: string): void
  (event: 'duplicate-layer', id: string): void
  (event: 'move-layer', index: number, direction: number): void
  (event: 'remove-layer', id: string): void
}>()

const typeLabelMap = computed<Record<GradientType, string>>(() => ({
  linear: t('type.linear'),
  radial: t('type.radial'),
  conic: t('type.conic'),
}))

const layerPreviewStyle = (layer: GradientLayer) => ({
  backgroundImage: createGradientCss(layer, 'hex'),
  backgroundBlendMode: layer.blendMode,
})

function handleSetActive(id: string) {
  emit('set-active', id)
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

<style scoped>
.layer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.layer-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  width: 100%;
  text-align: left;
  border-radius: 12px;
  border: 1px solid transparent;
  background: var(--n-color);
  cursor: pointer;
}

.layer-card--active {
  border-color: rgba(59, 130, 246, 0.55);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.layer-card__preview {
  width: 54px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  flex-shrink: 0;
}

.layer-card__meta {
  flex: 1;
  min-width: 0;
}

.layer-card__title {
  font-weight: 600;
  font-size: 14px;
}

.layer-card__subtitle {
  font-size: 12px;
  color: var(--n-text-color-3);
}

.layer-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>

<i18n lang="json">
{
  "en": {
    "layerLabel": "Layer {index}",
    "duplicateLayer": "Duplicate",
    "moveUp": "Up",
    "moveDown": "Down",
    "deleteLayer": "Delete",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Conic"
    }
  },
  "zh": {
    "layerLabel": "图层 {index}",
    "duplicateLayer": "复制",
    "moveUp": "上移",
    "moveDown": "下移",
    "deleteLayer": "删除",
    "type": {
      "linear": "线性",
      "radial": "径向",
      "conic": "圆锥"
    }
  },
  "zh-CN": {
    "layerLabel": "图层 {index}",
    "duplicateLayer": "复制",
    "moveUp": "上移",
    "moveDown": "下移",
    "deleteLayer": "删除",
    "type": {
      "linear": "线性",
      "radial": "径向",
      "conic": "圆锥"
    }
  },
  "zh-TW": {
    "layerLabel": "圖層 {index}",
    "duplicateLayer": "複製",
    "moveUp": "上移",
    "moveDown": "下移",
    "deleteLayer": "刪除",
    "type": {
      "linear": "線性",
      "radial": "放射",
      "conic": "圓錐"
    }
  },
  "zh-HK": {
    "layerLabel": "圖層 {index}",
    "duplicateLayer": "複製",
    "moveUp": "上移",
    "moveDown": "下移",
    "deleteLayer": "刪除",
    "type": {
      "linear": "線性",
      "radial": "放射",
      "conic": "圓錐"
    }
  },
  "es": {
    "layerLabel": "Capa {index}",
    "duplicateLayer": "Duplicar",
    "moveUp": "Subir",
    "moveDown": "Bajar",
    "deleteLayer": "Eliminar",
    "type": {
      "linear": "Lineal",
      "radial": "Radial",
      "conic": "Cónico"
    }
  },
  "fr": {
    "layerLabel": "Calque {index}",
    "duplicateLayer": "Dupliquer",
    "moveUp": "Monter",
    "moveDown": "Descendre",
    "deleteLayer": "Supprimer",
    "type": {
      "linear": "Linéaire",
      "radial": "Radial",
      "conic": "Conique"
    }
  },
  "de": {
    "layerLabel": "Ebene {index}",
    "duplicateLayer": "Duplizieren",
    "moveUp": "Hoch",
    "moveDown": "Runter",
    "deleteLayer": "Löschen",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Konisch"
    }
  },
  "it": {
    "layerLabel": "Livello {index}",
    "duplicateLayer": "Duplica",
    "moveUp": "Su",
    "moveDown": "Giù",
    "deleteLayer": "Elimina",
    "type": {
      "linear": "Lineare",
      "radial": "Radiale",
      "conic": "Conico"
    }
  },
  "ja": {
    "layerLabel": "レイヤー {index}",
    "duplicateLayer": "複製",
    "moveUp": "上へ",
    "moveDown": "下へ",
    "deleteLayer": "削除",
    "type": {
      "linear": "線形",
      "radial": "放射",
      "conic": "円錐"
    }
  },
  "ko": {
    "layerLabel": "레이어 {index}",
    "duplicateLayer": "복제",
    "moveUp": "위",
    "moveDown": "아래",
    "deleteLayer": "삭제",
    "type": {
      "linear": "선형",
      "radial": "방사형",
      "conic": "원뿔형"
    }
  },
  "ru": {
    "layerLabel": "Слой {index}",
    "duplicateLayer": "Дублировать",
    "moveUp": "Вверх",
    "moveDown": "Вниз",
    "deleteLayer": "Удалить",
    "type": {
      "linear": "Линейный",
      "radial": "Радиальный",
      "conic": "Конический"
    }
  },
  "pt": {
    "layerLabel": "Camada {index}",
    "duplicateLayer": "Duplicar",
    "moveUp": "Subir",
    "moveDown": "Descer",
    "deleteLayer": "Excluir",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Cônico"
    }
  },
  "ar": {
    "layerLabel": "طبقة {index}",
    "duplicateLayer": "تكرار",
    "moveUp": "أعلى",
    "moveDown": "أسفل",
    "deleteLayer": "حذف",
    "type": {
      "linear": "خطي",
      "radial": "شعاعي",
      "conic": "مخروطي"
    }
  },
  "hi": {
    "layerLabel": "परत {index}",
    "duplicateLayer": "डुप्लिकेट",
    "moveUp": "ऊपर",
    "moveDown": "नीचे",
    "deleteLayer": "हटाएं",
    "type": {
      "linear": "रेखीय",
      "radial": "रेडियल",
      "conic": "कोनिक"
    }
  },
  "tr": {
    "layerLabel": "Katman {index}",
    "duplicateLayer": "Çoğalt",
    "moveUp": "Yukarı",
    "moveDown": "Aşağı",
    "deleteLayer": "Sil",
    "type": {
      "linear": "Doğrusal",
      "radial": "Radyal",
      "conic": "Konik"
    }
  },
  "nl": {
    "layerLabel": "Laag {index}",
    "duplicateLayer": "Dupliceren",
    "moveUp": "Omhoog",
    "moveDown": "Omlaag",
    "deleteLayer": "Verwijderen",
    "type": {
      "linear": "Lineair",
      "radial": "Radiaal",
      "conic": "Conisch"
    }
  },
  "sv": {
    "layerLabel": "Lager {index}",
    "duplicateLayer": "Duplicera",
    "moveUp": "Upp",
    "moveDown": "Ner",
    "deleteLayer": "Ta bort",
    "type": {
      "linear": "Linjär",
      "radial": "Radiell",
      "conic": "Konisk"
    }
  },
  "pl": {
    "layerLabel": "Warstwa {index}",
    "duplicateLayer": "Duplikuj",
    "moveUp": "W górę",
    "moveDown": "W dół",
    "deleteLayer": "Usuń",
    "type": {
      "linear": "Liniowy",
      "radial": "Radialny",
      "conic": "Stożkowy"
    }
  },
  "vi": {
    "layerLabel": "Lớp {index}",
    "duplicateLayer": "Nhân bản",
    "moveUp": "Lên",
    "moveDown": "Xuống",
    "deleteLayer": "Xóa",
    "type": {
      "linear": "Tuyến tính",
      "radial": "Xuyên tâm",
      "conic": "Hình nón"
    }
  },
  "th": {
    "layerLabel": "เลเยอร์ {index}",
    "duplicateLayer": "ทำซ้ำ",
    "moveUp": "ขึ้น",
    "moveDown": "ลง",
    "deleteLayer": "ลบ",
    "type": {
      "linear": "เชิงเส้น",
      "radial": "รัศมี",
      "conic": "กรวย"
    }
  },
  "id": {
    "layerLabel": "Lapisan {index}",
    "duplicateLayer": "Duplikat",
    "moveUp": "Naik",
    "moveDown": "Turun",
    "deleteLayer": "Hapus",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Konik"
    }
  },
  "he": {
    "layerLabel": "שכבה {index}",
    "duplicateLayer": "שכפל",
    "moveUp": "למעלה",
    "moveDown": "למטה",
    "deleteLayer": "מחק",
    "type": {
      "linear": "ליניארי",
      "radial": "רדיאלי",
      "conic": "קוני"
    }
  },
  "ms": {
    "layerLabel": "Lapisan {index}",
    "duplicateLayer": "Gandakan",
    "moveUp": "Naik",
    "moveDown": "Turun",
    "deleteLayer": "Padam",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Konik"
    }
  },
  "no": {
    "layerLabel": "Lag {index}",
    "duplicateLayer": "Dupliser",
    "moveUp": "Opp",
    "moveDown": "Ned",
    "deleteLayer": "Slett",
    "type": {
      "linear": "Lineær",
      "radial": "Radial",
      "conic": "Konisk"
    }
  }
}
</i18n>
