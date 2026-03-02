import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import AudioRecorderOutput from './AudioRecorderOutput.vue'

const NButtonStub = defineComponent({
  name: 'NButton',
  props: {
    tag: String,
    href: String,
    download: String,
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        props.tag || 'button',
        {
          href: props.href,
          download: props.download,
          onClick: () => emit('click'),
        },
        [slots.icon?.(), slots.default?.()],
      )
  },
})

const NInputStub = defineComponent({
  name: 'NInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        value: props.value,
        placeholder: props.placeholder,
        onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
      })
  },
})

const simpleSlotStubs = {
  ToolSectionHeader: defineComponent({ template: '<h3><slot /></h3>' }),
  ToolSection: defineComponent({ template: '<section><slot /></section>' }),
  NFlex: defineComponent({ template: '<div><slot /></div>' }),
  NGrid: defineComponent({ template: '<div><slot /></div>' }),
  NGi: defineComponent({ template: '<div><slot /></div>' }),
  NIcon: defineComponent({ template: '<span />' }),
  NText: defineComponent({ template: '<span><slot /></span>' }),
}

const mountOutput = (overrideProps: Record<string, unknown> = {}) => {
  return mount(AudioRecorderOutput, {
    props: {
      recordingBlob: new Blob(['data'], { type: 'audio/webm' }),
      recordingUrl: 'blob:recording',
      mimeType: 'audio/webm',
      fileName: 'demo',
      onClear: vi.fn(),
      ...overrideProps,
    },
    global: {
      stubs: {
        ...simpleSlotStubs,
        NButton: NButtonStub,
        NInput: NInputStub,
      },
    },
  })
}

describe('AudioRecorderOutput', () => {
  it('renders audio metadata and download attributes', () => {
    const wrapper = mountOutput()

    expect(wrapper.text()).toContain('audio/webm')
    expect(wrapper.text()).toContain('4 B')

    const downloadButton = wrapper.get('a')
    expect(downloadButton.attributes('href')).toBe('blob:recording')
    expect(downloadButton.attributes('download')).toBe('demo.webm')
  })

  it('uses fallback labels, updates file name, and clears output', async () => {
    const onClear = vi.fn()
    const onFileNameUpdate = vi.fn()
    const wrapper = mountOutput({
      recordingBlob: null,
      recordingUrl: undefined,
      mimeType: '',
      fileName: '   ',
      onClear,
      'onUpdate:fileName': onFileNameUpdate,
    })

    expect(wrapper.text()).toContain('Unknown')
    expect(wrapper.text()).toContain('0 B')

    const downloadButton = wrapper.get('a')
    expect(downloadButton.attributes('download')).toBe('recording.webm')

    const input = wrapper.get('input')
    await input.setValue('clip')
    expect(onFileNameUpdate).toHaveBeenCalledWith('clip')

    await wrapper.get('button').trigger('click')
    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
