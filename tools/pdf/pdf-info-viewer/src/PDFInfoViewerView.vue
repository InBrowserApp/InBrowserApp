<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PDFInfoViewer />
    <WhatIsPDFInfo />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import PDFInfoViewer from './components/PDFInfoViewer.vue'
import WhatIsPDFInfo from './components/WhatIsPDFInfo.vue'
</script>
