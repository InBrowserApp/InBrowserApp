<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <KeyGenerator />
    <WhatIsSshKey />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import KeyGenerator from './components/KeyGenerator.vue'
import WhatIsSshKey from './components/WhatIsSshKey.vue'
</script>
