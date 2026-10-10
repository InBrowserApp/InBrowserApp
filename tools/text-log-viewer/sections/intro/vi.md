## Đọc văn bản và nhật ký trên thiết bị

Mở tệp .txt, .text hoặc .log để đọc với số dòng, cỡ chữ có thể điều chỉnh, tùy chọn ngắt dòng và chế độ đọc tập trung. Chuyển đến một dòng, đến đầu hoặc cuối tệp, hoặc dùng Tìm văn bản để tìm trong toàn bộ tệp. Tìm kiếm nguyên văn và phân biệt chữ hoa, chữ thường; tìm kết quả sau và trước sẽ quay vòng trong tệp.

## Tệp lớn và dòng dài

Trình xem hiển thị từng phần để bạn vẫn dễ dàng đọc tệp lớn. Bạn có thể truy cập mọi phần, kể cả phần tiếp nối của các dòng rất dài. Việc chọn văn bản và lệnh Tìm của trình duyệt chỉ áp dụng cho phần hiện tại; chức năng Tìm văn bản của trình xem tìm trong toàn bộ tệp đã giải mã, kể cả kết quả nằm trên ranh giới giữa các phần. Không áp đặt giới hạn kích thước tệp hay số dòng. Bộ nhớ khả dụng của trình duyệt vẫn là giới hạn thực tế.

Các dòng trống, ký tự tab, kiểu kết thúc dòng CRLF/CR/LF hỗn hợp và văn bản Unicode được giữ nguyên. Ký tự kết thúc dòng được hiển thị thành ngắt dòng. Mã đánh dấu và chuỗi thoát của giao diện dòng lệnh vẫn là văn bản không được thực thi. Một số ký tự điều khiển không có hình dạng hiển thị; tệp chứa ký tự NUL sẽ có thông báo về tệp nhị phân.

## Chọn bảng mã phù hợp

Chế độ tự động nhận diện dấu thứ tự byte UTF-8 và UTF-16; nếu không có thì dùng UTF-8 nghiêm ngặt. Bạn có thể chọn UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030 hoặc Shift JIS. Lỗi giải mã sẽ dừng bản xem trước thay vì âm thầm thay thế các ký tự không đọc được. Hãy thử bảng mã khác nếu tệp không đọc được hoặc chữ bị lỗi; trình xem không thể xác định bảng mã gốc của mọi tệp.

Tệp được xử lý trên thiết bị của bạn, không tải lên, không dùng tài nguyên từ xa và không tự động lưu trữ. Đóng hoặc thay tệp sẽ giải phóng phiên đọc của tệp đó. Trình xem này không chỉnh sửa tệp, diễn giải HTML hay lệnh trên giao diện dòng lệnh, hoặc theo dõi nhật ký trực tiếp.
