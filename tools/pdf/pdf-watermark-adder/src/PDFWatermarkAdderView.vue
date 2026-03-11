<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PDFWatermarkAdderTool />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import PDFWatermarkAdderTool from './components/PDFWatermarkAdderTool.vue'
</script>
