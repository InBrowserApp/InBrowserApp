<template>
  <n-flex :size="8" wrap>
    <n-button
      tag="a"
      tertiary
      :href="pngUrl ?? undefined"
      download="qrcode.png"
      :disabled="!pngUrl"
    >
      <template #icon>
        <n-icon><ImageIcon /></n-icon>
      </template>
      PNG
    </n-button>
    <n-button
      tag="a"
      tertiary
      :href="svgUrl ?? undefined"
      download="qrcode.svg"
      :disabled="!svgUrl"
    >
      <template #icon>
        <n-icon><CodeIcon /></n-icon>
      </template>
      SVG
    </n-button>
  </n-flex>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NFlex, NButton, NIcon } from 'naive-ui'
import QRCode from 'qrcode'
import { Code16Regular as CodeIcon, Image16Regular as ImageIcon } from '@shared/icons/fluent'

const props = defineProps<{
  text: string
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  width: number
  margin: number
  dark: string
  light: string
}>()

const pngBlob = ref<Blob | null>(null)
const svgBlob = ref<Blob | null>(null)
const pngUrl = useObjectUrl(pngBlob)
const svgUrl = useObjectUrl(svgBlob)

let pngToken = 0
let svgToken = 0

const buildOptions = () => ({
  errorCorrectionLevel: props.errorCorrectionLevel,
  margin: props.margin,
  width: props.width,
  color: { dark: props.dark, light: props.light },
})

async function updatePNG() {
  const token = ++pngToken
  const dataUrl = (await QRCode.toDataURL(props.text || ' ', {
    ...buildOptions(),
    type: 'image/png',
  })) as string
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  if (token !== pngToken) return
  pngBlob.value = blob
}

async function updateSVG() {
  const token = ++svgToken
  const svg = (await QRCode.toString(props.text || ' ', {
    ...buildOptions(),
    type: 'svg',
  })) as string
  if (token !== svgToken) return
  svgBlob.value = new Blob([svg], { type: 'image/svg+xml' })
}

watch(
  () => [
    props.text,
    props.errorCorrectionLevel,
    props.width,
    props.margin,
    props.dark,
    props.light,
  ],
  () => {
    void updatePNG()
    void updateSVG()
  },
  { immediate: true },
)
</script>
