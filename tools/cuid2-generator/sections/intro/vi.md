Tạo mã định danh CUID2 ngay trong trình duyệt mà không gửi lô hiện tại tới dịch vụ khác. Công cụ này hữu ích khi bạn cần các ID công khai gọn nhẹ cho bản ghi, URL, liên kết mời, dữ liệu thử nghiệm hoặc placeholder phía client và muốn kiểm soát trực tiếp cả số lượng lẫn độ dài.

## Điều Gì Làm CUID2 Khác Biệt

CUID2 được thiết kế để giảm va chạm trong các hệ thống phân tán mà vẫn thân thiện với URL. Mỗi giá trị bắt đầu bằng một chữ cái thường, chỉ dùng ký tự base36 viết thường, rồi kết hợp bộ đếm, dấu vân tay máy chủ và entropy ngẫu nhiên trước khi băm kết quả cuối cùng.

## Chọn Số Lượng Và Độ Dài

Hãy dùng đầu ra ngắn hơn khi bạn cần slug gọn cho bản demo, dữ liệu thử nghiệm hoặc liên kết tạm thời. Tăng độ dài khi bạn cần nhiều khoảng trống hơn cho bản ghi tồn tại lâu hoặc tải phân tán lớn hơn, và tăng số lượng khi muốn phát hành cả một lô trong một lần.

## Sao Chép Hoặc Xuất Lô Cuối Cùng

Xem lại danh sách đã tạo, rồi sao chép hoặc tải xuống dưới dạng tệp văn bản khi định dạng đã phù hợp. Vì mọi thứ chạy cục bộ, các mã định danh sẽ ở lại trong trình duyệt của bạn cho tới khi bạn quyết định sử dụng hoặc chia sẻ chúng.
