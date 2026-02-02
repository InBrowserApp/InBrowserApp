import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorNameTable from './ColorNameTable.vue'

const { colorDataSample, CopyToClipboardTooltipStub } = vi.hoisted(() => ({
  colorDataSample: [
    { name: 'Red', hex: '#FF0000', rgb: [255, 0, 0], category: 'red' },
    { name: 'Sky', hex: '#00AEEF', rgb: [0, 174, 239], category: 'blue' },
    { name: 'Snow', hex: '#FFFFFF', rgb: [255, 255, 255], category: 'white' },
  ],
  CopyToClipboardTooltipStub: {
    name: 'CopyToClipboardTooltip',
    props: ['content'],
    template: '<span class="copy"><slot :copy="() => {}" /></span>',
  },
}))

vi.mock('../data/colorData', () => ({
  colorData: colorDataSample,
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardTooltip: CopyToClipboardTooltipStub,
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NDataTable = defineComponent({
    name: 'NDataTable',
    props: ['columns', 'data', 'bordered', 'size', 'rowKey', 'pagination'],
    template: '<div class="n-data-table" />',
  })

  return {
    NDataTable,
  }
})

describe('ColorNameTable', () => {
  it('filters rows by search and category', () => {
    const allWrapper = mount(ColorNameTable, {
      props: {
        search: '',
        category: 'all',
      },
    })

    const allData = allWrapper
      .findComponent({ name: 'NDataTable' })
      .props('data') as typeof colorDataSample
    expect(allData).toHaveLength(3)

    const searchWrapper = mount(ColorNameTable, {
      props: {
        search: 'ff',
        category: 'all',
      },
    })

    const searchData = searchWrapper
      .findComponent({ name: 'NDataTable' })
      .props('data') as typeof colorDataSample
    expect(searchData).toHaveLength(2)

    const categoryWrapper = mount(ColorNameTable, {
      props: {
        search: '',
        category: 'blue',
      },
    })

    const categoryData = categoryWrapper
      .findComponent({ name: 'NDataTable' })
      .props('data') as typeof colorDataSample
    expect(categoryData).toHaveLength(1)
    expect(categoryData[0]?.name).toBe('Sky')
  })

  it('builds column renderers with expected content', () => {
    const wrapper = mount(ColorNameTable, {
      props: {
        search: '',
        category: 'all',
      },
    })

    const columns = wrapper.findComponent({ name: 'NDataTable' }).props('columns') as Array<{
      key: string
      render: (row: (typeof colorDataSample)[number]) => { props?: Record<string, unknown> }
    }>

    const row = colorDataSample[0]!
    const swatch = columns.find((col) => col.key === 'swatch')?.render(row)
    expect(swatch?.props?.style).toMatchObject({ backgroundColor: row.hex })

    const nameColumn = columns.find((col) => col.key === 'name')?.render(row)
    expect(nameColumn?.props?.content).toBe(row.name)

    const hexColumn = columns.find((col) => col.key === 'hex')?.render(row)
    expect(hexColumn?.props?.content).toBe(row.hex)

    const rgbColumn = columns.find((col) => col.key === 'rgb')?.render(row)
    expect(rgbColumn?.props?.content).toBe('rgb(255, 0, 0)')
  })
})
