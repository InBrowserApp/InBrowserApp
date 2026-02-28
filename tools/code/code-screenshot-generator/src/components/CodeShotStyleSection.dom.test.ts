import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeShotStyleSection from './CodeShotStyleSection.vue'

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

vi.mock('./CodeShotSyntaxOptions.vue', async () => {
  const { defineComponent } = await import('vue')

  return {
    default: defineComponent({
      name: 'CodeShotSyntaxOptions',
      props: {
        language: {
          type: String,
          default: '',
        },
        renderMode: {
          type: String,
          default: 'highlight',
        },
        themeId: {
          type: String,
          default: '',
        },
      },
      emits: ['update:language', 'update:renderMode', 'update:themeId'],
      template: '<div data-testid="syntax-options" />',
    }),
  }
})

vi.mock('./CodeShotBackgroundOptions.vue', async () => {
  const { defineComponent } = await import('vue')

  return {
    default: defineComponent({
      name: 'CodeShotBackgroundOptions',
      props: {
        backgroundType: {
          type: String,
          default: 'preset',
        },
        backgroundPresetId: {
          type: String,
          default: '',
        },
        backgroundColor: {
          type: String,
          default: '',
        },
      },
      emits: ['update:backgroundType', 'update:backgroundPresetId', 'update:backgroundColor'],
      template: '<div data-testid="background-options" />',
    }),
  }
})

vi.mock('./CodeShotWindowOptions.vue', async () => {
  const { defineComponent } = await import('vue')

  return {
    default: defineComponent({
      name: 'CodeShotWindowOptions',
      props: {
        windowStyle: {
          type: String,
          default: 'mac',
        },
        showLineNumbers: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['update:windowStyle', 'update:showLineNumbers'],
      template: '<div data-testid="window-options" />',
    }),
  }
})

describe('CodeShotStyleSection', () => {
  it('wires option components with v-model updates', () => {
    const wrapper = mount(CodeShotStyleSection, {
      props: {
        language: 'javascript',
        renderMode: 'highlight',
        themeId: 'nebula',
        backgroundType: 'preset',
        backgroundPresetId: 'aurora',
        backgroundColor: '#ffffff',
        windowStyle: 'mac',
        showLineNumbers: true,
      },
    })

    const syntax = wrapper.findComponent({ name: 'CodeShotSyntaxOptions' })
    const background = wrapper.findComponent({ name: 'CodeShotBackgroundOptions' })
    const windowOptions = wrapper.findComponent({ name: 'CodeShotWindowOptions' })

    expect(syntax.props('language')).toBe('javascript')
    expect(background.props('backgroundType')).toBe('preset')
    expect(windowOptions.props('windowStyle')).toBe('mac')

    syntax.vm.$emit('update:language', 'json')
    syntax.vm.$emit('update:renderMode', 'plain')
    syntax.vm.$emit('update:themeId', 'paper')
    background.vm.$emit('update:backgroundType', 'solid')
    background.vm.$emit('update:backgroundPresetId', 'ocean')
    background.vm.$emit('update:backgroundColor', '#121212')
    windowOptions.vm.$emit('update:windowStyle', 'windows')
    windowOptions.vm.$emit('update:showLineNumbers', false)

    expect(wrapper.emitted('update:language')?.[0]).toEqual(['json'])
    expect(wrapper.emitted('update:renderMode')?.[0]).toEqual(['plain'])
    expect(wrapper.emitted('update:themeId')?.[0]).toEqual(['paper'])
    expect(wrapper.emitted('update:backgroundType')?.[0]).toEqual(['solid'])
    expect(wrapper.emitted('update:backgroundPresetId')?.[0]).toEqual(['ocean'])
    expect(wrapper.emitted('update:backgroundColor')?.[0]).toEqual(['#121212'])
    expect(wrapper.emitted('update:windowStyle')?.[0]).toEqual(['windows'])
    expect(wrapper.emitted('update:showLineNumbers')?.[0]).toEqual([false])
  })
})
