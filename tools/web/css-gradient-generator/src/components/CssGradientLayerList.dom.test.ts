import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CssGradientLayerList from './CssGradientLayerList.vue'
import { createLayer } from '../utils/gradient'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    template:
      '<button v-bind="$attrs" :disabled="disabled" @click="$emit(\'click\', $event)"><slot /></button>',
  })

  return { NButton }
})

describe('CssGradientLayerList', () => {
  it('emits actions for layers', async () => {
    const firstLayer = createLayer()
    const secondLayer = createLayer()

    const wrapper = mount(CssGradientLayerList, {
      props: {
        layers: [firstLayer, secondLayer],
        activeLayerId: firstLayer.id,
      },
    })

    await wrapper.get(`[data-testid="layer-${secondLayer.id}"]`).trigger('click')
    expect(wrapper.emitted('set-active')?.[0]).toEqual([secondLayer.id])

    await wrapper.get(`[data-testid="layer-duplicate-${firstLayer.id}"]`).trigger('click')
    expect(wrapper.emitted('duplicate-layer')?.[0]).toEqual([firstLayer.id])

    await wrapper.get(`[data-testid="layer-up-${secondLayer.id}"]`).trigger('click')
    expect(wrapper.emitted('move-layer')?.[0]).toEqual([1, -1])

    await wrapper.get(`[data-testid="layer-down-${firstLayer.id}"]`).trigger('click')
    expect(wrapper.emitted('move-layer')?.[1]).toEqual([0, 1])

    await wrapper.get(`[data-testid="layer-delete-${firstLayer.id}"]`).trigger('click')
    expect(wrapper.emitted('remove-layer')?.[0]).toEqual([firstLayer.id])
  })

  it('disables controls when only one layer exists', () => {
    const layer = createLayer()
    const wrapper = mount(CssGradientLayerList, {
      props: {
        layers: [layer],
        activeLayerId: layer.id,
      },
    })

    expect(wrapper.get(`[data-testid="layer-up-${layer.id}"]`).attributes('disabled')).toBeDefined()
    expect(
      wrapper.get(`[data-testid="layer-down-${layer.id}"]`).attributes('disabled'),
    ).toBeDefined()
    expect(
      wrapper.get(`[data-testid="layer-delete-${layer.id}"]`).attributes('disabled'),
    ).toBeDefined()
  })
})
