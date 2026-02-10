<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PDFMergerTool />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import PDFMergerTool from './components/PDFMergerTool.vue'
</script>
