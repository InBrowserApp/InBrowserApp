<template>
  <TextInput v-model="inputText" />
  <FontSelector v-model="selectedFont" />
  <AsciiOutput :text="inputText" :font="selectedFont" />
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import TextInput from './TextInput.vue'
import FontSelector from './FontSelector.vue'
import AsciiOutput from './AsciiOutput.vue'

const inputText = useStorage('tools:ascii-art-generator:text', 'Hello')
const selectedFont = useStorage('tools:ascii-art-generator:font', 'Standard')
</script>
