<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <EncryptForm />
    <WhatIsAes />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import EncryptForm from './components/EncryptForm.vue'
import WhatIsAes from './components/WhatIsAes.vue'
</script>
