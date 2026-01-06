<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <DataUriToFileConverter />
    <WhatIsDataUri />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import DataUriToFileConverter from './components/DataUriToFileConverter.vue'
import WhatIsDataUri from './components/WhatIsDataUri.vue'
</script>
