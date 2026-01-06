<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <NFlex vertical :size="24">
      <HttpStatusCodeSearch v-model:search="search" v-model:category="category" />
      <HttpStatusCodeTable :search="search" :category="category" />
      <WhatIsHttpStatusCode />
    </NFlex>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { NFlex } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import HttpStatusCodeSearch from './components/HttpStatusCodeSearch.vue'
import HttpStatusCodeTable from './components/HttpStatusCodeTable.vue'
import WhatIsHttpStatusCode from './components/WhatIsHttpStatusCode.vue'

const search = useStorage('tools:http-status-code-lookup:search', '')
const category = useStorage('tools:http-status-code-lookup:category', 'all')
</script>
