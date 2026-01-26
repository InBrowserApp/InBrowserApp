<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HashTextOrFileTemplate :hash="hashFunction" />
    <WhatIsRIPEMD128 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import WhatIsRIPEMD128 from './WhatIsRIPEMD128.vue'
import { hashRipemd } from '@utils/ripemd'

async function hashFunction(blob: Blob): Promise<ArrayBuffer> {
  const arrayBuffer = await blob.arrayBuffer()
  return hashRipemd(arrayBuffer, 128)
}
</script>
