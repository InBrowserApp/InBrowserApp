## What It Does

ถอดรหัสส่วนหัว HTTP Basic Authorization เพื่อดึงชื่อผู้ใช้และรหัสผ่านจาก Base64 มีประโยชน์สำหรับการดีบักและการทดสอบ API.

## Accepted Input

วางข้อความเช่น: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
