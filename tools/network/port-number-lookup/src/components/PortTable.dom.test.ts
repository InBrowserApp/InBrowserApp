import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PortTable from './PortTable.vue'

const { mockPorts } = vi.hoisted(() => ({
  mockPorts: [
    {
      port: 22,
      service: 'SSH',
      protocol: 'TCP',
      description: 'Secure Shell',
      category: 'system',
      common: true,
    },
    {
      port: 53,
      service: 'DNS',
      protocol: 'UDP',
      description: 'Domain Name Service',
      category: 'system',
    },
    {
      port: 5432,
      service: 'PostgreSQL',
      protocol: 'TCP',
      description: 'Postgres',
      category: 'registered',
      common: true,
    },
  ],
}))

vi.mock('../data/ports', () => ({
  ports: mockPorts,
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    CopyToClipboardTooltip: defineComponent({
      name: 'CopyToClipboardTooltip',
      props: {
        content: {
          type: String,
          default: '',
        },
      },
      setup(_, { slots }) {
        return () => h('span', { class: 'copy' }, slots.default?.({ copy: () => {} }))
      },
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NDataTable = defineComponent({
    name: 'NDataTable',
    props: {
      data: {
        type: Array,
        default: () => [],
      },
      columns: {
        type: Array,
        default: () => [],
      },
      pagination: {
        type: Object,
        default: () => ({}),
      },
    },
    template: '<div class="data-table" />',
  })

  const NTag = defineComponent({
    name: 'NTag',
    template: '<span class="tag"><slot /></span>',
  })

  return {
    NDataTable,
    NTag,
  }
})

describe('PortTable', () => {
  it('shows all ports when no filters are applied', () => {
    const wrapper = mount(PortTable, {
      props: {
        search: '',
        category: 'all',
      },
    })

    const table = wrapper.findComponent({ name: 'NDataTable' })
    const data = table.props('data') as typeof mockPorts
    expect(data).toHaveLength(3)
  })

  it('filters by category', () => {
    const wrapper = mount(PortTable, {
      props: {
        search: '',
        category: 'common',
      },
    })

    const table = wrapper.findComponent({ name: 'NDataTable' })
    const data = table.props('data') as typeof mockPorts
    expect(data.map((port) => port.port)).toEqual([22, 5432])
  })

  it('filters by search term', () => {
    const wrapper = mount(PortTable, {
      props: {
        search: '53',
        category: 'all',
      },
    })

    const table = wrapper.findComponent({ name: 'NDataTable' })
    const data = table.props('data') as typeof mockPorts
    expect(data.map((port) => port.port)).toEqual([53])
  })
})
