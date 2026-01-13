<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CertificatePublicKeyParser />
    <WhatIsCertificatePublicKey />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import CertificatePublicKeyParser from './components/CertificatePublicKeyParser.vue'
import WhatIsCertificatePublicKey from './components/WhatIsCertificatePublicKey.vue'
</script>
