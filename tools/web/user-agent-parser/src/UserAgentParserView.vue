<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <NFlex vertical :size="24">
      <UserAgentParser />
      <WhatIsUserAgent />
    </NFlex>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { NFlex } from 'naive-ui'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import UserAgentParser from './components/UserAgentParser.vue'
import WhatIsUserAgent from './components/WhatIsUserAgent.vue'
</script>
