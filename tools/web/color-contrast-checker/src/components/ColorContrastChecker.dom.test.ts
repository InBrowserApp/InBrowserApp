import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import ColorContrastChecker from './ColorContrastChecker.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const BaseStub = defineComponent({
  inheritAttrs: false,
  template: '<div v-bind="$attrs"><slot /></div>',
})

const InlineStub = defineComponent({
  inheritAttrs: false,
  template: '<span v-bind="$attrs"><slot /></span>',
})

const NButtonStub = defineComponent({
  name: 'NButton',
  inheritAttrs: false,
  emits: ['click'],
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
})

const NColorPickerStub = defineComponent({
  name: 'NColorPicker',
  inheritAttrs: false,
  props: ['value'],
  emits: ['update:value'],
  template:
    '<input v-bind="$attrs" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
})

const NStatisticStub = defineComponent({
  inheritAttrs: false,
  props: ['label', 'value'],
  template:
    '<div v-bind="$attrs"><span class="label">{{ label }}</span><span class="value">{{ value }}</span></div>',
})

const NFormItemStub = defineComponent({
  inheritAttrs: false,
  props: ['label', 'feedback', 'validationStatus'],
  template: '<label v-bind="$attrs"><span>{{ label }}</span><slot /></label>',
})

const stubs = {
  ToolSection: BaseStub,
  ToolSectionHeader: BaseStub,
  NButton: NButtonStub,
  'n-button': NButtonStub,
  NColorPicker: NColorPickerStub,
  'n-color-picker': NColorPickerStub,
  NFlex: BaseStub,
  'n-flex': BaseStub,
  NFormItem: NFormItemStub,
  'n-form-item': NFormItemStub,
  NGi: BaseStub,
  'n-gi': BaseStub,
  NGrid: BaseStub,
  'n-grid': BaseStub,
  NIcon: InlineStub,
  'n-icon': InlineStub,
  NStatistic: NStatisticStub,
  'n-statistic': NStatisticStub,
  NTag: InlineStub,
  'n-tag': InlineStub,
  NText: InlineStub,
  'n-text': InlineStub,
}

describe('ColorContrastChecker', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders ratio and pass/fail tags for valid inputs', () => {
    const wrapper = mount(ColorContrastChecker, { global: { stubs } })

    expect(wrapper.get('[data-testid="ratio-value"]').text()).toContain(':1')
    expect(wrapper.findAll('[data-testid^="status-"]').length).toBe(4)
  })

  it('shows invalid message when inputs are invalid', async () => {
    const wrapper = mount(ColorContrastChecker, { global: { stubs } })

    const vm = wrapper.vm as {
      updateForegroundFromPicker?: (value: string) => void
      updateBackgroundFromPicker?: (value: string) => void
      checks?: unknown[]
    }
    vm.updateForegroundFromPicker?.('not-a-color')
    vm.updateBackgroundFromPicker?.('not-a-color')
    await nextTick()

    expect(vm.checks?.length).toBe(0)

    expect(wrapper.text()).toContain('invalid-input')
    expect(wrapper.findAll('[data-testid^="status-"]').length).toBe(0)
  })

  it('swaps foreground and background values', async () => {
    const wrapper = mount(ColorContrastChecker, { global: { stubs } })

    const vm = wrapper.vm as {
      updateForegroundFromPicker?: (value: string) => void
      updateBackgroundFromPicker?: (value: string) => void
      foregroundInput?: string
      backgroundInput?: string
    }
    vm.updateForegroundFromPicker?.('#000000')
    vm.updateBackgroundFromPicker?.('#ffffff')
    await nextTick()

    await wrapper.get('[data-testid="swap-button"]').trigger('click')
    await nextTick()

    expect(vm.foregroundInput).toBe('#ffffff')
    expect(vm.backgroundInput).toBe('#000000')
  })

  it('marks low-contrast colors as failing', async () => {
    const wrapper = mount(ColorContrastChecker, { global: { stubs } })

    const vm = wrapper.vm as {
      updateForegroundFromPicker?: (value: string) => void
      updateBackgroundFromPicker?: (value: string) => void
    }
    vm.updateForegroundFromPicker?.('#ffffff')
    vm.updateBackgroundFromPicker?.('#ffffff')
    await nextTick()

    expect(wrapper.text()).toContain('fail')
  })

  it('treats empty inputs as unset', async () => {
    const wrapper = mount(ColorContrastChecker, { global: { stubs } })

    const vm = wrapper.vm as {
      updateForegroundFromPicker?: (value: string) => void
      updateBackgroundFromPicker?: (value: string) => void
      foregroundStatus?: unknown
      backgroundStatus?: unknown
    }
    vm.updateForegroundFromPicker?.('')
    vm.updateBackgroundFromPicker?.('')
    await nextTick()

    expect(vm.foregroundStatus).toBeUndefined()
    expect(vm.backgroundStatus).toBeUndefined()
  })

  it('updates input when using color picker', async () => {
    const wrapper = mount(ColorContrastChecker, { global: { stubs } })

    const vm = wrapper.vm as {
      updateForegroundFromPicker?: (value: string) => void
      updateBackgroundFromPicker?: (value: string) => void
      foregroundHex?: string
      backgroundHex?: string
    }
    expect(vm.updateForegroundFromPicker).toBeTypeOf('function')
    expect(vm.updateBackgroundFromPicker).toBeTypeOf('function')
    vm.updateForegroundFromPicker?.('#ff0000')
    vm.updateBackgroundFromPicker?.('#00ff00')
    await nextTick()

    expect(vm.foregroundHex).toBe('#FF0000')
    expect(vm.backgroundHex).toBe('#00FF00')
  })
})
