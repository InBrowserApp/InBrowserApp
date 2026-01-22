import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import CssBoxShadowGenerator from './CssBoxShadowGenerator.vue'
import { buildBoxShadow, type ShadowLayer } from '../utils/shadow'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, number>) => {
        if (params?.index) return `${key} ${params.index}`
        return key
      },
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const BaseStub = defineComponent({
    inheritAttrs: false,
    template: '<div v-bind="$attrs"><slot /></div>',
  })

  const InlineStub = defineComponent({
    inheritAttrs: false,
    template: '<span v-bind="$attrs"><slot /></span>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    inheritAttrs: false,
    emits: ['click'],
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    template:
      '<button v-bind="$attrs" :disabled="disabled" @click="!disabled && $emit(\'click\')"><slot name="icon" /><slot /></button>',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    inheritAttrs: false,
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template:
      '<input v-bind="$attrs" type="number" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  const NSlider = defineComponent({
    name: 'NSlider',
    inheritAttrs: false,
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template:
      '<input v-bind="$attrs" type="range" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  const NSwitch = defineComponent({
    name: 'NSwitch',
    inheritAttrs: false,
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    template:
      '<input v-bind="$attrs" type="checkbox" :checked="value" @change="$emit(\'update:value\', $event.target.checked)" />',
  })

  const NColorPicker = defineComponent({
    name: 'NColorPicker',
    inheritAttrs: false,
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template:
      '<input v-bind="$attrs" type="text" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NCode = defineComponent({
    inheritAttrs: false,
    props: {
      code: {
        type: String,
        default: '',
      },
    },
    template: '<pre v-bind="$attrs">{{ code }}</pre>',
  })

  const NFormItem = defineComponent({
    inheritAttrs: false,
    props: ['label'],
    template: '<label v-bind="$attrs"><span>{{ label }}</span><slot /></label>',
  })

  return {
    NButton,
    NCard: BaseStub,
    NCode,
    NColorPicker,
    NFlex: BaseStub,
    NFormItem,
    NGi: BaseStub,
    NGrid: BaseStub,
    NIcon: InlineStub,
    NInputNumber,
    NSlider,
    NSwitch,
    NTag: InlineStub,
    NText: InlineStub,
  }
})

const SectionStub = defineComponent({
  inheritAttrs: false,
  template: '<div v-bind="$attrs"><slot /></div>',
})

const CopyToClipboardButtonStub = defineComponent({
  props: ['content'],
  template: '<button type="button">copy</button>',
})

const stubs = {
  ToolSection: SectionStub,
  ToolSectionHeader: SectionStub,
  CopyToClipboardButton: CopyToClipboardButtonStub,
}

describe('CssBoxShadowGenerator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the default output', () => {
    const wrapper = mount(CssBoxShadowGenerator, { global: { stubs } })
    const vm = wrapper.vm as unknown as { layers: ShadowLayer[] }
    const output = wrapper.get('[data-testid="shadow-output"]').text()

    expect(output).toContain('box-shadow:')
    expect(output).toContain(buildBoxShadow(vm.layers))
  })

  it('adds and removes layers', async () => {
    const wrapper = mount(CssBoxShadowGenerator, { global: { stubs } })
    const vm = wrapper.vm as unknown as { layers: ShadowLayer[]; removeLayer: (id: string) => void }

    await wrapper.get('[data-testid="add-layer"]').trigger('click')
    await nextTick()

    expect(vm.layers.length).toBe(2)

    await wrapper.get('[data-testid="layer-remove-1"]').trigger('click')
    await nextTick()

    expect(vm.layers.length).toBe(1)

    vm.removeLayer(vm.layers[0]!.id)
    await nextTick()

    expect(vm.layers.length).toBe(1)
  })

  it('moves layers within the list', async () => {
    const wrapper = mount(CssBoxShadowGenerator, { global: { stubs } })
    const vm = wrapper.vm as unknown as { layers: ShadowLayer[] }

    await wrapper.get('[data-testid="add-layer"]').trigger('click')
    await nextTick()

    const firstId = vm.layers[0]!.id
    const secondId = vm.layers[1]!.id

    await wrapper.get('[data-testid="layer-up-1"]').trigger('click')
    await nextTick()

    expect(vm.layers[0]!.id).toBe(secondId)

    await wrapper.get('[data-testid="layer-up-0"]').trigger('click')
    await nextTick()

    expect(vm.layers[0]!.id).toBe(secondId)

    await wrapper.get('[data-testid="layer-down-0"]').trigger('click')
    await nextTick()

    expect(vm.layers[0]!.id).toBe(firstId)
  })

  it('updates layer values from controls', async () => {
    const wrapper = mount(CssBoxShadowGenerator, { global: { stubs } })
    const vm = wrapper.vm as unknown as { layers: ShadowLayer[] }

    await wrapper.get('[data-testid="offset-x-slider"]').setValue('12')
    await wrapper.get('[data-testid="offset-x-input"]').setValue('16')
    await wrapper.get('[data-testid="offset-y-slider"]').setValue('8')
    await wrapper.get('[data-testid="offset-y-input"]').setValue('10')
    await wrapper.get('[data-testid="blur-slider"]').setValue('24')
    await wrapper.get('[data-testid="blur-input"]').setValue('32')
    await wrapper.get('[data-testid="spread-slider"]').setValue('6')
    await wrapper.get('[data-testid="spread-input"]').setValue('8')
    await wrapper.get('[data-testid="color-picker"]').setValue('#ff000080')
    await wrapper.get('[data-testid="inset-switch"]').setValue(true)
    await wrapper.get('[data-testid="background-switch"]').setValue(true)
    await nextTick()

    const output = wrapper.get('[data-testid="shadow-output"]').text()
    expect(output).toContain(buildBoxShadow(vm.layers))
    expect(output).toContain('inset')
    expect(wrapper.find('.preview-surface').classes()).toContain('is-dark')
  })

  it('sets the active layer from the list', async () => {
    const wrapper = mount(CssBoxShadowGenerator, { global: { stubs } })
    const vm = wrapper.vm as unknown as { layers: ShadowLayer[]; activeLayerId: string }

    await wrapper.get('[data-testid="add-layer"]').trigger('click')
    await nextTick()

    const secondId = vm.layers[1]!.id
    await wrapper.get('[data-testid="layer-1"]').trigger('click')
    await nextTick()

    expect(vm.activeLayerId).toBe(secondId)
  })

  it('handles empty storage and missing ids', async () => {
    localStorage.setItem(
      'tools:css-box-shadow-generator:layers',
      JSON.stringify([
        {
          id: null,
          offsetX: 0,
          offsetY: 0,
          blur: 0,
          spread: 0,
          color: '#00000033',
          inset: false,
        },
      ]),
    )

    const wrapper = mount(CssBoxShadowGenerator, { global: { stubs } })
    const vm = wrapper.vm as unknown as { activeLayerId: string; layers: ShadowLayer[] }
    await nextTick()

    expect(vm.layers.length).toBe(1)
    expect(vm.activeLayerId).toBe('')
  })

  it('guards invalid move operations', () => {
    const wrapper = mount(CssBoxShadowGenerator, { global: { stubs } })
    const vm = wrapper.vm as unknown as {
      layers: ShadowLayer[]
      moveLayer: (id: string, direction: number) => void
    }

    const firstId = vm.layers[0]!.id
    vm.moveLayer('missing', 1)
    vm.moveLayer(firstId, -1)
  })

  it('repairs missing active layers', async () => {
    const wrapper = mount(CssBoxShadowGenerator, { global: { stubs } })
    const vm = wrapper.vm as unknown as { layers: ShadowLayer[]; activeLayerId: string }

    vm.activeLayerId = 'missing'
    vm.layers = []
    await nextTick()

    expect(vm.layers.length).toBe(1)
    expect(vm.activeLayerId).toBe(vm.layers[0]!.id)
  })
})
