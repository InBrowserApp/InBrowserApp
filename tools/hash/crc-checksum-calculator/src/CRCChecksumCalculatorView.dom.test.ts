import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import CRCChecksumCalculatorView from './CRCChecksumCalculatorView.vue'

const calculateMock = vi.fn()
const wrapMock = vi.fn()

vi.mock('comlink', () => ({
  wrap: (...args: unknown[]) => wrapMock(...args),
}))

vi.mock('./crc-calulator.worker?worker', () => ({
  default: class CRCWorker {},
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const base = (name: string, tag = 'div') =>
    defineComponent({
      name,
      inheritAttrs: false,
      template: `<${tag} v-bind="$attrs"><slot /></${tag}>`,
    })

  return {
    NText: base('NText', 'span'),
    NGrid: base('NGrid', 'div'),
    NGridItem: base('NGridItem', 'div'),
  }
})

const TextOrFileInputStub = defineComponent({
  name: 'TextOrFileInput',
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
  },
  emits: ['update:value'],
  template:
    '<input class="text-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
})

const copySpy = vi.fn()

const CopyToClipboardTooltipStub = defineComponent({
  name: 'CopyToClipboardTooltip',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  setup(_, { slots }) {
    return () => h('span', { 'data-test': 'copy-tooltip' }, slots.default?.({ copy: copySpy }))
  },
})

const stubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  TextOrFileInput: TextOrFileInputStub,
  CopyToClipboardTooltip: CopyToClipboardTooltipStub,
  WhatIsCRC: {
    template: '<div class="what-is" />',
  },
}

describe('CRCChecksumCalculatorView', () => {
  beforeEach(() => {
    copySpy.mockReset()
    calculateMock.mockReset()
    wrapMock.mockReset()
    wrapMock.mockImplementation(() => {
      return class {
        async calculate(blob: Blob) {
          return calculateMock(blob)
        }
      }
    })
  })

  it('renders input header and layout', () => {
    const wrapper = mount(CRCChecksumCalculatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.section-header').text()).toBe('Text or File Input')
    expect(wrapper.find('.layout').exists()).toBe(true)
  })

  it('passes file input directly to the calculator worker', async () => {
    calculateMock.mockResolvedValue([{ name: 'CRC16', crc: 'ffff' }])

    const wrapper = mount(CRCChecksumCalculatorView, {
      global: {
        stubs,
      },
    })

    await flushPromises()
    calculateMock.mockClear()

    const file = new File(['payload'], 'payload.txt', { type: 'text/plain' })
    const setupState = (wrapper.vm.$ as unknown as { setupState: { textOrFile: string | File } })
      .setupState

    setupState.textOrFile = file
    await flushPromises()

    expect(calculateMock).toHaveBeenCalledWith(file)
    expect(wrapper.text()).toContain('CRC16')
  })

  it('computes CRC results for input and supports copy', async () => {
    calculateMock.mockResolvedValue([
      { name: 'CRC16', crc: 'a1b2' },
      { name: 'CRC32', crc: 'c3d4' },
      { name: 'CRC64 XZ', crc: '995dc9bbdf1939fa' },
    ])

    const wrapper = mount(CRCChecksumCalculatorView, {
      global: {
        stubs,
      },
    })

    await flushPromises()
    calculateMock.mockClear()

    await wrapper.find('input.text-input').setValue('hello')
    await flushPromises()

    expect(wrapMock).toHaveBeenCalled()
    expect(calculateMock).toHaveBeenCalledWith(expect.any(Blob))

    const results = wrapper.findAll('.crc-result')
    expect(results).toHaveLength(3)
    expect(wrapper.text()).toContain('CRC16')
    expect(wrapper.text()).toContain('CRC32')
    expect(wrapper.text()).toContain('CRC64 XZ')

    await results[0]?.trigger('click')
    expect(copySpy).toHaveBeenCalled()
  })
  it('marks displayed results as processing while a new calculation is pending', async () => {
    let resolvePending: ((value: { name: string; crc: string }[]) => void) | undefined
    const pendingCalculation = new Promise<{ name: string; crc: string }[]>((resolve) => {
      resolvePending = resolve
    })

    calculateMock
      .mockResolvedValueOnce([{ name: 'CRC8', crc: '11' }])
      .mockImplementationOnce(() => pendingCalculation)

    const wrapper = mount(CRCChecksumCalculatorView, {
      global: {
        stubs,
      },
    })

    await flushPromises()
    calculateMock.mockClear()

    await wrapper.find('input.text-input').setValue('pending')
    await Promise.resolve()

    expect(calculateMock).toHaveBeenCalled()
    expect(wrapper.find('.crc-result').classes()).toContain('processing')

    resolvePending?.([{ name: 'CRC16', crc: '22' }])
    await flushPromises()

    expect(wrapper.find('.crc-result').classes()).not.toContain('processing')
    expect(wrapper.text()).toContain('CRC16')
  })
})
