<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <ToolSectionHeader>Nil UUID</ToolSectionHeader>
    <ToolSection>
      <UUIDDisplay :uuid="uuid" />
    </ToolSection>

    <ToolSection>
      <CopyToClipboardButton :content="uuid" />
    </ToolSection>

    <WhatIsNilUUID />
  </ToolDefaultPageLayout>
</template>

<script lang="ts" setup>
import * as toolInfo from './infos'
import WhatIsNilUUID from '../descriptions/WhatIsNilUUID.vue'
import { CopyToClipboardButton } from '@shared/ui/base'
import { UUIDDisplay } from '@shared/ui/domain/uuid'
import { ToolDefaultPageLayout, ToolSectionHeader, ToolSection } from '@shared/ui/tool'

const uuid = '00000000-0000-0000-0000-000000000000'
</script>
