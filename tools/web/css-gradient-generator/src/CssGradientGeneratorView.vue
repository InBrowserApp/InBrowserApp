<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CssGradientGeneratorTool />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import CssGradientGeneratorTool from './components/CssGradientGeneratorTool.vue'
</script>
