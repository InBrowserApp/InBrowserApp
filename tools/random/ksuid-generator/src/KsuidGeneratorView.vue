<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <KsuidGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import KsuidGenerator from './components/KsuidGenerator.vue'
</script>
