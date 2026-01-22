<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CodeScreenshotGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import CodeScreenshotGenerator from './components/CodeScreenshotGenerator.vue'
</script>
