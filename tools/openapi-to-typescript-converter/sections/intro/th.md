## OpenAPI To TypeScript Converter คืออะไร?

OpenAPI to TypeScript Converter แปลงเอกสาร OpenAPI 3.x เป็น TypeScript types ที่สร้างขึ้นโดยตรงในเบราว์เซอร์ เหมาะเมื่อคุณต้องการพรีวิว type แบบรวดเร็ว ไฟล์ declaration ที่ดาวน์โหลดได้ หรือวิธีทดสอบตัวเลือก `openapi-typescript` อย่างปลอดภัยโดยไม่ต้องส่ง schema ไปยังเซิร์ฟเวอร์

## ควรใช้เมื่อไร

ใช้เครื่องมือนี้เมื่อคุณมี OpenAPI schema ในรูป JSON หรือ YAML อยู่แล้ว และต้องการ request และ response models ที่มี type สำหรับแอป frontend, prototype ของ SDK หรือการตรวจทาน API เหมาะมากสำหรับเปรียบเทียบตัวเลือกการสร้างก่อนจะ commit ผลลัพธ์ลง repository

## ก่อนสร้าง

เวอร์ชัน rewrite สำหรับเบราว์เซอร์นี้รองรับเอกสาร OpenAPI 3.0 และ 3.1 ที่ bundle แล้ว ถ้า schema ของคุณยังมี `$ref` ภายนอก ให้ bundle หรือ inline ก่อน แล้วค่อยสร้าง TypeScript output สุดท้ายที่นี่
