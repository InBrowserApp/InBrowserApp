import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MimeTypeTable from './MimeTypeTable.vue'

const { mimeDatabaseSample, CopyToClipboardTooltipStub } = vi.hoisted(() => ({
  mimeDatabaseSample: {
    'text/plain': {
      extensions: ['txt'],
      source: 'iana',
      compressible: true,
      charset: 'UTF-8',
    },
    'text/html': {
      extensions: ['html', 'htm'],
      source: 'iana',
      compressible: true,
      charset: 'UTF-8',
    },
    'image/png': {
      extensions: ['png'],
      source: 'iana',
      compressible: false,
    },
    'application/json': {
      extensions: ['json'],
      source: 'iana',
      compressible: true,
      charset: 'UTF-8',
    },
    'application/octet-stream': {},
  },
  CopyToClipboardTooltipStub: {
    name: 'CopyToClipboardTooltip',
    props: ['content'],
    template: '<span class="copy"><slot :copy="() => {}" /></span>',
  },
}))

vi.mock('mime-db', () => ({
  default: mimeDatabaseSample,
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardTooltip: CopyToClipboardTooltipStub,
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NDataTable = defineComponent({
    name: 'NDataTable',
    props: ['columns', 'data', 'bordered', 'size', 'pagination', 'rowKey'],
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

  return {
    NDataTable,
    NTag,
  }
})

type CopySlotArgs = { copy: () => void }
type SpanVNode = {
  props?: Record<string, unknown>
  children?: string
}
type TooltipVNode = {
  props?: Record<string, unknown>
  children?: {
    default?: (args: CopySlotArgs) => SpanVNode
  }
}

const assertCopyCell = (vnode: TooltipVNode | undefined, expectedContent: string) => {
  expect(vnode?.props?.content).toBe(expectedContent)
  const slot = vnode?.children?.default
  expect(slot).toBeTypeOf('function')

  const copy = vi.fn()
  const span = slot?.({ copy })
  expect(span?.children).toBe(expectedContent)

  const onClick = span?.props?.onClick as (() => void) | undefined
  onClick?.()
  expect(copy).toHaveBeenCalledTimes(1)
}

describe('MimeTypeTable', () => {
  it('filters rows by category and search', () => {
    const allWrapper = mount(MimeTypeTable, {
      props: {
        search: '',
        category: 'all',
      },
    })

    const allData = allWrapper.findComponent({ name: 'NDataTable' }).props('data') as Array<{
      mimeType: string
    }>
    expect(allData).toHaveLength(Object.keys(mimeDatabaseSample).length)

    const categoryWrapper = mount(MimeTypeTable, {
      props: {
        search: '',
        category: 'text',
      },
    })

    const categoryData = categoryWrapper
      .findComponent({ name: 'NDataTable' })
      .props('data') as Array<{ mimeType: string }>

    expect(categoryData.map((row) => row.mimeType)).toEqual(['text/html', 'text/plain'])

    const searchWrapper = mount(MimeTypeTable, {
      props: {
        search: 'json',
        category: 'all',
      },
    })

    const searchData = searchWrapper.findComponent({ name: 'NDataTable' }).props('data') as Array<{
      mimeType: string
    }>

    expect(searchData.map((row) => row.mimeType)).toEqual(['application/json'])
  })

  it('builds column renderers, row keys, and slot content', () => {
    const wrapper = mount(MimeTypeTable, {
      props: {
        search: '',
        category: 'all',
      },
    })

    const dataTable = wrapper.findComponent({ name: 'NDataTable' })
    const data = dataTable.props('data') as Array<{
      mimeType: string
      extensions?: string[]
      source?: string
      compressible?: boolean
      charset?: string
    }>

    const textRow = data.find((row) => row.mimeType === 'text/plain')
    const imageRow = data.find((row) => row.mimeType === 'image/png')
    const octetRow = data.find((row) => row.mimeType === 'application/octet-stream')

    if (!textRow || !imageRow || !octetRow) {
      throw new Error('Expected rows were not found in the dataset.')
    }

    const rowKey = dataTable.props('rowKey') as (row: typeof textRow) => string
    expect(rowKey(textRow)).toBe('text/plain')

    const columns = dataTable.props('columns') as Array<{
      key: string
      render: (row: typeof textRow) => {
        props?: Record<string, unknown>
        type?: unknown
        children?: unknown
      }
    }>

    const mimeTypeColumn = columns.find((column) => column.key === 'mimeType')?.render(textRow)
    assertCopyCell(mimeTypeColumn as TooltipVNode | undefined, 'text/plain')

    const extensionsColumn = columns.find((column) => column.key === 'extensions')?.render(octetRow)
    assertCopyCell(extensionsColumn as TooltipVNode | undefined, '')

    const categoryColumn = columns.find((column) => column.key === 'category')?.render(textRow)
    expect(categoryColumn?.props?.category).toBe('text')

    const sourceColumnMissing = columns.find((column) => column.key === 'source')?.render(octetRow)
    expect(sourceColumnMissing?.type).toBe('span')
    expect(sourceColumnMissing?.children).toBe('-')

    const sourceColumnPresent = columns.find((column) => column.key === 'source')?.render(textRow)
    expect(sourceColumnPresent?.props?.type).toBe('info')
    const sourceChildren = sourceColumnPresent?.children as
      | (() => string)
      | {
          default?: () => string
        }
      | undefined
    const sourceText =
      typeof sourceChildren === 'function' ? sourceChildren() : sourceChildren?.default?.()
    expect(sourceText).toBe('IANA')

    const compressibleColumnYes = columns
      .find((column) => column.key === 'compressible')
      ?.render(textRow)
    expect(compressibleColumnYes?.props?.type).toBe('success')
    const yesChildren = compressibleColumnYes?.children as
      | (() => string)
      | {
          default?: () => string
        }
      | undefined
    const yesText = typeof yesChildren === 'function' ? yesChildren() : yesChildren?.default?.()
    expect(yesText).toBe('Yes')

    const compressibleColumnNo = columns
      .find((column) => column.key === 'compressible')
      ?.render(imageRow)
    expect(compressibleColumnNo?.props?.type).toBe('default')
    const noChildren = compressibleColumnNo?.children as
      | (() => string)
      | {
          default?: () => string
        }
      | undefined
    const noText = typeof noChildren === 'function' ? noChildren() : noChildren?.default?.()
    expect(noText).toBe('No')

    const compressibleColumnEmpty = columns
      .find((column) => column.key === 'compressible')
      ?.render(octetRow)
    expect(compressibleColumnEmpty?.type).toBe('span')
    expect(compressibleColumnEmpty?.children).toBe('-')

    const charsetColumn = columns.find((column) => column.key === 'charset')?.render(textRow)
    assertCopyCell(charsetColumn as TooltipVNode | undefined, 'UTF-8')

    const charsetColumnMissing = columns
      .find((column) => column.key === 'charset')
      ?.render(imageRow)
    expect(charsetColumnMissing?.type).toBe('span')
    expect(charsetColumnMissing?.children).toBe('-')
  })
})
