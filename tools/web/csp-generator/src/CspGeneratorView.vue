<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CspGenerator />
    <WhatIsCsp />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import CspGenerator from './components/CspGenerator.vue'
import WhatIsCsp from './components/WhatIsCsp.vue'
</script>
