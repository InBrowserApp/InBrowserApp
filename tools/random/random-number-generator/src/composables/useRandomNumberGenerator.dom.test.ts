import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, type Ref } from 'vue'

const storage = new Map<string, Ref<unknown>>()

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useStorage: <T>(key: string, initialValue: T) => {
      if (!storage.has(key)) {
        storage.set(key, ref(initialValue) as Ref<unknown>)
      }
      return storage.get(key)! as Ref<T>
    },
  }
})

import { useRandomNumberGenerator } from './useRandomNumberGenerator'

const messages = {
  rangeError: () => 'range-error',
  countError: (range: number) => `count-error-${range}`,
  startRandom: () => 'start-random',
  stopRandom: () => 'stop-random',
}

type GeneratorState = ReturnType<typeof useRandomNumberGenerator>

const Harness = defineComponent({
  setup(_, { expose }) {
    const state = useRandomNumberGenerator(messages)
    expose(state)
    return () => null
  },
})

const storageKeys = {
  min: 'tools:random-number-generator:min',
  max: 'tools:random-number-generator:max',
  count: 'tools:random-number-generator:count',
  allowRepeat: 'tools:random-number-generator:allow-repeat',
  numberType: 'tools:random-number-generator:number-type',
  decimalPlaces: 'tools:random-number-generator:decimal-places',
  history: 'tools:random-number-generator:history',
}

describe('useRandomNumberGenerator', () => {
  beforeEach(() => {
    storage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('normalizes inputs and generates integer results', async () => {
    storage.set(storageKeys.min, ref(1))
    storage.set(storageKeys.max, ref(3))
    storage.set(storageKeys.count, ref(2))
    storage.set(storageKeys.allowRepeat, ref(true))
    storage.set(storageKeys.numberType, ref('integer'))
    storage.set(storageKeys.decimalPlaces, ref(2))
    storage.set(storageKeys.history, ref([]))

    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.9)

    const wrapper = mount(Harness)
    const state = wrapper.vm.$.exposed as GeneratorState

    await nextTick()

    expect(state.inputStep.value).toBe(1)
    expect(state.inputPrecision.value).toBe(0)
    expect(state.formattedNumbers.value).toEqual(['1', '3'])
    expect(state.outputText.value).toBe('1\n3')

    state.openFullscreen()
    expect(state.isFullscreen.value).toBe(true)
    state.closeFullscreen()
    expect(state.isFullscreen.value).toBe(false)

    wrapper.unmount()
  })

  it('reports range errors for invalid ranges', async () => {
    storage.set(storageKeys.min, ref(5))
    storage.set(storageKeys.max, ref(3))
    storage.set(storageKeys.count, ref(1))
    storage.set(storageKeys.allowRepeat, ref(true))
    storage.set(storageKeys.numberType, ref('integer'))
    storage.set(storageKeys.decimalPlaces, ref(0))
    storage.set(storageKeys.history, ref([]))

    const wrapper = mount(Harness)
    const state = wrapper.vm.$.exposed as GeneratorState

    await nextTick()

    expect(state.rangeError.value).toBe('range-error')
    expect(state.formattedNumbers.value).toEqual([])

    wrapper.unmount()
  })

  it('reports count errors when repeat is disabled', async () => {
    storage.set(storageKeys.min, ref(1))
    storage.set(storageKeys.max, ref(2))
    storage.set(storageKeys.count, ref(3))
    storage.set(storageKeys.allowRepeat, ref(false))
    storage.set(storageKeys.numberType, ref('integer'))
    storage.set(storageKeys.decimalPlaces, ref(0))
    storage.set(storageKeys.history, ref([]))

    const wrapper = mount(Harness)
    const state = wrapper.vm.$.exposed as GeneratorState

    await nextTick()

    expect(state.countError.value).toBe('count-error-2')

    wrapper.unmount()
  })

  it('normalizes decimal places and formats decimal outputs', async () => {
    storage.set(storageKeys.min, ref(1))
    storage.set(storageKeys.max, ref(1))
    storage.set(storageKeys.count, ref(1))
    storage.set(storageKeys.allowRepeat, ref(true))
    storage.set(storageKeys.numberType, ref('decimal'))
    storage.set(storageKeys.decimalPlaces, ref(10))
    storage.set(storageKeys.history, ref([]))

    const wrapper = mount(Harness)
    const state = wrapper.vm.$.exposed as GeneratorState

    await nextTick()

    expect(state.decimalPlaces.value).toBe(6)
    expect(state.inputPrecision.value).toBe(6)
    expect(state.inputStep.value).toBe(1 / 1_000_000)
    expect(state.formattedNumbers.value).toEqual(['1.000000'])

    state.applyPreset('dice')
    expect(state.maxValue.value).toBe(6)
    state.applyPreset('ten')
    expect(state.maxValue.value).toBe(10)
    state.applyPreset('hundred')
    expect(state.maxValue.value).toBe(100)
    state.applyPreset('lotto')
    expect(state.count.value).toBe(6)
    expect(state.allowRepeat.value).toBe(false)

    wrapper.unmount()
  })

  it('toggles rolling state and records history', async () => {
    storage.set(storageKeys.min, ref(1))
    storage.set(storageKeys.max, ref(1))
    storage.set(storageKeys.count, ref(1))
    storage.set(storageKeys.allowRepeat, ref(true))
    storage.set(storageKeys.numberType, ref('integer'))
    storage.set(storageKeys.decimalPlaces, ref(0))
    storage.set(storageKeys.history, ref([]))

    const rafCallbacks: FrameRequestCallback[] = []
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      rafCallbacks.push(callback)
      return rafCallbacks.length
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

    const wrapper = mount(Harness)
    const state = wrapper.vm.$.exposed as GeneratorState

    await nextTick()

    expect(state.isRolling.value).toBe(false)
    expect(state.rollingLabel.value).toBe('start-random')

    state.toggleRolling()
    expect(state.isRolling.value).toBe(true)
    expect(state.rollingLabel.value).toBe('stop-random')
    expect(rafCallbacks.length).toBeGreaterThan(0)

    state.toggleRolling()
    expect(state.isRolling.value).toBe(false)
    expect(state.historyEntries.value.length).toBe(1)

    wrapper.unmount()
  })
})
