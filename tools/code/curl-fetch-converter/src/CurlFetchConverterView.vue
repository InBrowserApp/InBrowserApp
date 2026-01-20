<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CurlFetchConverter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import CurlFetchConverter from './components/CurlFetchConverter.vue'
</script>
