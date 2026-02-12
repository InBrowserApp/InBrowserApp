<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ArchiveViewer />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import ArchiveViewer from './components/ArchiveViewer.vue'
</script>
