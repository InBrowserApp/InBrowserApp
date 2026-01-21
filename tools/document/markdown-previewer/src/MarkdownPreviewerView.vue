<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <MarkdownPreviewer />
    <WhatIsMarkdown />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import MarkdownPreviewer from './components/MarkdownPreviewer.vue'
import WhatIsMarkdown from './components/WhatIsMarkdown.vue'
</script>
