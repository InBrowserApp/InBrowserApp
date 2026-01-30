<template>
  <n-el>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="markdown" v-html="markdownHtml"></p>
  </n-el>
</template>

<script setup lang="ts">
import { NEl } from 'naive-ui'
import { parse } from 'marked'
import { computed } from 'vue'

const props = defineProps<{
  markdown: string
}>()

const markdownHtml = computed(() => parse(props.markdown))
</script>

<style scoped>
.markdown {
  color: var(--text-color-1);
}

.markdown :deep(a) {
  color: inherit;
  text-decoration: none;
}

.markdown :deep(a:hover) {
  text-decoration: underline;
}

.markdown :deep(h1) {
  font-weight: var(--font-weight-strong);
  font-size: 30px;
}

.markdown :deep(h2) {
  font-weight: var(--font-weight-strong);
  font-size: 22px;
}
</style>
