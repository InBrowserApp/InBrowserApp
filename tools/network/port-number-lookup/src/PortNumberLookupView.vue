<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <NFlex vertical :size="24">
      <PortSearch v-model:search="search" v-model:category="category" />
      <PortTable :search="search" :category="category" />
      <WhatIsPort />
    </NFlex>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { NFlex } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import PortSearch from './components/PortSearch.vue'
import PortTable from './components/PortTable.vue'
import WhatIsPort from './components/WhatIsPort.vue'

const search = useStorage('tools:port-number-lookup:search', '')
const category = useStorage('tools:port-number-lookup:category', 'all')
</script>
