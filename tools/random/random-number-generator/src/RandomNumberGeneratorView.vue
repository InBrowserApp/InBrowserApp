<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <RandomNumberGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import RandomNumberGenerator from './components/RandomNumberGenerator.vue'
</script>
