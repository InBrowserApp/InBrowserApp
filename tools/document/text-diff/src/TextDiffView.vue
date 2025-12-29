<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <TextDiff />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import TextDiff from './components/TextDiff.vue'
</script>
