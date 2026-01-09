<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HmacForm
      v-model:secret-key="secretKey"
      v-model:algorithm="algorithm"
      v-model:message="message"
    />
    <HmacResult :secret-key="secretKey" :algorithm="algorithm" :message="message" />
    <WhatIsHmac />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import type { HmacAlgorithm } from './types'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { useStorage } from '@vueuse/core'
import HmacForm from './components/HmacForm.vue'
import HmacResult from './components/HmacResult.vue'
import WhatIsHmac from './components/WhatIsHmac.vue'

const secretKey = useStorage('tools:hmac-generator:secret-key', '')
const algorithm = useStorage<HmacAlgorithm>('tools:hmac-generator:algorithm', 'SHA-256')
const message = useStorage<string | File>('tools:hmac-generator:message', '')
</script>
