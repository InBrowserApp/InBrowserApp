<template>
  <n-p>
    <FileMinifiedUsingOxipng />
  </n-p>
  <DownloadFileButton filename="apple-touch-icon.png" :href="downloadUrl" />

  <n-p>
    <n-code language="html" :code="code" :word-wrap="true" :hljs="hljs" />
  </n-p>
</template>

<script setup lang="ts">
import { NP, NCode } from 'naive-ui'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'
import { generateOutput, getHTMLCode } from '../../utils/favicon-generator/ios-web-clip'
import { computed, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import FileMinifiedUsingOxipng from '../common/FileMinifiedUsingOxipng.vue'
import DownloadFileButton from '../common/DownloadFileButton.vue'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
hljs.registerLanguage('html', xml)

const message = useMessage()

const props = defineProps<{
  image: Blob | undefined
  options: iOSWebClipOptions
}>()

const image = computed<Blob | undefined>(() => {
  if (props.options.image) {
    return props.options.image
  } else {
    return props.image
  }
})

const downloadBlob = ref<Blob | null>(null)
const downloadUrl = useObjectUrl(downloadBlob)

let downloadToken = 0

const updateDownload = async () => {
  if (!image.value) {
    downloadBlob.value = null
    return
  }
  const token = ++downloadToken
  try {
    const blob = await generateOutput(image.value, props.options)
    if (token !== downloadToken) return
    downloadBlob.value = blob
  } catch (e) {
    if (token !== downloadToken) return
    downloadBlob.value = null
    message.error((e as Error).message)
  }
}

const code = computed(() => {
  return getHTMLCode()
})

watch(
  () => [image.value, props.options],
  () => {
    void updateDownload()
  },
  { immediate: true, deep: true },
)
</script>
