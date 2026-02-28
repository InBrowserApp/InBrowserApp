<template>
  <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="20" :y-gap="20">
    <n-gi>
      <PlaceholderPresetSizeOptions v-model:width="width" v-model:height="height" />
    </n-gi>
    <n-gi>
      <PlaceholderBackgroundOptions
        v-model:bg-type="bgType"
        v-model:bg-color="bgColor"
        v-model:gradient-color1="gradientColor1"
        v-model:gradient-color2="gradientColor2"
        v-model:gradient-angle="gradientAngle"
      />
    </n-gi>
    <n-gi>
      <PlaceholderTextOptions
        v-model:text-color="textColor"
        v-model:custom-text="customText"
        v-model:font-size="fontSize"
        :width="width"
        :height="height"
      />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGi } from 'naive-ui'
import PlaceholderBackgroundOptions from './PlaceholderBackgroundOptions.vue'
import PlaceholderPresetSizeOptions from './PlaceholderPresetSizeOptions.vue'
import PlaceholderTextOptions from './PlaceholderTextOptions.vue'

const width = defineModel<number>('width', { required: true })
const height = defineModel<number>('height', { required: true })
const bgType = defineModel<'solid' | 'linear-gradient' | 'radial-gradient'>('bg-type', {
  required: true,
})
const bgColor = defineModel<string>('bg-color', { required: true })
const gradientColor1 = defineModel<string>('gradient-color1', { required: true })
const gradientColor2 = defineModel<string>('gradient-color2', { required: true })
const gradientAngle = defineModel<number>('gradient-angle', { required: true })
const textColor = defineModel<string>('text-color', { required: true })
const customText = defineModel<string>('custom-text', { required: true })
const fontSize = defineModel<number>('font-size', { required: true })
</script>
