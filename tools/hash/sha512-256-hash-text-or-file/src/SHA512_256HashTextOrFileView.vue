<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HashTextOrFileTemplate :hash="hashFunction" />
    <WhatIsSHA512_256 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import { sha512_256 } from '@noble/hashes/sha512'
import WhatIsSHA512_256 from './WhatIsSHA512_256.vue'

async function hashFunction(blob: Blob): Promise<ArrayBuffer> {
  const arrayBuffer = await blob.arrayBuffer()
  const hashBytes = sha512_256(new Uint8Array(arrayBuffer))
  const buffer = new ArrayBuffer(hashBytes.byteLength)
  new Uint8Array(buffer).set(hashBytes)
  return buffer
}
</script>
