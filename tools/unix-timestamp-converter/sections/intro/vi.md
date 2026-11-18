## Chuyển dấu thời gian Unix thành ngày giờ

Dán dấu thời gian để xem ngày giờ theo múi giờ của thiết bị, UTC và ISO 8601, cùng khoảng thời gian từ hiện tại đến mốc đó. Ví dụ, `1704067200` giây và `1704067200000` mili giây đều cho kết quả ISO 8601 là `2024-01-01T00:00:00.000Z`.

## Chuyển ngày giờ thành dấu thời gian Unix

Chỉnh ô **Ngày và Giờ** để đổi ngày giờ địa phương sang dấu thời gian Unix theo đơn vị đã chọn. Nhấp **Bây giờ** để lấy dấu thời gian hiện tại. Với nhật ký và API, hãy dùng giá trị ISO 8601 kết thúc bằng `Z` khi cần ghi rõ thời gian theo UTC.

## Chọn giây, mili giây hoặc nano giây

Dấu thời gian Unix đo thời gian kể từ 00:00:00 UTC ngày 1 tháng 1 năm 1970. Chế độ **Tự động** dùng đơn vị giây cho giá trị có tối đa 10 chữ số, mili giây cho 11 đến 13 chữ số và nano giây cho giá trị dài hơn. Hãy chọn đơn vị thủ công nếu bạn biết định dạng gốc, nhất là với dấu thời gian cũ tính bằng mili giây hoặc khi ngày hiển thị có vẻ sai. Ngày giờ hiển thị chính xác đến mili giây.
