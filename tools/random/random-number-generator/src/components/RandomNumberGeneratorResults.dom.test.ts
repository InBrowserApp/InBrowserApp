import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, ref, watchEffect, type Component } from 'vue'
import RandomNumberGeneratorResults from './RandomNumberGeneratorResults.vue'

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

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    template: '<button data-testid="copy" />',
  },
  RegenerateButton: defineComponent({
    name: 'RegenerateButton',
    emits: ['click'],
    template:
      '<button type="button" v-bind="$attrs" @click="$emit(\'click\')"><slot name="label" /><slot /></button>',
  }),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')

  return {
    ...actual,
    useObjectUrl: (_source: unknown) => {
      const url = ref('blob:mock')
      watchEffect(() => {})
      return url
    },
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NButton: defineComponent({
      name: 'NButton',
      props: {
        tag: {
          type: String,
          default: 'button',
        },
        disabled: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['click'],
      template:
        '<component :is="tag" v-bind="$attrs" :disabled="disabled" @click="$emit(\'click\')"><slot /></component>',
    }),
    NCard: defineComponent({
      name: 'NCard',
      emits: ['click'],
      template: '<div class="n-card" v-bind="$attrs" @click="$emit(\'click\')"><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span class="n-icon" />',
    }),
    NTag: defineComponent({
      name: 'NTag',
      template: '<span class="n-tag"><slot /></span>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

const baseProps = {
  formattedNumbers: [] as string[],
  outputText: '',
  canRoll: false,
  isRolling: false,
  rollingLabel: 'start',
  rollingIcon: {} as Component,
}

describe('RandomNumberGeneratorResults', () => {
  it('shows placeholder and disables actions without results', async () => {
    const wrapper = mount(RandomNumberGeneratorResults, {
      props: baseProps,
    })

    await flushPromises()

    expect(wrapper.text()).toContain('placeholder')
    expect(wrapper.get('[data-testid="download-results"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-testid="enter-fullscreen"]').attributes('disabled')).toBeDefined()
  })

  it('renders a hero number and emits actions', async () => {
    const wrapper = mount(RandomNumberGeneratorResults, {
      props: {
        ...baseProps,
        formattedNumbers: ['7'],
        outputText: '7',
        canRoll: true,
      },
    })

    await flushPromises()

    expect(wrapper.get('[data-testid="hero-number"]').text()).toBe('7')
    expect(wrapper.get('[data-testid="download-results"]').attributes('href')).toBe('blob:mock')

    await wrapper.get('[data-testid="regenerate"]').trigger('click')
    await wrapper.get('[data-testid="results-card"]').trigger('click')
    await wrapper.get('[data-testid="enter-fullscreen"]').trigger('click')

    expect(wrapper.emitted('toggle-rolling')).toHaveLength(1)
    expect(wrapper.emitted('open-fullscreen')).toHaveLength(2)
  })

  it('renders tags for multiple values', () => {
    const wrapper = mount(RandomNumberGeneratorResults, {
      props: {
        ...baseProps,
        formattedNumbers: ['1', '2', '3'],
        outputText: '1\n2\n3',
      },
    })

    expect(wrapper.find('[data-testid="hero-number"]').exists()).toBe(false)
    expect(wrapper.findAll('.n-tag')).toHaveLength(3)
  })
})
