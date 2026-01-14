<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <UserAgentParser />
    <WhatIsUserAgent />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import UserAgentParser from './components/UserAgentParser.vue'
import WhatIsUserAgent from './components/WhatIsUserAgent.vue'
</script>
