<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <KeyGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import KeyGenerator from './components/KeyGenerator.vue'
</script>
