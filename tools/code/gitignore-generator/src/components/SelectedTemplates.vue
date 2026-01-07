<template>
  <n-dynamic-tags v-model:value="modelValue">
    <template #input="{ submit, deactivate }">
      <n-auto-complete
        ref="autoCompleteInstRef"
        v-model:value="inputValue"
        size="small"
        :options="filteredOptions"
        :placeholder="t('addTemplate')"
        :clear-after-select="true"
        @select="submit($event)"
        @blur="deactivate"
      />
    </template>
    <template #trigger="{ activate, disabled }">
      <n-button size="small" type="primary" dashed :disabled="disabled" @click="activate()">
        <template #icon>
          <n-icon><AddIcon /></n-icon>
        </template>
        {{ t('add') }}
      </n-button>
    </template>
  </n-dynamic-tags>
</template>

<script setup lang="ts">
import type { AutoCompleteInst } from 'naive-ui'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDynamicTags, NAutoComplete, NButton, NIcon } from 'naive-ui'
import { Add12Regular as AddIcon } from '@shared/icons/fluent'

const props = defineProps<{
  allTemplates: string[]
}>()

const modelValue = defineModel<string[]>({ required: true })

const { t } = useI18n()

const autoCompleteInstRef = ref<AutoCompleteInst | null>(null)
watch(autoCompleteInstRef, (value) => {
  if (value) nextTick(() => value.focus())
})

const inputValue = ref('')

// Filter options: show templates that match input and are not already selected
const filteredOptions = computed(() => {
  const query = inputValue.value.toLowerCase()
  return props.allTemplates
    .filter((name) => !modelValue.value.includes(name))
    .filter((name) => name.toLowerCase().includes(query))
    .slice(0, 20)
    .map((name) => ({ label: name, value: name }))
})
</script>

<i18n lang="json">
{
  "en": {
    "addTemplate": "Search and add template...",
    "add": "Add"
  },
  "zh": {
    "addTemplate": "搜索并添加模板...",
    "add": "添加"
  },
  "zh-CN": {
    "addTemplate": "搜索并添加模板...",
    "add": "添加"
  },
  "zh-TW": {
    "addTemplate": "搜尋並新增模板...",
    "add": "新增"
  },
  "zh-HK": {
    "addTemplate": "搜尋並新增模板...",
    "add": "新增"
  },
  "es": {
    "addTemplate": "Buscar y agregar plantilla...",
    "add": "Agregar"
  },
  "fr": {
    "addTemplate": "Rechercher et ajouter un modèle...",
    "add": "Ajouter"
  },
  "de": {
    "addTemplate": "Suchen und Vorlage hinzufügen...",
    "add": "Hinzufügen"
  },
  "it": {
    "addTemplate": "Cerca e aggiungi modello...",
    "add": "Aggiungi"
  },
  "ja": {
    "addTemplate": "テンプレートを検索して追加...",
    "add": "追加"
  },
  "ko": {
    "addTemplate": "템플릿 검색 및 추가...",
    "add": "추가"
  },
  "ru": {
    "addTemplate": "Найти и добавить шаблон...",
    "add": "Добавить"
  },
  "pt": {
    "addTemplate": "Pesquisar e adicionar modelo...",
    "add": "Adicionar"
  },
  "ar": {
    "addTemplate": "البحث وإضافة قالب...",
    "add": "إضافة"
  },
  "hi": {
    "addTemplate": "खोजें और टेम्पलेट जोड़ें...",
    "add": "जोड़ें"
  },
  "tr": {
    "addTemplate": "Şablon ara ve ekle...",
    "add": "Ekle"
  },
  "nl": {
    "addTemplate": "Zoek en voeg sjabloon toe...",
    "add": "Toevoegen"
  },
  "sv": {
    "addTemplate": "Sök och lägg till mall...",
    "add": "Lägg till"
  },
  "pl": {
    "addTemplate": "Wyszukaj i dodaj szablon...",
    "add": "Dodaj"
  },
  "vi": {
    "addTemplate": "Tìm và thêm mẫu...",
    "add": "Thêm"
  },
  "th": {
    "addTemplate": "ค้นหาและเพิ่มเทมเพลต...",
    "add": "เพิ่ม"
  },
  "id": {
    "addTemplate": "Cari dan tambahkan template...",
    "add": "Tambah"
  },
  "he": {
    "addTemplate": "חפש והוסף תבנית...",
    "add": "הוסף"
  },
  "ms": {
    "addTemplate": "Cari dan tambah templat...",
    "add": "Tambah"
  },
  "no": {
    "addTemplate": "Søk og legg til mal...",
    "add": "Legg til"
  }
}
</i18n>
