<template>
  <n-card class="panel">
    <div class="panel__header">
      <div>
        <div class="panel__title">{{ t('stopsTitle') }}</div>
        <div class="panel__subtitle">{{ t('trackHint') }}</div>
      </div>
      <n-button size="small" data-testid="add-stop" @click="handleAddStopClick">
        <template #icon>
          <n-icon :component="Pin16Regular" />
        </template>
        {{ t('addStop') }}
      </n-button>
    </div>
    <GradientStopsTrack
      :stops="stops"
      :active-stop-id="activeStopId"
      :gradient-css="gradientCss"
      @add="handleAddStop"
      @select="handleSelectStop"
      @update="handleUpdateStop"
    />
    <div class="stop-editor">
      <div class="stop-editor__row">
        <div class="stop-editor__label">{{ t('stopColor') }}</div>
        <n-color-picker
          v-model:value="stopColorModel"
          :show-alpha="true"
          :modes="['hex']"
          data-testid="stop-color"
        />
      </div>
      <div class="stop-editor__row">
        <div class="stop-editor__label">{{ t('stopPosition') }}</div>
        <div class="stop-editor__controls">
          <n-slider v-model:value="stopPositionModel" :min="0" :max="100" />
          <n-input-number v-model:value="stopPositionModel" :min="0" :max="100" size="small" />
        </div>
      </div>
      <n-flex align="center" justify="space-between" :wrap="true">
        <n-button size="small" type="error" data-testid="remove-stop" @click="handleRemoveStop">
          <template #icon>
            <n-icon :component="PinOff16Regular" />
          </template>
          {{ t('deleteStop') }}
        </n-button>
        <n-text depth="3">{{ t('minStopsHint') }}</n-text>
      </n-flex>
    </div>
    <n-alert
      v-if="showError"
      type="warning"
      :show-icon="false"
      class="panel__alert"
      data-testid="stop-error"
    >
      {{ t('minStopsHint') }}
    </n-alert>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
  NColorPicker,
  NFlex,
  NIcon,
  NInputNumber,
  NSlider,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import Pin16Regular from '@vicons/fluent/Pin16Regular'
import PinOff16Regular from '@vicons/fluent/PinOff16Regular'
import GradientStopsTrack from './GradientStopsTrack.vue'
import type { GradientStop } from '../types'

const { t } = useI18n()

const props = defineProps<{
  stops: GradientStop[]
  activeStopId: string | null
  gradientCss: string
  stopColor: string
  stopPosition: number
  showError: boolean
}>()

const emit = defineEmits<{
  (event: 'add-stop', position?: number): void
  (event: 'select-stop', id: string): void
  (event: 'update-stop', id: string, position: number): void
  (event: 'remove-stop'): void
  (event: 'update:stopColor', value: string): void
  (event: 'update:stopPosition', value: number): void
}>()

const stopColorModel = computed({
  get: () => props.stopColor,
  set: (value: string) => emit('update:stopColor', value),
})

const stopPositionModel = computed({
  get: () => props.stopPosition,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    emit('update:stopPosition', value)
  },
})

function handleAddStopClick() {
  emit('add-stop')
}

function handleAddStop(position: number) {
  emit('add-stop', position)
}

function handleSelectStop(id: string) {
  emit('select-stop', id)
}

function handleUpdateStop(id: string, position: number) {
  emit('update-stop', id, position)
}

function handleRemoveStop() {
  emit('remove-stop')
}
</script>

<style scoped>
.stop-editor {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stop-editor__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.stop-editor__label {
  font-size: 13px;
  color: var(--n-text-color-3);
}

.stop-editor__controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 220px;
}
</style>

<i18n lang="json">
{
  "en": {
    "stopsTitle": "Color Stops",
    "trackHint": "Click to add a stop. Drag handles to move.",
    "stopColor": "Stop color",
    "stopPosition": "Position",
    "addStop": "Add stop",
    "deleteStop": "Delete stop",
    "minStopsHint": "At least two stops are required."
  },
  "zh": {
    "stopsTitle": "颜色停靠点",
    "trackHint": "点击添加停靠点，拖拽调整位置。",
    "stopColor": "停靠点颜色",
    "stopPosition": "位置",
    "addStop": "添加停靠点",
    "deleteStop": "删除停靠点",
    "minStopsHint": "至少保留两个停靠点。"
  },
  "zh-CN": {
    "stopsTitle": "颜色停靠点",
    "trackHint": "点击添加停靠点，拖拽调整位置。",
    "stopColor": "停靠点颜色",
    "stopPosition": "位置",
    "addStop": "添加停靠点",
    "deleteStop": "删除停靠点",
    "minStopsHint": "至少保留两个停靠点。"
  },
  "zh-TW": {
    "stopsTitle": "色標",
    "trackHint": "點擊新增色標，拖曳調整位置。",
    "stopColor": "色標顏色",
    "stopPosition": "位置",
    "addStop": "新增色標",
    "deleteStop": "刪除色標",
    "minStopsHint": "至少保留兩個色標。"
  },
  "zh-HK": {
    "stopsTitle": "色標",
    "trackHint": "點擊新增色標，拖曳調整位置。",
    "stopColor": "色標顏色",
    "stopPosition": "位置",
    "addStop": "新增色標",
    "deleteStop": "刪除色標",
    "minStopsHint": "至少保留兩個色標。"
  },
  "es": {
    "stopsTitle": "Paradas de color",
    "trackHint": "Haz clic para añadir una parada. Arrastra para mover.",
    "stopColor": "Color de parada",
    "stopPosition": "Posición",
    "addStop": "Añadir parada",
    "deleteStop": "Eliminar parada",
    "minStopsHint": "Se necesitan al menos dos paradas."
  },
  "fr": {
    "stopsTitle": "Points de couleur",
    "trackHint": "Cliquez pour ajouter un point. Faites glisser pour déplacer.",
    "stopColor": "Couleur du point",
    "stopPosition": "Position",
    "addStop": "Ajouter un point",
    "deleteStop": "Supprimer le point",
    "minStopsHint": "Au moins deux points sont requis."
  },
  "de": {
    "stopsTitle": "Farbstopps",
    "trackHint": "Klicken zum Hinzufügen, ziehen zum Verschieben.",
    "stopColor": "Stoppfarbe",
    "stopPosition": "Position",
    "addStop": "Stopp hinzufügen",
    "deleteStop": "Stopp löschen",
    "minStopsHint": "Mindestens zwei Stopps sind erforderlich."
  },
  "it": {
    "stopsTitle": "Punti colore",
    "trackHint": "Clicca per aggiungere un punto. Trascina per spostare.",
    "stopColor": "Colore del punto",
    "stopPosition": "Posizione",
    "addStop": "Aggiungi punto",
    "deleteStop": "Rimuovi punto",
    "minStopsHint": "Sono necessari almeno due punti."
  },
  "ja": {
    "stopsTitle": "カラー停止点",
    "trackHint": "クリックで追加、ドラッグで移動。",
    "stopColor": "停止点の色",
    "stopPosition": "位置",
    "addStop": "停止点を追加",
    "deleteStop": "停止点を削除",
    "minStopsHint": "少なくとも 2 つの停止点が必要です。"
  },
  "ko": {
    "stopsTitle": "색상 스톱",
    "trackHint": "클릭해서 추가하고 드래그해서 이동하세요.",
    "stopColor": "스톱 색상",
    "stopPosition": "위치",
    "addStop": "스톱 추가",
    "deleteStop": "스톱 삭제",
    "minStopsHint": "최소 두 개의 스톱이 필요합니다."
  },
  "ru": {
    "stopsTitle": "Цветовые стопы",
    "trackHint": "Нажмите, чтобы добавить стоп. Перетащите для перемещения.",
    "stopColor": "Цвет стопа",
    "stopPosition": "Позиция",
    "addStop": "Добавить стоп",
    "deleteStop": "Удалить стоп",
    "minStopsHint": "Нужно как минимум два стопа."
  },
  "pt": {
    "stopsTitle": "Paradas de cor",
    "trackHint": "Clique para adicionar uma parada. Arraste para mover.",
    "stopColor": "Cor da parada",
    "stopPosition": "Posição",
    "addStop": "Adicionar parada",
    "deleteStop": "Excluir parada",
    "minStopsHint": "São necessárias pelo menos duas paradas."
  },
  "ar": {
    "stopsTitle": "نقاط الألوان",
    "trackHint": "انقر للإضافة واسحب للتحريك.",
    "stopColor": "لون النقطة",
    "stopPosition": "الموضع",
    "addStop": "إضافة نقطة",
    "deleteStop": "حذف النقطة",
    "minStopsHint": "يلزم نقطتان على الأقل."
  },
  "hi": {
    "stopsTitle": "रंग स्टॉप",
    "trackHint": "जोड़ने के लिए क्लिक करें, खींचकर हिलाएं।",
    "stopColor": "स्टॉप रंग",
    "stopPosition": "स्थिति",
    "addStop": "स्टॉप जोड़ें",
    "deleteStop": "स्टॉप हटाएं",
    "minStopsHint": "कम से कम दो स्टॉप आवश्यक हैं।"
  },
  "tr": {
    "stopsTitle": "Renk Durakları",
    "trackHint": "Eklemek için tıklayın, taşımak için sürükleyin.",
    "stopColor": "Durak rengi",
    "stopPosition": "Konum",
    "addStop": "Durak ekle",
    "deleteStop": "Durağı sil",
    "minStopsHint": "En az iki durak gerekir."
  },
  "nl": {
    "stopsTitle": "Kleurstops",
    "trackHint": "Klik om een stop toe te voegen, sleep om te verplaatsen.",
    "stopColor": "Stopkleur",
    "stopPosition": "Positie",
    "addStop": "Stop toevoegen",
    "deleteStop": "Stop verwijderen",
    "minStopsHint": "Minstens twee stops zijn vereist."
  },
  "sv": {
    "stopsTitle": "Färgstopp",
    "trackHint": "Klicka för att lägga till, dra för att flytta.",
    "stopColor": "Stoppfärg",
    "stopPosition": "Position",
    "addStop": "Lägg till stopp",
    "deleteStop": "Ta bort stopp",
    "minStopsHint": "Minst två stopp krävs."
  },
  "pl": {
    "stopsTitle": "Przystanki kolorów",
    "trackHint": "Kliknij, aby dodać przystanek. Przeciągnij, aby przesunąć.",
    "stopColor": "Kolor przystanku",
    "stopPosition": "Pozycja",
    "addStop": "Dodaj przystanek",
    "deleteStop": "Usuń przystanek",
    "minStopsHint": "Wymagane są co najmniej dwa przystanki."
  },
  "vi": {
    "stopsTitle": "Điểm dừng màu",
    "trackHint": "Nhấp để thêm, kéo để di chuyển.",
    "stopColor": "Màu điểm dừng",
    "stopPosition": "Vị trí",
    "addStop": "Thêm điểm dừng",
    "deleteStop": "Xóa điểm dừng",
    "minStopsHint": "Cần ít nhất hai điểm dừng."
  },
  "th": {
    "stopsTitle": "จุดสี",
    "trackHint": "คลิกเพื่อเพิ่ม ลากเพื่อย้าย",
    "stopColor": "สีของจุด",
    "stopPosition": "ตำแหน่ง",
    "addStop": "เพิ่มจุด",
    "deleteStop": "ลบจุด",
    "minStopsHint": "ต้องมีอย่างน้อยสองจุด"
  },
  "id": {
    "stopsTitle": "Titik warna",
    "trackHint": "Klik untuk menambah, seret untuk memindahkan.",
    "stopColor": "Warna titik",
    "stopPosition": "Posisi",
    "addStop": "Tambah titik",
    "deleteStop": "Hapus titik",
    "minStopsHint": "Minimal dua titik diperlukan."
  },
  "he": {
    "stopsTitle": "נקודות צבע",
    "trackHint": "לחצו להוספה וגררו להזזה.",
    "stopColor": "צבע נקודה",
    "stopPosition": "מיקום",
    "addStop": "הוסף נקודה",
    "deleteStop": "מחק נקודה",
    "minStopsHint": "נדרשות לפחות שתי נקודות."
  },
  "ms": {
    "stopsTitle": "Hentian warna",
    "trackHint": "Klik untuk tambah, seret untuk alih.",
    "stopColor": "Warna hentian",
    "stopPosition": "Kedudukan",
    "addStop": "Tambah hentian",
    "deleteStop": "Padam hentian",
    "minStopsHint": "Sekurang-kurangnya dua hentian diperlukan."
  },
  "no": {
    "stopsTitle": "Fargestopp",
    "trackHint": "Klikk for å legge til, dra for å flytte.",
    "stopColor": "Stoppfarge",
    "stopPosition": "Posisjon",
    "addStop": "Legg til stopp",
    "deleteStop": "Slett stopp",
    "minStopsHint": "Minst to stopp kreves."
  }
}
</i18n>
