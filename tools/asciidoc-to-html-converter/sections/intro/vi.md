## Chuyển đổi AsciiDoc trên thiết bị

Mở tệp `.adoc` hoặc `.asciidoc` trên thiết bị, kiểm tra tài liệu đã kết xuất và tải xuống tệp HTML UTF-8 độc lập. Tệp mở được ngoại tuyến và vẫn cho phép chọn văn bản. Để xem lại cảnh báo trong mã nguồn hoặc tệp chèn không có sẵn trước khi chuyển đổi, hãy dùng [Trình xem AsciiDoc](../asciidoc-viewer/).

## Kết quả và khả năng tương thích

Tiêu đề, danh sách, bảng, khối mã, lưu ý, trích dẫn, chú thích cuối trang, liên kết và hình ảnh raster nhúng được hỗ trợ đều được giữ lại với giao diện đọc cố định. Dấu trang nội bộ và chú thích cuối trang vẫn nằm trong tài liệu; liên kết bên ngoài chỉ mở khi bạn chọn. Mã và bảng rộng có thể cuộn ngang. Thu phóng bản xem trước không làm thay đổi tệp tải xuống. Phông chữ và khoảng cách có thể khác các công cụ AsciiDoc khác.

Hãy dùng mã nguồn chứa sẵn mọi nội dung ở dạng UTF-8 hoặc UTF-16 có dấu thứ tự byte BOM. Tệp chèn và tài nguyên hình ảnh hoặc kiểu định dạng bên ngoài không được tải. Tệp chèn không có sẵn, cảnh báo từ bộ phân tích, thuộc tính chưa được phân giải và tài nguyên bị thiếu hoặc không đọc được sẽ dừng việc xuất tệp, không có bản chưa hoàn chỉnh để tải xuống. Hình ảnh nhúng, bao gồm hình nền CSS, phải được giải mã thành công. Không hỗ trợ macro tùy chỉnh, sơ đồ, phần mở rộng và phông chữ nhúng. Tập lệnh, biểu mẫu, ứng dụng nhúng, SVG và MathML bị bỏ qua. Cú pháp mã nguồn không được hỗ trợ có thể vẫn hiển thị dưới dạng văn bản thông thường.

## Quyền riêng tư và tài nguyên trình duyệt

Tệp luôn ở trong trình duyệt này. Tài nguyên bị thiếu không bao giờ được tải từ máy tính của bạn hoặc một trang web, và nội dung tệp không bao giờ được tải lên. HTML được tạo sẽ chặn tập lệnh và việc tự động tải tài nguyên bên ngoài. Mở liên kết bên ngoài là một thao tác riêng có thể kết nối đến trang web đó. Bạn có thể hủy, đóng hoặc thay tài liệu nguồn. Không có giới hạn cố định về kích thước tệp hay số trang; tài liệu lớn phụ thuộc vào bộ nhớ trình duyệt còn trống và lỗi tài nguyên sẽ được báo khi phát hiện được.
