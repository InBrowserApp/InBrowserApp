export default {
  common: {
    unknown: 'לא ידוע',
  },
  dns: {
    rcode: {
      '0': {
        description: 'אין שגיאה',
      },
      '1': {
        description: 'שגיאת פורמט',
      },
      '2': {
        description: 'כשל שרת',
      },
      '3': {
        description: 'דומיין לא קיים',
      },
      '4': {
        description: 'לא מיושם',
      },
      '5': {
        description: 'שאילתה נדחתה',
      },
      '6': {
        description: 'השם קיים כאשר לא צריך',
      },
      '7': {
        description: 'RR Set קיים כאשר לא צריך',
      },
      '8': {
        description: 'RR Set שצריך להתקיים לא קיים',
      },
      '9': {
        description: 'השרת לא סמכותי לאזור',
      },
      '10': {
        description: 'השם לא כלול באזור',
      },
      '11': {
        description: 'DSO-TYPE לא מיושם',
      },
      '16': {
        description: 'גרסת OPT רעה',
      },
      '17': {
        description: 'מפתח לא מזוהה',
      },
      '18': {
        description: 'חתימה מחוץ לחלון הזמן',
      },
      '19': {
        description: 'מצב TKEY רע',
      },
      '20': {
        description: 'שם מפתח כפול',
      },
      '21': {
        description: 'אלגוריתם לא נתמך',
      },
      '22': {
        description: 'קיצור רע',
      },
      '23': {
        description: 'עוגיית שרת רעה/חסרה',
      },
    },
  },
} as const
