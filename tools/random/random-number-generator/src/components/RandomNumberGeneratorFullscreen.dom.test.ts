import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, type Component } from 'vue'
import RandomNumberGeneratorFullscreen from './RandomNumberGeneratorFullscreen.vue'

vi.mock('@shared/ui/base', () => ({
  RegenerateButton: defineComponent({
    name: 'RegenerateButton',
    emits: ['click'],
    template:
      '<button type="button" v-bind="$attrs" @click="$emit(\'click\')"><slot name="icon" /><slot name="label" /><slot /></button>',
  }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template:
        '<button type="button" v-bind="$attrs" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      props: {
        component: {
          type: Object,
          default: null,
        },
      },
      template: '<span class="n-icon" />',
    }),
    NTag: defineComponent({
      name: 'NTag',
      template: '<span class="n-tag"><slot /></span>',
    }),
    useThemeVars: () => ({
      bodyColor: '#000000',
      textColorBase: '#ffffff',
    }),
  }
})

const baseProps = {
  formattedNumbers: ['42'],
  canRoll: true,
  isRolling: false,
  rollingLabel: 'start',
  rollingIcon: {} as Component,
}

describe('RandomNumberGeneratorFullscreen', () => {
  it('emits close on overlay and exit actions', async () => {
    const wrapper = mount(RandomNumberGeneratorFullscreen, {
      props: baseProps,
    })

    await wrapper.get('[data-testid="fullscreen-overlay"]').trigger('click')
    await wrapper.get('[data-testid="exit-fullscreen"]').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(2)
  })

  it('does not close when clicking content and emits toggle', async () => {
    const wrapper = mount(RandomNumberGeneratorFullscreen, {
      props: baseProps,
    })

    await wrapper.get('.fullscreen-content').trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()

    await wrapper.get('[data-testid="fullscreen-regenerate"]').trigger('click')
    expect(wrapper.emitted('toggle-rolling')).toHaveLength(1)
  })

  it('keeps regenerate enabled while rolling even if cannot roll again', () => {
    const wrapper = mount(RandomNumberGeneratorFullscreen, {
      props: {
        ...baseProps,
        formattedNumbers: ['9', '8'],
        canRoll: false,
        isRolling: true,
      },
    })

    expect(
      wrapper.get('[data-testid="fullscreen-regenerate"]').attributes('disabled'),
    ).toBeUndefined()
    expect(wrapper.findAll('.n-icon')).toHaveLength(2)
  })

  it('renders tag list for multiple values and handles empty values', () => {
    const multiWrapper = mount(RandomNumberGeneratorFullscreen, {
      props: {
        ...baseProps,
        formattedNumbers: ['1', '2', '3'],
        canRoll: false,
      },
    })

    expect(multiWrapper.find('.fullscreen-number').exists()).toBe(false)
    expect(multiWrapper.findAll('.n-tag')).toHaveLength(3)
    expect(
      multiWrapper.get('[data-testid="fullscreen-regenerate"]').attributes('disabled'),
    ).toBeDefined()

    const emptyWrapper = mount(RandomNumberGeneratorFullscreen, {
      props: {
        ...baseProps,
        formattedNumbers: [],
      },
    })

    expect(emptyWrapper.find('.fullscreen-number').exists()).toBe(false)
    expect(emptyWrapper.findAll('.n-tag')).toHaveLength(0)
  })
})
