<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ColorConverter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import ColorConverter from './components/ColorConverter.vue'
</script>
