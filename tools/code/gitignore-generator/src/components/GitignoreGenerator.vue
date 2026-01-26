<template>
  <GitignoreTemplateSelector
    v-model:search-query="searchQuery"
    v-model:selected-templates="selectedTemplates"
    v-model:expanded-names="expandedNames"
    :popular-template-names="popularTemplateNames"
    :all-template-names="allTemplateNames"
    :filtered-language-templates="filteredLanguageTemplates"
    :filtered-global-templates="filteredGlobalTemplates"
    :filtered-community-templates="filteredCommunityTemplates"
    :template-icons="templateIcons"
  />

  <GitignorePreview
    :selected-count="selectedTemplates.length"
    :generated-content="generatedContent"
    :download-url="downloadUrl"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import {
  NodeDotjsIcon,
  PythonIcon,
  GoIcon,
  RustIcon,
  AppleIcon,
  LinuxIcon,
  JetBrainsIcon,
  OpenJdkIcon,
} from 'vue3-simple-icons'
import WindowsIcon from '@vicons/ionicons5/LogoWindows'
import { templates, getTemplatesByCategory, popularTemplates } from '../templates'
import GitignorePreview from './GitignorePreview.vue'
import GitignoreTemplateSelector from './GitignoreTemplateSelector.vue'
import VisualStudioCodeIcon from './icons/VisualStudioCodeIcon.vue'

// Icon mapping for quick select templates
const templateIcons: Record<string, unknown> = {
  Node: NodeDotjsIcon,
  Python: PythonIcon,
  Java: OpenJdkIcon,
  Go: GoIcon,
  Rust: RustIcon,
  macOS: AppleIcon,
  Windows: WindowsIcon,
  Linux: LinuxIcon,
  VisualStudioCode: VisualStudioCodeIcon,
  JetBrains: JetBrainsIcon,
}

const searchQuery = ref('')
const selectedTemplates = useStorage<string[]>('tools:gitignore-generator:selected', [])

const groupedTemplates = computed(() => getTemplatesByCategory())

// Filter templates by search query
const filterBySearch = (templateList: typeof templates) => {
  if (!searchQuery.value) return templateList
  const query = searchQuery.value.toLowerCase()
  return templateList.filter((t) => t.name.toLowerCase().includes(query))
}

const filteredLanguageTemplates = computed(() => filterBySearch(groupedTemplates.value.language))
const filteredGlobalTemplates = computed(() => filterBySearch(groupedTemplates.value.global))
const filteredCommunityTemplates = computed(() => filterBySearch(groupedTemplates.value.community))

// Expanded collapse state
const expandedNames = ref<string[]>([])

// Auto-expand all categories when searching
watch(searchQuery, (query) => {
  if (query) {
    const names: string[] = []
    if (filteredLanguageTemplates.value.length > 0) names.push('language')
    if (filteredGlobalTemplates.value.length > 0) names.push('global')
    if (filteredCommunityTemplates.value.length > 0) names.push('community')
    expandedNames.value = names
  }
})

// Filter popular templates to only include existing ones
const popularTemplateNames = computed(() => {
  const allNames = templates.map((t) => t.name)
  return popularTemplates.filter((name) => allNames.includes(name))
})

// All template names for auto-complete
const allTemplateNames = computed(() => templates.map((t) => t.name))

// Generate gitignore content
const generatedContent = computed(() => {
  const selected = templates.filter((t) => selectedTemplates.value.includes(t.name))
  if (selected.length === 0) return ''

  return selected.map((t) => `### ${t.name} ###\n${t.content}`).join('\n\n')
})

const downloadBlob = computed(() => {
  if (!generatedContent.value) return null
  return new Blob([generatedContent.value], { type: 'text/plain;charset=utf-8' })
})
const downloadUrl = useObjectUrl(downloadBlob)
</script>

<style scoped>
:deep(.n-tag .n-tag__icon) {
  font-size: 14px;
}

:deep(.n-tag.n-tag--checkable.n-tag--checked .n-tag__icon) {
  color: var(--n-text-color-checked);
}
</style>
