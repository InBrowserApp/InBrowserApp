## Cách đọc tệp vùng DNS

Mở tệp DNS xuất theo định dạng BIND hoặc dán nội dung tệp. Tải ví dụ để xem bản ghi SOA, bản ghi địa chỉ IPv4 và IPv6, bản ghi thư điện tử và chuỗi TXT. Mỗi dòng hiển thị tên, lớp, loại bản ghi, thời gian lưu trong bộ nhớ đệm (TTL) tính bằng giây và dữ liệu bản ghi. Lọc theo tên, loại như MX hoặc một phần giá trị, rồi sao chép các bản ghi đang hiển thị dưới dạng JSON để kiểm kê hoặc chuyển sang hệ thống khác.

## Cách xử lý tên miền gốc, TTL và dữ liệu bản ghi

Khi $ORIGIN là `example.com.`, tên tương đối ‘www’ trở thành `www.example.com.` Tên @ chỉ tên miền gốc hiện tại, còn bản ghi thụt lề dùng lại tên của bản ghi trước đó. Nếu tệp không có $ORIGIN, hãy điền tên miền của vùng vào ô Tên miền gốc ban đầu. $TTL mặc định là 1h tương ứng với 3.600 giây. Nếu bản ghi có TTL riêng, công cụ dùng giá trị đó. Dấu ngoặc kép, ký tự thoát và tên đích tương đối trong dữ liệu đều được giữ nguyên. Ví dụ, “hello; world” vẫn là một giá trị TXT và ‘mail’ trong dữ liệu MX vẫn được hiển thị là ‘mail’.

## Kết quả phân tích cho biết gì?

Công cụ đọc được chú thích, văn bản trong dấu ngoặc kép và bản ghi nhiều dòng. Ghi chú cho biết số dòng có vấn đề, đồng thời vẫn hiển thị các bản ghi đọc được. Nếu vùng sử dụng $INCLUDE hoặc $GENERATE, hãy khai triển các chỉ thị đó rồi dán toàn bộ bản ghi. Công cụ xử lý dữ liệu ngay trong trình duyệt mà không gửi truy vấn đến máy chủ DNS hoặc kiểm tra nhà cung cấp cụ thể có nạp được tệp vùng hay không.
