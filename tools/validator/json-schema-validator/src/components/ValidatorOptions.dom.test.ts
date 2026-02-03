import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ValidatorOptions from './ValidatorOptions.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NSwitch = defineComponent({
    name: 'NSwitch',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      size: {
        type: String,
        default: 'small',
      },
    },
    emits: ['update:value'],
    template: '<button class="n-switch" @click="$emit(\'update:value\', !value)" />',
  })

  return {
    NFlex,
    NSwitch,
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section class="tool-section"><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h3 class="tool-section-header"><slot /></h3>',
    }),
  }
})

describe('ValidatorOptions', () => {
  it('renders labels and emits updates', async () => {
    const wrapper = mount(ValidatorOptions, {
      props: {
        validateFormats: true,
        allErrors: false,
      },
    })

    expect(wrapper.text()).toContain('validateFormats')
    expect(wrapper.text()).toContain('allErrors')

    const switches = wrapper.findAllComponents({ name: 'NSwitch' })
    const validateSwitch = switches[0]
    const allErrorsSwitch = switches[1]
    if (!validateSwitch || !allErrorsSwitch) {
      throw new Error('Expected validation switches')
    }
    await validateSwitch.trigger('click')
    await allErrorsSwitch.trigger('click')

    expect(wrapper.emitted('update:validateFormats')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:allErrors')?.[0]).toEqual([true])
  })
})
