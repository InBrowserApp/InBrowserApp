<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ColorPickerTool />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import ColorPickerTool from './components/ColorPickerTool.vue'
</script>
