<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PDFPageOrganizerTool />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import PDFPageOrganizerTool from './components/PDFPageOrganizerTool.vue'
</script>
