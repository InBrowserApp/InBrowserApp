<template>
  <n-flex align="center" vertical :size="12">
    <img
      :src="svgDataUri"
      :style="{ maxWidth: '100%', border: '1px solid var(--n-border-color)' }"
    />
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDebounce } from '@vueuse/core'
import { NFlex } from 'naive-ui'

export interface PlaceholderOptions {
  width: number
  height: number
  bgType: 'solid' | 'linear-gradient' | 'radial-gradient'
  bgColor: string
  gradientColor1: string
  gradientColor2: string
  gradientAngle: number
  textColor: string
  customText: string
  fontSize: number
}

const props = defineProps<PlaceholderOptions>()

const input = computed(() => ({
  width: props.width,
  height: props.height,
  bgType: props.bgType,
  bgColor: props.bgColor,
  gradientColor1: props.gradientColor1,
  gradientColor2: props.gradientColor2,
  gradientAngle: props.gradientAngle,
  textColor: props.textColor,
  customText: props.customText,
  fontSize: props.fontSize,
}))

const debouncedInput = useDebounce(input, 150)

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateSVG(options: PlaceholderOptions, scale = 1): string {
  const w = options.width * scale
  const h = options.height * scale
  const text = options.customText || `${options.width} × ${options.height}`
  const baseFontSize = options.fontSize || Math.min(options.width, options.height) / 8
  const fontSize = baseFontSize * scale

  let defs = ''
  let fill = options.bgColor

  if (options.bgType === 'linear-gradient') {
    const angle = options.gradientAngle
    defs = `<defs>
      <linearGradient id="grad" gradientTransform="rotate(${angle}, 0.5, 0.5)">
        <stop offset="0%" stop-color="${options.gradientColor1}"/>
        <stop offset="100%" stop-color="${options.gradientColor2}"/>
      </linearGradient>
    </defs>`
    fill = 'url(#grad)'
  } else if (options.bgType === 'radial-gradient') {
    defs = `<defs>
      <radialGradient id="grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${options.gradientColor1}"/>
        <stop offset="100%" stop-color="${options.gradientColor2}"/>
      </radialGradient>
    </defs>`
    fill = 'url(#grad)'
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  ${defs}
  <rect width="100%" height="100%" fill="${fill}"/>
  <text x="50%" y="50%" fill="${options.textColor}" font-size="${fontSize}"
        font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">
    ${escapeXml(text)}
  </text>
</svg>`
}

const svgDataUri = computed(() => {
  const svg = generateSVG(debouncedInput.value)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
})

// Expose functions for external use (download buttons)
defineExpose({
  drawToCanvas: (canvas: HTMLCanvasElement, scale = 1) => {
    const options = input.value
    const w = options.width * scale
    const h = options.height * scale

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = w
    canvas.height = h

    // Background
    if (options.bgType === 'solid') {
      ctx.fillStyle = options.bgColor
    } else if (options.bgType === 'linear-gradient') {
      const angle = (options.gradientAngle * Math.PI) / 180
      const x1 = w / 2 - Math.cos(angle) * (w / 2)
      const y1 = h / 2 - Math.sin(angle) * (h / 2)
      const x2 = w / 2 + Math.cos(angle) * (w / 2)
      const y2 = h / 2 + Math.sin(angle) * (h / 2)
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
      gradient.addColorStop(0, options.gradientColor1)
      gradient.addColorStop(1, options.gradientColor2)
      ctx.fillStyle = gradient
    } else if (options.bgType === 'radial-gradient') {
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2)
      gradient.addColorStop(0, options.gradientColor1)
      gradient.addColorStop(1, options.gradientColor2)
      ctx.fillStyle = gradient
    }
    ctx.fillRect(0, 0, w, h)

    // Text
    const text = options.customText || `${options.width} × ${options.height}`
    const baseFontSize = options.fontSize || Math.min(options.width, options.height) / 8
    const fontSize = baseFontSize * scale
    ctx.fillStyle = options.textColor
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2)
  },
  generateSVG: (scale = 1) => generateSVG(input.value, scale),
  getOptions: () => input.value,
})
</script>
