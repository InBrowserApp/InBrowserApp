<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>

    <div class="stage-shell">
      <div ref="stageRef" class="stage">
        <img class="stage-image" :src="imageUrl || ''" :alt="t('imageAlt')" />

        <div
          v-if="cropRect"
          class="crop-rect"
          :style="cropBoxStyle"
          tabindex="0"
          @keydown="handleKeydown"
          @pointerdown="startDrag('move', $event)"
        >
          <div
            v-for="handle in handles"
            :key="handle"
            class="handle"
            :class="`handle--${handle}`"
            @pointerdown.stop="startDrag(handle, $event)"
          />
        </div>
      </div>
    </div>

    <n-text depth="3" class="workspace-note">{{ t('hint') }}</n-text>
    <n-text depth="3" class="workspace-size"> {{ t('cropSize') }}: {{ cropSizeLabel }} </n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { CropHandle, CropRect, ImageSource } from '../types'
import { moveCropRectByPixels, resizeCropRect } from '../utils/crop-math'

interface Props {
  source: ImageSource
  cropRect: CropRect
  ratio: number | null
}

interface DragState {
  handle: CropHandle
  pointerX: number
  pointerY: number
  startRect: CropRect
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:cropRect': [CropRect] }>()

const { t } = useI18n({ useScope: 'local' })
const imageUrl = useObjectUrl(computed(() => props.source.file))
const stageRef = ref<HTMLDivElement | null>(null)
const dragState = ref<DragState | null>(null)

const handles = computed<CropHandle[]>(() =>
  props.ratio ? ['nw', 'ne', 'sw', 'se'] : ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'],
)

const cropBoxStyle = computed(() => ({
  left: `${props.cropRect.x * 100}%`,
  top: `${props.cropRect.y * 100}%`,
  width: `${props.cropRect.width * 100}%`,
  height: `${props.cropRect.height * 100}%`,
}))

const cropSizeLabel = computed(() => {
  const width = Math.max(1, Math.round(props.cropRect.width * props.source.width))
  const height = Math.max(1, Math.round(props.cropRect.height * props.source.height))
  return `${width} × ${height}`
})

function startDrag(handle: CropHandle, event: PointerEvent) {
  event.preventDefault()

  dragState.value = {
    handle,
    pointerX: event.clientX,
    pointerY: event.clientY,
    startRect: props.cropRect,
  }

  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', stopDrag)
}

function handlePointerMove(event: PointerEvent) {
  if (!dragState.value || !stageRef.value) return

  const bounds = stageRef.value.getBoundingClientRect()
  if (!bounds.width || !bounds.height) return

  const deltaX = (event.clientX - dragState.value.pointerX) / bounds.width
  const deltaY = (event.clientY - dragState.value.pointerY) / bounds.height
  const nextRect =
    dragState.value.handle === 'move'
      ? moveCropRectByPixels(
          dragState.value.startRect,
          (event.clientX - dragState.value.pointerX) * (props.source.width / bounds.width),
          (event.clientY - dragState.value.pointerY) * (props.source.height / bounds.height),
          props.source,
        )
      : resizeCropRect(
          dragState.value.startRect,
          dragState.value.handle,
          deltaX,
          deltaY,
          props.source,
          props.ratio,
        )

  emit('update:cropRect', nextRect)
}

function stopDrag() {
  dragState.value = null
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', stopDrag)
}

function handleKeydown(event: KeyboardEvent) {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return

  event.preventDefault()
  const step = event.shiftKey ? 10 : 1
  const deltaX = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0
  const deltaY = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0
  emit('update:cropRect', moveCropRectByPixels(props.cropRect, deltaX, deltaY, props.source))
}

onBeforeUnmount(stopDrag)
</script>

<style scoped>
.stage-shell {
  display: flex;
  justify-content: center;
  overflow: auto;
}

.stage {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.stage-image {
  display: block;
  max-width: min(100%, 760px);
  max-height: 520px;
  image-orientation: from-image;
}

.crop-rect {
  position: absolute;
  border: 2px solid var(--primary-color);
  box-shadow: 0 0 0 9999px rgb(0 0 0 / 48%);
  cursor: move;
  touch-action: none;
}

.handle {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid var(--primary-color);
  background: #fff;
  border-radius: 999px;
}

.handle--nw,
.handle--n,
.handle--ne {
  top: -10px;
}

.handle--sw,
.handle--s,
.handle--se {
  bottom: -10px;
}

.handle--nw,
.handle--w,
.handle--sw {
  left: -10px;
}

.handle--ne,
.handle--e,
.handle--se {
  right: -10px;
}

.handle--n,
.handle--s {
  left: calc(50% - 9px);
}

.handle--e,
.handle--w {
  top: calc(50% - 9px);
}

.handle--nw,
.handle--se {
  cursor: nwse-resize;
}

.handle--ne,
.handle--sw {
  cursor: nesw-resize;
}

.handle--n,
.handle--s {
  cursor: ns-resize;
}

.handle--e,
.handle--w {
  cursor: ew-resize;
}

.workspace-note,
.workspace-size {
  display: block;
  margin-top: 12px;
}

@media (max-width: 640px) {
  .handle {
    width: 22px;
    height: 22px;
  }

  .handle--n,
  .handle--s {
    left: calc(50% - 11px);
  }

  .handle--e,
  .handle--w {
    top: calc(50% - 11px);
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "zh": {
    "title": "裁剪工作区",
    "imageAlt": "待裁剪图片",
    "hint": "拖动裁剪框或控制点进行调整，也可以用方向键微调位置。",
    "cropSize": "裁剪尺寸"
  },
  "zh-CN": {
    "title": "裁剪工作区",
    "imageAlt": "待裁剪图片",
    "hint": "拖动裁剪框或控制点进行调整，也可以用方向键微调位置。",
    "cropSize": "裁剪尺寸"
  },
  "zh-TW": {
    "title": "裁切工作區",
    "imageAlt": "待裁切圖片",
    "hint": "拖曳裁切框或控制點進行調整，也可以用方向鍵微調位置。",
    "cropSize": "裁切尺寸"
  },
  "zh-HK": {
    "title": "裁切工作區",
    "imageAlt": "待裁切圖片",
    "hint": "拖曳裁切框或控制點進行調整，也可以用方向鍵微調位置。",
    "cropSize": "裁切尺寸"
  },
  "es": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "fr": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "de": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "it": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "ja": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "ko": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "ru": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "pt": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "ar": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "hi": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "tr": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "nl": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "sv": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "pl": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "vi": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "th": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "id": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "he": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "ms": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  },
  "no": {
    "title": "Crop workspace",
    "imageAlt": "Image to crop",
    "hint": "Drag the crop box or handles to adjust. Use arrow keys for fine movement.",
    "cropSize": "Crop size"
  }
}
</i18n>
