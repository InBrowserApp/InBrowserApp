## Chuyển đổi tệp lưu trữ web đã lưu ngay trên thiết bị

Mở tệp lưu trữ `.mhtml` hoặc `.mht` trên thiết bị, kiểm tra trang chính đã chuyển đổi và tải xuống tệp HTML UTF-8 độc lập. Các tài nguyên đi kèm được giữ trong tệp để tệp có thể mở ngoại tuyến. Để đọc tệp lưu trữ đã khôi phục hoặc chưa hoàn chỉnh, hãy dùng [Trình xem MHTML](../mhtml-viewer/).

## Kết quả và khả năng tương thích

Các tham chiếu content-location và content-ID được hỗ trợ được xử lý trong tệp lưu trữ. Văn bản, định dạng cơ bản, bảng, liên kết, hình ảnh raster đi kèm và kiểu định dạng được hỗ trợ được giữ lại trong một tài liệu tĩnh dễ đọc. Văn bản vẫn có thể chọn được. Dấu trang nội bộ vẫn nằm trong tài liệu và liên kết bên ngoài chỉ mở khi bạn chọn. Thu phóng bản xem trước không làm thay đổi tệp tải xuống. Phông chữ và bố cục phức tạp có thể khác trang đã lưu ban đầu.

Tập lệnh, biểu mẫu, chuyển hướng, ứng dụng nhúng, SVG và MathML bị bỏ qua. Phiên truy cập trang web và các tính năng tương tác không được khôi phục. Tệp lưu trữ chưa hoàn chỉnh, bảng mã văn bản không được hỗ trợ, các trang bổ sung và tài nguyên bị thiếu sẽ khiến việc chuyển đổi dừng lại, không có tệp chưa hoàn chỉnh để tải xuống. Hình ảnh nhúng, bao gồm hình nền CSS, phải được giải mã thành công. Nếu chuyển đổi thất bại, hãy lưu riêng một bản đầy đủ của tài liệu chính. Thư email và tệp HTML thuần cần dùng công cụ tương ứng.

## Quyền riêng tư và tài nguyên trình duyệt

Tệp luôn ở trong trình duyệt này. Tài nguyên bị thiếu không bao giờ được tải từ máy tính của bạn hoặc trang web trực tuyến, và nội dung tệp không bao giờ được tải lên. HTML được tạo sẽ chặn tập lệnh và việc tải tài nguyên bên ngoài khi mở ngoại tuyến. Mở liên kết bên ngoài là một thao tác riêng có thể kết nối đến trang web đó. Bạn có thể hủy, đóng hoặc thay tệp lưu trữ. Không có giới hạn cố định về kích thước tệp hay số trang; tệp lưu trữ lớn phụ thuộc vào bộ nhớ trình duyệt còn trống và lỗi tài nguyên sẽ được báo khi phát hiện được.
