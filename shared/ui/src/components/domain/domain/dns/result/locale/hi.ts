export default {
  common: {
    unknown: 'अज्ञात',
  },
  dns: {
    rcode: {
      '0': {
        description: 'कोई त्रुटि नहीं',
      },
      '1': {
        description: 'प्रारूप त्रुटि',
      },
      '2': {
        description: 'सर्वर विफलता',
      },
      '3': {
        description: 'अस्तित्वहीन डोमेन',
      },
      '4': {
        description: 'लागू नहीं किया गया',
      },
      '5': {
        description: 'क्वेरी अस्वीकृत',
      },
      '6': {
        description: 'नाम मौजूद है जब यह नहीं होना चाहिए',
      },
      '7': {
        description: 'RR सेट मौजूद है जब यह नहीं होना चाहिए',
      },
      '8': {
        description: 'RR सेट जो होना चाहिए वह मौजूद नहीं है',
      },
      '9': {
        description: 'सर्वर ज़ोन के लिए प्राधिकृत नहीं',
      },
      '10': {
        description: 'नाम ज़ोन में शामिल नहीं',
      },
      '11': {
        description: 'DSO-TYPE लागू नहीं किया गया',
      },
      '16': {
        description: 'खराब OPT संस्करण',
      },
      '17': {
        description: 'कुंजी पहचानी नहीं गई',
      },
      '18': {
        description: 'समय विंडो के बाहर हस्ताक्षर',
      },
      '19': {
        description: 'खराब TKEY मोड',
      },
      '20': {
        description: 'डुप्लिकेट कुंजी नाम',
      },
      '21': {
        description: 'एल्गोरिदम समर्थित नहीं',
      },
      '22': {
        description: 'खराब ट्रंकेशन',
      },
      '23': {
        description: 'खराब/लापता सर्वर कुकी',
      },
    },
  },
} as const
