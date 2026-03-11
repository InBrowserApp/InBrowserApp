<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CSPParserBuilder />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import CSPParserBuilder from './components/CSPParserBuilder.vue'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
</script>
