<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PasswordStrengthChecker />
    <WhatIsPasswordStrength />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import PasswordStrengthChecker from './components/PasswordStrengthChecker.vue'
import WhatIsPasswordStrength from './components/WhatIsPasswordStrength.vue'
</script>
