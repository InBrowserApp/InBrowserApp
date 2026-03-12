<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PDFMetadataEditorTool />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import PDFMetadataEditorTool from './components/PDFMetadataEditorTool.vue'
</script>
