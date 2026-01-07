<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <GitignoreGenerator />
    <WhatIsGitignore />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import GitignoreGenerator from './components/GitignoreGenerator.vue'
import WhatIsGitignore from './components/WhatIsGitignore.vue'
</script>
