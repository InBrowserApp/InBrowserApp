<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CspParser />
    <WhatIsCsp />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import CspParser from './components/CspParser.vue'
import WhatIsCsp from './components/WhatIsCsp.vue'
</script>
