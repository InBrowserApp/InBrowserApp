import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'bip39-mnemonic-generator',
    path: '/tools/random/bip39-mnemonic-generator',
    component: () => import('./Bip39MnemonicGeneratorView.vue'),
  },
] as const
