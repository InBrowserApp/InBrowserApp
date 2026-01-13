<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <JsonSchemaValidator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import JsonSchemaValidator from './components/JsonSchemaValidator.vue'
</script>
