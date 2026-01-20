<script setup lang="ts">
import { computed } from 'vue'
import { NIcon } from 'naive-ui'
import type { Component } from 'vue'
import AppGeneric20Regular from '@vicons/fluent/AppGeneric20Regular'
import MusicNote120Regular from '@vicons/fluent/MusicNote120Regular'
import TextFont20Regular from '@vicons/fluent/TextFont20Regular'
import Image20Regular from '@vicons/fluent/Image20Regular'
import Mail20Regular from '@vicons/fluent/Mail20Regular'
import Cube20Regular from '@vicons/fluent/Cube20Regular'
import Text20Regular from '@vicons/fluent/Document20Regular'
import Video20Regular from '@vicons/fluent/Video20Regular'
import Apps16Regular from '@vicons/fluent/Apps16Regular'
const props = defineProps<{
  category: string
}>()

const getCategoryIcon = (category: string): Component | undefined => {
  switch (category) {
    case 'application':
      return AppGeneric20Regular
    case 'audio':
      return MusicNote120Regular
    case 'font':
      return TextFont20Regular
    case 'image':
      return Image20Regular
    case 'message':
      return Mail20Regular
    case 'model':
      return Cube20Regular
    case 'multipart':
      return Apps16Regular
    case 'text':
      return Text20Regular
    case 'video':
      return Video20Regular
    default:
      return undefined
  }
}

const icon = computed(() => getCategoryIcon(props.category))
</script>

<template>
  <NIcon v-if="icon" :component="icon" />
</template>
