<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HtmlEntityConverter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import HtmlEntityConverter from './components/HtmlEntityConverter.vue'
</script>
