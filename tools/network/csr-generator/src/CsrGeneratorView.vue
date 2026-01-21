<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CsrGenerator />
    <WhatIsCsr />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import CsrGenerator from './components/CsrGenerator.vue'
import WhatIsCsr from './components/WhatIsCsr.vue'
</script>
