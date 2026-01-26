export default {
  common: {
    unknown: 'ไม่ทราบ',
  },
  dns: {
    rcode: {
      '0': {
        description: 'ไม่มีข้อผิดพลาด',
      },
      '1': {
        description: 'ข้อผิดพลาดรูปแบบ',
      },
      '2': {
        description: 'ความล้มเหลวของเซิร์ฟเวอร์',
      },
      '3': {
        description: 'โดเมนที่ไม่มีอยู่',
      },
      '4': {
        description: 'ไม่ได้นำมาใช้',
      },
      '5': {
        description: 'การสอบถามถูกปฏิเสธ',
      },
      '6': {
        description: 'ชื่อมีอยู่เมื่อไม่ควรมี',
      },
      '7': {
        description: 'RR Set มีอยู่เมื่อไม่ควรมี',
      },
      '8': {
        description: 'RR Set ที่ควรมีอยู่ไม่มี',
      },
      '9': {
        description: 'เซิร์ฟเวอร์ไม่มีอำนาจสำหรับโซน',
      },
      '10': {
        description: 'ชื่อไม่ได้อยู่ในโซน',
      },
      '11': {
        description: 'DSO-TYPE ไม่ได้นำมาใช้',
      },
      '16': {
        description: 'เวอร์ชัน OPT ไม่ถูกต้อง',
      },
      '17': {
        description: 'คีย์ไม่รู้จัก',
      },
      '18': {
        description: 'ลายเซ็นนอกหน้าต่างเวลา',
      },
      '19': {
        description: 'โหมด TKEY ไม่ถูกต้อง',
      },
      '20': {
        description: 'ชื่อคีย์ซ้ำ',
      },
      '21': {
        description: 'อัลกอริธึมไม่รองรับ',
      },
      '22': {
        description: 'การตัดทอนไม่ถูกต้อง',
      },
      '23': {
        description: 'คุกกี้เซิร์ฟเวอร์ไม่ถูกต้อง/ขาดหายไป',
      },
    },
  },
} as const
