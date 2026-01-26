<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Base58Encoder />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Base58Encoder from './components/Base58Encoder.vue'
</script>
