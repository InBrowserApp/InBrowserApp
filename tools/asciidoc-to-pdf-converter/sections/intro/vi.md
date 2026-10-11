## Chuyển đổi tài liệu AsciiDoc trên thiết bị

Mở tài liệu `.adoc` hoặc `.asciidoc` trên thiết bị, kiểm tra các trang đã tạo và tải xuống tệp PDF đang hiển thị trong bản xem trước. Công cụ tạo trực tiếp tệp PDF; không cần hộp thoại in. Hỗ trợ mã nguồn UTF-8 và UTF-16 có dấu thứ tự byte BOM. Để đọc mà không chuyển đổi, hãy dùng [Trình xem AsciiDoc](../asciidoc-viewer/).

## Kết quả in và mã nguồn được hỗ trợ

Tài liệu được kết xuất với giao diện in cố định trên các trang A4 hướng dọc có lề 18 mm, sau đó được chụp thành các trang hình ảnh ở độ phân giải 150 DPI. Các tiêu đề, mục, đoạn văn, danh sách, bảng, mã, khối lưu ý, dấu chú dẫn, chú thích cuối trang, dấu ngắt trang rõ ràng và hình ảnh raster nhúng được hỗ trợ đều được đưa vào. Bảng rộng và mã được dàn lại cho vừa chiều rộng trang. Không thể chọn văn bản trong PDF, và OCR cùng liên kết tương tác không được thêm vào. Phông chữ, khoảng cách và cách phân trang có thể khác các công cụ AsciiDoc khác. Hãy kiểm tra từng trang trước khi sử dụng kết quả.

Tệp chèn, tài nguyên hình ảnh hoặc kiểu định dạng bị thiếu, hình ảnh không đọc được, cảnh báo từ bộ phân tích và thuộc tính chưa được phân giải sẽ dừng chuyển đổi và không cho tải xuống bản chưa hoàn chỉnh. Trước tiên, hãy gộp nội dung nguồn cần thiết vào một tài liệu chứa sẵn mọi nội dung. Không hỗ trợ macro tùy chỉnh, sơ đồ, phần mở rộng, giao diện dự án và phông chữ nhúng; ký pháp không được hỗ trợ có thể vẫn hiển thị dưới dạng văn bản. Tập lệnh, biểu mẫu, ứng dụng nhúng, SVG và MathML bị bỏ qua. Nội dung có khả năng thực thi trong HTML được chèn nguyên dạng sẽ bị loại bỏ. Khổ giấy trong mã nguồn được thay bằng bố cục A4 cố định.

## Quyền riêng tư và tài nguyên trình duyệt

Tài liệu của bạn luôn ở trong trình duyệt này. Công cụ không tự tải các tệp nguồn, hình ảnh hay tài nguyên khác từ máy tính hoặc mạng, và không bao giờ tải nội dung tệp lên. Dữ liệu hình ảnh raster nhúng được đọc từ tài liệu đã chọn. Tệp lớn có thể tốn thời gian và bộ nhớ vì mỗi trang đều được kết xuất thành hình ảnh. Bạn có thể hủy, đóng hoặc thay tài liệu. Không có hạn mức cố định về kích thước tệp hay số trang; sự cố thực tế về tài nguyên trình duyệt sẽ hiển thị lỗi khi có thể phát hiện được.
