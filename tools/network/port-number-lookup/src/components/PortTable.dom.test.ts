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
      rowKey: {
        type: Function,
        default: undefined,
      },
    },
    template: '<div class="data-table" />',
  })

  const NTag = defineComponent({
    name: 'NTag',
    props: {
      type: {
        type: String,
        default: '',
      },
      size: {
        type: String,
        default: '',
      },
      bordered: {
        type: Boolean,
        default: false,
      },
    },
    template: '<span class="tag" :data-type="type"><slot /></span>',
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

  it('filters system and registered categories', async () => {
    const wrapper = mount(PortTable, {
      props: {
        search: '',
        category: 'system',
      },
    })

    const table = wrapper.findComponent({ name: 'NDataTable' })
    let data = table.props('data') as typeof mockPorts
    expect(data.map((port) => port.port)).toEqual([22, 53])

    await wrapper.setProps({ category: 'registered' })
    data = table.props('data') as typeof mockPorts
    expect(data.map((port) => port.port)).toEqual([5432])
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

  it('uses row keys and renders column cells', () => {
    const wrapper = mount(PortTable, {
      props: {
        search: '',
        category: 'all',
      },
    })

    const table = wrapper.findComponent({ name: 'NDataTable' })
    const rowKey = table.props('rowKey') as (row: (typeof mockPorts)[number]) => number
    const columns = table.props('columns') as Array<{
      key: string
      render?: (row: (typeof mockPorts)[number]) => unknown
    }>

    expect(rowKey(mockPorts[0]!)).toBe(22)

    const portColumn = columns.find((column) => column.key === 'port')
    const portCell = mount({ render: () => portColumn?.render?.(mockPorts[0]!) })
    expect(portCell.find('.copy').exists()).toBe(true)
    expect(portCell.text()).toContain('22')

    const serviceColumn = columns.find((column) => column.key === 'service')
    const serviceCell = mount({ render: () => serviceColumn?.render?.(mockPorts[0]!) })
    expect(serviceCell.text()).toBe('SSH')

    const protocolColumn = columns.find((column) => column.key === 'protocol')
    const tcpCell = mount({ render: () => protocolColumn?.render?.(mockPorts[0]!) })
    expect(tcpCell.find('.tag').attributes('data-type')).toBe('success')
    expect(tcpCell.text()).toBe('TCP')

    const udpCell = mount({ render: () => protocolColumn?.render?.(mockPorts[1]!) })
    expect(udpCell.find('.tag').attributes('data-type')).toBe('warning')
    expect(udpCell.text()).toBe('UDP')

    const otherCell = mount({
      render: () =>
        protocolColumn?.render?.({
          ...mockPorts[0]!,
          protocol: 'SCTP',
        }),
    })
    expect(otherCell.find('.tag').attributes('data-type')).toBe('info')
    expect(otherCell.text()).toBe('SCTP')
  })
})
