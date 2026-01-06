<script setup lang="ts">
import { computed } from 'vue'
import { NIcon } from 'naive-ui'
import type { Component } from 'vue'
import {
  AppGeneric20Regular,
  MusicNote120Regular,
  TextFont20Regular,
  Image20Regular,
  Mail20Regular,
  Cube20Regular,
  Document20Regular as Text20Regular,
  Video20Regular,
  Apps16Regular,
} from '@shared/icons/fluent'

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
