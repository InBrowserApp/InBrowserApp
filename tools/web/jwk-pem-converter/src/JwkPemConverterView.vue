<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <JwkPemConverter />
    <WhatIsJwkPem />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import JwkPemConverter from './components/JwkPemConverter.vue'
import WhatIsJwkPem from './components/WhatIsJwkPem.vue'
</script>
