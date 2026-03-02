import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, type Ref } from 'vue'
import CronExpressionParserView from './CronExpressionParserView.vue'
import * as toolInfo from './info'

const storage = vi.hoisted(() => new Map<string, Ref<string>>())
const validateExpressionMock = vi.hoisted(() => vi.fn())
const getHumanDescriptionMock = vi.hoisted(() => vi.fn())
const getNextRunTimesMock = vi.hoisted(() => vi.fn())
const parseFieldsMock = vi.hoisted(() => vi.fn())
const localeRef = vi.hoisted(() => ({ value: 'en' }))

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (key: string, initialValue: string) => {
      if (!storage.has(key)) {
        storage.set(key, ref(initialValue))
      }
      return storage.get(key) as Ref<string>
    },
  }
})

vi.mock('./utils/cron', () => ({
  validateExpression: (expression: string) => validateExpressionMock(expression),
  getHumanDescription: (expression: string, locale?: string) =>
    getHumanDescriptionMock(expression, locale),
  getNextRunTimes: (expression: string, count?: number) => getNextRunTimesMock(expression, count),
  parseFields: (expression: string) => parseFieldsMock(expression),
}))

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div class="layout"><slot /></div>',
})

const CronInputStub = defineComponent({
  name: 'CronInput',
  props: ['expression'],
  emits: ['update:expression'],
  template:
    '<input class="cron-input" :value="expression" @input="$emit(\'update:expression\', $event.target.value)" />',
})

const CronBuilderStub = defineComponent({
  name: 'CronBuilder',
  emits: ['select'],
  template:
    '<button class="cron-builder" @click="$emit(\'select\', \'0 0 * * *\')">preset</button>',
})

const CronExplanationStub = defineComponent({
  name: 'CronExplanation',
  props: ['humanDescription', 'fields'],
  template:
    '<div class="cron-explanation" :data-description="humanDescription" :data-fields="fields.length" />',
})

const NextRunTimesStub = defineComponent({
  name: 'NextRunTimes',
  props: ['runTimes'],
  template: '<div class="next-run-times" :data-count="runTimes.length" />',
})

const mountView = () =>
  mount(CronExpressionParserView, {
    global: {
      stubs: {
        ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
        CronInput: CronInputStub,
        CronBuilder: CronBuilderStub,
        CronExplanation: CronExplanationStub,
        NextRunTimes: NextRunTimesStub,
      },
    },
  })

const setStorage = (expression: string) => {
  storage.set('cron-expression-parser:expression', ref(expression))
}

describe('CronExpressionParserView', () => {
  beforeEach(() => {
    storage.clear()
    validateExpressionMock.mockReset()
    getHumanDescriptionMock.mockReset()
    getNextRunTimesMock.mockReset()
    parseFieldsMock.mockReset()
    localeRef.value = 'en'

    validateExpressionMock.mockReturnValue({ valid: true })
    getHumanDescriptionMock.mockReturnValue('description')
    getNextRunTimesMock.mockReturnValue([])
    parseFieldsMock.mockReturnValue([])
  })

  it('passes tool info into layout', () => {
    const wrapper = mountView()
    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.props('info')).toEqual(toolInfo)
  })

  it('computes description, fields, and run times for valid expression', () => {
    setStorage('*/10 * * * *')
    localeRef.value = 'ja'
    getHumanDescriptionMock.mockReturnValue('every 10 minutes')
    getNextRunTimesMock.mockReturnValue([new Date(), new Date()])
    parseFieldsMock.mockReturnValue([
      { name: 'Minute', value: '*/10', description: 'every 10 minutes' },
    ])

    const wrapper = mountView()

    const input = wrapper.get('.cron-input').element as HTMLInputElement
    expect(input.value).toBe('*/10 * * * *')

    const explanation = wrapper.get('.cron-explanation')
    expect(explanation.attributes('data-description')).toBe('every 10 minutes')
    expect(explanation.attributes('data-fields')).toBe('1')
    expect(wrapper.get('.next-run-times').attributes('data-count')).toBe('2')

    expect(getHumanDescriptionMock).toHaveBeenCalledWith('*/10 * * * *', 'en')
    expect(getNextRunTimesMock).toHaveBeenCalledWith('*/10 * * * *', 10)
    expect(parseFieldsMock).toHaveBeenCalledWith('*/10 * * * *')
  })

  it('clears derived outputs for invalid expression', () => {
    setStorage('invalid')
    validateExpressionMock.mockReturnValue({ valid: false })

    const wrapper = mountView()

    const explanation = wrapper.get('.cron-explanation')
    expect(explanation.attributes('data-description')).toBe('')
    expect(explanation.attributes('data-fields')).toBe('0')
    expect(wrapper.get('.next-run-times').attributes('data-count')).toBe('0')

    expect(getHumanDescriptionMock).not.toHaveBeenCalled()
    expect(getNextRunTimesMock).not.toHaveBeenCalled()
    expect(parseFieldsMock).not.toHaveBeenCalled()
  })

  it('updates expression when builder selects a preset', async () => {
    setStorage('* * * * *')

    const wrapper = mountView()
    await wrapper.get('.cron-builder').trigger('click')
    await nextTick()

    const input = wrapper.get('.cron-input').element as HTMLInputElement
    expect(input.value).toBe('0 0 * * *')
    expect(storage.get('cron-expression-parser:expression')?.value).toBe('0 0 * * *')
  })
})
