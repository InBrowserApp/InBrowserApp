<template>
  <div v-if="options.image === undefined">
    <NotUsingDedicatedImageNote />
    <ImageUpload @update:file="options.image = $event" />
  </div>
  <div v-else>
    <UsingDedicatedImageNote />
    <n-image :src="imageURL" class="dedicated-image" />
    <div>
      <RemoveButton @click="options.image = undefined" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NImage } from 'naive-ui'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'
import { useObjectUrl } from '@vueuse/core'
import ImageUpload from '../ImageUpload.vue'
import RemoveButton from '../common/RemoveButton.vue'
import NotUsingDedicatedImageNote from '../common/NotUsingDedicatedImageNote.vue'
import UsingDedicatedImageNote from '../common/UsingDedicatedImageNote.vue'
import { computed } from 'vue'

const options = defineModel<iOSWebClipOptions>('options', { required: true })

const image = computed<Blob | undefined>(() => options.value.image)

const imageURL = useObjectUrl(image)
</script>

<style scoped>
.dedicated-image {
  aspect-ratio: 1;
  object-fit: contain;
  max-height: 7em;
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
