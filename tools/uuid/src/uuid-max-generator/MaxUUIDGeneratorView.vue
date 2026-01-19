<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <ToolSectionHeader>Max UUID</ToolSectionHeader>
    <ToolSection>
      <UUIDDisplay :uuid="uuid" />
    </ToolSection>

    <ToolSection>
      <CopyToClipboardButton :content="uuid" />
    </ToolSection>

    <WhatIsMaxUUID />
  </ToolDefaultPageLayout>
</template>

<script lang="ts" setup>
import * as toolInfo from './infos'
import WhatIsMaxUUID from '../descriptions/WhatIsMaxUUID.vue'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { UUIDDisplay } from '@shared/ui/domain/uuid'
import { ToolDefaultPageLayout } from '@shared/ui/tool'

const uuid = 'ffffffff-ffff-ffff-ffff-ffffffffffff'
</script>
