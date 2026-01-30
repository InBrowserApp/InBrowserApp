<template>
  <div
    class="container"
    :style="{
      '--chrome-tab-preview-tab-width': width + 'px',
      '--chrome-tab-preview-tab-height': height + 'px',
    }"
  >
    <img ref="tab" :src="chromeTabURL" class="chrome-tab-image" alt="Chrome Tab" />
    <DesktopBrowserImage :image="image" :options="options" class="icon" />
    <div
      class="site-name"
      :style="{
        color: dark ? 'white' : 'black',
      }"
    >
      {{ generalInfoOptions.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import { computed } from 'vue'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import WindowsChromeTabImage from './windows-chrome-tab.webp'
import WindowsChromeTabImageDark from './windows-chrome-tab-dark.webp'
import DesktopBrowserImage from './DesktopBrowserImage.vue'
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'

const tab = ref<HTMLDivElement>()
const { width, height } = useElementSize(tab)

const props = defineProps<{
  image: Blob | undefined
  options: DesktopBrowserOptions
  generalInfoOptions: GeneralInfoOptions
  dark?: boolean
}>()

const image = computed<Blob | undefined>(() => {
  if (props.options.image) {
    return props.options.image
  } else {
    return props.image
  }
})

const chromeTabURL = computed(() => {
  if (props.dark) {
    return WindowsChromeTabImageDark
  } else {
    return WindowsChromeTabImage
  }
})
</script>

<style scoped>
.container {
  --tab-width: 524;
  --tab-height: 86;

  width: 100%;
  position: relative;
  aspect-ratio: var(--tab-width) / var(--tab-height);
}

.chrome-tab-image {
  position: absolute;
  width: 100%;
}

.icon {
  position: absolute;
  top: calc(24 / var(--tab-height) * 100%);
  left: calc(46 / var(--tab-width) * 100%);
  width: calc(32 / var(--tab-width) * 100%);
  height: calc(32 / var(--tab-height) * 100%);
}

.site-name {
  position: absolute;
  left: calc(94 / var(--tab-width) * 100%);
  top: calc(20 / var(--tab-height) * 100%);
  max-width: 65%;
  overflow: hidden;

  font-size: calc(0.3 * var(--chrome-tab-preview-tab-height));
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
