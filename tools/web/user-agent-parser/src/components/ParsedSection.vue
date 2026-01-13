<template>
  <n-card size="small" :title="title">
    <n-descriptions :column="1" bordered label-placement="left">
      <n-descriptions-item v-for="item in items" :key="item.label" :label="item.label">
        <n-text>{{ item.value }}</n-text>
      </n-descriptions-item>
    </n-descriptions>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NDescriptions, NDescriptionsItem, NText } from 'naive-ui'

defineProps<{
  title: string
  items: { label: string; value: string }[]
}>()
</script>
