<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <OpenApiToTypescript />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import OpenApiToTypescript from './components/OpenApiToTypescript.vue'
</script>
