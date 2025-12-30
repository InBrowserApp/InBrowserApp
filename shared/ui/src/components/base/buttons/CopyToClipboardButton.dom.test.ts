import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CopyToClipboardButton from './CopyToClipboardButton.vue'

// Mock the composable
const mockCopy = vi.fn()
vi.mock('../../../composables/base/clipboard/useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({
    copy: mockCopy,
  }),
}))

// Mock naive-ui useMessage
vi.mock('naive-ui', async () => {
  const actual = await vi.importActual('naive-ui')
  return {
    ...actual,
    useMessage: () => ({
      create: vi.fn(),
      error: vi.fn(),
    }),
  }
})

describe('CopyToClipboardButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render button', () => {
    const wrapper = mount(CopyToClipboardButton)
    // Check that the component renders and contains a button element
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should emit click event on click', async () => {
    const wrapper = mount(CopyToClipboardButton, {
      props: { content: 'test content' },
    })
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should call copy function on click', async () => {
    const wrapper = mount(CopyToClipboardButton, {
      props: { content: 'test content' },
    })
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(mockCopy).toHaveBeenCalled()
  })

  it('should accept content prop as string', () => {
    const wrapper = mount(CopyToClipboardButton, {
      props: { content: 'string content' },
    })
    expect(wrapper.props('content')).toBe('string content')
  })

  it('should accept content prop as number', () => {
    const wrapper = mount(CopyToClipboardButton, {
      props: { content: 12345 },
    })
    expect(wrapper.props('content')).toBe(12345)
  })

  it('should render custom icon slot', () => {
    const wrapper = mount(CopyToClipboardButton, {
      slots: {
        icon: '<span class="custom-icon">Custom</span>',
      },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })

  it('should render custom label slot', () => {
    const wrapper = mount(CopyToClipboardButton, {
      slots: {
        label: 'Custom Label',
      },
    })
    expect(wrapper.text()).toContain('Custom Label')
  })
})
