export default {
  common: {
    unknown: 'Okänd',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Inget Fel',
      },
      '1': {
        description: 'Format Fel',
      },
      '2': {
        description: 'Server Fel',
      },
      '3': {
        description: 'Icke-Existerande Domän',
      },
      '4': {
        description: 'Inte Implementerat',
      },
      '5': {
        description: 'Fråga Nekad',
      },
      '6': {
        description: 'Namn Existerar när det inte borde',
      },
      '7': {
        description: 'RR Set Existerar när det inte borde',
      },
      '8': {
        description: 'RR Set som borde existera gör det inte',
      },
      '9': {
        description: 'Server Inte Auktoritativ för zon',
      },
      '10': {
        description: 'Namn inte innehållet i zon',
      },
      '11': {
        description: 'DSO-TYPE Inte Implementerat',
      },
      '16': {
        description: 'Dålig OPT Version',
      },
      '17': {
        description: 'Nyckel inte igenkänd',
      },
      '18': {
        description: 'Signatur utanför tidsfönster',
      },
      '19': {
        description: 'Dåligt TKEY Läge',
      },
      '20': {
        description: 'Duplicerat nyckelnamn',
      },
      '21': {
        description: 'Algoritm inte stödd',
      },
      '22': {
        description: 'Dålig Trunkering',
      },
      '23': {
        description: 'Dålig/Saknad Server Cookie',
      },
    },
  },
} as const
