import { describe, expect, it } from 'vitest'

import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { NTabs } from 'naive-ui'
import BarcodeReaderView from './BarcodeReaderView.vue'

describe('BarcodeReaderView', () => {
  const mountView = () =>
    mount(BarcodeReaderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          ToolSection: {
            template: '<div><slot /></div>',
          },
          ImageUpload: {
            name: 'ImageUpload',
            props: ['file'],
            emits: ['update:file'],
            template: '<div data-test="image-upload" />',
          },
          CameraCapture: {
            template: '<div data-test="camera-capture" />',
          },
          BarcodeResult: {
            template: '<div />',
          },
        },
      },
    })

  it('renders upload and camera panes', async () => {
    const wrapper = mountView()

    expect(wrapper.find('[data-test="image-upload"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="camera-capture"]').exists()).toBe(false)

    const upload = wrapper.findComponent({ name: 'ImageUpload' })
    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    upload.vm.$emit('update:file', file)
    await nextTick()

    const vm = wrapper.vm as unknown as { mode: 'upload' | 'camera'; file: File | null }
    expect(vm.file?.name).toBe(file.name)
    expect(vm.file?.type).toBe(file.type)

    const tabs = wrapper.findComponent(NTabs)
    tabs.vm.$emit('update:value', 'camera')
    await nextTick()

    expect(vm.mode).toBe('camera')
    expect(wrapper.find('[data-test="camera-capture"]').exists()).toBe(true)
  })

  it('updates result and error state from callbacks', async () => {
    const wrapper = mountView()
    const vm = wrapper.vm as unknown as {
      handleDecoded: (value: { text: string; format: string }) => void
      handleError: (value: string) => void
      result: { text: string; format: string } | null
      error: string | null
    }

    vm.handleDecoded({ text: 'data', format: 'QR_CODE' })
    await nextTick()
    expect(vm.result).toEqual({ text: 'data', format: 'QR_CODE' })
    expect(vm.error).toBeNull()

    vm.handleError('oops')
    await nextTick()
    expect(vm.error).toBe('oops')
    expect(vm.result).toBeNull()
  })

  it('resets state when switching modes', async () => {
    const wrapper = mountView()
    const vm = wrapper.vm as unknown as {
      mode: 'upload' | 'camera'
      result: { text: string; format: string } | null
      error: string | null
      file: File | null
    }

    vm.result = { text: 'data', format: 'QR_CODE' }
    vm.error = 'oops'
    vm.file = new File(['data'], 'sample.png', { type: 'image/png' })

    vm.mode = 'camera'
    await nextTick()

    expect(vm.result).toBeNull()
    expect(vm.error).toBeNull()
    expect(vm.file).toBeNull()
  })
})
