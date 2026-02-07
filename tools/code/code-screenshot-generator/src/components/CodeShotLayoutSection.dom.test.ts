import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeShotLayoutSection from './CodeShotLayoutSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      template: '<label><slot /></label>',
    }),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: {
        value: {
          type: Number,
          default: 0,
        },
        min: {
          type: Number,
          default: undefined,
        },
        max: {
          type: Number,
          default: undefined,
        },
        step: {
          type: Number,
          default: undefined,
        },
        disabled: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['update:value'],
      template:
        '<input :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
    }),
    NSwitch: defineComponent({
      name: 'NSwitch',
      props: {
        value: {
          type: Boolean,
          default: false,
        },
        disabled: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['update:value'],
      template: '<button type="button" @click="$emit(\'update:value\', !value)" />',
    }),
  }
})

describe('CodeShotLayoutSection', () => {
  it('emits updates and toggles background-dependent controls', async () => {
    const wrapper = mount(CodeShotLayoutSection, {
      props: {
        isBackgroundNone: false,
        fontSize: 14,
        lineHeight: 1.5,
        cardPadding: 24,
        framePadding: 48,
        radius: 12,
        shadow: true,
        tabSize: 2,
      },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    expect(inputs).toHaveLength(6)

    const [fontInput, lineHeightInput, cardPaddingInput, framePaddingInput, radiusInput, tabInput] =
      inputs

    if (
      !fontInput ||
      !lineHeightInput ||
      !cardPaddingInput ||
      !framePaddingInput ||
      !radiusInput ||
      !tabInput
    ) {
      throw new Error('Expected layout inputs to exist')
    }

    fontInput.vm.$emit('update:value', 18)
    lineHeightInput.vm.$emit('update:value', 1.85)
    cardPaddingInput.vm.$emit('update:value', 30)
    framePaddingInput.vm.$emit('update:value', 64)
    radiusInput.vm.$emit('update:value', 20)
    tabInput.vm.$emit('update:value', 4)

    const shadowSwitch = wrapper.findComponent({ name: 'NSwitch' })
    shadowSwitch.vm.$emit('update:value', false)

    expect(wrapper.emitted('update:fontSize')?.[0]).toEqual([18])
    expect(wrapper.emitted('update:lineHeight')?.[0]).toEqual([1.85])
    expect(wrapper.emitted('update:cardPadding')?.[0]).toEqual([30])
    expect(wrapper.emitted('update:framePadding')?.[0]).toEqual([64])
    expect(wrapper.emitted('update:radius')?.[0]).toEqual([20])
    expect(wrapper.emitted('update:tabSize')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:shadow')?.[0]).toEqual([false])

    expect(framePaddingInput.props('min')).toBe(16)
    expect(framePaddingInput.props('disabled')).toBe(false)
    expect(shadowSwitch.props('disabled')).toBe(false)

    await wrapper.setProps({ isBackgroundNone: true })

    const updatedFrame = wrapper
      .findAllComponents({ name: 'NInputNumber' })
      .find((input) => input.props('max') === 120)
    expect(updatedFrame?.props('min')).toBe(0)
    expect(updatedFrame?.props('disabled')).toBe(true)
    expect(wrapper.findComponent({ name: 'NSwitch' }).props('disabled')).toBe(true)
  })
})
