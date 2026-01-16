<template>
  <n-flex align="center" vertical :size="12">
    <n-skeleton
      v-if="isLoading"
      :style="{ width: props.width + 'px', height: props.width + 'px', maxWidth: '100%' }"
    />
    <img
      v-else-if="svgDataUrl"
      :src="svgDataUrl"
      :style="{ maxWidth: '100%', width: props.width + 'px' }"
      alt="QR Code"
    />
  </n-flex>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NFlex, NSkeleton } from 'naive-ui'
import QRCode from 'qrcode'
import { computedAsync, useDebounce } from '@vueuse/core'

const props = defineProps<{
  text: string
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  width: number
  margin: number
  dark: string
  light: string
}>()

const isLoading = ref(false)

const input = computed(() => ({
  text: props.text || ' ',
  errorCorrectionLevel: props.errorCorrectionLevel,
  width: props.width,
  margin: props.margin,
  dark: props.dark,
  light: props.light,
}))
const debouncedInput = useDebounce(input, 150)

const svgString = computedAsync<string>(
  async () => {
    const v = debouncedInput.value
    const opts = {
      errorCorrectionLevel: v.errorCorrectionLevel,
      width: v.width,
      margin: v.margin,
      color: { dark: v.dark, light: v.light },
    } as const
    try {
      const svg = await QRCode.toString(v.text, { ...opts, type: 'svg' })
      return typeof svg === 'string' ? svg : ''
    } catch {
      return ''
    }
  },
  '',
  { evaluating: isLoading },
)

const svgDataUrl = computed<string>(() =>
  svgString.value ? `data:image/svg+xml;utf8,${encodeURIComponent(svgString.value)}` : '',
)
</script>
