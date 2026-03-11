<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PDFCompressorTool />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import PDFCompressorTool from './components/PDFCompressorTool.vue'
</script>
