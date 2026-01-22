<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <SitemapXmlGenerator />
    <WhatIsSitemapXmlGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import SitemapXmlGenerator from './components/SitemapXmlGenerator.vue'
import WhatIsSitemapXmlGenerator from './components/WhatIsSitemapXmlGenerator.vue'
</script>
