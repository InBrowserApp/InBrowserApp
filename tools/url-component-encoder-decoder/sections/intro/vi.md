## Mã hóa URL là gì?

Mã hóa URL (còn gọi là mã hóa phần trăm) là một phương thức chuyển đổi các ký tự đặc biệt thành định dạng có thể được truyền an toàn qua internet. URL chỉ có thể chứa một số ký tự nhất định, vì vậy bất kỳ ký tự nào không được phép đều phải được mã hóa.

**Cách hoạt động:**

- Các ký tự đặc biệt được chuyển đổi thành `%` theo sau là mã ASCII thập lục phân của chúng
- Ví dụ: dấu cách trở thành `%20`, `@` trở thành `%40`
- Chỉ các chữ cái (A-Z, a-z), số (0-9) và một số ký hiệu (- \_ . ~) không cần mã hóa

**Ví dụ phổ biến:**

- Dấu cách → `%20`
- `@` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Tại sao cần thiết:**

- URL có các ký tự dành riêng với ý nghĩa đặc biệt
- Đảm bảo dữ liệu được truyền chính xác
- Ngăn chặn xung đột với cấu trúc URL
- Bắt buộc cho biểu mẫu web và lời gọi API
