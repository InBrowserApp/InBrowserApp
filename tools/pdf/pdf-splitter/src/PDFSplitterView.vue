<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PDFSplitterTool />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import PDFSplitterTool from './components/PDFSplitterTool.vue'
</script>
