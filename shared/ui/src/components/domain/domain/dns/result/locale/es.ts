export default {
  common: {
    unknown: 'Desconocido',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Sin Error',
      },
      '1': {
        description: 'Error de Formato',
      },
      '2': {
        description: 'Fallo del Servidor',
      },
      '3': {
        description: 'Dominio No Existente',
      },
      '4': {
        description: 'No Implementado',
      },
      '5': {
        description: 'Consulta Rechazada',
      },
      '6': {
        description: 'El Nombre Existe cuando no debería',
      },
      '7': {
        description: 'RR Set Existe cuando no debería',
      },
      '8': {
        description: 'RR Set que debería existir no existe',
      },
      '9': {
        description: 'Servidor No Autoritativo para la zona',
      },
      '10': {
        description: 'Nombre no contenido en la zona',
      },
      '11': {
        description: 'DSO-TYPE No Implementado',
      },
      '16': {
        description: 'Versión OPT Incorrecta',
      },
      '17': {
        description: 'Clave no reconocida',
      },
      '18': {
        description: 'Firma fuera de la ventana de tiempo',
      },
      '19': {
        description: 'Modo TKEY Incorrecto',
      },
      '20': {
        description: 'Nombre de clave duplicado',
      },
      '21': {
        description: 'Algoritmo no soportado',
      },
      '22': {
        description: 'Truncamiento Incorrecto',
      },
      '23': {
        description: 'Cookie del Servidor Incorrecto/Faltante',
      },
    },
  },
} as const
