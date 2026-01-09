<template>
  <NDataTable
    :columns="columns"
    :data="filteredColors"
    :bordered="false"
    size="small"
    :row-key="(row: HtmlColorInfo) => row.name"
    :pagination="{ pageSize: 20 }"
  />
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import { colorData, type HtmlColorInfo } from '../data/colorData'

const props = defineProps<{
  search: string
  category: string
}>()

const { t } = useI18n()

const filteredColors = computed(() => {
  let result = colorData

  // Filter by category
  if (props.category !== 'all') {
    result = result.filter((c) => c.category === props.category)
  }

  // Filter by search
  if (props.search) {
    const query = props.search.toLowerCase()
    result = result.filter(
      (c) => c.name.toLowerCase().includes(query) || c.hex.toLowerCase().includes(query),
    )
  }

  return result
})

const columns = computed<DataTableColumns<HtmlColorInfo>>(() => [
  {
    title: t('swatch'),
    key: 'swatch',
    width: 60,
    render(row) {
      return h('div', {
        style: {
          width: '32px',
          height: '32px',
          backgroundColor: row.hex,
          borderRadius: '4px',
          border: '1px solid var(--n-border-color)',
        },
      })
    },
  },
  {
    title: t('name'),
    key: 'name',
    width: 180,
    render(row) {
      return h(
        CopyToClipboardTooltip,
        { content: row.name },
        {
          default: ({ copy }: { copy: () => void }) =>
            h(
              'span',
              {
                style: { fontFamily: 'monospace', cursor: 'pointer' },
                onClick: copy,
              },
              row.name,
            ),
        },
      )
    },
  },
  {
    title: t('hex'),
    key: 'hex',
    width: 120,
    render(row) {
      return h(
        CopyToClipboardTooltip,
        { content: row.hex },
        {
          default: ({ copy }: { copy: () => void }) =>
            h(
              'span',
              {
                style: { fontFamily: 'monospace', cursor: 'pointer' },
                onClick: copy,
              },
              row.hex,
            ),
        },
      )
    },
  },
  {
    title: t('rgb'),
    key: 'rgb',
    render(row) {
      const rgbString = `rgb(${row.rgb[0]}, ${row.rgb[1]}, ${row.rgb[2]})`
      return h(
        CopyToClipboardTooltip,
        { content: rgbString },
        {
          default: ({ copy }: { copy: () => void }) =>
            h(
              'span',
              {
                style: { fontFamily: 'monospace', cursor: 'pointer' },
                onClick: copy,
              },
              rgbString,
            ),
        },
      )
    },
  },
])
</script>

<i18n lang="json">
{
  "en": {
    "swatch": "Color",
    "name": "Name",
    "hex": "HEX",
    "rgb": "RGB"
  },
  "zh": {
    "swatch": "颜色",
    "name": "名称",
    "hex": "十六进制",
    "rgb": "RGB"
  }
}
</i18n>
