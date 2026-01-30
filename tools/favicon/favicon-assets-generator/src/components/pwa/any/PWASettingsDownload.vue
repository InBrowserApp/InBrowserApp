<template>
  <n-p>
    <FileMinifiedUsingOxipng />
  </n-p>
  <DownloadFileButton filename="pwa-192x192.png" :href="png192Url" />
  <br />
  <DownloadFileButton filename="pwa-512x512.png" :href="png512Url" />
  <n-p>
    <n-code language="json" :code="code" :word-wrap="true" :hljs="hljs" />
  </n-p>
</template>

<script setup lang="ts">
import { NCode, NP } from 'naive-ui'
import type { PWAOptions } from '../../../utils/favicon-generator/pwa'
import { generatePWAPNG } from '../../../utils/favicon-generator/pwa'
import { computed, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import FileMinifiedUsingOxipng from '../../common/FileMinifiedUsingOxipng.vue'
import DownloadFileButton from '../../common/DownloadFileButton.vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
const props = defineProps<{
  image: Blob | undefined
  options: PWAOptions
}>()

hljs.registerLanguage('json', json)

const message = useMessage()

const image = computed<Blob | undefined>(() => {
  if (props.options.image) {
    return props.options.image
  } else {
    return props.image
  }
})

const png192Blob = ref<Blob | null>(null)
const png512Blob = ref<Blob | null>(null)
const png192Url = useObjectUrl(png192Blob)
const png512Url = useObjectUrl(png512Blob)

let png192Token = 0
let png512Token = 0

const updatePng192 = async () => {
  if (!image.value) {
    png192Blob.value = null
    return
  }
  const token = ++png192Token
  try {
    const blob = await generatePWAPNG(image.value, props.options, 192)
    if (token !== png192Token) return
    png192Blob.value = blob
  } catch (e) {
    if (token !== png192Token) return
    png192Blob.value = null
    message.error((e as Error).message)
  }
}

const updatePng512 = async () => {
  if (!image.value) {
    png512Blob.value = null
    return
  }
  const token = ++png512Token
  try {
    const blob = await generatePWAPNG(image.value, props.options, 512)
    if (token !== png512Token) return
    png512Blob.value = blob
  } catch (e) {
    if (token !== png512Token) return
    png512Blob.value = null
    message.error((e as Error).message)
  }
}

const code = computed(() => {
  return JSON.stringify(
    [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    null,
    2,
  )
})

watch(
  () => [image.value, props.options],
  () => {
    void updatePng192()
    void updatePng512()
  },
  { immediate: true, deep: true },
)
</script>
