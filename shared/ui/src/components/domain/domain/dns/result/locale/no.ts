export default {
  common: {
    unknown: 'Ukjent',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Ingen Feil',
      },
      '1': {
        description: 'Format Feil',
      },
      '2': {
        description: 'Server Feil',
      },
      '3': {
        description: 'Ikke-Eksisterende Domene',
      },
      '4': {
        description: 'Ikke Implementert',
      },
      '5': {
        description: 'Spørring Avvist',
      },
      '6': {
        description: 'Navn Eksisterer når det ikke burde',
      },
      '7': {
        description: 'RR Set Eksisterer når det ikke burde',
      },
      '8': {
        description: 'RR Set som burde eksistere gjør det ikke',
      },
      '9': {
        description: 'Server Ikke Autoritativ for sone',
      },
      '10': {
        description: 'Navn ikke inneholdt i sone',
      },
      '11': {
        description: 'DSO-TYPE Ikke Implementert',
      },
      '16': {
        description: 'Dårlig OPT Versjon',
      },
      '17': {
        description: 'Nøkkel ikke gjenkjent',
      },
      '18': {
        description: 'Signatur utenfor tidsvindu',
      },
      '19': {
        description: 'Dårlig TKEY Modus',
      },
      '20': {
        description: 'Duplisert nøkkelnavn',
      },
      '21': {
        description: 'Algoritme ikke støttet',
      },
      '22': {
        description: 'Dårlig Avkorting',
      },
      '23': {
        description: 'Dårlig/Manglende Server Cookie',
      },
    },
  },
} as const
