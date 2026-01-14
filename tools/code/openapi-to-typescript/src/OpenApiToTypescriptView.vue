<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <OpenApiToTypescript />
    <WhatIsOpenApi />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import OpenApiToTypescript from './components/OpenApiToTypescript.vue'
import WhatIsOpenApi from './components/WhatIsOpenApi.vue'
</script>
