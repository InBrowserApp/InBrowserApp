<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PDFPageNumberAdderTool />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import PDFPageNumberAdderTool from './components/PDFPageNumberAdderTool.vue'
</script>
