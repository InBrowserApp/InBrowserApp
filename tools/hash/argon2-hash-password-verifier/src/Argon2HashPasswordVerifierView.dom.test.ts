import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const argon2VerifyMock = vi.fn(async (params: { password: string; hash: string }) => {
  if (params.hash === 'invalid') {
    throw new Error('Invalid hash')
  }
  return params.password === params.hash
})

vi.mock('hash-wasm', () => ({
  argon2Verify: argon2VerifyMock,
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

vi.mock('./WhatIsArgon2.vue', () => ({
  default: {
    template: '<div class="what-is-argon2" />',
  },
}))

let Argon2HashPasswordVerifierView: typeof import('./Argon2HashPasswordVerifierView.vue').default

beforeAll(async () => {
  Argon2HashPasswordVerifierView = (await import('./Argon2HashPasswordVerifierView.vue')).default
})

beforeEach(() => {
  argon2VerifyMock.mockClear()
})

describe('Argon2HashPasswordVerifierView', () => {
  it('renders the layout, inputs, and result summary', async () => {
    const wrapper = mount(Argon2HashPasswordVerifierView)

    await flushPromises()

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.findAll('.n-input')).toHaveLength(3)
    expect(wrapper.find('.argon2-verifier-result').exists()).toBe(true)
    expect(wrapper.find('.argon2-verifier-result-icon').exists()).toBe(true)
    expect(wrapper.find('.what-is-argon2').exists()).toBe(true)
  })

  it('shows idle message until both password and hash are provided', async () => {
    const wrapper = mount(Argon2HashPasswordVerifierView)

    await flushPromises()

    expect(argon2VerifyMock).not.toHaveBeenCalled()
    expect(wrapper.find('.argon2-verifier-result').text()).toContain(
      'Enter password and Argon2 hash to verify.',
    )

    await wrapper.findAll('.n-input')[0]!.setValue('secret')
    await flushPromises()

    expect(argon2VerifyMock).not.toHaveBeenCalled()
    expect(wrapper.find('.argon2-verifier-result').text()).toContain(
      'Enter password and Argon2 hash to verify.',
    )
  })

  it('shows verified state when password matches hash', async () => {
    const wrapper = mount(Argon2HashPasswordVerifierView)

    const inputs = wrapper.findAll('.n-input')
    await inputs[0]!.setValue('secret')
    await inputs[1]!.setValue('secret')

    await flushPromises()

    expect(argon2VerifyMock).toHaveBeenLastCalledWith({
      password: 'secret',
      hash: 'secret',
      secret: undefined,
    })
    expect(wrapper.find('.argon2-verifier-result').text()).toContain(
      'Password matches the Argon2 hash.',
    )
  })

  it('shows not-verified state for mismatch', async () => {
    const wrapper = mount(Argon2HashPasswordVerifierView)

    const inputs = wrapper.findAll('.n-input')
    await inputs[0]!.setValue('secret')
    await inputs[1]!.setValue('other')

    await flushPromises()

    expect(wrapper.find('.argon2-verifier-result').text()).toContain(
      'Password does not match the Argon2 hash.',
    )
  })

  it('shows invalid-hash state when verification throws', async () => {
    const wrapper = mount(Argon2HashPasswordVerifierView)

    const inputs = wrapper.findAll('.n-input')
    await inputs[0]!.setValue('secret')
    await inputs[1]!.setValue('invalid')

    await flushPromises()

    expect(wrapper.find('.argon2-verifier-result').text()).toContain(
      'The provided Argon2 hash is invalid.',
    )
  })

  it('passes optional secret for verification', async () => {
    const wrapper = mount(Argon2HashPasswordVerifierView)

    const inputs = wrapper.findAll('.n-input')
    await inputs[0]!.setValue('secret')
    await inputs[1]!.setValue('secret')
    await inputs[2]!.setValue('pepper')

    await flushPromises()

    expect(argon2VerifyMock).toHaveBeenLastCalledWith({
      password: 'secret',
      hash: 'secret',
      secret: 'pepper',
    })
  })
})
