<template>
  <div class="container">
    <GoogleSearchResult
      :image="image"
      :options="options"
      :general-info-options="generalInfoOptions"
    />
    <n-divider />
    <ChromeTabPreview
      :image="image"
      :options="options"
      :general-info-options="generalInfoOptions"
      :dark="false"
    />
    <ChromeTabPreview
      :image="image"
      :options="options"
      :general-info-options="generalInfoOptions"
      :dark="true"
    />
    <ChromeTabDarkNote v-if="image?.type === 'image/svg+xml'" />
  </div>
</template>

<script setup lang="ts">
import { NDivider } from 'naive-ui'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import GoogleSearchResult from './GoogleSearchResult.vue'
import ChromeTabPreview from './ChromeTabPreview.vue'
import ChromeTabDarkNote from './ChromeTabDarkNote.vue'
import { computed } from 'vue'

const props = defineProps<{
  image: Blob | undefined
  options: DesktopBrowserOptions
  generalInfoOptions: GeneralInfoOptions
}>()

const image = computed<Blob | undefined>(() => {
  if (props.options.image) {
    return props.options.image
  } else {
    return props.image
  }
})
</script>
