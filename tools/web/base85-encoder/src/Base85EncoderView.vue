<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Base85Encoder />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Base85Encoder from './components/Base85Encoder.vue'
</script>
