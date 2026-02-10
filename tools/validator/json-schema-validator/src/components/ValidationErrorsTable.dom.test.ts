import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { type PropType, type VNodeChild } from 'vue'
import ValidationErrorsTable from './ValidationErrorsTable.vue'

type Column = {
  key?: string
  render?: (row: Record<string, unknown>, rowIndex: number) => unknown
}

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, unknown>) => {
        if (key === 'errorsTitleWithCount') {
          return `Errors (${params?.count ?? 0})`
        }
        if (key === 'noErrors') return 'No errors'
        return key
      },
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NText = defineComponent({
    name: 'NText',
    props: {
      code: {
        type: Boolean,
        default: false,
      },
      depth: {
        type: [String, Number],
        default: undefined,
      },
    },
    template: '<span class="n-text"><slot /></span>',
  })

  const NDataTable = defineComponent({
    name: 'NDataTable',
    props: {
      columns: {
        type: Array as PropType<Column[]>,
        default: () => [],
      },
      data: {
        type: Array as PropType<Record<string, unknown>[]>,
        default: () => [],
      },
      bordered: {
        type: Boolean,
        default: true,
      },
      size: {
        type: String,
        default: 'small',
      },
    },
    setup(props) {
      return () =>
        h(
          'div',
          { class: 'n-data-table' },
          props.data.map((row, rowIndex) =>
            h(
              'div',
              { class: 'row', 'data-row': rowIndex },
              props.columns.map((column) => {
                const content = column.render ? column.render(row, rowIndex) : row[column.key ?? '']
                const cellContent = content as VNodeChild
                return h('div', { class: 'cell', 'data-key': column.key }, [cellContent])
              }),
            ),
          ),
        )
    },
  })

  return {
    NDataTable,
    NText,
  }
})

describe('ValidationErrorsTable', () => {
  it('renders errors with count and path fallback', () => {
    const wrapper = mount(ValidationErrorsTable, {
      props: {
        statusType: 'error',
        errors: [
          {
            instancePath: '',
            schemaPath: '#/properties/name',
            keyword: 'type',
            message: 'must be string',
            params: { type: 'string' },
          },
        ],
      },
    })

    expect(wrapper.text()).toContain('Errors (1)')
    expect(wrapper.text()).toContain('must be string')
    expect(wrapper.text()).toContain('/')
  })

  it('shows no errors for success status', () => {
    const wrapper = mount(ValidationErrorsTable, {
      props: {
        statusType: 'success',
        errors: [],
      },
    })

    expect(wrapper.text()).toContain('No errors')
  })

  it('computes a generic title when there are no errors', () => {
    const wrapper = mount(ValidationErrorsTable, {
      props: {
        statusType: 'error',
        errors: [],
      },
    })

    const vm = wrapper.vm as unknown as { errorsTitle: string }
    expect(vm.errorsTitle).toBe('errorsTitle')
    expect(wrapper.text()).toBe('')
  })
})
