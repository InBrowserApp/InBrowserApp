<template>
  <SelectFile v-model:image="image" />
  <GeneralInfo v-model:options="generalInfoOptions" />
  <DesktopBrowser
    v-model:options="desktopOptions"
    :image="image"
    :general-info-options="generalInfoOptions"
  />
  <iOSWebClip
    v-model:options="iosOptions"
    :image="image"
    :general-info-options="generalInfoOptions"
  />
  <PWA v-model:options="pwaOptions" :image="image" :general-info-options="generalInfoOptions" />
  <GenerateAssets
    :image="image"
    :ios-web-clip-options="iosOptions"
    :desktop-browser-options="desktopOptions"
    :pwa-options="pwaOptions"
    :general-info-options="generalInfoOptions"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import iOSWebClip from './ios-web-clip/iOSWebClip.vue'
import GeneralInfo from './general-info/GeneralInfo.vue'
import type { iOSWebClipOptions } from '../utils/favicon-generator/ios-web-clip'
import type { GeneralInfoOptions } from '../utils/favicon-generator/general-info'
import DesktopBrowser from './desktop-browser/DesktopBrowser.vue'
import type { DesktopBrowserOptions } from '../utils/favicon-generator/desktop-browser'
import PWA from './pwa/PWA.vue'
import type { PWAOptions } from '../utils/favicon-generator/pwa'
import GenerateAssets from './generate-assets/GenerateAssets.vue'
import SelectFile from './select-file/SelectFile.vue'

const image = ref<Blob | undefined>(undefined)

const iosOptions = ref<iOSWebClipOptions>({
  backgroundColor: '#FFFFFF',
  margin: 0,
})

const desktopOptions = ref<DesktopBrowserOptions>({
  original: true,
  background: false,
  backgroundColor: '#FFFFFF',
  backgroundRadius: 0,
  margin: 0,
})

const pwaOptions = ref<PWAOptions>({
  background: false,
  backgroundColor: '#FFFFFF',
  backgroundRadius: 0,
  maskable: true,
  maskableBackgroundColor: '#FFFFFF',
  maskableMargin: 40,
  margin: 0,
})

const generalInfoOptions = ref<GeneralInfoOptions>({
  name: 'App',
  short_name: 'App',
  description: '',
  start_url: '/',
  display: 'standalone',
  theme_color: '#FFFFFF',
  theme_color_dark_enabled: true,
  theme_color_dark: '#000000',
  background_color: '#FFFFFF',
  path: '/',
})
</script>
