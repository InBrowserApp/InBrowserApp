## Argon2 là gì?

Argon2 là thuật toán băm mật khẩu được thiết kế để khiến việc dò mật khẩu ngoại tuyến trở nên tốn kém. Thuật toán này kết hợp tính toán lặp lại với chi phí bộ nhớ có thể cấu hình, vì vậy kẻ tấn công cần cả thời gian và bộ nhớ cho từng lần đoán mật khẩu.

**Vì sao Argon2id thường là lựa chọn mặc định:**

- Thuật toán này cân bằng khả năng chống tấn công kênh bên và chống dò bằng GPU tốt hơn so với việc dùng Argon2i hoặc Argon2d cho hầu hết hệ thống lưu trữ mật khẩu
- Đầu ra đã mã hóa lưu thuật toán, phiên bản, bộ nhớ, số vòng lặp, mức song song, salt và mã băm trong một chuỗi duy nhất dùng được ở nhiều môi trường
- Salt ngẫu nhiên duy nhất ngăn các mật khẩu giống nhau tạo ra các mã băm đã lưu giống nhau
- Có thể tăng thiết lập bộ nhớ và số vòng lặp khi môi trường xác minh của bạn trở nên nhanh hơn

**Cách dùng công cụ này:**

1. Nhập mật khẩu bạn muốn băm.
2. Giữ salt đã tạo hoặc tạo một salt ngẫu nhiên mới.
3. Chọn biến thể Argon2 và điều chỉnh bộ nhớ, số vòng lặp, mức song song và độ dài mã băm cho hệ thống sẽ xác minh mã băm.
4. Tạo chuỗi băm đã mã hóa và lưu toàn bộ chuỗi đó trong cơ sở dữ liệu ứng dụng của bạn.

**Lưu ý bảo mật:**

- Không lưu hoặc ghi nhật ký mật khẩu dạng rõ.
- Dùng một salt ngẫu nhiên mới cho mỗi mật khẩu.
- Chỉ dùng secret tùy chọn nếu bộ xác minh của bạn cũng có cùng secret đó; nếu không, mã băm sẽ không thể được xác minh về sau.
- Ưu tiên thiết lập bộ nhớ và số vòng lặp cao nhất vẫn giữ độ trễ đăng nhập chấp nhận được cho người dùng thực tế.
