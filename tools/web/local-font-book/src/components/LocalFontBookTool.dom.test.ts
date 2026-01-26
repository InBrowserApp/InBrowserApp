import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import LocalFontBookTool from './LocalFontBookTool.vue'

type LocalFontData = {
  family: string
  fullName: string
  postscriptName: string
  style: string
}

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, number>) => {
        if (params?.count !== undefined) return `${key} ${params.count}`
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
    props: {
      disabled: { type: Boolean, default: false },
      loading: { type: Boolean, default: false },
    },
    emits: ['click'],
    template:
      '<button v-bind="$attrs" :disabled="disabled" @click="!disabled && $emit(\'click\')"><slot name="icon" /><slot /></button>',
  })

  const NInput = defineComponent({
    inheritAttrs: false,
    props: {
      value: { type: String, default: '' },
    },
    emits: ['update:value'],
    template:
      '<input v-bind="$attrs" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NInputNumber = defineComponent({
    inheritAttrs: false,
    props: {
      value: { type: Number, default: 0 },
    },
    emits: ['update:value'],
    template:
      '<input v-bind="$attrs" type="number" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  const NSlider = defineComponent({
    inheritAttrs: false,
    props: {
      value: { type: Number, default: 0 },
    },
    emits: ['update:value'],
    template:
      '<input v-bind="$attrs" type="range" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  const NSwitch = defineComponent({
    inheritAttrs: false,
    props: {
      value: { type: Boolean, default: false },
    },
    emits: ['update:value'],
    template:
      '<input v-bind="$attrs" type="checkbox" :checked="value" @change="$emit(\'update:value\', $event.target.checked)" />',
  })

  const NSelect = defineComponent({
    inheritAttrs: false,
    props: {
      value: { type: String, default: '' },
      options: { type: Array, default: () => [] },
    },
    emits: ['update:value'],
    template:
      '<select v-bind="$attrs" :value="value" @change="$emit(\'update:value\', $event.target.value)">' +
      '<option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>' +
      '</select>',
  })

  const NCode = defineComponent({
    inheritAttrs: false,
    props: {
      code: { type: String, default: '' },
    },
    template: '<pre v-bind="$attrs">{{ code }}</pre>',
  })

  const NFormItem = defineComponent({
    inheritAttrs: false,
    props: ['label'],
    template: '<label v-bind="$attrs"><span>{{ label }}</span><slot /></label>',
  })

  return {
    NAlert: BaseStub,
    NButton,
    NCard: BaseStub,
    NCode,
    NFlex: BaseStub,
    NFormItem,
    NGi: BaseStub,
    NGrid: BaseStub,
    NIcon: InlineStub,
    NInput,
    NInputNumber,
    NLi: BaseStub,
    NSelect,
    NSlider,
    NSwitch,
    NText: InlineStub,
    NUl: BaseStub,
  }
})

const SectionStub = defineComponent({
  inheritAttrs: false,
  template: '<section v-bind="$attrs"><slot /></section>',
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

const fontFixtures: LocalFontData[] = [
  {
    family: 'Inter',
    fullName: 'Inter Regular',
    postscriptName: 'Inter-Regular',
    style: 'Regular',
  },
  {
    family: 'Inter',
    fullName: 'Inter Italic',
    postscriptName: 'Inter-Italic',
    style: 'Italic',
  },
  {
    family: 'Roboto',
    fullName: 'Roboto Bold',
    postscriptName: 'Roboto-Bold',
    style: 'Bold',
  },
]

const originalQueryLocalFonts = Object.getOwnPropertyDescriptor(window, 'queryLocalFonts')
const originalPermissions = Object.getOwnPropertyDescriptor(navigator, 'permissions')

function setQueryLocalFonts(value: unknown) {
  Object.defineProperty(window, 'queryLocalFonts', {
    value,
    configurable: true,
    writable: true,
  })
}

function setPermissionsQuery(implementation: () => Promise<{ state: PermissionState }>) {
  Object.defineProperty(navigator, 'permissions', {
    value: {
      query: implementation,
    },
    configurable: true,
  })
}

async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('LocalFontBookTool', () => {
  beforeEach(() => {
    localStorage.clear()
    setPermissionsQuery(async () => ({ state: 'prompt' }))
  })

  afterEach(() => {
    if (originalQueryLocalFonts) {
      Object.defineProperty(window, 'queryLocalFonts', originalQueryLocalFonts)
    } else {
      delete (window as { queryLocalFonts?: unknown }).queryLocalFonts
    }

    if (originalPermissions) {
      Object.defineProperty(navigator, 'permissions', originalPermissions)
    } else {
      delete (navigator as { permissions?: unknown }).permissions
    }
  })

  it('shows unsupported message when Local Font Access is missing', () => {
    delete (window as { queryLocalFonts?: unknown }).queryLocalFonts

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })

    expect(wrapper.text()).toContain('status-unsupported')
    const vm = wrapper.vm as unknown as { loadFonts?: () => Promise<void> }
    expect(vm.loadFonts).toBeTypeOf('function')
    return vm.loadFonts?.()
  })

  it('loads fonts and applies filters', async () => {
    setQueryLocalFonts(vi.fn().mockResolvedValue(fontFixtures))
    setPermissionsQuery(async () => ({ state: 'prompt' }))

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    expect((wrapper.vm as unknown as { previewStyle: unknown }).previewStyle).toBeDefined()

    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect((window as { queryLocalFonts?: unknown }).queryLocalFonts).toBeDefined()
    expect(wrapper.text()).toContain('Inter Regular')
    expect((wrapper.vm as unknown as { statusType: string }).statusType).toBe('info')

    const vm = wrapper.vm as unknown as {
      searchQuery: string
      filterStyle: string
      sortBy: string
      groupByFamily: boolean
    }

    vm.searchQuery = 'Roboto'
    await nextTick()
    expect(wrapper.text()).toContain('Roboto Bold')

    vm.searchQuery = ''
    vm.filterStyle = 'all'
    vm.sortBy = 'name'
    await nextTick()
    expect(wrapper.text()).toContain('Inter Regular')

    vm.sortBy = 'style'
    vm.groupByFamily = false
    await nextTick()

    await wrapper.get('[data-testid="font-Inter-Italic"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[data-testid="css-snippet"]').text()).toContain('font-style: italic')
  })

  it('sorts when metadata is missing', async () => {
    const fontsWithMissing = [
      {
        family: 'Alpha',
        fullName: 'Alpha Regular',
        postscriptName: 'Alpha-Regular',
        style: 'Regular',
      },
      {
        family: 'Beta',
        fullName: undefined,
        postscriptName: 'Beta-Regular',
        style: undefined,
      },
    ] as unknown as LocalFontData[]

    setQueryLocalFonts(vi.fn().mockResolvedValue(fontsWithMissing))

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    const vm = wrapper.vm as unknown as { sortBy: string }
    vm.sortBy = 'name'
    await nextTick()
    vm.sortBy = 'style'
    await nextTick()

    expect(wrapper.text()).toContain('Alpha Regular')
  })

  it('falls back to generated ids when postscriptName is missing', async () => {
    const fontsWithMissingIds: LocalFontData[] = [
      {
        family: 'Nimbus',
        fullName: 'Nimbus Sans',
        postscriptName: '',
        style: 'Regular',
      },
      {
        family: '',
        fullName: '',
        postscriptName: '',
        style: '',
      },
    ]

    setQueryLocalFonts(vi.fn().mockResolvedValue(fontsWithMissingIds))

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.findAll('.font-card').length).toBe(2)
    expect(wrapper.text()).toContain('Nimbus Sans')
  })

  it('uses preview fallbacks when font data is incomplete', async () => {
    const fontsWithFallbacks: LocalFontData[] = [
      {
        family: 'Alpha',
        fullName: 'Alpha Regular',
        postscriptName: 'Alpha-Regular',
        style: 'Regular',
      },
      {
        family: '',
        fullName: 'Fallback Name',
        postscriptName: '',
        style: 'Regular',
      },
      {
        family: '',
        fullName: '',
        postscriptName: 'PS-Fallback',
        style: 'Regular',
      },
      {
        family: '',
        fullName: '',
        postscriptName: '',
        style: '',
      },
    ]

    setQueryLocalFonts(vi.fn().mockResolvedValue(fontsWithFallbacks))

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    const vm = wrapper.vm as unknown as {
      normalizedFonts: Array<{ id: string }>
      activeFontId: string
      previewStyle: Record<string, string>
      cssSnippet: string
    }

    vm.activeFontId = vm.normalizedFonts[1].id
    await nextTick()
    expect(vm.previewStyle.fontFamily).toBe('Fallback Name')

    vm.activeFontId = vm.normalizedFonts[2].id
    await nextTick()
    expect(vm.previewStyle.fontFamily).toBe('PS-Fallback')

    vm.activeFontId = vm.normalizedFonts[3].id
    await nextTick()
    expect(Object.keys(vm.previewStyle).length).toBe(0)
    expect(vm.cssSnippet).toBe('')
  })

  it('updates preview controls via v-model bindings', async () => {
    setQueryLocalFonts(vi.fn().mockResolvedValue(fontFixtures))

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="search-input"]').setValue('Roboto')
    await wrapper.get('[data-testid="style-filter"]').setValue('italic')
    await wrapper.get('[data-testid="sort-by"]').setValue('name')
    await wrapper.get('[data-testid="group-toggle"]').setValue(false)

    await wrapper.get('[data-testid="sample-text"]').setValue('')
    const rangeInputs = wrapper.findAll('input[type="range"]')
    const [sizeRange, lineRange] = rangeInputs
    if (!sizeRange || !lineRange) {
      throw new Error('Missing range inputs')
    }
    await sizeRange.setValue('48')
    await lineRange.setValue('1.8')
    const numberInputs = wrapper.findAll('input[type="number"]')
    const [sizeNumber, lineNumber] = numberInputs
    if (!sizeNumber || !lineNumber) {
      throw new Error('Missing number inputs')
    }
    await sizeNumber.setValue('48')
    await lineNumber.setValue('1.8')
    await wrapper.get('[data-testid="background-toggle"]').setValue(true)

    expect(wrapper.get('[data-testid="preview-text"]').text()).toContain('preview-fallback')
  })

  it('keeps the stored active font when it exists', async () => {
    localStorage.setItem('tools:local-font-book:active-font', 'Inter-Italic')
    setQueryLocalFonts(vi.fn().mockResolvedValue(fontFixtures))

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    const vm = wrapper.vm as unknown as { activeFontId: string }
    expect(vm.activeFontId).toBe('Inter-Italic')
  })

  it('clears the active font when no fonts are returned', async () => {
    setQueryLocalFonts(vi.fn().mockResolvedValue([]))

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    const vm = wrapper.vm as unknown as { activeFontId: string }
    expect(vm.activeFontId).toBe('')
  })

  it('returns early when the permissions API is unavailable', () => {
    delete (navigator as { permissions?: unknown }).permissions

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    const vm = wrapper.vm as unknown as { permissionState: string }
    expect(vm.permissionState).toBe('unknown')
  })

  it('returns early when permissions query is missing', () => {
    Object.defineProperty(navigator, 'permissions', {
      value: {},
      configurable: true,
    })

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    const vm = wrapper.vm as unknown as { permissionState: string }
    expect(vm.permissionState).toBe('unknown')
  })

  it('handles NotAllowedError', async () => {
    setQueryLocalFonts(vi.fn().mockRejectedValue({ name: 'NotAllowedError', message: 'Denied' }))

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('status-denied')
  })

  it('handles SecurityError when access is blocked', async () => {
    setQueryLocalFonts(vi.fn().mockRejectedValue({ name: 'SecurityError', message: 'Blocked' }))

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('status-blocked')
  })

  it('handles unknown errors', async () => {
    setQueryLocalFonts(vi.fn().mockRejectedValue(new Error('Boom')))

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('status-error')
  })

  it('handles missing queryLocalFonts function', async () => {
    setQueryLocalFonts(undefined)

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('status-blocked')
  })

  it('sets permission state to unknown on permission errors', async () => {
    setQueryLocalFonts(vi.fn().mockResolvedValue(fontFixtures))
    setPermissionsQuery(async () => {
      throw new Error('No permissions')
    })

    const wrapper = mount(LocalFontBookTool, { global: { stubs } })
    await wrapper.get('[data-testid="load-fonts"]').trigger('click')
    await flushPromises()
    await nextTick()

    const vm = wrapper.vm as unknown as { permissionState: string }
    expect(vm.permissionState).toBe('unknown')
  })
})
