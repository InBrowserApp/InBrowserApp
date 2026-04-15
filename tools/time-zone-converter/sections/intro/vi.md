## Công cụ này dùng để làm gì?

Dùng công cụ này để chuyển ngày giờ cục bộ trong một múi giờ IANA sang thời gian cục bộ tương ứng ở một múi giờ khác. Nó hữu ích khi bạn cần so sánh lịch giữa nhiều thành phố mà không phải tự cộng offset hay đoán xem daylight saving time có đang áp dụng hay không.

## Các trường hợp dùng phổ biến

- Kiểm tra xem một cuộc họp ở Tokyo có rơi vào cùng ngày lịch tại New York hoặc London hay không.
- Xác minh offset trước khi công bố lịch, cảnh báo hoặc giờ hỗ trợ.
- Sao chép giá trị ISO 8601, UTC hoặc Unix timestamp tương ứng cho log và API.

## Công cụ chuyển đổi này hoạt động như thế nào?

- Nhập ngày giờ cục bộ theo định dạng `YYYY-MM-DD HH:mm:ss.SSS` ở một trong hai bên, rồi chọn múi giờ nguồn và múi giờ đích.
- Bên bạn chỉnh sửa gần nhất sẽ là mốc chuẩn. Công cụ sẽ chuyển thời điểm đó sang UTC ở nội bộ, rồi hiển thị thời gian cục bộ tương ứng ở múi giờ còn lại.
- Dùng `Now` để điền nhanh thời gian hiện tại, hoặc `Swap` để đảo chiều so sánh. Offset có thể thay đổi quanh các lần chuyển daylight saving time.
