export default {
  common: {
    unknown: 'Unknown',
  },
  dns: {
    rcode: {
      '0': {
        description: 'No Error',
      },
      '1': {
        description: 'Format Error',
      },
      '2': {
        description: 'Server Failure',
      },
      '3': {
        description: 'Non-Existent Domain',
      },
      '4': {
        description: 'Not Implemented',
      },
      '5': {
        description: 'Query Refused',
      },
      '6': {
        description: 'Name Exists when it should not',
      },
      '7': {
        description: 'RR Set Exists when it should not',
      },
      '8': {
        description: 'RR Set that should exist does not',
      },
      '9': {
        description: 'Server Not Authoritative for zone',
      },
      '10': {
        description: 'Name not contained in zone',
      },
      '11': {
        description: 'DSO-TYPE Not Implemented',
      },
      '16': {
        description: 'Bad OPT Version',
      },
      '17': {
        description: 'Key not recognized',
      },
      '18': {
        description: 'Signature out of time window',
      },
      '19': {
        description: 'Bad TKEY Mode',
      },
      '20': {
        description: 'Duplicate key name',
      },
      '21': {
        description: 'Algorithm not supported',
      },
      '22': {
        description: 'Bad Truncation',
      },
      '23': {
        description: 'Bad/missing Server Cookie',
      },
    },
  },
} as const
