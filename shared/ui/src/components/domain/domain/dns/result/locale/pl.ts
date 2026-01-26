export default {
  common: {
    unknown: 'Nieznany',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Brak Błędu',
      },
      '1': {
        description: 'Błąd Formatu',
      },
      '2': {
        description: 'Awaria Serwera',
      },
      '3': {
        description: 'Nieistniejąca Domena',
      },
      '4': {
        description: 'Nie Zaimplementowane',
      },
      '5': {
        description: 'Zapytanie Odrzucone',
      },
      '6': {
        description: 'Nazwa Istnieje gdy nie powinna',
      },
      '7': {
        description: 'RR Set Istnieje gdy nie powinien',
      },
      '8': {
        description: 'RR Set który powinien istnieć nie istnieje',
      },
      '9': {
        description: 'Serwer Nie Autorytatywny dla strefy',
      },
      '10': {
        description: 'Nazwa nie zawarta w strefie',
      },
      '11': {
        description: 'DSO-TYPE Nie Zaimplementowane',
      },
      '16': {
        description: 'Zła Wersja OPT',
      },
      '17': {
        description: 'Klucz nie rozpoznany',
      },
      '18': {
        description: 'Podpis poza oknem czasowym',
      },
      '19': {
        description: 'Zły Tryb TKEY',
      },
      '20': {
        description: 'Zduplikowana nazwa klucza',
      },
      '21': {
        description: 'Algorytm nie obsługiwany',
      },
      '22': {
        description: 'Złe Obcięcie',
      },
      '23': {
        description: 'Zły/Brakujący Cookie Serwera',
      },
    },
  },
} as const
