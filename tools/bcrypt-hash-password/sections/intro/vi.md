## bcrypt là gì?

bcrypt là thuật toán hash mật khẩu được thiết kế để lưu trữ mật khẩu. Nó kết hợp mật khẩu với một salt ngẫu nhiên và lặp lại công việc tốn tài nguyên dựa trên hệ số cost, vì vậy kẻ tấn công cần nhiều thời gian hơn để thử từng lần đoán.

## Khi nào nên dùng công cụ này

- Tạo hash bcrypt cho tài khoản thử nghiệm, seed script hoặc môi trường phát triển cục bộ.
- So sánh cách các hệ số cost khác nhau thay đổi định dạng đầu ra và thời gian chạy.
- Tạo hash sẵn sàng sao chép mà không gửi mật khẩu đến máy chủ.

## Cách chọn hệ số cost

Giá trị cost cao hơn chậm hơn và thường an toàn hơn, nhưng chúng cũng làm mọi lần đăng nhập vào ứng dụng của bạn chậm hơn. Cost khoảng 10-12 là phổ biến cho các hệ thống tương tác; giá trị cao hơn có thể hợp lý cho quy trình chỉ dành cho quản trị viên hoặc lưu lượng thấp. Hãy kiểm thử cost trên cùng loại phần cứng sẽ xác minh mật khẩu.

## Những điều cần lưu ý

- Mỗi hash được tạo đều dùng một salt ngẫu nhiên mới, nên đầu ra thay đổi ngay cả khi mật khẩu và cost giữ nguyên.
- Lưu hash bcrypt, không lưu mật khẩu gốc.
- Dùng bcrypt cho mật khẩu, không dùng cho checksum tệp, chữ ký hoặc hash nói chung.
- Giữ hành vi xác minh nhất quán và tránh tiết lộ liệu tài khoản người dùng có tồn tại hay không.
