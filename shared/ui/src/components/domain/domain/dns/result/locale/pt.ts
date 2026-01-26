export default {
  common: {
    unknown: 'Desconhecido',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Sem Erro',
      },
      '1': {
        description: 'Erro de Formato',
      },
      '2': {
        description: 'Falha do Servidor',
      },
      '3': {
        description: 'Domínio Não Existente',
      },
      '4': {
        description: 'Não Implementado',
      },
      '5': {
        description: 'Consulta Recusada',
      },
      '6': {
        description: 'Nome Existe quando não deveria',
      },
      '7': {
        description: 'RR Set Existe quando não deveria',
      },
      '8': {
        description: 'RR Set que deveria existir não existe',
      },
      '9': {
        description: 'Servidor Não Autoritativo para a zona',
      },
      '10': {
        description: 'Nome não contido na zona',
      },
      '11': {
        description: 'DSO-TYPE Não Implementado',
      },
      '16': {
        description: 'Versão OPT Ruim',
      },
      '17': {
        description: 'Chave não reconhecida',
      },
      '18': {
        description: 'Assinatura fora da janela de tempo',
      },
      '19': {
        description: 'Modo TKEY Ruim',
      },
      '20': {
        description: 'Nome de chave duplicado',
      },
      '21': {
        description: 'Algoritmo não suportado',
      },
      '22': {
        description: 'Truncamento Ruim',
      },
      '23': {
        description: 'Cookie do Servidor Ruim/Ausente',
      },
    },
  },
} as const
