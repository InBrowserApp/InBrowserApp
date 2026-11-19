## Lấy mã 2FA từ khóa thiết lập hoặc mã QR

Mở phần cài đặt xác thực hai yếu tố trên trang web bạn muốn bảo vệ và chọn phương thức dùng ứng dụng xác thực. Tải ảnh mã QR của trang web lên hoặc quét mã. Bạn cũng có thể dán khóa thiết lập hoặc liên kết `otpauth://` rồi chọn **Thêm tài khoản**. Sao chép mã hiện tại vào ô xác minh trên trang web để hoàn tất thiết lập.

## Chuyển tài khoản từ ứng dụng xác thực khác

Trong Google Authenticator, chọn **Chuyển tài khoản** rồi xuất các tài khoản bạn muốn chuyển. Tại đây, chọn **Dùng camera** để quét mã QR đã xuất hoặc tải các ảnh mã QR đã lưu lên cùng lúc. Trong [trình xác thực InBrowser.App phiên bản cũ](https://authenticator.inbrowser.app/), mở **Export**, chọn **Google Authenticator**, tải ảnh mã QR xuống rồi tải ảnh lên đây.

Mã QR chuyển tài khoản từ Google được nhập với chu kỳ 30 giây. Để giữ chu kỳ tùy chỉnh từ công cụ cũ, hãy chuyển từng tài khoản. Nhấn biểu tượng bánh răng của mỗi tài khoản, mở **Key URI** trong **Config** rồi dán liên kết vào đây.

Tài khoản được lưu trong trình duyệt này. Hãy tải bản sao lưu bằng nút **Xuất tài khoản** trước khi xóa dữ liệu trang web hoặc chuyển sang trình duyệt khác. Giữ bản sao lưu ở nơi an toàn vì tệp chứa khóa thiết lập của bạn.

## Vì sao mã xác minh bị từ chối?

Hầu hết các trang web dùng mã dựa trên thời gian (TOTP). Hãy kiểm tra xem thiết bị đã bật chế độ đặt giờ tự động chưa. Nếu mã sắp hết hạn, hãy đợi mã mới. Mã dựa trên bộ đếm (HOTP) giữ nguyên cho tới khi bạn chọn **Mã tiếp theo**. Với cả hai loại, hãy dùng mã của đúng tài khoản và đảm bảo các thông số khớp với trang web.
