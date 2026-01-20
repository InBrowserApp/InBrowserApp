<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CurlConverter />
    <WhatIsCurlConverter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import CurlConverter from './components/CurlConverter.vue'
import WhatIsCurlConverter from './components/WhatIsCurlConverter.vue'
</script>
