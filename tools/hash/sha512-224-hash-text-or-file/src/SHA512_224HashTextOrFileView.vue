<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HashTextOrFileTemplate :hash="hashFunction" />
    <WhatIsSHA512224 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import { sha512_224 } from '@noble/hashes/sha2.js'
import WhatIsSHA512224 from './WhatIsSHA512_224.vue'

async function hashFunction(blob: Blob): Promise<ArrayBuffer> {
  const arrayBuffer = await blob.arrayBuffer()
  const hashBytes = sha512_224(new Uint8Array(arrayBuffer))
  const buffer = new ArrayBuffer(hashBytes.byteLength)
  new Uint8Array(buffer).set(hashBytes)
  return buffer
}
</script>
