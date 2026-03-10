<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ImageToPdfConverter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import type { Component } from 'vue'
import { defineAsyncComponent, defineComponent, h } from 'vue'
import * as toolInfo from './info'

const componentLoaders = import.meta.glob<{ default: Component }>(
  './components/ImageToPdfConverter.vue',
)
const loadImageToPdfConverter = componentLoaders['./components/ImageToPdfConverter.vue']

const ImageToPdfConverter = loadImageToPdfConverter
  ? defineAsyncComponent(loadImageToPdfConverter)
  : defineComponent({
      name: 'ImageToPdfConverterPlaceholder',
      setup() {
        return () => h('div')
      },
    })
</script>
