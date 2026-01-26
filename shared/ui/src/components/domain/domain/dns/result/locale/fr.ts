export default {
  common: {
    unknown: 'Inconnu',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Aucune Erreur',
      },
      '1': {
        description: 'Erreur de Format',
      },
      '2': {
        description: 'Échec du Serveur',
      },
      '3': {
        description: 'Domaine Non Existant',
      },
      '4': {
        description: 'Non Implémenté',
      },
      '5': {
        description: 'Requête Refusée',
      },
      '6': {
        description: 'Le Nom Existe quand il ne devrait pas',
      },
      '7': {
        description: 'RR Set Existe quand il ne devrait pas',
      },
      '8': {
        description: "RR Set qui devrait exister n'existe pas",
      },
      '9': {
        description: 'Serveur Non Autoritaire pour la zone',
      },
      '10': {
        description: 'Nom non contenu dans la zone',
      },
      '11': {
        description: 'DSO-TYPE Non Implémenté',
      },
      '16': {
        description: 'Mauvaise Version OPT',
      },
      '17': {
        description: 'Clé non reconnue',
      },
      '18': {
        description: 'Signature hors de la fenêtre de temps',
      },
      '19': {
        description: 'Mauvais Mode TKEY',
      },
      '20': {
        description: 'Nom de clé en double',
      },
      '21': {
        description: 'Algorithme non supporté',
      },
      '22': {
        description: 'Mauvaise Troncature',
      },
      '23': {
        description: 'Cookie Serveur Mauvais/Manquant',
      },
    },
  },
} as const
