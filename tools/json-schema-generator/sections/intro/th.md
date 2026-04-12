## JSON Schema คืออะไร?

JSON Schema คือมาตรฐานสำหรับอธิบายโครงสร้างของข้อมูล JSON ช่วยให้คุณระบุชนิดของฟิลด์ โครงสร้างที่ซ้อนกัน คีย์ที่จำเป็น และข้อจำกัดที่เหมาะกับการตรวจสอบข้อมูลได้อย่างเป็นระบบ

### ตัวสร้างนี้ทำอะไร

วาง JSON ตัวอย่าง แล้วเครื่องมือจะอนุมาน schema เริ่มต้นสำหรับ object, array, number, boolean, null และรูปแบบสตริงที่พบบ่อย ผลลัพธ์สามารถคัดลอก ดาวน์โหลด และปรับแต่งต่อได้

### ตัวอย่าง

ตัวอย่างเช่น สำหรับข้อมูลตัวอย่างนี้:

**อินพุตตัวอย่าง**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**schema ที่สร้างได้**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "price": { "type": "number" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "published": { "type": "boolean" }
  },
  "required": ["id", "title", "price", "tags", "published"]
}
```

### เคล็ดลับ

- ใช้ข้อมูลตัวอย่างที่เป็นตัวแทนของข้อมูลจริง โดยเฉพาะภายใน array เพื่อให้อนุมานฟิลด์ที่เป็นตัวเลือกได้ดีขึ้น
- ปิด “Infer required properties” หากอินพุตของคุณเป็นเพียงตัวอย่างที่ยังไม่ครบ
- ปิด “Allow additional properties” หากต้องการ schema ที่เข้มงวดกว่าเป็นค่าเริ่มต้น
- เปิดการตรวจจับรูปแบบสตริงไว้เพื่อช่วยอนุมาน email, URI, UUID และ date-time
