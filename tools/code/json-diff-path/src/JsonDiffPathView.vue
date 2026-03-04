<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <JsonDiffPathTool />
    <WhatIsJsonDiffPath />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import JsonDiffPathTool from './components/JsonDiffPathTool.vue'
import WhatIsJsonDiffPath from './components/WhatIsJsonDiffPath.vue'
</script>
