<template>
  <n-grid cols="1 s:2" responsive="screen" :x-gap="20" :y-gap="20">
    <n-gi>
      <BarcodeOptionsBasics
        v-model:text="text"
        v-model:format="format"
        v-model:width="width"
        v-model:height="height"
        v-model:margin="margin"
      />
    </n-gi>
    <n-gi>
      <BarcodeOptionsAppearance
        v-model:display-value="displayValue"
        v-model:text-align="textAlign"
        v-model:text-position="textPosition"
        v-model:font-size="fontSize"
        v-model:line-color="lineColor"
        v-model:background="background"
      />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGi } from 'naive-ui'
import BarcodeOptionsBasics from './BarcodeOptionsBasics.vue'
import BarcodeOptionsAppearance from './BarcodeOptionsAppearance.vue'

const text = defineModel<string>('text', { required: true })
const format = defineModel<string>('format', { required: true })
const width = defineModel<number>('width', { required: true })
const height = defineModel<number>('height', { required: true })
const margin = defineModel<number>('margin', { required: true })
const displayValue = defineModel<boolean>('display-value', { required: true })
const textAlign = defineModel<'left' | 'center' | 'right'>('text-align', { required: true })
const textPosition = defineModel<'top' | 'bottom'>('text-position', { required: true })
const fontSize = defineModel<number>('font-size', { required: true })
const lineColor = defineModel<string>('line-color', { required: true })
const background = defineModel<string>('background', { required: true })
</script>
