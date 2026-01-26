export default {
  common: {
    unknown: 'Неизвестно',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Нет Ошибки',
      },
      '1': {
        description: 'Ошибка Формата',
      },
      '2': {
        description: 'Сбой Сервера',
      },
      '3': {
        description: 'Несуществующий Домен',
      },
      '4': {
        description: 'Не Реализовано',
      },
      '5': {
        description: 'Запрос Отклонен',
      },
      '6': {
        description: 'Имя Существует когда не должно',
      },
      '7': {
        description: 'RR Набор Существует когда не должен',
      },
      '8': {
        description: 'RR Набор который должен существовать не существует',
      },
      '9': {
        description: 'Сервер Не Авторитетен для зоны',
      },
      '10': {
        description: 'Имя не содержится в зоне',
      },
      '11': {
        description: 'DSO-TYPE Не Реализован',
      },
      '16': {
        description: 'Плохая Версия OPT',
      },
      '17': {
        description: 'Ключ не распознан',
      },
      '18': {
        description: 'Подпись вне временного окна',
      },
      '19': {
        description: 'Плохой Режим TKEY',
      },
      '20': {
        description: 'Дублированное имя ключа',
      },
      '21': {
        description: 'Алгоритм не поддерживается',
      },
      '22': {
        description: 'Плохое Усечение',
      },
      '23': {
        description: 'Плохой/Отсутствующий Серверный Cookie',
      },
    },
  },
} as const
