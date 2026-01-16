<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <JsonSchemaGenerator />
    <WhatIsJsonSchema />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import JsonSchemaGenerator from './components/JsonSchemaGenerator.vue'
import WhatIsJsonSchema from './components/WhatIsJsonSchema.vue'
</script>
