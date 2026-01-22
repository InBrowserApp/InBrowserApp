<template>
  <div class="stage" ref="containerRef" data-testid="dice-stage">
    <canvas ref="canvasRef" class="stage-canvas" />
    <div v-if="hiddenCount" class="stage-pill" data-testid="stage-overflow">
      {{ t('showing', { visible: visibleResults.length, total: results.length }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useThemeVars } from 'naive-ui'

interface DieSeed {
  x: number
  y: number
  shade: number
}

const props = defineProps<{
  results: number[]
  faces: number
  rollId: number
  maxVisible?: number
}>()

const emit = defineEmits<{
  (e: 'settled'): void
}>()

const { t } = useI18n()
const themeVars = useThemeVars()

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { width, height } = useElementSize(containerRef)

const maxVisible = computed(() => props.maxVisible ?? 60)
const visibleResults = computed(() => props.results.slice(0, maxVisible.value))
const hiddenCount = computed(() => Math.max(0, props.results.length - visibleResults.value.length))

const seeds = ref<DieSeed[]>([])
let rafId = 0
let animationStart = 0
const animationDuration = 700

const redrawToken = ref(0)

function scheduleDraw() {
  redrawToken.value += 1
}

function getCanvas(): HTMLCanvasElement | null {
  return canvasRef.value
}

async function exportImage(scale = 1): Promise<Blob | null> {
  const canvas = getCanvas()
  if (!canvas) return null
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = canvas.width * scale
  exportCanvas.height = canvas.height * scale
  const ctx = exportCanvas.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height)

  return new Promise((resolve) => {
    exportCanvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

defineExpose({
  exportImage,
})

function prepareSeeds() {
  const count = visibleResults.value.length
  seeds.value = Array.from({ length: count }, () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    shade: Math.random(),
  }))
}

function startAnimation() {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  if (!visibleResults.value.length) {
    drawScene(1)
    emit('settled')
    return
  }
  prepareSeeds()
  animationStart = performance.now()
  animate()
}

function animate() {
  rafId = requestAnimationFrame((now) => {
    const elapsed = now - animationStart
    const progress = Math.min(elapsed / animationDuration, 1)
    drawScene(progress)
    if (progress < 1) {
      animate()
    } else {
      rafId = 0
      emit('settled')
    }
  })
}

function drawScene(progress: number) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const pixelRatio = window.devicePixelRatio || 1
  const cssWidth = Math.max(1, width.value || 1)
  const cssHeight = Math.max(1, height.value || 1)
  const targetWidth = Math.floor(cssWidth * pixelRatio)
  const targetHeight = Math.floor(cssHeight * pixelRatio)

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth
    canvas.height = targetHeight
  }

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  ctx.clearRect(0, 0, cssWidth, cssHeight)

  drawBackground(ctx, cssWidth, cssHeight)

  if (!visibleResults.value.length) {
    drawPlaceholder(ctx, cssWidth, cssHeight)
    return
  }

  const layout = computeLayout(visibleResults.value.length, cssWidth, cssHeight)
  const eased = easeOutCubic(progress)

  layout.forEach((position, index) => {
    const seed = seeds.value[index] || { x: 0, y: 0, shade: 0 }
    const jitter = (1 - eased) * position.size * 0.45
    const offsetX = seed.x * jitter
    const offsetY = seed.y * jitter
    const bounce = Math.sin(eased * Math.PI) * jitter * 0.4
    drawDie(
      ctx,
      position.x + offsetX,
      position.y + offsetY - bounce,
      position.size,
      visibleResults.value[index] ?? 1,
      seed.shade,
    )
  })
}

function computeLayout(count: number, canvasWidth: number, canvasHeight: number) {
  const padding = Math.max(24, Math.min(40, canvasWidth * 0.06))
  const usableWidth = Math.max(120, canvasWidth - padding * 2)
  const usableHeight = Math.max(120, canvasHeight - padding * 2)
  const columns = Math.max(1, Math.ceil(Math.sqrt((count * usableWidth) / usableHeight)))
  const rows = Math.ceil(count / columns)
  const cellWidth = usableWidth / columns
  const cellHeight = usableHeight / rows
  const size = Math.min(cellWidth, cellHeight) * 0.6

  const positions: Array<{ x: number; y: number; size: number }> = []
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const index = row * columns + col
      if (index >= count) break
      const x = padding + col * cellWidth + cellWidth / 2
      const y = padding + row * cellHeight + cellHeight / 2
      positions.push({ x, y, size })
    }
  }

  return positions
}

function drawBackground(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
  const base = themeVars.value.bodyColor || '#f5f7ff'
  const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
  gradient.addColorStop(0, mixColor(base, '#ffffff', 0.2))
  gradient.addColorStop(1, mixColor(base, '#d6d9f7', 0.2))
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
  ctx.fillStyle = themeVars.value.textColor3 || '#9aa0b5'
  ctx.font = '600 16px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(t('empty'), canvasWidth / 2, canvasHeight / 2)
}

function drawDie(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  value: number,
  shadeSeed: number,
) {
  const baseColor = themeVars.value.primaryColor || '#5b7cff'
  const light = mixColor(baseColor, '#ffffff', 0.3)
  const mid = mixColor(baseColor, '#000000', 0.05)
  const dark = mixColor(baseColor, '#000000', 0.2)

  const shading =
    shadeSeed > 0.66
      ? [light, mid, dark]
      : shadeSeed > 0.33
        ? [mid, light, dark]
        : [light, dark, mid]
  const topColor = shading[0] ?? light
  const rightColor = shading[1] ?? mid
  const leftColor = shading[2] ?? dark

  const half = size / 2
  const depth = size * 0.55

  const top0 = { x, y: y - half }
  const top1 = { x: x + half, y }
  const top2 = { x, y: y + half }
  const top3 = { x: x - half, y }
  const top = [top0, top1, top2, top3]
  const left = [top3, top2, { x: top2.x, y: top2.y + depth }, { x: top3.x, y: top3.y + depth }]
  const right = [top1, top2, { x: top2.x, y: top2.y + depth }, { x: top1.x, y: top1.y + depth }]

  ctx.fillStyle = leftColor
  drawPolygon(ctx, left)
  ctx.fillStyle = rightColor
  drawPolygon(ctx, right)
  ctx.fillStyle = topColor
  drawPolygon(ctx, top)

  ctx.fillStyle = themeVars.value.textColorBase || '#1d2330'
  ctx.font = `700 ${Math.max(12, size * 0.42)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(value), x, y)
}

function drawPolygon(ctx: CanvasRenderingContext2D, points: Array<{ x: number; y: number }>) {
  ctx.beginPath()
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  })
  ctx.closePath()
  ctx.fill()
}

function mixColor(base: string, target: string, amount: number) {
  const baseRgb = parseColor(base)
  const targetRgb = parseColor(target)
  const mix = {
    r: Math.round(baseRgb.r + (targetRgb.r - baseRgb.r) * amount),
    g: Math.round(baseRgb.g + (targetRgb.g - baseRgb.g) * amount),
    b: Math.round(baseRgb.b + (targetRgb.b - baseRgb.b) * amount),
  }
  return `rgb(${mix.r}, ${mix.g}, ${mix.b})`
}

function parseColor(color: string) {
  const hexMatch = color.replace('#', '').match(/^[0-9a-fA-F]{6}$/)
  if (hexMatch) {
    const value = color.replace('#', '')
    return {
      r: Number.parseInt(value.slice(0, 2), 16),
      g: Number.parseInt(value.slice(2, 4), 16),
      b: Number.parseInt(value.slice(4, 6), 16),
    }
  }
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (rgbMatch) {
    return {
      r: Number.parseInt(rgbMatch[1] ?? '0', 10),
      g: Number.parseInt(rgbMatch[2] ?? '0', 10),
      b: Number.parseInt(rgbMatch[3] ?? '0', 10),
    }
  }
  return { r: 91, g: 124, b: 255 }
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

watch([width, height, redrawToken], () => {
  drawScene(1)
})

watch(
  () => props.results,
  () => {
    scheduleDraw()
  },
  { deep: true },
)

watch(
  () => props.rollId,
  () => {
    nextTick(() => startAnimation())
  },
)

watch(
  () => props.faces,
  () => {
    scheduleDraw()
  },
)

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.stage {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(130, 140, 170, 0.25);
  background: transparent;
}

.stage-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.stage-pill {
  position: absolute;
  right: 16px;
  bottom: 16px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(30, 34, 45, 0.7);
  color: #fff;
  backdrop-filter: blur(6px);
}

@media (max-width: 640px) {
  .stage {
    height: 280px;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "zh": {
    "empty": "开始投掷后即可查看 3D 画面。",
    "showing": "仅展示 {visible} / {total} 颗骰子"
  },
  "zh-CN": {
    "empty": "开始投掷后即可查看 3D 画面。",
    "showing": "仅展示 {visible} / {total} 颗骰子"
  },
  "zh-TW": {
    "empty": "開始擲骰後即可查看 3D 畫面。",
    "showing": "僅顯示 {visible} / {total} 顆骰子"
  },
  "zh-HK": {
    "empty": "開始擲骰後即可查看 3D 畫面。",
    "showing": "僅顯示 {visible} / {total} 顆骰子"
  },
  "es": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "fr": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "de": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "it": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "ja": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "ko": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "ru": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "pt": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "ar": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "hi": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "tr": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "nl": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "sv": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "pl": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "vi": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "th": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "id": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "he": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "ms": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "no": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  }
}
</i18n>
