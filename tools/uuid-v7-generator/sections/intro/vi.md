UUID v7 là một định dạng UUID hiện đại đặt dấu thời gian Unix tính bằng mili giây ở đầu mã định danh và lấp đầy các bit còn lại bằng dữ liệu ngẫu nhiên. Nhờ vậy, trên thực tế các giá trị có tính duy nhất toàn cục, đồng thời vẫn có thể sắp xếp tự nhiên theo thời điểm tạo.

## Công Cụ Này Dùng Để Làm Gì

Trình tạo này tạo các giá trị UUID v7 hoàn toàn trong trình duyệt của bạn. Bạn có thể tạo một mã định danh duy nhất hoặc một lô tối đa 100 mã, sau đó sao chép danh sách hoặc tải xuống dưới dạng tệp văn bản để dùng cho dữ liệu seed, bản ghi cơ sở dữ liệu, fixture sự kiện hoặc payload kiểm thử.

## Khi UUID v7 Hữu Ích

UUID v7 hữu ích khi bạn muốn các mã định danh mờ vẫn sắp xếp tốt trong cơ sở dữ liệu, log, hàng đợi và luồng sự kiện phân tán. So với các giá trị UUID v4 ngẫu nhiên, UUID v7 giảm xáo trộn chỉ mục vì các bản ghi mới hơn thường xuất hiện gần cuối không gian khóa đã sắp xếp.

## Lưu Ý Về Khả Năng Sắp Xếp Và An Toàn

Phần dấu thời gian ghi lại mili giây, không phải giá trị riêng tư hay bí mật. Nếu một mã định danh không nên tiết lộ thời điểm tạo xấp xỉ, hãy dùng một định dạng hoàn toàn ngẫu nhiên thay thế. Trong một lô được tạo, công cụ này giữ các giá trị tăng đơn điệu trong cùng một mili giây, đồng thời vẫn bảo toàn các bit phiên bản và biến thể của UUID v7.
