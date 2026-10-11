## Chuyển đổi văn bản có định dạng ngay trên thiết bị

Mở tài liệu `.rtf` trên thiết bị, chuyển sang PDF, kiểm tra các trang kết quả và tải xuống đúng tệp PDF được hiển thị trong bản xem trước. Để đọc mà không chuyển đổi, hãy dùng [Trình xem RTF](../rtf-viewer/).

## Hình thức và khả năng tương thích của PDF

Bộ chuyển đổi kết xuất kích thước trang, hướng trang, đầu trang, chân trang, ngắt trang, bảng và hình ảnh PNG/JPEG nhúng được hỗ trợ. Bạn vẫn có thể chọn văn bản được hỗ trợ. Các bảng mã ký tự RTF gốc và chuỗi thoát Unicode được chuyển đến bộ chuyển đổi; văn bản được quét không được bổ sung OCR. Phông chữ bị thiếu sẽ được thay bằng phông chữ đi kèm, nên cách ngắt dòng, khoảng cách và phân trang có thể thay đổi. Bố cục phức tạp có thể khác với ứng dụng gốc. Hãy kiểm tra từng trang trước khi sử dụng PDF làm bản tham chiếu.

PDF là bản xuất tĩnh. Các điều khiển biểu mẫu có hình thức như khi in. Nhận xét, macro và chữ ký số không được giữ lại hoặc xác minh. Đối tượng nhúng, tài nguyên tài liệu bên ngoài, định dạng hình ảnh và chỉ thị trường không được hỗ trợ sẽ bị từ chối. Tệp bị hỏng hoặc không đọc được sẽ báo lỗi mà không cung cấp bản tải xuống chưa hoàn chỉnh. Đổi phần mở rộng không làm thay đổi định dạng thực tế của tệp.

## Quyền riêng tư và tài nguyên trình duyệt

Quá trình chuyển đổi diễn ra trên thiết bị của bạn. Lần chuyển đổi đầu tiên tải xuống khoảng 90 MB tệp của bộ chuyển đổi và phông chữ; trình duyệt có thể lưu các tệp này vào bộ nhớ đệm; bản thân tài liệu không bao giờ được tải lên. Bộ chuyển đổi chỉ được tải sau khi bạn chọn tệp. Cần dùng trình duyệt ở phiên bản mới có hỗ trợ WebAssembly và bộ nhớ dùng chung. Tài liệu lớn hoặc phức tạp có thể tốn thời gian và bộ nhớ. Bạn có thể hủy, đóng hoặc thay tệp. Không có hạn mức cố định về kích thước tệp hay số trang.
