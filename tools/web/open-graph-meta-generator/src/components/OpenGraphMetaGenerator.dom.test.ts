import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useStorage: (_key: string, initialValue: unknown) =>
      ref(JSON.parse(JSON.stringify(initialValue))),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const BaseStub = defineComponent({
    inheritAttrs: false,
    template: '<div v-bind="$attrs"><slot /></div>',
  })

  const ButtonStub = defineComponent({
    inheritAttrs: false,
    emits: ['click'],
    template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  })

  const InputStub = defineComponent({
    inheritAttrs: false,
    props: ['value'],
    emits: ['update:value'],
    template:
      '<input v-bind="$attrs" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const SelectStub = defineComponent({
    inheritAttrs: false,
    props: ['value', 'options'],
    emits: ['update:value'],
    template:
      '<select :data-testid="$attrs[\'data-testid\']" :value="value" @change="$emit(\'update:value\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
  })

  const SwitchStub = defineComponent({
    inheritAttrs: false,
    props: ['value'],
    emits: ['update:value'],
    template:
      '<input v-bind="$attrs" type="checkbox" :checked="value" @change="$emit(\'update:value\', $event.target.checked)" />',
  })

  return {
    NAlert: BaseStub,
    NButton: ButtonStub,
    NFlex: BaseStub,
    NFormItemGi: defineComponent({
      inheritAttrs: false,
      props: ['label'],
      template: '<label v-bind="$attrs"><span>{{ label }}</span><slot /></label>',
    }),
    NGi: BaseStub,
    NGrid: BaseStub,
    NInput: InputStub,
    NSelect: SelectStub,
    NSwitch: SwitchStub,
    NText: defineComponent({
      inheritAttrs: false,
      template: '<span v-bind="$attrs"><slot /></span>',
    }),
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  const BaseStub = defineComponent({
    inheritAttrs: false,
    template: '<div v-bind="$attrs"><slot /></div>',
  })

  return {
    ToolSection: BaseStub,
    ToolSectionHeader: BaseStub,
  }
})

vi.mock('./OgMetaPreviewSection.vue', () => ({
  default: {
    props: ['preview'],
    template:
      '<div data-testid="preview-stub" :data-title="preview.title" :data-domain="preview.domain" />',
  },
}))

vi.mock('./OgMetaOutputSection.vue', () => ({
  default: {
    props: ['htmlContent'],
    template: '<div data-testid="output-stub" :data-html="htmlContent" />',
  },
}))

import OpenGraphMetaGenerator from './OpenGraphMetaGenerator.vue'

describe('OpenGraphMetaGenerator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('applies presets and updates derived preview/output props', async () => {
    const wrapper = mount(OpenGraphMetaGenerator)

    await wrapper.get('[data-testid="preset-article"]').trigger('click')
    await wrapper.vm.$nextTick()

    const preview = wrapper.get('[data-testid="preview-stub"]')
    const output = wrapper.get('[data-testid="output-stub"]')

    expect(preview.attributes('data-title')).toContain('How to Ship Better Social Share Cards')
    expect(output.attributes('data-html')).toContain('article:published_time')
  })

  it('shows diagnostics for the minimal preset and toggles advanced fields', async () => {
    const wrapper = mount(OpenGraphMetaGenerator)

    await wrapper.get('[data-testid="preset-minimal"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('[data-testid^="diagnostic-"]').length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Add a page title.')

    await wrapper.get('[data-testid="toggle-advanced"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Published time')
    expect(wrapper.text()).toContain('Modified time')
  })

  it('reveals twitter override inputs and recomputes output when inherit mode is disabled', async () => {
    const wrapper = mount(OpenGraphMetaGenerator)

    await wrapper.get('[data-testid="twitter-inherit"]').setValue(false)
    await wrapper.vm.$nextTick()

    await wrapper.get('[data-testid="basic-description"]').setValue('Base description')
    await wrapper.get('[data-testid="og-image-alt"]').setValue('Base image alt')

    await wrapper.get('[data-testid="twitter-title"]').setValue('Custom Twitter Title')
    await wrapper.get('[data-testid="twitter-description"]').setValue('Custom Twitter Description')
    await wrapper
      .get('[data-testid="twitter-image-url"]')
      .setValue('https://example.com/custom-twitter.png')
    await wrapper.get('[data-testid="twitter-image-alt"]').setValue('Custom Twitter Alt')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Twitter title')
    expect(wrapper.text()).toContain('Twitter description')
    expect(wrapper.text()).toContain('Twitter image URL')
    expect(wrapper.text()).toContain('Twitter image alt')

    const preview = wrapper.get('[data-testid="preview-stub"]')
    const output = wrapper.get('[data-testid="output-stub"]')

    expect(preview.attributes('data-title')).toContain('Custom Twitter Title')
    expect(output.attributes('data-html')).toContain('twitter:title')
    expect(output.attributes('data-html')).toContain('Custom Twitter Description')
  })

  it('updates the major form bindings through rendered controls', async () => {
    const wrapper = mount(OpenGraphMetaGenerator)

    await wrapper.get('[data-testid="basic-title"]').setValue('New title')
    await wrapper.get('[data-testid="basic-description"]').setValue('New description')
    await wrapper
      .get('[data-testid="basic-canonical-url"]')
      .setValue('https://example.com/new-page')
    await wrapper.get('[data-testid="basic-site-name"]').setValue('Example Site')
    await wrapper.get('[data-testid="basic-locale"]').setValue('ja_JP')
    await wrapper.get('[data-testid="og-type"]').setValue('article')
    await wrapper.get('[data-testid="og-url"]').setValue('https://example.com/og-page')
    await wrapper.get('[data-testid="og-image-url"]').setValue('https://example.com/og-image.png')
    await wrapper.get('[data-testid="og-image-alt"]').setValue('OG image alt')
    await wrapper.get('[data-testid="og-image-width"]').setValue('800')
    await wrapper.get('[data-testid="og-image-height"]').setValue('420')
    await wrapper.get('[data-testid="twitter-card"]').setValue('summary')
    await wrapper.get('[data-testid="twitter-site"]').setValue('@example')
    await wrapper.get('[data-testid="twitter-creator"]').setValue('@creator')
    await wrapper.get('[data-testid="twitter-inherit"]').setValue(false)
    await wrapper.vm.$nextTick()

    await wrapper.get('[data-testid="twitter-title"]').setValue('Twitter only title')
    await wrapper.get('[data-testid="twitter-description"]').setValue('Twitter only description')
    await wrapper
      .get('[data-testid="twitter-image-url"]')
      .setValue('https://example.com/twitter.png')
    await wrapper.get('[data-testid="twitter-image-alt"]').setValue('Twitter image alt')
    await wrapper.get('[data-testid="toggle-advanced"]').trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.get('[data-testid="article-published-time"]').setValue('2026-03-01T09:00:00Z')
    await wrapper.get('[data-testid="article-modified-time"]').setValue('2026-03-02T09:00:00Z')
    await wrapper.get('[data-testid="article-author"]').setValue('Taylor')
    await wrapper.get('[data-testid="article-section"]').setValue('Guides')
    await wrapper.get('[data-testid="article-tags"]').setValue('social, cards')
    await wrapper.vm.$nextTick()

    const output = wrapper.get('[data-testid="output-stub"]').attributes('data-html')
    expect(output).toContain('og:locale')
    expect(output).toContain('twitter:creator')
    expect(output).toContain('article:section')
    expect(output).toContain('Twitter only title')
  })
})
