<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <NFlex vertical :size="24">
      <MimeTypeSearch v-model:search="search" v-model:category="category" />
      <MimeTypeTable :search="search" :category="category" />
      <WhatIsMimeType />
    </NFlex>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { NFlex } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import MimeTypeSearch from './components/MimeTypeSearch.vue'
import MimeTypeTable from './components/MimeTypeTable.vue'
import WhatIsMimeType from './components/WhatIsMimeType.vue'

const search = useStorage('tools:mime-type-lookup:search', '')
const category = useStorage('tools:mime-type-lookup:category', 'all')
</script>
