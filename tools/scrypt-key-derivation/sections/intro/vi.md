## scrypt là gì?

scrypt là một hàm suy xuất khóa dựa trên mật khẩu (KDF) yêu cầu nhiều bộ nhớ. Nó biến mật khẩu và muối thành các byte khóa xác định, đồng thời cố ý tiêu tốn thời gian CPU và bộ nhớ, khiến việc đoán mật khẩu quy mô lớn tốn kém hơn so với băm đơn giản.

**Điểm chính:**

- Dùng `N` (hệ số chi phí), `r` (kích thước khối) và `p` (mức song song)
- Thiết lập `N` và `r` cao hơn sẽ tăng chi phí bộ nhớ và tính toán
- Chỉ tạo cùng một khóa suy xuất khi mật khẩu, muối, tham số và độ dài đầu ra khớp nhau

**Thực hành tốt:**

- Dùng một muối ngẫu nhiên duy nhất cho mỗi mật khẩu hoặc bí mật
- Lưu `N`, `r`, `p`, định dạng muối và độ dài đầu ra cạnh khóa suy xuất
- Tinh chỉnh tham số trên thiết bị chậm nhất bạn cần hỗ trợ trước khi dùng trong sản xuất
