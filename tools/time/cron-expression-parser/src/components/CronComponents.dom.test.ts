import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockValidateExpression = vi.hoisted(() => vi.fn())

vi.mock('../utils/cron', async () => {
  const actual = await vi.importActual<typeof import('../utils/cron')>('../utils/cron')
  return {
    ...actual,
    validateExpression: mockValidateExpression,
  }
})

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  const { ref } = await import('vue')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: { n?: number }) =>
        params?.n !== undefined ? `${key}:${params.n}` : key,
      locale: ref('en-US'),
    }),
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h2><slot /></h2>',
    }),
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: ['content'],
      template: '<button data-testid="copy" :data-content="content" />',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NButton: defineComponent({
      name: 'NButton',
      template: '<button><slot /></button>',
    }),
    NDataTable: defineComponent({
      name: 'NDataTable',
      props: ['data'],
      template: '<div data-testid="table" :data-rows="JSON.stringify(data)" />',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: ['value', 'status', 'placeholder'],
      emits: ['update:value'],
      template:
        '<input :value="value" :data-status="status" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

import { mount } from '@vue/test-utils'
import { CRON_PRESETS } from '../utils/cron'
import CronBuilder from './CronBuilder.vue'
import CronInput from './CronInput.vue'
import CronExplanation from './CronExplanation.vue'
import NextRunTimes from './NextRunTimes.vue'

describe('cron components', () => {
  beforeEach(() => {
    mockValidateExpression.mockImplementation((expression: string) => {
      if (expression === '*/5 * * * *') {
        return { valid: true }
      }
      if (!expression.trim()) {
        return { valid: false, error: '' }
      }
      return { valid: false, error: 'Invalid expression' }
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('emits preset selection from the builder', async () => {
    const wrapper = mount(CronBuilder)

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(CRON_PRESETS.length)

    await buttons[0]?.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([CRON_PRESETS[0]?.value])
  })

  it('validates cron input and emits updates', async () => {
    const wrapper = mount(CronInput, {
      props: {
        expression: '*/5 * * * *',
      },
    })

    expect(wrapper.text()).toContain('valid')
    expect(wrapper.find('[data-testid="copy"]').exists()).toBe(true)

    await wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'bad')
    expect(wrapper.emitted('update:expression')?.[0]).toEqual(['bad'])
  })

  it('shows errors for invalid cron input', () => {
    const wrapper = mount(CronInput, {
      props: {
        expression: 'bad',
      },
    })

    expect(wrapper.text()).toContain('Invalid expression')
    expect(wrapper.get('input').attributes('data-status')).toBe('error')
  })

  it('renders explanation text and field table', () => {
    const wrapper = mount(CronExplanation, {
      props: {
        humanDescription: 'Every 5 minutes',
        fields: [
          { name: 'minute', value: '*/5', description: 'every 5 minutes' },
          { name: 'hour', value: '*', description: 'every hour' },
        ],
      },
    })

    expect(wrapper.text()).toContain('Every 5 minutes')
    const table = wrapper.get('[data-testid="table"]')
    expect(table.attributes('data-rows')).toContain('minute')
  })

  it('shows fallback content when explanation is empty', () => {
    const wrapper = mount(CronExplanation, {
      props: {
        humanDescription: '',
        fields: [],
      },
    })

    expect(wrapper.text()).toContain('noDescription')
    expect(wrapper.text()).toContain('noFields')
  })

  it('formats next run times and relative labels', () => {
    vi.useFakeTimers()
    const base = new Date(2024, 0, 1, 0, 0, 0)
    vi.setSystemTime(base)
    const now = base.getTime()
    const runTimes = [
      new Date(now + 2 * 24 * 60 * 60 * 1000),
      new Date(now + 3 * 60 * 60 * 1000),
      new Date(now + 4 * 60 * 1000),
      new Date(now + 30 * 1000),
    ]

    const wrapper = mount(NextRunTimes, {
      props: {
        runTimes,
      },
    })

    const rows = JSON.parse(wrapper.get('[data-testid="table"]').attributes('data-rows') || '[]')
    const relatives = rows.map((row: { relative: string }) => row.relative)

    expect(relatives).toContain('inDays:2')
    expect(relatives).toContain('inHours:3')
    expect(relatives).toContain('inMinutes:4')
    expect(relatives).toContain('inSeconds:30')
  })

  it('shows empty state when no run times', () => {
    const wrapper = mount(NextRunTimes, {
      props: {
        runTimes: [],
      },
    })

    expect(wrapper.text()).toContain('noTimes')
  })
})
