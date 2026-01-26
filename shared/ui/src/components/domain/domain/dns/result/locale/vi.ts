export default {
  common: {
    unknown: 'Không rõ',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Không Có Lỗi',
      },
      '1': {
        description: 'Lỗi Định Dạng',
      },
      '2': {
        description: 'Lỗi Máy Chủ',
      },
      '3': {
        description: 'Tên Miền Không Tồn Tại',
      },
      '4': {
        description: 'Chưa Được Triển Khai',
      },
      '5': {
        description: 'Truy Vấn Bị Từ Chối',
      },
      '6': {
        description: 'Tên Tồn Tại khi không nên',
      },
      '7': {
        description: 'RR Set Tồn Tại khi không nên',
      },
      '8': {
        description: 'RR Set nên tồn tại nhưng không tồn tại',
      },
      '9': {
        description: 'Máy Chủ Không Có Thẩm Quyền cho vùng',
      },
      '10': {
        description: 'Tên không được chứa trong vùng',
      },
      '11': {
        description: 'DSO-TYPE Chưa Được Triển Khai',
      },
      '16': {
        description: 'Phiên Bản OPT Xấu',
      },
      '17': {
        description: 'Khóa không được nhận dạng',
      },
      '18': {
        description: 'Chữ ký ngoài cửa sổ thời gian',
      },
      '19': {
        description: 'Chế Độ TKEY Xấu',
      },
      '20': {
        description: 'Tên khóa trùng lặp',
      },
      '21': {
        description: 'Thuật toán không được hỗ trợ',
      },
      '22': {
        description: 'Cắt Bớt Xấu',
      },
      '23': {
        description: 'Cookie Máy Chủ Xấu/Thiếu',
      },
    },
  },
} as const
