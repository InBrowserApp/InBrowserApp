<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <FileToDataUriConverter />
    <WhatIsDataUri />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import FileToDataUriConverter from './components/FileToDataUriConverter.vue'
import WhatIsDataUri from './components/WhatIsDataUri.vue'
</script>
