import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import MorseConverter from './MorseConverter.vue'
import { textToMorse, playMorseAudio } from '../utils/morse'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

vi.mock('../utils/morse', async () => {
  const actual = await vi.importActual<typeof import('../utils/morse')>('../utils/morse')
  return {
    ...actual,
    playMorseAudio: vi.fn(),
  }
})

const NInputStub = defineComponent({
  name: 'NInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value', 'focus'],
  template:
    '<textarea class="n-input" :data-status="status" :value="value" @input="$emit(\'update:value\', $event.target.value)" @focus="$emit(\'focus\')" />',
})

const stubs = {
  ToolSectionHeader: {
    template: '<header class="section-header"><slot /></header>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  NInput: NInputStub,
  NFlex: {
    template: '<div class="n-flex"><slot /></div>',
  },
  NText: {
    template: '<span class="n-text"><slot /></span>',
  },
  NButton: {
    emits: ['click'],
    props: {
      text: {
        type: Boolean,
        default: false,
      },
    },
    template: '<button class="n-button" @click="$emit(\'click\')"><slot /></button>',
  },
  NIcon: {
    props: {
      component: {
        type: Object,
        default: null,
      },
    },
    template: '<span class="n-icon" />',
  },
  CopyToClipboardButton: {
    props: ['content'],
    template: '<button class="copy" />',
  },
}

const getActionButton = (wrapper: ReturnType<typeof mount>, label: string) =>
  wrapper
    .findAll('button.n-button')
    .find((button) => button.text().toLowerCase().includes(label.toLowerCase()))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('MorseConverter', () => {
  it('renders default text and morse output', () => {
    const wrapper = mount(MorseConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea')
    expect(inputs).toHaveLength(2)
    expect(inputs[0]!.element.value).toBe('HELLO WORLD')
    expect(inputs[1]!.element.value).toBe(textToMorse('HELLO WORLD'))
    expect(wrapper.findAll('.copy')).toHaveLength(2)

    const playButton = getActionButton(wrapper, 'play')
    expect(playButton).toBeTruthy()
  })

  it('updates morse code when text changes', async () => {
    const wrapper = mount(MorseConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea')
    await inputs[0]!.trigger('focus')
    await inputs[0]!.setValue('SOS')
    await nextTick()

    expect(inputs[1]!.element.value).toBe('... --- ...')
    expect(wrapper.text()).toContain('Valid Morse code')
  })

  it('updates text when valid morse code changes', async () => {
    const wrapper = mount(MorseConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea')
    await inputs[1]!.trigger('focus')
    await inputs[1]!.setValue('.... . .-.. .-.. ---')
    await nextTick()

    expect(inputs[0]!.element.value).toBe('HELLO')
  })

  it('shows error state for invalid morse input', async () => {
    const wrapper = mount(MorseConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea')
    await inputs[1]!.trigger('focus')
    await inputs[1]!.setValue('.-.-.-.-.-')
    await nextTick()

    expect(wrapper.text()).toContain('Invalid Morse code')
    expect(inputs[0]!.element.value).toBe('HELLO WORLD')
  })

  it('handles empty text and morse content without triggering playback', async () => {
    const playMock = vi.mocked(playMorseAudio)
    const wrapper = mount(MorseConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea')
    await inputs[0]!.trigger('focus')
    await inputs[0]!.setValue('')
    await nextTick()

    expect(inputs[1]!.element.value).toBe('')
    expect(wrapper.findAll('.copy')).toHaveLength(0)
    expect(getActionButton(wrapper, 'play')).toBeFalsy()
    expect(wrapper.text()).not.toContain('Valid Morse code')
    expect(wrapper.text()).not.toContain('Invalid Morse code')
    ;(wrapper.vm as unknown as { handlePlay: () => void }).handlePlay()
    expect(playMock).not.toHaveBeenCalled()
  })

  it('plays and stops morse audio', async () => {
    const stopSpy = vi.fn()
    const playMock = vi.mocked(playMorseAudio)
    playMock.mockImplementation((_morse, _options) => ({ stop: stopSpy }))

    const wrapper = mount(MorseConverter, {
      global: {
        stubs,
      },
    })

    const playButton = getActionButton(wrapper, 'play')
    expect(playButton).toBeTruthy()
    await playButton!.trigger('click')

    expect(playMock).toHaveBeenCalledTimes(1)
    expect(getActionButton(wrapper, 'stop')).toBeTruthy()

    const stopButton = getActionButton(wrapper, 'stop')
    await stopButton!.trigger('click')

    expect(stopSpy).toHaveBeenCalledTimes(1)
    expect(getActionButton(wrapper, 'play')).toBeTruthy()
  })

  it('returns to play state when audio completes', async () => {
    let onComplete: (() => void) | undefined
    const playMock = vi.mocked(playMorseAudio)
    playMock.mockImplementation((_morse, options) => {
      onComplete = options?.onComplete
      return { stop: vi.fn() }
    })

    const wrapper = mount(MorseConverter, {
      global: {
        stubs,
      },
    })

    const playButton = getActionButton(wrapper, 'play')
    expect(playButton).toBeTruthy()
    await playButton!.trigger('click')

    expect(onComplete).toBeTypeOf('function')
    onComplete?.()
    await nextTick()

    expect(getActionButton(wrapper, 'play')).toBeTruthy()
    expect(getActionButton(wrapper, 'stop')).toBeFalsy()
  })
})
