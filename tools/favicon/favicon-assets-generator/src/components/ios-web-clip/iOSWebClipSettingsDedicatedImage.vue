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
import { useVModel, useObjectUrl } from '@vueuse/core'
import ImageUpload from '../ImageUpload.vue'
import RemoveButton from '../common/RemoveButton.vue'
import NotUsingDedicatedImageNote from '../common/NotUsingDedicatedImageNote.vue'
import UsingDedicatedImageNote from '../common/UsingDedicatedImageNote.vue'
import { toRef, computed } from 'vue'

const props = defineProps<{
  options: iOSWebClipOptions
}>()

const emit = defineEmits<{
  'update:options': [iOSWebClipOptions]
}>()

const options = useVModel(props, 'options', emit)

const optionsRef = toRef(props, 'options')
const image = computed<Blob | undefined>(() => optionsRef.value.image)

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
