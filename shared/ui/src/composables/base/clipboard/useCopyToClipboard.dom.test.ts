import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Ref } from 'vue'
import { ref, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useCopyToClipboard } from './useCopyToClipboard'

// Mock naive-ui useMessage
const mockCreate = vi.fn()
const mockError = vi.fn()
vi.mock('naive-ui', async () => {
  const actual = await vi.importActual('naive-ui')
  return {
    ...actual,
    useMessage: () => ({
      create: mockCreate,
      error: mockError,
    }),
  }
})

describe('useCopyToClipboard', () => {
  const mockWriteText = vi.fn()

  const mountWithCopy = (text: Ref<string | number | undefined> | string | number | undefined) => {
    const TestComponent = defineComponent({
      setup() {
        const { copy } = useCopyToClipboard(text)
        return { copy }
      },
      template: '<div />',
    })
    return mount(TestComponent)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockWriteText.mockResolvedValue(undefined)
    // Mock clipboard using vi.stubGlobal
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: mockWriteText,
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return copy function', () => {
    const wrapper = mountWithCopy('test')
    expect(typeof wrapper.vm.copy).toBe('function')
  })

  it('should copy string value to clipboard', async () => {
    const wrapper = mountWithCopy('test text')
    await wrapper.vm.copy()
    expect(mockWriteText).toHaveBeenCalledWith('test text')
  })

  it('should copy number value to clipboard as string', async () => {
    const wrapper = mountWithCopy(12345)
    await wrapper.vm.copy()
    expect(mockWriteText).toHaveBeenCalledWith('12345')
  })

  it('should copy ref value to clipboard', async () => {
    const textRef = ref('ref text')
    const wrapper = mountWithCopy(textRef)
    await wrapper.vm.copy()
    expect(mockWriteText).toHaveBeenCalledWith('ref text')
  })

  it('should show success message on successful copy', async () => {
    const wrapper = mountWithCopy('test')
    await wrapper.vm.copy()
    expect(mockCreate).toHaveBeenCalled()
  })

  it('provides a renderable success icon callback', async () => {
    const wrapper = mountWithCopy('test')
    await wrapper.vm.copy()

    const options = mockCreate.mock.calls[0]?.[1]
    expect(options).toBeDefined()
    expect(typeof options.icon).toBe('function')

    const iconVNode = options.icon()
    const defaultSlot = (iconVNode.children as { default?: () => unknown } | null)?.default
    expect(typeof defaultSlot).toBe('function')
    expect(defaultSlot?.()).toBeDefined()
  })

  it('should show error message on clipboard error', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('Clipboard error'))
    const wrapper = mountWithCopy('test')
    await wrapper.vm.copy()
    expect(mockError).toHaveBeenCalled()
  })

  it('should not copy when text is undefined', async () => {
    const wrapper = mountWithCopy(undefined)
    await wrapper.vm.copy()
    expect(mockWriteText).not.toHaveBeenCalled()
  })

  it('should not copy when text is empty string', async () => {
    const wrapper = mountWithCopy('')
    await wrapper.vm.copy()
    expect(mockWriteText).not.toHaveBeenCalled()
  })
})
