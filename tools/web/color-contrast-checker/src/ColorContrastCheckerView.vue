<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ColorContrastChecker />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import ColorContrastChecker from './components/ColorContrastChecker.vue'
</script>
