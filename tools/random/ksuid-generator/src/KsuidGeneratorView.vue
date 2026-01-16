<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <KsuidGenerator />
    <WhatIsKsuid />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import KsuidGenerator from './components/KsuidGenerator.vue'
import WhatIsKsuid from './components/WhatIsKsuid.vue'
</script>
