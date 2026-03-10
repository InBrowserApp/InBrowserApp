<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ListComparerTool />
    <WhatIsListComparer />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import ListComparerTool from './components/ListComparerTool.vue'
import WhatIsListComparer from './components/WhatIsListComparer.vue'
</script>
