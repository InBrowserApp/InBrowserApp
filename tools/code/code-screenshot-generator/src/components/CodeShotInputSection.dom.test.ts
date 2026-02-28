import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeShotInputSection from './CodeShotInputSection.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    name: 'ToolSectionHeader',
    template: '<h2><slot /></h2>',
  },
  ToolSection: {
    name: 'ToolSection',
    template: '<section><slot /></section>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NFormItem: defineComponent({
      name: 'NFormItem',
      template: '<label><slot /></label>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
        type: {
          type: String,
          default: 'text',
        },
        placeholder: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template: '<textarea :placeholder="placeholder" :value="value" />',
    }),
  }
})

describe('CodeShotInputSection', () => {
  it('binds the code input and emits updates', () => {
    const wrapper = mount(CodeShotInputSection, {
      props: {
        code: 'const answer = 42',
      },
    })

    const input = wrapper.findComponent({ name: 'NInput' })
    expect(input.props('type')).toBe('textarea')
    expect(input.props('placeholder')).toBe('Paste or type your snippet here...')

    input.vm.$emit('update:value', 'const next = 13')
    expect(wrapper.emitted('update:code')?.[0]).toEqual(['const next = 13'])
  })
})
