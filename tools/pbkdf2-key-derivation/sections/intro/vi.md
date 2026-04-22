## PBKDF2 là gì?

PBKDF2 (Password-Based Key Derivation Function 2) suy xuất khóa mật mã từ mật khẩu bằng muối và nhiều vòng lặp. Nó làm chậm tấn công brute‑force và tạo khóa khác nhau khi muối thay đổi.

**Điểm chính:**

- Dùng HMAC với hàm băm đã chọn (SHA-1/SHA-256, v.v.)
- Nhiều vòng lặp hơn làm tăng chi phí tính toán
- Độ dài đầu ra có thể cấu hình

**Thực hành tốt:**

- Dùng muối ngẫu nhiên, duy nhất
- Tăng số vòng lặp trong phạm vi hiệu năng chấp nhận được
- Với hệ thống mới, cân nhắc Argon2 hoặc scrypt
