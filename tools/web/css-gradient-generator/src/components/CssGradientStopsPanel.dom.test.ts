import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CssGradientStopsPanel from './CssGradientStopsPanel.vue'

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

  const NColorPicker = defineComponent({
    name: 'NColorPicker',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<div />',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template: '<input />',
  })

  const NSlider = defineComponent({
    name: 'NSlider',
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template: '<div />',
  })

  return {
    NAlert: makeStub('NAlert'),
    NButton,
    NCard: makeStub('NCard'),
    NColorPicker,
    NFlex: makeStub('NFlex'),
    NIcon: makeStub('NIcon'),
    NInputNumber,
    NSlider,
    NText: makeStub('NText'),
  }
})

const GradientStopsTrackStub = defineComponent({
  name: 'GradientStopsTrack',
  emits: ['add', 'select', 'update'],
  template: '<div />',
})

describe('CssGradientStopsPanel', () => {
  it('emits actions from controls and track events', async () => {
    const wrapper = mount(CssGradientStopsPanel, {
      props: {
        stops: [
          { id: 'a', color: '#FF0000FF', position: 0 },
          { id: 'b', color: '#00FF00FF', position: 100 },
        ],
        activeStopId: 'a',
        gradientCss: 'linear-gradient(#000, #fff)',
        showError: false,
        stopColor: '#FF0000FF',
        stopPosition: 10,
      },
      global: {
        stubs: {
          GradientStopsTrack: GradientStopsTrackStub,
        },
      },
    })

    await wrapper.get('[data-testid="add-stop"]').trigger('click')
    expect(wrapper.emitted('add-stop')?.[0]).toEqual([])

    const track = wrapper.findComponent(GradientStopsTrackStub)
    track.vm.$emit('add', 40)
    track.vm.$emit('select', 'b')
    track.vm.$emit('update', 'b', 60)

    expect(wrapper.emitted('add-stop')?.[1]).toEqual([40])
    expect(wrapper.emitted('select-stop')?.[0]).toEqual(['b'])
    expect(wrapper.emitted('update-stop')?.[0]).toEqual(['b', 60])

    await wrapper.get('[data-testid="remove-stop"]').trigger('click')
    expect(wrapper.emitted('remove-stop')).toBeTruthy()

    const colorPicker = wrapper.findComponent({ name: 'NColorPicker' })
    colorPicker.vm.$emit('update:value', '#123456')
    expect(wrapper.emitted('update:stopColor')?.[0]).toEqual(['#123456'])

    const inputNumber = wrapper.findComponent({ name: 'NInputNumber' })
    inputNumber.vm.$emit('update:value', 25)
    expect(wrapper.emitted('update:stopPosition')?.[0]).toEqual([25])

    inputNumber.vm.$emit('update:value', null)
    expect(wrapper.emitted('update:stopPosition')?.length).toBe(1)
  })

  it('shows the error alert when requested', () => {
    const wrapper = mount(CssGradientStopsPanel, {
      props: {
        stops: [
          { id: 'a', color: '#FF0000FF', position: 0 },
          { id: 'b', color: '#00FF00FF', position: 100 },
        ],
        activeStopId: 'a',
        gradientCss: 'linear-gradient(#000, #fff)',
        showError: true,
        stopColor: '#FF0000FF',
        stopPosition: 10,
      },
      global: {
        stubs: {
          GradientStopsTrack: GradientStopsTrackStub,
        },
      },
    })

    expect(wrapper.find('[data-testid="stop-error"]').exists()).toBe(true)
  })
})
