import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const compareMock = vi.fn(
  async (password: string, hash: string) => password.length > 0 && password === hash,
)

vi.mock('bcrypt-ts', () => ({
  compare: compareMock,
}))

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
}))

vi.mock('naive-ui', () => ({
  NFormItem: {
    props: ['label'],
    template: '<label class="form-item"><slot /></label>',
  },
  NInput: {
    props: ['value'],
    emits: ['update:value'],
    template: `<input class="n-input" :value="value ?? ''" @input="$emit('update:value', $event.target.value)" />`,
  },
  NText: {
    template: '<span class="n-text"><slot /></span>',
  },
  NIcon: {
    props: ['component'],
    template: `<span class="n-icon" :data-icon="component?.name ?? ''"><slot /></span>`,
  },
  NFlex: {
    template: '<div class="n-flex"><slot /></div>',
  },
}))

vi.mock('./WhatIsBcrypt.vue', () => ({
  default: {
    template: '<div class="what-is-bcrypt" />',
  },
}))

let BcryptHashPasswordVerifierView: typeof import('./BcryptHashPasswordVerifierView.vue').default

beforeAll(async () => {
  BcryptHashPasswordVerifierView = (await import('./BcryptHashPasswordVerifierView.vue')).default
})

beforeEach(() => {
  compareMock.mockClear()
})

describe('BcryptHashPasswordVerifierView', () => {
  it('renders the layout, inputs, and result summary', async () => {
    const wrapper = mount(BcryptHashPasswordVerifierView)

    await flushPromises()

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.findAll('.n-input')).toHaveLength(2)
    expect(wrapper.find('.bcrypt-verifier-result').exists()).toBe(true)
    expect(wrapper.find('.bcrypt-verifier-result-icon').exists()).toBe(true)
    expect(wrapper.find('.what-is-bcrypt').exists()).toBe(true)
  })

  it('updates verification output when values change', async () => {
    const wrapper = mount(BcryptHashPasswordVerifierView)

    await flushPromises()

    expect(compareMock).toHaveBeenCalledWith('', '')
    expect(wrapper.find('.bcrypt-verifier-result').text()).toContain(
      'Password does not match the hash',
    )

    const inputs = wrapper.findAll('.n-input')
    await inputs[0]!.setValue('secret')
    await flushPromises()

    expect(compareMock).toHaveBeenCalledWith('secret', '')

    await inputs[1]!.setValue('secret')
    await flushPromises()

    expect(compareMock).toHaveBeenLastCalledWith('secret', 'secret')
    expect(wrapper.find('.bcrypt-verifier-result').text()).toContain('Password matches the hash')
  })
})
