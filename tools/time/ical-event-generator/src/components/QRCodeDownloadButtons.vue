<template>
  <n-flex :size="8" wrap>
    <n-button tertiary @click="downloadPNG">
      <template #icon>
        <n-icon><ImageIcon /></n-icon>
      </template>
      PNG
    </n-button>
    <n-button tertiary @click="downloadSVG">
      <template #icon>
        <n-icon><CodeIcon /></n-icon>
      </template>
      SVG
    </n-button>
  </n-flex>
</template>

<script setup lang="ts">
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

function downloadBlob(file: File) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  URL.revokeObjectURL(url)
}

async function downloadPNG() {
  const opts = {
    errorCorrectionLevel: props.errorCorrectionLevel,
    margin: props.margin,
    width: props.width,
    color: { dark: props.dark, light: props.light },
  }
  const dataUrl = (await QRCode.toDataURL(props.text || ' ', {
    ...opts,
    type: 'image/png',
  })) as string
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  downloadBlob(new File([blob], 'event-qr.png', { type: 'image/png' }))
}

async function downloadSVG() {
  const opts = {
    errorCorrectionLevel: props.errorCorrectionLevel,
    margin: props.margin,
    width: props.width,
    color: { dark: props.dark, light: props.light },
  }
  const svg = (await QRCode.toString(props.text || ' ', { ...opts, type: 'svg' })) as string
  downloadBlob(new File([svg], 'event-qr.svg', { type: 'image/svg+xml' }))
}
</script>
