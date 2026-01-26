export default {
  common: {
    unknown: 'Onbekend',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Geen Fout',
      },
      '1': {
        description: 'Format Fout',
      },
      '2': {
        description: 'Server Fout',
      },
      '3': {
        description: 'Niet-Bestaand Domein',
      },
      '4': {
        description: 'Niet Geïmplementeerd',
      },
      '5': {
        description: 'Query Geweigerd',
      },
      '6': {
        description: 'Naam Bestaat wanneer het niet zou moeten',
      },
      '7': {
        description: 'RR Set Bestaat wanneer het niet zou moeten',
      },
      '8': {
        description: 'RR Set die zou moeten bestaan bestaat niet',
      },
      '9': {
        description: 'Server Niet Autoritatief voor zone',
      },
      '10': {
        description: 'Naam niet opgenomen in zone',
      },
      '11': {
        description: 'DSO-TYPE Niet Geïmplementeerd',
      },
      '16': {
        description: 'Slechte OPT Versie',
      },
      '17': {
        description: 'Sleutel niet herkend',
      },
      '18': {
        description: 'Handtekening buiten tijdvenster',
      },
      '19': {
        description: 'Slechte TKEY Modus',
      },
      '20': {
        description: 'Dubbele sleutelnaam',
      },
      '21': {
        description: 'Algoritme niet ondersteund',
      },
      '22': {
        description: 'Slechte Afkapping',
      },
      '23': {
        description: 'Slechte/Ontbrekende Server Cookie',
      },
    },
  },
} as const
