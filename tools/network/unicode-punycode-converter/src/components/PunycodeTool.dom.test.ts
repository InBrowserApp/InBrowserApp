import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const toUnicodeMock = vi.fn()
const toAsciiMock = vi.fn()

vi.mock('punycode', () => ({
  default: {
    toUnicode: toUnicodeMock,
    toASCII: toAsciiMock,
  },
}))

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    props: ['content'],
    template: '<button class="copy-button" :data-content="content" />',
  },
}))

vi.mock('naive-ui', () => ({
  NInput: {
    props: ['value', 'status'],
    emits: ['update:value', 'input'],
    template: `<input class="n-input" :data-status="status" :value="value ?? ''" @input="$emit('update:value', $event.target.value); $emit('input', $event.target.value)" />`,
  },
}))

let PunycodeTool: typeof import('./PunycodeTool.vue').default

beforeAll(async () => {
  PunycodeTool = (await import('./PunycodeTool.vue')).default
})

beforeEach(() => {
  toUnicodeMock.mockReset()
  toAsciiMock.mockReset()
})

describe('PunycodeTool', () => {
  it('renders inputs and copy buttons', () => {
    const wrapper = mount(PunycodeTool)

    expect(wrapper.findAll('.n-input')).toHaveLength(2)
    expect(wrapper.findAll('.copy-button')).toHaveLength(2)
  })

  it('converts ASCII punycode to Unicode and updates status', async () => {
    toUnicodeMock.mockReturnValueOnce('example.com')

    const wrapper = mount(PunycodeTool)
    const inputs = wrapper.findAll('.n-input')

    await inputs[0]!.setValue('xn--example')
    await flushPromises()

    expect(toUnicodeMock).toHaveBeenCalledWith('xn--example')
    expect((inputs[1]!.element as HTMLInputElement).value).toBe('example.com')
    expect(inputs[0]!.attributes('data-status')).toBe('success')
  })

  it('marks ASCII conversion errors', async () => {
    const error = new Error('invalid punycode')
    toUnicodeMock.mockImplementationOnce(() => {
      throw error
    })

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(PunycodeTool)

    await wrapper.findAll('.n-input')[0]!.setValue('bad-input')
    await flushPromises()

    expect(errorSpy).toHaveBeenCalledWith(error)
    expect(wrapper.findAll('.n-input')[0]!.attributes('data-status')).toBe('error')

    errorSpy.mockRestore()
  })

  it('converts Unicode domains to ASCII', async () => {
    toAsciiMock.mockReturnValueOnce('xn--unicode')

    const wrapper = mount(PunycodeTool)
    const inputs = wrapper.findAll('.n-input')

    await inputs[1]!.setValue('unicode.example')
    await flushPromises()

    expect(toAsciiMock).toHaveBeenCalledWith('unicode.example')
    expect((inputs[0]!.element as HTMLInputElement).value).toBe('xn--unicode')
  })
})
