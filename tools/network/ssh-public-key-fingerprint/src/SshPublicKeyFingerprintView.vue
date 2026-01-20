<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <SshPublicKeyFingerprint />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import SshPublicKeyFingerprint from './components/SshPublicKeyFingerprint.vue'
</script>
