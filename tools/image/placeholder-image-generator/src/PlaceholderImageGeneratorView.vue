<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PlaceholderImageGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import PlaceholderImageGenerator from './components/PlaceholderImageGenerator.vue'
</script>
