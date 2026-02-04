import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@vueuse/core', () => ({
  useStorage: (_key: string, value: unknown) => ref(value),
}))

const { startMock, stopMock, setVolumeMock, getStationSignalMock, getTimePartsMock } = vi.hoisted(
  () => ({
    startMock: vi.fn(),
    stopMock: vi.fn(),
    setVolumeMock: vi.fn(),
    getStationSignalMock: vi.fn(() => ({ symbol: 'M', windows: [] })),
    getTimePartsMock: vi.fn((date: Date) => ({
      year: 2024,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: date.getUTCSeconds(),
      isDst: false,
      dayOfYear: 1,
      weekday: 1,
    })),
  }),
)

vi.mock('../audio/signalEngine', () => ({
  SignalEngine: class {
    private readonly createContext: () => AudioContext

    constructor(createContext: () => AudioContext) {
      this.createContext = createContext
    }

    start = (...args: unknown[]) => {
      this.createContext()
      return startMock(...(args as []))
    }

    stop = stopMock
    setVolume = setVolumeMock
  },
}))

vi.mock('../core/encoders', () => ({
  getStationSignal: getStationSignalMock,
}))

vi.mock('../core/time', () => ({
  getTimeParts: getTimePartsMock,
}))

import RadioTimecodeController from './RadioTimecodeController.vue'

const ControlsStub = defineComponent({
  name: 'RadioTimecodeControlsSection',
  props: {
    stationId: {
      type: String,
      default: '',
    },
    stationOptions: {
      type: Array,
      default: () => [],
    },
    isPlaying: {
      type: Boolean,
      default: false,
    },
    isStarting: {
      type: Boolean,
      default: false,
    },
    audioAvailable: {
      type: Boolean,
      default: true,
    },
    startError: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:stationId', 'start', 'stop'],
  setup(props, { emit }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'controls',
          'data-playing': String(props.isPlaying),
          'data-starting': String(props.isStarting),
          'data-audio': String(props.audioAvailable),
          'data-error': String(props.startError),
        },
        [
          h('button', { 'data-testid': 'start', onClick: () => emit('start') }, 'start'),
          h('button', { 'data-testid': 'stop', onClick: () => emit('stop') }, 'stop'),
          h(
            'button',
            { 'data-testid': 'station', onClick: () => emit('update:stationId', 'dcf77') },
            'station',
          ),
        ],
      )
  },
})

const OutputStub = defineComponent({
  name: 'RadioTimecodeOutputSection',
  props: {
    volume: {
      type: Number,
      default: 0,
    },
    offsetMs: {
      type: Number,
      default: 0,
    },
    carrierHz: {
      type: Number,
      default: undefined,
    },
    baseHz: {
      type: Number,
      default: undefined,
    },
  },
  emits: ['update:volume', 'update:offsetMs'],
  setup(props, { emit }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'output',
          'data-carrier': props.carrierHz ?? '',
          'data-base': props.baseHz ?? '',
        },
        [
          h(
            'button',
            { 'data-testid': 'volume', onClick: () => emit('update:volume', 0.9) },
            'volume',
          ),
          h(
            'button',
            { 'data-testid': 'offset', onClick: () => emit('update:offsetMs', 500) },
            'offset',
          ),
        ],
      )
  },
})

const PreviewStub = defineComponent({
  name: 'RadioTimecodePreviewSection',
  props: {
    stationTime: {
      type: String,
      default: '',
    },
    timeZone: {
      type: String,
      default: '',
    },
    currentSymbol: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'preview',
        'data-time': props.stationTime,
        'data-zone': props.timeZone ?? '',
        'data-symbol': props.currentSymbol,
      })
  },
})

const NotesStub = defineComponent({
  name: 'RadioTimecodeNotesSection',
  template: '<div data-testid="notes" />',
})

const mountController = () =>
  mount(RadioTimecodeController, {
    global: {
      stubs: {
        ToolSection: { template: '<section><slot /></section>' },
        ToolSectionHeader: { template: '<h3><slot /></h3>' },
        RadioTimecodeControlsSection: ControlsStub,
        RadioTimecodeOutputSection: OutputStub,
        RadioTimecodePreviewSection: PreviewStub,
        RadioTimecodeNotesSection: NotesStub,
      },
    },
  })

describe('RadioTimecodeController', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
    startMock.mockReset().mockResolvedValue(undefined)
    stopMock.mockReset()
    setVolumeMock.mockReset()
    getStationSignalMock.mockReset().mockReturnValue({ symbol: 'M', windows: [] })
    getTimePartsMock.mockClear()
    ;(window as unknown as { AudioContext?: unknown }).AudioContext = vi.fn()
    delete (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext
  })

  afterEach(() => {
    vi.useRealTimers()
    delete (window as unknown as { AudioContext?: unknown }).AudioContext
  })

  it('starts, reacts to updates, and cleans up', async () => {
    const clearSpy = vi.spyOn(window, 'clearInterval')
    const wrapper = mountController()

    const preview = wrapper.get('[data-testid="preview"]')
    const initialTime = preview.attributes('data-time')

    await wrapper.get('[data-testid="start"]').trigger('click')
    await flushPromises()

    expect(startMock).toHaveBeenCalledTimes(1)
    const audioContextMock = (window as unknown as { AudioContext: ReturnType<typeof vi.fn> })
      .AudioContext
    expect(audioContextMock).toHaveBeenCalled()
    expect(wrapper.get('[data-testid="controls"]').attributes('data-playing')).toBe('true')
    expect(wrapper.get('[data-testid="preview"]').attributes('data-symbol')).toBe('M')

    await wrapper.get('[data-testid="volume"]').trigger('click')
    expect(setVolumeMock).toHaveBeenCalledWith(0.9)

    await wrapper.get('[data-testid="offset"]').trigger('click')
    await flushPromises()
    expect(startMock).toHaveBeenCalledTimes(2)

    await wrapper.get('[data-testid="station"]').trigger('click')
    await flushPromises()
    expect(startMock).toHaveBeenCalledTimes(3)

    vi.advanceTimersByTime(1000)
    await flushPromises()
    expect(wrapper.get('[data-testid="preview"]').attributes('data-time')).not.toBe(initialTime)

    await wrapper.get('[data-testid="stop"]').trigger('click')
    expect(stopMock).toHaveBeenCalled()

    wrapper.unmount()
    expect(clearSpy).toHaveBeenCalled()
    clearSpy.mockRestore()
  })

  it('ignores start when audio is unavailable', async () => {
    delete (window as unknown as { AudioContext?: unknown }).AudioContext

    const wrapper = mountController()
    await wrapper.get('[data-testid="start"]').trigger('click')
    await flushPromises()

    expect(startMock).not.toHaveBeenCalled()
  })

  it('flags start errors and stops the engine', async () => {
    startMock.mockRejectedValueOnce(new Error('nope'))

    const wrapper = mountController()
    await wrapper.get('[data-testid="start"]').trigger('click')
    await flushPromises()

    expect(stopMock).toHaveBeenCalled()
    expect(wrapper.get('[data-testid="controls"]').attributes('data-error')).toBe('true')
  })

  it('queues a restart when start is requested while starting', async () => {
    let resolveStart: (() => void) | undefined
    startMock.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveStart = resolve
        }),
    )
    startMock.mockResolvedValueOnce(undefined)

    const wrapper = mountController()
    await wrapper.get('[data-testid="start"]').trigger('click')
    await wrapper.get('[data-testid="start"]').trigger('click')

    expect(startMock).toHaveBeenCalledTimes(1)

    resolveStart?.()
    await flushPromises()
    expect(startMock).toHaveBeenCalledTimes(2)
  })
})
