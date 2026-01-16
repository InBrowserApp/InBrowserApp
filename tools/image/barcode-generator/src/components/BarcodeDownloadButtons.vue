<template>
  <n-flex :size="8" wrap>
    <n-button
      tag="a"
      tertiary
      :href="pngUrl ?? undefined"
      download="barcode.png"
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
      download="barcode.svg"
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
import JsBarcode from 'jsbarcode'
import type { Options } from 'jsbarcode'
import { Code16Regular as CodeIcon, Image16Regular as ImageIcon } from '@shared/icons/fluent'

const props = defineProps<{
  text: string
  format: string
  width: number
  height: number
  margin: number
  displayValue: boolean
  textAlign: 'left' | 'center' | 'right'
  textPosition: 'top' | 'bottom'
  fontSize: number
  lineColor: string
  background: string
}>()

const pngBlob = ref<Blob | null>(null)
const svgBlob = ref<Blob | null>(null)
const pngUrl = useObjectUrl(pngBlob)
const svgUrl = useObjectUrl(svgBlob)

function buildOptions(): Partial<Options> {
  return {
    format: props.format,
    width: props.width,
    height: props.height,
    margin: props.margin,
    displayValue: props.displayValue,
    textAlign: props.textAlign,
    textPosition: props.textPosition,
    fontSize: props.fontSize,
    lineColor: props.lineColor,
    background: props.background,
    xmlDocument: document,
  }
}

let pngToken = 0
let svgToken = 0

async function updatePNG() {
  const token = ++pngToken
  const canvas = document.createElement('canvas')
  JsBarcode(canvas, props.text || ' ', buildOptions())
  await new Promise<void>((resolve) => setTimeout(resolve))
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png')
  })
  if (token !== pngToken) return
  pngBlob.value = blob
}

async function updateSVG() {
  const token = ++svgToken
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  JsBarcode(svg, props.text || ' ', buildOptions())
  const svgText = svg.outerHTML
  if (token !== svgToken) return
  svgBlob.value = new Blob([svgText], { type: 'image/svg+xml' })
}

watch(
  () => [
    props.text,
    props.format,
    props.width,
    props.height,
    props.margin,
    props.displayValue,
    props.textAlign,
    props.textPosition,
    props.fontSize,
    props.lineColor,
    props.background,
  ],
  () => {
    void updatePNG()
    void updateSVG()
  },
  { immediate: true },
)
</script>
