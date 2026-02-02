import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HttpStatusCodeTable from './HttpStatusCodeTable.vue'
import HttpStatusCodeDescription from './HttpStatusCodeDescription.vue'

const { statusCodesSample, CopyToClipboardTooltipStub } = vi.hoisted(() => ({
  statusCodesSample: [
    {
      code: 200,
      name: 'OK',
      category: 'success',
      description: 'Request succeeded',
      common: true,
    },
    {
      code: 201,
      name: 'Created',
      category: 'success',
      description: 'Created new resource',
    },
    {
      code: 301,
      name: 'Moved Permanently',
      category: 'redirection',
      description: 'Moved',
      common: true,
    },
    {
      code: 404,
      name: 'Not Found',
      category: 'client-error',
      description: 'Missing resource',
      common: true,
    },
    {
      code: 500,
      name: 'Server Error',
      category: 'server-error',
      description: 'Failure',
    },
  ],
  CopyToClipboardTooltipStub: {
    name: 'CopyToClipboardTooltip',
    props: ['content'],
    template: '<span class="copy"><slot :copy="() => {}" /></span>',
  },
}))

vi.mock('../data/statusCodes', () => ({
  statusCodes: statusCodesSample,
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
    props: ['columns', 'data', 'bordered', 'size', 'rowKey'],
    template: '<div class="n-data-table" />',
  })

  const NTag = defineComponent({
    name: 'NTag',
    props: {
      type: {
        type: String,
        default: 'default',
      },
      size: {
        type: String,
        default: 'small',
      },
      bordered: {
        type: Boolean,
        default: false,
      },
    },
    template: '<span class="n-tag" :data-type="type"><slot /></span>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    props: {
      component: {
        type: Object,
        default: () => ({}),
      },
    },
    template: '<span class="n-icon" />',
  })

  return {
    NDataTable,
    NTag,
    NIcon,
  }
})

describe('HttpStatusCodeTable', () => {
  it('filters rows by category and search', () => {
    const allWrapper = mount(HttpStatusCodeTable, {
      props: {
        search: '',
        category: 'all',
      },
    })

    const allData = allWrapper.findComponent({ name: 'NDataTable' }).props('data') as Array<{
      code: number
    }>
    expect(allData).toHaveLength(statusCodesSample.length)

    const commonWrapper = mount(HttpStatusCodeTable, {
      props: {
        search: '',
        category: 'common',
      },
    })

    const commonData = commonWrapper.findComponent({ name: 'NDataTable' }).props('data') as Array<{
      code: number
    }>

    expect(commonData.map((row) => row.code)).toEqual([200, 301, 404])

    const successWrapper = mount(HttpStatusCodeTable, {
      props: {
        search: '',
        category: 'success',
      },
    })

    const successData = successWrapper
      .findComponent({ name: 'NDataTable' })
      .props('data') as Array<{ code: number }>

    expect(successData.map((row) => row.code)).toEqual([200, 201])

    const searchWrapper = mount(HttpStatusCodeTable, {
      props: {
        search: 'missing',
        category: 'all',
      },
    })

    const searchData = searchWrapper.findComponent({ name: 'NDataTable' }).props('data') as Array<{
      code: number
    }>

    expect(searchData.map((row) => row.code)).toEqual([404])
  })

  it('builds column renderers with expected content', () => {
    const wrapper = mount(HttpStatusCodeTable, {
      props: {
        search: '',
        category: 'all',
      },
    })

    const data = wrapper.findComponent({ name: 'NDataTable' }).props('data') as Array<{
      code: number
      name: string
      category: string
    }>

    const successRow = data.find((row) => row.code === 200)
    const redirectionRow = data.find((row) => row.code === 301)
    const serverErrorRow = data.find((row) => row.code === 500)

    if (!successRow || !redirectionRow || !serverErrorRow) {
      throw new Error('Expected rows were not found in the dataset.')
    }

    const columns = wrapper.findComponent({ name: 'NDataTable' }).props('columns') as Array<{
      key: string
      render: (row: typeof successRow) => {
        props?: Record<string, unknown>
        type?: unknown
      }
    }>

    const codeColumn = columns.find((column) => column.key === 'code')?.render(successRow)
    expect(codeColumn?.props?.content).toBe('200')

    const nameColumn = columns.find((column) => column.key === 'name')?.render(successRow)
    expect(nameColumn?.props?.content).toBe('OK')

    const categoryWarning = columns
      .find((column) => column.key === 'category')
      ?.render(redirectionRow)
    expect(categoryWarning?.props?.type).toBe('warning')

    const categoryError = columns
      .find((column) => column.key === 'category')
      ?.render(serverErrorRow)
    expect(categoryError?.props?.type).toBe('error')

    const descriptionColumn = columns
      .find((column) => column.key === 'description')
      ?.render(successRow)
    expect(descriptionColumn?.type).toBe(HttpStatusCodeDescription)
    expect(descriptionColumn?.props?.code).toBe(200)
  })
})
