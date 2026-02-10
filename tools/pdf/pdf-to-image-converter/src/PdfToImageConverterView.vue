<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PdfToImageConverter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import PdfToImageConverter from './components/PdfToImageConverter.vue'
</script>
