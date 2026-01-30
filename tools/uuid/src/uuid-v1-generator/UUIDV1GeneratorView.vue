<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>UUID v1</ToolSectionHeader>
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

    <WhatIsUUIDv1 />
  </ToolDefaultPageLayout>
</template>

<script lang="ts" setup>
import * as toolInfo from './infos'
import { NDivider } from 'naive-ui'
import { ref, watch } from 'vue'
import WhatIsUUIDv1 from '../descriptions/WhatIsUUIDv1.vue'
import { parseMACAddressToArrayBuffer } from '@utils/mac-address'
import ClockSeqInput from './ClockSeqInput.vue'
import type { UUIDv1 } from '@utils/uuid'
import { useStorage } from '@vueuse/core'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'
import { UUIDDisplay } from '@shared/ui/domain/uuid'
import { MACAddressInputFormItem } from '@shared/ui/domain/mac-address'
import { randomMACAddress } from '@utils/mac-address'
import {
  ToolDefaultPageLayout,
  ToolConfigHeader,
  ToolSectionHeader,
  ToolSection,
} from '@shared/ui/tool'
import { v1 as uuidV1 } from 'uuid'

const macAddress = useStorage<string>('tools:uuid-v1-generator:mac-address', randomMACAddress())
const clockSeq = useStorage<number>(
  'tools:uuid-v1-generator:clock-seq',
  Math.floor(Math.random() * 0x3fff),
)

const getUUIDv1 = (): UUIDv1 =>
  uuidV1({
    node: new Uint8Array(parseMACAddressToArrayBuffer(macAddress.value)),
    clockseq: clockSeq.value,
  }) as UUIDv1

const uuid = ref<UUIDv1>(getUUIDv1())

function regenerateUUID() {
  uuid.value = getUUIDv1()
}

watch(macAddress, () => {
  regenerateUUID()
})

watch(clockSeq, () => {
  regenerateUUID()
})
</script>
