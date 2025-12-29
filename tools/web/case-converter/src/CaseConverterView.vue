<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CaseConverter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import CaseConverter from './components/CaseConverter.vue'
</script>
