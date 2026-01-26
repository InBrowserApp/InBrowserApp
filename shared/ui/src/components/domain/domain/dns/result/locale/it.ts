export default {
  common: {
    unknown: 'Sconosciuto',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Nessun Errore',
      },
      '1': {
        description: 'Errore di Formato',
      },
      '2': {
        description: 'Errore del Server',
      },
      '3': {
        description: 'Dominio Non Esistente',
      },
      '4': {
        description: 'Non Implementato',
      },
      '5': {
        description: 'Query Rifiutata',
      },
      '6': {
        description: 'Il Nome Esiste quando non dovrebbe',
      },
      '7': {
        description: 'RR Set Esiste quando non dovrebbe',
      },
      '8': {
        description: 'RR Set che dovrebbe esistere non esiste',
      },
      '9': {
        description: 'Server Non Autoritativo per la zona',
      },
      '10': {
        description: 'Nome non contenuto nella zona',
      },
      '11': {
        description: 'DSO-TYPE Non Implementato',
      },
      '16': {
        description: 'Versione OPT Errata',
      },
      '17': {
        description: 'Chiave non riconosciuta',
      },
      '18': {
        description: 'Firma fuori dalla finestra temporale',
      },
      '19': {
        description: 'Modalità TKEY Errata',
      },
      '20': {
        description: 'Nome chiave duplicato',
      },
      '21': {
        description: 'Algoritmo non supportato',
      },
      '22': {
        description: 'Troncamento Errato',
      },
      '23': {
        description: 'Cookie Server Errato/Mancante',
      },
    },
  },
} as const
