<template>
  <n-p>
    <FileMinifiedUsingOxipngAndSvgo />
  </n-p>
  <DownloadFileButton filename="favicon.ico" :href="icoUrl" />
  <br />
  <template v-if="useOriginalSVG">
    <DownloadFileButton filename="favicon.svg" :href="svgUrl" />
    <br />
  </template>
  <template v-else>
    <DownloadFileButton filename="favicon-32x32.png" :href="png32Url" />
    <br />
    <DownloadFileButton filename="favicon-16x16.png" :href="png16Url" />
    <br />
  </template>

  <n-p>
    <n-code language="html" :code="code" :word-wrap="true" :hljs="hljs" />
  </n-p>
</template>

<script setup lang="ts">
import { NCode, NP, useMessage } from 'naive-ui'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import {
  generateFaviconICO,
  generateFaviconPNG,
  getHTMLCode,
  generateFaviconSVG,
} from '../../utils/favicon-generator/desktop-browser'
import { computed, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import FileMinifiedUsingOxipngAndSvgo from '../common/FileMinifiedUsingOxipngAndSvgo.vue'
import DownloadFileButton from '../common/DownloadFileButton.vue'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
hljs.registerLanguage('html', xml)
const message = useMessage()

const props = defineProps<{
  image: Blob | undefined
  options: DesktopBrowserOptions
}>()

const image = computed<Blob | undefined>(() => {
  if (props.options.image) {
    return props.options.image
  } else {
    return props.image
  }
})

const icoBlob = ref<Blob | null>(null)
const svgBlob = ref<Blob | null>(null)
const png32Blob = ref<Blob | null>(null)
const png16Blob = ref<Blob | null>(null)

const icoUrl = useObjectUrl(icoBlob)
const svgUrl = useObjectUrl(svgBlob)
const png32Url = useObjectUrl(png32Blob)
const png16Url = useObjectUrl(png16Blob)

let icoToken = 0
let svgToken = 0
let png32Token = 0
let png16Token = 0

const updateIco = async () => {
  if (!image.value) {
    icoBlob.value = null
    return
  }
  const token = ++icoToken
  try {
    const blob = await generateFaviconICO(image.value, props.options)
    if (token !== icoToken) return
    icoBlob.value = blob
  } catch (e) {
    if (token !== icoToken) return
    icoBlob.value = null
    message.error((e as Error).message)
  }
}

const updateSvg = async () => {
  if (!image.value) {
    svgBlob.value = null
    return
  }
  const token = ++svgToken
  try {
    const blob = await generateFaviconSVG(image.value, props.options)
    if (token !== svgToken) return
    svgBlob.value = blob
  } catch (e) {
    if (token !== svgToken) return
    svgBlob.value = null
    message.error((e as Error).message)
  }
}

const updatePng32 = async () => {
  if (!image.value) {
    png32Blob.value = null
    return
  }
  const token = ++png32Token
  try {
    const blob = await generateFaviconPNG(image.value, props.options, 32)
    if (token !== png32Token) return
    png32Blob.value = blob
  } catch (e) {
    if (token !== png32Token) return
    png32Blob.value = null
    message.error((e as Error).message)
  }
}

const updatePng16 = async () => {
  if (!image.value) {
    png16Blob.value = null
    return
  }
  const token = ++png16Token
  try {
    const blob = await generateFaviconPNG(image.value, props.options, 16)
    if (token !== png16Token) return
    png16Blob.value = blob
  } catch (e) {
    if (token !== png16Token) return
    png16Blob.value = null
    message.error((e as Error).message)
  }
}

const iconMime = computed(() => {
  if (image.value === undefined) {
    return 'image/png'
  } else {
    return image.value.type
  }
})

const useOriginalSVG = computed(() => {
  return iconMime.value === 'image/svg+xml' && props.options.original
})

const code = computed(() => {
  if (useOriginalSVG.value) {
    return getHTMLCode(props.image, props.options)
  } else {
    return getHTMLCode(props.image, props.options)
  }
})

watch(
  () => [image.value, props.options, useOriginalSVG.value],
  () => {
    void updateIco()
    if (useOriginalSVG.value) {
      void updateSvg()
    } else {
      void updatePng32()
      void updatePng16()
    }
  },
  { immediate: true, deep: true },
)
</script>
