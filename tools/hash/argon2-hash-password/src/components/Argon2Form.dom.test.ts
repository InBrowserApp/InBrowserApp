import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
}))

vi.mock('naive-ui', () => ({
  NGrid: {
    template: '<div class="grid"><slot /></div>',
  },
  NGi: {
    template: '<div class="grid-item"><slot /></div>',
  },
  NFormItem: {
    props: ['label', 'validationStatus', 'showFeedback'],
    template:
      '<div class="form-item" :data-label="label" :data-status="validationStatus"><slot /></div>',
  },
  NInput: {
    props: ['value'],
    emits: ['update:value'],
    template: `<input class="n-input" :value="value ?? ''" @input="$emit('update:value', $event.target.value)" />`,
  },
  NInputNumber: {
    props: ['value'],
    emits: ['update:value'],
    template: `<input class="n-input-number" :value="value ?? ''" @input="$emit('update:value', $event.target.value === '' ? null : Number($event.target.value))" />`,
  },
  NSelect: {
    props: ['value', 'options'],
    emits: ['update:value'],
    template:
      '<select class="n-select" :value="value" @change="$emit(\'update:value\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
  },
  NButton: {
    emits: ['click'],
    template: '<button class="n-button" @click="$emit(\'click\')"><slot /></button>',
  },
}))

let Argon2Form: typeof import('./Argon2Form.vue').default

beforeAll(async () => {
  Argon2Form = (await import('./Argon2Form.vue')).default
})

const createWrapper = () => {
  return mount(Argon2Form, {
    props: {
      password: 'secret',
      secret: '',
      algorithm: 'argon2id',
      iterations: 3,
      memorySize: 512,
      parallelism: 1,
      hashLength: 32,
      salt: 'AQID',
      iterationsMin: 1,
      iterationsMax: 12,
      memoryMin: 8,
      memoryMax: 1024,
      parallelismMin: 1,
      parallelismMax: 8,
      hashLengthMin: 4,
      hashLengthMax: 64,
      iterationsValid: true,
      memoryValid: true,
      parallelismValid: true,
      hashLengthValid: true,
      memoryDependencyValid: true,
      saltErrorType: '',
      'onUpdate:password': () => {},
      'onUpdate:secret': () => {},
      'onUpdate:algorithm': () => {},
      'onUpdate:iterations': () => {},
      'onUpdate:memorySize': () => {},
      'onUpdate:parallelism': () => {},
      'onUpdate:hashLength': () => {},
      'onUpdate:salt': () => {},
    },
  })
}

describe('Argon2Form', () => {
  it('renders fields and emits model updates', async () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.section-header').text()).toBe('config-header')
    expect(wrapper.findAll('.n-input')).toHaveLength(3)
    expect(wrapper.findAll('.n-input-number')).toHaveLength(4)

    const textInputs = wrapper.findAll('.n-input')
    const numberInputs = wrapper.findAll('.n-input-number')

    await textInputs[0]!.setValue('next-password')
    await textInputs[1]!.setValue('QUJD')
    await textInputs[2]!.setValue('pepper')

    await numberInputs[0]!.setValue('4')
    await numberInputs[1]!.setValue('256')
    await numberInputs[2]!.setValue('2')
    await numberInputs[3]!.setValue('48')

    await wrapper.find('.n-select').setValue('argon2i')

    expect(wrapper.emitted('update:password')?.[0]).toEqual(['next-password'])
    expect(wrapper.emitted('update:salt')?.[0]).toEqual(['QUJD'])
    expect(wrapper.emitted('update:secret')?.[0]).toEqual(['pepper'])
    expect(wrapper.emitted('update:algorithm')?.[0]).toEqual(['argon2i'])

    expect(wrapper.emitted('update:iterations')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:memorySize')?.[0]).toEqual([256])
    expect(wrapper.emitted('update:parallelism')?.[0]).toEqual([2])
    expect(wrapper.emitted('update:hashLength')?.[0]).toEqual([48])
  })

  it('shows validation statuses for invalid values', async () => {
    const wrapper = createWrapper()

    await wrapper.setProps({
      iterationsValid: false,
      parallelismValid: false,
      hashLengthValid: false,
      memoryValid: false,
      saltErrorType: 'base64',
    })

    const byLabel = (label: string) => {
      return wrapper.findAll('.form-item').find((item) => item.attributes('data-label') === label)
    }

    expect(byLabel('iterations')?.attributes('data-status')).toBe('error')
    expect(byLabel('parallelism')?.attributes('data-status')).toBe('error')
    expect(byLabel('hash-length')?.attributes('data-status')).toBe('error')
    expect(byLabel('memory-size')?.attributes('data-status')).toBe('error')
    expect(byLabel('salt')?.attributes('data-status')).toBe('error')
  })

  it('shows memory dependency validation status', async () => {
    const wrapper = createWrapper()

    await wrapper.setProps({
      memoryValid: true,
      memoryDependencyValid: false,
    })

    const memoryItem = wrapper.findAll('.form-item').find((item) => {
      return item.attributes('data-label') === 'memory-size'
    })

    expect(memoryItem?.attributes('data-status')).toBe('error')
  })

  it('emits generate-salt action', async () => {
    const wrapper = createWrapper()

    await wrapper.find('.n-button').trigger('click')

    expect(wrapper.emitted('generate-salt')).toHaveLength(1)
  })
})
