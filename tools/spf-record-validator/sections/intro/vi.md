## Cách kiểm tra bản ghi SPF

Dán giá trị của một bản ghi DNS loại TXT, bắt đầu bằng `v=spf1`, rồi chọn Kiểm tra cú pháp. Nếu DNS hiển thị giá trị TXT dưới dạng nhiều chuỗi trong dấu ngoặc kép, hãy nối các chuỗi theo thứ tự và giữ nguyên dấu cách bên trong từng chuỗi. Công cụ liệt kê từng cơ chế và tham số điều chỉnh, đồng thời đánh dấu lỗi ngay cạnh đoạn cần sửa. Nội dung bạn nhập được giữ trong trình duyệt.

## Cơ chế và tiền tố kết quả trong SPF

SPF (Sender Policy Framework) cho phép một tên miền chỉ rõ những máy chủ được gửi thư thay mặt mình. Máy chủ nhận kiểm tra các cơ chế theo thứ tự. Ví dụ, bản ghi `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` kiểm tra một khối IPv4 và chính sách SPF của nhà cung cấp trước khi đến `-all`. Tiền tố của cơ chế chỉ định kết quả pass (`+`), fail (`-`), softfail (`~`) hoặc neutral (`?`). Tiền tố mặc định là `+`. Tham số điều chỉnh như `redirect=` dùng dấu bằng và không có tiền tố kết quả.

## Cách hiểu số mục phát sinh truy vấn DNS

RFC 7208 cho phép tối đa 10 mục phát sinh truy vấn DNS trong quá trình đánh giá SPF. Con số ở đây bao gồm những mục có thể phát sinh truy vấn trong bản ghi đã dán, như `a`, `mx`, `include`, `exists`, `ptr` và `redirect` đang có hiệu lực. `include` hoặc `redirect` có thể dẫn đến nhiều mục khác, còn một cơ chế khớp có thể kết thúc đánh giá sớm. Để xác nhận chính sách SPF đang dùng và đếm đầy đủ các mục, hãy kiểm tra bản ghi TXT đã công bố cùng các tên miền được tham chiếu.
