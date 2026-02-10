import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ConversionOptions from './ConversionOptions.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const wrapper = (name: string) =>
    defineComponent({
      name,
      template: `<div class="${name.toLowerCase()}"><slot /></div>`,
    })

  return {
    NCollapseTransition: defineComponent({
      name: 'NCollapseTransition',
      props: {
        show: {
          type: Boolean,
          default: false,
        },
      },
      template: '<div class="n-collapse"><slot /></div>',
    }),
    NGrid: wrapper('NGrid'),
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      props: {
        label: {
          type: String,
          default: '',
        },
      },
      template: '<label>{{ label }}<slot /></label>',
    }),
    NFlex: wrapper('NFlex'),
    NText: wrapper('NText'),
    NIcon: wrapper('NIcon'),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: {
        value: {
          type: Number,
          default: null,
        },
      },
      emits: ['update:value'],
      template: '<input class="n-input-number" :value="value" />',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: {
        value: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template: '<button class="n-select"><slot /></button>',
    }),
    NButton: defineComponent({
      name: 'NButton',
      props: {
        disabled: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['click'],
      template:
        '<button class="n-button" :disabled="disabled" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
    }),
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h3><slot /></h3>',
    }),
  }
})

const baseProps = {
  title: 'Options',
  scaleLabel: 'Scale',
  scaleHint: 'Scale hint',
  speedLabel: 'Speed',
  speedHint: 'Speed hint',
  loopLabel: 'Loop',
  loopHint: 'Loop hint',
  loopCountLabel: 'Loop count',
  loopInheritLabel: 'Inherit',
  loopInfiniteLabel: 'Infinite',
  loopCustomLabel: 'Custom',
  convertLabel: 'Convert',
  convertingLabel: 'Converting...',
  minScale: 10,
  maxScale: 300,
  minSpeed: 0.2,
  maxSpeed: 4,
  isConverting: false,
  canConvert: true,
  scale: 100,
  speed: 1,
  loopMode: 'inherit' as const,
  loopCount: null as number | null,
}

function mountOptions(props = {}) {
  return mount(ConversionOptions, {
    props: {
      ...baseProps,
      ...props,
    },
  })
}

describe('ConversionOptions', () => {
  it('emits non-null updates for scale, speed, loop mode, and loop count', async () => {
    const wrapper = mountOptions({ loopMode: 'inherit', loopCount: 2 })

    const numberInputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    const scaleInput = numberInputs[0]
    const speedInput = numberInputs[1]
    const loopCountInput = numberInputs[2]
    if (!scaleInput || !speedInput || !loopCountInput) {
      throw new Error('Expected scale, speed, and loop-count inputs')
    }

    await scaleInput.vm.$emit('update:value', null)
    await scaleInput.vm.$emit('update:value', 120)
    await speedInput.vm.$emit('update:value', null)
    await speedInput.vm.$emit('update:value', 1.5)
    await loopCountInput.vm.$emit('update:value', 3)

    await wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 'custom')

    expect(wrapper.emitted('update:scale')?.[0]).toEqual([120])
    expect(wrapper.emitted('update:speed')?.[0]).toEqual([1.5])
    expect(wrapper.emitted('update:loopCount')?.[0]).toEqual([3])
    expect(wrapper.emitted('update:loopMode')?.[0]).toEqual(['custom'])
  })

  it('renders converting label and emits convert', async () => {
    const wrapper = mountOptions({
      isConverting: true,
      canConvert: false,
    })

    const button = wrapper.find('button.n-button')
    expect(button.text()).toContain('Converting...')
    expect(button.attributes('disabled')).toBeDefined()

    await wrapper.setProps({ isConverting: false, canConvert: true })
    expect(button.text()).toContain('Convert')
    expect(button.attributes('disabled')).toBeUndefined()

    await button.trigger('click')
    expect(wrapper.emitted('convert')?.length).toBe(1)
  })
})
