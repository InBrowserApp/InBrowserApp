<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <DecryptForm />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import DecryptForm from './components/DecryptForm.vue'
</script>
