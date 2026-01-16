<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Cuid2Generator />
    <WhatIsCuid2 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Cuid2Generator from './components/Cuid2Generator.vue'
import WhatIsCuid2 from './components/WhatIsCuid2.vue'
</script>
