import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const hashMock = vi.fn(async (text: string, rounds: number) => `hash:${text}:${rounds}`)

vi.mock('bcrypt-ts', () => ({
  hash: hashMock,
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

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardTooltip: {
    props: ['content'],
    template: '<div class="copy-tooltip"><slot :copy="() => {}" /></div>',
  },
  CopyToClipboardButton: {
    props: ['content'],
    template: '<button class="copy-button" />',
  },
}))

vi.mock('naive-ui', () => ({
  NFormItem: {
    props: ['label', 'showFeedback'],
    template: '<label class="form-item"><slot /></label>',
  },
  NInput: {
    props: ['value'],
    emits: ['update:value'],
    template: `<input class="n-input" :value="value ?? ''" @input="$emit('update:value', $event.target.value)" />`,
  },
  NSlider: {
    props: ['value'],
    emits: ['update:value'],
    template:
      '<input class="n-slider" type="range" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
  },
  NText: {
    template: '<span class="n-text"><slot /></span>',
  },
}))

vi.mock('./WhatIsBcrypt.vue', () => ({
  default: {
    template: '<div class="what-is-bcrypt" />',
  },
}))

let BcryptHashPasswordView: typeof import('./BcryptHashPasswordView.vue').default

beforeAll(async () => {
  BcryptHashPasswordView = (await import('./BcryptHashPasswordView.vue')).default
})

beforeEach(() => {
  hashMock.mockClear()
})

describe('BcryptHashPasswordView', () => {
  it('renders the layout and info section', () => {
    const wrapper = mount(BcryptHashPasswordView)

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.find('.bcrypt-result').exists()).toBe(true)
    expect(wrapper.find('.copy-tooltip').exists()).toBe(true)
    expect(wrapper.find('.copy-button').exists()).toBe(true)
    expect(wrapper.find('.what-is-bcrypt').exists()).toBe(true)
  })

  it('hashes input text with the selected rounds', async () => {
    const wrapper = mount(BcryptHashPasswordView)

    await flushPromises()

    expect(hashMock).toHaveBeenCalledWith('', 10)
    expect(wrapper.find('.bcrypt-result').text()).toContain('hash::10')

    await wrapper.find('.n-input').setValue('secret')
    await flushPromises()

    expect(hashMock).toHaveBeenLastCalledWith('secret', 10)
    expect(wrapper.find('.bcrypt-result').text()).toContain('hash:secret:10')

    await wrapper.find('.n-slider').setValue('12')
    await flushPromises()

    expect(hashMock).toHaveBeenLastCalledWith('secret', 12)
    expect(wrapper.find('.bcrypt-result').text()).toContain('hash:secret:12')
  })
})
