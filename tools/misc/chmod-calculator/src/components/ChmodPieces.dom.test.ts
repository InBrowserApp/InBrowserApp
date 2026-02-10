import { describe, expect, it, vi } from 'vitest'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h2><slot /></h2>',
    }),
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: ['content'],
      template: '<button data-testid="copy" :data-content="content" />',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NButton: defineComponent({
      name: 'NButton',
      template: '<button><slot /></button>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: ['value', 'status', 'placeholder'],
      emits: ['update:value'],
      template:
        '<input :value="value" :data-status="status" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NTable: defineComponent({
      name: 'NTable',
      template: '<table><slot /></table>',
    }),
    NCheckbox: defineComponent({
      name: 'NCheckbox',
      props: ['checked'],
      emits: ['update:checked'],
      template:
        '<input type="checkbox" :checked="checked" @change="$emit(\'update:checked\', $event.target.checked)" />',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

import { mount } from '@vue/test-utils'
import CommonPresets from './CommonPresets.vue'
import NumericInput from './NumericInput.vue'
import SymbolicInput from './SymbolicInput.vue'
import PermissionMatrix from './PermissionMatrix.vue'
import ChmodCommand from './ChmodCommand.vue'

describe('chmod components', () => {
  it('emits selected preset values', async () => {
    const wrapper = mount(CommonPresets)

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(6)

    await buttons[0]?.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual(['755'])
  })

  it('updates numeric input and shows validity state', async () => {
    const wrapper = mount(NumericInput, {
      props: {
        modelValue: '755',
        isValid: true,
      },
    })

    const input = wrapper.get('input')
    expect(input.attributes('data-status')).toBeUndefined()

    await wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', '700')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['700'])

    await wrapper.setProps({ isValid: false })
    expect(wrapper.get('input').attributes('data-status')).toBe('error')
  })

  it('updates symbolic input and shows validity state', async () => {
    const wrapper = mount(SymbolicInput, {
      props: {
        modelValue: 'rwxr-xr-x',
        isValid: true,
      },
    })

    await wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'rwx------')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['rwx------'])

    await wrapper.setProps({ isValid: false })
    expect(wrapper.get('input').attributes('data-status')).toBe('error')
  })

  it('emits matrix updates when toggles change', () => {
    const wrapper = mount(PermissionMatrix, {
      props: {
        permissions: {
          owner: { read: true, write: true, execute: true },
          group: { read: true, write: false, execute: false },
          others: { read: false, write: false, execute: false },
        },
      },
    })

    const checkboxes = wrapper.findAllComponents({ name: 'NCheckbox' })
    expect(checkboxes).toHaveLength(9)

    checkboxes[0]?.vm.$emit('update:checked', false)
    expect(wrapper.emitted('update')?.[0]).toEqual(['owner', 'read', false])
  })

  it('renders the chmod command with copy action', () => {
    const wrapper = mount(ChmodCommand, {
      props: {
        command: 'chmod 644 <filename>',
      },
    })

    expect(wrapper.text()).toContain('chmod 644 <filename>')
    const copy = wrapper.get('[data-testid="copy"]')
    expect(copy.attributes('data-content')).toBe('chmod 644 <filename>')
  })
})
