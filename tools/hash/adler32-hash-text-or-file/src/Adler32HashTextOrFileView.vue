<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HashTextOrFileTemplate :hash="hashFunction" />
    <WhatIsAdler32 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import WhatIsAdler32 from './WhatIsAdler32.vue'
import { createAdler32 } from 'hash-wasm'

async function hashFunction(blob: Blob): Promise<ArrayBuffer> {
  const hasher = await createAdler32()
  const reader = blob.stream().getReader()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      hasher.update(value)
    }
  } finally {
    reader.releaseLock()
  }

  const hashBytes = hasher.digest('binary') as Uint8Array
  const output = new Uint8Array(hashBytes.length)
  output.set(hashBytes)
  return output.buffer
}
</script>
