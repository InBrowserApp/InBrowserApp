<template>
  <div
    class="container"
    :style="{
      '--ios-homescreen-background-width': width + 'px',
      '--ios-homescreen-background-height': height + 'px',
    }"
  >
    <img
      ref="iosHomescreenBackground"
      :src="PreviewBackground"
      class="background"
      alt="iOS Homescreen Background"
    />
    <div class="icon-container">
      <div class="icon-background" :style="iconBackgroundStyle" />
      <n-skeleton v-if="image === undefined" class="icon" />
      <img v-else :src="imageURL" class="icon" :style="iconStyle" />
    </div>

    <div class="name">{{ name ?? 'App' }}</div>
  </div>
</template>

<script setup lang="ts">
import PreviewBackground from './ios-web-clip-preview-background.webp'
import { useObjectUrl } from '@vueuse/core'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { NSkeleton } from 'naive-ui'

const props = defineProps<{
  image: Blob | undefined
  name?: string
  options: iOSWebClipOptions
}>()
const iosHomescreenBackground = ref<HTMLImageElement>()
const { width, height } = useElementSize(iosHomescreenBackground)

const image = computed<Blob | undefined>(() => {
  if (props.options.image) {
    return props.options.image
  } else {
    return props.image
  }
})

const imageURL = useObjectUrl(image)

const iconBackgroundStyle = computed(() => ({
  '--icon-background-color': props.options.backgroundColor,
}))

const iconStyle = computed(() => ({
  '--icon-margin': (props.options.margin / 2).toString() + '%',
}))
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  /* 1126 * 892 */
  aspect-ratio: 1126 / 892;
  overflow: hidden;
}

.background {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-container {
  --size: 16.2%;
  position: absolute;
  width: var(--size);
  aspect-ratio: 1;
  left: 76.7%;
  top: 69.5%;

  object-fit: contain;
  border-radius: 20%;
  overflow: hidden;
}

.icon {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;

  box-sizing: border-box;
  will-change: padding;
  padding: var(--icon-margin);
  transition: padding 0.2s ease-in-out;
}

.icon-background {
  will-change: background-color;
  background-color: var(--icon-background-color);
  position: absolute;
  width: 100%;
  height: 100%;
  transition: background-color 0.2s ease-in-out;
}

.name {
  color: white;
  position: absolute;
  top: 90.5%;
  left: 76.7%;
  text-shadow: 0.5px 0.5px 0.5px grey;
  user-select: none;

  /* background-color: #ffffffc0; */
  width: 16.2%;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  /* font: SF Pro, then others */
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;

  font-size: calc(0.04 * var(--ios-homescreen-background-height));
}
</style>
