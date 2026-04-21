## robots.txt generator คืออะไร?

robots.txt generator ช่วยรวมกฎ user-agent เส้นทาง allow/disallow และลิงก์ sitemap เพื่อสร้างไฟล์ robots.txt ให้วางไว้ที่รากเว็บไซต์เป็น /robots.txt เพื่อให้บอตอ่านได้

### ตัวสร้างนี้ช่วยคุณทำอะไรได้บ้าง

- สร้างกฎแยกสำหรับเสิร์ชเอนจิน โปรแกรมรวบรวมข้อมูล AI หรือบอตแบบกำหนดเอง
- เพิ่ม `Allow`, `Disallow`, sitemap และคำสั่งขั้นสูงเพิ่มเติมได้ในที่เดียว
- คัดลอกหรือดาวน์โหลดไฟล์ `robots.txt` ที่พร้อมเผยแพร่

### ตัวอย่าง

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

ตัวอย่างนี้ขอให้บอตหลีกเลี่ยง `/admin/` ส่วนใหญ่ ยังคงเปิดให้รวบรวมข้อมูลที่ `/admin/help/` และชี้ไปยังตำแหน่ง sitemap

### ข้อควรรู้

- เผยแพร่ไฟล์ไว้ที่ `/robots.txt` ตรง root ของเว็บไซต์
- `robots.txt` เป็นข้อมูลสาธารณะและใช้เป็นแนวทาง ไม่ใช่การควบคุมการเข้าถึง
- ไม่ใช่ทุกบอตที่จะรองรับ `Host` และ `Crawl-delay`
