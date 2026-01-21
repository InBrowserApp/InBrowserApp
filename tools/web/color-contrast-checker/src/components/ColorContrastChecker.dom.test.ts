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

const NInputStub = defineComponent({
  name: 'NInput',
  inheritAttrs: false,
  props: ['value'],
  emits: ['update:value'],
  template:
    '<input v-bind="$attrs" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
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
  NInput: NInputStub,
  'n-input': NInputStub,
  NStatistic: NStatisticStub,
  'n-statistic': NStatisticStub,
  NTag: InlineStub,
  'n-tag': InlineStub,
  NText: InlineStub,
  'n-text': InlineStub,
}

function resolveInput(wrapper: ReturnType<typeof mount>, testId: string) {
  const target = wrapper.get(`[data-testid="${testId}"]`)
  if ((target.element as HTMLElement).tagName === 'INPUT') return target
  const inner = target.find('input')
  return inner.exists() ? inner : target
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

    await resolveInput(wrapper, 'foreground-input').setValue('not-a-color')
    await resolveInput(wrapper, 'background-input').setValue('not-a-color')

    const vm = wrapper.vm as { checks?: unknown[] }
    expect(vm.checks?.length).toBe(0)

    expect(wrapper.text()).toContain('invalid-input')
    expect(wrapper.findAll('[data-testid^="status-"]').length).toBe(0)
  })

  it('swaps foreground and background values', async () => {
    const wrapper = mount(ColorContrastChecker, { global: { stubs } })

    const foreground = resolveInput(wrapper, 'foreground-input')
    const background = resolveInput(wrapper, 'background-input')

    await foreground.setValue('#000000')
    await background.setValue('#ffffff')

    await wrapper.get('[data-testid="swap-button"]').trigger('click')

    expect((foreground.element as HTMLInputElement).value).toBe('#ffffff')
    expect((background.element as HTMLInputElement).value).toBe('#000000')
  })

  it('marks low-contrast colors as failing', async () => {
    const wrapper = mount(ColorContrastChecker, { global: { stubs } })

    await resolveInput(wrapper, 'foreground-input').setValue('#ffffff')
    await resolveInput(wrapper, 'background-input').setValue('#ffffff')

    expect(wrapper.text()).toContain('fail')
  })

  it('treats empty inputs as unset', async () => {
    const wrapper = mount(ColorContrastChecker, { global: { stubs } })

    await resolveInput(wrapper, 'foreground-input').setValue('')
    await resolveInput(wrapper, 'background-input').setValue('')

    const vm = wrapper.vm as { foregroundStatus?: unknown; backgroundStatus?: unknown }
    expect(vm.foregroundStatus).toBeUndefined()
    expect(vm.backgroundStatus).toBeUndefined()
  })

  it('updates input when using color picker', async () => {
    const wrapper = mount(ColorContrastChecker, { global: { stubs } })

    const vm = wrapper.vm as {
      updateForegroundFromPicker?: (value: string) => void
      updateBackgroundFromPicker?: (value: string) => void
    }
    expect(vm.updateForegroundFromPicker).toBeTypeOf('function')
    expect(vm.updateBackgroundFromPicker).toBeTypeOf('function')
    vm.updateForegroundFromPicker?.('#ff0000')
    vm.updateBackgroundFromPicker?.('#00ff00')
    await nextTick()

    expect((resolveInput(wrapper, 'foreground-input').element as HTMLInputElement).value).toBe(
      '#ff0000',
    )
    expect((resolveInput(wrapper, 'background-input').element as HTMLInputElement).value).toBe(
      '#00ff00',
    )
  })
})
