<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <MarkdownPreviewer />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import MarkdownPreviewer from './components/MarkdownPreviewer.vue'
</script>
