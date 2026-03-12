<template>
  <ToolSectionHeader>{{ t('whatIsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-text>{{ t('whatIsLead') }}</n-text>
    <n-ul class="list">
      <n-li>{{ t('whatIsPointOne') }}</n-li>
      <n-li>{{ t('whatIsPointTwo') }}</n-li>
      <n-li>{{ t('whatIsPointThree') }}</n-li>
    </n-ul>
  </ToolSection>
</template>

<script setup lang="ts">
import { NLi, NText, NUl } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { messages } from '../locale/messages'

const { t } = useI18n({ useScope: 'local', messages })
</script>

<style scoped>
.list {
  margin: 12px 0 0;
  padding-left: 20px;
}
</style>
