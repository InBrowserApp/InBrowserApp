import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import KeyOptions from './KeyOptions.vue'

const IdentityStub = defineComponent({
  name: 'KeyIdentityFields',
  emits: ['update:name', 'update:email', 'update:comment'],
  template: '<div class="identity" />',
})

const AlgorithmStub = defineComponent({
  name: 'KeyAlgorithmFields',
  emits: ['update:algorithm', 'update:rsaKeySize'],
  template: '<div class="algorithm" />',
})

const ExpirationStub = defineComponent({
  name: 'KeyExpirationFields',
  emits: ['update:expirationDays', 'update:passphrase'],
  template: '<div class="expiration" />',
})

describe('KeyOptions', () => {
  it('forwards updates from child option sections', async () => {
    const wrapper = mount(KeyOptions, {
      props: {
        algorithm: 'ecc',
        rsaKeySize: 4096,
        name: '',
        email: '',
        comment: '',
        passphrase: '',
        expirationDays: 0,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<header><slot /></header>' },
          KeyIdentityFields: IdentityStub,
          KeyAlgorithmFields: AlgorithmStub,
          KeyExpirationFields: ExpirationStub,
        },
      },
    })

    wrapper.findComponent(IdentityStub).vm.$emit('update:name', 'Alice')
    wrapper.findComponent(IdentityStub).vm.$emit('update:email', 'alice@example.com')
    wrapper.findComponent(IdentityStub).vm.$emit('update:comment', 'work')
    wrapper.findComponent(AlgorithmStub).vm.$emit('update:algorithm', 'rsa')
    wrapper.findComponent(AlgorithmStub).vm.$emit('update:rsaKeySize', 2048)
    wrapper.findComponent(ExpirationStub).vm.$emit('update:expirationDays', 30)
    wrapper.findComponent(ExpirationStub).vm.$emit('update:passphrase', 'secret')

    expect(wrapper.emitted('update:name')?.[0]).toEqual(['Alice'])
    expect(wrapper.emitted('update:email')?.[0]).toEqual(['alice@example.com'])
    expect(wrapper.emitted('update:comment')?.[0]).toEqual(['work'])
    expect(wrapper.emitted('update:algorithm')?.[0]).toEqual(['rsa'])
    expect(wrapper.emitted('update:rsaKeySize')?.[0]).toEqual([2048])
    expect(wrapper.emitted('update:expirationDays')?.[0]).toEqual([30])
    expect(wrapper.emitted('update:passphrase')?.[0]).toEqual(['secret'])
  })
})
