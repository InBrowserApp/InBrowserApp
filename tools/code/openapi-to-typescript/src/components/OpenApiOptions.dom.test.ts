import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h2><slot /></h2>',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      props: {
        label: {
          type: String,
          default: '',
        },
      },
      template: '<div><span>{{ label }}</span><slot /></div>',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NSwitch: defineComponent({
      name: 'NSwitch',
      props: {
        value: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['update:value'],
      template: '<button type="button" @click="$emit(\'update:value\', !value)">toggle</button>',
    }),
  }
})

import OpenApiOptions from './OpenApiOptions.vue'

describe('OpenApiOptions', () => {
  it('emits updates from all switches and renders labels', async () => {
    const wrapper = mount(OpenApiOptions, {
      props: {
        additionalProperties: false,
        defaultNonNullable: false,
        propertiesRequiredByDefault: false,
        exportType: false,
        enumOutput: false,
        pathParamsAsTypes: false,
        rootTypes: false,
        makePathsEnum: false,
        generatePathParams: false,
        immutable: false,
        excludeDeprecated: false,
        includeHeader: false,
      },
    })

    const switches = wrapper.findAllComponents({ name: 'NSwitch' })
    expect(switches).toHaveLength(12)

    for (const switchWrapper of switches) {
      await switchWrapper.trigger('click')
    }

    const modelKeys = [
      'additionalProperties',
      'defaultNonNullable',
      'propertiesRequiredByDefault',
      'exportType',
      'enumOutput',
      'pathParamsAsTypes',
      'rootTypes',
      'makePathsEnum',
      'generatePathParams',
      'immutable',
      'excludeDeprecated',
      'includeHeader',
    ]

    for (const key of modelKeys) {
      expect(wrapper.emitted(`update:${key}`)?.[0]).toEqual([true])
    }

    expect(wrapper.text()).toContain('Allow additional properties')
    expect(wrapper.text()).toContain('Generate path params helpers')
    expect(wrapper.text()).toContain('Include header comment')
  })
})
