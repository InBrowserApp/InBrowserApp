import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ScryptResult from './components/ScryptResult.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardTooltip: {
    props: ['content'],
    template: '<div class="clipboard"><slot :copy="() => {}" /></div>',
  },
}))

vi.mock('naive-ui', () => ({
  NDescriptions: {
    template: '<div class="descriptions"><slot /></div>',
  },
  NDescriptionsItem: {
    template:
      '<div class="descriptions-item"><div class="label"><slot name="label" /></div><slot /></div>',
  },
  NText: {
    template: '<span class="text"><slot /></span>',
  },
}))

describe('ScryptResult', () => {
  it('derives and renders the key output', async () => {
    const wrapper = mount(ScryptResult, {
      props: {
        password: 'password',
        salt: 'salt',
        saltFormat: 'utf-8',
        costFactor: 16,
        blockSize: 1,
        parallelism: 1,
        length: 32,
        costFactorValid: true,
        blockSizeValid: true,
        parallelismValid: true,
        lengthValid: true,
        saltErrorType: '',
      },
    })

    const expected = '45133c3dfba48c82235df51a5349924110eee893752f0d4168d2e2aee5722d82'
    for (let attempt = 0; attempt < 10; attempt += 1) {
      await flushPromises()
      if (wrapper.text().includes(expected)) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 20))
    }

    expect(wrapper.text()).toContain(expected)
  })

  it('clears previous output when derivation fails on later inputs', async () => {
    const wrapper = mount(ScryptResult, {
      props: {
        password: 'password',
        salt: 'salt',
        saltFormat: 'utf-8',
        costFactor: 16,
        blockSize: 1,
        parallelism: 1,
        length: 32,
        costFactorValid: true,
        blockSizeValid: true,
        parallelismValid: true,
        lengthValid: true,
        saltErrorType: '',
      },
    })

    const expected = '45133c3dfba48c82235df51a5349924110eee893752f0d4168d2e2aee5722d82'
    for (let attempt = 0; attempt < 10; attempt += 1) {
      await flushPromises()
      if (wrapper.text().includes(expected)) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 20))
    }
    expect(wrapper.text()).toContain(expected)

    await wrapper.setProps({
      costFactor: 1048576,
      blockSize: 16,
      costFactorValid: true,
      blockSizeValid: true,
    })

    for (let attempt = 0; attempt < 10; attempt += 1) {
      await flushPromises()
      if (!wrapper.text().includes(expected)) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 20))
    }

    expect(wrapper.text()).not.toContain(expected)
  })

  it('hides output when inputs are invalid', async () => {
    const wrapper = mount(ScryptResult, {
      props: {
        password: '',
        salt: '',
        saltFormat: 'utf-8',
        costFactor: 16,
        blockSize: 1,
        parallelism: 1,
        length: 32,
        costFactorValid: true,
        blockSizeValid: true,
        parallelismValid: true,
        lengthValid: true,
        saltErrorType: '',
      },
    })

    await flushPromises()

    expect(wrapper.find('.descriptions').exists()).toBe(false)
  })
})
