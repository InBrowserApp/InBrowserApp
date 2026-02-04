import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

const useRandomNumberGeneratorMock = vi.hoisted(() => vi.fn())

vi.mock('../composables/useRandomNumberGenerator', () => ({
  useRandomNumberGenerator: useRandomNumberGeneratorMock,
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

import RandomNumberGenerator from './RandomNumberGenerator.vue'

describe('RandomNumberGenerator', () => {
  const OptionsStub = {
    name: 'RandomNumberGeneratorOptions',
    props: [
      'minValue',
      'maxValue',
      'count',
      'allowRepeat',
      'numberType',
      'decimalPlaces',
      'inputStep',
      'inputPrecision',
      'maxCount',
      'maxDecimalPlaces',
      'rangeError',
      'countError',
    ],
    template: '<div data-testid="options" />',
  }

  const ResultsStub = {
    name: 'RandomNumberGeneratorResults',
    props: [
      'formattedNumbers',
      'outputText',
      'canRoll',
      'isRolling',
      'rollingLabel',
      'rollingIcon',
    ],
    template: '<div data-testid="results" />',
  }

  const HistoryStub = {
    name: 'RandomNumberGeneratorHistory',
    props: ['historyEntries'],
    template: '<div data-testid="history" />',
  }

  const FullscreenStub = {
    name: 'RandomNumberGeneratorFullscreen',
    props: ['formattedNumbers', 'canRoll', 'isRolling', 'rollingLabel', 'rollingIcon'],
    template: '<div data-testid="fullscreen" />',
  }

  it('wires composable state into child components', async () => {
    const state = {
      minValue: ref(1),
      maxValue: ref(6),
      count: ref(2),
      allowRepeat: ref(true),
      numberType: ref('integer'),
      decimalPlaces: ref(0),
      historyEntries: ref([{ id: '1', label: '1,2', timestamp: 1 }]),
      inputStep: ref(1),
      inputPrecision: ref(0),
      maxCount: ref(100),
      maxDecimalPlaces: ref(6),
      rangeError: ref(''),
      countError: ref(''),
      formattedNumbers: ref(['1', '2']),
      outputText: ref('1,2'),
      isFullscreen: ref(false),
      openFullscreen: vi.fn(),
      closeFullscreen: vi.fn(),
      canRoll: ref(true),
      isRolling: ref(false),
      rollingLabel: ref('startRandom'),
      rollingIcon: ref('play'),
      toggleRolling: vi.fn(),
      clearHistory: vi.fn(),
      applyPreset: vi.fn(),
    }

    useRandomNumberGeneratorMock.mockReturnValue(state)

    const wrapper = mount(RandomNumberGenerator, {
      global: {
        stubs: {
          RandomNumberGeneratorOptions: OptionsStub,
          RandomNumberGeneratorResults: ResultsStub,
          RandomNumberGeneratorHistory: HistoryStub,
          RandomNumberGeneratorFullscreen: FullscreenStub,
        },
      },
    })

    const options = wrapper.findComponent(OptionsStub)
    expect(options.props('minValue')).toBe(1)
    expect(options.props('maxValue')).toBe(6)
    expect(options.props('count')).toBe(2)

    const results = wrapper.findComponent(ResultsStub)
    expect(results.props('formattedNumbers')).toEqual(['1', '2'])
    expect(results.props('outputText')).toBe('1,2')

    const history = wrapper.findComponent(HistoryStub)
    expect(history.props('historyEntries')).toHaveLength(1)

    expect(wrapper.findComponent(FullscreenStub).exists()).toBe(false)

    options.vm.$emit('update:minValue', 4)
    options.vm.$emit('update:maxValue', 9)
    options.vm.$emit('update:count', 3)
    options.vm.$emit('update:allowRepeat', false)
    options.vm.$emit('update:numberType', 'decimal')
    options.vm.$emit('update:decimalPlaces', 2)
    options.vm.$emit('apply-preset', 'dice')

    results.vm.$emit('toggle-rolling')
    results.vm.$emit('open-fullscreen')
    history.vm.$emit('clear-history')

    await nextTick()

    expect(state.minValue.value).toBe(4)
    expect(state.maxValue.value).toBe(9)
    expect(state.count.value).toBe(3)
    expect(state.allowRepeat.value).toBe(false)
    expect(state.numberType.value).toBe('decimal')
    expect(state.decimalPlaces.value).toBe(2)
    expect(state.applyPreset).toHaveBeenCalledWith('dice')
    expect(state.toggleRolling).toHaveBeenCalled()
    expect(state.openFullscreen).toHaveBeenCalled()
    expect(state.clearHistory).toHaveBeenCalled()

    const messages = useRandomNumberGeneratorMock.mock.calls[0]?.[0]
    expect(messages?.stopRandom()).toBe('stopRandom')
  })

  it('shows fullscreen panel when enabled', () => {
    useRandomNumberGeneratorMock.mockReturnValue({
      minValue: ref(1),
      maxValue: ref(1),
      count: ref(1),
      allowRepeat: ref(true),
      numberType: ref('integer'),
      decimalPlaces: ref(0),
      historyEntries: ref([]),
      inputStep: ref(1),
      inputPrecision: ref(0),
      maxCount: ref(10),
      maxDecimalPlaces: ref(6),
      rangeError: ref(''),
      countError: ref(''),
      formattedNumbers: ref(['5']),
      outputText: ref('5'),
      isFullscreen: ref(true),
      openFullscreen: vi.fn(),
      closeFullscreen: vi.fn(),
      canRoll: ref(false),
      isRolling: ref(true),
      rollingLabel: ref('stopRandom'),
      rollingIcon: ref('stop'),
      toggleRolling: vi.fn(),
      clearHistory: vi.fn(),
      applyPreset: vi.fn(),
    })

    const wrapper = mount(RandomNumberGenerator, {
      global: {
        stubs: {
          RandomNumberGeneratorOptions: OptionsStub,
          RandomNumberGeneratorResults: ResultsStub,
          RandomNumberGeneratorHistory: HistoryStub,
          RandomNumberGeneratorFullscreen: FullscreenStub,
        },
      },
    })

    const fullscreen = wrapper.findComponent(FullscreenStub)
    expect(fullscreen.exists()).toBe(true)
    expect(fullscreen.props('formattedNumbers')).toEqual(['5'])
    expect(fullscreen.props('isRolling')).toBe(true)
  })
})
