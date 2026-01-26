export default {
  common: {
    unknown: 'Unbekannt',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Kein Fehler',
      },
      '1': {
        description: 'Format Fehler',
      },
      '2': {
        description: 'Server Fehler',
      },
      '3': {
        description: 'Domain Existiert Nicht',
      },
      '4': {
        description: 'Nicht Implementiert',
      },
      '5': {
        description: 'Anfrage Verweigert',
      },
      '6': {
        description: 'Name Existiert obwohl er nicht sollte',
      },
      '7': {
        description: 'RR Set Existiert obwohl es nicht sollte',
      },
      '8': {
        description: 'RR Set das existieren sollte existiert nicht',
      },
      '9': {
        description: 'Server Nicht Autoritativ für Zone',
      },
      '10': {
        description: 'Name nicht in Zone enthalten',
      },
      '11': {
        description: 'DSO-TYPE Nicht Implementiert',
      },
      '16': {
        description: 'Schlechte OPT Version',
      },
      '17': {
        description: 'Schlüssel nicht erkannt',
      },
      '18': {
        description: 'Signatur außerhalb des Zeitfensters',
      },
      '19': {
        description: 'Schlechter TKEY Modus',
      },
      '20': {
        description: 'Doppelter Schlüsselname',
      },
      '21': {
        description: 'Algorithmus nicht unterstützt',
      },
      '22': {
        description: 'Schlechte Kürzung',
      },
      '23': {
        description: 'Schlechter/Fehlender Server Cookie',
      },
    },
  },
} as const
