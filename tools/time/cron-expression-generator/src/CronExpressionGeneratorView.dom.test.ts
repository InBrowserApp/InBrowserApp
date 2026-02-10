import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, type Ref } from 'vue'
import CronExpressionGeneratorView from './CronExpressionGeneratorView.vue'

const storage = vi.hoisted(() => new Map<string, Ref<string>>())
const parseMock = vi.hoisted(() => vi.fn())
const toStringMock = vi.hoisted(() => vi.fn())
const localeRef = vi.hoisted(() => ({ value: 'en' }))

vi.mock('@vueuse/core', () => ({
  useStorage: (key: string, initialValue: string) => {
    if (!storage.has(key)) {
      storage.set(key, ref(initialValue))
    }
    return storage.get(key) as Ref<string>
  },
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, args?: Record<string, unknown>) => {
        if (args?.field) return `${key}:${args.field}`
        if (args?.n !== undefined) return `${key}:${args.n}`
        return key
      },
      locale: localeRef,
    }),
  }
})

vi.mock('cron-parser', () => ({
  CronExpressionParser: {
    parse: (expression: string) => parseMock(expression),
  },
}))

vi.mock('cronstrue', () => ({
  default: {
    toString: (expression: string, options: { locale: string }) =>
      toStringMock(expression, options),
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
}))

const CronOutputStub = defineComponent({
  name: 'CronOutput',
  props: ['expression', 'humanDescription'],
  template:
    '<div class="cron-output" :data-expression="expression" :data-description="humanDescription" />',
})

const CronPresetsStub = defineComponent({
  name: 'CronPresets',
  emits: ['select'],
  template: '<button class="cron-preset" @click="$emit(\'select\', \'0 0 * * *\')">preset</button>',
})

const CronFieldBuilderStub = defineComponent({
  name: 'CronFieldBuilder',
  props: ['modelValue', 'fieldName'],
  template: '<div class="cron-field" :data-name="fieldName" :data-value="modelValue" />',
})

const NextRunTimesStub = defineComponent({
  name: 'NextRunTimes',
  props: ['runTimes'],
  template: '<div class="next-run-times" :data-count="runTimes.length" />',
})

const mountView = (stubs: Record<string, unknown> = {}) =>
  mount(CronExpressionGeneratorView, {
    global: {
      stubs: {
        CronOutput: CronOutputStub,
        CronPresets: CronPresetsStub,
        CronFieldBuilder: CronFieldBuilderStub,
        NextRunTimes: NextRunTimesStub,
        ...stubs,
      },
    },
  })

const setStorage = (values: Record<string, string>) => {
  for (const [key, value] of Object.entries(values)) {
    storage.set(key, ref(value))
  }
}

describe('CronExpressionGeneratorView', () => {
  beforeEach(() => {
    storage.clear()
    parseMock.mockReset()
    toStringMock.mockReset()
    localeRef.value = 'en'

    parseMock.mockImplementation((expression: string) => {
      if (expression.includes('invalid')) {
        throw new Error('invalid')
      }
      let counter = 0
      return {
        next: () => ({
          toDate: () => new Date(2024, 0, 1, 0, 0, counter++),
        }),
      }
    })
    toStringMock.mockReturnValue('human')
  })

  it('builds the expression and run times from stored fields', () => {
    setStorage({
      'tools:cron-expression-generator:minute': '0',
      'tools:cron-expression-generator:hour': '12',
      'tools:cron-expression-generator:dayOfMonth': '*',
      'tools:cron-expression-generator:month': '*',
      'tools:cron-expression-generator:dayOfWeek': '1',
    })

    const wrapper = mountView()

    const output = wrapper.find('.cron-output')
    expect(output.attributes('data-expression')).toBe('0 12 * * 1')
    expect(output.attributes('data-description')).toBe('human')

    expect(wrapper.find('.next-run-times').attributes('data-count')).toBe('5')
  })

  it('applies selected presets to field values', async () => {
    setStorage({
      'tools:cron-expression-generator:minute': '*',
      'tools:cron-expression-generator:hour': '*',
      'tools:cron-expression-generator:dayOfMonth': '*',
      'tools:cron-expression-generator:month': '*',
      'tools:cron-expression-generator:dayOfWeek': '*',
    })

    const wrapper = mountView()
    await wrapper.find('.cron-preset').trigger('click')
    await nextTick()

    expect(storage.get('tools:cron-expression-generator:minute')?.value).toBe('0')
    expect(storage.get('tools:cron-expression-generator:hour')?.value).toBe('0')
    expect(wrapper.find('.cron-output').attributes('data-expression')).toBe('0 0 * * *')
  })

  it('updates each cron field when builders emit model updates', async () => {
    const CronFieldBuilderEmittingStub = defineComponent({
      name: 'CronFieldBuilder',
      props: ['fieldName'],
      emits: ['update:modelValue'],
      mounted() {
        const updates = {
          minute: '5',
          hour: '6',
          dayOfMonth: '7',
          month: '8',
          dayOfWeek: '1',
        } as const
        const value = updates[this.fieldName as keyof typeof updates]
        if (value) {
          this.$emit('update:modelValue', value)
        }
      },
      template: '<div class="cron-field" />',
    })

    setStorage({
      'tools:cron-expression-generator:minute': '*',
      'tools:cron-expression-generator:hour': '*',
      'tools:cron-expression-generator:dayOfMonth': '*',
      'tools:cron-expression-generator:month': '*',
      'tools:cron-expression-generator:dayOfWeek': '*',
    })

    const wrapper = mountView({
      CronFieldBuilder: CronFieldBuilderEmittingStub,
    })
    await nextTick()

    expect(wrapper.find('.cron-output').attributes('data-expression')).toBe('5 6 7 8 1')
  })

  it('clears description and run times for invalid expressions', () => {
    setStorage({
      'tools:cron-expression-generator:minute': 'invalid',
      'tools:cron-expression-generator:hour': '*',
      'tools:cron-expression-generator:dayOfMonth': '*',
      'tools:cron-expression-generator:month': '*',
      'tools:cron-expression-generator:dayOfWeek': '*',
    })

    const wrapper = mountView()
    const output = wrapper.find('.cron-output')

    expect(output.attributes('data-description')).toBe('')
    expect(wrapper.find('.next-run-times').attributes('data-count')).toBe('0')
  })

  it('returns empty description when cronstrue formatting throws', () => {
    toStringMock.mockImplementation(() => {
      throw new Error('format failed')
    })

    setStorage({
      'tools:cron-expression-generator:minute': '*',
      'tools:cron-expression-generator:hour': '*',
      'tools:cron-expression-generator:dayOfMonth': '*',
      'tools:cron-expression-generator:month': '*',
      'tools:cron-expression-generator:dayOfWeek': '*',
    })

    const wrapper = mountView()

    expect(wrapper.find('.cron-output').attributes('data-description')).toBe('')
  })

  it('returns no next run times when interval iteration throws', () => {
    parseMock.mockImplementation(() => ({
      next: () => {
        throw new Error('next failed')
      },
    }))

    setStorage({
      'tools:cron-expression-generator:minute': '*',
      'tools:cron-expression-generator:hour': '*',
      'tools:cron-expression-generator:dayOfMonth': '*',
      'tools:cron-expression-generator:month': '*',
      'tools:cron-expression-generator:dayOfWeek': '*',
    })

    const wrapper = mountView()

    expect(wrapper.find('.next-run-times').attributes('data-count')).toBe('0')
  })

  it('maps app locale to cronstrue locale', () => {
    localeRef.value = 'zh-CN'
    setStorage({
      'tools:cron-expression-generator:minute': '*',
      'tools:cron-expression-generator:hour': '*',
      'tools:cron-expression-generator:dayOfMonth': '*',
      'tools:cron-expression-generator:month': '*',
      'tools:cron-expression-generator:dayOfWeek': '*',
    })

    mountView()

    expect(toStringMock).toHaveBeenCalled()
    const options = toStringMock.mock.calls[0]?.[1]
    expect(options?.locale).toBe('zh_CN')
  })
})
