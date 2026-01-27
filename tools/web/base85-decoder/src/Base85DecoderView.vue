<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Base85Decoder />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Base85Decoder from './components/Base85Decoder.vue'
</script>
