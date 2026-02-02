import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import BarcodeDownloadButtons from './BarcodeDownloadButtons.vue'

const jsBarcodeMock = vi.hoisted(() => ({
  fn: vi.fn(),
}))

vi.mock('jsbarcode', () => ({
  default: jsBarcodeMock.fn,
}))

vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')
  return {
    useObjectUrl: (blobRef: { value: Blob | null }) =>
      computed(() => (blobRef.value ? 'blob:mock' : '')),
  }
})

vi.mock('@vicons/fluent/Code16Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/Image16Regular', () => ({ default: {} }))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span />',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      tag: {
        type: String,
        default: 'button',
      },
      href: {
        type: String,
        default: undefined,
      },
      download: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      tertiary: {
        type: Boolean,
        default: false,
      },
    },
    template: '<a><slot /></a>',
  })

  return {
    NFlex,
    NButton,
    NIcon,
  }
})

const baseProps = {
  text: 'HELLO',
  format: 'CODE128',
  width: 2,
  height: 100,
  margin: 10,
  displayValue: true,
  textAlign: 'center' as const,
  textPosition: 'bottom' as const,
  fontSize: 20,
  lineColor: '#000000',
  background: '#ffffff',
}

describe('BarcodeDownloadButtons', () => {
  let originalToBlob: typeof HTMLCanvasElement.prototype.toBlob | undefined

  beforeEach(() => {
    jsBarcodeMock.fn.mockReset()
    originalToBlob = HTMLCanvasElement.prototype.toBlob
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: (callback: (blob: Blob | null) => void) => {
        callback(new Blob(['png'], { type: 'image/png' }))
      },
      writable: true,
    })
  })

  afterEach(() => {
    if (originalToBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: originalToBlob,
        writable: true,
      })
    } else {
      delete (HTMLCanvasElement.prototype as { toBlob?: unknown }).toBlob
    }
    vi.useRealTimers()
  })

  it('builds png and svg downloads', async () => {
    vi.useFakeTimers()

    const wrapper = mount(BarcodeDownloadButtons, {
      props: baseProps,
    })

    await vi.runAllTimersAsync()
    await flushPromises()

    expect(jsBarcodeMock.fn).toHaveBeenCalled()

    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    expect(buttons).toHaveLength(2)

    const firstProps = buttons[0]?.props() as Record<string, unknown>
    expect(firstProps.href).toBe('blob:mock')
    expect(firstProps.disabled).toBe(false)
    expect(firstProps.download).toBe('barcode.png')

    const secondProps = buttons[1]?.props() as Record<string, unknown>
    expect(secondProps.href).toBe('blob:mock')
    expect(secondProps.disabled).toBe(false)
    expect(secondProps.download).toBe('barcode.svg')
  })
})
