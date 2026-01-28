<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HashTextOrFileTemplate :hash="hashFunction" />
    <WhatIsMD4 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import WhatIsMD4 from './WhatIsMD4.vue'
import { md4 } from 'hash-wasm'

function hexToBytes(hex: string): Uint8Array {
  const normalized = hex.padStart(hex.length + (hex.length % 2), '0')
  const bytes = new Uint8Array(normalized.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

async function hashFunction(blob: Blob): Promise<ArrayBuffer> {
  const arrayBuffer = await blob.arrayBuffer()
  const hashHex = await md4(new Uint8Array(arrayBuffer))
  const hashBytes = hexToBytes(hashHex)
  return hashBytes.buffer as ArrayBuffer
}
</script>
