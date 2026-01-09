<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <NFlex vertical :size="24">
      <ColorNameSearch v-model:search="search" v-model:category="category" />
      <ColorNameTable :search="search" :category="category" />
      <WhatIsHtmlColorNames />
    </NFlex>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { NFlex } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import ColorNameSearch from './components/ColorNameSearch.vue'
import ColorNameTable from './components/ColorNameTable.vue'
import WhatIsHtmlColorNames from './components/WhatIsHtmlColorNames.vue'

const search = useStorage('tools:html-color-names:search', '')
const category = useStorage('tools:html-color-names:category', 'all')
</script>
