import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NextRunTimes from './NextRunTimes.vue'

const localeRef = { value: 'en' }

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NDataTable: defineComponent({
      name: 'NDataTable',
      props: ['columns', 'data', 'bordered', 'size'],
      template: '<div class="n-data-table" />',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span class="n-text"><slot /></span>',
    }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
}))

describe('NextRunTimes', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a data table when run times are available', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    const wrapper = mount(NextRunTimes, {
      props: {
        runTimes: [new Date('2024-01-01T02:00:00Z')],
      },
    })

    const table = wrapper.findComponent({ name: 'NDataTable' })
    const data = table.props('data') as Array<{
      index: number
      relative: string
      dateTime: string
    }>

    expect(data).toHaveLength(1)
    expect(data[0]?.index).toBe(1)
    expect(data[0]?.relative).toContain('in 2 hour(s)')
    expect(data[0]?.dateTime).toBeTruthy()
  })

  it('formats minutes and seconds relative times', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    const wrapper = mount(NextRunTimes, {
      props: {
        runTimes: [new Date('2024-01-01T00:02:00Z'), new Date('2024-01-01T00:00:30Z')],
      },
    })

    const table = wrapper.findComponent({ name: 'NDataTable' })
    const data = table.props('data') as Array<{
      index: number
      relative: string
      dateTime: string
    }>

    expect(data[0]?.relative).toBe('in 2 minute(s)')
    expect(data[1]?.relative).toBe('in 30 second(s)')
  })

  it('formats day-based relative times', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    const wrapper = mount(NextRunTimes, {
      props: {
        runTimes: [new Date('2024-01-03T00:00:00Z')],
      },
    })

    const table = wrapper.findComponent({ name: 'NDataTable' })
    const data = table.props('data') as Array<{
      index: number
      relative: string
      dateTime: string
    }>

    expect(data[0]?.relative).toBe('in 2 day(s)')
  })

  it('renders a hint when there are no run times', () => {
    const wrapper = mount(NextRunTimes, {
      props: {
        runTimes: [],
      },
    })

    expect(wrapper.text()).toContain('Configure fields above to see execution times')
  })
})
