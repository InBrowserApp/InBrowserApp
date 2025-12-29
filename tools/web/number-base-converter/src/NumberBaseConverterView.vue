<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <NumberBaseConverter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import NumberBaseConverter from './components/NumberBaseConverter.vue'
</script>
