<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <SqlFormatterAndLinter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import SqlFormatterAndLinter from './components/SqlFormatterAndLinter.vue'
</script>
