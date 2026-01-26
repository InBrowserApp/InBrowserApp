<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HashTextOrFileTemplate :hash="hashFunction" />
    <WhatIsSHA224 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import WhatIsSHA224 from './WhatIsSHA224.vue'
import SHA224 from 'crypto-js/sha224'
import WordArray from 'crypto-js/lib-typedarrays'

async function hashFunction(blob: Blob): Promise<ArrayBuffer> {
  const arrayBuffer = await blob.arrayBuffer()
  // Convert ArrayBuffer to WordArray for crypto-js
  const wordArray = WordArray.create(arrayBuffer)
  const hash = SHA224(wordArray)
  const hashBytes = new Uint8Array(hash.sigBytes)
  for (let i = 0; i < hash.sigBytes; i++) {
    hashBytes[i] = (hash.words[i >>> 2]! >>> (24 - (i % 4) * 8)) & 0xff
  }
  return hashBytes.buffer
}
</script>
