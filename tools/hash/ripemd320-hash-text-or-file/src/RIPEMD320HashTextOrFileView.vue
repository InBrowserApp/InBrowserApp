<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HashTextOrFileTemplate :hash="hashFunction" />
    <WhatIsRIPEMD320 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import WhatIsRIPEMD320 from './WhatIsRIPEMD320.vue'
import { hashRipemd } from '@utils/ripemd'

async function hashFunction(blob: Blob): Promise<ArrayBuffer> {
  const arrayBuffer = await blob.arrayBuffer()
  return hashRipemd(arrayBuffer, 320)
}
</script>
