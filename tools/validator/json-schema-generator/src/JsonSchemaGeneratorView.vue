<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <JsonSchemaGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import JsonSchemaGenerator from './components/JsonSchemaGenerator.vue'
</script>
