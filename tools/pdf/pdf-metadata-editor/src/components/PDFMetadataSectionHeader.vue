<template>
  <ToolSectionHeader>
    <n-flex align="center" :size="8">
      <n-icon :size="18">
        <component :is="icon" />
      </n-icon>
      <span>{{ title }}</span>
    </n-flex>
  </ToolSectionHeader>
</template>

<script setup lang="ts">
import { NFlex, NIcon } from 'naive-ui'
import type { Component } from 'vue'
import { ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  title: string
  icon: Component
}>()
</script>
