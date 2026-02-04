import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CssGradientLayersPanel from './CssGradientLayersPanel.vue'
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

  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template:
      '<button v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /><slot name="icon" /></button>',
  })

  return {
    NAlert: makeStub('NAlert'),
    NButton,
    NCard: makeStub('NCard'),
    NIcon: makeStub('NIcon'),
  }
})

const CssGradientLayerListStub = defineComponent({
  name: 'CssGradientLayerList',
  emits: ['set-active', 'duplicate-layer', 'move-layer', 'remove-layer'],
  template: '<div />',
})

describe('CssGradientLayersPanel', () => {
  it('emits layer actions and shows errors', async () => {
    const layer = createLayer()
    const wrapper = mount(CssGradientLayersPanel, {
      props: {
        layers: [layer],
        activeLayerId: layer.id,
        showError: true,
      },
      global: {
        stubs: {
          CssGradientLayerList: CssGradientLayerListStub,
        },
      },
    })

    expect(wrapper.find('[data-testid="layer-error"]').exists()).toBe(true)

    await wrapper.get('[data-testid="add-layer"]').trigger('click')
    expect(wrapper.emitted('add-layer')).toBeTruthy()

    const list = wrapper.findComponent(CssGradientLayerListStub)
    list.vm.$emit('set-active', layer.id)
    list.vm.$emit('duplicate-layer', layer.id)
    list.vm.$emit('move-layer', 0, 1)
    list.vm.$emit('remove-layer', layer.id)

    expect(wrapper.emitted('set-active')?.[0]).toEqual([layer.id])
    expect(wrapper.emitted('duplicate-layer')?.[0]).toEqual([layer.id])
    expect(wrapper.emitted('move-layer')?.[0]).toEqual([0, 1])
    expect(wrapper.emitted('remove-layer')?.[0]).toEqual([layer.id])
  })
})
