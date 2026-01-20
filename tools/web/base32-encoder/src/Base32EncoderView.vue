<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Base32Encoder />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Base32Encoder from './components/Base32Encoder.vue'
</script>
