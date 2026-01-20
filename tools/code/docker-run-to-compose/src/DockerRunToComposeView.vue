<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <DockerRunToCompose />
    <WhatIsDockerRunToCompose />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import DockerRunToCompose from './components/DockerRunToCompose.vue'
import WhatIsDockerRunToCompose from './components/WhatIsDockerRunToCompose.vue'
</script>
