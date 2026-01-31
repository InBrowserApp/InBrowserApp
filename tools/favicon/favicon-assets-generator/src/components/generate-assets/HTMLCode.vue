<template>
  <n-code language="html" :code="code" :word-wrap="true" :hljs="hljs" />
</template>

<script setup lang="ts">
import { NCode } from 'naive-ui'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'
import type { PWAOptions } from '../../utils/favicon-generator/pwa'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import { computed } from 'vue'
import { normalizePath } from '../../utils/favicon-generator/general-info'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
const props = defineProps<{
  image: Blob | undefined
  pwaOptions: PWAOptions
  desktopBrowserOptions: DesktopBrowserOptions
  iosWebClipOptions: iOSWebClipOptions
  generalInfoOptions: GeneralInfoOptions
}>()

hljs.registerLanguage('html', xml)

const prefix = computed(() => {
  return normalizePath(props.generalInfoOptions.path)
})

const code = computed(() => {
  const lines: string[] = []

  // iOS Web Clip
  lines.push(`<link rel="apple-touch-icon" href="${prefix.value}apple-touch-icon.png">`)

  // Desktop
  const desktopImage = props.desktopBrowserOptions.image ?? props.image

  if (
    props.desktopBrowserOptions.original &&
    (desktopImage === undefined || desktopImage.type === 'image/svg+xml')
  ) {
    // <link rel="icon" href="/favicon.ico" sizes="48x48" >
    // <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml">
    lines.push(`<link rel="icon" href="${prefix.value}favicon.ico" sizes="48x48">`)
    lines.push(
      `<link rel="icon" href="${prefix.value}favicon.svg" sizes="any" type="image/svg+xml">`,
    )
  } else {
    lines.push(
      `<link rel="icon" href="${prefix.value}favicon-32x32.png" type="image/png" sizes="32x32">`,
    )
    lines.push(
      `<link rel="icon" href="${prefix.value}favicon-16x16.png" type="image/png" sizes="16x16">`,
    )
  }

  // PWA
  lines.push(`<link rel="manifest" href="${prefix.value}site.webmanifest">`)

  // Theme color
  if (props.generalInfoOptions.theme_color_dark_enabled) {
    lines.push(
      `<meta name="theme-color" content="${props.generalInfoOptions.theme_color}" media="(prefers-color-scheme: light)">`,
    )
    lines.push(
      `<meta name="theme-color" content="${props.generalInfoOptions.theme_color_dark}" media="(prefers-color-scheme: dark)">`,
    )
  } else {
    lines.push(`<meta name="theme-color" content="${props.generalInfoOptions.theme_color}">`)
  }

  return lines.join('\n')
})
</script>
