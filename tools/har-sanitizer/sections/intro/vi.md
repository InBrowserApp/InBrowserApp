## Cách làm sạch tệp HAR

Tệp HAR (HTTP Archive) ghi lại các yêu cầu và phản hồi mạng của trình duyệt. Tệp có thể chứa cookie phiên, mã thông báo ủy quyền, URL và nội dung mang thông tin riêng tư. Công cụ này tạo một bản đã làm sạch để gửi cho bộ phận hỗ trợ, đính kèm báo cáo lỗi hoặc chia sẻ với đồng nghiệp, đồng thời giữ phương thức, mã trạng thái và thông tin thời gian của từng yêu cầu.

1. Mở công cụ dành cho nhà phát triển trong trình duyệt và chọn thẻ **Network**. Tái hiện sự cố rồi xuất nhật ký dưới dạng tệp HAR. Trong Chrome, chọn **Export HAR (sanitized)** để xuất bản đã xóa các tiêu đề xác thực chuẩn.
2. Mở tệp HAR đã xuất hoặc kéo thả tệp vào đây. Công cụ tạo bản sao ngay khi bạn chọn tệp. Dùng tệp mẫu để xem dữ liệu thay đổi như thế nào.
3. Xem lại số liệu rồi chọn **Tải bản HAR đã làm sạch**. Tệp mới có đuôi `.sanitized.har` và có thể nhập vào DevTools hoặc [Trình phân tích mạng HAR](/vi/tools/har-analyzer/). Toàn bộ quá trình xử lý diễn ra trong trình duyệt.

## Dữ liệu nào được xóa hoặc che?

Công cụ xóa cookie và các tiêu đề xác thực thông dụng như `Authorization` và `X-API-Key`. Theo mặc định, công cụ che giá trị tham số URL và xóa nội dung yêu cầu, phản hồi và thông điệp WebSocket đã ghi. Ví dụ, `?token=example&page=2` trở thành `?token=REDACTED&page=REDACTED` trong tệp đã xuất. Tên tham số vẫn được giữ lại để gỡ lỗi. Mỗi trường được thay đổi tính là một lần, kể cả khi cùng một giá trị xuất hiện trong nhiều trường.

Tắt tùy chọn tương ứng nếu cần giữ giá trị tham số hoặc nội dung gốc để tái hiện sự cố. Tên máy chủ, đường dẫn URL, các tiêu đề khác và siêu dữ liệu riêng của trình duyệt vẫn có thể chứa thông tin riêng tư. Kiểm tra các trường này trước khi chia sẻ tệp.
