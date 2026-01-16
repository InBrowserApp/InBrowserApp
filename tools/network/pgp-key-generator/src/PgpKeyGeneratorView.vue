<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <KeyGenerator />
    <WhatIsPgpKey />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import KeyGenerator from './components/KeyGenerator.vue'
import WhatIsPgpKey from './components/WhatIsPgpKey.vue'
</script>
