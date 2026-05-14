Giải mã AES khôi phục bản rõ từ dữ liệu được mã hóa bằng cùng vật liệu khóa AES. Công cụ này được thiết kế cho phong bì JSON do Trình mã hóa AES của InBrowser.App tạo ra. Phong bì giữ thuật toán, thiết lập dẫn xuất khóa, salt, IV, bản mã và siêu dữ liệu bản rõ cùng nhau, trong khi mật khẩu hoặc khóa thô được giữ riêng.

Mọi xử lý diễn ra cục bộ bằng Web Crypto API của trình duyệt. JSON đã mã hóa, mật khẩu, khóa thô và kết quả giải mã không được tải lên.

## Khi nào nên dùng công cụ này

Dùng công cụ này khi ai đó cung cấp cho bạn phong bì JSON `inbrowser-aes-v1` hoặc khi bạn cần khôi phục ghi chú, token, đoạn cấu hình hoặc tệp đã mã hóa trước đó bằng trang Trình mã hóa AES tương ứng.

Nếu phong bì được tạo bằng mật khẩu, hãy nhập cùng mật khẩu đó và công cụ sẽ dùng lại hàm băm PBKDF2, số vòng lặp, salt, chế độ AES và độ dài khóa đã lưu. Nếu phong bì được tạo bằng khóa thô, hãy dán đúng khóa thập lục phân có độ dài được ghi trong phong bì.

## Ghi chú thực tế

AES-GCM xác thực dữ liệu đã mã hóa, nên khóa sai hoặc JSON bị thay đổi sẽ thất bại thay vì trả về bản rõ đã bị sửa đổi. AES-CBC và AES-CTR có thể giải mã các phong bì tương thích, nhưng bản thân chúng không xác thực bản mã.

Giữ mật khẩu hoặc khóa thô tách biệt khỏi phong bì JSON. Bất kỳ ai có cả phong bì và vật liệu khóa đều có thể khôi phục bản rõ. Với phong bì tệp, bản tải xuống được khôi phục sẽ dùng tên tệp gốc và kiểu phương tiện được lưu trong JSON.
