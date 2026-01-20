<template>
  <n-flex :size="8" wrap>
    <n-button tertiary tag="a" :href="pngHref" download="event-qr.png" :disabled="!pngHref">
      <template #icon>
        <n-icon><ImageIcon /></n-icon>
      </template>
      PNG
    </n-button>
    <n-button tertiary tag="a" :href="jpgHref" download="event-qr.jpg" :disabled="!jpgHref">
      <template #icon>
        <n-icon><ImageIcon /></n-icon>
      </template>
      JPG
    </n-button>
    <n-button tertiary tag="a" :href="svgHref" download="event-qr.svg" :disabled="!svgHref">
      <template #icon>
        <n-icon><CodeIcon /></n-icon>
      </template>
      SVG
    </n-button>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NButton, NIcon } from 'naive-ui'
import QRCode from 'qrcode'
import { computedAsync, useDebounce, useObjectUrl } from '@vueuse/core'
import CodeIcon from '@vicons/fluent/Code16Regular'
import ImageIcon from '@vicons/fluent/Image16Regular'
const props = defineProps<{
  text: string
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  width: number
  margin: number
  dark: string
  light: string
}>()

const input = computed(() => ({
  text: props.text || ' ',
  errorCorrectionLevel: props.errorCorrectionLevel,
  width: props.width,
  margin: props.margin,
  dark: props.dark,
  light: props.light,
}))
const debouncedInput = useDebounce(input, 150)

type QrAssets = {
  png: Blob
  jpg: Blob
  svg: Blob
} | null

const assets = computedAsync<QrAssets>(async () => {
  const v = debouncedInput.value
  const opts = {
    errorCorrectionLevel: v.errorCorrectionLevel,
    margin: v.margin,
    width: v.width,
    color: { dark: v.dark, light: v.light },
  } as const

  try {
    const [pngDataUrl, jpgDataUrl, svgString] = await Promise.all([
      QRCode.toDataURL(v.text, { ...opts, type: 'image/png' }),
      QRCode.toDataURL(v.text, { ...opts, type: 'image/jpeg' }),
      QRCode.toString(v.text, { ...opts, type: 'svg' }),
    ])
    const [pngBlob, jpgBlob] = await Promise.all([
      dataUrlToBlob(String(pngDataUrl)),
      dataUrlToBlob(String(jpgDataUrl)),
    ])
    const svgContent = typeof svgString === 'string' ? svgString : ''
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
    return { png: pngBlob, jpg: jpgBlob, svg: svgBlob }
  } catch {
    return null
  }
}, null)

const pngUrl = useObjectUrl(computed(() => assets.value?.png ?? null))
const jpgUrl = useObjectUrl(computed(() => assets.value?.jpg ?? null))
const svgUrl = useObjectUrl(computed(() => assets.value?.svg ?? null))

const pngHref = computed(() => pngUrl.value || undefined)
const jpgHref = computed(() => jpgUrl.value || undefined)
const svgHref = computed(() => svgUrl.value || undefined)

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl)
  return response.blob()
}
</script>
