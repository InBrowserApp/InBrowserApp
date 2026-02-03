import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, type Component } from 'vue'
import RandomNumberGeneratorFullscreen from './RandomNumberGeneratorFullscreen.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/base', () => ({
  RegenerateButton: defineComponent({
    name: 'RegenerateButton',
    emits: ['click'],
    template:
      '<button type="button" v-bind="$attrs" @click="$emit(\'click\')"><slot name="label" /><slot /></button>',
  }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template: '<button type="button" v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
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

  it('emits toggle when regenerate is clicked', async () => {
    const wrapper = mount(RandomNumberGeneratorFullscreen, {
      props: baseProps,
    })

    await wrapper.get('[data-testid="fullscreen-regenerate"]').trigger('click')

    expect(wrapper.emitted('toggle-rolling')).toHaveLength(1)
  })
})
