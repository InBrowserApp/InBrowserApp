<template>
  <ToolSectionHeader>{{ title }}</ToolSectionHeader>
  <ToolSection>
    <n-empty v-if="!hasOutput" :description="emptyState" />
    <n-grid v-else cols="1 s:2 l:3" responsive="screen" :x-gap="12" :y-gap="12">
      <n-gi v-for="section in sections" :key="section.title">
        <ParsedSection :title="section.title" :items="section.items" />
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NEmpty, NGi, NGrid } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ParsedSection from './ParsedSection.vue'

defineProps<{
  title: string
  emptyState: string
  hasOutput: boolean
  sections: { title: string; items: { label: string; value: string }[] }[]
}>()
</script>
