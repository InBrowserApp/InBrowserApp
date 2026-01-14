<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CspGeneratorParser />
    <WhatIsCsp />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import CspGeneratorParser from './components/CspGeneratorParser.vue'
import WhatIsCsp from './components/WhatIsCsp.vue'
</script>
