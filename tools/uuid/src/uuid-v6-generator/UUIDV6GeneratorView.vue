<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>UUID v6</ToolSectionHeader>
    <ToolSection>
      <UUIDDisplay :uuid="uuid" />
    </ToolSection>

    <ToolSection>
      <RegenerateButton @click="regenerateUUID" />
      <n-divider vertical />
      <CopyToClipboardButton :content="uuid" />
    </ToolSection>

    <ToolConfigHeader />
    <ToolSection>
      <MACAddressInputFormItem v-model:address="macAddress" />
      <ClockSeqInput v-model:clock-seq="clockSeq" />
    </ToolSection>

    <WhatIsUUIDv6 />
  </ToolDefaultPageLayout>
</template>

<script lang="ts" setup>
import * as toolInfo from './infos'
import { NDivider } from 'naive-ui'
import { ref, watch } from 'vue'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'
import { UUIDDisplay } from '@shared/ui/domain/uuid'
import WhatIsUUIDv6 from '../descriptions/WhatIsUUIDv6.vue'
import { MACAddressInputFormItem } from '@shared/ui/domain/mac-address'
import { parseMACAddressToArrayBuffer } from '@utils/mac-address'
import ClockSeqInput from './ClockSeqInput.vue'
import type { UUIDv6 } from '@utils/uuid'
import { useStorage } from '@vueuse/core'
import { ToolConfigHeader, ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { randomMACAddress } from '@utils/mac-address'
import { ToolDefaultPageLayout } from '@shared/ui/tool'

import { v6 as uuidV6 } from 'uuid'

const macAddress = useStorage<string>('tools:uuid-v6-generator:mac-address', randomMACAddress())
const clockSeq = useStorage<number>(
  'tools:uuid-v6-generator:clock-seq',
  Math.floor(Math.random() * 0x3fff),
)

const getUUIDv6 = (): UUIDv6 =>
  uuidV6({
    node: new Uint8Array(parseMACAddressToArrayBuffer(macAddress.value)),
    clockseq: clockSeq.value,
  }) as UUIDv6

const uuid = ref<UUIDv6>(getUUIDv6())

function regenerateUUID() {
  uuid.value = getUUIDv6()
}

watch(macAddress, () => {
  regenerateUUID()
})

watch(clockSeq, () => {
  regenerateUUID()
})
</script>
