import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CSPInputSection from './CSPInputSection.vue'

describe('CSPInputSection', () => {
  it('emits value updates and renders feedback', async () => {
    const wrapper = mount(CSPInputSection, {
      props: {
        value: '',
        detectedInputKind: 'header',
        status: 'error',
        feedback: 'Invalid header',
        importFromFile: vi.fn().mockResolvedValue(undefined),
        applySample: vi.fn(),
        clearInput: vi.fn(),
      },
    })

    await wrapper.get('textarea').setValue("default-src 'self'")

    expect(wrapper.emitted('update:value')?.at(-1)?.[0]).toBe("default-src 'self'")
    expect(wrapper.text()).toContain('Detected: header')
    expect(wrapper.text()).toContain('Invalid header')
  })

  it('invokes the import, sample, and clear actions', async () => {
    const importFromFile = vi.fn().mockResolvedValue(undefined)
    const applySample = vi.fn()
    const clearInput = vi.fn()
    const wrapper = mount(CSPInputSection, {
      props: {
        value: '',
        detectedInputKind: 'policy',
        importFromFile,
        applySample,
        clearInput,
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0]?.trigger('click')
    await buttons[1]?.trigger('click')
    await buttons[2]?.trigger('click')

    expect(importFromFile).toHaveBeenCalledTimes(1)
    expect(applySample).toHaveBeenCalledTimes(1)
    expect(clearInput).toHaveBeenCalledTimes(1)
  })
})
