<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <div style="display: grid; gap: 24px">
      <UserAgentParser />
      <WhatIsUserAgent />
    </div>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import UserAgentParser from './components/UserAgentParser.vue'
import WhatIsUserAgent from './components/WhatIsUserAgent.vue'
</script>
