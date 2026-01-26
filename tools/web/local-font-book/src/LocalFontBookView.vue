<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <LocalFontBookTool />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import LocalFontBookTool from './components/LocalFontBookTool.vue'
</script>
