import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { vi } from 'vitest'
import ConversionOptionsActions from './ConversionOptionsActions.vue'
import ConversionOptionsAdvancedSection from './ConversionOptionsAdvancedSection.vue'
import ConversionOptionsBaseGrid from './ConversionOptionsBaseGrid.vue'
import ConversionOptions from './ConversionOptions.vue'
import ImageToAvifOptionsLabelsAdvanced from './ImageToAvifOptionsLabelsAdvanced.vue'
import ImageToAvifOptionsLabelsCore from './ImageToAvifOptionsLabelsCore.vue'
import ImageToAvifOptionsSection from './ImageToAvifOptionsSection.vue'

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<header><slot /></header>',
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const baseStub = defineComponent({
    name: 'BaseStub',
    template: '<div><slot /></div>',
  })

  return {
    NButton: defineComponent({
      name: 'NButton',
      props: {
        disabled: Boolean,
        loading: Boolean,
        tag: String,
        href: String,
        download: String,
      },
      emits: ['click'],
      template:
        '<component :is="tag || \'button\'" :disabled="disabled" :href="href" :download="download" @click="$emit(\'click\')"><slot name="icon" /><slot /></component>',
    }),
    NCollapseTransition: baseStub,
    NFlex: baseStub,
    NFormItemGi: baseStub,
    NGi: baseStub,
    NGrid: baseStub,
    NIcon: baseStub,
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: { value: Number },
      emits: ['update:value'],
      template: '<button class="input-number" @click="$emit(\'update:value\', 12)" />',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: { value: [String, Number, null], options: Array, clearable: Boolean },
      emits: ['update:value'],
      template:
        '<button class="select" @click="$emit(\'update:value\', options?.[0]?.value ?? null)" />',
    }),
    NSwitch: defineComponent({
      name: 'NSwitch',
      props: { value: Boolean },
      emits: ['update:value'],
      template: '<button class="switch" @click="$emit(\'update:value\', !value)" />',
    }),
    NText: baseStub,
  }
})

function globalConfig() {
  return {
    global: {
      stubs: {
        ToolSection: ToolSectionStub,
        ToolSectionHeader: ToolSectionHeaderStub,
      },
    },
  }
}

describe('ConversionOptionsActions', () => {
  it('emits convert and swaps its label while loading', async () => {
    const wrapper = mount(ConversionOptionsActions, {
      props: {
        convertLabel: 'Convert',
        convertingLabel: 'Converting',
        isConverting: true,
        canConvert: true,
      },
      ...globalConfig(),
    })

    expect(wrapper.text()).toContain('Converting')
    const buttons = wrapper.findAll('button')
    await buttons[buttons.length - 1]!.trigger('click')
    expect(wrapper.emitted('convert')).toHaveLength(1)
  })
})

describe('ConversionOptionsBaseGrid', () => {
  it('updates scale, quality, and speed', async () => {
    const wrapper = mount(ConversionOptionsBaseGrid, {
      props: {
        scale: 100,
        quality: 75,
        speed: 6,
        lossless: false,
        scaleLabel: 'Scale',
        scaleHint: 'Scale hint',
        qualityLabel: 'Quality',
        qualityHint: 'Quality hint',
        speedLabel: 'Speed',
        speedHint: 'Speed hint',
        losslessLabel: 'Lossless',
        minScale: 10,
        maxScale: 400,
        minSpeed: 0,
        maxSpeed: 10,
        'onUpdate:scale': (value: number) => wrapper.setProps({ scale: value }),
        'onUpdate:quality': (value: number) => wrapper.setProps({ quality: value }),
        'onUpdate:speed': (value: number) => wrapper.setProps({ speed: value }),
      },
      ...globalConfig(),
    })

    const controls = wrapper.findAll('.input-number')
    await controls[0]!.trigger('click')
    await controls[1]!.trigger('click')
    await controls[2]!.trigger('click')

    expect(wrapper.emitted('update:scale')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:quality')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:speed')?.[0]).toEqual([12])
  })

  it('ignores null updates from numeric inputs', async () => {
    const wrapper = mount(ConversionOptionsBaseGrid, {
      props: {
        scale: 100,
        quality: 75,
        speed: 6,
        lossless: false,
        scaleLabel: 'Scale',
        scaleHint: 'Scale hint',
        qualityLabel: 'Quality',
        qualityHint: 'Quality hint',
        speedLabel: 'Speed',
        speedHint: 'Speed hint',
        losslessLabel: 'Lossless',
        minScale: 10,
        maxScale: 400,
        minSpeed: 0,
        maxSpeed: 10,
      },
      ...globalConfig(),
    })

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    inputs[0]!.vm.$emit('update:value', null)
    inputs[1]!.vm.$emit('update:value', null)
    inputs[2]!.vm.$emit('update:value', null)

    expect(wrapper.emitted('update:scale')).toBeUndefined()
    expect(wrapper.emitted('update:quality')).toBeUndefined()
    expect(wrapper.emitted('update:speed')).toBeUndefined()
  })
})

describe('ConversionOptionsAdvancedSection', () => {
  it('updates advanced AVIF controls', async () => {
    const wrapper = mount(ConversionOptionsAdvancedSection, {
      props: {
        advancedEnabled: true,
        alphaQuality: null,
        denoiseLevel: null,
        sharpness: null,
        subsample: null,
        tune: null,
        enableSharpYuv: false,
        advancedLabel: 'Advanced',
        alphaQualityLabel: 'Alpha quality',
        denoiseLevelLabel: 'Denoise level',
        sharpnessLabel: 'Sharpness',
        subsampleLabel: 'Subsample',
        subsample420Label: '4:2:0',
        subsample422Label: '4:2:2',
        subsample444Label: '4:4:4',
        tuneLabel: 'Tune',
        tuneAutoLabel: 'Auto',
        tunePsnrLabel: 'PSNR',
        tuneSsimLabel: 'SSIM',
        sharpYuvLabel: 'Sharp YUV',
      },
      ...globalConfig(),
    })

    const numberInputs = wrapper.findAll('.input-number')
    await numberInputs[0]!.trigger('click')
    await numberInputs[1]!.trigger('click')
    await numberInputs[2]!.trigger('click')

    const selects = wrapper.findAll('.select')
    await selects[0]!.trigger('click')
    await selects[1]!.trigger('click')

    const switches = wrapper.findAll('.switch')
    await switches[0]!.trigger('click')
    await switches[1]!.trigger('click')

    expect(wrapper.emitted('update:advancedEnabled')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:alphaQuality')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:denoiseLevel')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:sharpness')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:subsample')?.[0]).toEqual(['420'])
    expect(wrapper.emitted('update:tune')?.[0]).toEqual(['auto'])
    expect(wrapper.emitted('update:enableSharpYuv')?.[0]).toEqual([true])
  })
})

describe('label helpers and options composition', () => {
  it('exposes translated core and advanced labels', () => {
    const core = mount(ImageToAvifOptionsLabelsCore, {
      slots: { default: ({ labels }: { labels: Record<string, string> }) => labels.convertLabel },
    })
    const advanced = mount(ImageToAvifOptionsLabelsAdvanced, {
      slots: {
        default: ({ labels }: { labels: Record<string, string> }) => labels.alphaQualityLabel,
      },
    })

    expect(core.text()).toContain('Convert to AVIF')
    expect(advanced.text()).toContain('Alpha quality')
  })

  it('forwards models and convert events through ConversionOptions', async () => {
    const wrapper = mount(ConversionOptions, {
      props: {
        title: 'Options',
        scaleLabel: 'Scale',
        scaleHint: 'Scale hint',
        qualityLabel: 'Quality',
        qualityHint: 'Quality hint',
        speedLabel: 'Speed',
        speedHint: 'Speed hint',
        losslessLabel: 'Lossless',
        advancedLabel: 'Advanced',
        alphaQualityLabel: 'Alpha quality',
        denoiseLevelLabel: 'Denoise level',
        sharpnessLabel: 'Sharpness',
        subsampleLabel: 'Subsample',
        subsample420Label: '4:2:0',
        subsample422Label: '4:2:2',
        subsample444Label: '4:4:4',
        tuneLabel: 'Tune',
        tuneAutoLabel: 'Auto',
        tunePsnrLabel: 'PSNR',
        tuneSsimLabel: 'SSIM',
        sharpYuvLabel: 'Sharp YUV',
        convertLabel: 'Convert',
        convertingLabel: 'Converting',
        minScale: 10,
        maxScale: 400,
        minSpeed: 0,
        maxSpeed: 10,
        isConverting: false,
        canConvert: true,
        scale: 100,
        quality: 75,
        speed: 6,
        lossless: false,
        advancedEnabled: false,
        alphaQuality: null,
        denoiseLevel: null,
        sharpness: null,
        subsample: null,
        tune: null,
        enableSharpYuv: false,
      },
      ...globalConfig(),
    })

    const numberInputs = wrapper.findAll('.input-number')
    await numberInputs[0]!.trigger('click')
    await numberInputs[1]!.trigger('click')
    await numberInputs[2]!.trigger('click')
    await numberInputs[3]!.trigger('click')
    await numberInputs[4]!.trigger('click')
    await numberInputs[5]!.trigger('click')

    const switches = wrapper.findAll('.switch')
    await switches[0]!.trigger('click')
    await switches[1]!.trigger('click')
    await switches[2]!.trigger('click')

    const selects = wrapper.findAll('.select')
    await selects[0]!.trigger('click')
    await selects[1]!.trigger('click')

    const buttons = wrapper.findAll('button')
    await buttons[buttons.length - 1]!.trigger('click')

    expect(wrapper.emitted('update:scale')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:quality')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:speed')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:lossless')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:advancedEnabled')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:alphaQuality')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:denoiseLevel')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:sharpness')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:subsample')?.[0]).toEqual(['420'])
    expect(wrapper.emitted('update:tune')?.[0]).toEqual(['auto'])
    expect(wrapper.emitted('update:enableSharpYuv')?.[0]).toEqual([true])
    expect(wrapper.emitted('convert')).toHaveLength(1)
  })

  it('builds translated props in ImageToAvifOptionsSection', async () => {
    const wrapper = mount(ImageToAvifOptionsSection, {
      props: {
        minScale: 10,
        maxScale: 400,
        minSpeed: 0,
        maxSpeed: 10,
        isConverting: false,
        canConvert: true,
        scale: 100,
        quality: 75,
        speed: 6,
        lossless: false,
        advancedEnabled: false,
        alphaQuality: null,
        denoiseLevel: null,
        sharpness: null,
        subsample: null,
        tune: null,
        enableSharpYuv: false,
      },
      global: {
        stubs: {
          ConversionOptions: defineComponent({
            name: 'ConversionOptions',
            props: ['title', 'convertLabel', 'speedLabel'],
            emits: [
              'update:scale',
              'update:quality',
              'update:speed',
              'update:lossless',
              'update:advancedEnabled',
              'update:alphaQuality',
              'update:denoiseLevel',
              'update:sharpness',
              'update:subsample',
              'update:tune',
              'update:enableSharpYuv',
              'convert',
            ],
            template: `
                <div class="section-props">{{ title }}|{{ convertLabel }}|{{ speedLabel }}</div>
                <button class="section-scale" @click="$emit('update:scale', 125)" />
                <button class="section-quality" @click="$emit('update:quality', 88)" />
                <button class="section-speed" @click="$emit('update:speed', 5)" />
                <button class="section-lossless" @click="$emit('update:lossless', true)" />
                <button class="section-advanced" @click="$emit('update:advancedEnabled', true)" />
                <button class="section-alpha" @click="$emit('update:alphaQuality', 75)" />
                <button class="section-denoise" @click="$emit('update:denoiseLevel', 3)" />
                <button class="section-sharpness" @click="$emit('update:sharpness', 2)" />
                <button class="section-subsample" @click="$emit('update:subsample', '444')" />
                <button class="section-tune" @click="$emit('update:tune', 'ssim')" />
                <button class="section-sharp-yuv" @click="$emit('update:enableSharpYuv', true)" />
                <button class="section-convert" @click="$emit('convert')" />
              `,
          }),
        },
      },
    })

    expect(wrapper.text()).toContain('Conversion Options')
    expect(wrapper.text()).toContain('Convert to AVIF')
    expect(wrapper.text()).toContain('Speed')

    await wrapper.find('.section-scale').trigger('click')
    await wrapper.find('.section-quality').trigger('click')
    await wrapper.find('.section-speed').trigger('click')
    await wrapper.find('.section-lossless').trigger('click')
    await wrapper.find('.section-advanced').trigger('click')
    await wrapper.find('.section-alpha').trigger('click')
    await wrapper.find('.section-denoise').trigger('click')
    await wrapper.find('.section-sharpness').trigger('click')
    await wrapper.find('.section-subsample').trigger('click')
    await wrapper.find('.section-tune').trigger('click')
    await wrapper.find('.section-sharp-yuv').trigger('click')
    await wrapper.find('.section-convert').trigger('click')

    expect(wrapper.emitted('update:scale')?.[0]).toEqual([125])
    expect(wrapper.emitted('update:quality')?.[0]).toEqual([88])
    expect(wrapper.emitted('update:speed')?.[0]).toEqual([5])
    expect(wrapper.emitted('update:lossless')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:advancedEnabled')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:alphaQuality')?.[0]).toEqual([75])
    expect(wrapper.emitted('update:denoiseLevel')?.[0]).toEqual([3])
    expect(wrapper.emitted('update:sharpness')?.[0]).toEqual([2])
    expect(wrapper.emitted('update:subsample')?.[0]).toEqual(['444'])
    expect(wrapper.emitted('update:tune')?.[0]).toEqual(['ssim'])
    expect(wrapper.emitted('update:enableSharpYuv')?.[0]).toEqual([true])
    expect(wrapper.emitted('convert')).toHaveLength(1)
  })
})
