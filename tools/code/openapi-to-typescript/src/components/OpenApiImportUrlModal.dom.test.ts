import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NAlert: defineComponent({
      name: 'NAlert',
      template: '<div data-testid="alert"><slot /></div>',
    }),
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NFormItem: defineComponent({
      name: 'NFormItem',
      template: '<div><slot /><slot name="feedback" /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
        disabled: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          default: undefined,
        },
      },
      emits: ['update:value', 'keydown'],
      template:
        '<input :value="value" :disabled="disabled" @input="$emit(\'update:value\', $event.target.value)" @keydown="$emit(\'keydown\', $event)" />',
    }),
    NModal: defineComponent({
      name: 'NModal',
      props: {
        show: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['update:show'],
      template: '<div data-testid="modal" :data-show="show"><slot /><slot name="footer" /></div>',
    }),
    NSpace: defineComponent({
      name: 'NSpace',
      template: '<div><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

import OpenApiImportUrlModal from './OpenApiImportUrlModal.vue'

describe('OpenApiImportUrlModal', () => {
  it('renders content and triggers callbacks', async () => {
    const onUpdateInput = vi.fn()
    const onEnter = vi.fn()
    const onClose = vi.fn()
    const onConfirm = vi.fn()

    const wrapper = mount(OpenApiImportUrlModal, {
      props: {
        show: true,
        importUrl: '',
        importUrlError: 'Invalid URL',
        importUrlStatus: 'error',
        isImporting: false,
        onUpdateInput,
        onEnter,
        onClose,
        onConfirm,
      },
    })

    expect(wrapper.get('[data-testid="modal"]').attributes('data-show')).toBe('true')
    expect(wrapper.text()).toContain('importUrlWarning')
    expect(wrapper.text()).toContain('Invalid URL')

    wrapper.getComponent({ name: 'NModal' }).vm.$emit('update:show', false)
    expect(wrapper.emitted('update:show')?.[0]).toEqual([false])

    await wrapper.get('input').setValue('https://example.com/openapi.yaml')
    expect(onUpdateInput).toHaveBeenCalledWith('https://example.com/openapi.yaml')

    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    expect(onEnter).toHaveBeenCalled()

    const buttons = wrapper.findAll('button')
    await buttons[0]?.trigger('click')
    await buttons[1]?.trigger('click')
    expect(onClose).toHaveBeenCalled()
    expect(onConfirm).toHaveBeenCalled()
  })
})
