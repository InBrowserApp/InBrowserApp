import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')

  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed, unref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) =>
      computed(() => (unref(source as { value?: unknown }) ? 'blob:preview' : undefined)),
  }
})

const barcodeReaderMocks = vi.hoisted(() => ({
  readBarcodeFromFile: vi.fn(),
}))

vi.mock('../barcode-reader', () => ({
  readBarcodeFromFile: barcodeReaderMocks.readBarcodeFromFile,
}))

import { mount } from '@vue/test-utils'
import ImageUpload from './ImageUpload.vue'

const createFilePayload = (file?: File) => ({
  file: { file },
  fileList: file ? [{ file }] : [],
})

describe('ImageUpload', () => {
  beforeEach(() => {
    barcodeReaderMocks.readBarcodeFromFile.mockReset()
  })
  it('ignores empty upload payloads', async () => {
    const decoded = vi.fn()
    const error = vi.fn()

    const wrapper = mount(ImageUpload, {
      props: {
        file: null,
        'onUpdate:file': vi.fn(),
        onDecoded: decoded,
        onError: error,
      },
    })

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (payload: unknown) => Promise<boolean>
    }
    const result = await vm.handleBeforeUpload(createFilePayload())

    expect(result).toBe(false)
    expect(barcodeReaderMocks.readBarcodeFromFile).not.toHaveBeenCalled()
    expect(decoded).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })

  it('emits decoded data for successful reads', async () => {
    const decoded = vi.fn()
    const error = vi.fn()
    const update = vi.fn()

    barcodeReaderMocks.readBarcodeFromFile.mockResolvedValueOnce({
      text: 'data',
      format: 'QR_CODE',
    })

    const wrapper = mount(ImageUpload, {
      props: {
        file: null,
        'onUpdate:file': update,
        onDecoded: decoded,
        onError: error,
      },
    })

    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (payload: unknown) => Promise<boolean>
    }
    const result = await vm.handleBeforeUpload(createFilePayload(file))

    expect(result).toBe(false)
    expect(update).toHaveBeenCalledWith(file)
    expect(decoded).toHaveBeenCalledWith({ text: 'data', format: 'QR_CODE' })
    expect(error).not.toHaveBeenCalled()
  })

  it('emits error when no barcode is found', async () => {
    const error = vi.fn()

    barcodeReaderMocks.readBarcodeFromFile.mockResolvedValueOnce(null)

    const wrapper = mount(ImageUpload, {
      props: {
        file: null,
        'onUpdate:file': vi.fn(),
        onDecoded: vi.fn(),
        onError: error,
      },
    })

    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (payload: unknown) => Promise<boolean>
    }
    await vm.handleBeforeUpload(createFilePayload(file))
    await wrapper.setProps({ file })

    expect(error).toHaveBeenCalledWith('noBarcodeFound')
  })

  it('emits errors on decode failures and clears on reset', async () => {
    const error = vi.fn()
    const update = vi.fn()

    barcodeReaderMocks.readBarcodeFromFile.mockRejectedValueOnce(new Error('decode-failed'))

    const wrapper = mount(ImageUpload, {
      props: {
        file: null,
        'onUpdate:file': update,
        onDecoded: vi.fn(),
        onError: error,
      },
    })
    update.mockImplementation((value: File | null) => wrapper.setProps({ file: value }))

    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (payload: unknown) => Promise<boolean>
      clearFile: () => void
    }

    await vm.handleBeforeUpload(createFilePayload(file))
    expect(error).toHaveBeenCalledWith('failedToReadImage')

    vm.clearFile()
    await wrapper.vm.$nextTick()

    expect(update).toHaveBeenCalledWith(null)
    expect(error).toHaveBeenCalledWith('')
  })

  it('shows a preview and clears when uploading another file', async () => {
    const error = vi.fn()
    const update = vi.fn()
    const file = new File(['data'], 'sample.png', { type: 'image/png' })

    const wrapper = mount(ImageUpload, {
      props: {
        file,
        'onUpdate:file': update,
        onDecoded: vi.fn(),
        onError: error,
      },
    })
    update.mockImplementation((value: File | null) => wrapper.setProps({ file: value }))

    await wrapper.vm.$nextTick()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('blob:preview')

    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(update).toHaveBeenCalledWith(null)
    expect(error).toHaveBeenCalledWith('')
  })
})
