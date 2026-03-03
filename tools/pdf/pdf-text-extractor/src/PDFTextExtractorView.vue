<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PDFTextExtractor />
    <WhatIsPDFTextExtractor />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import PDFTextExtractor from './components/PDFTextExtractor.vue'
import WhatIsPDFTextExtractor from './components/WhatIsPDFTextExtractor.vue'
</script>
