<template>
  <div v-if="options.maskableImage === undefined">
    <NotUsingDedicatedImageNote />
    <ImageUpload @update:file="options.maskableImage = $event" />
  </div>
  <div v-else>
    <UsingDedicatedImageNote />
    <n-image :src="imageURL" class="dedicated-image" />
    <div>
      <RemoveButton @click="options.maskableImage = undefined" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NImage } from 'naive-ui'
import type { PWAOptions } from '../../../utils/favicon-generator/pwa'
import { useVModel, useObjectUrl } from '@vueuse/core'
import ImageUpload from '../../ImageUpload.vue'
import RemoveButton from '../../common/RemoveButton.vue'
import NotUsingDedicatedImageNote from '../../common/NotUsingDedicatedImageNote.vue'
import UsingDedicatedImageNote from '../../common/UsingDedicatedImageNote.vue'
import { toRef, computed } from 'vue'

const props = defineProps<{
  options: PWAOptions
}>()

const emit = defineEmits<{
  'update:options': [PWAOptions]
}>()

const options = useVModel(props, 'options', emit)

const optionsRef = toRef(props, 'options')
const image = computed<Blob | undefined>(() => optionsRef.value.maskableImage)

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
